import React, { useState } from 'react';
import { Play, RotateCcw, Settings, Star, ThumbsUp } from 'lucide-react';
import { fetchMoviesByGenre } from './tmdbApi';
import { parseLetterboxdCSV, analyzeUserTaste } from './letterboxdApi';
// ========================================
// HYBRID SCORING SYSTEM
// ========================================
// DESIGN: Each mood answer gives Primary(5) + Secondary(2) + Tertiary(1) points to different genres
// BENEFIT: Prevents point inflation, easy to tune, future-proof for question rotation

// TMDB Genre IDs (verified)
const TMDB_GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  COMEDY: 35,
  CRIME: 80,
  DRAMA: 18,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37
};

// Hybrid Scoring Configuration - Easy to Tweak
const SCORING_WEIGHTS = {
  aesthetic: { primary: 5, secondary: 2, tertiary: 1 },
  energy: { primary: 4, secondary: 2, tertiary: 1 },
  character: { primary: 6, secondary: 2, tertiary: 0 }, // Character gets more weight
  era: { primary: 3, secondary: 2, tertiary: 1 },      // Era gets less weight
  mood: { primary: 5, secondary: 2, tertiary: 1 },
  discovery: { primary: 2, secondary: 1, tertiary: 0 }  // Discovery is modifier, not core
};

// Mood Answer → Genre Points Mapping
const MOOD_SCORING = {
  aesthetic: {
    neon: {
      primary: TMDB_GENRES.SCIENCE_FICTION,   // +5 pts
      secondary: TMDB_GENRES.ACTION,          // +2 pts  
      tertiary: TMDB_GENRES.THRILLER          // +1 pt
    },
    earth: {
      primary: TMDB_GENRES.DRAMA,             // +5 pts
      secondary: TMDB_GENRES.WESTERN,         // +2 pts
      tertiary: TMDB_GENRES.HISTORY           // +1 pt
    }
  },

  energy: {
    spring: {
      primary: TMDB_GENRES.ACTION,            // +4 pts
      secondary: TMDB_GENRES.THRILLER,        // +2 pts
      tertiary: TMDB_GENRES.ADVENTURE         // +1 pt
    },
    river: {
      primary: TMDB_GENRES.DRAMA,             // +4 pts
      secondary: TMDB_GENRES.ROMANCE,         // +2 pts
      tertiary: TMDB_GENRES.FANTASY           // +1 pt
    }
  },

  character: {
    struggle: {
      primary: TMDB_GENRES.DRAMA,             // +6 pts (high weight)
      secondary: TMDB_GENRES.MYSTERY,         // +2 pts
      tertiary: null                          // +0 pts
    },
    triumph: {
      primary: TMDB_GENRES.ACTION,            // +6 pts
      secondary: TMDB_GENRES.ADVENTURE,       // +2 pts  
      tertiary: null                          // +0 pts
    }
  },

  era: {
    seventies: {
      primary: TMDB_GENRES.CRIME,             // +3 pts
      secondary: TMDB_GENRES.THRILLER,        // +2 pts
      tertiary: TMDB_GENRES.DRAMA             // +1 pt
    },
    eighties: {
      primary: TMDB_GENRES.ACTION,            // +3 pts
      secondary: TMDB_GENRES.SCIENCE_FICTION, // +2 pts
      tertiary: TMDB_GENRES.COMEDY            // +1 pt
    }
  },

  mood: {
    puzzle: {
      primary: TMDB_GENRES.MYSTERY,           // +5 pts
      secondary: TMDB_GENRES.THRILLER,        // +2 pts
      tertiary: TMDB_GENRES.CRIME             // +1 pt
    },
    escape: {
      primary: TMDB_GENRES.FANTASY,           // +5 pts
      secondary: TMDB_GENRES.ADVENTURE,       // +2 pts
      tertiary: TMDB_GENRES.SCIENCE_FICTION   // +1 pt
    }
  },

  discovery: {
    new: {
      primary: null,                          // Discovery doesn't add genre points
      secondary: null,                        // Instead it modifies year/popularity
      tertiary: null,
      modifier: { yearMin: 2019, yearMax: 2024, popularity: 'mixed' }
    },
    comfort: {
      primary: null,
      secondary: null,
      tertiary: null,
      modifier: { yearMin: 1970, yearMax: 2015, popularity: 'high' }
    }
  }
};

// ========================================
// MAIN SCORING FUNCTION
// ========================================
const calculateMoodScore = (moodAnswers) => {
  console.log('🧮 Calculating mood scores for:', moodAnswers);
  
  const genreScores = {};
  let modifiers = {};

  // Process each mood answer
  Object.entries(moodAnswers).forEach(([questionType, answer]) => {
    const scoring = MOOD_SCORING[questionType]?.[answer];
    const weights = SCORING_WEIGHTS[questionType];
    
    if (!scoring || !weights) {
      console.log(`⚠️ Missing scoring for ${questionType}:${answer}`);
      return;
    }

    // Add genre points
    if (scoring.primary) {
      genreScores[scoring.primary] = (genreScores[scoring.primary] || 0) + weights.primary;
    }
    if (scoring.secondary) {
      genreScores[scoring.secondary] = (genreScores[scoring.secondary] || 0) + weights.secondary;
    }
    if (scoring.tertiary) {
      genreScores[scoring.tertiary] = (genreScores[scoring.tertiary] || 0) + weights.tertiary;
    }

    // Handle modifiers (year ranges, popularity)
    if (scoring.modifier) {
      modifiers = { ...modifiers, ...scoring.modifier };
    }
  });

  // Sort genres by score
  const rankedGenres = Object.entries(genreScores)
    .sort(([,a], [,b]) => b - a)
    .map(([genre, score]) => ({ 
      id: parseInt(genre), 
      score: score,
      name: Object.keys(TMDB_GENRES).find(key => TMDB_GENRES[key] === parseInt(genre))
    }));

  console.log('🏆 Final genre scores:', rankedGenres);
  console.log('⚙️ Modifiers:', modifiers);

  return {
    topGenres: rankedGenres.slice(0, 3), // Top 3 scoring genres
    modifiers: modifiers,
    primaryGenre: rankedGenres[0]?.id || TMDB_GENRES.ACTION
  };
};

// ========================================
// INTEGRATION READY FUNCTION
// ========================================
// This replaces the TMDB API call in generateRecommendations
const getMoodBasedMovies = async (moodAnswers) => {
  const moodScore = calculateMoodScore(moodAnswers);
  
  try {
    // Try top scoring genre first
    let movies = await fetchMoviesByGenre(moodScore.primaryGenre);
    
    // Fallback to second highest scoring genre
    if (!movies || movies.length < 3) {
      const secondGenre = moodScore.topGenres[1]?.id;
      if (secondGenre) {
        movies = await fetchMoviesByGenre(secondGenre);
      }
    }
    
    return {
      movies: movies,
      context: {
        chosenGenre: moodScore.topGenres[0]?.name || 'Action',
        allScores: moodScore.topGenres,
        modifiers: moodScore.modifiers
      }
    };
  } catch (error) {
    console.log('🚨 Mood-based API call failed:', error);
    return null; // Let existing fallbacks handle this
  }
};
// ========================================
// MODULAR PLATFORM FILTERING SYSTEM
// ========================================
// DESIGN: Post-processing filters that can stack/combine
// BENEFIT: Easy to add new filter types without breaking existing code

// Platform availability mapping (simplified for now - can be enhanced later)
const PLATFORM_MAPPING = {
  // Map your platform names to common ways they appear in movie data
  'Netflix': ['netflix', 'Netflix'],
  'Prime': ['amazon prime', 'prime video', 'amazon', 'prime'],
  'Hulu': ['hulu', 'Hulu'],
  'Disney+': ['disney+', 'disney plus', 'disney', 'Disney+'],
  'Criterion': ['criterion', 'criterion channel', 'Criterion'],
  'Tubi': ['tubi', 'Tubi']
};

// ========================================
// FILTER: PLATFORM AVAILABILITY
// ========================================
const filterByPlatforms = (movies, selectedPlatforms) => {
  console.log('🎬 Filtering by platforms:', selectedPlatforms);
  
  if (!selectedPlatforms || selectedPlatforms.length === 0) {
    console.log('⚠️ No platforms selected, returning all movies');
    return movies;
  }

  // For now, assign random platforms to movies (since TMDB doesn't have reliable platform data)
  // TODO: Replace with real platform API data when available
  const availablePlatforms = ['Netflix', 'Prime', 'Hulu', 'Disney+', 'Criterion', 'Tubi'];
  
  const filteredMovies = movies.map(movie => {
    // Randomly assign 1-2 platforms per movie for testing
    const randomPlatforms = availablePlatforms
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.random() > 0.5 ? 1 : 2);
    
    return {
      ...movie,
      availablePlatforms: randomPlatforms,
      // Check if movie is on any of user's platforms
      isAvailable: randomPlatforms.some(platform => selectedPlatforms.includes(platform))
    };
  });

  // Return only movies available on user's platforms
  const availableMovies = filteredMovies.filter(movie => movie.isAvailable);
  
  console.log(`📺 Platform filtering: ${movies.length} → ${availableMovies.length} movies`);
  
  // If not enough movies after filtering, include some unavailable ones as backup
  if (availableMovies.length < 5) {
    console.log('⚠️ Not enough platform matches, adding backup movies');
    const backupMovies = filteredMovies.filter(movie => !movie.isAvailable).slice(0, 3);
    return [...availableMovies, ...backupMovies];
  }
  
  return availableMovies;
};

// ========================================
// FUTURE FILTER: LETTERBOXD WATCHED MOVIES
// ========================================
// Ready for when we add Letterboxd integration
const filterByWatchedMovies = (movies, letterboxdData, allowRewatches = false) => {
  if (!letterboxdData || allowRewatches) {
    return movies;
  }
  
  const watchedTitles = letterboxdData.movies.map(m => m.title.toLowerCase());
  return movies.filter(movie => 
    !watchedTitles.includes(movie.title.toLowerCase())
  );
};

// ========================================
// MASTER FILTER FUNCTION
// ========================================
// This combines all filters and can be easily extended
const applyAllFilters = (movies, userPrefs, allowRewatches = false) => {
  console.log('🔍 Applying filters to', movies.length, 'movies');
  
  let filteredMovies = movies;
  
  // Filter 1: Platform availability
  filteredMovies = filterByPlatforms(filteredMovies, userPrefs.platforms);
  
  // Filter 2: Letterboxd watched movies (when implemented)
  // filteredMovies = filterByWatchedMovies(filteredMovies, letterboxdData, allowRewatches);
  
  // Future filters can be added here:
  // filteredMovies = filterByExcludedGenres(filteredMovies, userPrefs.excludedGenres);
  // filteredMovies = filterByRuntime(filteredMovies, userPrefs.maxRuntime);
  
  console.log('✨ Final filtered results:', filteredMovies.length, 'movies');
  return filteredMovies;
};

// ========================================
// INTEGRATION POINT
// ========================================
// Add this to your generateRecommendations function after getting TMDB movies
const getFilteredRecommendations = (rawMovies, userPrefs, allowRewatches = false) => {
  const filteredMovies = applyAllFilters(rawMovies, userPrefs, allowRewatches);
  
  if (filteredMovies.length >= 3) {
    const shuffled = filteredMovies.sort(() => 0.5 - Math.random());
    
    return {
      safe: {
        title: shuffled[0].title,
        year: shuffled[0].release_date?.slice(0, 4) || 'Unknown',
        genre: "Crime, Drama", 
        runtime: "2h 31m",
        platform: shuffled[0].availablePlatforms?.[0] || "Netflix", // Use actual platform
        reason: "🎯 Safe Bet: Available on your platforms"
      },
      stretch: {
        title: shuffled[1].title,
        year: shuffled[1].release_date?.slice(0, 4) || 'Unknown',
        genre: "Thriller, Drama",
        runtime: "2h 33m", 
        platform: shuffled[1].availablePlatforms?.[0] || "Prime",
        reason: "↗️ Stretch: Trending on your services"
      },
      wild: {
        title: shuffled[2].title,
        year: shuffled[2].release_date?.slice(0, 4) || 'Unknown',
        genre: "Action, Crime",
        runtime: "1h 44m",
        platform: shuffled[2].availablePlatforms?.[0] || "Criterion", 
        reason: "🎲 Wild Card: Hidden gem on your platforms"
      }
    };
  }
  
  return null; // Let existing fallbacks handle insufficient movies
};
const CineMoodApp = () => {
  const [currentScreen, setCurrentScreen] = useState('setup');
  const [userPrefs, setUserPrefs] = useState({
    letterboxd: '',
    platforms: [],
    moodAnswers: {}
  });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentRecommendations, setCurrentRecommendations] = useState(null);
  const [letterboxdData, setLetterboxdData] = useState(null);
  const [loadingLetterboxd, setLoadingLetterboxd] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvProcessing, setCsvProcessing] = useState(false);
  const [csvError, setCsvError] = useState('');
  const [currentQuestionSet, setCurrentQuestionSet] = useState(null);

  // Platforms array
  const platforms = ['Netflix', 'Prime', 'Hulu', 'Disney+', 'Criterion', 'Tubi'];
  const [letterboxdError, setLetterboxdError] = useState('');

  // TMDB Integration - Test version without API
 const generateRecommendations = async () => {
  setLoading(true);
  try {
    const result = await getMoodBasedMovies(userPrefs.moodAnswers);
const movies = result?.movies;
    console.log('🎬 TMDB API Response:', movies);
    if (result) {
  console.log('🎯 Chosen genre:', result.context.chosenGenre);
  console.log('📊 All genre scores:', result.context.allScores);
}
    console.log('🎬 Movies array length:', movies?.length);
    
    if (movies && movies.length >= 3) {
  console.log('✅ Using TMDB movies');
  const movieRecs = getFilteredRecommendations(movies, userPrefs);
  
  if (movieRecs) {
    setRecommendations(movieRecs);
  } else {
    // Fall back to existing system if filtering fails
    console.log('🔄 Using fallback system');
    const shuffled = movies.sort(() => 0.5 - Math.random());
    
    const movieRecs = {
      safe: {
        title: shuffled[0].title,
        year: shuffled[0].release_date?.slice(0, 4) || 'Unknown',
        genre: "Crime, Drama", 
        runtime: "2h 31m",
        platform: "Netflix",
        reason: "🎯 Safe Bet: Popular choice"
      },
      stretch: {
        title: shuffled[1].title,
        year: shuffled[1].release_date?.slice(0, 4) || 'Unknown',
        genre: "Thriller, Drama",
        runtime: "2h 33m", 
        platform: "Prime",
        reason: "↗️ Stretch: Trending pick"
      },
      wild: {
        title: shuffled[2].title,
        year: shuffled[2].release_date?.slice(0, 4) || 'Unknown',
        genre: "Action, Crime",
        runtime: "1h 44m",
        platform: "Criterion", 
      reason: "🎲 Wild Card: Hidden gem"
      }
    };
    
    setRecommendations(movieRecs);
  }
} else {
  console.log('❌ Using fallbacks - movies:', movies);
  setRecommendations({
    safe: { title: "Dune", year: 2021, genre: "Sci-Fi, Adventure", runtime: "2h 35m", platform: "HBO Max", reason: "🎯 Safe Bet: Popular sci-fi epic" },
    stretch: { title: "Minari", year: 2020, genre: "Drama, Family", runtime: "1h 55m", platform: "Prime", reason: "↗️ Stretch: Acclaimed indie drama" },
    wild: { title: "The Green Knight", year: 2021, genre: "Fantasy, Adventure", runtime: "2h 10m", platform: "A24", reason: "🎲 Wild Card: Artsy fantasy adventure" }
  });
}
  } catch (error) {
    console.log('🚨 TMDB API Error:', error);
    setRecommendations({
      safe: { title: "Parasite", year: 2019, genre: "Thriller, Drama", runtime: "2h 12m", platform: "Hulu", reason: "🎯 Network Error Fallback" },
      stretch: { title: "The Lighthouse", year: 2019, genre: "Horror, Drama", runtime: "1h 49m", platform: "Prime", reason: "↗️ Network Error Fallback" },
      wild: { title: "Uncut Gems", year: 2019, genre: "Crime, Thriller", runtime: "2h 15m", platform: "Netflix", reason: "🎲 Network Error Fallback" }
    });
  }
  setLoading(false);
};
  // Enhanced movie recommendations
  const getPersonalizedRecommendations = () => {
    if (!recommendations) {
      return recommendations || {
        safe: { title: "Moonlight", year: 2016, genre: "Drama", runtime: "1h 51m", platform: "Netflix", reason: "🎯 Safe Bet: No TMDB data" },
        stretch: { title: "First Cow", year: 2019, genre: "Drama, Western", runtime: "2h 2m", platform: "Showtime", reason: "↗️ Stretch: No TMDB data" },
        wild: { title: "Sound of Metal", year: 2019, genre: "Drama, Music", runtime: "2h 1m", platform: "Prime", reason: "🎲 Wild Card: No TMDB data" }
      };
    }
   
    const recentWatches = letterboxdData.movies.map(m => m.title.toLowerCase());
    const highRatedGenres = letterboxdData.movies.filter(m => m.rating >= 4).map(m => m.title);
   
    const personalizedMovies = {
      safe: {
        ...recommendations.safe,
        reason: recommendations.safe.reason || "🎯 Safe Bet: Matches your preferences"
      },
      stretch: {
        ...recommendations.stretch,
        reason: `↗️ Stretch: Based on your ${highRatedGenres.length > 0 ? 'high ratings for thrillers' : 'viewing patterns'}`
      },
      wild: {
        ...recommendations.wild,
        reason: "🎲 Wild Card: Haven't logged yet"
      }
    };
   
    return personalizedMovies;
  };

  const wheelMovies = [
    "Blade Runner 2049", "The Departed", "Mad Max: Fury Road", "Prisoners",
    "No Country for Old Men", "Drive", "Hell or High Water", "Wind River"
  ];
  
  // Question Rotation System - Multiple variations per mood category
const QUESTION_POOLS = {
  aesthetic: {
    variations: [
      {
        question: "Which calls to you tonight?",
        options: [
          { id: 'neon', text: 'Neon & Chrome', subtext: 'Blade Runner vibes', style: 'neon' },
          { id: 'earth', text: 'Earth & Wood', subtext: 'There Will Be Blood', style: 'earth' }
        ]
      },
      {
        question: "What mood board speaks to you?",
        options: [
          { id: 'neon', text: 'Electric Cityscape', subtext: 'Cyberpunk nights', style: 'neon' },
          { id: 'earth', text: 'Natural Textures', subtext: 'Raw & organic', style: 'earth' }
        ]
      },
      {
        question: "Pick your visual vibe:",
        options: [
          { id: 'neon', text: 'Synthetic Glow', subtext: 'Future noir', style: 'neon' },
          { id: 'earth', text: 'Weathered & Worn', subtext: 'Authentic patina', style: 'earth' }
        ]
      }
    ]
  },
  
  energy: {
    variations: [
      {
        question: "Your energy right now:",
        options: [
          { id: 'spring', text: 'Coiled Spring', subtext: 'Ready to go', style: 'spring' },
          { id: 'river', text: 'Slow River', subtext: 'Let it flow', style: 'river' }
        ]
      },
      {
        question: "How do you want to feel?",
        options: [
          { id: 'spring', text: 'Electric & Alert', subtext: 'High octane', style: 'spring' },
          { id: 'river', text: 'Calm & Flowing', subtext: 'Steady current', style: 'river' }
      ]
      }
    ]
  }
};

  // Question Selection Logic
const generateQuestionSet = () => {
  const categories = ['aesthetic', 'energy', 'character', 'era', 'mood', 'discovery'];
  const selectedQuestions = [];
  
  categories.forEach(category => {
    const pool = QUESTION_POOLS[category];
    const randomIndex = Math.floor(Math.random() * pool.variations.length);
    const selectedVariation = pool.variations[randomIndex];
    
    selectedQuestions.push({
      id: category,
      ...selectedVariation
    });
  });
  
  return selectedQuestions;
};
  
  // Event handlers
  const handlePlatformToggle = (platform) => {
    setUserPrefs(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

const handleMoodAnswer = async (questionId, answerId) => {
  setUserPrefs(prev => ({
    ...prev,
    moodAnswers: { ...prev.moodAnswers, [questionId]: answerId }
  }));
 
  if (questionIndex < currentQuestionSet.length - 1) {
    setQuestionIndex(questionIndex + 1);
  } else {
    await generateRecommendations();
    setCurrentScreen('results');
  }
};

  const spinWheel = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const randomMovie = wheelMovies[Math.floor(Math.random() * wheelMovies.length)];
      setSelectedMovie({ title: randomMovie, year: 2023, source: 'wheel' });
      setIsSpinning(false);
      setCurrentScreen('spinResult');
    }, 2000);
  };

  const handleWatchMovie = (movie) => {
    setSelectedMovie({ ...movie, source: 'recommendation' });
    setCurrentScreen('watching');
  };

  const getMoodCardStyle = (styleType) => {
    const styles = {
      neon: { background: 'linear-gradient(135deg, #0f3460, #e94560, #f2cf07)', borderColor: '#e94560' },
      earth: { background: 'linear-gradient(135deg, #2d1b0e, #5d4037, #8d6e63)', borderColor: '#8d6e63' },
      spring: { background: 'linear-gradient(135deg, #ff4444, #ff8c00, #ffd700)', borderColor: '#ff6b6b' },
      river: { background: 'linear-gradient(135deg, #2e8b57, #40e0d0, #87ceeb)', borderColor: '#40e0d0' },
      struggle: { background: 'linear-gradient(135deg, #4a148c, #7b1fa2, #9c27b0)', borderColor: '#9c27b0' },
      triumph: { background: 'linear-gradient(135deg, #bf360c, #ff5722, #ff9800)', borderColor: '#ff5722' },
      seventies: { background: 'linear-gradient(135deg, #3e2723, #5d4037, #8d6e63)', borderColor: '#8d6e63' },
      eighties: { background: 'linear-gradient(135deg, #1a237e, #3f51b5, #e91e63)', borderColor: '#e91e63' },
      puzzle: { background: 'linear-gradient(135deg, #263238, #37474f, #546e7a)', borderColor: '#546e7a' },
      escape: { background: 'linear-gradient(135deg, #004d40, #00695c, #00897b)', borderColor: '#00897b' },
      new: { background: 'linear-gradient(135deg, #e65100, #ff9800, #ffc107)', borderColor: '#ff9800' },
      comfort: { background: 'linear-gradient(135deg, #4e342e, #6d4c41, #8d6e63)', borderColor: '#8d6e63' }
    };
    return styles[styleType] || {};
  };

  // Setup Screen
  if (currentScreen === 'setup') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
            Welcome to CineMood
          </h2>
      
  <div className="mb-4">
  <label className="block text-sm text-gray-400 mb-2">
    Import your Letterboxd data (optional)
  </label>
  <input
    type="file"
    accept=".csv"
    onChange={(e) => setCsvFile(e.target.files[0])}
    className="w-full p-3 border-2 border-gray-600 rounded bg-gray-700 text-gray-200 mb-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-600 file:text-gray-200"
  />
  {csvError && (
    <p className="text-red-400 text-sm">{csvError}</p>
  )}
  {csvFile && (
    <p className="text-green-400 text-sm">Ready to import: {csvFile.name}</p>
  )}
</div>
         
          <p className="text-sm text-gray-400 mb-3">Select your streaming platforms:</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {platforms.map(platform => (
              <button
                key={platform}
                onClick={() => handlePlatformToggle(platform)}
                className={`p-3 border-2 rounded text-sm transition-all ${
                  userPrefs.platforms.includes(platform)
                    ? 'border-green-500 bg-green-900/30 text-green-400'
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        // added console log 
          <button
  onClick={async () => {
    console.log('Setup button clicked');
    
    if (csvFile) {
      setCsvProcessing(true);
      setCsvError('');
      try {
        const letterboxdData = await parseLetterboxdCSV(csvFile);
        const tasteData = analyzeUserTaste(letterboxdData);
        setUserPrefs(prev => ({...prev, letterboxdData: letterboxdData, tasteProfile: tasteData}));
        console.log('CSV imported successfully:', tasteData);
      } catch (error) {
        setCsvError(error.message);
        setCsvProcessing(false);
        return;
      }
      setCsvProcessing(false);
    }
    
    console.log('About to generate questions');
    const questionSet = generateQuestionSet();
    console.log('Generated question set:', questionSet);
    setCurrentQuestionSet(questionSet);
    
    setCurrentScreen('mood');
  }}
  disabled={csvProcessing}
  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white p-3 rounded font-medium"
>
  {csvProcessing ? 'Processing CSV...' : 'Start Finding Movies'}
</button>

// Mood Discovery Screen
if (currentScreen === 'mood') {
  console.log('Mood screen rendering');
  console.log('Current question set:', currentQuestionSet);
  
  if (!currentQuestionSet) {
    return <div>Loading questions...</div>;
  }
  
  const currentQuestion = currentQuestionSet[questionIndex];
  const progress = ((questionIndex + 1) / currentQuestionSet.length) * 100;

    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
            Discovering Your Mood
          </h2>
         
          <div className="h-1.5 bg-gray-600 rounded mb-6">
            <div
              className="h-full bg-green-500 rounded transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="text-lg mb-6 text-center">{currentQuestion.question}</p>
         
          <div className="space-y-4">
            {currentQuestion.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleMoodAnswer(currentQuestion.id, option.id)}
                className="w-full h-20 rounded-lg border-2 flex flex-col items-center justify-center text-white font-medium transition-all hover:scale-105"
                style={getMoodCardStyle(option.style)}
              >
                <span>{option.text}</span>
                <span className="text-sm opacity-80">{option.subtext}</span>
              </button>
            ))}
          </div>
         
          <p className="text-center text-sm text-gray-400 mt-6">
            Question {questionIndex + 1} of {currentQuestionSet.length}
          </p>
        </div>
      </div>
    );
  }

  // Results Screen
  if (currentScreen === 'results') {
    const recommendedMovies = recommendations;
   
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
            Your Perfect Three
          </h2>
         
          {Object.entries(recommendedMovies).map(([type, movie]) => (
            <div key={type} className="bg-gray-700 border-2 border-gray-600 rounded-lg p-4 mb-4">
              <div className="font-bold text-lg">{movie.title} ({movie.year})</div>
              <div className="text-gray-400 text-sm mb-2">{movie.genre} • {movie.runtime} • {movie.platform}</div>
              <div className="bg-blue-900/50 p-2 rounded text-xs italic text-blue-300 mt-2">
                {movie.reason}
              </div>
            </div>
          ))}
         
          <button
            onClick={() => handleWatchMovie(recommendedMovies.safe)}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-medium mb-3"
          >
            <Play className="inline w-4 h-4 mr-2" />
            Watch {recommendedMovies.safe.title}
          </button>
         
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCurrentScreen('decision')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-medium"
            >
              Can't Decide?
            </button>
           <button
  onClick={() => {
    setQuestionIndex(0); 
    setUserPrefs(prev => ({...prev, moodAnswers: {}})); // Clear mood answers
    setRecommendations(null); // Add this line
    setCurrentRecommendations(null); // Add this line too
    setCurrentScreen('mood');
  }}
  className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded font-medium"
>
  <RotateCcw className="inline w-4 h-4 mr-2" />
  Try Again
</button>
          </div>
        </div>
      </div>
    );
  }

  // Decision Screen
  if (currentScreen === 'decision') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
            Can't Decide?
          </h2>
         
          <div className="text-center mb-6">
            <div
              className={`w-48 h-48 mx-auto rounded-full border-4 border-gray-600 flex items-center justify-center transition-transform duration-2000 ${isSpinning ? 'animate-spin' : ''}`}
              style={{
                background: `conic-gradient(
                  #0f3460 0deg 45deg,
                  #e94560 45deg 90deg,
                  #2d1b0e 90deg 135deg,
                  #ff4444 135deg 180deg,
                  #40e0d0 180deg 225deg,
                  #8d6e63 225deg 270deg,
                  #f2cf07 270deg 315deg,
                  #5d4037 315deg 360deg
                )`
              }}
            >
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-200">
                {isSpinning ? '...' : 'SPIN!'}
              </div>
            </div>
          </div>
         
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white p-3 rounded font-medium mb-4"
          >
            {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
          </button>
         
          <button
            onClick={() => {
              const recommendations = currentRecommendations || getPersonalizedRecommendations();
              const luckyMovie = Object.values(recommendations)[Math.floor(Math.random() * 3)];
              setSelectedMovie({ ...luckyMovie, source: 'lucky' });
              setCurrentScreen('luckyResult');
            }}
            className="w-full bg-gradient-to-r from-red-500 to-teal-500 hover:from-red-600 hover:to-teal-600 text-white p-3 rounded font-medium mb-2"
          >
            I'm Feeling Lucky
          </button>
        </div>
      </div>
    );
  }

  // Other screens follow the same pattern...
  if (currentScreen === 'spinResult') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
            The Wheel Has Spoken!
          </h2>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">{selectedMovie?.title}</h3>
          </div>
          <button
            onClick={() => setCurrentScreen('watching')}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-medium"
          >
            Start Watching
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'luckyResult') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
            Perfect Match!
          </h2>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">{selectedMovie?.title}</h3>
          </div>
          <button
            onClick={() => setCurrentScreen('watching')}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-medium"
          >
            Let's Do This
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'watching') {
    const watchedMovie = selectedMovie || { title: "Heat", year: 1995 };
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
            How Was It?
          </h2>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">{watchedMovie.title}</h3>
          </div>
          <button
            onClick={() => setCurrentScreen('setup')}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-medium"
          >
            <Star className="inline w-4 h-4 mr-2" />
            Thanks!
          </button>
        </div>
      </div>
    );
  }

  // Default fallback
  return null;
};

export default CineMoodApp;
