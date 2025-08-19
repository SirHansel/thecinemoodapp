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
  const [letterboxdData, setLetterboxdData] = useState({ movies: [] });
  const [currentRecommendations, setCurrentRecommendations] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  // New TMDB state
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  // TMDB integration function
  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Get movies from TMDB (using Crime genre as example)
      const movies = await fetchMoviesByGenre(80); // 80 = Crime genre
      
      const movieRecs = {
        safe: {
          title: movies[0]?.title || "The Departed",
          year: movies[0]?.release_date?.slice(0, 4) || 2006,
          genre: "Crime, Drama",
          runtime: "2h 31m",
          platform: "Netflix",
          reason: "🎯 Safe Bet: Popular crime drama"
        },
        stretch: {
          title: movies[1]?.title || "Prisoners", 
          year: movies[1]?.release_date?.slice(0, 4) || 2013,
          genre: "Thriller, Drama",
          runtime: "2h 33m", 
          platform: "Prime",
          reason: "↗️ Stretch: Trending thriller"
        },
        wild: {
          title: movies[2]?.title || "The French Connection",
          year: movies[2]?.release_date?.slice(0, 4) || 1971,
          genre: "Action, Crime", 
          runtime: "1h 44m",
          platform: "Criterion",
          reason: "🎲 Wild Card: Hidden gem"
        }
      };
      
      setRecommendations(movieRecs);
    } catch (error) {
      console.log('TMDB error:', error);
      // Fallback to original data
    }
    setLoading(false);
  };

  const moodQuestions = [
    {
      id: 'energy',
      question: "What's your energy level?",
      options: [
        { id: 'neon', text: 'Electric', subtext: 'High octane thrills', style: 'neon' },
        { id: 'earth', text: 'Grounded', subtext: 'Thoughtful stories', style: 'earth' }
      ]
    },
    {
      id: 'tone',
      question: "What tone calls to you?",
      options: [
        { id: 'spring', text: 'Light & Hopeful', subtext: 'Uplifting vibes', style: 'spring' },
        { id: 'river', text: 'Deep & Complex', subtext: 'Meaningful narratives', style: 'river' }
      ]
    },
    {
      id: 'journey',
      question: "What kind of journey?",
      options: [
        { id: 'struggle', text: 'Against All Odds', subtext: 'Character fights back', style: 'struggle' },
        { id: 'triumph', text: 'Victory Lap', subtext: 'Heroes win the day', style: 'triumph' }
      ]
    },
    {
      id: 'era',
      question: "Which era speaks to you?",
      options: [
        { id: 'seventies', text: '70s Grit', subtext: 'Raw, authentic', style: 'seventies' },
        { id: 'eighties', text: '80s Style', subtext: 'Bold and electric', style: 'eighties' }
      ]
    },
    {
      id: 'challenge',
      question: "How do you want to think?",
      options: [
        { id: 'puzzle', text: 'Solve a Mystery', subtext: 'Mind-bending plots', style: 'puzzle' },
        { id: 'escape', text: 'Just Escape', subtext: 'Pure entertainment', style: 'escape' }
      ]
    },
    {
      id: 'discovery',
      question: "What kind of discovery?",
      options: [
        { id: 'new', text: 'Something New', subtext: 'Adventure awaits', style: 'new' },
        { id: 'comfort', text: 'Beloved Classic', subtext: 'Safe harbor', style: 'comfort' }
      ]
    }
  ];

  const platforms = ['Netflix', 'Prime', 'Hulu', 'Disney+', 'Criterion', 'Tubi'];
  const wheelMovies = [
    "Blade Runner 2049", "The Departed", "Mad Max: Fury Road", "Prisoners", 
    "No Country for Old Men", "Drive", "Hell or High Water", "Wind River"
  ];

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

  const getPersonalizedRecommendations = () => {
    const recentWatches = letterboxdData.movies.map(m => m.title.toLowerCase());
    const highRatedGenres = letterboxdData.movies
      .filter(m => m.rating >= 4)
      .map(m => m.title);
    
    const personalizedMovies = {
      safe: { 
        title: recommendations?.safe?.title || "The Departed", 
        year: recommendations?.safe?.year || 2006, 
        genre: recommendations?.safe?.genre || "Crime, Drama", 
        runtime: recommendations?.safe?.runtime || "2h 31m", 
        platform: recommendations?.safe?.platform || "Netflix", 
        reason: recommendations?.safe?.reason || "🎯 Safe Bet: Matches your preferences"
      },
      stretch: { 
        title: recommendations?.stretch?.title || "Prisoners", 
        year: recommendations?.stretch?.year || 2013, 
        genre: recommendations?.stretch?.genre || "Thriller, Drama", 
        runtime: recommendations?.stretch?.runtime || "2h 33m", 
        platform: recommendations?.stretch?.platform || "Prime", 
        reason: recommendations?.stretch?.reason || "↗️ Stretch: Based on your preferences"
      },
      wild: { 
        title: recommendations?.wild?.title || "The French Connection", 
        year: recommendations?.wild?.year || 1971, 
        genre: recommendations?.wild?.genre || "Action, Crime", 
        runtime: recommendations?.wild?.runtime || "1h 44m", 
        platform: recommendations?.wild?.platform || "Criterion", 
        reason: recommendations?.wild?.reason || "🎲 Wild Card: Hidden gem"
      }
    };
    
    return personalizedMovies;
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
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Letterboxd Username (Optional)
              </label>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
                placeholder="Enter username"
                value={userPrefs.letterboxd}
                onChange={(e) => setUserPrefs(prev => ({...prev, letterboxd: e.target.value}))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Available Platforms
              </label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map(platform => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformToggle(platform)}
                    className={`p-2 rounded text-sm border ${
                      userPrefs.platforms.includes(platform)
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setCurrentScreen('mood')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700"
            >
              Start Mood Discovery
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Add other screens here (mood, results, etc.)
  // This is a starting point - you'll need to add your other screen components

  return <div>Other screens go here</div>;
};

export default CineMoodApp;
