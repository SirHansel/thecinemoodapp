const TMDB_API_KEY = 'ff6802ce657f3eb0920728b788c1842b';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMoviesByGenre = async (
  genreId, 
  includeForeign = false, 
  keywordIds = [],
  options = {}
) => {
  // Determine how many pages to fetch based on if it's for Safe tier
  const pagesToFetch = options.fetchMultiplePages ? 3 : 1; // 3 pages = ~60 movies
  
  let allMovies = [];
  
  for (let page = 1; page <= pagesToFetch; page++) {
    let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}`;
    url += `&with_genres=${genreId}`;
    url += `&page=${page}`; // ← Add page parameter
    
    if (!includeForeign) {
      url += '&with_original_language=en';
    }
    
    if (keywordIds && keywordIds.length > 0) {
      url += `&with_keywords=${keywordIds.join(',')}`;
    }
    
    if (options.startYear && options.endYear) {
      url += `&primary_release_date.gte=${options.startYear}-01-01`;
      url += `&primary_release_date.lte=${options.endYear}-12-31`;
      if (page === 1) console.log(`📅 Filtering: ${options.startYear}-${options.endYear}`);
    }
    
    if (options.sortBy) {
      url += `&sort_by=${options.sortBy}`;
      if (page === 1) console.log(`🔢 Sorting by: ${options.sortBy}`);
    } else {
      url += '&sort_by=popularity.desc';
    }
    
    if (options.minVotes) {
      url += `&vote_count.gte=${options.minVotes}`;
      if (page === 1) console.log(`⭐ Min votes: ${options.minVotes}`);
    }
    
    if (options.minRating) {
      url += `&vote_average.gte=${options.minRating}`;
      if (page === 1) console.log(`🌟 Min rating: ${options.minRating}`);
    }
    
    try {
      if (page === 1) console.log(`🎬 Fetching: Genre ${genreId}, Foreign: ${includeForeign}`);
      const response = await fetch(url);
      const data = await response.json();
      allMovies = allMovies.concat(data.results || []);
    } catch (error) {
      console.error(`TMDB fetch error (page ${page}):`, error);
    }
  }
  
  if (pagesToFetch > 1) {
    console.log(`📦 Fetched ${allMovies.length} movies across ${pagesToFetch} pages`);
  }
  
  return allMovies;
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
