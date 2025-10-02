const TMDB_API_KEY = 'ff6802ce657f3eb0920728b788c1842b';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMoviesByGenre = async (genreId, allowForeign = false) => {
  const API_KEY = 'your_api_key';
  const languageParam = allowForeign ? '' : '&with_original_language=en';
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=100${languageParam}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('TMDB API Error:', error);
    return [];
  }
};
    
  } catch (error) {
    console.error('TMDB fetch error:', error);
    throw error;
  }
};

// Add this function after your existing TMDB functions
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

// Enhanced function to get detailed recommendations
const getDetailedRecommendations = async (rawMovies, userPrefs, allowRewatches = false) => {
  const filteredMovies = applyAllFilters(rawMovies, userPrefs, allowRewatches);
  
  if (filteredMovies.length >= 3) {
    const shuffled = filteredMovies.sort(() => 0.5 - Math.random());
    
    // For wild card, fetch from foreign films if available
    const finalGenreSelection = /* get from context */;
    const foreignMovies = await fetchMoviesByGenre(finalGenreSelection, true);
    const foreignFiltered = applyAllFilters(foreignMovies, userPrefs, allowRewatches)
      .filter(movie => movie.original_language !== 'en');
    
    const wildCardMovie = foreignFiltered.length > 0 
      ? foreignFiltered[Math.floor(Math.random() * foreignFiltered.length)]
      : shuffled[2];
    
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
