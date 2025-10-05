const db = require('./database');

const sampleTrucks = [
  {
    title: "Mercedes-Benz Actros 1851 LS 4x2 Euro 6",
    brand: "Mercedes-Benz",
    model: "Actros 1851",
    year: 2019,
    price: 45500,
    currency: "EUR",
    mileage: 385000,
    condition: "Used",
    location: "Hamburg",
    country: "Germany",
    category: "Tractor Unit",
    engine_power: 510,
    transmission: "Automatic",
    fuel_type: "Diesel",
    axle_configuration: "4x2",
    color: "White",
    description: "Well-maintained Mercedes-Benz Actros with full service history. Euro 6 emission standard, automatic transmission, air conditioning, cruise control, and advanced safety features.",
    seller_name: "Hamburg Trucks GmbH",
    seller_phone: "+49 40 123456",
    seller_email: "sales@hamburgtrucks.de",
    image_url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800"
  },
  {
    title: "Volvo FH 500 6x2 Globetrotter XL",
    brand: "Volvo",
    model: "FH 500",
    year: 2020,
    price: 52000,
    currency: "EUR",
    mileage: 290000,
    condition: "Used",
    location: "Rotterdam",
    country: "Netherlands",
    category: "Tractor Unit",
    engine_power: 500,
    transmission: "Automatic",
    fuel_type: "Diesel",
    axle_configuration: "6x2",
    color: "Blue",
    description: "Excellent Volvo FH with Globetrotter XL cabin. Low mileage, full options including I-Shift automatic transmission, adaptive cruise control, and premium interior.",
    seller_name: "Rotterdam Transport Solutions",
    seller_phone: "+31 10 987654",
    seller_email: "info@rotterdamtransport.nl",
    image_url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800"
  },
  {
    title: "MAN TGX 18.480 4x2 BLS",
    brand: "MAN",
    model: "TGX 18.480",
    year: 2018,
    price: 38900,
    currency: "EUR",
    mileage: 520000,
    condition: "Used",
    location: "Munich",
    country: "Germany",
    category: "Tractor Unit",
    engine_power: 480,
    transmission: "Automatic",
    fuel_type: "Diesel",
    axle_configuration: "4x2",
    color: "Red",
    description: "Reliable MAN TGX with TipMatic automated transmission. Regular maintenance, good condition, ready for work.",
    seller_name: "Bavaria Trucks",
    seller_phone: "+49 89 234567",
    seller_email: "contact@bavariatrucks.de",
    image_url: "https://images.unsplash.com/photo-1586339277861-b0b895343ba5?w=800"
  },
  {
    title: "Scania R 450 Highline 4x2",
    brand: "Scania",
    model: "R 450",
    year: 2021,
    price: 58000,
    currency: "EUR",
    mileage: 180000,
    condition: "Used",
    location: "Warsaw",
    country: "Poland",
    category: "Tractor Unit",
    engine_power: 450,
    transmission: "Automatic",
    fuel_type: "Diesel",
    axle_configuration: "4x2",
    color: "Silver",
    description: "Nearly new Scania R 450 Highline with very low mileage. Perfect condition, full warranty remaining, Opticruise automatic gearbox.",
    seller_name: "Polish Trucks Center",
    seller_phone: "+48 22 345678",
    seller_email: "sales@polishtrucks.pl",
    image_url: "https://images.unsplash.com/photo-1562247970-f8c6b3b6c623?w=800"
  },
  {
    title: "DAF XF 480 FT 4x2 Super Space Cab",
    brand: "DAF",
    model: "XF 480",
    year: 2019,
    price: 47500,
    currency: "EUR",
    mileage: 410000,
    condition: "Used",
    location: "Brussels",
    country: "Belgium",
    category: "Tractor Unit",
    engine_power: 480,
    transmission: "Automatic",
    fuel_type: "Diesel",
    axle_configuration: "4x2",
    color: "Green",
    description: "DAF XF with Super Space Cab, excellent for long distance. TraXon automatic transmission, full comfort package, well maintained.",
    seller_name: "Benelux Trucks",
    seller_phone: "+32 2 456789",
    seller_email: "info@beneluxtrucks.be",
    image_url: "https://images.unsplash.com/photo-1581440209684-e48506e3dfcb?w=800"
  },
  {
    title: "Iveco Stralis 460 Hi-Way 4x2",
    brand: "Iveco",
    model: "Stralis 460",
    year: 2017,
    price: 32000,
    currency: "EUR",
    mileage: 680000,
    condition: "Used",
    location: "Milan",
    country: "Italy",
    category: "Tractor Unit",
    engine_power: 460,
    transmission: "Automatic",
    fuel_type: "Diesel",
    axle_configuration: "4x2",
    color: "White",
    description: "Iveco Stralis Hi-Way with EuroTronic automated transmission. High mileage but well serviced, good working condition.",
    seller_name: "Italian Trucks Milano",
    seller_phone: "+39 02 567890",
    seller_email: "vendite@italiantrucks.it",
    image_url: "https://images.unsplash.com/photo-1622547891750-b1e8f170d7d8?w=800"
  },
  {
    title: "Renault T 520 High Sleeper 4x2",
    brand: "Renault",
    model: "T 520",
    year: 2020,
    price: 49000,
    currency: "EUR",
    mileage: 320000,
    condition: "Used",
    location: "Lyon",
    country: "France",
    category: "Tractor Unit",
    engine_power: 520,
    transmission: "Automatic",
    fuel_type: "Diesel",
    axle_configuration: "4x2",
    color: "Blue",
    description: "Powerful Renault T 520 with Optidriver automatic transmission. High Sleeper cabin, excellent comfort, well equipped.",
    seller_name: "France Poids Lourds",
    seller_phone: "+33 4 678901",
    seller_email: "vente@francepoidslourds.fr",
    image_url: "https://images.unsplash.com/photo-1581440209684-e48506e3dfcb?w=800"
  },
  {
    title: "Mercedes-Benz Arocs 3345 6x4 Tipper",
    brand: "Mercedes-Benz",
    model: "Arocs 3345",
    year: 2018,
    price: 68000,
    currency: "EUR",
    mileage: 240000,
    condition: "Used",
    location: "Berlin",
    country: "Germany",
    category: "Tipper",
    engine_power: 450,
    transmission: "Manual",
    fuel_type: "Diesel",
    axle_configuration: "6x4",
    color: "Yellow",
    description: "Heavy-duty Mercedes-Benz Arocs tipper truck. Steel body, excellent for construction work, powerful engine, reliable performance.",
    seller_name: "Berlin Construction Vehicles",
    seller_phone: "+49 30 789012",
    seller_email: "info@berlinconstruction.de",
    image_url: "https://images.unsplash.com/photo-1581440209684-e48506e3dfcb?w=800"
  }
];

function seedDatabase() {
  console.log('Seeding database with sample trucks...');

  // Wait for tables to be created
  setTimeout(() => {
    const insertStmt = db.prepare(`
      INSERT INTO trucks (
        title, brand, model, year, price, currency, mileage, condition,
        location, country, category, engine_power, transmission, fuel_type,
        axle_configuration, color, description, seller_name, seller_phone,
        seller_email, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    sampleTrucks.forEach(truck => {
      insertStmt.run(
        truck.title, truck.brand, truck.model, truck.year, truck.price,
        truck.currency, truck.mileage, truck.condition, truck.location,
        truck.country, truck.category, truck.engine_power, truck.transmission,
        truck.fuel_type, truck.axle_configuration, truck.color, truck.description,
        truck.seller_name, truck.seller_phone, truck.seller_email, truck.image_url
      );
    });

    insertStmt.finalize();
    console.log('Database seeded successfully!');
    db.close();
  }, 1000);
}

seedDatabase();
