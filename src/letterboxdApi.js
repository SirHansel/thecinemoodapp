// ========================================
// LETTERBOXD CSV IMPORT SYSTEM - ENHANCED
// ========================================
// Users export their data from Letterboxd and upload the CSV file
// This is ethical, stable, and gives us complete taste data

// ========================================
// CSV FILE PROCESSOR WITH VALIDATION
// ========================================
export const parseLetterboxdCSV = async (file) => {
  // Validation: File exists
  if (!file) {
    throw new Error('No file selected. Please choose a CSV file to upload.');
  }
  
  // Validation: File type
  if (!file.name.toLowerCase().endsWith('.csv')) {
    throw new Error('Invalid file type. Please upload a .csv file from Letterboxd.');
  }
  
  // Validation: File size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 10MB. Try exporting fewer movies.');
  }
  
  // Validation: File not empty
  if (file.size === 0) {
    throw new Error('File is empty. Please export your data from Letterboxd first.');
  }
  
  try {
    console.log(`📄 Processing Letterboxd CSV: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    
    const text = await file.text();
    
    // Pre-validate CSV structure
    validateCSVStructure(text);
    
    const movieData = parseCSVContent(text);
    
    console.log(`✅ Successfully imported ${movieData.movies.length} movies`);
    console.log(`📊 Summary: ${movieData.summary.ratedCount} rated, avg ${movieData.summary.avgRating}/5 stars`);
    
    return movieData;
    
  } catch (error) {
    console.error('❌ CSV parsing error:', error);
    
    // Provide helpful error messages
    if (error.message.includes('UTF')) {
      throw new Error('File encoding error. Make sure you exported from Letterboxd directly.');
    }
    
    throw new Error(`Import failed: ${error.message}`);
  }
};

// ========================================
// CSV STRUCTURE VALIDATION
// ========================================
const validateCSVStructure = (csvText) => {
  const lines = csvText.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows. Export your watched films from Letterboxd.');
  }
  
  if (lines.length > 50000) {
    throw new Error('CSV file too large (50,000+ rows). Please export in smaller batches.');
  }
  
  // Check for header row
  const firstLine = lines[0].toLowerCase();
  if (!firstLine.includes('name') && !firstLine.includes('title')) {
    throw new Error('Invalid CSV format. Make sure this is a Letterboxd export file.');
  }
  
  console.log(`✓ Valid CSV structure: ${lines.length - 1} movies found`);
};

// ========================================
// CSV CONTENT PARSER - ENHANCED
// ========================================
const parseCSVContent = (csvText) => {
  const lines = csvText.trim().split('\n');
  
  // Parse header row to find column positions
  const headers = parseCSVRow(lines[0]).map(h => h.trim().replace(/"/g, ''));
  
  console.log('📋 CSV Columns found:', headers.slice(0, 10).join(', '));
  
  // Find required columns (flexible matching for different export formats)
  const columnMap = findColumns(headers);
  
  // Log what was found
  logColumnMapping(columnMap, headers);
  
  const movies = [];
  const errors = [];
  const duplicates = new Set();
  
  // Process each movie row
  for (let i = 1; i < lines.length; i++) {
    try {
      const row = parseCSVRow(lines[i]);
      
      if (row.length < 2) continue; // Skip empty rows
      
      const movie = extractMovieFromRow(row, columnMap);
      
      if (movie && movie.title) {
        // Check for duplicates
        const movieKey = `${movie.title.toLowerCase()}-${movie.year}`;
        if (duplicates.has(movieKey)) {
          console.log(`⚠️ Duplicate found: ${movie.title} (${movie.year})`);
          continue;
        }
        duplicates.add(movieKey);
        
        movies.push(movie);
      }
    } catch (error) {
      errors.push({
        row: i + 1,
        message: error.message
      });
      
      // Stop if too many errors (probably wrong file format)
      if (errors.length > 20) {
        throw new Error(`Too many parsing errors (${errors.length}). This may not be a valid Letterboxd export.`);
      }
    }
  }
  
  if (movies.length === 0) {
    throw new Error('No valid movies found. Check that this is a Letterboxd "watched films" export.');
  }
  
  // Calculate summary stats
  const ratedMovies = movies.filter(m => m.rating > 0);
  const avgRating = ratedMovies.length > 0
    ? (ratedMovies.reduce((sum, m) => sum + m.rating, 0) / ratedMovies.length).toFixed(2)
    : 0;
  
  console.log(`📊 Import complete: ${movies.length} movies, ${errors.length} skipped rows`);
  if (errors.length > 0) {
    console.log('⚠️ Errors:', errors.slice(0, 5));
  }
  
  return {
    totalMovies: movies.length,
    movies: movies,
    errors: errors,
    duplicatesRemoved: duplicates.size - movies.length,
    lastUpdated: new Date().toISOString(),
    source: 'csv_import',
    summary: {
      totalCount: movies.length,
      ratedCount: ratedMovies.length,
      unratedCount: movies.length - ratedMovies.length,
      avgRating: parseFloat(avgRating),
      highlyRated: movies.filter(m => m.rating >= 4).length,
      lowRated: movies.filter(m => m.rating <= 2 && m.rating > 0).length,
      yearRange: {
        oldest: Math.min(...movies.filter(m => m.year).map(m => m.year)),
        newest: Math.max(...movies.filter(m => m.year).map(m => m.year))
      }
    }
  };
};

// ========================================
// COLUMN MAPPING WITH FEEDBACK
// ========================================
const findColumns = (headers) => {
  const map = {
    title: findColumnIndex(headers, ['Name', 'Title', 'Film']),
    year: findColumnIndex(headers, ['Year', 'Release Year', 'Date']),
    rating: findColumnIndex(headers, ['Rating', 'Your Rating', 'Stars']),
    watchedDate: findColumnIndex(headers, ['Watched Date', 'Date Watched', 'Watch Date', 'Letterboxd URI']),
    tags: findColumnIndex(headers, ['Tags']),
    rewatch: findColumnIndex(headers, ['Rewatch']),
    liked: findColumnIndex(headers, ['Liked'])
  };
  
  // Required columns
  if (map.title === -1) {
    throw new Error('Could not find movie title column. Make sure you exported "watched films" from Letterboxd.');
  }
  
  return map;
};

const logColumnMapping = (columnMap, headers) => {
  console.log('🗺️ Column Mapping:');
  console.log(`  ✓ Title: ${headers[columnMap.title] || 'NOT FOUND'}`);
  console.log(`  ${columnMap.year !== -1 ? '✓' : '✗'} Year: ${columnMap.year !== -1 ? headers[columnMap.year] : 'Not found (will skip)'}`);
  console.log(`  ${columnMap.rating !== -1 ? '✓' : '✗'} Rating: ${columnMap.rating !== -1 ? headers[columnMap.rating] : 'Not found (all ratings = 0)'}`);
  console.log(`  ${columnMap.watchedDate !== -1 ? '✓' : '✗'} Watch Date: ${columnMap.watchedDate !== -1 ? headers[columnMap.watchedDate] : 'Not found'}`);
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
// CSV ROW PARSER - HANDLES QUOTES PROPERLY
// ========================================
const parseCSVRow = (rowText) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < rowText.length; i++) {
    const char = rowText[i];
    const nextChar = rowText[i + 1];
    
    if (char === '"') {
      // Handle escaped quotes ("")
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
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
// MOVIE DATA EXTRACTOR - ENHANCED
// ========================================
const extractMovieFromRow = (row, columnMap) => {
  // Extract title (required)
  const title = row[columnMap.title]?.replace(/"/g, '').trim();
  
  if (!title || title === '') {
    throw new Error('Missing title');
  }
  
  // Extract year with validation
  let year = null;
  if (columnMap.year !== -1 && row[columnMap.year]) {
    const yearText = row[columnMap.year].replace(/"/g, '').trim();
    const yearMatch = yearText.match(/(\d{4})/);
    if (yearMatch) {
      year = parseInt(yearMatch[1]);
      // Validate year range
      if (year < 1888 || year > new Date().getFullYear() + 2) {
        console.warn(`Invalid year ${year} for "${title}"`);
        year = null;
      }
    }
  }
  
  // Extract rating with half-star support
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
  
  // Extract additional data
  const tags = columnMap.tags !== -1 && row[columnMap.tags] 
    ? row[columnMap.tags].replace(/"/g, '').trim().split(',').map(t => t.trim()).filter(t => t)
    : [];
  
  const isRewatch = columnMap.rewatch !== -1 && row[columnMap.rewatch]
    ? row[columnMap.rewatch].toLowerCase() === 'yes'
    : false;
    
  const isLiked = columnMap.liked !== -1 && row[columnMap.liked]
    ? row[columnMap.liked].toLowerCase() === 'yes'
    : false;
  
  return {
    title: title,
    year: year,
    rating: rating,
    watchedDate: watchedDate,
    tags: tags,
    isRewatch: isRewatch,
    isLiked: isLiked,
    source: 'letterboxd_csv'
  };
};

// ========================================
// RATING PARSER - SUPPORTS HALF-STARS
// ========================================
const parseRating = (ratingText) => {
  if (!ratingText || ratingText === '') return 0;
  
  // Handle star ratings (★★★★½)
  if (ratingText.includes('★') || ratingText.includes('☆')) {
    const fullStars = (ratingText.match(/★/g) || []).length;
    const halfStar = ratingText.includes('½') ? 0.5 : 0;
    return fullStars + halfStar;
  }
  
  // Handle decimal ratings (4.5, 3.0)
  const decimal = parseFloat(ratingText);
  if (!isNaN(decimal)) {
    if (decimal <= 5) return decimal; // Already 1-5 scale
    if (decimal <= 10) return decimal / 2; // Convert 10-point to 5-point
    if (decimal <= 100) return decimal / 20; // Convert 100-point to 5-point
  }
  
  // Handle fraction ratings (9/10, 4/5)
  const fractionMatch = ratingText.match(/(\d+)\/(\d+)/);
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1]);
    const denominator = parseInt(fractionMatch[2]);
    return (numerator / denominator) * 5;
  }
  
  return 0; // No valid rating found
};

// ========================================
// TASTE ANALYSIS ENGINE - SAME AS BEFORE
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
// INTEGRATE USER RATINGS WITH TASTE PROFILE
// ========================================
export const combineRatingsWithTaste = (csvTasteProfile, userRatings) => {
  if (!userRatings || userRatings.length === 0) {
    return csvTasteProfile;
  }
  
  console.log('🔄 Combining CSV taste with CineMood ratings');
  
  // Create combined movie list
  const combinedMovies = [
    ...(csvTasteProfile?.movies || []),
    ...userRatings.map(rating => ({
      title: rating.title,
      year: rating.year,
      rating: rating.rating,
      source: 'cinemood',
      watchedDate: rating.dateWatched
    }))
  ];
  
  // Recalculate taste analysis with both datasets
  return analyzeUserTaste({
    totalMovies: combinedMovies.length,
    movies: combinedMovies,
    source: 'combined'
  });
};

// ========================================
// INTEGRATION HELPER FUNCTIONS
// ========================================

// Check if a movie has been watched
export const hasUserWatched = (movieTitle, tasteData) => {
  if (!tasteData) return false;
  return tasteData.watchedTitles.includes(movieTitle.toLowerCase());
};

// Get similarity score based on user's loved films
export const getSimilarityScore = (movie, tasteData) => {
  if (!tasteData) return 0;
  
  let score = 0;
  
  // Boost score if from preferred decades
  if (movie.year && tasteData.preferredDecades.includes(Math.floor(movie.year / 10) * 10)) {
    score += 2;
  }
  
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
