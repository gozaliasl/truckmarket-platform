const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../trucks.db');
const db = new sqlite3.Database(dbPath);

// Comprehensive Mock Data Generator for AI Testing
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
  },

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
    ],
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
  
  return randomItem(descriptions[vehicleType] || descriptions.cars);
}

// Generate Cars
function generateCars(count = 50) {
  console.log(`🚗 Generating ${count} car listings...`);
  
  const stmt = db.prepare(`
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 0; i < count; i++) {
    const brand = randomItem(Object.keys(vehicleData.cars.brands));
    const model = randomItem(vehicleData.cars.brands[brand]);
    const year = randomYear(2015, 2024);
    const condition = randomItem(vehicleData.cars.conditions);
    const mileage = condition === 'New' ? 0 : randomMileage(1000, 200000);
    const price = condition === 'New' ? randomPrice(20000, 80000) : randomPrice(8000, 45000);
    const location = randomItem(locations);
    const city = randomItem(location.cities);
    
    const carData = [
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

    stmt.run(carData);
  }
  
  stmt.finalize();
  console.log(`✅ Generated ${count} car listings`);
}

// Generate Trucks
function generateTrucks(count = 50) {
  console.log(`🚛 Generating ${count} truck listings...`);
  
  const stmt = db.prepare(`
    INSERT INTO trucks (
      user_id, title, brand, model, year, price, currency, mileage, condition, location,
      country, category, engine_power, transmission, fuel_type, axle_configuration, color,
      description, seller_name, seller_phone, seller_email, image_url, is_featured,
      status, views, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

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
    
    const truckData = [
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

    stmt.run(truckData);
  }
  
  stmt.finalize();
  console.log(`✅ Generated ${count} truck listings`);
}

// Generate Motorcycles
function generateMotorcycles(count = 50) {
  console.log(`🏍️ Generating ${count} motorcycle listings...`);
  
  const stmt = db.prepare(`
    INSERT INTO motorcycles (
      user_id, brand, model, year, price, currency, type, engine_size, mileage, condition,
      color, country, city, postal_code, description, images, video_url, warranty_months,
      availability, first_registration, vin, license_plate, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 0; i < count; i++) {
    const brand = randomItem(Object.keys(vehicleData.motorcycles.brands));
    const model = randomItem(vehicleData.motorcycles.brands[brand]);
    const year = randomYear(2015, 2024);
    const condition = randomItem(vehicleData.motorcycles.conditions);
    const mileage = condition === 'New' ? 0 : randomMileage(1000, 50000);
    const price = condition === 'New' ? randomPrice(5000, 25000) : randomPrice(2000, 15000);
    const location = randomItem(locations);
    const city = randomItem(location.cities);
    
    const motorcycleData = [
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
      randomItem(vehicleData.cars.colors),
      location.country,
      city,
      random(10000, 99999).toString(), // postal_code
      generateDescription('motorcycles', brand, model, year, mileage, condition),
      JSON.stringify([`/images/motorcycles/${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-${year}.jpg`]),
      null, // video_url
      condition === 'New' ? 12 : random(0, 6), // warranty_months
      'Available',
      new Date(year, random(0, 11), random(1, 28)).toISOString().split('T')[0], // first_registration
      `VIN${random(1000000000000000, 9999999999999999)}`, // vin
      `${random(1000, 9999)}-${String.fromCharCode(65 + random(0, 25))}${String.fromCharCode(65 + random(0, 25))}`, // license_plate
      new Date().toISOString(),
      new Date().toISOString()
    ];

    stmt.run(motorcycleData);
  }
  
  stmt.finalize();
  console.log(`✅ Generated ${count} motorcycle listings`);
}

// Generate E-Bikes
function generateEBikes(count = 50) {
  console.log(`🚴 Generating ${count} e-bike listings...`);
  
  const stmt = db.prepare(`
    INSERT INTO ebikes (
      user_id, brand, model, year, price, currency, type, frame_size, frame_material, color,
      weight, motor_type, motor_power, battery_capacity, battery_voltage, range_min, range_max,
      charging_time, pedal_assist_levels, max_speed, gears, gear_system, brakes, suspension,
      tire_size, lights, fenders, rack, kickstand, display_type, condition, mileage,
      previous_owners, country, city, postal_code, description, images, video_url,
      warranty_months, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 0; i < count; i++) {
    const brand = randomItem(Object.keys(vehicleData.ebikes.brands));
    const model = randomItem(vehicleData.ebikes.brands[brand]);
    const year = randomYear(2020, 2024);
    const condition = randomItem(vehicleData.ebikes.conditions);
    const mileage = condition === 'New' ? 0 : randomMileage(100, 10000);
    const price = condition === 'New' ? randomPrice(1500, 8000) : randomPrice(800, 5000);
    const location = randomItem(locations);
    const city = randomItem(location.cities);
    
    const ebikeData = [
      1, // user_id
      brand,
      model,
      year,
      price,
      'EUR',
      randomItem(vehicleData.ebikes.types),
      randomItem(['XS', 'S', 'M', 'L', 'XL']), // frame_size
      randomItem(['Aluminum', 'Carbon', 'Steel']), // frame_material
      randomItem(vehicleData.cars.colors),
      random(15, 30), // weight
      randomItem(['Mid-drive', 'Hub motor']), // motor_type
      randomItem(vehicleData.ebikes.motorPowers),
      randomItem(vehicleData.ebikes.batteryCapacities),
      random(24, 48), // battery_voltage
      random(50, 150), // range_min
      random(150, 300), // range_max
      random(2, 6), // charging_time
      random(3, 5), // pedal_assist_levels
      random(25, 45), // max_speed
      random(7, 12), // gears
      randomItem(['Shimano Deore', 'SRAM', 'Shimano XT', 'Shimano SLX']), // gear_system
      randomItem(['Hydraulic disc', 'Mechanical disc']), // brakes
      randomItem(['Front', 'Full', 'Hardtail', 'None']), // suspension
      randomItem(['26"', '27.5"', '29"', '700c']), // tire_size
      randomBoolean() ? 1 : 0, // lights
      randomBoolean() ? 1 : 0, // fenders
      randomBoolean() ? 1 : 0, // rack
      randomBoolean() ? 1 : 0, // kickstand
      randomItem(['LCD', 'LED', 'Color display']), // display_type
      condition,
      mileage,
      random(0, 2), // previous_owners
      location.country,
      city,
      random(10000, 99999).toString(), // postal_code
      generateDescription('ebikes', brand, model, year, mileage, condition),
      JSON.stringify([`/images/ebikes/${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-${year}.jpg`]),
      null, // video_url
      condition === 'New' ? 24 : random(0, 12), // warranty_months
      new Date().toISOString(),
      new Date().toISOString()
    ];

    stmt.run(ebikeData);
  }
  
  stmt.finalize();
  console.log(`✅ Generated ${count} e-bike listings`);
}

// Generate Caravans
function generateCaravans(count = 50) {
  console.log(`🚐 Generating ${count} caravan listings...`);
  
  const stmt = db.prepare(`
    INSERT INTO caravans (
      user_id, brand, model, year, price, currency, type, length, width, height,
      weight_empty, weight_total, sleeping_capacity, beds, bed_type, bathroom, shower,
      toilet, kitchen, refrigerator, heating, air_conditioning, axles, brakes,
      water_tank_capacity, waste_water_capacity, gas_bottles, engine_type, engine_size,
      power_hp, transmission, mileage, fuel_capacity, solar_panels, generator,
      battery_capacity, electric_hookup, tv, awning, condition, previous_owners,
      service_history, country, city, postal_code, description, images, video_url,
      first_registration, vin, license_plate, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

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
    
    const caravanData = [
      1, // user_id
      brand,
      model,
      year,
      price,
      'EUR',
      caravanType,
      random(4, 8), // length
      random(2, 3), // width
      random(2, 4), // height
      random(1000, 3000), // weight_empty
      random(2000, 4000), // weight_total
      random(2, 6), // sleeping_capacity
      random(1, 3), // beds
      randomItem(['Fixed bed', 'Bunk beds', 'Convertible', 'Double bed']), // bed_type
      randomBoolean() ? 1 : 0, // bathroom
      randomBoolean() ? 1 : 0, // shower
      randomBoolean() ? 1 : 0, // toilet
      randomBoolean() ? 1 : 0, // kitchen
      randomBoolean() ? 1 : 0, // refrigerator
      randomBoolean() ? 1 : 0, // heating
      randomBoolean() ? 1 : 0, // air_conditioning
      random(1, 3), // axles
      randomItem(['Disc', 'Drum']), // brakes
      random(50, 150), // water_tank_capacity
      random(50, 100), // waste_water_capacity
      random(1, 3), // gas_bottles
      caravanType === 'Motorhome' ? randomItem(['Diesel', 'Petrol']) : null, // engine_type
      caravanType === 'Motorhome' ? random(2000, 4000) : null, // engine_size
      caravanType === 'Motorhome' ? random(150, 300) : null, // power_hp
      caravanType === 'Motorhome' ? randomItem(['Manual', 'Automatic']) : null, // transmission
      mileage,
      caravanType === 'Motorhome' ? random(60, 120) : null, // fuel_capacity
      randomBoolean() ? 1 : 0, // solar_panels
      randomBoolean() ? 1 : 0, // generator
      random(50, 200), // battery_capacity
      randomBoolean() ? 1 : 0, // electric_hookup
      randomBoolean() ? 1 : 0, // tv
      randomBoolean() ? 1 : 0, // awning
      condition,
      random(0, 2), // previous_owners
      randomBoolean() ? 1 : 0, // service_history
      location.country,
      city,
      random(10000, 99999).toString(), // postal_code
      generateDescription('caravans', brand, model, year, mileage, condition),
      JSON.stringify([`/images/caravans/${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-${year}.jpg`]),
      null, // video_url
      new Date(year, random(0, 11), random(1, 28)).toISOString().split('T')[0], // first_registration
      `VIN${random(1000000000000000, 9999999999999999)}`, // vin
      `${random(1000, 9999)}-${String.fromCharCode(65 + random(0, 25))}${String.fromCharCode(65 + random(0, 25))}`, // license_plate
      new Date().toISOString(),
      new Date().toISOString()
    ];

    stmt.run(caravanData);
  }
  
  stmt.finalize();
  console.log(`✅ Generated ${count} caravan listings`);
}

// Main execution function
function generateAllMockData() {
  console.log('🚀 Starting comprehensive mock data generation...');
  console.log('📊 This will create realistic vehicle listings for AI testing');
  
  db.serialize(() => {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing mock data...');
    db.run('DELETE FROM cars WHERE user_id = 1');
    db.run('DELETE FROM trucks WHERE user_id = 1');
    db.run('DELETE FROM motorcycles WHERE user_id = 1');
    db.run('DELETE FROM ebikes WHERE user_id = 1');
    db.run('DELETE FROM caravans WHERE user_id = 1');
    
    // Generate all vehicle types
    generateCars(50);
    generateTrucks(50);
    generateMotorcycles(50);
    generateEBikes(50);
    generateCaravans(50);
    
    console.log('🎉 Mock data generation completed!');
    console.log('📈 Total listings created: 250 vehicles');
    console.log('🤖 Ready for AI assistant testing!');
    
    // Show summary
    db.get('SELECT COUNT(*) as count FROM cars', (err, row) => {
      if (!err) console.log(`🚗 Cars: ${row.count} listings`);
    });
    
    db.get('SELECT COUNT(*) as count FROM trucks', (err, row) => {
      if (!err) console.log(`🚛 Trucks: ${row.count} listings`);
    });
    
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
  generateAllMockData();
}

module.exports = { generateAllMockData };
