const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath);

const motorcycles = [
  // Sport Bikes
  { user_id: 1, brand: 'Yamaha', model: 'YZF-R1', year: 2020, price: 14900, type: 'Sport', engine_size: 998, power_hp: 200, power_kw: 147, mileage: 8500, fuel_type: 'Petrol', transmission: 'Manual', color: 'Team Yamaha Blue', cylinders: 4, stroke: '4-stroke', cooling: 'Liquid-cooled', top_speed: 299, weight: 201, abs: 1, traction_control: 1, riding_modes: 1, country: 'Germany', city: 'Munich', description: 'Legendary superbike with MotoGP DNA', images: JSON.stringify(['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Honda', model: 'CBR1000RR-R', year: 2021, price: 22900, type: 'Sport', engine_size: 999, power_hp: 217, power_kw: 160, mileage: 4200, fuel_type: 'Petrol', transmission: 'Manual', color: 'Grand Prix Red', cylinders: 4, stroke: '4-stroke', cooling: 'Liquid-cooled', top_speed: 299, weight: 201, abs: 1, traction_control: 1, riding_modes: 1, country: 'Italy', city: 'Milan', description: 'Track-focused superbike with Fireblade heritage', images: JSON.stringify(['https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Kawasaki', model: 'Ninja ZX-10R', year: 2020, price: 13900, type: 'Sport', engine_size: 998, power_hp: 200, power_kw: 147, mileage: 12000, fuel_type: 'Petrol', transmission: 'Manual', color: 'Lime Green', cylinders: 4, stroke: '4-stroke', cooling: 'Liquid-cooled', top_speed: 299, weight: 206, abs: 1, traction_control: 1, riding_modes: 1, country: 'France', city: 'Paris', description: 'WSBK championship-winning superbike', images: JSON.stringify(['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Suzuki', model: 'GSX-R1000R', year: 2019, price: 11900, type: 'Sport', engine_size: 999, power_hp: 202, power_kw: 148, mileage: 15000, fuel_type: 'Petrol', transmission: 'Manual', color: 'Metallic Triton Blue', cylinders: 4, stroke: '4-stroke', cooling: 'Liquid-cooled', top_speed: 299, weight: 203, abs: 1, traction_control: 1, riding_modes: 1, country: 'Spain', city: 'Madrid', description: 'MotoGP-derived technology in a street bike', images: JSON.stringify(['https://images.unsplash.com/photo-1591640152699-dcce72ce2f85?w=800']), condition: 'Used', previous_owners: 2, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Ducati', model: 'Panigale V4 S', year: 2021, price: 24900, type: 'Sport', engine_size: 1103, power_hp: 214, power_kw: 157, mileage: 3800, fuel_type: 'Petrol', transmission: 'Manual', color: 'Ducati Red', cylinders: 4, stroke: '4-stroke', cooling: 'Liquid-cooled', top_speed: 299, weight: 195, abs: 1, traction_control: 1, riding_modes: 1, country: 'Italy', city: 'Bologna', description: 'Italian masterpiece with V4 engine', images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  // Cruisers
  { user_id: 1, brand: 'Harley-Davidson', model: 'Street Bob 114', year: 2020, price: 13900, type: 'Cruiser', engine_size: 1868, power_hp: 94, power_kw: 69, mileage: 8500, fuel_type: 'Petrol', transmission: 'Manual', color: 'Vivid Black', cylinders: 2, stroke: '4-stroke', cooling: 'Air-cooled', weight: 296, abs: 1, country: 'USA', city: 'Milwaukee', description: 'Bobber-style Milwaukee-Eight powered cruiser', images: JSON.stringify(['https://images.unsplash.com/photo-1558980664-1db506751c6c?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Indian', model: 'Scout Bobber', year: 2021, price: 11900, type: 'Cruiser', engine_size: 1133, power_hp: 100, power_kw: 73, mileage: 5200, fuel_type: 'Petrol', transmission: 'Manual', color: 'Thunder Black', cylinders: 2, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 255, abs: 1, country: 'USA', city: 'Phoenix', description: 'American muscle with agile handling', images: JSON.stringify(['https://images.unsplash.com/photo-1609078434196-a7a96f986a99?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Yamaha', model: 'XV950R', year: 2019, price: 7900, type: 'Cruiser', engine_size: 942, power_hp: 54, power_kw: 40, mileage: 14000, fuel_type: 'Petrol', transmission: 'Manual', color: 'Raven', cylinders: 2, stroke: '4-stroke', cooling: 'Air-cooled', weight: 252, abs: 1, country: 'Germany', city: 'Hamburg', description: 'V-twin cruiser with classic style', images: JSON.stringify(['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800']), condition: 'Used', previous_owners: 2, accident_free: 1, service_history: 1 },

  // Adventure Bikes
  { user_id: 1, brand: 'BMW', model: 'R 1250 GS Adventure', year: 2021, price: 17900, type: 'Adventure', engine_size: 1254, power_hp: 136, power_kw: 100, mileage: 12000, fuel_type: 'Petrol', transmission: 'Manual', color: 'Racing Blue', cylinders: 2, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 268, abs: 1, traction_control: 1, riding_modes: 1, country: 'Germany', city: 'Munich', description: 'The ultimate adventure tourer', images: JSON.stringify(['https://images.unsplash.com/photo-1591640152699-dcce72ce2f85?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'KTM', model: '1290 Super Adventure S', year: 2020, price: 14900, type: 'Adventure', engine_size: 1301, power_hp: 160, power_kw: 118, mileage: 18000, fuel_type: 'Petrol', transmission: 'Manual', color: 'Orange', cylinders: 2, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 249, abs: 1, traction_control: 1, riding_modes: 1, country: 'Austria', city: 'Vienna', description: 'Ready to Race adventure bike', images: JSON.stringify(['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Triumph', model: 'Tiger 900 Rally Pro', year: 2021, price: 12900, type: 'Adventure', engine_size: 888, power_hp: 95, power_kw: 70, mileage: 8500, fuel_type: 'Petrol', transmission: 'Manual', color: 'Sapphire Black', cylinders: 3, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 211, abs: 1, traction_control: 1, riding_modes: 1, country: 'UK', city: 'London', description: 'Off-road focused adventure triple', images: JSON.stringify(['https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Honda', model: 'Africa Twin Adventure Sports', year: 2020, price: 11900, type: 'Adventure', engine_size: 1084, power_hp: 102, power_kw: 75, mileage: 22000, fuel_type: 'Petrol', transmission: 'Manual', color: 'Tricolour', cylinders: 2, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 238, abs: 1, traction_control: 1, riding_modes: 1, country: 'Portugal', city: 'Lisbon', description: 'Rally-inspired adventure bike', images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']), condition: 'Used', previous_owners: 2, accident_free: 1, service_history: 1 },

  // Touring Bikes
  { user_id: 1, brand: 'BMW', model: 'K 1600 Grand America', year: 2020, price: 18900, type: 'Touring', engine_size: 1649, power_hp: 160, power_kw: 118, mileage: 15000, fuel_type: 'Petrol', transmission: 'Manual', color: 'Mineral White', cylinders: 6, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 365, abs: 1, traction_control: 1, riding_modes: 1, heated_grips: 1, country: 'Germany', city: 'Berlin', description: 'Luxury six-cylinder grand tourer', images: JSON.stringify(['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Honda', model: 'Gold Wing Tour', year: 2019, price: 19900, type: 'Touring', engine_size: 1833, power_hp: 126, power_kw: 93, mileage: 28000, fuel_type: 'Petrol', transmission: 'Automatic', color: 'Candy Ardent Red', cylinders: 6, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 383, abs: 1, traction_control: 1, riding_modes: 1, heated_grips: 1, country: 'France', city: 'Nice', description: 'The ultimate touring machine', images: JSON.stringify(['https://images.unsplash.com/photo-1558980664-1db506751c6c?w=800']), condition: 'Used', previous_owners: 2, accident_free: 1, service_history: 1 },

  // Naked/Street Bikes
  { user_id: 1, brand: 'Yamaha', model: 'MT-09', year: 2021, price: 7900, type: 'Naked', engine_size: 889, power_hp: 117, power_kw: 86, mileage: 6500, fuel_type: 'Petrol', transmission: 'Manual', color: 'Icon Blue', cylinders: 3, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 189, abs: 1, traction_control: 1, riding_modes: 1, country: 'Spain', city: 'Barcelona', description: 'Torquey triple with aggressive looks', images: JSON.stringify(['https://images.unsplash.com/photo-1609078434196-a7a96f986a99?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Kawasaki', model: 'Z900', year: 2020, price: 7400, type: 'Naked', engine_size: 948, power_hp: 125, power_kw: 92, mileage: 12000, fuel_type: 'Petrol', transmission: 'Manual', color: 'Metallic Spark Black', cylinders: 4, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 210, abs: 1, traction_control: 1, country: 'Netherlands', city: 'Amsterdam', description: 'Supernaked with Z heritage', images: JSON.stringify(['https://images.unsplash.com/photo-1591640152699-dcce72ce2f85?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Ducati', model: 'Monster 821', year: 2019, price: 8900, type: 'Naked', engine_size: 821, power_hp: 109, power_kw: 80, mileage: 9500, fuel_type: 'Petrol', transmission: 'Manual', color: 'Dark Stealth', cylinders: 2, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 189, abs: 1, traction_control: 1, riding_modes: 1, country: 'Italy', city: 'Rome', description: 'Iconic Italian naked with L-twin soul', images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Triumph', model: 'Street Triple RS', year: 2020, price: 10900, type: 'Naked', engine_size: 765, power_hp: 123, power_kw: 90, mileage: 7800, fuel_type: 'Petrol', transmission: 'Manual', color: 'Matte Storm Grey', cylinders: 3, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 189, abs: 1, traction_control: 1, riding_modes: 1, country: 'UK', city: 'Bristol', description: 'Sharp handling British triple', images: JSON.stringify(['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'KTM', model: '890 Duke R', year: 2021, price: 9900, type: 'Naked', engine_size: 889, power_hp: 121, power_kw: 89, mileage: 4200, fuel_type: 'Petrol', transmission: 'Manual', color: 'Orange', cylinders: 2, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 169, abs: 1, traction_control: 1, riding_modes: 1, country: 'Austria', city: 'Salzburg', description: 'The Scalpel - ultra-sharp handling', images: JSON.stringify(['https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  // Scooters
  { user_id: 1, brand: 'Vespa', model: 'GTS 300 HPE', year: 2021, price: 5900, type: 'Scooter', engine_size: 278, power_hp: 24, power_kw: 18, mileage: 3500, fuel_type: 'Petrol', transmission: 'Automatic', color: 'Bianco Innocenza', cylinders: 1, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 163, abs: 1, country: 'Italy', city: 'Florence', description: 'Classic Italian style with modern tech', images: JSON.stringify(['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Honda', model: 'Forza 750', year: 2021, price: 8900, type: 'Scooter', engine_size: 745, power_hp: 59, power_kw: 43, mileage: 6500, fuel_type: 'Petrol', transmission: 'Automatic', color: 'Mat Ballistic Black Metallic', cylinders: 2, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 235, abs: 1, traction_control: 1, country: 'Spain', city: 'Valencia', description: 'Maxi-scooter with DCT technology', images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'Yamaha', model: 'TMAX 560', year: 2020, price: 9400, type: 'Scooter', engine_size: 562, power_hp: 48, power_kw: 35, mileage: 8200, fuel_type: 'Petrol', transmission: 'Automatic', color: 'Tech Kamo', cylinders: 2, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 220, abs: 1, traction_control: 1, country: 'France', city: 'Paris', description: 'The king of maxi-scooters', images: JSON.stringify(['https://images.unsplash.com/photo-1558980664-1db506751c6c?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 },

  { user_id: 1, brand: 'BMW', model: 'C 400 GT', year: 2020, price: 6900, type: 'Scooter', engine_size: 350, power_hp: 34, power_kw: 25, mileage: 5800, fuel_type: 'Petrol', transmission: 'Automatic', color: 'Style Triple Black', cylinders: 1, stroke: '4-stroke', cooling: 'Liquid-cooled', weight: 206, abs: 1, traction_control: 1, country: 'Germany', city: 'Munich', description: 'Premium commuter scooter', images: JSON.stringify(['https://images.unsplash.com/photo-1609078434196-a7a96f986a99?w=800']), condition: 'Used', previous_owners: 1, accident_free: 1, service_history: 1 }
];

console.log('🏍️  Inserting motorcycle data...');

const insertStmt = db.prepare(`
  INSERT INTO motorcycles (
    user_id, brand, model, year, price, type, engine_size, power_hp, power_kw,
    mileage, fuel_type, transmission, color, cylinders, stroke, cooling,
    top_speed, weight, condition, previous_owners, accident_free, service_history,
    abs, traction_control, riding_modes, heated_grips, country, city, description, images
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

motorcycles.forEach((moto, index) => {
  insertStmt.run([
    moto.user_id, moto.brand, moto.model, moto.year, moto.price, moto.type,
    moto.engine_size, moto.power_hp, moto.power_kw, moto.mileage, moto.fuel_type,
    moto.transmission, moto.color, moto.cylinders, moto.stroke, moto.cooling,
    moto.top_speed, moto.weight, moto.condition, moto.previous_owners,
    moto.accident_free, moto.service_history, moto.abs, moto.traction_control,
    moto.riding_modes, moto.heated_grips, moto.country, moto.city,
    moto.description, moto.images
  ], (err) => {
    if (err) {
      console.error(`❌ Error inserting motorcycle ${index + 1}:`, err.message);
    } else {
      console.log(`✅ Inserted: ${moto.brand} ${moto.model} (${moto.year})`);
    }
  });
});

insertStmt.finalize(() => {
  console.log(`🎉 ${motorcycles.length} motorcycles inserted successfully!`);
  console.log('📊 Variety: Sport, Cruiser, Adventure, Touring, Naked, Scooter');
  db.close();
});
