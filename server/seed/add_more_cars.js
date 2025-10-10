const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath);

const moreCars = [
  // Luxury & Premium Cars
  { user_id: 1, brand: 'Porsche', model: '911 Carrera', year: 2021, price: 98500, body_type: 'Coupe', fuel_type: 'Petrol', transmission: 'Automatic', mileage: 12000, engine_size: 2981, power_hp: 385, doors: 2, seats: 4, color: 'Guards Red', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, leather_seats: 1, country: 'Germany', city: 'Stuttgart', description: 'Iconic Porsche 911 in pristine condition', images: JSON.stringify(['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800']) },

  { user_id: 1, brand: 'Audi', model: 'e-tron GT', year: 2022, price: 89900, body_type: 'Sedan', fuel_type: 'Electric', transmission: 'Automatic', mileage: 8500, power_hp: 530, doors: 4, seats: 5, color: 'Daytona Gray', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, leather_seats: 1, heated_seats: 1, battery_capacity: 93, electric_range: 488, country: 'Germany', city: 'Munich', description: 'Audi\'s first all-electric GT with stunning performance', images: JSON.stringify(['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800']) },

  { user_id: 1, brand: 'BMW', model: 'M5 Competition', year: 2020, price: 82900, body_type: 'Sedan', fuel_type: 'Petrol', transmission: 'Automatic', mileage: 28000, engine_size: 4395, power_hp: 625, doors: 4, seats: 5, color: 'Marina Bay Blue', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, leather_seats: 1, heated_seats: 1, country: 'Germany', city: 'Munich', description: 'Ultimate driving machine with M Power', images: JSON.stringify(['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800']) },

  { user_id: 1, brand: 'Mercedes-Benz', model: 'AMG GT', year: 2021, price: 115900, body_type: 'Coupe', fuel_type: 'Petrol', transmission: 'Automatic', mileage: 9500, engine_size: 3982, power_hp: 585, doors: 2, seats: 2, color: 'Selenite Gray', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, leather_seats: 1, country: 'Germany', city: 'Stuttgart', description: 'Breathtaking AMG GT sports car', images: JSON.stringify(['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800']) },

  // Mid-Range Popular Cars
  { user_id: 1, brand: 'Volkswagen', model: 'Tiguan', year: 2020, price: 28900, body_type: 'SUV', fuel_type: 'Diesel', transmission: 'Automatic', mileage: 42000, engine_size: 1968, power_hp: 150, doors: 5, seats: 5, color: 'Atlantic Blue', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_sensors: 1, country: 'Germany', city: 'Berlin', description: 'Family-friendly SUV with great features', images: JSON.stringify(['https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800']) },

  { user_id: 1, brand: 'Audi', model: 'Q5 2.0 TFSI', year: 2019, price: 38900, body_type: 'SUV', fuel_type: 'Petrol', transmission: 'Automatic', mileage: 48000, engine_size: 1984, power_hp: 252, doors: 5, seats: 5, color: 'Navarra Blue', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, leather_seats: 1, country: 'Austria', city: 'Vienna', description: 'Premium SUV with quattro all-wheel drive', images: JSON.stringify(['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800']) },

  { user_id: 1, brand: 'Toyota', model: 'RAV4 Hybrid', year: 2021, price: 32900, body_type: 'SUV', fuel_type: 'Hybrid', transmission: 'Automatic', mileage: 28000, engine_size: 2487, power_hp: 218, doors: 5, seats: 5, color: 'Silver', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, parking_sensors: 1, country: 'Netherlands', city: 'Rotterdam', description: 'Reliable hybrid SUV with low running costs', images: JSON.stringify(['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800']) },

  { user_id: 1, brand: 'Honda', model: 'Civic Type R', year: 2020, price: 36900, body_type: 'Hatchback', fuel_type: 'Petrol', transmission: 'Manual', mileage: 22000, engine_size: 1996, power_hp: 320, doors: 5, seats: 5, color: 'Championship White', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, country: 'UK', city: 'Birmingham', description: 'Track-ready hot hatch with incredible performance', images: JSON.stringify(['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800']) },

  { user_id: 1, brand: 'Mazda', model: 'CX-5 Skyactiv-D', year: 2020, price: 26900, body_type: 'SUV', fuel_type: 'Diesel', transmission: 'Automatic', mileage: 38000, engine_size: 2191, power_hp: 184, doors: 5, seats: 5, color: 'Soul Red', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, country: 'France', city: 'Lyon', description: 'Stylish and practical SUV with excellent handling', images: JSON.stringify(['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800']) },

  { user_id: 1, brand: 'Volkswagen', model: 'Passat GTE', year: 2019, price: 24900, body_type: 'Sedan', fuel_type: 'Plug-in Hybrid', transmission: 'Automatic', mileage: 52000, engine_size: 1395, power_hp: 218, doors: 4, seats: 5, color: 'Pyrite Silver', condition: 'Used', previous_owners: 2, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, battery_capacity: 13, electric_range: 55, country: 'Germany', city: 'Hamburg', description: 'Efficient plug-in hybrid with premium features', images: JSON.stringify(['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800']) },

  // Affordable & Entry-Level Cars
  { user_id: 1, brand: 'Ford', model: 'Fiesta ST', year: 2019, price: 16900, body_type: 'Hatchback', fuel_type: 'Petrol', transmission: 'Manual', mileage: 48000, engine_size: 1497, power_hp: 200, doors: 3, seats: 5, color: 'Orange Spice', condition: 'Used', previous_owners: 2, accident_free: 1, service_history: 1, air_conditioning: 1, country: 'UK', city: 'Manchester', description: 'Fun pocket rocket with great driving dynamics', images: JSON.stringify(['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800']) },

  { user_id: 1, brand: 'Hyundai', model: 'i30 N', year: 2020, price: 26900, body_type: 'Hatchback', fuel_type: 'Petrol', transmission: 'Manual', mileage: 32000, engine_size: 1998, power_hp: 275, doors: 5, seats: 5, color: 'Performance Blue', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, country: 'Germany', city: 'Frankfurt', description: 'Korean hot hatch with impressive performance', images: JSON.stringify(['https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800']) },

  { user_id: 1, brand: 'Kia', model: 'Sportage', year: 2020, price: 24900, body_type: 'SUV', fuel_type: 'Diesel', transmission: 'Manual', mileage: 45000, engine_size: 1685, power_hp: 136, doors: 5, seats: 5, color: 'Clear White', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, country: 'Belgium', city: 'Antwerp', description: 'Practical SUV with 7-year warranty', images: JSON.stringify(['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800']) },

  { user_id: 1, brand: 'Renault', model: 'Clio E-Tech', year: 2021, price: 18900, body_type: 'Hatchback', fuel_type: 'Hybrid', transmission: 'Automatic', mileage: 24000, engine_size: 1598, power_hp: 140, doors: 5, seats: 5, color: 'Flame Red', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, country: 'France', city: 'Paris', description: 'Modern hybrid with excellent fuel economy', images: JSON.stringify(['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800']) },

  { user_id: 1, brand: 'Peugeot', model: '3008 GT', year: 2019, price: 27900, body_type: 'SUV', fuel_type: 'Diesel', transmission: 'Automatic', mileage: 42000, engine_size: 1997, power_hp: 180, doors: 5, seats: 5, color: 'Pearl White', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, country: 'France', city: 'Marseille', description: 'Stylish French SUV with i-Cockpit', images: JSON.stringify(['https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800']) },

  // Electric & Eco-Friendly Cars
  { user_id: 1, brand: 'Tesla', model: 'Model Y Long Range', year: 2022, price: 54900, body_type: 'SUV', fuel_type: 'Electric', transmission: 'Automatic', mileage: 18000, power_hp: 384, doors: 5, seats: 7, color: 'Midnight Silver', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, battery_capacity: 75, electric_range: 533, country: 'Norway', city: 'Oslo', description: 'Tesla Model Y with 7 seats and Autopilot', images: JSON.stringify(['https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800']) },

  { user_id: 1, brand: 'Volkswagen', model: 'ID.4 Pro', year: 2021, price: 38900, body_type: 'SUV', fuel_type: 'Electric', transmission: 'Automatic', mileage: 22000, power_hp: 204, doors: 5, seats: 5, color: 'Kings Red', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, battery_capacity: 77, electric_range: 520, country: 'Germany', city: 'Wolfsburg', description: 'VW\'s electric SUV with great range', images: JSON.stringify(['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800']) },

  { user_id: 1, brand: 'Nissan', model: 'Leaf e+', year: 2020, price: 28900, body_type: 'Hatchback', fuel_type: 'Electric', transmission: 'Automatic', mileage: 32000, power_hp: 217, doors: 5, seats: 5, color: 'Gun Metallic', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_sensors: 1, battery_capacity: 62, electric_range: 385, country: 'UK', city: 'London', description: 'Popular electric hatchback with ProPILOT', images: JSON.stringify(['https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=800']) },

  { user_id: 1, brand: 'Hyundai', model: 'Ioniq 5', year: 2022, price: 44900, body_type: 'SUV', fuel_type: 'Electric', transmission: 'Automatic', mileage: 12000, power_hp: 305, doors: 5, seats: 5, color: 'Cyber Gray', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, battery_capacity: 72, electric_range: 481, country: 'Netherlands', city: 'Amsterdam', description: 'Award-winning electric crossover with ultra-fast charging', images: JSON.stringify(['https://images.unsplash.com/photo-1617654112368-307921291f42?w=800']) },

  { user_id: 1, brand: 'Polestar', model: '2 Long Range', year: 2021, price: 46900, body_type: 'Sedan', fuel_type: 'Electric', transmission: 'Automatic', mileage: 18000, power_hp: 408, doors: 5, seats: 5, color: 'Thunder', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, battery_capacity: 78, electric_range: 540, country: 'Sweden', city: 'Gothenburg', description: 'Scandinavian electric performance sedan', images: JSON.stringify(['https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800']) },

  // Station Wagons & Family Cars
  { user_id: 1, brand: 'Volvo', model: 'V90 Cross Country', year: 2020, price: 44900, body_type: 'Station Wagon', fuel_type: 'Diesel', transmission: 'Automatic', mileage: 38000, engine_size: 1969, power_hp: 235, doors: 5, seats: 5, color: 'Pine Gray', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, leather_seats: 1, heated_seats: 1, country: 'Sweden', city: 'Stockholm', description: 'Luxurious all-road estate with Scandinavian design', images: JSON.stringify(['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800']) },

  { user_id: 1, brand: 'BMW', model: '3 Series Touring', year: 2020, price: 38900, body_type: 'Station Wagon', fuel_type: 'Diesel', transmission: 'Automatic', mileage: 42000, engine_size: 1995, power_hp: 190, doors: 5, seats: 5, color: 'Mineral White', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_sensors: 1, leather_seats: 1, country: 'Germany', city: 'Munich', description: 'Practical estate with sporty handling', images: JSON.stringify(['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800']) },

  { user_id: 1, brand: 'Audi', model: 'A6 Avant 40 TDI', year: 2019, price: 42900, body_type: 'Station Wagon', fuel_type: 'Diesel', transmission: 'Automatic', mileage: 48000, engine_size: 1968, power_hp: 204, doors: 5, seats: 5, color: 'Daytona Gray', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, leather_seats: 1, country: 'Germany', city: 'Ingolstadt', description: 'Executive estate with Matrix LED headlights', images: JSON.stringify(['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800']) },

  { user_id: 1, brand: 'Mercedes-Benz', model: 'E 220 d Estate', year: 2020, price: 46900, body_type: 'Station Wagon', fuel_type: 'Diesel', transmission: 'Automatic', mileage: 38000, engine_size: 1993, power_hp: 194, doors: 5, seats: 5, color: 'Obsidian Black', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, leather_seats: 1, heated_seats: 1, country: 'Germany', city: 'Stuttgart', description: 'Premium estate with MBUX infotainment', images: JSON.stringify(['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800']) },

  // Compact & City Cars
  { user_id: 1, brand: 'Mini', model: 'Cooper S', year: 2020, price: 22900, body_type: 'Hatchback', fuel_type: 'Petrol', transmission: 'Automatic', mileage: 28000, engine_size: 1998, power_hp: 192, doors: 3, seats: 4, color: 'British Racing Green', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, country: 'UK', city: 'Oxford', description: 'Iconic British go-kart with premium interior', images: JSON.stringify(['https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800']) },

  { user_id: 1, brand: 'Fiat', model: '500 Electric', year: 2021, price: 21900, body_type: 'Hatchback', fuel_type: 'Electric', transmission: 'Automatic', mileage: 15000, power_hp: 118, doors: 3, seats: 4, color: 'Bossa Nova White', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, country: 'Italy', city: 'Milan', description: 'Stylish electric city car with Italian flair', battery_capacity: 42, electric_range: 320, images: JSON.stringify(['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800']) },

  { user_id: 1, brand: 'Volkswagen', model: 'Polo GTI', year: 2019, price: 19900, body_type: 'Hatchback', fuel_type: 'Petrol', transmission: 'Automatic', mileage: 38000, engine_size: 1984, power_hp: 200, doors: 5, seats: 5, color: 'Pure White', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, country: 'Germany', city: 'Wolfsburg', description: 'Compact hot hatch with GTI badge', images: JSON.stringify(['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800']) },

  { user_id: 1, brand: 'Toyota', model: 'Yaris Hybrid', year: 2021, price: 17900, body_type: 'Hatchback', fuel_type: 'Hybrid', transmission: 'Automatic', mileage: 28000, engine_size: 1490, power_hp: 116, doors: 5, seats: 5, color: 'Dark Blue', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, country: 'Spain', city: 'Barcelona', description: 'Reliable hybrid with low running costs', images: JSON.stringify(['https://images.unsplash.com/photo-1623869675781-80aa31e446c5?w=800']) },

  { user_id: 1, brand: 'Mazda', model: 'Mazda2 Skyactiv-G', year: 2020, price: 14900, body_type: 'Hatchback', fuel_type: 'Petrol', transmission: 'Manual', mileage: 32000, engine_size: 1496, power_hp: 90, doors: 5, seats: 5, color: 'Machine Gray', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, country: 'Portugal', city: 'Lisbon', description: 'Fun-to-drive compact with premium feel', images: JSON.stringify(['https://images.unsplash.com/photo-1617654112368-307921291f42?w=800']) },

  // SUVs & Crossovers
  { user_id: 1, brand: 'Land Rover', model: 'Range Rover Evoque', year: 2020, price: 38900, body_type: 'SUV', fuel_type: 'Diesel', transmission: 'Automatic', mileage: 32000, engine_size: 1997, power_hp: 180, doors: 5, seats: 5, color: 'Firenze Red', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, leather_seats: 1, country: 'UK', city: 'London', description: 'Compact luxury SUV with distinctive design', images: JSON.stringify(['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800']) },

  { user_id: 1, brand: 'Porsche', model: 'Macan S', year: 2020, price: 58900, body_type: 'SUV', fuel_type: 'Petrol', transmission: 'Automatic', mileage: 28000, engine_size: 2995, power_hp: 354, doors: 5, seats: 5, color: 'Carrara White', condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1, air_conditioning: 1, cruise_control: 1, navigation_system: 1, parking_camera: 1, leather_seats: 1, country: 'Germany', city: 'Stuttgart', description: 'Sports SUV with Porsche DNA', images: JSON.stringify(['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800']) }
];

console.log('🚗 Inserting additional car data...');

const insertStmt = db.prepare(`
  INSERT INTO cars (
    user_id, brand, model, year, price, body_type, fuel_type, transmission,
    mileage, engine_size, power_hp, doors, seats, color, condition,
    previous_owners, accident_free, service_history, air_conditioning,
    cruise_control, navigation_system, parking_sensors, parking_camera,
    leather_seats, heated_seats, sunroof, battery_capacity, electric_range,
    country, city, description, images
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

moreCars.forEach((car, index) => {
  insertStmt.run([
    car.user_id, car.brand, car.model, car.year, car.price, car.body_type,
    car.fuel_type, car.transmission, car.mileage, car.engine_size, car.power_hp,
    car.doors, car.seats, car.color, car.condition, car.previous_owners,
    car.accident_free, car.service_history, car.air_conditioning, car.cruise_control,
    car.navigation_system, car.parking_sensors, car.parking_camera, car.leather_seats,
    car.heated_seats, car.sunroof, car.battery_capacity, car.electric_range,
    car.country, car.city, car.description, car.images
  ], (err) => {
    if (err) {
      console.error(`❌ Error inserting car ${index + 1}:`, err.message);
    } else {
      console.log(`✅ Inserted: ${car.brand} ${car.model} (${car.year})`);
    }
  });
});

insertStmt.finalize(() => {
  console.log(`🎉 ${moreCars.length} additional cars inserted successfully!`);
  console.log('📊 Total variety: Luxury, Premium, Mid-Range, Electric, Eco, Family, Compact, SUVs');
  db.close();
});
