import React, { useState, useEffect } from 'react';
import { fetchMoviesByGenre, fetchMovieDetails } from './tmdbApi';
import { parseLetterboxdCSV, analyzeUserTaste, combineRatingsWithTaste } from './letterboxdApi'; 
import { Play, RotateCcw, Settings, Star, ThumbsUp, Circle, Triangle, Square, Waves, Sparkles, Leaf, Flame, Cloud, Sun, Box, Globe, Helix, BookOpen, Lamp, Hammer, Key, Mirror, Bridge } from 'lucide-react';// HYBRID SCORING SYSTEM
// ========================================
// DESIGN: Each mood answer gives Primary(5) + Secondary(2) + Tertiary(1) points to different genres
// BENEFIT: Prevents point inflation, easy to tune, future-proof for question rotation

// TMDB Genre IDs (verified)
const TMDB_GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,          // 
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,        //  
  DRAMA: 18,
  FANTASY: 14,
  HORROR: 27,
  MUSIC: 10402,           //  (for Musical)
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37
};

// ========================================
// TRAIT-BASED ARCHITECTURE
// ========================================
const TRAITS = [
  'futuristic', 'adventurous', 'mysterious', 'heartwarming', 
  'dark', 'humorous', 'intense', 'romantic', 'thrilling', 'whimsical'
];

//-Trait Keywords from the TMDB data base

const TRAIT_TO_KEYWORDS = {
  intense: [9748, 1299, 10410, 207317],
  thrilling: [10051, 849, 4289, 10410],
  mysterious: [207046, 10629, 9748],
  heartwarming: [6054, 10683, 11436, 3616],
  romantic: [9799, 10555],
  dark: [5565, 207261, 4565]
};
const ERA_GENRE_KEYWORDS = {
  // 1940s-1960s Golden Age
  golden: {
    [TMDB_GENRES.DRAMA]: [11436, 6054, 10683],           // redemption, friendship, family
    [TMDB_GENRES.THRILLER]: [207046, 4565, 9748],        // film-noir, mystery, detective
    [TMDB_GENRES.ROMANCE]: [10340, 4344, 9799],          // classic-romance, musical, romance
    [TMDB_GENRES.ADVENTURE]: [4759, 162342, 157155],     // exploration, discovery, explorer
    [TMDB_GENRES.SCIENCE_FICTION]: [14544, 9951],        // space, alien (atomic-age sci-fi)
    [TMDB_GENRES.WAR]: [6054, 11436],                    // friendship, redemption (war epics)
    [TMDB_GENRES.WESTERN]: [9748, 11436]                 // revenge, redemption (classic westerns)
  },
  
  // 1970s New Hollywood
  seventies: {
    [TMDB_GENRES.THRILLER]: [10410, 9748, 207046],       // conspiracy, paranoia, investigation
    [TMDB_GENRES.DRAMA]: [11436, 3616, 10683],           // character-study, coming-of-age, family
    [TMDB_GENRES.CRIME]: [9748, 4565, 10051],            // neo-noir, gritty, heist
    [TMDB_GENRES.HORROR]: [1299, 9748],                  // survival, psychological
    [TMDB_GENRES.ACTION]: [849, 4289],                   // car-chase, espionage
    [TMDB_GENRES.SCIENCE_FICTION]: [9715, 14544, 9951]  // dystopia, space, alien
  },
  
  // 1980s-1990s Retro Era
  vintage: {
    [TMDB_GENRES.ACTION]: [849, 9748, 10051],            // chase, revenge, heist
    [TMDB_GENRES.COMEDY]: [5565, 4344, 6054],            // dark-comedy, musical, friendship
    [TMDB_GENRES.THRILLER]: [10410, 4289, 1299],         // conspiracy, espionage, survival
    [TMDB_GENRES.HORROR]: [1299, 207046],                // survival-horror, slasher
    [TMDB_GENRES.SCIENCE_FICTION]: [4379, 9951, 9715],   // time-travel, alien, dystopia
    [TMDB_GENRES.ROMANCE]: [9799, 3616, 10555],          // romance, coming-of-age, love-triangle
    [TMDB_GENRES.DRAMA]: [3616, 11436, 6054]             // coming-of-age, redemption, friendship
  },
  
  // 2000s-2015 Modern Era
  modern: {
    [TMDB_GENRES.THRILLER]: [10410, 207046, 10629],      // conspiracy, mystery, investigation
    [TMDB_GENRES.DRAMA]: [11436, 10683, 3616],           // redemption, family, coming-of-age
    [TMDB_GENRES.ACTION]: [10051, 849, 9748],            // heist, chase, revenge
    [TMDB_GENRES.COMEDY]: [5565, 6054],                  // dark-comedy, friendship
    [TMDB_GENRES.SCIENCE_FICTION]: [9715, 4379, 14544],  // dystopia, time-travel, space
    [TMDB_GENRES.HORROR]: [1299, 207046],                // survival, psychological-horror
    [TMDB_GENRES.CRIME]: [10051, 10410, 207046]          // heist, conspiracy, investigation
  },
  
  // 2016+ Current/Pop Era
  pop: {
    [TMDB_GENRES.ACTION]: [10051, 849],                  // heist, chase (modern blockbusters)
    [TMDB_GENRES.THRILLER]: [10410, 207046],             // conspiracy, mystery
    [TMDB_GENRES.DRAMA]: [11436, 10683],                 // redemption, family
    [TMDB_GENRES.COMEDY]: [6054, 5565],                  // friendship, dark-comedy
    [TMDB_GENRES.SCIENCE_FICTION]: [9715, 4379],         // dystopia, time-travel
    [TMDB_GENRES.HORROR]: [1299, 207046]                 // survival, psychological
  },
  
  // Timeless (wide range) - minimal keyword filtering
  timeless: {
    // Use trait-based keywords only, no era-specific filtering
  }
};
const AESTHETIC_GENRE_KEYWORDS = {
  // NEON - Electric, cyberpunk, urban night aesthetics
  neon: {
    [TMDB_GENRES.THRILLER]: [10410, 4289],        // conspiracy, espionage
    [TMDB_GENRES.SCIENCE_FICTION]: [9715, 14544], // dystopia, cyberpunk-adjacent
    [TMDB_GENRES.ACTION]: [849, 4289],            // chase, espionage (urban action)
    [TMDB_GENRES.CRIME]: [10051, 4565]            // heist, neo-noir (neon-lit crime)
  },
  
  // GOLD/VELVET - Classic, elegant, old Hollywood glamour
  gold: {
    [TMDB_GENRES.DRAMA]: [11436, 10340],          // redemption, classic-drama
    [TMDB_GENRES.ROMANCE]: [10340, 9799],         // classic-romance, romance
    [TMDB_GENRES.THRILLER]: [4565, 207046],       // film-noir, mystery
    [TMDB_GENRES.MYSTERY]: [207046, 9748]         // murder-mystery, detective
  },
  
  // EARTH/NATURAL - Organic, grounded, raw textures
  earth: {
    [TMDB_GENRES.DRAMA]: [11436, 3616, 1299],     // redemption, coming-of-age, survival
    [TMDB_GENRES.WESTERN]: [9748, 11436],         // revenge, redemption (dusty westerns)
    [TMDB_GENRES.ADVENTURE]: [4759, 1299],        // exploration, survival (wilderness)
    [TMDB_GENRES.THRILLER]: [1299, 10629]         // survival, investigation (gritty)
  },
  
  // SHADOW/NOIR - Dark, mysterious, high contrast
  shadow: {
    [TMDB_GENRES.THRILLER]: [4565, 207046, 10410], // neo-noir, mystery, conspiracy
    [TMDB_GENRES.CRIME]: [4565, 9748, 10051],      // neo-noir, detective, heist
    [TMDB_GENRES.MYSTERY]: [207046, 9748],         // murder-mystery, detective
    [TMDB_GENRES.HORROR]: [207046, 1299]           // psychological, survival
  },
  
  // MINIMALIST/ICE - Clean, stark, modern aesthetic
  ice: {
    [TMDB_GENRES.SCIENCE_FICTION]: [9715, 14544], // dystopia, space (sterile sci-fi)
    [TMDB_GENRES.THRILLER]: [10410, 10629],       // conspiracy, investigation (clinical)
    [TMDB_GENRES.DRAMA]: [11436, 10683],          // redemption, family (austere dramas)
    [TMDB_GENRES.CRIME]: [10629, 10410]           // investigation, conspiracy
  },
  
  // COMFORT/COZY - Warm, inviting, nostalgic
  comfort: {
    [TMDB_GENRES.COMEDY]: [6054, 10683],          // friendship, family
    [TMDB_GENRES.ROMANCE]: [9799, 6054],          // romance, friendship
    [TMDB_GENRES.DRAMA]: [10683, 3616, 6054],     // family, coming-of-age, friendship
    [TMDB_GENRES.ANIMATION]: [6054, 10683]        // friendship, family (Pixar-style)
  }
};
// Genre-to-Trait Affinities (0-5 scale)
const GENRE_TO_TRAIT_AFFINITIES = {
  [TMDB_GENRES.SCIENCE_FICTION]: { futuristic: 5, mysterious: 3, intense: 2, thrilling: 2 },
  [TMDB_GENRES.HORROR]: { dark: 5, intense: 4, thrilling: 4, mysterious: 3 },
  [TMDB_GENRES.COMEDY]: { humorous: 5, heartwarming: 3, whimsical: 2 },
  [TMDB_GENRES.ROMANCE]: { romantic: 5, heartwarming: 4, whimsical: 2 },
  [TMDB_GENRES.ACTION]: { intense: 5, thrilling: 4, adventurous: 3 },
  [TMDB_GENRES.ADVENTURE]: { adventurous: 5, thrilling: 3, mysterious: 2 },
  [TMDB_GENRES.DRAMA]: { heartwarming: 3, intense: 3, mysterious: 2 },
  [TMDB_GENRES.THRILLER]: { thrilling: 5, intense: 4, dark: 3, mysterious: 3 },
  [TMDB_GENRES.MYSTERY]: { mysterious: 5, thrilling: 3, dark: 2 },
  [TMDB_GENRES.FANTASY]: { whimsical: 4, adventurous: 3, mysterious: 3 },
  [TMDB_GENRES.ANIMATION]: { whimsical: 5, humorous: 3, heartwarming: 3, adventurous: 2 },
  [TMDB_GENRES.CRIME]: { dark: 4, intense: 4, thrilling: 3 },
  [TMDB_GENRES.WAR]: { intense: 5, dark: 4, heartwarming: 2 },
  [TMDB_GENRES.WESTERN]: { adventurous: 4, intense: 3, dark: 2 },
  [TMDB_GENRES.DOCUMENTARY]: { mysterious: 2, heartwarming: 2 },
  [TMDB_GENRES.MUSIC]: { heartwarming: 4, whimsical: 3, romantic: 2 }
};

// ========================================
// TRAIT COMPUTATION
// ========================================
const computeTraitScores = (allowedGenres) => {
  const traitScores = {};
  
  // Initialize all traits to 0
  TRAITS.forEach(trait => {
    traitScores[trait] = 0;
  });
  
  // Sum trait affinities from all allowed genres
  allowedGenres.forEach(genreId => {
    const affinities = GENRE_TO_TRAIT_AFFINITIES[genreId];
    if (affinities) {
      Object.entries(affinities).forEach(([trait, score]) => {
        traitScores[trait] += score;
      });
    }
  });
  
  console.log('🎨 Trait scores for allowed genres:', traitScores);
  return traitScores;
};

// ========================================
// TRAIT-BASED MOVIE SCORING
// ========================================
const scoreMovieByTraits = (movie, traitScores) => {
  let movieScore = 0;
  
  // Score movie based on its genres' trait affinities
  movie.genre_ids?.forEach(genreId => {
    const affinities = GENRE_TO_TRAIT_AFFINITIES[genreId];
    if (affinities) {
      Object.entries(affinities).forEach(([trait, affinity]) => {
        movieScore += (traitScores[trait] || 0) * affinity;
      });
    }
  });
  
  return movieScore;
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
    },
    gold: {
      primary: TMDB_GENRES.FANTASY,           // +5 pts (opulent, magical vibe)
      secondary: TMDB_GENRES.ADVENTURE,       // +2 pts
      tertiary: TMDB_GENRES.DRAMA             // +1 pt
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
  },
  explosive: {
    primary: TMDB_GENRES.ACTION,            // +4 pts
    secondary: TMDB_GENRES.HORROR,          // +2 pts
    tertiary: TMDB_GENRES.THRILLER          // +1 pt
  },
  contemplative: {
    primary: TMDB_GENRES.MYSTERY,           // +4 pts
    secondary: TMDB_GENRES.DRAMA,           // +2 pts
    tertiary: TMDB_GENRES.SCIENCE_FICTION   // +1 pt
  }
},
  character: {
    struggle: {
      primary: TMDB_GENRES.DRAMA,             // +6 pts
      secondary: TMDB_GENRES.MYSTERY,         // +2 pts
      tertiary: null
    },
    triumph: {
      primary: TMDB_GENRES.ACTION,            // +6 pts
      secondary: TMDB_GENRES.ADVENTURE,       // +2 pts
      tertiary: null
    },
    flawed: {
      primary: TMDB_GENRES.CRIME,             // +6 pts
      secondary: TMDB_GENRES.THRILLER,        // +2 pts
      tertiary: null
    },
    heroic: {
      primary: TMDB_GENRES.ADVENTURE,         // +6 pts
      secondary: TMDB_GENRES.ACTION,          // +2 pts
      tertiary: null
    },
    complex: {
      primary: TMDB_GENRES.MYSTERY,           // +6 pts
      secondary: TMDB_GENRES.DRAMA,           // +2 pts
      tertiary: null
    },
    ocean: {
      primary: TMDB_GENRES.ADVENTURE,         // +6 pts (boundless quests)
      secondary: TMDB_GENRES.FANTASY,         // +2 pts
      tertiary: TMDB_GENRES.DRAMA             // +1 pt
    },
    driven: {
      primary: TMDB_GENRES.THRILLER,          // +6 pts
      secondary: TMDB_GENRES.CRIME,           // +2 pts
      tertiary: null
    }
  },
  era: {
    vintage: {
      primary: TMDB_GENRES.DRAMA,             // +3 pts
      secondary: TMDB_GENRES.HISTORY,         // +2 pts
      tertiary: TMDB_GENRES.ROMANCE           // +1 pt
    },
    gritty: {
      primary: TMDB_GENRES.CRIME,             // +3 pts
      secondary: TMDB_GENRES.THRILLER,        // +2 pts
      tertiary: TMDB_GENRES.DRAMA             // +1 pt
    },
    electric: {
      primary: TMDB_GENRES.ACTION,            // +3 pts
      secondary: TMDB_GENRES.SCIENCE_FICTION, // +2 pts
      tertiary: TMDB_GENRES.COMEDY            // +1 pt
    },
    digital: {
      primary: TMDB_GENRES.SCIENCE_FICTION,   // +3 pts
      secondary: TMDB_GENRES.THRILLER,        // +2 pts
      tertiary: TMDB_GENRES.ACTION            // +1 pt
    },
    noir: {
      primary: TMDB_GENRES.MYSTERY,           // +3 pts
      secondary: TMDB_GENRES.CRIME,           // +2 pts
      tertiary: TMDB_GENRES.THRILLER          // +1 pt
    },
    pop: {
      primary: TMDB_GENRES.COMEDY,            // +3 pts
      secondary: TMDB_GENRES.ADVENTURE,       // +2 pts
      tertiary: TMDB_GENRES.ROMANCE           // +1 pt
    }
  },
  discovery: {
    new: {
      primary: TMDB_GENRES.ADVENTURE,         // +5 pts (fresh, exploratory)
      secondary: TMDB_GENRES.FANTASY,         // +2 pts
      tertiary: TMDB_GENRES.COMEDY            // +1 pt
    },
    comfort: {
      primary: TMDB_GENRES.ROMANCE,           // +5 pts (cozy, nostalgic)
      secondary: TMDB_GENRES.DRAMA,           // +2 pts
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
    },
    contemplative: {
      primary: TMDB_GENRES.DRAMA,             // +5 pts
      secondary: TMDB_GENRES.ROMANCE,         // +2 pts
      tertiary: TMDB_GENRES.HISTORY           // +1 pt
    },
    visceral: {
      primary: TMDB_GENRES.ACTION,            // +5 pts
      secondary: TMDB_GENRES.THRILLER,        // +2 pts
      tertiary: TMDB_GENRES.HORROR            // +1 pt
    },
    emotional: {
      primary: TMDB_GENRES.ROMANCE,           // +5 pts
      secondary: TMDB_GENRES.DRAMA,           // +2 pts
      tertiary: TMDB_GENRES.COMEDY            // +1 pt
    },
    analytical: {
      primary: TMDB_GENRES.SCIENCE_FICTION,   // +5 pts
      secondary: TMDB_GENRES.MYSTERY,         // +2 pts
      tertiary: TMDB_GENRES.THRILLER          // +1 pt
    }
    },
  path: {  // ← MUST be inside MOOD_SCORING with a comma after mood
    upstairs: {
      primary: TMDB_GENRES.ACTION,
      secondary: TMDB_GENRES.THRILLER,
      tertiary: TMDB_GENRES.ADVENTURE
    },
    downstairs: {
      primary: TMDB_GENRES.MYSTERY,
      secondary: TMDB_GENRES.HORROR,
      tertiary: TMDB_GENRES.DRAMA
    },
    hallway: {
      primary: TMDB_GENRES.DRAMA,
      secondary: TMDB_GENRES.SCIENCE_FICTION,
      tertiary: TMDB_GENRES.ROMANCE
    }
  }
};
// ========================================
// SYMBOL GROUPS - ROTATING SELECTIONS
// ========================================
const SYMBOL_GROUPS = {
  geometry: [
    { id: 'circle', svg: 'circle', traits: { heartwarming: 3, romantic: 3, whimsical: 2 } },
    { id: 'triangle', svg: 'triangle', traits: { intense: 4, thrilling: 3, dark: 2 } },
    { id: 'square', svg: 'square', traits: { mysterious: 3, dark: 2, intense: 2 } },
    { id: 'wave', svg: 'wave', traits: { romantic: 4, mysterious: 3, whimsical: 2 } },
    { id: 'star', svg: 'star', traits: { adventurous: 4, futuristic: 3, thrilling: 2 } },
    { id: 'spiral', svg: 'spiral', traits: { mysterious: 4, dark: 3, intense: 2 } }
  ],
  natural: [
    { id: 'leaf', svg: 'leaf', traits: { whimsical: 4, heartwarming: 3 } },
    { id: 'flame', svg: 'flame', traits: { thrilling: 4, intense: 3, dark: 2 } },
    { id: 'wave', svg: 'wave', traits: { mysterious: 4, adventurous: 3, romantic: 2 } },
    { id: 'stone', svg: 'stone', traits: { intense: 3, mysterious: 2, dark: 2 } },
    { id: 'cloud', svg: 'cloud', traits: { whimsical: 4, romantic: 3, heartwarming: 2 } },
    { id: 'sun', svg: 'sun', traits: { heartwarming: 4, thrilling: 3, adventurous: 2 } }
  ],
  forms3d: [
    { id: 'pyramid', svg: 'pyramid', traits: { mysterious: 4, intense: 3, dark: 2 } },
    { id: 'cube', svg: 'cube', traits: { mysterious: 3, intense: 2 } },
    { id: 'sphere', svg: 'sphere', traits: { heartwarming: 4, whimsical: 3, romantic: 2 } },
    { id: 'cylinder', svg: 'cylinder', traits: { mysterious: 2, intense: 2 } },
    { id: 'cone', svg: 'cone', traits: { thrilling: 3, adventurous: 2 } },
    { id: 'helix', svg: 'helix', traits: { mysterious: 4, futuristic: 3, thrilling: 2 } }
  ],
  artifacts: [
    { id: 'book', svg: 'book', traits: { mysterious: 4, heartwarming: 3 } },
    { id: 'lantern', svg: 'lantern', traits: { mysterious: 3, romantic: 3, heartwarming: 2 } },
    { id: 'hammer', svg: 'hammer', traits: { intense: 4, thrilling: 3 } },
    { id: 'key', svg: 'key', traits: { mysterious: 4, adventurous: 3 } },
    { id: 'mirror', svg: 'mirror', traits: { mysterious: 3, romantic: 2, dark: 2 } },
    { id: 'bridge', svg: 'bridge', traits: { adventurous: 4, heartwarming: 3, romantic: 2 } }
  ], 
};
// Hybrid Scoring Configuration - Easy to Tweak
const SCORING_WEIGHTS = {
  symbols: { primary: 2, secondary: 1, tertiary: 1 },
  aesthetic: { primary: 5, secondary: 2, tertiary: 1 },
  energy: { primary: 4, secondary: 2, tertiary: 1 },
  character: { primary: 6, secondary: 2, tertiary: 0 }, // Character gets more weight
  era: { primary: 3, secondary: 2, tertiary: 1 },      // Era gets less weight
  mood: { primary: 5, secondary: 2, tertiary: 1 },
  discovery: { primary: 2, secondary: 1, tertiary: 0 },  // Discovery is modifier, not core
  path: { primary: 5, secondary: 2, tertiary: 1 } 
};

const getKeywordsFromTraits = (userPrefs) => {
  // Get trait scores from symbol selection
  const traitScores = userPrefs.symbolTraits || {};
   // Find top 2 traits with highest scores
  const sortedTraits = Object.entries(traitScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([trait]) => trait);

  console.log('🎭 Top traits for keywords:', sortedTraits);
  
  // Collect keywords from top traits
  const keywords = [];
  sortedTraits.forEach(trait => {
    if (TRAIT_TO_KEYWORDS[trait]) {
      keywords.push(...TRAIT_TO_KEYWORDS[trait]);
    }
  });
  
  // Remove duplicates and limit to 6 keywords max
  const uniqueKeywords = [...new Set(keywords)].slice(0, 6); 
  return uniqueKeywords;
};

const prioritizeByGenrePosition = (movies, targetGenreId) => {
  // Score each movie based on target genre position
  const scoredMovies = movies.map(movie => {
    const genrePosition = movie.genre_ids?.indexOf(targetGenreId);
    
    // Scoring: primary=100, secondary=50, tertiary=25, not found=0
    let positionScore = 0;
    if (genrePosition === 0) positionScore = 100;      // Primary genre
    else if (genrePosition === 1) positionScore = 50;  // Secondary genre
    else if (genrePosition === 2) positionScore = 25;  // Tertiary genre
    else if (genrePosition > 2) positionScore = 10;    // Beyond tertiary
    
    return {
      ...movie,
      genrePositionScore: positionScore
    };
  });
  
  // Sort by position score (highest first), then by vote_average as tiebreaker
  const sorted = scoredMovies.sort((a, b) => {
    if (b.genrePositionScore !== a.genrePositionScore) {
      return b.genrePositionScore - a.genrePositionScore;
    }
    return (b.vote_average || 0) - (a.vote_average || 0);
  });
  
  console.log('📊 Genre position distribution:', {
    primary: sorted.filter(m => m.genrePositionScore === 100).length,
    secondary: sorted.filter(m => m.genrePositionScore === 50).length,
    tertiary: sorted.filter(m => m.genrePositionScore === 25).length
  });
  
  return sorted;
};


const getUnusedSymbolGroup = (recentGroups = []) => {
  const allGroups = Object.keys(SYMBOL_GROUPS);
  
  // Filter out recently used groups
  const availableGroups = allGroups.filter(group => !recentGroups.includes(group));
  
  console.log('🔄 Recent groups:', recentGroups);
  console.log('🎲 Available groups:', availableGroups);
  
  // If all groups have been used, reset the rotation
  if (availableGroups.length === 0) {
    console.log('♻️ All groups used, resetting rotation');
    return allGroups[Math.floor(Math.random() * allGroups.length)];
  }
  
  // Return random group from available options
  return availableGroups[Math.floor(Math.random() * availableGroups.length)];
};  // ← ADD THESE TWO LINES

// NOW add Step 2 function here
const getAestheticGenreKeywords = (aestheticAnswer, primaryGenre) => {
  if (!aestheticAnswer || !AESTHETIC_GENRE_KEYWORDS[aestheticAnswer]) {
    return [];
  }
  
  const aestheticKeywords = AESTHETIC_GENRE_KEYWORDS[aestheticAnswer]?.[primaryGenre] || [];
  
  console.log('🎨 Aesthetic-Genre keywords:', aestheticAnswer, primaryGenre, aestheticKeywords);
  
  return aestheticKeywords;
};

const getAllKeywords = (moodAnswers, primaryGenre, userPrefs) => {
  // Layer 1: Era-genre keywords (highest priority - defines time period)
  const eraAnswer = moodAnswers.era;
  const eraKeywords = getEraGenreKeywords(eraAnswer, primaryGenre, userPrefs) || [];
  
  // Layer 2: Aesthetic-genre keywords (visual style)
  const aestheticAnswer = moodAnswers.aesthetic;
  const aestheticKeywords = getAestheticGenreKeywords(aestheticAnswer, primaryGenre) || [];
  
  // Layer 3: Trait keywords (emotional resonance - lowest priority)
  const traitKeywords = getKeywordsFromTraits(userPrefs) || [];
  
  console.log('🔑 Keyword layers - Era:', eraKeywords.length, 'Aesthetic:', aestheticKeywords.length, 'Traits:', traitKeywords.length);
  
  // Merge with priority: era first, then aesthetic, then traits
  // Remove duplicates but preserve order (era keywords stay at front)
  const combined = [...new Set([...eraKeywords, ...aestheticKeywords, ...traitKeywords])];
  
  console.log('🔑 Total combined keywords:', combined.length, '→ limited to 8');
  
  // Limit to 8 keywords max for API efficiency
  return combined.slice(0, 8);
};

const getEraGenreKeywords = (eraAnswer, primaryGenre, userPrefs) => {
  // Get trait-based keywords (existing system)
  const traitKeywords = getKeywordsFromTraits(userPrefs);
    
  // Map era answer to era category
  const eraMap = {
   vintage: 'golden',      // Sepia & Burgundy → 1940s-1960s classic
   gritty: 'seventies',    // Earth & Concrete → 1970s gritty realism
   electric: 'vintage',    // Neon & Chrome → 1980s-1990s retro
   digital: 'modern', 
   modern: 'modern', 
   timeless: 'timeless',
   pop: 'pop',
   noir: 'golden',         // Shadow & Smoke → 1940s-1950s film noir
   pop: 'pop',
   classic: 'golden'
  };
  
  const eraCategory = eraMap[eraAnswer] || 'timeless';
  
  // Get era-specific genre keywords
  const eraGenreKeywords = ERA_GENRE_KEYWORDS[eraCategory]?.[primaryGenre] || [];
  
  // Merge: prioritize era-genre keywords, then add trait keywords
  const combinedKeywords = [...new Set([...eraGenreKeywords, ...traitKeywords])];
  
  console.log('🎬 Era-Genre keywords:', eraCategory, primaryGenre, eraGenreKeywords);
  console.log('🎨 Trait keywords:', traitKeywords);
  console.log('🔑 Combined keywords:', combinedKeywords);
  
  // Limit to 8 keywords max for API efficiency
  return combinedKeywords.slice(0, 8);
};

 // ========================================
// TASTE THRESHOLD GENERATION
// ========================================
const generateTasteThresholds = (tasteProfile) => {
  if (!tasteProfile || !tasteProfile.lovedMovies) {
    return {}; // Return empty if no taste data
  }
  
  const thresholds = {};
  
  // For each TMDB genre, set a baseline threshold
  
  Object.values(TMDB_GENRES).forEach(genreId => {
    thresholds[genreId] = {
      highPercentile: 7.0 // Default TMDB rating threshold
    };
  });
  
  return thresholds;
};

const applyQualityBoost = (movie, tasteThresholds) => {
  const primaryGenreId = movie.genre_ids?.[0]; // Fix property access
  const genreThreshold = tasteThresholds[primaryGenreId]; 
  let boost = movie.vote_average; 
  if (genreThreshold && movie.vote_average >= genreThreshold.highPercentile) boost += 1; 
  return boost;
};

// ========================================
// MAIN SCORING FUNCTION
// ========================================
const calculateMoodScore = (moodAnswers) => {
  console.log('🎯 Calculating scores for answers:', moodAnswers);
  
  const genreScores = {};
  let modifiers = {};

  // Process each mood answer
 Object.entries(moodAnswers).forEach(([questionType, answer]) => {
    
    const scoring = MOOD_SCORING[questionType]?.[answer];
    const weights = SCORING_WEIGHTS[questionType];
   
    
    if (!scoring || !weights) {
      console.log(`⚠️ Missing scoring for ${questionType}:${answer}`);
      console.log('Available options for', questionType, ':', Object.keys(MOOD_SCORING[questionType] || {})); // CHANGED category to questionType
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
    topGenres: rankedGenres.slice(0, 3),
    modifiers: modifiers,
    primaryGenre: rankedGenres[0]?.id || TMDB_GENRES.ACTION
  };
}; 

// ========================================
// INTEGRATION READY FUNCTION
// ========================================
// This replaces the TMDB API call in generateRecommendations
// ========================================
// ENHANCED MOOD + TASTE INTEGRATION
// ========================================
const getMoodBasedMovies = async (moodAnswers, tasteProfile = null, excludedGenreIds = [], userPrefs = {}) => {
  console.log('🎯 Starting mood + taste integration');
  
  const moodScore = calculateMoodScore(moodAnswers);
  let finalGenreSelection = moodScore.primaryGenre;
  
  // If user has taste data, apply 60/40 weighting
  if (tasteProfile && tasteProfile.lovedMovies.length > 0) {
    console.log('💝 Applying taste weighting (60% taste, 40% mood)');
    finalGenreSelection = applyTasteWeighting(moodScore, tasteProfile);
  } else {
    console.log('🎭 Using pure mood scoring (no taste data)');
  }
  
  // Skip excluded genres
  if (excludedGenreIds && excludedGenreIds.length > 0) {
    console.log('🔍 Current excluded array:', excludedGenreIds);
    const allowedGenres = Object.values(TMDB_GENRES).filter(genreId => !excludedGenreIds.includes(genreId));
    
    // If selected genre isn't allowed, find a replacement
    if (excludedGenreIds.includes(finalGenreSelection)) {
      console.log('⚠️ Primary genre excluded, using secondary');
      const allowedGenre = moodScore.topGenres.find(g => !excludedGenreIds.includes(g.id));
      finalGenreSelection = allowedGenre?.id || allowedGenres[0] || TMDB_GENRES.ACTION;
    }
    
    console.log('🎯 Allowed genres:', allowedGenres.map(id => Object.keys(TMDB_GENRES).find(key => TMDB_GENRES[key] === id)));
    console.log('🎯 Final selection must be from allowed list');
  }
  
try {
  const keywordIds = getAllKeywords(moodAnswers, finalGenreSelection, userPrefs || {});
  
  let movies = await fetchMoviesByGenre(finalGenreSelection, false, keywordIds);
  console.log('🇺🇸 Fetched English-language movies:', movies?.length || 0);
    
 console.log('🎯 PRIORITIZING:', movies.length, 'movies for genre', targetGenreId); // ADD THIS LINE

  // NEW: Prioritize by genre position
 if (!movies || movies.length < 3) {
    console.log('⚠️ Not enough English movies, allowing foreign films');
    movies = await fetchMoviesByGenre(finalGenreSelection, true, keywordIds);
    
    // Also prioritize the foreign film results
    if (movies && movies.length > 0) {
      movies = prioritizeByGenrePosition(movies, finalGenreSelection);
    }
  }
  
    return {
    movies: movies,
    context: {
      chosenGenre: Object.keys(TMDB_GENRES).find(key => TMDB_GENRES[key] === finalGenreSelection),
      moodScores: moodScore.topGenres,
      tasteInfluence: tasteProfile ? 'Applied' : 'None',
      modifiers: moodScore.modifiers
    }
  };
} catch (error) {
  console.log('🚨 Mood+Taste API call failed:', error);
  return null;
} 

// ========================================
// TASTE WEIGHTING ALGORITHM
// ========================================
const applyTasteWeighting = (moodScore, tasteProfile) => {
  console.log('🧮 Calculating taste-weighted genre selection');
  // ========================================
// QUALITY BOOST SYSTEM this might fail because my assistant is confused
// ========================================
  
  // Extract genres from user's highly rated movies (simplified analysis)
  const tasteGenreBoosts = {};
  
  // Boost Drama if user loves character-driven films
  if (tasteProfile.averageRating > 3.5) {
    tasteGenreBoosts[TMDB_GENRES.DRAMA] = 8; // Strong preference
  }
  
  // Boost Action/Thriller for users who rate them highly
  // (This is simplified - in production you'd analyze actual genres from CSV)
  if (tasteProfile.totalWatched > 200) {
    tasteGenreBoosts[TMDB_GENRES.THRILLER] = 6;
  }
  
  // Apply 60/40 weighting: Combine mood scores with taste boosts
  const combinedScores = {};
  
  // Start with mood scores (40% weight)
  moodScore.topGenres.forEach(genre => {
    combinedScores[genre.id] = Math.round(genre.score * 0.4);
  });
  
  // Add taste boosts (60% weight)
  Object.entries(tasteGenreBoosts).forEach(([genreId, boost]) => {
    const id = parseInt(genreId);
    combinedScores[id] = (combinedScores[id] || 0) + Math.round(boost * 0.6);
  });
  
  // Find highest scoring genre after weighting
  const topWeightedGenre = Object.entries(combinedScores)
    .sort(([,a], [,b]) => b - a)[0];
  
  const selectedGenre = parseInt(topWeightedGenre[0]);
  const genreName = Object.keys(TMDB_GENRES).find(key => TMDB_GENRES[key] === selectedGenre);
  
  console.log('🏆 Taste-weighted selection:', genreName, 'Score:', topWeightedGenre[1]);
  console.log('📊 Combined scores:', combinedScores);
  
  return selectedGenre;
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
  
// Filter 2: Genre exclusions with trait fallback
if (userPrefs.excludedGenreIds && userPrefs.excludedGenreIds.length > 0) {
  const allowedGenres = Object.values(TMDB_GENRES).filter(id => !userPrefs.excludedGenreIds.includes(id));
  
  // Check if we're in heavy exclusion mode (few allowed genres)
  const isHeavyExclusion = allowedGenres.length <= 3;
  
  if (isHeavyExclusion) {
    console.log('🎨 Heavy exclusion detected, activating trait-based scoring');
    
    // Compute trait profile from allowed genres
    const traitScores = computeTraitScores(allowedGenres);
    
    // Score all movies by trait compatibility + weighted genre scoring
    const scoredMovies = filteredMovies.map(movie => {
      const traitScore = scoreMovieByTraits(movie, traitScores);
      
      // Still apply weighted genre scoring
      let genreScore = 0;
      movie.genre_ids?.forEach((genreId, index) => {
        if (allowedGenres.includes(genreId)) {
          genreScore += Math.max(3 - index, 1);
        }
      });
      
      const combinedScore = (traitScore * 0.7) + (genreScore * 0.3); // 70% traits, 30% genre position
      
      return {
        ...movie,
        traitScore,
        genreScore,
        combinedScore
      };
    });
    
    // Filter and sort by combined score
    const filteredByTraits = scoredMovies
      .filter(movie => movie.combinedScore > 0)
      .sort((a, b) => b.combinedScore - a.combinedScore);
    
    console.log(`🎨 Trait filtering: ${filteredMovies.length} → ${filteredByTraits.length} movies`);
    filteredMovies = filteredByTraits;
    
  } else {
    // Use existing weighted genre scoring for light exclusions
    const filteredByGenre = filteredMovies.filter(movie => {
      let score = 0;
      movie.genre_ids?.forEach((genreId, index) => {
        if (allowedGenres.includes(genreId)) {
          score += Math.max(3 - index, 1);
        }
      });
      return score >= 3;
    });
    
    console.log(`🚫 Genre filtering: ${filteredMovies.length} → ${filteredByGenre.length} movies`);
    filteredMovies = filteredByGenre;
  }
}
  
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
const getFilteredRecommendations = (rawMovies, userPrefs, tasteThresholds, allowRewatches = false) => {
  const filteredMovies = applyAllFilters(rawMovies, userPrefs, allowRewatches);
  
 if (filteredMovies.length >= 3) {
   // Sort by quality but add randomization for variety

   const sorted = filteredMovies
  .sort((a, b) => applyQualityBoost(b, tasteThresholds) - applyQualityBoost(a, tasteThresholds))
  .slice(0, 8) // Take top 8 quality films
  .sort(() => 0.5 - Math.random()); // Then randomize within that group
   
    return {
  safe: { 
    ...sorted[0], 
    reason: "🎯 Safe Bet: High-rated match on your platforms" 
  },
  stretch: { 
    ...sorted[1], 
    reason: "↗️ Stretch: Balanced pick with potential" 
  },
  wild: { 
    ...sorted[2], 
    reason: "🎲 Wild Card: Edgy hidden gem" 
    }
  };
}
  
  return null;
};

const getDetailedRecommendations = async (rawMovies, userPrefs, allowRewatches = false) => {
  const filteredMovies = applyAllFilters(rawMovies, userPrefs, allowRewatches);
  
  if (filteredMovies.length >= 3) {
    const shuffled = filteredMovies.sort(() => 0.5 - Math.random());
    const selectedMovies = [shuffled[0], shuffled[1], shuffled[2]];
    
    const detailedMovies = await Promise.all(
      selectedMovies.map(async (movie) => {
        const details = await fetchMovieDetails(movie.id);
        return {
          ...movie,
          runtime: details?.runtime || Math.floor(Math.random() * 60) + 90
        };
      })
    );
    
    return {
      safe: { 
        ...detailedMovies[0], 
        reason: "🎯 Safe Bet: Available on your platforms" 
      },
      stretch: { 
        ...detailedMovies[1], 
        reason: "↗️ Stretch: Trending on your services" 
      },
      wild: { 
        ...detailedMovies[2], 
        reason: "🎲 Wild Card: Hidden gem on your platforms" 
      }
    };
  }
  
  return null;
};

const CineMoodApp = () => {

//  Add this temporarily at the top of CineMoodApp function
//localStorage.removeItem('cinemood-prefs');
  
  const saveUserPrefs = (prefs) => {
    try {
      localStorage.setItem('cinemood-prefs', JSON.stringify(prefs));
      console.log('Preferences saved to localStorage');
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const loadUserPrefs = () => {
    try {
      const saved = localStorage.getItem('cinemood-prefs');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return null;
    }
  };


  const [currentScreen, setCurrentScreen] = useState('setup');
const [userPrefs, setUserPrefs] = useState(() => {
  const savedPrefs = loadUserPrefs();
  return savedPrefs || {
    letterboxd: '',
    platforms: [],
    moodAnswers: {},
    excludedGenreIds: [],
    watchedMovies: [],
    recentSymbolGroups: []  // ADD THIS LINE
  };
});
  
//react imports
  
const [userRating, setUserRating] = useState(0);
const [isHalfStar, setIsHalfStar] = useState(false);
const [showExclusions, setShowExclusions] = useState(false);

useEffect(() => {
  saveUserPrefs(userPrefs);
}, [userPrefs]);
  
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
    const result = await getMoodBasedMovies(userPrefs.moodAnswers, userPrefs.tasteProfile, userPrefs.excludedGenreIds, userPrefs);
const movies = result?.movies;
    console.log('🎬 TMDB API Response:', movies);
    if (result) {
  console.log('🎯 Chosen genre:', result.context.chosenGenre);
  console.log('📊 All genre scores:', result.context.allScores);
}
    console.log('🎬 Movies array length:', movies?.length);
    
    if (movies && movies.length >= 3) {
  console.log('✅ Using TMDB movies');
  const tasteThresholds = generateTasteThresholds(userPrefs.tasteProfile);
const movieRecs = await getDetailedRecommendations(movies, userPrefs, tasteThresholds);
  
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
      question: "What world do you want to sink into tonight?",
      options: [
        { id: 'neon', text: 'Pulsing Neon Streets', subtext: 'Electric nights humming with mystery', style: 'neon' },
        { id: 'earth', text: 'Ancient Earthen Paths', subtext: 'Worn trails grounded in timeless stories', style: 'earth' },
        { id: 'gold', text: 'Golden Radiant Halls', subtext: 'Opulent glows of triumph and luxury', style: 'gold' }
      ]
    },
      {
      question: "What visual mood calls to you?",
      options: [
        { id: 'neon', text: 'Vibrant Electric Flash', subtext: 'Neon pinks and blues of bold energy', style: 'eighties' },
        { id: 'earth', text: 'Gritty Urban Edges', subtext: 'Raw textures of rust and amber', style: 'struggle' },
        { id: 'gold', text: 'Bright Pop Explosions', subtext: 'Vivid colors of joyful energy', style: 'spring' }
      ]
    },
    {
      question: "What cinematic palette is for yours?",
      options: [
        { id: 'neon', text: 'Sleek Digital Horizons', subtext: 'Cool blues of futuristic worlds', style: 'ice' },
        { id: 'earth', text: 'Sepia-Tinted Memories', subtext: 'Warm hues of classical tales', style: 'sunset' },
        { id: 'gold', text: 'Shadowy Noir Alleys', subtext: 'Mysterious blues cloaked in intrigue', style: 'shadow' }
      ]
    }
  ]
},
  path: {
    variations: [
      {
        question: "Choose a path",
        options: [
          { id: 'upstairs', text: 'Up the Stairs', style: 'climb' },
          { id: 'hallway', text: 'Through the Hallway',  style: 'corridor' },
          { id: 'downstairs', text: 'Down the Stairs', style: 'descend' }
        ]
      }
    ]
  },
  era: {
  variations: [
    {
      question: "What color era speaks to you tonight?",
      options: [
        { id: 'vintage', text: 'Sepia & Burgundy', subtext: 'Classic warmth', style: 'sunset' },
        { id: 'gritty', text: 'Earth & Concrete', subtext: 'Raw textures', style: 'earth' },
        { id: 'electric', text: 'Neon & Chrome', subtext: 'Electric energy', style: 'neon' },
        { id: 'digital', text: 'Matrix & Steel', subtext: 'Digital cool', style: 'ice' }
      ]
    },
    {
      question: "Tonight's visual palette:",
      options: [
        { id: 'noir', text: 'Shadow & Smoke', subtext: 'Dark mystery', style: 'shadow' },
        { id: 'pop', text: 'Bright & Bold', subtext: 'Vibrant energy', style: 'gold' },
        { id: 'gritty', text: 'Rust & Amber', subtext: 'Weathered glow', style: 'struggle' },
        { id: 'electric', text: 'Laser & Glass', subtext: 'Sharp contrasts', style: 'storm' }
      ]
    }
  ]
},
  energy: {
  variations: [
    {
      question: "Tonight your rhythm is?",
      options: [
        { id: 'spring', text: 'Bursting Spring Energy', subtext: 'Vivid bursts of passion and life', style: 'spring' },
        { id: 'river', text: 'Gentle River Currents', subtext: 'Steady flow of calm and serenity', style: 'river' },
        { id: 'explosive', text: 'Volcanic Eruption', subtext: 'Raw power breaking free', style: 'fire' },
        { id: 'contemplative', text: 'Still Lake Depths', subtext: 'Quiet wisdom waiting below', style: 'shadow' }
      ]
    },
    {
      question: "What gets your heart racing?",
      options: [
        { id: 'explosive', text: 'Lightning Strike Moment', subtext: 'Electric shock of pure adrenaline', style: 'storm' },
        { id: 'spring', text: 'Mountain Peak Rush', subtext: 'Triumphant surge of achievement', style: 'gold' },
        { id: 'contemplative', text: 'Deep Ocean Mystery', subtext: 'Slow-building tension and discovery', style: 'ocean' },
        { id: 'river', text: 'Sunset Horizon Call', subtext: 'Peaceful anticipation of beauty', style: 'sunset' }
      ]
    },
    {
      question: "What tempo moves you?",
      options: [
        { id: 'river', text: 'A Steady Heartbeat', subtext: 'Consistent, reliable rhythm', style: 'earth' },
        { id: 'explosive', text: 'A Thunderclap Burst', subtext: 'Sudden, overwhelming intensity', style: 'fire' },
        { id: 'spring', text: 'A Dancing Flame', subtext: 'Lively, unpredictable movement', style: 'neon' },
        { id: 'contemplative', text: 'A Moonlit Silence', subtext: 'Thoughtful spaces between notes', style: 'ice' }
      ]
    },
    {
      question: "What energy draws you forward?",
      options: [
        { id: 'contemplative', text: 'Ancient Tree Wisdom', subtext: 'Patient, deep-rooted strength', style: 'forest' },
        { id: 'river', text: 'Flowing Stream Path', subtext: 'Natural, effortless progression', style: 'river' },
        { id: 'spring', text: 'Wild Wind Gust', subtext: 'Fresh, invigorating movement', style: 'new' },
        { id: 'explosive', text: 'Rocket Launch Power', subtext: 'Focused, unstoppable force', style: 'seventies' }
      ]
    }
  ]
},
  character: {
    variations: [
      {
        question: "Whose journey do you want to feel?",
        options: [
          { id: 'struggle', text: 'Wounded Dreamer', subtext: 'Violets of resilience and inner battles', style: 'struggle' },
          { id: 'triumph', text: 'Bold Victor', subtext: 'Golden hues of overcoming odds', style: 'triumph' },
          { id: 'complex', text: 'Enigmatic Wanderer', subtext: 'Grays of secrets waiting to unfold', style: 'puzzle' }
        ]
      },
      {
        question: "What hero’s heart resonates with you?",
        options: [
          { id: 'flawed', text: 'Imperfect Survivor', subtext: 'Earthy tones of human struggles', style: 'earth' },
          { id: 'heroic', text: 'Noble Trailblazer', subtext: 'Fiery reds of courage and purpose', style: 'fire' },
          { id: 'driven', text: 'Relentless Seeker', subtext: 'Deep blues of focused ambition', style: 'ocean' }
        ]
      }
    ]
  },
  mood: {
    variations: [
      {
        question: "What emotion do you want to embrace?",
        options: [
          { id: 'contemplative', text: 'Deep Introspection', subtext: 'Muted blues of quiet reflection', style: 'shadow' },
          { id: 'visceral', text: 'Raw Electric Tension', subtext: 'Charged reds of thrilling unrest', style: 'neon' },
          { id: 'emotional', text: 'Heartfelt Connection', subtext: 'Warm beiges of tender moments', style: 'comfort' }
        ]
      },
      {
        question: "What feeling pulls you tonight?",
        options: [
          { id: 'puzzle', text: 'Intriguing Mystery', subtext: 'Cool grays of unfolding secrets', style: 'puzzle' },
          { id: 'escape', text: 'Boundless Freedom', subtext: 'Teal winds of wild adventure', style: 'escape' },
          { id: 'analytical', text: 'Sharp Clarity', subtext: 'Crisp blues of focused insight', style: 'ice' }
        ]
      }
    ]
  },
  discovery: {
    variations: [
      {
        question: "What journey do you crave?",
        options: [
          { id: 'new', text: 'Uncharted Horizons', subtext: 'Bright yellows of fresh adventures', style: 'new' },
          { id: 'comfort', text: 'Familiar Shores', subtext: 'Warm beiges of beloved tales', style: 'comfort' },
          { id: 'pop', text: 'Vibrant New Worlds', subtext: 'Colorful bursts of joyful discovery', style: 'spring' }
        ]
      }
    ]
  }
};

  // Question Selection Logic
const generateQuestionSet = () => {
 const categories = ['symbols','path', 'aesthetic', 'energy', 'era', 'character', 'mood'];
  const selectedQuestions = [];
  //added as debug
  console.log('Generated questions:', selectedQuestions.map(q => q.id));
  
  
  categories.forEach(category => {
    console.log('Processing category:', category);
    
  if (category === 'symbols') {
  const groupKeys = Object.keys(SYMBOL_GROUPS);
  const selectedGroup = getUnusedSymbolGroup(userPrefs.recentSymbolGroups || []);
  console.log('🎨 Selected symbol group:', selectedGroup);
  
  // Update recent groups list (keep last 3)
  const updatedRecentGroups = [selectedGroup, ...(userPrefs.recentSymbolGroups || [])].slice(0, 3);
  setUserPrefs(prev => ({
    ...prev,
    recentSymbolGroups: updatedRecentGroups
  }));
  
  selectedQuestions.push({
    id: 'symbols',
    question: 'Choose a symbol',
    type: 'symbols',
    symbols: SYMBOL_GROUPS[selectedGroup],
    groupName: selectedGroup
  });
}
   else {
      const pool = QUESTION_POOLS[category];
      console.log('Pool for', category, ':', pool);
      
      if (!pool || !pool.variations) {
        console.error('Missing or invalid pool for category:', category);
        return;
      }
      
      const randomIndex = Math.floor(Math.random() * pool.variations.length);
      const selectedVariation = pool.variations[randomIndex];
      
      selectedQuestions.push({
        id: category,
        ...selectedVariation
      });
    }
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
 
 const GENRE_MAPPING = {
  'Action': TMDB_GENRES.ACTION,
   'Adventure': TMDB_GENRES.ADVENTURE,
  'Animation': TMDB_GENRES.ANIMATION,          
  'Biography': TMDB_GENRES.DOCUMENTARY,         // Update (closest match)
  'Comedy': TMDB_GENRES.COMEDY,
  'Crime': TMDB_GENRES.CRIME,
  'Drama': TMDB_GENRES.DRAMA,
  'Documentary': TMDB_GENRES.DOCUMENTARY,       
  'Fantasy': TMDB_GENRES.FANTASY,
  'Foreign': null,                             // still not specified. We should build this later
  'Horror': TMDB_GENRES.HORROR,
  'Musical': TMDB_GENRES.MUSIC,  
'Mystery': TMDB_GENRES.MYSTERY,
  'Romance': TMDB_GENRES.ROMANCE,
  'Sci-fi': TMDB_GENRES.SCIENCE_FICTION,
  'Thriller': TMDB_GENRES.THRILLER,
  'War': TMDB_GENRES.WAR,
  'Western': TMDB_GENRES.WESTERN
};

  const handleGenreExclusion = (genre, isExcluded) => {
  console.log('handleGenreExclusion called:', genre, isExcluded);
  const genreId = GENRE_MAPPING[genre];
  console.log('🔧 Genre:', genre, 'Excluded:', isExcluded, 'ID:', genreId);
  if (!genreId) return;
  
  setUserPrefs(prev => {
    console.log('🔧 Current excluded before:', prev.excludedGenreIds?.length || 0);
    const currentExcluded = prev.excludedGenreIds || [];
    const newExcluded = isExcluded 
      ? [...currentExcluded.filter(id => id !== genreId), genreId]
      : currentExcluded.filter(id => id !== genreId);
    
    console.log('🔧 New excluded after:', newExcluded.length, newExcluded);
    return {
      ...prev,
      excludedGenreIds: newExcluded
    };
  });
};
  
  const getGenreName = (genreId) => {
  const genreNames = {
    28: 'Action',
    12: 'Adventure', 
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };
  return genreNames[genreId] || `ID:${genreId}`;
};
  
const handleMoodAnswer = async (questionId, answerId) => {
    console.log('📝 Answer recorded:', questionId, answerId);
  setUserPrefs(prev => ({
    ...prev,
    moodAnswers: { ...prev.moodAnswers, [questionId]: answerId }
  }));

  // Capture symbol trait scores
  if (questionId === 'symbols') {
    const currentSymbolQuestion = currentQuestionSet.find(q => q.id === 'symbols');
    const selectedSymbol = currentSymbolQuestion?.symbols.find(s => s.id === answerId);
    if (selectedSymbol?.traits) {
      setUserPrefs(prev => ({
        ...prev,
        symbolTraits: selectedSymbol.traits
      }));
      console.log('🎨 Symbol traits captured:', selectedSymbol.traits);
    }
  }

  // Continue with existing navigation logic...
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
    neon: { 
      background: 'linear-gradient(135deg, #1a103d, #6d28d9, #d946ef, #f4a261, #fde047)', 
      borderColor: '#d946ef' 
    }, // Pulsing energy of city lights at dusk, evoking excitement and mystery with vibrant purples fading to golden warmth
    earth: { 
      background: 'linear-gradient(135deg, #1c1208, #4a2c1b, #8c6239, #d97706, #fde68a)', 
      borderColor: '#8c6239' 
    }, // Grounded stability of ancient soil, blending deep browns with amber highlights to stir feelings of security and growth
    spring: { 
      background: 'linear-gradient(135deg, #a8113e, #e86b3a, #f7d08a, #bef264, #86efac)', 
      borderColor: '#e86b3a' 
    }, // Renewal and joy of blooming fields, from passionate rose to sunny gold and fresh greens, inspiring hope and vitality
    river: { 
      background: 'linear-gradient(135deg, #0a3d3b, #1a8c8a, #5cc8d7, #a5f3fc, #ecfeff)', 
      borderColor: '#1a8c8a' 
    }, // Flowing serenity of a winding stream, deep teals transitioning to sparkling cyan and icy whites for calm and reflection
    fire: { 
      background: 'linear-gradient(135deg, #3c0f0f, #a61e2e, #f05941, #fde047, #fef08a)', 
      borderColor: '#a61e2e' 
    }, // Passionate warmth of a hearth flame, smoldering reds to bright oranges and yellows, igniting courage and energy
    ice: { 
      background: 'linear-gradient(135deg, #0d1e4a, #3467d6, #a4cafe, #dbeafe, #f0f9ff)', 
      borderColor: '#3467d6' 
    }, // Crisp clarity of frozen landscapes, deep blues lightening to pale frost, evoking purity and introspective peace
    storm: { 
      background: 'linear-gradient(135deg, #111827, #2d3e50, #64748b, #94a3b8, #cbd5e1)', 
      borderColor: '#2d3e50' 
    }, // Turbulent power of approaching thunder, dark grays building to lighter silvers, stirring anticipation and resilience
    gold: { 
      background: 'linear-gradient(135deg, #3f2a12, #b8860b, #e6b800, #fde047, #fef08a)', 
      borderColor: '#b8860b' 
    }, // Luxurious glow of hidden treasure, rich bronzes to radiant yellows, inspiring ambition and triumphant joy
    ocean: { 
      background: 'linear-gradient(135deg, #042f4b, #087ea4, #4ab8e8, #a5f3fc, #ecfeff, #ffffff)', 
      borderColor: '#087ea4' 
    }, // Vast mystery of the deep sea, from abyssal blues to foaming whites, evoking wonder, depth, and boundless freedom
    forest: { 
      background: 'linear-gradient(135deg, #0b2e13, #1a6642, #4da865, #86efac, #bbf7d0)', 
      borderColor: '#1a6642' 
    }, // Lush vitality of ancient woods, dark greens brightening to fresh limes, awakening connection to nature and renewal
    sunset: { 
      background: 'linear-gradient(135deg, #4b1c0a, #c2410c, #f59e0b, #fde047, #fef08a)', 
      borderColor: '#c2410c' 
    }, // Melancholic beauty of fading light, fiery oranges to soft yellows, stirring gratitude and peaceful reflection
    shadow: { 
      background: 'linear-gradient(135deg, #0a101e, #1e2a44, #455575, #64748b, #94a3b8)', 
      borderColor: '#1e2a44' 
    }, // Enigmatic allure of twilight veils, deep indigos to muted grays, evoking introspection and hidden potential
    struggle: { 
      background: 'linear-gradient(135deg, #2e1065, #6d28d9, #a855f7, #d8b4fe, #f3e8ff)', 
      borderColor: '#6d28d9' 
    }, // Resilient tension of inner battles, dark violets lifting to soft lavenders, inspiring perseverance and growth
    triumph: { 
      background: 'linear-gradient(135deg, #7f1d1d, #ea580c, #facc15, #fde047, #fef08a)', 
      borderColor: '#ea580c' 
    }, // Exhilarating rush of victory, bold crimsons to golden highs, fueling pride and unbridled celebration
    seventies: { 
      background: 'linear-gradient(135deg, #2c1608, #6b3f2a, #9e6f4d, #d97706, #fde68a)', 
      borderColor: '#9e6f4d' 
    }, // Nostalgic warmth of retro vibes, earthy walnuts to sunny ambers, evoking comfort and carefree memories
    eighties: { 
      background: 'linear-gradient(135deg, #0c1549, #4f46e5, #db2777, #f472b6, #fda4af)', 
      borderColor: '#db2777' 
    }, // Electric nostalgia of pop culture, midnight blues to neon pinks, sparking fun and bold self-expression
    puzzle: { 
      background: 'linear-gradient(135deg, #1c2526, #3a4f50, #6c8294, #94a3b8, #cbd5e1)', 
      borderColor: '#3a4f50' 
    }, // Intriguing complexity of enigmas, charcoal grays to enigmatic silvers, stimulating curiosity and insight
    escape: { 
      background: 'linear-gradient(135deg, #0a3c2e, #0d9488, #34d399, #86efac, #bbf7d0)', 
      borderColor: '#0d9488' 
    }, // Liberating rush of freedom, deep jades to vibrant teals, inspiring adventure and rejuvenation
    new: { 
      background: 'linear-gradient(135deg, #7c2d12, #f97316, #fed7aa, #fef08a, #ffffff)', 
      borderColor: '#f97316' 
    }, // Fresh dawn of possibilities, burnt oranges to pure whites, evoking optimism and new beginnings
    comfort: { 
      background: 'linear-gradient(135deg, #3e2c1e, #6c4a30, #9a7b5a, #d97706, #fde68a)', 
      borderColor: '#9a7b5a' 
    }, // Soothing embrace of home, cozy cocoas to warm beiges, fostering security and gentle nostalgia
climb: {
      background: 'linear-gradient(180deg, #1e3a8a, #3b82f6, #60a5fa, #93c5fd)',
      borderColor: '#3b82f6'
    }, // Upward energy gradient
    descend: {
      background: 'linear-gradient(0deg, #1e293b, #475569, #64748b, #94a3b8)',
      borderColor: '#475569'
    }, // Downward depth gradient
    corridor: {
      background: 'linear-gradient(90deg, #422006, #78350f, #d97706, #fbbf24)',
      borderColor: '#d97706'
    } // Horizontal steady progression
  };
  return styles[styleType] || { 
    background: 'linear-gradient(135deg, #1f2937, #4b5563, #9ca3af)', 
    borderColor: '#4b5563' 
  };
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

<button 
  onClick={() => setUserPrefs(prev => ({...prev, excludedGenreIds: []}))}
  className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded mb-4"
>
  Clear All Exclusions (Debug)
</button>

{/* Expandable genre exclusions */}
<div className="mb-4">
  <button 
    onClick={() => setShowExclusions(!showExclusions)}
    className="text-sm text-gray-400 hover:text-gray-300 flex items-center"
  >
    <Settings className="w-4 h-4 mr-2" />
    Exclude genres (optional)
  </button>
  
  {showExclusions && (
    <div className="mt-3 p-3 bg-gray-700/50 rounded border border-gray-600">
      <p className="text-xs text-gray-400 mb-2">Movies with these genres won't be recommended:</p>
        <div className="grid grid-cols-3 gap-2">
{['Action','Adventure','Animation','Biography','Comedy','Crime','Drama','Documentary','Fantasy', 'Foreign',
  'Horror','Musical','Mystery','Romance','Sci-fi','Thriller','War', 'Western'].map(genre => ( 
          
    <label key={genre} className="flex items-center text-sm">
            <input 
              type="checkbox" 
              className="mr-2" 
             onChange={(e) => handleGenreExclusion(genre, e.target.checked)}
            />
            {genre}
          </label>
        ))}
      </div>
    </div>
  )}
</div>
    
<button

  onClick={async () => {
    setQuestionIndex(0);
    console.log('Setup button clicked');
    
    if (csvFile) {
      setCsvProcessing(true);
      setCsvError('');
      try {
        const letterboxdData = await parseLetterboxdCSV(csvFile);
        const tasteData = analyzeUserTaste(letterboxdData);
        setUserPrefs(prev => {
        const combinedTaste = combineRatingsWithTaste(tasteData, prev.watchedMovies);
        return {...prev, letterboxdData: letterboxdData, tasteProfile: combinedTaste};
});
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
          <p className="text-center text-sm text-gray-400 mt-3">Takes about 2 minutes</p>
        </div>
      </div>
    );
  }

// Mood Discovery Screen
if (currentScreen === 'mood') {
  // console.log('Mood screen rendering');
//  console.log('Current question set:', currentQuestionSet);
  
  if (!currentQuestionSet) {
    return <div>Loading questions...</div>;
  }
  
  const currentQuestion = currentQuestionSet[questionIndex];
  const progress = ((questionIndex + 1) / currentQuestionSet.length) * 100;
  
//  console.log('Current question:', currentQuestion); 
//  console.log('Question type:', currentQuestion?.type); 
//  console.log('Has options:', !!currentQuestion?.options); 
//  console.log('Has symbols:', !!currentQuestion?.symbols);
  
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

  {currentQuestion.type === 'symbols' && currentQuestion.symbols ? (
  <div className="grid grid-cols-3 gap-4">
    {currentQuestion.symbols.map(symbol => (
      <button
        key={symbol.id}
        onClick={() => handleMoodAnswer('symbols', symbol.id)}
        className="p-4 border-2 border-gray-600 rounded-lg text-white font-medium transition-all hover:scale-105 bg-gray-700 hover:border-gray-400 flex flex-col items-center"
      >
        <div className="w-10 h-10 flex items-center justify-center mb-2">
        
  
 
  {symbol.id === 'circle' && <Circle size={40} color="#3b82f6" />}
  {symbol.id === 'triangle' && <Triangle size={40} color="#F5AD3B" />}
  {symbol.id === 'square' && <Square size={40} color="#d8410a" />}
  {symbol.id === 'wave' && <Waves size={40} color="#3af463" />}
  {symbol.id === 'star' && <Star size={40} color="#d6d6d6" />}
  {symbol.id === 'spiral' && <Sparkles size={40} color="#9333ea" />}
  
  {symbol.id === 'leaf' && <Leaf size={40} color="#22c55e" />}
  {symbol.id === 'flame' && <Flame size={40} color="#ef4444" />}
  {symbol.id === 'stone' && <Box size={40} color="#6b7280" />}
  {symbol.id === 'cloud' && <Cloud size={40} color="#e5e7eb" />}
  {symbol.id === 'sun' && <Sun size={40} color="#fbbf24" />}
  
  {symbol.id === 'pyramid' && <Triangle size={40} color="#a855f7" />}
  {symbol.id === 'cube' && <Box size={40} color="#06b6d4" />}
  {symbol.id === 'sphere' && <Globe size={40} color="#3b82f6" />}
  {symbol.id === 'cylinder' && <Box size={40} color="#64748b" />}
 {symbol.id === 'cone' && <Triangle size={40} color="#f59e0b" />}
{symbol.id === 'helix' && <Sparkles size={40} color="#8b5cf6" />}

  {symbol.id === 'book' && <BookOpen size={40} color="#92400e" />}
  {symbol.id === 'lantern' && <Lamp size={40} color="#fbbf24" />}
  {symbol.id === 'hammer' && <Hammer size={40} color="#78716c" />}
  {symbol.id === 'key' && <Key size={40} color="#6b7280" />}
  {symbol.id === 'mirror' && <Circle size={40} color="#d1d5db" strokeWidth={3} />} 

{symbol.id === 'bridge' && (
  <svg width="40" height="40" viewBox="0 0 50 50">
    <path d="M5,35 Q25,20 45,35" stroke="#78716c" strokeWidth="4" fill="none" />
  </svg>
)}
  
</div>
        <span className="text-xs">{symbol.meaning}</span>
      </button>
    ))}
 </div>
        
  ) : currentQuestion.id === 'path' ? (
     console.log('Path question options:', currentQuestion.options),
  // Path-specific 2-over-1 layout
  <div className="space-y-4">
    {/* Top row: First two options */}
    <div className="grid grid-cols-2 gap-4">
      {currentQuestion.options.slice(0, 2).map(option => (
        <button
          key={option.id}
          onClick={() => handleMoodAnswer(currentQuestion.id, option.id)}
          className="p-8 bg-transparent border-none flex flex-col items-center justify-center text-white font-medium transition-all hover:scale-110"
        >
          <div className="w-24 h-24 flex items-center justify-center mb-3">
            {option.id === 'upstairs' && (
              <svg width="80" height="80" viewBox="0 0 100 100">
                <path d="M30 20 H70 A20 20 0 0 1 70 40 V80 H30 V40 A20 20 0 0 1 30 20 Z" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                <line x1="35" y1="80" x2="65" y2="80" stroke="#3b82f6" strokeWidth="2"/>
                <line x1="40" y1="70" x2="70" y2="70" stroke="#3b82f6" strokeWidth="2"/>
                <line x1="45" y1="60" x2="75" y2="60" stroke="#3b82f6" strokeWidth="2"/>
                <line x1="50" y1="50" x2="80" y2="50" stroke="#3b82f6" strokeWidth="2"/>
                <rect x="50" y="50" width="30" height="30" fill="black" opacity="0.1"/>
              </svg>
            )}
           {option.id === 'hallway' && (
              <svg width="80" height="80" viewBox="0 0 100 100">
                <path d="M30 40 L50 20 Q50 18 50 20 L70 40 V80 H30 V40 Z" fill="none" stroke="#d97706" strokeWidth="2"/>
                <rect x="35" y="40" width="30" height="40" fill="none" stroke="#d97706" strokeWidth="2"/>
                <line x1="35" y1="50" x2="65" y2="50" stroke="#d97706" strokeWidth="1"/>
                <line x1="35" y1="60" x2="65" y2="60" stroke="#d97706" strokeWidth="1"/>
                <line x1="35" y1="70" x2="65" y2="70" stroke="#d97706" strokeWidth="1"/>
              </svg>
            )}
          </div>
          <span className="text-lg">{option.text}</span>
        </button>
      ))}
    </div>
    
    {/* Bottom row: Third option centered */}
    <div className="flex justify-center">
      {currentQuestion.options.slice(2, 3).map(option => (
        <button
          key={option.id}
          onClick={() => handleMoodAnswer(currentQuestion.id, option.id)}
          className="p-8 bg-transparent border-none flex flex-col items-center justify-center text-white font-medium transition-all hover:scale-110"
        >
          <div className="w-24 h-24 flex items-center justify-center mb-3">
            {option.id === 'downstairs' && (
              <svg width="80" height="80" viewBox="0 0 100 100">
                <path d="M30 20 H70 A20 20 0 0 1 70 40 V80 H30 V40 A20 20 0 0 1 30 20 Z" fill="none" stroke="#475569" strokeWidth="2"/>
                <line x1="35" y1="80" x2="65" y2="80" stroke="#475569" strokeWidth="2"/>
                <line x1="30" y1="70" x2="60" y2="70" stroke="#475569" strokeWidth="2"/>
                <line x1="25" y1="60" x2="55" y2="60" stroke="#475569" strokeWidth="2"/>
                <line x1="20" y1="50" x2="50" y2="50" stroke="#475569" strokeWidth="2"/>
                <rect x="20" y="50" width="30" height="30" fill="black" opacity="0.2"/>
              </svg>
            )}
          </div>
          <span className="text-lg">{option.text}</span>
        </button>
      ))}
    </div>
 </div>

) : currentQuestion.options ? (
  currentQuestion.options.map(option => (
    <button
      key={option.id}
      onClick={() => handleMoodAnswer(currentQuestion.id, option.id)}
      className="w-full h-20 rounded-lg border-2 flex flex-col items-center justify-center text-white font-medium transition-all hover:scale-105"
      style={getMoodCardStyle(option.style)}
    >
      <span>{option.text}</span>
      <span className="text-sm opacity-80">{option.subtext}</span>
    </button>
  ))
) : null}
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
          <div 
            key={type} 
            onClick={() => handleWatchMovie(movie)}
            className="bg-gray-700 border-2 border-gray-600 rounded-lg p-4 mb-4 cursor-pointer hover:border-green-500 transition-colors"
          >
            <div className="font-bold text-lg">{movie.title} ({movie.release_date?.slice(0, 4) || 'Unknown'})</div>
  
            <div className="text-gray-400 text-sm mb-2">
              {movie.genre_ids ? movie.genre_ids.map(id => getGenreName(id)).join(', ') : 'Unknown'} • 
              {movie.runtime ? `${movie.runtime}m` : 'Unknown runtime'} • 
              {movie.availablePlatforms?.[0] || userPrefs.platforms[Math.floor(Math.random() * userPrefs.platforms.length)]}
            </div>
            <div className="bg-blue-900/50 p-2 rounded text-xs italic text-blue-300 mt-2">
              {movie.reason}
            </div>
            <div className="text-green-400 text-sm mt-2 flex items-center">
              <Play className="inline w-4 h-4 mr-1" />
              Click to watch and rate
            </div>
          </div>
        ))}
       
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
              setUserPrefs(prev => ({...prev, moodAnswers: {}}));
              setRecommendations(null);
              setCurrentRecommendations(null);
              const newQuestionSet = generateQuestionSet();
              setCurrentQuestionSet(newQuestionSet);
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
   
  const handleStarClick = (starValue) => {
    if (userRating === starValue) {
      // Clicking same star toggles half star
      setUserRating(starValue - 0.5);
      setIsHalfStar(true);
    } else {
      setUserRating(starValue);
      setIsHalfStar(false);
    }
  };

 const saveRating = () => {
  const movieRating = {
    title: watchedMovie.title,
    year: watchedMovie.year,
    rating: userRating,
    dateWatched: new Date().toISOString(),
    source: 'cinemood'
  };
  
  setUserPrefs(prev => {
    const newWatchedMovies = [...(prev.watchedMovies || []), movieRating];
    const updatedTasteProfile = combineRatingsWithTaste(prev.tasteProfile, newWatchedMovies);
    
    return {
      ...prev,
      watchedMovies: newWatchedMovies,
      tasteProfile: updatedTasteProfile
    };
  });
  
  setCurrentScreen('setup');
};

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 border-2 border-gray-600">
        <h2 className="text-center bg-gray-700 text-gray-200 p-3 rounded mb-6 text-lg font-bold">
          How Was It?
        </h2>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-4">{watchedMovie.title}</h3>
          
          {/* 5-Star Rating System */}
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className="text-3xl mx-1 transition-colors hover:text-yellow-400"
              >
                {userRating >= star ? '★' : userRating >= star - 0.5 ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          
          <p className="text-sm text-gray-400 mb-4">
            {userRating > 0 ? `Rated: ${userRating}/5 stars` : 'Click stars to rate'}
          </p>
        </div>
        
        <button
          onClick={saveRating}
          disabled={userRating === 0}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white p-3 rounded font-medium"
        >
          {userRating > 0 ? 'Save Rating & Find Another' : 'Rate to Continue'}
        </button>
      </div>
    </div>
  );
}

  // Default fallback
  return null;
};

export default CineMoodApp;
