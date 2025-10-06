// Comprehensive filter configuration based on requirements
export const FILTER_SECTIONS = {
  basicData: {
    title: 'Basic Data',
    icon: '📋',
    filters: {
      condition: {
        label: 'Condition',
        type: 'radio',
        options: ['Any', 'New', 'Used'],
        default: 'Any'
      },
      make: {
        label: 'Make',
        type: 'dropdown',
        options: [] // Dynamic based on category
      },
      model: {
        label: 'Model',
        type: 'text',
        placeholder: 'e.g. FH 12, ACTROS 1846'
      },
      registrationDate: {
        label: 'Registration Date',
        type: 'range-year',
        from: { label: 'From', min: 1990, max: new Date().getFullYear() },
        to: { label: 'To', min: 1990, max: new Date().getFullYear() }
      },
      mileage: {
        label: 'Mileage (km)',
        type: 'range-number',
        from: { label: 'From', placeholder: '0' },
        to: { label: 'To', placeholder: '1,000,000' }
      },
      price: {
        label: 'Price (€)',
        type: 'range-number',
        from: { label: 'From', placeholder: '0' },
        to: { label: 'To', placeholder: '500,000' }
      },
      power: {
        label: 'Power',
        type: 'range-number-with-unit',
        from: { label: 'From', placeholder: '0' },
        to: { label: 'To', placeholder: '1000' },
        unit: { options: ['HP', 'kW'], default: 'HP' }
      },
      country: {
        label: 'Country',
        type: 'dropdown',
        options: [
          'Any', 'Germany', 'France', 'Netherlands', 'Belgium', 'Poland', 'Czech Republic',
          'Austria', 'Italy', 'Spain', 'UK', 'Sweden', 'Norway', 'Denmark', 'Switzerland'
        ]
      },
      location: {
        label: 'City / ZIP',
        type: 'autocomplete',
        placeholder: 'Enter city or postal code'
      },
      radius: {
        label: 'Search Radius',
        type: 'dropdown',
        options: ['Any', '10 km', '50 km', '100 km', '200 km', '500 km'],
        default: 'Any'
      },
      includeDelivery: {
        label: 'Include delivery offers',
        type: 'checkbox'
      }
    }
  },

  engine: {
    title: 'Engine',
    icon: '⚙️',
    filters: {
      fuelType: {
        label: 'Fuel Type',
        type: 'multi-select',
        options: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG', 'CNG', 'Hydrogen']
      },
      tankVolume: {
        label: 'Tank Volume (L)',
        type: 'range-number',
        from: { label: 'From', placeholder: '0' },
        to: { label: 'To', placeholder: '1500' }
      },
      cylinders: {
        label: 'Cylinders',
        type: 'range-number',
        from: { label: 'From', placeholder: '2' },
        to: { label: 'To', placeholder: '16' }
      },
      transmission: {
        label: 'Transmission',
        type: 'dropdown',
        options: ['Any', 'Automatic', 'Semi-Automatic', 'Manual']
      },
      emissionClass: {
        label: 'Emission Class',
        type: 'dropdown',
        options: ['Any', 'Euro 3', 'Euro 4', 'Euro 5', 'Euro 6', 'EEV']
      },
      emissionSticker: {
        label: 'Emission Sticker',
        type: 'dropdown',
        options: ['Any', '0', '1', '2', '3', '4']
      },
      particulateFilter: {
        label: 'Particulate Filter',
        type: 'radio',
        options: ['Any', 'Yes', 'No']
      }
    }
  },

  features: {
    title: 'Features',
    icon: '✨',
    filters: {
      axles: {
        label: 'Axles',
        type: 'dropdown',
        options: ['Any', '2', '3', 'More than 3']
      },
      wheelFormula: {
        label: 'Wheel Formula',
        type: 'multi-select',
        options: ['4x2', '4x4', '6x2', '6x4', '6x6', '8x2', '8x4', '8x6', '8x8']
      },
      weight: {
        label: 'Weight (kg)',
        type: 'range-number',
        from: { label: 'From', placeholder: '0' },
        to: { label: 'To', placeholder: '50000' }
      },
      licensedWeight: {
        label: 'Licensed Weight (kg)',
        type: 'range-number',
        from: { label: 'From', placeholder: '0' },
        to: { label: 'To', placeholder: '50000' }
      },
      hydraulicInstallation: {
        label: 'Hydraulic Installation',
        type: 'radio',
        options: ['Any', 'Yes', 'No']
      },
      cruiseControl: {
        label: 'Cruise Control',
        type: 'radio',
        options: ['Any', 'Yes', 'No']
      },
      drivingCab: {
        label: 'Driving Cab',
        type: 'dropdown',
        options: ['Any', 'Local', 'Long Distance']
      },
      airConditioning: {
        label: 'Air Conditioning',
        type: 'dropdown',
        options: ['Any', 'None', 'Manual', 'Automatic']
      },
      interiorFeatures: {
        label: 'Interior Features',
        type: 'multi-select',
        options: [
          'Navigation System',
          'Retarder',
          'Right-hand Drive',
          'Heated Seats',
          'Leather Seats',
          'Electric Windows',
          'Central Locking',
          'Adjustable Steering Wheel',
          'Onboard Computer',
          'Parking Sensors'
        ]
      },
      exteriorColor: {
        label: 'Exterior Color',
        type: 'color-picker',
        options: [
          { name: 'White', hex: '#FFFFFF' },
          { name: 'Black', hex: '#000000' },
          { name: 'Silver', hex: '#C0C0C0' },
          { name: 'Gray', hex: '#808080' },
          { name: 'Red', hex: '#FF0000' },
          { name: 'Blue', hex: '#0000FF' },
          { name: 'Green', hex: '#008000' },
          { name: 'Yellow', hex: '#FFFF00' },
          { name: 'Orange', hex: '#FFA500' },
          { name: 'Brown', hex: '#8B4513' }
        ],
        finishes: ['Matte', 'Metallic', 'Glossy']
      }
    }
  },

  offerDetails: {
    title: 'Offer Details',
    icon: '📄',
    filters: {
      adOnlineSince: {
        label: 'Ad Online Since',
        type: 'date-range',
        from: { label: 'From' },
        to: { label: 'To' }
      },
      damagedVehicles: {
        label: 'Include Damaged Vehicles',
        type: 'toggle'
      },
      fullServiceHistory: {
        label: 'Full Service History',
        type: 'checkbox'
      },
      newHU: {
        label: 'New HU / Service',
        type: 'checkbox'
      },
      rentingPossible: {
        label: 'Renting Possible',
        type: 'checkbox'
      },
      adsWithPictures: {
        label: 'Ads with Pictures',
        type: 'checkbox'
      },
      adsWithVideo: {
        label: 'Ads with Video',
        type: 'checkbox'
      },
      discountOffers: {
        label: 'Discount Offers',
        type: 'checkbox'
      },
      sellerType: {
        label: 'Seller Type',
        type: 'radio',
        options: ['Any', 'Dealer', 'Private', 'Company']
      },
      dealerRating: {
        label: 'Dealer Rating',
        type: 'dropdown',
        options: ['Any', '3+ Stars', '4+ Stars', '5 Stars']
      }
    }
  }
};

// Sorting options
export const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Newest Ads First', sortBy: 'created_at', sortOrder: 'DESC' },
  { value: 'created_at_asc', label: 'Oldest Ads First', sortBy: 'created_at', sortOrder: 'ASC' },
  { value: 'price_asc', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'ASC' },
  { value: 'price_desc', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'DESC' },
  { value: 'mileage_asc', label: 'Mileage: Low to High', sortBy: 'mileage', sortOrder: 'ASC' },
  { value: 'mileage_desc', label: 'Mileage: High to Low', sortBy: 'mileage', sortOrder: 'DESC' },
  { value: 'year_desc', label: 'Year: Newest First', sortBy: 'year', sortOrder: 'DESC' },
  { value: 'year_asc', label: 'Year: Oldest First', sortBy: 'year', sortOrder: 'ASC' }
];

// Popular makes by category
export const POPULAR_MAKES = {
  'semi-trailer-trucks': ['Mercedes-Benz', 'MAN', 'Scania', 'Volvo', 'DAF', 'Renault', 'Iveco'],
  'trucks-over-7.5t': ['Mercedes-Benz', 'MAN', 'Scania', 'Volvo', 'DAF', 'Renault', 'Iveco'],
  'vans-up-to-7.5t': ['Mercedes-Benz', 'Ford', 'Renault', 'Volkswagen', 'Fiat', 'Peugeot', 'Citroën'],
  'construction': ['Caterpillar', 'Komatsu', 'Volvo', 'Liebherr', 'Hitachi', 'JCB', 'Case'],
  'agricultural': ['John Deere', 'Case IH', 'New Holland', 'Massey Ferguson', 'Fendt', 'Claas'],
  'buses-coaches': ['Mercedes-Benz', 'MAN', 'Scania', 'Volvo', 'Setra', 'Neoplan', 'VDL'],
  'trailer': ['Schmitz', 'Krone', 'Schwarzmüller', 'Kögel', 'Wielton', 'Fruehauf'],
  'forklift': ['Toyota', 'Linde', 'Jungheinrich', 'Still', 'Hyster', 'Crown', 'Caterpillar'],
  'semi-trailer': ['Schmitz', 'Krone', 'Schwarzmüller', 'Kögel', 'Wielton', 'Fruehauf']
};
