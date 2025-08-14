import React, { useState, useEffect } from 'react';
import { Film, Sparkles, RefreshCw, User, Star, Calendar, Loader2, AlertCircle, Play, ArrowLeft, Heart, Meh, X } from 'lucide-react';

const CineMoodApp = () => {
  // Core state with memory fix
  const [currentScreen, setCurrentScreen] = useState('mood');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [moodAnswers, setMoodAnswers] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentRecommendations, setCurrentRecommendations] = useState(null);
  const [letterboxdData, setLetterboxdData] = useState(null);
  const [loadingLetterboxd, setLoadingLetterboxd] = useState(false);
  const [letterboxdUsername, setLetterboxdUsername] = useState('');
  const [letterboxdError, setLetterboxdError] = useState('');

  // Mood questions
  const moodQuestions = [
    {
      id: 'energy',
      question: 'Your energy tonight is...',
      options: [
        { text: 'Ready to conquer worlds', value: 5, genres: ['Action', 'Adventure'] },
        { text: 'Contemplative & quiet', value: 1, genres: ['Drama', 'Documentary'] }
      ]
    },
    {
      id: 'tone',
      question: 'You want something...',
      options: [
        { text: 'Dark & intense', value: 5, genres: ['Thriller', 'Crime'] },
        { text: 'Light & uplifting', value: 1, genres: ['Comedy', 'Romance'] }
      ]
    },
    {
      id: 'complexity',
      question: 'Tonight calls for...',
      options: [
        { text: 'Mind-bending puzzles', value: 5, genres: ['Mystery', 'Sci-Fi'] },
        { text: 'Simple pleasures', value: 1, genres: ['Family', 'Animation'] }
      ]
    }
  ];

  // Movie database
  const movieDatabase = [
    { title: "Heat", year: 1995, genres: ['Action', 'Crime'], moodProfile: { energy: 4, tone: 5, complexity: 4 } },
    { title: "Her", year: 2013, genres: ['Romance', 'Drama'], moodProfile: { energy: 2, tone: 2, complexity: 4 } },
    { title: "Mad Max: Fury Road", year: 2015, genres: ['Action'], moodProfile: { energy: 5, tone: 4, complexity: 2 } },
    { title: "The Grand Budapest Hotel", year: 2014, genres: ['Comedy'], moodProfile: { energy: 2, tone: 1, complexity: 3 } },
    { title: "Blade Runner 2049", year: 2017, genres: ['Sci-Fi'], moodProfile: { energy: 3, tone: 4, complexity: 5 } },
    { title: "Spirited Away", year: 2001, genres: ['Animation'], moodProfile: { energy: 3, tone: 1, complexity: 3 } }
  ];

  // Generate recommendations and store them
  const getPersonalizedRecommendations = () => {
    const moodVector = Object.values(moodAnswers);
    const scoredMovies = movieDatabase.map(movie => {
      const movieVector = Object.values(movie.moodProfile);
      let similarity = 0;
      for (let i = 0; i < moodVector.length; i++) {
        similarity += Math.pow(moodVector[i] - movieVector[i], 2);
      }
      return { ...movie, score: 1 / (1 + Math.sqrt(similarity)) };
    }).sort((a, b) => b.score - a.score);

    return {
      safe: scoredMovies[0],
      stretch: scoredMovies[Math.floor(scoredMovies.length / 2)],
      wild: scoredMovies[scoredMovies.length - 1]
    };
  };

  // Handle mood question answers
  const handleMoodAnswer = (questionId, value) => {
    const newAnswers = { ...moodAnswers, [questionId]: value };
    setMoodAnswers(newAnswers);

    if (questionIndex < moodQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // Store recommendations when mood questions complete
      const recommendations = getPersonalizedRecommendations();
      setCurrentRecommendations(recommendations);
      setCurrentScreen('results');
    }
  };

  // Handle movie selection
  const handleWatchMovie = (movie) => {
    setSelectedMovie(movie); // Remember the selected movie
    setCurrentScreen('watching');
  };

  // Reset everything
  const startOver = () => {
    setCurrentScreen('mood');
    setQuestionIndex(0);
    setMoodAnswers({});
    setSelectedMovie(null);
    setCurrentRecommendations(null);
  };

  // Mood Questions Screen
  if (currentScreen === 'mood') {
    const currentQuestion = moodQuestions[questionIndex];
    
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center mb-8">
            <Film className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">CineMood</h1>
            <div className="flex justify-center gap-1 mb-4">
              {moodQuestions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i <= questionIndex ? 'bg-purple-400' : 'bg-gray-600'}`}
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">{currentQuestion.question}</h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleMoodAnswer(currentQuestion.id, option.value)}
                  className="w-full p-4 text-left bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (currentScreen === 'results') {
    const recommendedMovies = currentRecommendations || getPersonalizedRecommendations();
    
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="text-center mb-8">
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Your Recommendations</h1>
          </div>

          <div className="space-y-4 mb-8">
            {Object.entries(recommendedMovies).map(([tier, movie]) => (
              <div key={tier} className="bg-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{movie.title}</h3>
                    <p className="text-gray-400">{movie.year}</p>
                    <p className="text-purple-400 capitalize">{tier} Pick</p>
                  </div>
                  <button
                    onClick={() => handleWatchMovie(movie)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Watch
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(genre => (
                    <span key={genre} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={startOver}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Watching/Feedback Screen
  if (currentScreen === 'watching') {
    const watchedMovie = selectedMovie || (currentRecommendations ? currentRecommendations.safe : { title: "Heat", year: 1995 });
    
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center mb-8">
            <Film className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">How was it?</h1>
            <h2 className="text-xl text-purple-400">{watchedMovie.title} ({watchedMovie.year})</h2>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Rate your experience</h3>
            <div className="flex justify-center gap-4">
              <button className="flex flex-col items-center p-4 bg-gray-700 hover:bg-red-600 rounded-xl transition-colors">
                <X className="w-8 h-8 mb-2" />
                <span className="text-sm">Not for me</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-gray-700 hover:bg-yellow-600 rounded-xl transition-colors">
                <Meh className="w-8 h-8 mb-2" />
                <span className="text-sm">It was okay</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-gray-700 hover:bg-green-600 rounded-xl transition-colors">
                <Heart className="w-8 h-8 mb-2" />
                <span className="text-sm">Loved it!</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setCurrentScreen('results')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Recommendations
            </button>
            <button
              onClick={startOver}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Mood Check
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default CineMoodApp;
