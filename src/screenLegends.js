// src/screenLegends.js

export const SCREEN_LEGENDS = [
  
  // ========================================
  // GOLDEN AGE (1930s-1950s) - 10 LEGENDS
  // Only the absolute most iconic
  // ========================================
  { id: 1, name: "Humphrey Bogart", tmdbId: 4110, type: "actor", era: "golden" },
  { id: 2, name: "Katharine Hepburn", tmdbId: 3092, type: "actor", era: "golden" },
  { id: 3, name: "James Stewart", tmdbId: 854, type: "actor", era: "golden" },
  { id: 4, name: "Cary Grant", tmdbId: 2638, type: "actor", era: "golden" },
  { id: 5, name: "Audrey Hepburn", tmdbId: 1932, type: "actor", era: "golden" },
  { id: 6, name: "Marlon Brando", tmdbId: 3084, type: "actor", era: "golden" },
  { id: 7, name: "Marilyn Monroe", tmdbId: 3084, type: "actor", era: "golden" },
  { id: 8, name: "Grace Kelly", tmdbId: 549, type: "actor", era: "golden" },
  { id: 9, name: "Alfred Hitchcock", tmdbId: 2636, type: "director", era: "golden" },
  { id: 10, name: "Orson Welles", tmdbId: 5085, type: "director", era: "golden" },
  
  // ========================================
  // NEW HOLLYWOOD (1960s-1970s) - 15 LEGENDS
  // Cultural touchstones everyone knows
  // ========================================
  { id: 11, name: "Al Pacino", tmdbId: 1158, type: "actor", era: "new_hollywood" },
  { id: 12, name: "Robert De Niro", tmdbId: 380, type: "actor", era: "new_hollywood" },
  { id: 13, name: "Jack Nicholson", tmdbId: 514, type: "actor", era: "new_hollywood" },
  { id: 14, name: "Meryl Streep", tmdbId: 5064, type: "actor", era: "new_hollywood" },
  { id: 15, name: "Harrison Ford", tmdbId: 3, type: "actor", era: "new_hollywood" },
  { id: 16, name: "Clint Eastwood", tmdbId: 190, type: "actor", era: "new_hollywood" },
  { id: 17, name: "Diane Keaton", tmdbId: 3092, type: "actor", era: "new_hollywood" },
  { id: 18, name: "Gene Hackman", tmdbId: 193, type: "actor", era: "new_hollywood" },
  { id: 19, name: "Dustin Hoffman", tmdbId: 4483, type: "actor", era: "new_hollywood" },
  { id: 20, name: "Martin Scorsese", tmdbId: 1032, type: "director", era: "new_hollywood" },
  { id: 21, name: "Francis Ford Coppola", tmdbId: 1776, type: "director", era: "new_hollywood" },
  { id: 22, name: "Steven Spielberg", tmdbId: 488, type: "director", era: "new_hollywood" },
  { id: 23, name: "Stanley Kubrick", tmdbId: 240, type: "director", era: "new_hollywood" },
  { id: 24, name: "Ridley Scott", tmdbId: 578, type: "director", era: "new_hollywood" },
  { id: 25, name: "George Lucas", tmdbId: 1, type: "director", era: "new_hollywood" },
  
  // ========================================
  // BLOCKBUSTER ERA (1980s-1990s) - 25 LEGENDS
  // Peak nostalgia + still active
  // ========================================
  { id: 26, name: "Tom Cruise", tmdbId: 500, type: "actor", era: "blockbuster" },
  { id: 27, name: "Tom Hanks", tmdbId: 31, type: "actor", era: "blockbuster" },
  { id: 28, name: "Julia Roberts", tmdbId: 1204, type: "actor", era: "blockbuster" },
  { id: 29, name: "Denzel Washington", tmdbId: 5292, type: "actor", era: "blockbuster" },
  { id: 30, name: "Samuel L. Jackson", tmdbId: 2231, type: "actor", era: "blockbuster" },
  { id: 31, name: "Nicole Kidman", tmdbId: 2227, type: "actor", era: "blockbuster" },
  { id: 32, name: "Brad Pitt", tmdbId: 287, type: "actor", era: "blockbuster" },
  { id: 33, name: "Angelina Jolie", tmdbId: 11701, type: "actor", era: "blockbuster" },
  { id: 34, name: "Johnny Depp", tmdbId: 85, type: "actor", era: "blockbuster" },
  { id: 35, name: "Cate Blanchett", tmdbId: 112, type: "actor", era: "blockbuster" },
  { id: 36, name: "Will Smith", tmdbId: 2888, type: "actor", era: "blockbuster" },
  { id: 37, name: "Morgan Freeman", tmdbId: 192, type: "actor", era: "blockbuster" },
  { id: 38, name: "Anthony Hopkins", tmdbId: 4173, type: "actor", era: "blockbuster" },
  { id: 39, name: "Russell Crowe", tmdbId: 934, type: "actor", era: "blockbuster" },
  { id: 40, name: "Kate Winslet", tmdbId: 204, type: "actor", era: "blockbuster" },
  { id: 41, name: "Matt Damon", tmdbId: 1892, type: "actor", era: "blockbuster" },
  { id: 42, name: "Edward Norton", tmdbId: 819, type: "actor", era: "blockbuster" },
  { id: 43, name: "Uma Thurman", tmdbId: 139, type: "actor", era: "blockbuster" },
  { id: 44, name: "Michelle Pfeiffer", tmdbId: 1160, type: "actor", era: "blockbuster" },
  { id: 45, name: "Kevin Spacey", tmdbId: 1979, type: "actor", era: "blockbuster" },
  { id: 46, name: "Quentin Tarantino", tmdbId: 138, type: "director", era: "blockbuster" },
  { id: 47, name: "James Cameron", tmdbId: 2710, type: "director", era: "blockbuster" },
  { id: 48, name: "Christopher Nolan", tmdbId: 525, type: "director", era: "blockbuster" },
  { id: 49, name: "David Fincher", tmdbId: 7467, type: "director", era: "blockbuster" },
  { id: 50, name: "Wes Anderson", tmdbId: 5655, type: "director", era: "blockbuster" },
  
  // ========================================
  // MODERN ICONS (2000s-2010s) - 30 LEGENDS
  // Peak of their careers RIGHT NOW
  // ========================================
  { id: 51, name: "Leonardo DiCaprio", tmdbId: 6193, type: "actor", era: "modern" },
  { id: 52, name: "Christian Bale", tmdbId: 3894, type: "actor", era: "modern" },
  { id: 53, name: "Scarlett Johansson", tmdbId: 1245, type: "actor", era: "modern" },
  { id: 54, name: "Ryan Gosling", tmdbId: 30614, type: "actor", era: "modern" },
  { id: 55, name: "Emma Stone", tmdbId: 54693, type: "actor", era: "modern" },
  { id: 56, name: "Jake Gyllenhaal", tmdbId: 131, type: "actor", era: "modern" },
  { id: 57, name: "Amy Adams", tmdbId: 9273, type: "actor", era: "modern" },
  { id: 58, name: "Michael Fassbender", tmdbId: 5200, type: "actor", era: "modern" },
  { id: 59, name: "Natalie Portman", tmdbId: 524, type: "actor", era: "modern" },
  { id: 60, name: "Oscar Isaac", tmdbId: 204, type: "actor", era: "modern" },
  { id: 61, name: "Margot Robbie", tmdbId: 234352, type: "actor", era: "modern" },
  { id: 62, name: "Ryan Reynolds", tmdbId: 10859, type: "actor", era: "modern" },
  { id: 63, name: "Jennifer Lawrence", tmdbId: 72129, type: "actor", era: "modern" },
  { id: 64, name: "Joaquin Phoenix", tmdbId: 73421, type: "actor", era: "modern" },
  { id: 65, name: "Adam Driver", tmdbId: 93210, type: "actor", era: "modern" },
  { id: 66, name: "Saoirse Ronan", tmdbId: 36592, type: "actor", era: "modern" },
  { id: 67, name: "Tom Hardy", tmdbId: 2524, type: "actor", era: "modern" },
  { id: 68, name: "Charlize Theron", tmdbId: 6885, type: "actor", era: "modern" },
  { id: 69, name: "Idris Elba", tmdbId: 172069, type: "actor", era: "modern" },
  { id: 70, name: "Viola Davis", tmdbId: 19492, type: "actor", era: "modern" },
  { id: 71, name: "Mahershala Ali", tmdbId: 53714, type: "actor", era: "modern" },
  { id: 72, name: "Lupita Nyong'o", tmdbId: 1267329, type: "actor", era: "modern" },
  { id: 73, name: "Dev Patel", tmdbId: 143206, type: "actor", era: "modern" },
  { id: 74, name: "Rami Malek", tmdbId: 61981, type: "actor", era: "modern" },
  { id: 75, name: "Frances McDormand", tmdbId: 3910, type: "actor", era: "modern" },
  { id: 76, name: "Denis Villeneuve", tmdbId: 41737, type: "director", era: "modern" },
  { id: 77, name: "Greta Gerwig", tmdbId: 45400, type: "director", era: "modern" },
  { id: 78, name: "Jordan Peele", tmdbId: 291263, type: "director", era: "modern" },
  { id: 79, name: "Bong Joon-ho", tmdbId: 21684, type: "director", era: "modern" },
  { id: 80, name: "Damien Chazelle", tmdbId: 1303459, type: "director", era: "modern" },
  
  // ========================================
  // RISING STARS (2020s) - 20 LEGENDS
  // Gen Z favorites + next generation
  // ========================================
  { id: 81, name: "Timothée Chalamet", tmdbId: 1190668, type: "actor", era: "rising" },
  { id: 82, name: "Zendaya", tmdbId: 505710, type: "actor", era: "rising" },
  { id: 83, name: "Anya Taylor-Joy", tmdbId: 1397778, type: "actor", era: "rising" },
  { id: 84, name: "Florence Pugh", tmdbId: 1373737, type: "actor", era: "rising" },
  { id: 85, name: "Austin Butler", tmdbId: 1190668, type: "actor", era: "rising" },
  { id: 86, name: "Paul Mescal", tmdbId: 2231945, type: "actor", era: "rising" },
  { id: 87, name: "Sydney Sweeney", tmdbId: 115440, type: "actor", era: "rising" },
  { id: 88, name: "Barry Keoghan", tmdbId: 2037, type: "actor", era: "rising" },
  { id: 89, name: "Jenna Ortega", tmdbId: 1356210, type: "actor", era: "rising" },
  { id: 90, name: "Jacob Elordi", tmdbId: 1620721, type: "actor", era: "rising" },
  { id: 91, name: "Letitia Wright", tmdbId: 1267329, type: "actor", era: "rising" },
  { id: 92, name: "Jonathan Majors", tmdbId: 1540161, type: "actor", era: "rising" },
  { id: 93, name: "Milly Alcock", tmdbId: 3084110, type: "actor", era: "rising" },
  { id: 94, name: "Glen Powell", tmdbId: 1253360, type: "actor", era: "rising" },
  { id: 95, name: "Jenna Coleman", tmdbId: 933238, type: "actor", era: "rising" },
  { id: 96, name: "Pedro Pascal", tmdbId: 17288, type: "actor", era: "rising" },
  { id: 97, name: "Chloe Grace Moretz", tmdbId: 56734, type: "actor", era: "rising" },
  { id: 98, name: "Olivia Cooke", tmdbId: 1254064, type: "actor", era: "rising" },
  { id: 99, name: "Emerald Fennell", tmdbId: 1245422, type: "director", era: "rising" },
  { id: 100, name: "Chloé Zhao", tmdbId: 1267329, type: "director", era: "rising" }
];

// Helper function to check if a person is a screen legend
export const isScreenLegend = (tmdbPersonId) => {
  return SCREEN_LEGENDS.some(legend => legend.tmdbId === tmdbPersonId);
};

// Get legend multiplier (1.5x for legends, 1.0x for non-legends)
export const getLegendMultiplier = (tmdbPersonId) => {
  return isScreenLegend(tmdbPersonId) ? 1.5 : 1.0;
};

// Get legend data by TMDB ID
export const getLegendByTmdbId = (tmdbPersonId) => {
  return SCREEN_LEGENDS.find(legend => legend.tmdbId === tmdbPersonId);
};

// Get all legends by type
export const getLegendsByType = (type) => {
  return SCREEN_LEGENDS.filter(legend => legend.type === type);
};

// Get all legends by era
export const getLegendsByEra = (era) => {
  return SCREEN_LEGENDS.filter(legend => legend.era === era);
};
