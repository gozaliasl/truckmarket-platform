const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../trucks.db');
const db = new sqlite3.Database(dbPath);

// Simple Mock Data Generator for AI Testing
// This script creates realistic vehicle listings across all categories

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
  // Car Brands and Models
  cars: {
    brands: {
      'BMW': ['X1', 'X3', 'X5', '3 Series', '5 Series', '7 Series', 'i3', 'i8', 'Z4', 'M3', 'M5'],
      'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'AMG GT', 'SL'],
      'Audi': ['A1', 'A3', 'A4', 'A6', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8'],
      'Volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan', 'Touareg', 'Arteon', 'ID.3', 'ID.4', 'Beetle'],
      'Toyota': ['Yaris', 'Corolla', 'Camry', 'RAV4', 'Highlander', 'Prius', 'C-HR', 'Avalon', 'Supra'],
      'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'HR-V', 'Passport', 'Ridgeline', 'NSX'],
      'Ford': ['Fiesta', 'Focus', 'Fusion', 'Mustang', 'Escape', 'Explorer', 'Edge', 'Expedition', 'F-150'],
      'Nissan': ['Versa', 'Sentra', 'Altima', 'Maxima', 'Rogue', 'Murano', 'Pathfinder', 'Armada', 'GT-R'],
      'Mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'MX-5', 'MX-30'],
      'Hyundai': ['i10', 'i20', 'i30', 'Elantra', 'Kona', 'Tucson', 'Santa Fe', 'Ioniq 5', 'Ioniq 6'],
      'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
      'Volvo': ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C40', 'EX30', 'EX90'],
      'Porsche': ['718', '911', 'Panamera', 'Cayenne', 'Macan', 'Taycan'],
      'Renault': ['Clio', 'Captur', 'Megane', 'Kadjar', 'Koleos', 'Zoe', 'Megane E-Tech'],
      'Peugeot': ['208', '308', '508', '2008', '3008', '5008', 'e-208', 'e-2008'],
      'Kia': ['Picanto', 'Rio', 'Ceed', 'Stonic', 'Niro', 'Sportage', 'Sorento', 'EV6', 'EV9']
    },
    bodyTypes: ['Sedan', 'SUV', 'Station Wagon', 'Hatchback', 'Convertible', 'Coupe', 'Van', 'Pickup'],
    fuelTypes: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'CNG', 'LPG'],
    transmissions: ['Manual', 'Automatic', 'Semi-automatic'],
    conditions: ['New', 'Used', 'Certified Pre-Owned'],
    colors: ['White', 'Black', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Brown', 'Gold', 'Orange']
  },

  // Truck Brands and Models
  trucks: {
    brands: {
      'Mercedes-Benz': ['Actros', 'Arocs', 'Atego', 'Econic', 'Unimog', 'Sprinter'],
      'MAN': ['TGX', 'TGS', 'TGL', 'TGM', 'TGE'],
      'Scania': ['R-Series', 'S-Series', 'P-Series', 'G-Series', 'L-Series'],
      'Volvo': ['FH', 'FM', 'FMX', 'FL', 'FE', 'VNR'],
      'DAF': ['XF', 'CF', 'LF', 'XF105', 'CF85'],
      'Renault': ['T', 'C', 'K', 'D', 'Master'],
      'Iveco': ['Stralis', 'Trakker', 'Daily', 'Eurocargo', 'S-Way'],
      'Freightliner': ['Cascadia', 'Century Class', 'Columbia', 'Business Class'],
      'Kenworth': ['T680', 'T880', 'W900', 'T800'],
      'Peterbilt': ['579', '389', '567', '520']
    },
    categories: ['semi-trailer-trucks', 'trucks-over-7.5t', 'vans-up-to-7.5t'],
    euroStandards: ['Euro 3', 'Euro 4', 'Euro 5', 'Euro 6', 'EEV'],
    axleConfigs: ['4x2', '4x4', '6x2', '6x4', '8x2', '8x4'],
    cabTypes: ['Day Cab', 'Sleeper Cab', 'High Sleeper', 'Low Sleeper', 'Mega Sleeper'],
    transmissions: ['Manual', 'Automatic', 'Semi-automatic'],
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
    cars: [
      `Excellent ${brand} ${model} ${year} in ${condition.toLowerCase()} condition. Well-maintained with ${mileage.toLocaleString()} km. Perfect for daily commuting and family trips.`,
      `Stunning ${brand} ${model} ${year} with low mileage of ${mileage.toLocaleString()} km. ${condition} vehicle with full service history. Ready to drive!`,
      `Beautiful ${brand} ${model} ${year} in great condition. Only ${mileage.toLocaleString()} km on the clock. Perfect for both city and highway driving.`,
      `Outstanding ${brand} ${model} ${year} with ${mileage.toLocaleString()} km. ${condition} condition with comprehensive service records. Don't miss this opportunity!`,
      `Exceptional ${brand} ${model} ${year} in ${condition.toLowerCase()} condition. Low mileage of ${mileage.toLocaleString()} km. Ideal for discerning buyers.`
    ],
    trucks: [
      `Professional ${brand} ${model} ${year} in ${condition.toLowerCase()} condition. ${mileage.toLocaleString()} km with full maintenance history. Perfect for commercial use.`,
      `Reliable ${brand} ${model} ${year} with ${mileage.toLocaleString()} km. ${condition} vehicle ideal for long-haul operations. Well-equipped and ready to work.`,
      `Excellent ${brand} ${model} ${year} in great condition. ${mileage.toLocaleString()} km with comprehensive service records. Perfect for fleet operations.`,
      `Outstanding ${brand} ${model} ${year} with ${mileage.toLocaleString()} km. ${condition} condition with all necessary documentation. Ready for immediate use.`,
      `Superb ${brand} ${model} ${year} in ${condition.toLowerCase()} condition. Low mileage of ${mileage.toLocaleString()} km. Ideal for professional drivers.`
    ]
  };
  
  return randomItem(descriptions[vehicleType] || descriptions.cars);
}

// Generate Cars using simple INSERT
function generateCars(count = 50) {
  console.log(`🚗 Generating ${count} car listings...`);
  
  for (let i = 0; i < count; i++) {
    const brand = randomItem(Object.keys(vehicleData.cars.brands));
    const model = randomItem(vehicleData.cars.brands[brand]);
    const year = randomYear(2015, 2024);
    const condition = randomItem(vehicleData.cars.conditions);
    const mileage = condition === 'New' ? 0 : randomMileage(1000, 200000);
    const price = condition === 'New' ? randomPrice(20000, 80000) : randomPrice(8000, 45000);
    const location = randomItem(locations);
    const city = randomItem(location.cities);
    
    const sql = `
      INSERT INTO cars (
        user_id, brand, model, year, price, currency, body_type, fuel_type, transmission,
        mileage, engine_size, power_hp, power_kw, doors, seats, color, interior_color,
        condition, previous_owners, accident_free, service_history, air_conditioning,
        cruise_control, navigation_system, parking_sensors, parking_camera, leather_seats,
        heated_seats, sunroof, alloy_wheels, abs, airbags, esp, traction_control,
        lane_assist, blind_spot_monitor, co2_emissions, emission_class,
        fuel_consumption_city, fuel_consumption_highway, fuel_consumption_combined,
        battery_capacity, electric_range, charging_time, country, city, postal_code,
        description, images, video_url, vat_deductible, warranty_months, availability,
        first_registration, last_inspection, vin, license_plate, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      1, // user_id
      brand,
      model,
      year,
      price,
      'EUR',
      randomItem(vehicleData.cars.bodyTypes),
      randomItem(vehicleData.cars.fuelTypes),
      randomItem(vehicleData.cars.transmissions),
      mileage,
      random(1000, 4000), // engine_size
      random(100, 400), // power_hp
      random(75, 300), // power_kw
      random(2, 5), // doors
      random(2, 7), // seats
      randomItem(vehicleData.cars.colors),
      randomItem(vehicleData.cars.colors), // interior_color
      condition,
      random(0, 3), // previous_owners
      randomBoolean() ? 1 : 0, // accident_free
      randomBoolean() ? 1 : 0, // service_history
      randomBoolean() ? 1 : 0, // air_conditioning
      randomBoolean() ? 1 : 0, // cruise_control
      randomBoolean() ? 1 : 0, // navigation_system
      randomBoolean() ? 1 : 0, // parking_sensors
      randomBoolean() ? 1 : 0, // parking_camera
      randomBoolean() ? 1 : 0, // leather_seats
      randomBoolean() ? 1 : 0, // heated_seats
      randomBoolean() ? 1 : 0, // sunroof
      randomBoolean() ? 1 : 0, // alloy_wheels
      randomBoolean() ? 1 : 0, // abs
      random(2, 8), // airbags
      randomBoolean() ? 1 : 0, // esp
      randomBoolean() ? 1 : 0, // traction_control
      randomBoolean() ? 1 : 0, // lane_assist
      randomBoolean() ? 1 : 0, // blind_spot_monitor
      random(80, 250), // co2_emissions
      randomItem(['Euro 5', 'Euro 6', 'Euro 6d']), // emission_class
      random(5, 15), // fuel_consumption_city
      random(4, 12), // fuel_consumption_highway
      random(4, 10), // fuel_consumption_combined
      random(40, 100), // battery_capacity
      random(200, 600), // electric_range
      random(2, 8), // charging_time
      location.country,
      city,
      random(10000, 99999).toString(), // postal_code
      generateDescription('cars', brand, model, year, mileage, condition),
      JSON.stringify([`/images/cars/${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-${year}.jpg`]),
      null, // video_url
      randomBoolean() ? 1 : 0, // vat_deductible
      condition === 'New' ? 24 : random(0, 12), // warranty_months
      'Available',
      new Date(year, random(0, 11), random(1, 28)).toISOString().split('T')[0], // first_registration
      new Date().toISOString().split('T')[0], // last_inspection
      `VIN${random(1000000000000000, 9999999999999999)}`, // vin
      `${random(1000, 9999)}-${String.fromCharCode(65 + random(0, 25))}${String.fromCharCode(65 + random(0, 25))}`, // license_plate
      new Date().toISOString(),
      new Date().toISOString()
    ];

    db.run(sql, values);
  }
  
  console.log(`✅ Generated ${count} car listings`);
}

// Generate Trucks using simple INSERT
function generateTrucks(count = 50) {
  console.log(`🚛 Generating ${count} truck listings...`);
  
  for (let i = 0; i < count; i++) {
    const brand = randomItem(Object.keys(vehicleData.trucks.brands));
    const model = randomItem(vehicleData.trucks.brands[brand]);
    const year = randomYear(2010, 2024);
    const condition = randomItem(vehicleData.trucks.conditions);
    const mileage = condition === 'New' ? 0 : randomMileage(50000, 800000);
    const price = condition === 'New' ? randomPrice(80000, 200000) : randomPrice(25000, 120000);
    const location = randomItem(locations);
    const city = randomItem(location.cities);
    const category = randomItem(vehicleData.trucks.categories);
    
    const sql = `
      INSERT INTO trucks (
        user_id, title, brand, model, year, price, currency, mileage, condition, location,
        country, category, engine_power, transmission, fuel_type, axle_configuration, color,
        description, seller_name, seller_phone, seller_email, image_url, is_featured,
        status, views, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      1, // user_id
      `${brand} ${model} ${year} - ${condition} Condition`,
      brand,
      model,
      year,
      price,
      'EUR',
      mileage,
      condition,
      city,
      location.country,
      category,
      random(300, 600), // engine_power
      randomItem(vehicleData.trucks.transmissions),
      'Diesel',
      randomItem(vehicleData.trucks.axleConfigs),
      randomItem(vehicleData.cars.colors),
      generateDescription('trucks', brand, model, year, mileage, condition),
      `Seller ${i + 1}`,
      `+49${random(100000000, 999999999)}`,
      `seller${i + 1}@example.com`,
      `/images/trucks/${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-${year}.jpg`,
      randomBoolean() ? 1 : 0, // is_featured
      'active',
      random(0, 500), // views
      new Date().toISOString(),
      new Date().toISOString()
    ];

    db.run(sql, values);
  }
  
  console.log(`✅ Generated ${count} truck listings`);
}

// Main execution function
function generateAllMockData() {
  console.log('🚀 Starting simple mock data generation...');
  console.log('📊 This will create realistic vehicle listings for AI testing');
  
  db.serialize(() => {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing mock data...');
    db.run('DELETE FROM cars WHERE user_id = 1');
    db.run('DELETE FROM trucks WHERE user_id = 1');
    
    // Generate vehicle types
    generateCars(50);
    generateTrucks(50);
    
    console.log('🎉 Mock data generation completed!');
    console.log('📈 Total listings created: 100 vehicles');
    console.log('🤖 Ready for AI assistant testing!');
    
    // Show summary
    db.get('SELECT COUNT(*) as count FROM cars', (err, row) => {
      if (!err) console.log(`🚗 Cars: ${row.count} listings`);
    });
    
    db.get('SELECT COUNT(*) as count FROM trucks', (err, row) => {
      if (!err) console.log(`🚛 Trucks: ${row.count} listings`);
    });
    
    db.close();
  });
}

// Run the script
if (require.main === module) {
  generateAllMockData();
}

module.exports = { generateAllMockData };
