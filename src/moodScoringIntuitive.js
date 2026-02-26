// ========================================
// INTUITIVE MODE - Psychological Profiling via Scenarios
// DO NOT MIX WITH STANDARD MODE
// ========================================

export const EMOTIONAL_NEEDS = {
  ESCAPE: 'ESCAPE',
  RELEASE: 'RELEASE',
  COMFORT: 'COMFORT',
  STIMULATION: 'STIMULATION',
  CONNECTION: 'CONNECTION',
  CATHARSIS: 'CATHARSIS'
};

const TMDB_GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37
};

const NEED_TO_GENRE_MAPPING = {
  [EMOTIONAL_NEEDS.ESCAPE]: {
    primary: [
      { genre: TMDB_GENRES.FANTASY, weight: 5 },
      { genre: TMDB_GENRES.SCIENCE_FICTION, weight: 4 },
      { genre: TMDB_GENRES.ADVENTURE, weight: 4 }
    ],
    secondary: [
      { genre: TMDB_GENRES.ANIMATION, weight: 2 }
    ]
  },
  
  [EMOTIONAL_NEEDS.RELEASE]: {
    primary: [
      { genre: TMDB_GENRES.THRILLER, weight: 5 },
      { genre: TMDB_GENRES.ACTION, weight: 4 },
      { genre: TMDB_GENRES.HORROR, weight: 3 }
    ],
    secondary: [
      { genre: TMDB_GENRES.CRIME, weight: 2 },
      { genre: TMDB_GENRES.WAR, weight: 2 }
    ]
  },
  
  [EMOTIONAL_NEEDS.COMFORT]: {
    primary: [
      { genre: TMDB_GENRES.COMEDY, weight: 5 },
      { genre: TMDB_GENRES.ANIMATION, weight: 3 }
    ],
    secondary: [
      { genre: TMDB_GENRES.FAMILY, weight: 2 },
      { genre: TMDB_GENRES.ROMANCE, weight: 2 }
    ]
  },
  
  [EMOTIONAL_NEEDS.STIMULATION]: {
    primary: [
      { genre: TMDB_GENRES.MYSTERY, weight: 5 },
      { genre: TMDB_GENRES.SCIENCE_FICTION, weight: 4 },
      { genre: TMDB_GENRES.THRILLER, weight: 3 }
    ],
    secondary: [
      { genre: TMDB_GENRES.DRAMA, weight: 2 },
      { genre: TMDB_GENRES.HISTORY, weight: 2 },
      { genre: TMDB_GENRES.DOCUMENTARY, weight: 1 }
    ]
  },
  
  [EMOTIONAL_NEEDS.CONNECTION]: {
    primary: [
      { genre: TMDB_GENRES.DRAMA, weight: 4 },
      { genre: TMDB_GENRES.ROMANCE, weight: 4 }
    ],
    secondary: [
      { genre: TMDB_GENRES.MUSIC, weight: 2 },
      { genre: TMDB_GENRES.FAMILY, weight: 2 }
    ]
  },
  
  [EMOTIONAL_NEEDS.CATHARSIS]: {
    primary: [
      { genre: TMDB_GENRES.DRAMA, weight: 4 }
    ],
    secondary: [
      { genre: TMDB_GENRES.WAR, weight: 2 },
      { genre: TMDB_GENRES.HISTORY, weight: 1 }
    ]
  }
};

const WEATHER_FRAMINGS = [
  "A traveler stands at a crossroads. The sky above them is:",
  "You crest a hill. The valley below is:",
  "The air around you feels:",
  "Picture a moment. The weather:",
  "You look up. The sky is:",
  "A character faces something difficult. Above them:"
];

export const INTUITIVE_SCENARIOS = {
  
  setting: {
    mountain_peak: {
      image: 'mountain_peak.jpg',
      label: 'Mountain Peak',
      question: 'What do you do?',
      actions: {
        climb: { text: 'Climb higher', needs: { RELEASE: 3, ESCAPE: 1 } },
        observe: { text: 'Take in view', needs: { ESCAPE: 3, STIMULATION: 1 } },
        camp: { text: 'Camp below', needs: { COMFORT: 2, ESCAPE: 1, CONNECTION: 1 } },
        lodge: { text: 'Find lodge', needs: { COMFORT: 3 } }
      }
    },
    bookshop: {
      image: 'bookshop.jpg',
      label: 'Bookshop',
      question: 'What draws you?',
      actions: {
        lose_self: { text: 'Lose yourself in books', needs: { ESCAPE: 3, STIMULATION: 1 } },
        warm_drink: { text: 'Sit with tea', needs: { COMFORT: 3, CONNECTION: 1 } },
        chat: { text: 'Chat with owner', needs: { CONNECTION: 3, COMFORT: 1 } },
        browse: { text: 'Browse quietly', needs: { STIMULATION: 2, COMFORT: 2 } }
      }
    },
    foggy_forest: {
      image: 'foggy_forest.jpg',
      label: 'Foggy Forest',
      question: 'A path leads in. You:',
      actions: {
        enter: { text: 'Enter immediately', needs: { ESCAPE: 2, RELEASE: 2 } },
        watch: { text: 'Watch from edge', needs: { STIMULATION: 3, ESCAPE: 1 } },
        study: { text: 'Study it first', needs: { STIMULATION: 3 } },
        turn_back: { text: 'Turn back', needs: { COMFORT: 3 } }
      }
    },
    neon_city: {
      image: 'neon_city.jpg',
      label: 'Neon City',
      question: 'Where do you go?',
      actions: {
        dive_in: { text: 'Dive into crowds', needs: { RELEASE: 3, CONNECTION: 1 } },
        rooftop: { text: 'Find a rooftop', needs: { ESCAPE: 3, STIMULATION: 1 } },
        late_cafe: { text: 'Late-night café', needs: { COMFORT: 2, CONNECTION: 2 } },
        wander: { text: 'Wander alone', needs: { STIMULATION: 2, ESCAPE: 2 } }
      }
    }
  },
  
  activity: {
    create_something: {
      image: 'create_something.jpg',
      label: 'Create Something',
      question: 'How do you approach it?',
      actions: {
        pour_emotion: { text: 'Pour emotion into it', needs: { CATHARSIS: 3, CONNECTION: 1 } },
        challenge_self: { text: 'Challenge yourself', needs: { RELEASE: 3, STIMULATION: 1 } },
        explore_freely: { text: 'Explore freely', needs: { ESCAPE: 3, COMFORT: 1 } },
        follow_plan: { text: 'Follow a plan', needs: { STIMULATION: 3 } }
      }
    },
    solve_puzzle: {
      image: 'solve_puzzle.jpg',
      label: 'Solve Puzzle',
      question: 'What draws you?',
      actions: {
        satisfaction: { text: 'The satisfaction', needs: { STIMULATION: 3, COMFORT: 1 } },
        challenge: { text: 'The challenge', needs: { RELEASE: 3, STIMULATION: 1 } },
        distraction: { text: 'The distraction', needs: { ESCAPE: 3 } },
        process: { text: 'The process', needs: { STIMULATION: 2, COMFORT: 2 } }
      }
    },
    wander_freely: {
      image: 'wander_freely.jpg',
      label: 'Wander Freely',
      question: 'What calls to you?',
      actions: {
        discover: { text: 'What you might discover', needs: { ESCAPE: 3, STIMULATION: 1 } },
        solitude: { text: 'The solitude', needs: { ESCAPE: 2, COMFORT: 2 } },
        movement: { text: 'The movement', needs: { RELEASE: 2, ESCAPE: 2 } },
        aimlessness: { text: 'The aimlessness', needs: { COMFORT: 3, ESCAPE: 1 } }
      }
    },
    help_someone: {
      image: 'help_someone.jpg',
      label: 'Help Someone',
      question: 'What motivates you?',
      actions: {
        connection: { text: 'The connection', needs: { CONNECTION: 3, COMFORT: 1 } },
        making_difference: { text: 'Making a difference', needs: { CONNECTION: 2, RELEASE: 2 } },
        being_needed: { text: 'Being needed', needs: { CONNECTION: 3, CATHARSIS: 1 } },
        solving_problem: { text: 'Solving the problem', needs: { STIMULATION: 3, CONNECTION: 1 } }
      }
    }
  },
  
  object: {
    old_key: {
      image: 'old_key.jpg',
      label: 'Old Key',
      question: 'What draws you?',
      actions: {
        secrets: { text: 'Secrets it unlocks', needs: { ESCAPE: 3, STIMULATION: 1 } },
        history: { text: 'History it holds', needs: { STIMULATION: 3, CONNECTION: 1 } },
        craftsmanship: { text: 'Beauty of craft', needs: { COMFORT: 3, STIMULATION: 1 } },
        mystery: { text: 'Mystery it promises', needs: { ESCAPE: 2, RELEASE: 2 } }
      }
    },
    worn_blade: {
      image: 'worn_blade.jpg',
      label: 'Worn Blade',
      question: 'What calls to you?',
      actions: {
        battles_fought: { text: 'Battles it fought', needs: { RELEASE: 3, STIMULATION: 1 } },
        survival: { text: 'Survival it represents', needs: { RELEASE: 2, CATHARSIS: 2 } },
        warrior_bond: { text: 'Warrior who held it', needs: { CONNECTION: 3, CATHARSIS: 1 } },
        weapon_itself: { text: 'The weapon itself', needs: { RELEASE: 3, ESCAPE: 1 } }
      }
    },
    soft_candle: {
      image: 'soft_candle.jpg',
      label: 'Soft Candle',
      question: 'What draws you?',
      actions: {
        warmth: { text: 'The warmth', needs: { COMFORT: 3, CONNECTION: 1 } },
        intimacy: { text: 'The intimacy', needs: { CONNECTION: 3, COMFORT: 1 } },
        stillness: { text: 'The stillness', needs: { COMFORT: 2, CATHARSIS: 2 } },
        fragility: { text: 'The fragility', needs: { CATHARSIS: 3, CONNECTION: 1 } }
      }
    },
    cracked_mirror: {
      image: 'cracked_mirror.jpg',
      label: 'Cracked Mirror',
      question: 'What resonates?',
      actions: {
        fractures: { text: 'The fractures', needs: { CATHARSIS: 3, STIMULATION: 1 } },
        distortion: { text: 'The distortion', needs: { STIMULATION: 3, ESCAPE: 1 } },
        shattered_truth: { text: 'Shattered truth', needs: { CATHARSIS: 2, STIMULATION: 2 } },
        beauty_in_broken: { text: 'Beauty in broken', needs: { CATHARSIS: 2, COMFORT: 2 } }
      }
    }
  },
  
  time: {
    time_of_day: {
      image: 'time_cycle.jpg',
      label: 'Time of Day',
      question: 'What time resonates?',
      actions: {
        dawn: { text: 'Dawn', needs: { COMFORT: 2, ESCAPE: 2 } },
        midday: { text: 'Midday', needs: { RELEASE: 2, STIMULATION: 2 } },
        dusk: { text: 'Dusk', needs: { CATHARSIS: 3, CONNECTION: 1 } },
        midnight: { text: 'Midnight', needs: { ESCAPE: 3, RELEASE: 1 } }
      }
    }
  },
  
  weather: {
    atmospheric_state: {
      image: 'weather_states.jpg',
      label: 'Sky Above',
      question: '',
      actions: {
        steady_rain: { text: 'Steady rain', needs: { CATHARSIS: 3, COMFORT: 1 } },
        violent_storm: { text: 'Violent storm', needs: { RELEASE: 3, CATHARSIS: 1 } },
        soft_overcast: { text: 'Soft overcast', needs: { COMFORT: 3, STIMULATION: 1 } },
        clearing_sky: { text: 'Clearing sky', needs: { COMFORT: 2, ESCAPE: 2 } }
      }
    }
  },
  
  texture: {
    rough_stone: {
      image: 'rough_stone.jpg',
      label: 'Rough Stone',
      question: 'What draws you?',
      actions: {
        harshness: { text: 'The harshness', needs: { RELEASE: 3, CATHARSIS: 1 } },
        endurance: { text: 'The endurance', needs: { CATHARSIS: 3, RELEASE: 1 } },
        texture: { text: 'The texture', needs: { STIMULATION: 3 } },
        permanence: { text: 'The permanence', needs: { COMFORT: 2, STIMULATION: 1 } }
      }
    },
    soft_fabric: {
      image: 'soft_fabric.jpg',
      label: 'Soft Fabric',
      question: 'What appeals to you?',
      actions: {
        gentleness: { text: 'The gentleness', needs: { COMFORT: 3, CONNECTION: 1 } },
        warmth: { text: 'The warmth', needs: { COMFORT: 3 } },
        familiarity: { text: 'The familiarity', needs: { COMFORT: 2, CONNECTION: 2 } },
        softness: { text: 'The softness', needs: { COMFORT: 3, CATHARSIS: 1 } }
      }
    },
    sharp_crystal: {
      image: 'sharp_crystal.jpg',
      label: 'Sharp Crystal',
      question: 'What fascinates you?',
      actions: {
        precision: { text: 'The precision', needs: { STIMULATION: 3, COMFORT: 1 } },
        edges: { text: 'The edges', needs: { RELEASE: 2, STIMULATION: 2 } },
        refraction: { text: 'The refraction', needs: { ESCAPE: 3, STIMULATION: 1 } },
        clarity: { text: 'The clarity', needs: { STIMULATION: 2, CATHARSIS: 2 } }
      }
    },
   flowing_water: {
  image: 'flowing_water.jpg',
  label: 'A River Passes By',
  question: 'You stop for a moment. What draws you in?',
  actions: {
    movement: { text: 'The movement', needs: { ESCAPE: 3, RELEASE: 1 } },
    transformation: { text: 'The transformation', needs: { CATHARSIS: 3, ESCAPE: 1 } },
    sound: { text: 'The sound', needs: { COMFORT: 3, ESCAPE: 1 } },
    fluidity: { text: 'The rhythm of it', needs: { ESCAPE: 2, STIMULATION: 2 } }
  }
},
  
color: {
    warm_reds_oranges: {
      image: 'warm_tones.jpg',
      label: '',
      question: 'What atmosphere are you drawn to right now?',
      actions: {
        passion: { text: 'Something warm and alive', needs: { RELEASE: 3, CONNECTION: 1 } },
        energy: { text: 'Something urgent and charged', needs: { RELEASE: 3, ESCAPE: 1 } },
        warmth: { text: 'Something cozy and close', needs: { COMFORT: 3, CONNECTION: 1 } },
        vibrancy: { text: 'Something bold and vivid', needs: { ESCAPE: 2, STIMULATION: 2 } }
      }
    },
    cool_blues_purples: {
      image: 'cool_tones.jpg',
      label: '',
      question: 'What atmosphere are you drawn to right now?',
      actions: {
        distance: { text: 'Something vast and remote', needs: { ESCAPE: 3, STIMULATION: 1 } },
        mystery: { text: 'Something shadowy and unknown', needs: { ESCAPE: 2, STIMULATION: 2 } },
        calm: { text: 'Something still and quiet', needs: { COMFORT: 3, CATHARSIS: 1 } },
        depth: { text: 'Something deep and layered', needs: { STIMULATION: 3, CATHARSIS: 1 } }
      }
    },
    soft_yellows_greens: {
      image: 'soft_tones.jpg',
      label: '',
      question: 'What atmosphere are you drawn to right now?',
      actions: {
        ease: { text: 'Something light and effortless', needs: { COMFORT: 3, ESCAPE: 1 } },
        growth: { text: 'Something fresh and alive', needs: { ESCAPE: 2, CONNECTION: 2 } },
        lightness: { text: 'Something gentle and unhurried', needs: { COMFORT: 3, CATHARSIS: 1 } },
        nature: { text: 'Something open and natural', needs: { COMFORT: 2, ESCAPE: 2 } }
      }
    },
    stark_black_white: {
      image: 'contrast_tones.jpg',
      label: '',
      question: 'What atmosphere are you drawn to right now?',
      actions: {
        clarity: { text: 'Something sharp and clear', needs: { STIMULATION: 3, RELEASE: 1 } },
        drama: { text: 'Something stark and dramatic', needs: { RELEASE: 3, CATHARSIS: 1 } },
        simplicity: { text: 'Something stripped and simple', needs: { COMFORT: 2, STIMULATION: 2 } },
        tension: { text: 'Something tense and unresolved', needs: { RELEASE: 2, CATHARSIS: 2 } }
      }
    }
  }
};

export const getRandomScenario = (category, recentlyUsed = []) => {
  const scenarios = INTUITIVE_SCENARIOS[category];
  const scenarioKeys = Object.keys(scenarios);
  const available = scenarioKeys.filter(key => !recentlyUsed.includes(key));
  const pool = available.length > 0 ? available : scenarioKeys;
  const randomKey = pool[Math.floor(Math.random() * pool.length)];
  return { key: randomKey, scenario: scenarios[randomKey] };
};

export const getRandomWeatherFraming = () => {
  return WEATHER_FRAMINGS[Math.floor(Math.random() * WEATHER_FRAMINGS.length)];
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateEmotionalNeeds = (intuitiveAnswers) => {
  const needScores = {
    ESCAPE: 0,
    RELEASE: 0,
    COMFORT: 0,
    STIMULATION: 0,
    CONNECTION: 0,
    CATHARSIS: 0
  };
  
  console.log('🎭 Calculating emotional needs from answers:', intuitiveAnswers);
  
  Object.entries(intuitiveAnswers).forEach(([category, answer]) => {
    const { scenarioKey, actionKey } = answer;
    const scenario = INTUITIVE_SCENARIOS[category][scenarioKey];
    if (scenario && scenario.actions[actionKey]) {
      const actionNeeds = scenario.actions[actionKey].needs;
      Object.entries(actionNeeds).forEach(([need, points]) => {
        needScores[need] += points;
      });
      console.log(`  ${category} → ${actionKey}:`, actionNeeds);
    }
  });
  
  console.log('🎯 Total emotional need scores:', needScores);
  return needScores;
};

export const convertEmotionalNeedsToGenres = (emotionalNeeds) => {
  const genreScores = {};
  
  console.log('🎬 Converting emotional needs to genres...');
  
  const sortedNeeds = Object.entries(emotionalNeeds)
    .sort(([,a], [,b]) => b - a)
    .filter(([,score]) => score > 0);
  
  console.log('📊 Needs ranked:', sortedNeeds.map(([need, score]) => `${need}: ${score}`));
  
  sortedNeeds.forEach(([need, score], index) => {
    const mapping = NEED_TO_GENRE_MAPPING[need];
    if (!mapping) return;
    
    const rankWeight = index === 0 ? 1.0 : index === 1 ? 0.75 : index === 2 ? 0.6 : 0.4;
    
    console.log(`  ${need} (rank ${index + 1}, weight ${rankWeight}):`);
    
    mapping.primary.forEach(({ genre, weight }) => {
      const contribution = weight * rankWeight;
      genreScores[genre] = (genreScores[genre] || 0) + contribution;
      console.log(`    Genre ${genre}: +${contribution.toFixed(2)}`);
    });
    
    mapping.secondary.forEach(({ genre, weight }) => {
      const contribution = weight * rankWeight;
      genreScores[genre] = (genreScores[genre] || 0) + contribution;
      console.log(`    Genre ${genre}: +${contribution.toFixed(2)}`);
    });
  });
  
  console.log('🏆 Final intuitive genre scores:', genreScores);
  return genreScores;
};

export const calculateIntuitiveScore = (intuitiveAnswers, userPrefs = {}) => {
  console.log('🎭 INTUITIVE MODE SCORING STARTED');
  
  const emotionalNeeds = calculateEmotionalNeeds(intuitiveAnswers);
  const intuitiveGenreScores = convertEmotionalNeedsToGenres(emotionalNeeds);
  
  const tasteWeight = 0.4;
  const intuitiveWeight = 0.6;
  
  const finalGenreScores = {};
  
  Object.keys(intuitiveGenreScores).forEach(genreId => {
    const intuitiveScore = intuitiveGenreScores[genreId] || 0;
    const tasteScore = userPrefs.genreWeights?.[genreId] || 0;
    finalGenreScores[genreId] = (intuitiveScore * intuitiveWeight) + (tasteScore * tasteWeight);
  });
  
  if (userPrefs.genreWeights) {
    Object.keys(userPrefs.genreWeights).forEach(genreId => {
      if (!finalGenreScores[genreId]) {
        const tasteScore = userPrefs.genreWeights[genreId] || 0;
        finalGenreScores[genreId] = tasteScore * tasteWeight;
      }
    });
  }
  
  console.log('💝 Final scores after Letterboxd merge (60% intuitive / 40% taste):', finalGenreScores);
  
  return finalGenreScores;
};


