import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Settings, Star, ThumbsUp, X } from 'lucide-react';
import { fetchMoviesByGenre } from './tmdbApi';

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

  // Platforms array
  const platforms = ['Netflix', 'Prime', 'Hulu', 'Disney+', 'Criterion', 'Tubi'];

  // Letterboxd RSS Parser
  const fetchLetterboxdData = async (username) => {
    if (!username) return;
   
    setLoadingLetterboxd(true);
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://letterboxd.com/${username}/rss/`)}`;
      const response = await fetch(proxyUrl);
      const text = await response.text();
     
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');
      const items = xml.querySelectorAll('item');
     
      const movies = [];
      items.forEach(item => {
        const title = item.querySelector('title')?.textContent;
        const description = item.querySelector('description')?.textContent;
        const pubDate = item.querySelector('pubDate')?.textContent;
       
        if (title && description) {
          const movieMatch = title.match(/(.+?)\s*,\s*(\d{4})/);
          const ratingMatch = description.match(/★{1,5}/);
         
          if (movieMatch) {
            movies.push({
              title: movieMatch[1].trim(),
              year: parseInt(movieMatch[2]),
              rating: ratingMatch ? ratingMatch[0].length : null,
              date: new Date(pubDate),
              activity: title.includes('watched') ? 'watched' : 'rated'
            });
          }
        }
      });
     
      setLetterboxdData({
        username,
        movies: movies.slice(0, 20),
        lastSync: new Date()
      });
     
    } catch (error) {
      console.error('Failed to fetch Letterboxd data:', error);
      setLetterboxdData({ error: 'Could not sync with Letterboxd. Please check username.' });
    }
    setLoadingLetterboxd(false);
  };

  // TMDB Integration
  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const movies = await fetchMoviesByGenre(80); // Crime genre
     
     const movieRecs = {
  safe: {
    title: movies[0]?.title || "Dune",
    year: movies[0]?.release_date?.slice(0, 4) || 2021,
    genre: "Sci-Fi, Adventure",
    runtime: "2h 35m",
    platform: "HBO Max",
    reason: "🎯 Safe Bet: Popular sci-fi epic"
  },
  stretch: {
    title: movies[1]?.title || "Minari",
    year: movies[1]?.release_date?.slice(0, 4) || 2020,
    genre: "Drama, Family",
    runtime: "1h 55m",
    platform: "Prime",
    reason: "↗️ Stretch: Acclaimed indie drama"
  },
  wild: {
    title: movies[2]?.title || "The Green Knight",
    year: movies[2]?.release_date?.slice(0, 4) || 2021,
    genre: "Fantasy, Adventure",
    runtime: "2h 10m",
    platform: "A24",
    reason: "🎲 Wild Card: Artsy fantasy adventure"
  }
};
     
      setRecommendations(movieRecs);
    } catch (error) {
      console.log('TMDB error:', error);
    }
    setLoading(false);
  };

  // Enhanced movie recommendations using Letterboxd data
  const getPersonalizedRecommendations = () => {
    if (!letterboxdData?.movies || !recommendations) {
      return recommendations || {
        safe: { title: "The Departed", year: 2006, genre: "Crime, Drama", runtime: "2h 31m", platform: "Netflix", reason: "🎯 Safe Bet: Matches your preferences" },
        stretch: { title: "Prisoners", year: 2013, genre: "Thriller, Drama", runtime: "2h 33m", platform: "Prime", reason: "↗️ Stretch: Based on your preferences" },
        wild: { title: "The French Connection", year: 1971, genre: "Action, Crime", runtime: "1h 44m", platform: "Criterion", reason: "🎲 Wild Card: Hidden gem" }
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
        reason: "🎲 Wild Card: 70s classic you haven't logged yet"
      }
    };
   
    return personalizedMovies;
  };

  const wheelMovies = [
    "Blade Runner 2049", "The Departed", "Mad Max: Fury Road", "Prisoners",
    "No Country for Old Men", "Drive", "Hell or High Water", "Wind River"
  ];

  // FIXED: Complete mood questions array with proper structure
  const moodQuestions = [
    {
      id: 'aesthetic',
      question: "Which calls to you tonight?",
      options: [
        { id: 'neon', text: 'Neon & Chrome', subtext: 'Blade Runner vibes', style: 'neon' },
        { id: 'earth', text: 'Earth & Wood', subtext: 'There Will Be Blood', style: 'earth' }
      ]
    },
    {
      id: 'energy',
      question: "Your energy right now:",
      options: [
        { id: 'spring', text: 'Coiled Spring', subtext: 'Ready to go', style: 'spring' },
        { id: 'river', text: 'Slow River', subtext: 'Let it flow', style: 'river' }
      ]
    },
    {
      id: 'character',
      question: "You want characters who:",
      options: [
        { id: 'struggle', text: 'Struggle Beautifully', subtext: 'Internal conflicts', style: 'struggle' },
        { id: 'triumph', text: 'Triumph Boldly', subtext: 'External victories', style: 'triumph' }
      ]
    },
    {
      id: 'era',
      question: "Which era's soul matches yours?",
      options: [
        { id: 'seventies', text: '70s Paranoia', subtext: 'Gritty, raw', style: 'seventies' },
        { id: 'eighties', text: '80s Neon', subtext: 'Bold, electric', style: 'eighties' }
      ]
    },
    {
      id: 'mood',
      question: "Tonight feels like:",
      options: [
        { id: 'puzzle', text: 'A Puzzle to Solve', subtext: 'Make me think', style: 'puzzle' },
        { id: 'escape', text: 'A World to Escape', subtext: 'Take me away', style: 'escape' }
      ]
    },
    {
      id: 'discovery',
      question: "New discovery or comfort rewatch?",
      options: [
        { id: 'new', text: 'Something New', subtext: 'Adventure awaits', style: 'new' },
        { id: 'comfort', text: 'Beloved Classic', subtext: 'Safe harbor', style: 'comfort' }
      ]
    }
  ];

  // Event handlers
  const handlePlatformToggle = (platform) => {
    setUserPrefs(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  // FIXED: Proper mood answer handling with question ID
  const handleMoodAnswer = async (questionId, answerId) => {
    setUserPrefs(prev => ({
      ...prev,
      moodAnswers: { ...prev.moodAnswers, [questionId]: answerId }
    }));
   
    if (questionIndex < moodQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      await generateRecommendations();
      const recommendations = getPersonalizedRecommendations();
      setCurrentRecommendations(recommendations);
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
            <input
              type="text"
              placeholder="Letterboxd Username (optional)"
              className="w-full p-3 border-2 border-gray-600 rounded bg-gray-700 text-gray-200 mb-2"
              value={userPrefs.letterboxd}
              onChange={(e) => setUserPrefs(prev => ({...prev, letterboxd: e.target.value}))}
            />
            {userPrefs.letterboxd && (
              <button
                onClick={() => fetchLetterboxdData(userPrefs.letterboxd)}
                disabled={loadingLetterboxd}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-2 rounded text-sm mb-2"
              >
                {loadingLetterboxd ? 'Syncing...' : 'Sync with Letterboxd'}
              </button>
            )}
            {letterboxdData?.movies && (
              <div className="bg-green-900/30 p-2 rounded text-xs text-green-300">
                ✓ Synced {letterboxdData.movies.length} recent activities
              </div>
            )}
            {letterboxdData?.error && (
              <div className="bg-red-900/30 p-2 rounded text-xs text-red-300">
                {letterboxdData.error}
              </div>
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
         
          <button
            onClick={() => setCurrentScreen('mood')}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-medium"
          >
            Start Finding Movies
          </button>
          <p className="text-center text-sm text-gray-400 mt-3">Takes about 2 minutes</p>
        </div>
      </div>
    );
  }

  // Mood Discovery Screen
  if (currentScreen === 'mood') {
    const currentQuestion = moodQuestions[questionIndex];
    const progress = ((questionIndex + 1) / moodQuestions.length) * 100;

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
            Question {questionIndex + 1} of {moodQuestions.length}
          </p>
        </div>
      </div>
    );
  }

  // Results Screen
  if (currentScreen === 'results') {
    const recommendedMovies = currentRecommendations || getPersonalizedRecommendations();
   
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
            Your Perfect Three
          </h2>
         
          {letterboxdData?.movies && (
            <div className="bg-blue-900/30 p-3 rounded mb-4 text-xs">
              <div className="font-bold mb-1">Based on your Letterboxd:</div>
              <div className="text-blue-300">
                Recent: {letterboxdData.movies.slice(0, 3).map(m => m.title).join(', ')}...
              </div>
            </div>
          )}
         
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
              onClick={() => {setQuestionIndex(0); setCurrentScreen('mood');}}
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

  // Decision Avoidance Screen
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
         
          <hr className="border-gray-600 my-6" />
         
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
          <p className="text-center text-sm text-gray-400 mb-6">Based on your mood, we'll pick one for you</p>
         
          <hr className="border-gray-600 my-6" />
         
          <button
            onClick={() => setCurrentScreen('usuals')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-medium mb-2"
          >
            Show My Usuals
          </button>
          <p className="text-center text-sm text-gray-400">Skip mood questions, show favorites</p>
        </div>
      </div>
    );
  }

  // Spin Result Screen
  if (currentScreen === 'spinResult') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
            The Wheel Has Spoken!
          </h2>
         
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-green-400 mb-2">🎬</div>
            <h3 className="text-2xl font-bold mb-2">{selectedMovie?.title}</h3>
            <p className="text-gray-400">Available on Netflix</p>
          </div>
         
          <button
            onClick={() => setCurrentScreen('watching')}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-medium mb-3"
          >
            <Play className="inline w-4 h-4 mr-2" />
            Start Watching
          </button>
         
          <button
            onClick={() => setCurrentScreen('decision')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white p-3 rounded font-medium"
          >
            Spin Again
          </button>
        </div>
      </div>
    );
  }

  // Lucky Result Screen
  if (currentScreen === 'luckyResult') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
            Trust Us - This One's Perfect
          </h2>
         
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-blue-400 mb-2">✨</div>
            <h3 className="text-2xl font-bold mb-2">{selectedMovie?.title} ({selectedMovie?.year})</h3>
            <p className="text-gray-400">Based on your mood profile</p>
            <div className="bg-blue-900/50 p-3 rounded text-sm italic text-blue-300 mt-4">
              This matches your current vibe perfectly. Trust the algorithm!
            </div>
          </div>
         
          <button
            onClick={() => setCurrentScreen('watching')}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-medium mb-3"
          >
            <Play className="inline w-4 h-4 mr-2" />
            Let's Do This
          </button>
         
          <button
            onClick={() => setCurrentScreen('results')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white p-3 rounded font-medium"
          >
            Show Me Options Instead
          </button>
        </div>
      </div>
    );
  }

  // Watching/Feedback Screen
  if (currentScreen === 'watching') {
    const watchedMovie = selectedMovie || (currentRecommendations?.safe) || { title: "Heat", year: 1995 };
   
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
            How Was It?
          </h2>
         
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">{watchedMovie.title} ({watchedMovie.year})</h3>
            <p className="text-gray-400">Let us know how it went!</p>
          </div>
         
          <div className="space-y-3 mb-6">
            <button
              onClick={() => setCurrentScreen('profile')}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-medium"
            >
              <Star className="inline w-4 h-4 mr-2" />
              Loved it - finished
            </button>
            <button
              onClick={() => setCurrentScreen('profile')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-medium"
            >
              <ThumbsUp className="inline w-4 h-4 mr-2" />
              Good - finished
            </button>
          </div>
         
          <hr className="border-gray-600 my-6" />
         
          <p className="text-sm text-gray-400 mb-3">If you didn't finish, why?</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['Wrong energy', 'Too slow', 'Not tonight', 'Too long', 'Bad mood match'].map(reason => (
              <button
                key={reason}
                onClick={() => setCurrentScreen('profile')}
                className="px-3 py-1.5 border border-gray-600 rounded-full text-xs bg-gray-700 hover:bg-gray-600 text-gray-300"
              >
                {reason}
              </button>
            ))}
          </div>
         
          <button
            onClick={() => setCurrentScreen('profile')}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-medium"
          >
            Thanks, got it!
          </button>
          <p className="text-center text-sm text-gray-400 mt-3">Helps improve your recommendations</p>
        </div>
      </div>
    );
  }

  // Profile Screen
  if (currentScreen === 'profile') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
            Your Profile
          </h2>
         
          <div className="bg-green-900/30 p-4 rounded-lg mb-4">
            <div className="font-bold mb-2">Mood Patterns</div>
            <div className="text-sm text-gray-300">
              Friday nights: Action/Thriller<br/>
              Sunday evenings: Westerns<br/>
              Late night: Sci-fi
            </div>
          </div>
         
          <div className="bg-yellow-900/30 p-4 rounded-lg mb-6">
            <div className="font-bold mb-2">Recent Discoveries</div>
            <div className="text-sm text-gray-300">
              You loved our 70s crime suggestions!<br/>
              Try more Mann directors?
            </div>
          </div>
         
          <div className="space-y-3">
            <button
              onClick={() => setCurrentScreen('setup')}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-medium"
            >
              <Settings className="inline w-4 h-4 mr-2" />
              Update Streaming Services
            </button>
            <button
              onClick={() => setCurrentScreen('setup')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-medium"
            >
              Sync Letterboxd
            </button>
            <button
              onClick={() => {setQuestionIndex(0); setCurrentScreen('mood');}}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded font-medium"
            >
              Find Another Movie
            </button>
          </div>
         
          <p className="text-center text-sm text-gray-400 mt-4">Last sync: 2 hours ago</p>
        </div>
      </div>
    );
  }

  // Usuals Screen (bonus)
  if (currentScreen === 'usuals') {
    const usualMovies = [
      { title: "The Departed", year: 2006, platform: "Netflix", reason: "Your Sunday night go-to" },
      { title: "Blade Runner 2049", year: 2017, platform: "Prime", reason: "Perfect for late night sci-fi moods" },
      { title: "Hell or High Water", year: 2016, platform: "Criterion", reason: "Modern western comfort watch" }
    ];

    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
          <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
            Your Usual Suspects
          </h2>
         
          {usualMovies.map((movie, idx) => (
            <div key={idx} className="bg-gray-700 border-2 border-gray-600 rounded-lg p-4 mb-4">
              <div className="font-bold text-lg">{movie.title} ({movie.year})</div>
              <div className="text-gray-400 text-sm mb-2">Available on {movie.platform}</div>
              <div className="bg-green-900/50 p-2 rounded text-xs italic text-green-300 mt-2">
                💚 {movie.reason}
              </div>
            </div>
          ))}
         
          <button
            onClick={() => setCurrentScreen('results')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white p-3 rounded font-medium"
          >
            Back to New Recommendations
          </button>
        </div>
      </div>
    );
  }

};

export default CineMoodApp;
