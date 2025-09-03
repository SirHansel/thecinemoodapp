// ========================================
// LETTERBOXD CSV IMPORT SYSTEM
// ========================================
// Users export their data from Letterboxd and upload the CSV file
// This is ethical, stable, and gives us complete taste data

// ========================================
// CSV FILE PROCESSOR
// ========================================
export const parseLetterboxdCSV = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (!file.name.toLowerCase().endsWith('.csv')) {
    throw new Error('Please upload a CSV file');
  }
  
  try {
    console.log(`📄 Processing Letterboxd CSV: ${file.name}`);
    
    const text = await file.text();
    const movieData = parseCSVContent(text);
    
    console.log(`✅ Processed ${movieData.movies.length} movies from CSV`);
    
    return movieData;
    
  } catch (error) {
    console.error('❌ CSV parsing error:', error);
    throw new Error(`Could not process CSV file: ${error.message}`);
  }
};

// ========================================
// CSV CONTENT PARSER
// ========================================
const parseCSVContent = (csvText) => {
  const lines = csvText.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('CSV file appears to be empty or invalid');
  }
  
  // Parse header row to find column positions
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  // Find required columns (flexible matching for different export formats)
  const columnMap = findColumns(headers);
  
  const movies = [];
  const errors = [];
  
  // Process each movie row
  for (let i = 1; i < lines.length; i++) {
    try {
      const row = parseCSVRow(lines[i]);
      const movie = extractMovieFromRow(row, columnMap);
      
      if (movie && movie.title) {
        movies.push(movie);
      }
    } catch (error) {
      errors.push(`Row ${i + 1}: ${error.message}`);
      if (errors.length > 10) break; // Stop after too many errors
    }
  }
  
  if (movies.length === 0) {
    throw new Error('No valid movies found in CSV. Check file format.');
  }
  
  console.log(`📊 Parsed ${movies.length} movies, ${errors.length} errors`);
  
  return {
    totalMovies: movies.length,
    movies: movies,
    errors: errors,
    lastUpdated: new Date().toISOString(),
    source: 'csv_import'
  };
};

// ========================================
// COLUMN MAPPING (FLEXIBLE FOR DIFFERENT EXPORT FORMATS)
// ========================================
const findColumns = (headers) => {
  const map = {};
  
  // Search for title column
  map.title = findColumnIndex(headers, ['Name', 'Title', 'Film']);
  
  // Search for year column
  map.year = findColumnIndex(headers, ['Year', 'Release Year', 'Date']);
  
  // Search for rating column
  map.rating = findColumnIndex(headers, ['Rating', 'Your Rating', 'Stars']);
  
  // Search for watch date
  map.watchedDate = findColumnIndex(headers, ['Watched Date', 'Date Watched', 'Watch Date']);
  
  if (map.title === -1) {
    throw new Error('Could not find movie title column in CSV');
  }
  
  return map;
};

const findColumnIndex = (headers, possibleNames) => {
  for (const name of possibleNames) {
    const index = headers.findIndex(h => 
      h.toLowerCase().includes(name.toLowerCase())
    );
    if (index !== -1) return index;
  }
  return -1;
};

// ========================================
// CSV ROW PARSER
// ========================================
const parseCSVRow = (rowText) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < rowText.length; i++) {
    const char = rowText[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim()); // Add final column
  return result;
};

// ========================================
// MOVIE DATA EXTRACTOR
// ========================================
const extractMovieFromRow = (row, columnMap) => {
  const title = row[columnMap.title]?.replace(/"/g, '').trim();
  
  if (!title) return null;
  
  // Extract year
  let year = null;
  if (columnMap.year !== -1 && row[columnMap.year]) {
    const yearMatch = row[columnMap.year].match(/(\d{4})/);
    year = yearMatch ? parseInt(yearMatch[1]) : null;
  }
  
  // Extract rating (convert various formats to 1-5 scale)
  let rating = 0;
  if (columnMap.rating !== -1 && row[columnMap.rating]) {
    const ratingText = row[columnMap.rating].replace(/"/g, '').trim();
    rating = parseRating(ratingText);
  }
  
  // Extract watch date
  let watchedDate = null;
  if (columnMap.watchedDate !== -1 && row[columnMap.watchedDate]) {
    watchedDate = row[columnMap.watchedDate].replace(/"/g, '').trim();
  }
  
  return {
    title: title,
    year: year,
    rating: rating,
    watchedDate: watchedDate,
    source: 'letterboxd_csv'
  };
};

// ========================================
// RATING PARSER (HANDLES DIFFERENT FORMATS)
// ========================================
const parseRating = (ratingText) => {
  if (!ratingText || ratingText === '') return 0;
  
  // Handle star ratings (★★★★☆)
  if (ratingText.includes('★')) {
    return (ratingText.match(/★/g) || []).length;
  }
  
  // Handle decimal ratings (4.5, 3.0)
  const decimal = parseFloat(ratingText);
  if (!isNaN(decimal)) {
    if (decimal <= 5) return decimal; // Already 1-5 scale
    if (decimal <= 10) return decimal / 2; // Convert 10-point to 5-point
  }
  
  // Handle text ratings
  const lowerText = ratingText.toLowerCase();
  if (lowerText.includes('love')) return 5;
  if (lowerText.includes('like')) return 4;
  if (lowerText.includes('meh')) return 3;
  if (lowerText.includes('dislike')) return 2;
  if (lowerText.includes('hate')) return 1;
  
  return 0; // No rating found
};

// ========================================
// TASTE ANALYSIS ENGINE
// ========================================
export const analyzeUserTaste = (letterboxdData) => {
  if (!letterboxdData || !letterboxdData.movies || letterboxdData.movies.length === 0) {
    console.log('⚠️ No Letterboxd data to analyze');
    return null;
  }
  
  const movies = letterboxdData.movies;
  console.log(`🔍 Analyzing taste from ${movies.length} movies`);
  
  // Calculate basic stats
  const ratedMovies = movies.filter(m => m.rating > 0);
  const averageRating = ratedMovies.length > 0 
    ? ratedMovies.reduce((sum, m) => sum + m.rating, 0) / ratedMovies.length 
    : 3;
  
  // Find highly rated movies (4+ stars)
  const lovedMovies = movies.filter(m => m.rating >= 4);
  const likedMovies = movies.filter(m => m.rating >= 3.5);
  const dislikedMovies = movies.filter(m => m.rating <= 2);
  
  // Year preferences
  const yearCounts = {};
  movies.forEach(movie => {
    if (movie.year) {
      const decade = Math.floor(movie.year / 10) * 10;
      yearCounts[decade] = (yearCounts[decade] || 0) + 1;
    }
  });
  
  const preferredDecades = Object.entries(yearCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2)
    .map(([decade]) => parseInt(decade));
  
  return {
    totalWatched: movies.length,
    totalRated: ratedMovies.length,
    averageRating: Math.round(averageRating * 10) / 10,
    
    // Preference categories
    lovedMovies: lovedMovies.slice(0, 10), // Top 10 loved
    likedMovies: likedMovies.slice(0, 20), // Top 20 liked
    dislikedMovies: dislikedMovies.slice(0, 5), // Worst 5
    
    // Patterns
    preferredDecades: preferredDecades,
    
    // Filtering helpers
    watchedTitles: movies.map(m => m.title.toLowerCase()),
    
    // Summary for display
    summary: {
      harshCritic: averageRating < 3,
      movieLover: movies.length > 100,
      prefersDrama: lovedMovies.filter(m => m.genre?.includes('Drama')).length > lovedMovies.length * 0.3,
      recentFocus: movies.filter(m => m.year > 2015).length > movies.length * 0.5
    }
  };
};

// ========================================
// INTEGRATION HELPER FUNCTIONS
// ========================================

// Check if a movie has been watched
export const hasUserWatched = (movieTitle, tasteData) => {
  if (!tasteData) return false;
  return tasteData.watchedTitles.includes(movieTitle.toLowerCase());
};

// Get similar movies based on user's loved films
export const getSimilarityScore = (movie, tasteData) => {
  if (!tasteData) return 0;
  
  let score = 0;
  
  // Boost score if from preferred decades
  if (movie.year && tasteData.preferredDecades.includes(Math.floor(movie.year / 10) * 10)) {
    score += 2;
  }
  
  // TODO: Add genre matching when we have genre data from TMDB
  // TODO: Add director/actor matching from loved movies
  
  return score;
};

// ========================================
// ERROR HANDLING & VALIDATION
// ========================================
export const validateLetterboxdUsername = (username) => {
  if (!username || username.trim() === '') {
    return { valid: false, error: 'Username cannot be empty' };
  }
  
  const cleanUsername = username.trim().replace(/^@/, '');
  
  // Basic validation
  if (cleanUsername.length < 2) {
    return { valid: false, error: 'Username too short' };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
    return { valid: false, error: 'Username contains invalid characters' };
  }
  
  return { valid: true, username: cleanUsername };
};
