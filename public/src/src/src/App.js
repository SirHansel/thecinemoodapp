import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Settings, Star, ThumbsUp, X } from 'lucide-react';

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

  // Sample movie data (would come from APIs in real version)
  const sampleMovies = {
    safe: { title: "Heat", year: 1995, genre: "Action, Crime", runtime: "2h 50m", platform: "Netflix", reason: "🎯 Safe Bet: Matches your love for 90s crime dramas and Mann's style" },
    stretch: { title: "Sicario", year: 2015, genre: "Thriller, Drama", runtime: "2h 1m", platform: "Prime", reason: "↗️ Stretch: Like Heat but with modern edge - might be perfect" },
    wild: { title: "The French Connection", year: 1971, genre: "Action, Crime", runtime: "1h 44m", platform: "Criterion", reason: "🎲 Wild Card: 70s grit you haven't explored yet" }
  };

  const wheelMovies = [
    "Blade Runner 2049", "The Departed", "Mad Max: Fury Road", "Prisoners", 
    "No Country for Old Men", "Drive", "Hell or High Water", "Wind River"
  ];

  const moodQuestions = [
    {
      question: "Which calls to you tonight?",
      options: [
        { id: 'neon', text: 'Neon & Chrome', subtext: 'Blade Runner vibes', style: 'neon' },
        { id: 'earth', text: 'Earth & Wood', subtext: 'There Will Be Blood', style: 'earth' }
      ]
    },
    {
      question: "Your energy right now:",
      options: [
        { id: 'spring', text: 'Coiled Spring', subtext: 'Ready to go', style: 'spring' },
        { id: 'river', text: 'Slow River', subtext: 'Let it flow', style: 'river' }
      ]
    },
    {
      question: "You want characters who:",
      options: [
        { id: 'struggle', text: 'Struggle Beautifully', subtext: 'Internal conflicts', style: 'struggle' },
        { id: 'triumph', text: 'Triumph Boldly', subtext: 'External victories', style: 'triumph' }
      ]
    },
    {
      question: "Which era's soul matches yours?",
      options: [
        { id:
