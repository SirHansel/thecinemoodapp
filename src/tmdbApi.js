const TMDB_API_KEY = 'ff6802ce657f3eb0920728b788c1842b';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMoviesByGenre = async (
  genreId, 
  includeForeign = false, 
  keywordIds = [],
  options = {}  // ← NEW: Additional options
) => {
  const TMDB_API_KEY = 'your-api-key-here';
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  
  let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}`;
  url += `&with_genres=${genreId}`;
  
  // Language filtering
  if (!includeForeign) {
    url += '&with_original_language=en';
  }
  
  // Keyword filtering
  if (keywordIds && keywordIds.length > 0) {
    url += `&with_keywords=${keywordIds.join(',')}`;
  }
  
  // ====== NEW: DECADE/YEAR FILTERING ======
  if (options.startYear && options.endYear) {
    url += `&primary_release_date.gte=${options.startYear}-01-01`;
    url += `&primary_release_date.lte=${options.endYear}-12-31`;
    console.log(`📅 Filtering: ${options.startYear}-${options.endYear}`);
  }
  
  // ====== NEW: CUSTOM SORTING ======
  if (options.sortBy) {
    url += `&sort_by=${options.sortBy}`;
    console.log(`🔢 Sorting by: ${options.sortBy}`);
  } else {
    url += '&sort_by=popularity.desc';  // Default
  }
  
  // ====== NEW: VOTE FILTERING (for quality) ======
  if (options.minVotes) {
    url += `&vote_count.gte=${options.minVotes}`;
    console.log(`⭐ Min votes: ${options.minVotes}`);
  }
  
  if (options.minRating) {
    url += `&vote_average.gte=${options.minRating}`;
    console.log(`🌟 Min rating: ${options.minRating}`);
  }
  
  // Rest of your existing fetch logic stays the same...
  try {
    console.log(`🎬 Fetching: Genre ${genreId}, Foreign: ${includeForeign}`);
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('TMDB fetch error:', error);
    return [];
  }
};  
  
  const API_KEY = TMDB_API_KEY;
  const languageParam = allowForeign ? '' : '&with_original_language=en';
  
  // Randomization for variety
  const randomPage = Math.floor(Math.random() * 3) + 1;
  const sortOptions = ['vote_average.desc', 'release_date.desc', 'popularity.desc'];
  const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];
  
  // Keywords parameter (pipe-separated for OR logic)
  const keywordsParam = keywordIds.length > 0 ? `&with_keywords=${keywordIds.join('|')}` : '';
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=${randomSort}&vote_count.gte=50&vote_average.gte=6.0&certification_country=US&certification.lte=R&page=${randomPage}${languageParam}${keywordsParam}`
    );
    const data = await response.json();
    console.log('🔑 Keywords used:', keywordIds.length > 0 ? keywordIds : 'None');
    return data.results;
  } catch (error) {
    console.error('TMDB API Error:', error);
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('TMDB detail fetch error:', error);
    return null;
  }
};
