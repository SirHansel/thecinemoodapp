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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      profile_path: data.profile_path,
      known_for_department: data.known_for_department
    };
    
  } catch (error) {
    console.error(`❌ Error fetching person ${personId}:`, error);
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
  co
