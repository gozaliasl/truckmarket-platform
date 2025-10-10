const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../trucks.db');
const db = new sqlite3.Database(dbPath);

// Simple Additional Mock Data Generator for AI Testing
// This script creates realistic vehicle listings for motorcycles, e-bikes, and caravans with minimal fields

// Helper functions
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomBoolean() {
  return Math.random() > 0.5;
}

function randomPrice(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 100) * 100;
}

function randomMileage(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 1000) * 1000;
}

function randomYear(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Vehicle Data Definitions
const vehicleData = {
  // Motorcycle Brands and Models
  motorcycles: {
    brands: {
      'Honda': ['CBR', 'CB', 'CRF', 'VFR', 'Gold Wing', 'Africa Twin', 'Rebel', 'Shadow'],
      'Yamaha': ['YZF', 'MT', 'FZ', 'R1', 'R6', 'FJR', 'VMAX', 'Bolt'],
      'Kawasaki': ['Ninja', 'Z', 'Versys', 'Concours', 'Vulcan', 'KLR', 'KLX'],
      'Suzuki': ['GSX', 'SV', 'V-Strom', 'Boulevard', 'RM-Z', 'DR-Z', 'Hayabusa'],
      'BMW': ['R', 'K', 'S', 'F', 'G', 'C'],
      'Ducati': ['Monster', 'Panigale', 'Multistrada', 'Diavel', 'Scrambler', 'Hypermotard'],
      'KTM': ['Duke', 'RC', 'Adventure', 'Super Duke', 'Enduro', 'Freeride'],
      'Triumph': ['Bonneville', 'Speed Triple', 'Tiger', 'Rocket', 'Street Triple', 'Scrambler'],
      'Harley-Davidson': ['Sportster', 'Softail', 'Touring', 'CVO', 'LiveWire'],
      'Aprilia': ['RSV4', 'Tuono', 'Shiver', 'Dorsoduro', 'Caponord']
    },
    types: ['Sport', 'Touring', 'Cruiser', 'Adventure', 'Naked', 'Dual Sport', 'Scooter', 'Electric'],
    engineSizes: [125, 250, 300, 400, 500, 600, 750, 900, 1000, 1200, 1300, 1800],
    conditions: ['New', 'Used', 'Certified Pre-Owned']
  },

  // E-Bike Brands and Models
  ebikes: {
    brands: {
      'Specialized': ['Turbo Levo', 'Turbo Levo SL', 'Turbo Vado', 'Turbo Como', 'Turbo Kenevo'],
      'Trek': ['Powerfly', 'Rail', 'Allant+', 'Verve+', 'Domane+ LT', 'Fuel EXe'],
      'Cube': ['Touring Hybrid Pro', 'Stereo Hybrid', 'Reaction Hybrid', 'Kathmandu Hybrid', 'Nuride Hybrid'],
      'Haibike': ['SDURO', 'XDURO', 'Trekking', 'FullSeven', 'AllMtn', 'ADVENTR'],
      'Riese & Müller': ['Charger3', 'Delite', 'Supercharger2', 'Load', 'Multicharger', 'Homage'],
      'Bulls': ['Iconic Evo', 'Lacuba Evo', 'Copperhead Evo', 'Sonic Evo', 'Six50 Evo'],
      'Gazelle': ['Ultimate', 'Medeo', 'Arroyo', 'Grenoble', 'Eclipse'],
      'Kalkhoff': ['Image', 'Entice', 'Endeavour', 'Agattu', 'Include'],
      'Stromer': ['ST5', 'ST3', 'ST1', 'ST2'],
      'Giant': ['Explore E+', 'Trance E+', 'Reign E+', 'Road E+']
    },
    types: ['Mountain', 'Trekking', 'City', 'Cargo', 'Folding', 'Road', 'Gravel'],
    motorPowers: [250, 350, 500, 750, 1000],
    batteryCapacities: [300, 400, 500, 600, 700, 800, 900, 1000],
    conditions: ['New', 'Used', 'Certified Pre-Owned']
  },

  // Caravan Brands and Models
  caravans: {
    brands: {
      'Hymer': ['B-Klasse', 'Venture S', 'MLT', 'Exsis', 'Grand Canyon S'],
      'Dethleffs': ['Globetrail', 'Globebus', 'Advantage', 'Pulse', 'Generation'],
      'Knaus': ['Boxdrive', 'Boxstar', 'Cascan', 'Sky Wave', 'Sport'],
      'Weinsberg': ['CaraOne', 'CaraTwo', 'X-Cursion', 'CaraBus', 'CaraCore'],
      'Bürstner': ['Lyseo Time', 'Ixeo Time', 'Campeo', 'Averso', 'Premio'],
      'Hobby': ['Optima', 'Premium', 'Excellent', 'De Luxe', 'Ontour'],
      'Adria': ['Alpina', 'Astella', 'Aviva', 'Altea', 'Adora'],
      'Pilote': ['Galaxy', 'Pacific', 'Aventura', 'Reference'],
      'LMC': ['Vivo', 'Style', 'Cruiser', 'Liberty', 'Explorer'],
      'Challenger': ['Graphite', 'Genesis', 'Mageo', 'X-Road']
    },
    types: ['Travel Trailer', 'Motorhome', 'Camper Van', 'Fifth Wheel'],
    conditions: ['New', 'Used', 'Certified Pre-Owned']
  }
};

// Location data
const locations = [
  { country: 'Germany', cities: ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'] },
  { country: 'France', cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'] },
  { country: 'Italy', cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania'] },
  { country: 'Spain', cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'] },
  { country: 'Netherlands', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen'] },
  { country: 'Poland', cities: ['Warsaw', 'Krakow', 'Lodz', 'Wroclaw', 'Poznan', 'Gdansk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'] },
  { country: 'Belgium', cities: ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst'] },
  { country: 'Austria', cities: ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn'] },
  { country: 'Switzerland', cities: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'St. Gallen', 'Lucerne', 'Lugano', 'Biel', 'Thun'] },
  { country: 'Czech Republic', cities: ['Prague', 'Brno', 'Ostrava', 'Plzen', 'Liberec', 'Olomouc', 'Budweis', 'Hradec Kralove', 'Ceske Budejovice', 'Pardubice'] }
];

// Generate realistic descriptions
function generateDescription(vehicleType, brand, model, year, mileage, condition) {
  const descriptions = {
    motorcycles: [
      `Amazing ${brand} ${model} ${year} in ${condition.toLowerCase()} condition. ${mileage.toLocaleString()} km with full service history. Perfect for enthusiasts!`,
      `Stunning ${brand} ${model} ${year} with ${mileage.toLocaleString()} km. ${condition} bike with comprehensive maintenance records. Ready to ride!`,
      `Excellent ${brand} ${model} ${year} in great condition. Only ${mileage.toLocaleString()} km on the clock. Perfect for both city and touring.`,
      `Outstanding ${brand} ${model} ${year} with ${mileage.toLocaleString()} km. ${condition} condition with all original documentation. Don't miss this!`,
      `Exceptional ${brand} ${model} ${year} in ${condition.toLowerCase()} condition. Low mileage of ${mileage.toLocaleString()} km. Ideal for collectors.`
    ],
    ebikes: [
      `Fantastic ${brand} ${model} ${year} in ${condition.toLowerCase()} condition. ${mileage.toLocaleString()} km with full battery health. Perfect for eco-friendly commuting!`,
      `Excellent ${brand} ${model} ${year} with ${mileage.toLocaleString()} km. ${condition} e-bike with comprehensive service history. Ready to ride!`,
      `Amazing ${brand} ${model} ${year} in great condition. Only ${mileage.toLocaleString()} km on the clock. Perfect for city and trail riding.`,
      `Outstanding ${brand} ${model} ${year} with ${mileage.toLocaleString()} km. ${condition} condition with all original accessories. Don't miss this!`,
      `Superb ${brand} ${model} ${year} in ${condition.toLowerCase()} condition. Low mileage of ${mileage.toLocaleString()} km. Ideal for sustainable transportation.`
    ],
    caravans: [
      `Beautiful ${brand} ${model} ${year} in ${condition.toLowerCase()} condition. ${mileage.toLocaleString()} km with full service history. Perfect for family adventures!`,
      `Excellent ${brand} ${model} ${year} with ${mileage.toLocaleString()} km. ${condition} caravan with comprehensive maintenance records. Ready for travel!`,
      `Stunning ${brand} ${model} ${year} in great condition. Only ${mileage.toLocaleString()} km on the clock. Perfect for long-distance touring.`,
      `Outstanding ${brand} ${model} ${year} with ${mileage.toLocaleString()} km. ${condition} condition with all original equipment. Don't miss this!`,
      `Exceptional ${brand} ${model} ${year} in ${condition.toLowerCase()} condition. Low mileage of ${mileage.toLocaleString()} km. Ideal for camping enthusiasts.`
    ]
  };
  
  return randomItem(descriptions[vehicleType] || descriptions.motorcycles);
}

// Generate Motorcycles using minimal INSERT
function generateMotorcycles(count = 50) {
  console.log(`🏍️ Generating ${count} motorcycle listings...`);
  
  for (let i = 0; i < count; i++) {
    const brand = randomItem(Object.keys(vehicleData.motorcycles.brands));
    const model = randomItem(vehicleData.motorcycles.brands[brand]);
    const year = randomYear(2015, 2024);
    const condition = randomItem(vehicleData.motorcycles.conditions);
    const mileage = condition === 'New' ? 0 : randomMileage(1000, 50000);
    const price = condition === 'New' ? randomPrice(5000, 25000) : randomPrice(2000, 15000);
    const location = randomItem(locations);
    const city = randomItem(location.cities);
    
    const sql = `
      INSERT INTO motorcycles (
        user_id, brand, model, year, price, currency, type, engine_size, mileage, condition,
        color, country, city, description, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      1, // user_id
      brand,
      model,
      year,
      price,
      'EUR',
      randomItem(vehicleData.motorcycles.types),
      randomItem(vehicleData.motorcycles.engineSizes),
      mileage,
      condition,
      randomItem(['White', 'Black', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Brown', 'Gold', 'Orange']),
      location.country,
      city,
      generateDescription('motorcycles', brand, model, year, mileage, condition),
      new Date().toISOString(),
      new Date().toISOString()
    ];

    db.run(sql, values);
  }
  
  console.log(`✅ Generated ${count} motorcycle listings`);
}

// Generate E-Bikes using minimal INSERT
function generateEBikes(count = 50) {
  console.log(`🚴 Generating ${count} e-bike listings...`);
  
  for (let i = 0; i < count; i++) {
    const brand = randomItem(Object.keys(vehicleData.ebikes.brands));
    const model = randomItem(vehicleData.ebikes.brands[brand]);
    const year = randomYear(2020, 2024);
    const condition = randomItem(vehicleData.ebikes.conditions);
    const mileage = condition === 'New' ? 0 : randomMileage(100, 10000);
    const price = condition === 'New' ? randomPrice(1500, 8000) : randomPrice(800, 5000);
    const location = randomItem(locations);
    const city = randomItem(location.cities);
    
    const sql = `
      INSERT INTO ebikes (
        user_id, brand, model, year, price, currency, type, condition, mileage,
        country, city, description, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      1, // user_id
      brand,
      model,
      year,
      price,
      'EUR',
      randomItem(vehicleData.ebikes.types),
      condition,
      mileage,
      location.country,
      city,
      generateDescription('ebikes', brand, model, year, mileage, condition),
      new Date().toISOString(),
      new Date().toISOString()
    ];

    db.run(sql, values);
  }
  
  console.log(`✅ Generated ${count} e-bike listings`);
}

// Generate Caravans using minimal INSERT
function generateCaravans(count = 50) {
  console.log(`🚐 Generating ${count} caravan listings...`);
  
  for (let i = 0; i < count; i++) {
    const brand = randomItem(Object.keys(vehicleData.caravans.brands));
    const model = randomItem(vehicleData.caravans.brands[brand]);
    const year = randomYear(2015, 2024);
    const condition = randomItem(vehicleData.caravans.conditions);
    const mileage = condition === 'New' ? 0 : randomMileage(10000, 150000);
    const price = condition === 'New' ? randomPrice(30000, 120000) : randomPrice(15000, 80000);
    const location = randomItem(locations);
    const city = randomItem(location.cities);
    const caravanType = randomItem(vehicleData.caravans.types);
    
    const sql = `
      INSERT INTO caravans (
        user_id, brand, model, year, price, currency, type, condition, mileage,
        country, city, description, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      1, // user_id
      brand,
      model,
      year,
      price,
      'EUR',
      caravanType,
      condition,
      mileage,
      location.country,
      city,
      generateDescription('caravans', brand, model, year, mileage, condition),
      new Date().toISOString(),
      new Date().toISOString()
    ];

    db.run(sql, values);
  }
  
  console.log(`✅ Generated ${count} caravan listings`);
}

// Main execution function
function generateSimpleAdditionalMockData() {
  console.log('🚀 Starting simple additional mock data generation...');
  console.log('📊 This will create realistic vehicle listings for motorcycles, e-bikes, and caravans');
  
  db.serialize(() => {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing additional mock data...');
    db.run('DELETE FROM motorcycles WHERE user_id = 1');
    db.run('DELETE FROM ebikes WHERE user_id = 1');
    db.run('DELETE FROM caravans WHERE user_id = 1');
    
    // Generate additional vehicle types
    generateMotorcycles(50);
    generateEBikes(50);
    generateCaravans(50);
    
    console.log('🎉 Simple additional mock data generation completed!');
    console.log('📈 Total additional listings created: 150 vehicles');
    console.log('🤖 Ready for comprehensive AI assistant testing!');
    
    // Show summary
    db.get('SELECT COUNT(*) as count FROM motorcycles', (err, row) => {
      if (!err) console.log(`🏍️ Motorcycles: ${row.count} listings`);
    });
    
    db.get('SELECT COUNT(*) as count FROM ebikes', (err, row) => {
      if (!err) console.log(`🚴 E-Bikes: ${row.count} listings`);
    });
    
    db.get('SELECT COUNT(*) as count FROM caravans', (err, row) => {
      if (!err) console.log(`🚐 Caravans: ${row.count} listings`);
    });
    
    db.close();
  });
}

// Run the script
if (require.main === module) {
  generateSimpleAdditionalMockData();
}

module.exports = { generateSimpleAdditionalMockData };
