import React, { useState } from 'react';

const CineMoodApp = () => {
  const [currentScreen, setCurrentScreen] = useState('setup');
  const [userName, setUserName] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [recommendations, setRecommendations] = useState({ safe: [], stretch: [], wild: [] });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [letterboxdUrl, setLetterboxdUrl] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // TMDB API configuration
  const TMDB_API_KEY = 'your_api_key_here'; // Replace with your actual API key
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

  // Mood questions with proper genre mapping
  const moodQuestions = [
    {
      id: 'energy',
      question: "What's your energy level right now?",
      options: [
        { id: 'low', text: 'Low - Need something calming', genres: [18, 10749, 10402] }, // Drama, Romance, Music
        { id: 'medium', text: 'Medium - Open to anything', genres: [35, 9648, 878] }, // Comedy, Mystery, Sci-Fi
        { id: 'high', text: 'High - Want something exciting!', genres: [28
