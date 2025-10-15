const TMDB_API_KEY = 'ff6802ce657f3eb0920728b788c1842b';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMoviesByGenre = async (genreId, allowForeign = false) => {
  const API_KEY = TMDB_API_KEY;
  const languageParam = allowForeign ? '' : '&with_original_language=en';
  
  // Randomization for variety
  const randomPage = Math.floor(Math.random() * 3) + 1;
  const sortOptions = ['vote_average.desc', 'release_date.desc', 'popularity.desc'];
  const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=${randomSort}&vote_count.gte=50&vote_average.gte=6.0&certification_country=US&certification.lte=R&page=${randomPage}${languageParam}`
    );
    const data = await response.json();
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
