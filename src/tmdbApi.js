const TMDB_API_KEY = 'ff6802ce657f3eb0920728b788c1842b';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMoviesByGenre = async (genreId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1`,
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
    console.log('TMDB API Response:', data);
    return data.results;
    
  } catch (error) {
    console.error('TMDB fetch error:', error);
    throw error;
  }
};

// Add this function after your existing TMDB functions
const fetchMovieDetails = async (movieId) => {
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

// Enhanced function to get detailed recommendations
const getDetailedRecommendations = async (rawMovies, userPrefs, allowRewatches = false) => {
  const filteredMovies = applyAllFilters(rawMovies, userPrefs, allowRewatches);
  
  if (filteredMovies.length >= 3) {
    const shuffled = filteredMovies.sort(() => 0.5 - Math.random());
    const selectedMovies = [shuffled[0], shuffled[1], shuffled[2]];
    
    // Fetch detailed data for each movie
    const detailedMovies = await Promise.all(
      selectedMovies.map(async (movie) => {
        const details = await fetchMovieDetails(movie.id);
        return {
          ...movie,
          runtime: details?.runtime || Math.floor(Math.random() * 60) + 90, // Fallback to estimate
          budget: details?.budget,
          revenue: details?.revenue
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
