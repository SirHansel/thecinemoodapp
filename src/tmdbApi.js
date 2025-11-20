const TMDB_API_KEY = 'ff6802ce657f3eb0920728b788c1842b';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMoviesByGenre = async (
  genreId, 
  includeForeign = false, 
  keywordIds = [],
  options = {}
) => {
  let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}`;
  url += `&with_genres=${genreId}`;
  
  if (!includeForeign) {
    url += '&with_original_language=en';
  }
  
  if (keywordIds && keywordIds.length > 0) {
    url += `&with_keywords=${keywordIds.join(',')}`;
  }
  
  if (options.startYear && options.endYear) {
    url += `&primary_release_date.gte=${options.startYear}-01-01`;
    url += `&primary_release_date.lte=${options.endYear}-12-31`;
    console.log(`📅 Filtering: ${options.startYear}-${options.endYear}`);  // FIXED
  }
  
  if (options.sortBy) {
    url += `&sort_by=${options.sortBy}`;
    console.log(`🔢 Sorting by: ${options.sortBy}`);  // FIXED
  } else {
    url += '&sort_by=popularity.desc';
  }
  
  if (options.minVotes) {
    url += `&vote_count.gte=${options.minVotes}`;
    console.log(`⭐ Min votes: ${options.minVotes}`);  // FIXED
  }
  
  if (options.minRating) {
    url += `&vote_average.gte=${options.minRating}`;
    console.log(`🌟 Min rating: ${options.minRating}`);  // FIXED
  }
  
  try {
    console.log(`🎬 Fetching: Genre ${genreId}, Foreign: ${includeForeign}`);  // FIXED
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('TMDB fetch error:', error);
    return [];
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);  // FIXED
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('TMDB detail fetch error:', error);
    return null;
  }
};
