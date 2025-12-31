// src/tmdbCredits.js
import { getLegendMultiplier } from './screenLegends';
const TMDB_API_KEY = 'ff6802ce657f3eb0920728b788c1842b';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Fetch cast and crew credits for a movie
 * @param {number} movieId - TMDB movie ID
 * @returns {Object} { cast: [...], crew: [...] }
 */
export const fetchMovieCredits = async (movieId) => {
  if (!movieId) {
    console.warn('⚠️ fetchMovieCredits: No movieId provided');
    return { cast: [], crew: [] };
  }

  try {
    const url = `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      cast: data.cast || [],
      crew: data.crew || []
    };
    
  } catch (error) {
    console.error(`❌ Error fetching credits for movie ${movieId}:`, error);
    return { cast: [], crew: [] };
  }
};

/**
 * Extract person IDs from credits data
 * Focuses on top-billed actors and key crew (directors, writers, cinematographers)
 * @param {Object} credits - { cast: [...], crew: [...] }
 * @returns {Object} { actorIds: [...], directorIds: [...], writerIds: [...], cinematographerIds: [...] }
 */
export const extractPersonIds = (credits) => {
  if (!credits || (!credits.cast && !credits.crew)) {
    return { actorIds: [], directorIds: [], writerIds: [], cinematographerIds: [] };
  }

  // Extract top 10 billed actors (most influential on user preference)
  const actorIds = (credits.cast || [])
    .slice(0, 10)
    .map(person => person.id)
    .filter(Boolean);

  // Extract directors
  const directorIds = (credits.crew || [])
    .filter(person => person.job === 'Director')
    .map(person => person.id)
    .filter(Boolean);

  // Extract writers (screenplay, story)
  const writerIds = (credits.crew || [])
    .filter(person => 
      person.job === 'Screenplay' || 
      person.job === 'Writer' || 
      person.job === 'Story'
    )
    .map(person => person.id)
    .filter(Boolean);

  // Extract cinematographers (Director of Photography)
  const cinematographerIds = (credits.crew || [])
    .filter(person => person.job === 'Director of Photography')
    .map(person => person.id)
    .filter(Boolean);

  return {
    actorIds,
    directorIds,
    writerIds,
    cinematographerIds
  };
};

/**
 * Get person details (name, profile path)
 * @param {number} personId - TMDB person ID
 * @returns {Object} { id, name, profile_path, known_for_department }
 */
export const fetchPersonDetails = async (personId) => {
  if (!personId) {
    console.warn('⚠️ fetchPersonDetails: No personId provided');
    return null;
  }

  try {
    const url = `${TMDB_BASE_URL}/person/${personId}?api_key=${TMDB_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);  // ← FIXED: parentheses, not backticks
    }
    
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      profile_path: data.profile_path,
      known_for_department: data.known_for_department
    };
    
  } catch (error) {
    console.error(`❌ Error fetching person ${personId}:`, error);  // ← FIXED: parentheses, not backticks
    return null;
  }
};

/**
 * Process movie credits and update user preferences with cast/crew weights
 * @param {number} movieId - TMDB movie ID
 * @param {number} userRating - User's rating (0.5 to 5.0)
 * @param {Object} currentWeights - { castWeights: {}, crewWeights: {} }
 * @returns {Object} Updated weights { castWeights: {}, crewWeights: {} }
 */
export const updateCastCrewWeights = async (movieId, userRating, currentWeights = {}) => {
  // Fetch credits
  const credits = await fetchMovieCredits(movieId);
  const personIds = extractPersonIds(credits);
  
  // Calculate influence from rating (-5 to +5)
  const getRatingInfluence = (rating) => {
    const weights = {
      5.0:  +5,  4.5:  +3,  4.0:  +2,  3.5:  +1,
      3.0:   0,  2.5:  -1,  2.0:  -2,  1.5:  -3,
      1.0:  -4,  0.5:  -5
    };
    return weights[rating] || 0;
  };
  
  const influence = getRatingInfluence(userRating);
  
  // Initialize weights if not provided
  const newCastWeights = { ...(currentWeights.castWeights || {}) };
  const newCrewWeights = { ...(currentWeights.crewWeights || {}) };
  
  // Update actor weights (10% influence, 15% for legends)
  personIds.actorIds.forEach(actorId => {
    const baseInfluence = influence * 0.10; // 10% weight for actors
    const legendMultiplier = getLegendMultiplier(actorId); // 1.0x or 1.5x
    const finalInfluence = baseInfluence * legendMultiplier;
    
    newCastWeights[actorId] = (newCastWeights[actorId] || 0) + finalInfluence;
  });
  
  // Update director weights (15% influence, 22.5% for legends)
  personIds.directorIds.forEach(directorId => {
    const baseInfluence = influence * 0.15; // 15% weight for directors
    const legendMultiplier = getLegendMultiplier(directorId);
    const finalInfluence = baseInfluence * legendMultiplier;
    
    newCrewWeights[directorId] = (newCrewWeights[directorId] || 0) + finalInfluence;
  });
  
  // Update writer weights (5% influence)
  personIds.writerIds.forEach(writerId => {
    const baseInfluence = influence * 0.05;
    newCrewWeights[writerId] = (newCrewWeights[writerId] || 0) + baseInfluence;
  });
  
  // Update cinematographer weights (3% influence)
  personIds.cinematographerIds.forEach(cinematographerId => {
    const baseInfluence = influence * 0.03;
    newCrewWeights[cinematographerId] = (newCrewWeights[cinematographerId] || 0) + baseInfluence;
  });
  
  console.log('🎬 Cast/Crew weights updated:', {
    actors: Object.keys(newCastWeights).length,
    crew: Object.keys(newCrewWeights).length
  });
  
  return {
    castWeights: newCastWeights,
    crewWeights: newCrewWeights
  };
};
