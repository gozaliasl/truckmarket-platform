const db = require('./database');

// Generate 100+ diverse trucks across all categories
const brands = {
  trucks: ['Mercedes-Benz', 'MAN', 'Scania', 'Volvo', 'DAF', 'Renault', 'Iveco'],
  construction: ['Caterpillar', 'Komatsu', 'Hitachi', 'JCB', 'Volvo', 'Liebherr'],
  buses: ['Mercedes-Benz', 'MAN', 'Scania', 'Volvo', 'Setra', 'VanHool'],
  agricultural: ['John Deere', 'Case IH', 'New Holland', 'Fendt', 'Massey Ferguson'],
  forklifts: ['Linde', 'Jungheinrich', 'Toyota', 'Hyster', 'Still']
};

const locations = [
  { city: 'Hamburg', country: 'Germany' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'Munich', country: 'Germany' },
  { city: 'Rotterdam', country: 'Netherlands' },
  { city: 'Amsterdam', country: 'Netherlands' },
  { city: 'Brussels', country: 'Belgium' },
  { city: 'Warsaw', country: 'Poland' },
  { city: 'Prague', country: 'Czech Republic' },
  { city: 'Vienna', country: 'Austria' },
  { city: 'Paris', country: 'France' },
  { city: 'Lyon', country: 'France' },
  { city: 'Milan', country: 'Italy' },
  { city: 'Rome', country: 'Italy' },
  { city: 'Madrid', country: 'Spain' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Stockholm', country: 'Sweden' },
  { city: 'Copenhagen', country: 'Denmark' }
];

const truckImages = [
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800',
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800',
  'https://images.unsplash.com/photo-1586339277861-b0b895343ba5?w=800',
  'https://images.unsplash.com/photo-1562247970-f8c6b3b6c623?w=800',
  'https://images.unsplash.com/photo-1581440209684-e48506e3dfcb?w=800',
  'https://images.unsplash.com/photo-1622547891750-b1e8f170d7d8?w=800'
];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(array) {
  return array[random(0, array.length - 1)];
}

function generateTrucks() {
  const trucks = [];

  // Semi-Trailer Trucks (40 listings)
  for (let i = 0; i < 40; i++) {
    const brand = randomItem(brands.trucks);
    const year = random(2015, 2023);
    const location = randomItem(locations);
    const models = {
      'Mercedes-Benz': ['Actros', 'Arocs', 'Atego'],
      'MAN': ['TGX', 'TGS', 'TGL'],
      'Scania': ['R', 'S', 'G'],
      'Volvo': ['FH', 'FM', 'FE'],
      'DAF': ['XF', 'CF', 'LF'],
      'Renault': ['T', 'C', 'K'],
      'Iveco': ['Stralis', 'S-Way', 'Eurocargo']
    };

    trucks.push({
      title: `${brand} ${randomItem(models[brand])} ${random(400, 600)} 4x2`,
      brand,
      model: randomItem(models[brand]),
      year,
      price: random(25000, 75000),
      currency: 'EUR',
      mileage: random(50000, 800000),
      condition: year >= 2022 ? 'Used' : 'Used',
      location: location.city,
      country: location.country,
      category: 'semi-trailer-trucks',
      engine_power: random(400, 600),
      transmission: random(0, 1) ? 'Automatic' : 'Manual',
      fuel_type: 'Diesel',
      axle_configuration: randomItem(['4x2', '6x2', '6x4']),
      color: randomItem(['White', 'Blue', 'Silver', 'Red', 'Green']),
      description: `Professional ${brand} semi-trailer truck in excellent condition. Regular maintenance, full service history, ready for long-distance transportation.`,
      seller_name: `${location.city} Trucks ${random(1, 99)}`,
      seller_phone: `+${random(30, 50)} ${random(10, 99)} ${random(100000, 999999)}`,
      seller_email: `sales@${location.city.toLowerCase()}trucks${random(1, 99)}.com`,
      image_url: randomItem(truckImages),
      user_id: 1
    });
  }

  // Trucks over 7.5t (25 listings)
  for (let i = 0; i < 25; i++) {
    const brand = randomItem(brands.trucks);
    const year = random(2014, 2023);
    const location = randomItem(locations);

    trucks.push({
      title: `${brand} Box Truck ${random(12, 26)}t GVW`,
      brand,
      model: randomItem(['Atego', 'TGL', 'FL', 'LF', 'Eurocargo']),
      year,
      price: random(18000, 45000),
      currency: 'EUR',
      mileage: random(80000, 650000),
      condition: 'Used',
      location: location.city,
      country: location.country,
      category: 'trucks-over-7.5t',
      engine_power: random(220, 360),
      transmission: random(0, 1) ? 'Automatic' : 'Manual',
      fuel_type: 'Diesel',
      axle_configuration: '4x2',
      color: randomItem(['White', 'Silver', 'Yellow']),
      description: `Reliable box truck for distribution and logistics. Spacious cargo area, lift gate available, perfect for urban deliveries.`,
      seller_name: `${location.city} Commercial Vehicles`,
      seller_phone: `+${random(30, 50)} ${random(10, 99)} ${random(100000, 999999)}`,
      seller_email: `info@${location.city.toLowerCase()}cv.com`,
      image_url: randomItem(truckImages),
      user_id: 1
    });
  }

  // Vans/Trucks up to 7.5t (20 listings)
  for (let i = 0; i < 20; i++) {
    const brand = randomItem(['Mercedes-Benz', 'Iveco', 'Renault', 'Ford', 'Volkswagen']);
    const year = random(2016, 2023);
    const location = randomItem(locations);

    trucks.push({
      title: `${brand} ${randomItem(['Sprinter', 'Daily', 'Master', 'Transit'])} ${random(3.5, 7.2)}t`,
      brand,
      model: randomItem(['Sprinter', 'Daily', 'Master', 'Transit', 'Crafter']),
      year,
      price: random(12000, 35000),
      currency: 'EUR',
      mileage: random(45000, 280000),
      condition: 'Used',
      location: location.city,
      country: location.country,
      category: 'vans-up-to-7.5t',
      engine_power: random(140, 180),
      transmission: random(0, 1) ? 'Automatic' : 'Manual',
      fuel_type: randomItem(['Diesel', 'Diesel']),
      axle_configuration: '4x2',
      color: randomItem(['White', 'Silver', 'Grey']),
      description: `Light commercial vehicle ideal for small businesses. Fuel efficient, easy to maneuver, perfect for city deliveries.`,
      seller_name: `${location.city} Light Commercials`,
      seller_phone: `+${random(30, 50)} ${random(10, 99)} ${random(100000, 999999)}`,
      seller_email: `sales@${location.city.toLowerCase()}lc.com`,
      image_url: randomItem(truckImages),
      user_id: 1
    });
  }

  // Trailers (15 listings)
  for (let i = 0; i < 15; i++) {
    const brand = randomItem(['Schmitz', 'Krone', 'Kögel', 'Schwarzmüller', 'Wielton']);
    const year = random(2014, 2022);
    const location = randomItem(locations);

    trucks.push({
      title: `${brand} ${randomItem(['Curtainsider', 'Box', 'Refrigerated'])} Trailer`,
      brand,
      model: randomItem(['S01', 'SD', 'SCS', 'Cool Liner']),
      year,
      price: random(8000, 28000),
      currency: 'EUR',
      mileage: 0,
      condition: 'Used',
      location: location.city,
      country: location.country,
      category: 'trailer',
      engine_power: 0,
      transmission: 'N/A',
      fuel_type: 'N/A',
      axle_configuration: randomItem(['3-axle', '2-axle']),
      color: randomItem(['White', 'Silver', 'Grey']),
      description: `High-quality trailer with excellent payload capacity. SAF or BPW axles, drum brakes, good condition.`,
      seller_name: `${location.city} Trailer Center`,
      seller_phone: `+${random(30, 50)} ${random(10, 99)} ${random(100000, 999999)}`,
      seller_email: `info@${location.city.toLowerCase()}trailers.com`,
      image_url: randomItem(truckImages),
      user_id: 1
    });
  }

  // Construction Machines (18 listings)
  for (let i = 0; i < 18; i++) {
    const brand = randomItem(brands.construction);
    const year = random(2012, 2023);
    const location = randomItem(locations);
    const types = ['Excavator', 'Wheel Loader', 'Bulldozer', 'Backhoe Loader'];
    const type = randomItem(types);

    trucks.push({
      title: `${brand} ${type} ${random(15, 40)}t`,
      brand,
      model: `${randomItem(['320', '330', '450', '950', 'D6', 'D8'])}`,
      year,
      price: random(35000, 180000),
      currency: 'EUR',
      mileage: random(1000, 15000),
      condition: year >= 2020 ? 'Used' : 'Used',
      location: location.city,
      country: location.country,
      category: 'construction',
      engine_power: random(120, 380),
      transmission: 'Hydrostatic',
      fuel_type: 'Diesel',
      axle_configuration: type === 'Excavator' ? 'Tracked' : '4x4',
      color: randomItem(['Yellow', 'Orange', 'Green']),
      description: `Professional construction equipment. Well maintained, recent service, ready for heavy-duty work. ${random(1000, 15000)} operating hours.`,
      seller_name: `${location.city} Construction Equipment`,
      seller_phone: `+${random(30, 50)} ${random(10, 99)} ${random(100000, 999999)}`,
      seller_email: `sales@${location.city.toLowerCase()}construction.com`,
      image_url: randomItem(truckImages),
      user_id: 1
    });
  }

  // Buses and Coaches (12 listings)
  for (let i = 0; i < 12; i++) {
    const brand = randomItem(brands.buses);
    const year = random(2013, 2022);
    const location = randomItem(locations);

    trucks.push({
      title: `${brand} ${randomItem(['Touring', 'City', 'Intercity'])} Bus ${random(45, 65)} seats`,
      brand,
      model: randomItem(['Tourismo', 'Citaro', 'InterLink']),
      year,
      price: random(45000, 185000),
      currency: 'EUR',
      mileage: random(150000, 750000),
      condition: 'Used',
      location: location.city,
      country: location.country,
      category: 'buses-coaches',
      engine_power: random(320, 460),
      transmission: 'Automatic',
      fuel_type: 'Diesel',
      axle_configuration: '4x2',
      color: randomItem(['White', 'Blue', 'Silver', 'Red']),
      description: `Comfortable passenger bus with ${random(45, 65)} seats. Air conditioning, entertainment system, luggage compartments, excellent condition.`,
      seller_name: `${location.city} Bus & Coach`,
      seller_phone: `+${random(30, 50)} ${random(10, 99)} ${random(100000, 999999)}`,
      seller_email: `sales@${location.city.toLowerCase()}buses.com`,
      image_url: randomItem(truckImages),
      user_id: 1
    });
  }

  // Agricultural Vehicles (14 listings)
  for (let i = 0; i < 14; i++) {
    const brand = randomItem(brands.agricultural);
    const year = random(2014, 2023);
    const location = randomItem(locations);

    trucks.push({
      title: `${brand} Tractor ${random(100, 300)} HP`,
      brand,
      model: randomItem(['6', '7', '8', 'M', 'T', 'Puma']),
      year,
      price: random(28000, 120000),
      currency: 'EUR',
      mileage: random(500, 8000),
      condition: 'Used',
      location: location.city,
      country: location.country,
      category: 'agricultural',
      engine_power: random(100, 300),
      transmission: randomItem(['Powershift', 'CVT', 'Manual']),
      fuel_type: 'Diesel',
      axle_configuration: '4x4',
      color: randomItem(['Green', 'Red', 'Blue']),
      description: `Professional agricultural tractor. Front linkage, PTO, hydraulic outlets, air conditioning. ${random(500, 8000)} operating hours.`,
      seller_name: `${location.city} Agricultural Machinery`,
      seller_phone: `+${random(30, 50)} ${random(10, 99)} ${random(100000, 999999)}`,
      seller_email: `info@${location.city.toLowerCase()}agri.com`,
      image_url: randomItem(truckImages),
      user_id: 1
    });
  }

  // Forklifts (10 listings)
  for (let i = 0; i < 10; i++) {
    const brand = randomItem(brands.forklifts);
    const year = random(2015, 2023);
    const location = randomItem(locations);

    trucks.push({
      title: `${brand} Forklift ${random(2.0, 5.0)}t Capacity`,
      brand,
      model: randomItem(['H', 'E', 'RX', 'S']),
      year,
      price: random(12000, 35000),
      currency: 'EUR',
      mileage: random(500, 12000),
      condition: 'Used',
      location: location.city,
      country: location.country,
      category: 'forklift',
      engine_power: random(40, 80),
      transmission: 'Hydrostatic',
      fuel_type: randomItem(['Diesel', 'Electric', 'LPG']),
      axle_configuration: '4x2',
      color: randomItem(['Orange', 'Yellow', 'Blue', 'Green']),
      description: `Industrial forklift truck. Lift height ${random(3, 7)}m, side shift, good condition, recent maintenance. ${random(500, 12000)} operating hours.`,
      seller_name: `${location.city} Material Handling`,
      seller_phone: `+${random(30, 50)} ${random(10, 99)} ${random(100000, 999999)}`,
      seller_email: `sales@${location.city.toLowerCase()}mh.com`,
      image_url: randomItem(truckImages),
      user_id: 1
    });
  }

  // Semi-Trailers (10 listings)
  for (let i = 0; i < 10; i++) {
    const brand = randomItem(['Schmitz', 'Krone', 'Kögel', 'Schwarzmüller']);
    const year = random(2015, 2022);
    const location = randomItem(locations);

    trucks.push({
      title: `${brand} Platform Semi-Trailer ${random(12, 14)}m`,
      brand,
      model: randomItem(['SPR', 'SD', 'Mega']),
      year,
      price: random(9000, 25000),
      currency: 'EUR',
      mileage: 0,
      condition: 'Used',
      location: location.city,
      country: location.country,
      category: 'semi-trailer',
      engine_power: 0,
      transmission: 'N/A',
      fuel_type: 'N/A',
      axle_configuration: '3-axle',
      color: 'Grey',
      description: `Heavy-duty platform semi-trailer. Steel or aluminum platform, twist locks for containers, excellent payload.`,
      seller_name: `${location.city} Semi-Trailers`,
      seller_phone: `+${random(30, 50)} ${random(10, 99)} ${random(100000, 999999)}`,
      seller_email: `info@${location.city.toLowerCase()}semitrailers.com`,
      image_url: randomItem(truckImages),
      user_id: 1
    });
  }

  return trucks;
}

function seedDatabase() {
  console.log('Generating large dataset with 154+ trucks...');
  const trucks = generateTrucks();

  console.log(`Generated ${trucks.length} trucks`);
  console.log('Seeding database...');

  setTimeout(() => {
    const insertStmt = db.prepare(`
      INSERT INTO trucks (
        title, brand, model, year, price, currency, mileage, condition,
        location, country, category, engine_power, transmission, fuel_type,
        axle_configuration, color, description, seller_name, seller_phone,
        seller_email, image_url, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    trucks.forEach(truck => {
      try {
        insertStmt.run(
          truck.title, truck.brand, truck.model, truck.year, truck.price,
          truck.currency, truck.mileage, truck.condition, truck.location,
          truck.country, truck.category, truck.engine_power, truck.transmission,
          truck.fuel_type, truck.axle_configuration, truck.color, truck.description,
          truck.seller_name, truck.seller_phone, truck.seller_email, truck.image_url,
          truck.user_id
        );
      } catch (error) {
        console.error('Error inserting truck:', truck.title, error.message);
      }
    });

    insertStmt.finalize();
    console.log('Database seeded successfully with ' + trucks.length + ' trucks!');
    console.log('Breakdown by category:');
    console.log('- Semi-Trailer Trucks: 40');
    console.log('- Trucks over 7.5t: 25');
    console.log('- Vans/Trucks up to 7.5t: 20');
    console.log('- Construction Machines: 18');
    console.log('- Trailers: 15');
    console.log('- Agricultural Vehicles: 14');
    console.log('- Buses & Coaches: 12');
    console.log('- Semi-Trailers: 10');
    console.log('- Forklifts: 10');

    db.close();
  }, 1000);
}

seedDatabase();
