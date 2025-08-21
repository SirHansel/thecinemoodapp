const TMDB_API_KEY = null; // Will use fallbacks for now
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMoviesByGenre = async (genreId) => {
  // Return null to test fallbacks work
  if (!TMDB_API_KEY) return null;
  
  const response = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1`
  );
  const data = await response.json();
  return data.results;
};
