// Category-Specific Filter Configurations
// Each category has its own specialized filters

export const CATEGORY_FILTERS = {
  'semi-trailer-trucks': {
    name: 'Semi-Trailer Trucks',
    filters: [
      {
        id: 'brand',
        label: 'Brand',
        icon: '🏭',
        type: 'select',
        options: [
          'Mercedes-Benz', 'MAN', 'Scania', 'Volvo', 'DAF', 'Renault', 'Iveco',
          'Freightliner', 'Kenworth', 'Peterbilt', 'Mack'
        ]
      },
      {
        id: 'model',
        label: 'Model Series',
        icon: '📋',
        type: 'text',
        placeholder: 'e.g., Actros, TGX, FH...'
      },
      {
        id: 'powerRange',
        label: 'Engine Power (HP)',
        icon: '⚡',
        type: 'range',
        min: 200,
        max: 700,
        step: 50
      },
      {
        id: 'euroStandard',
        label: 'Euro Standard',
        icon: '♻️',
        type: 'select',
        options: ['Euro 3', 'Euro 4', 'Euro 5', 'Euro 6', 'EEV']
      },
      {
        id: 'axleConfig',
        label: 'Axle Configuration',
        icon: '🔧',
        type: 'select',
        options: ['4x2', '4x4', '6x2', '6x4', '8x2', '8x4']
      },
      {
        id: 'transmission',
        label: 'Transmission',
        icon: '⚙️',
        type: 'select',
        options: ['Manual', 'Automatic', 'Semi-automatic']
      },
      {
        id: 'cabType',
        label: 'Cab Type',
        icon: '🏠',
        type: 'select',
        options: ['Day Cab', 'Sleeper Cab', 'High Sleeper', 'Low Sleeper', 'Mega Sleeper']
      },
      {
        id: 'retarder',
        label: 'Retarder',
        icon: '🛑',
        type: 'checkbox'
      },
      {
        id: 'airConditioning',
        label: 'Air Conditioning',
        icon: '❄️',
        type: 'select',
        options: ['Any', 'Manual', 'Automatic', 'None']
      },
      {
        id: 'cruiseControl',
        label: 'Cruise Control',
        icon: '🎯',
        type: 'select',
        options: ['Any', 'Standard', 'Adaptive', 'None']
      }
    ]
  },

  'trucks-over-7.5t': {
    name: 'Trucks over 7.5t',
    filters: [
      {
        id: 'brand',
        label: 'Brand',
        icon: '🏭',
        type: 'select',
        options: ['Mercedes-Benz', 'MAN', 'Scania', 'Volvo', 'DAF', 'Renault', 'Iveco']
      },
      {
        id: 'bodyType',
        label: 'Body Type',
        icon: '📦',
        type: 'select',
        options: ['Box', 'Refrigerated', 'Curtainside', 'Tipper', 'Platform', 'Dropside', 'Tanker']
      },
      {
        id: 'bodyLength',
        label: 'Body Length (m)',
        icon: '📏',
        type: 'select',
        options: ['4m', '5m', '6m', '7m', '8m', '9m', '10m+']
      },
      {
        id: 'loadingSystem',
        label: 'Loading System',
        icon: '⬆️',
        type: 'select',
        options: ['Tail Lift', 'Side Door', 'Roller Door', 'Barn Doors', 'None']
      },
      {
        id: 'payloadCapacity',
        label: 'Payload Capacity (kg)',
        icon: '⚖️',
        type: 'range',
        min: 1000,
        max: 15000,
        step: 500
      },
      {
        id: 'euroStandard',
        label: 'Euro Standard',
        icon: '♻️',
        type: 'select',
        options: ['Euro 3', 'Euro 4', 'Euro 5', 'Euro 6']
      }
    ]
  },

  'vans-up-to-7.5t': {
    name: 'Vans & Light Trucks ≤ 7.5t',
    filters: [
      {
        id: 'brand',
        label: 'Brand',
        icon: '🏭',
        type: 'select',
        options: ['Mercedes-Benz', 'Ford', 'Volkswagen', 'Iveco', 'Renault', 'Peugeot', 'Citroen', 'Fiat']
      },
      {
        id: 'wheelbase',
        label: 'Wheelbase',
        icon: '↔️',
        type: 'select',
        options: ['Short', 'Medium', 'Long', 'Extra Long']
      },
      {
        id: 'roofHeight',
        label: 'Roof Height',
        icon: '⬆️',
        type: 'select',
        options: ['Low', 'Medium', 'High']
      },
      {
        id: 'slidingDoor',
        label: 'Sliding Door',
        icon: '🚪',
        type: 'select',
        options: ['None', 'Left', 'Right', 'Both']
      },
      {
        id: 'seats',
        label: 'Number of Seats',
        icon: '💺',
        type: 'select',
        options: ['2', '3', '6', '9']
      }
    ]
  },

  'construction': {
    name: 'Construction Machines',
    filters: [
      {
        id: 'machineType',
        label: 'Machine Type',
        icon: '🏗️',
        type: 'select',
        options: ['Excavator', 'Wheel Loader', 'Bulldozer', 'Backhoe Loader', 'Grader', 'Roller', 'Dump Truck']
      },
      {
        id: 'brand',
        label: 'Brand',
        icon: '🏭',
        type: 'select',
        options: ['Caterpillar', 'Komatsu', 'Hitachi', 'JCB', 'Volvo', 'Liebherr', 'Doosan', 'Hyundai']
      },
      {
        id: 'operatingWeight',
        label: 'Operating Weight (tons)',
        icon: '⚖️',
        type: 'range',
        min: 1,
        max: 100,
        step: 5
      },
      {
        id: 'operatingHours',
        label: 'Operating Hours',
        icon: '⏱️',
        type: 'range',
        min: 0,
        max: 20000,
        step: 1000
      },
      {
        id: 'trackOrWheel',
        label: 'Track/Wheel',
        icon: '🔧',
        type: 'select',
        options: ['Tracked', 'Wheeled', '4WD']
      }
    ]
  },

  'trailer': {
    name: 'Trailers',
    filters: [
      {
        id: 'brand',
        label: 'Brand',
        icon: '🏭',
        type: 'select',
        options: ['Schmitz', 'Krone', 'Kögel', 'Schwarzmüller', 'Wielton', 'Fruehauf', 'Humbaur']
      },
      {
        id: 'bodyType',
        label: 'Trailer Type',
        icon: '📦',
        type: 'select',
        options: ['Curtainside', 'Box', 'Platform', 'Tipper', 'Refrigerated', 'Tanker', 'Car Transporter']
      },
      {
        id: 'numAxles',
        label: 'Number of Axles',
        icon: '🔧',
        type: 'select',
        options: ['1', '2', '3', '4+']
      },
      {
        id: 'axleBrand',
        label: 'Axle Brand',
        icon: '⚙️',
        type: 'select',
        options: ['BPW', 'SAF', 'ROR', 'Schmitz']
      },
      {
        id: 'suspensionType',
        label: 'Suspension',
        icon: '🔩',
        type: 'select',
        options: ['Air', 'Spring', 'Hydraulic']
      },
      {
        id: 'brakeSystem',
        label: 'Brake System',
        icon: '🛑',
        type: 'select',
        options: ['Drum', 'Disc', 'Mixed']
      }
    ]
  },

  'agricultural': {
    name: 'Agricultural Vehicles',
    filters: [
      {
        id: 'brand',
        label: 'Brand',
        icon: '🏭',
        type: 'select',
        options: ['John Deere', 'Case IH', 'New Holland', 'Fendt', 'Massey Ferguson', 'Claas', 'Kubota', 'Deutz-Fahr']
      },
      {
        id: 'tractorType',
        label: 'Tractor Type',
        icon: '🚜',
        type: 'select',
        options: ['Standard', 'Vineyard', 'Orchard', 'Utility']
      },
      {
        id: 'powerRange',
        label: 'Power (HP)',
        icon: '⚡',
        type: 'range',
        min: 50,
        max: 400,
        step: 25
      },
      {
        id: 'fourWheelDrive',
        label: '4WD',
        icon: '🔧',
        type: 'checkbox'
      },
      {
        id: 'operatingHours',
        label: 'Operating Hours',
        icon: '⏱️',
        type: 'range',
        min: 0,
        max: 15000,
        step: 500
      }
    ]
  },

  'buses-coaches': {
    name: 'Buses & Coaches',
    filters: [
      {
        id: 'busType',
        label: 'Bus Type',
        icon: '🚌',
        type: 'select',
        options: ['City Bus', 'Intercity', 'Coach', 'School Bus', 'Minibus', 'Double Decker', 'Articulated']
      },
      {
        id: 'brand',
        label: 'Brand',
        icon: '🏭',
        type: 'select',
        options: ['Mercedes-Benz', 'MAN', 'Scania', 'Volvo', 'Setra', 'VanHool', 'Iveco', 'Irisbus']
      },
      {
        id: 'seatingCapacity',
        label: 'Seating Capacity',
        icon: '💺',
        type: 'range',
        min: 10,
        max: 80,
        step: 5
      },
      {
        id: 'floorType',
        label: 'Floor Type',
        icon: '🔽',
        type: 'select',
        options: ['Low Floor', 'Step Floor', 'High Floor']
      },
      {
        id: 'wheelchairAccess',
        label: 'Wheelchair Access',
        icon: '♿',
        type: 'checkbox'
      },
      {
        id: 'toilet',
        label: 'Toilet',
        icon: '🚽',
        type: 'checkbox'
      }
    ]
  },

  'semi-trailer': {
    name: 'Semi-Trailers',
    filters: [
      {
        id: 'brand',
        label: 'Brand',
        icon: '🏭',
        type: 'select',
        options: ['Schmitz', 'Krone', 'Kögel', 'Schwarzmüller']
      },
      {
        id: 'bodyType',
        label: 'Type',
        icon: '📦',
        type: 'select',
        options: ['Platform', 'Curtainside', 'Box', 'Refrigerated', 'Tanker', 'Low Loader', 'Container Chassis']
      },
      {
        id: 'numAxles',
        label: 'Axles',
        icon: '🔧',
        type: 'select',
        options: ['1', '2', '3', '4+']
      },
      {
        id: 'twistLocks',
        label: 'Twist Locks (Container)',
        icon: '🔒',
        type: 'checkbox'
      }
    ]
  },

  'forklift': {
    name: 'Forklifts',
    filters: [
      {
        id: 'forkliftType',
        label: 'Forklift Type',
        icon: '⚙️',
        type: 'select',
        options: ['Counterbalance', 'Reach Truck', 'Order Picker', 'Pallet Truck', 'Stacker']
      },
      {
        id: 'brand',
        label: 'Brand',
        icon: '🏭',
        type: 'select',
        options: ['Linde', 'Jungheinrich', 'Toyota', 'Hyster', 'Still', 'Caterpillar', 'Crown', 'Yale']
      },
      {
        id: 'powerType',
        label: 'Power Type',
        icon: '🔋',
        type: 'select',
        options: ['Electric', 'Diesel', 'LPG', 'Gas']
      },
      {
        id: 'loadCapacity',
        label: 'Load Capacity (kg)',
        icon: '⚖️',
        type: 'range',
        min: 500,
        max: 10000,
        step: 500
      },
      {
        id: 'liftHeight',
        label: 'Lift Height (m)',
        icon: '⬆️',
        type: 'range',
        min: 2,
        max: 12,
        step: 0.5
      },
      {
        id: 'operatingHours',
        label: 'Operating Hours',
        icon: '⏱️',
        type: 'range',
        min: 0,
        max: 20000,
        step: 500
      }
    ]
  }
};

// Common filters that appear in all categories
export const COMMON_FILTERS = [
  {
    id: 'yearRange',
    label: 'Year of Registration',
    icon: '📅',
    type: 'year-range'
  },
  {
    id: 'mileageRange',
    label: 'Mileage (km)',
    icon: '🛣️',
    type: 'range',
    min: 0,
    max: 1500000,
    step: 50000
  },
  {
    id: 'priceRange',
    label: 'Price (EUR)',
    icon: '💰',
    type: 'price-range'
  },
  {
    id: 'location',
    label: 'Location',
    icon: '📍',
    type: 'text',
    placeholder: 'City or ZIP code'
  },
  {
    id: 'condition',
    label: 'Condition',
    icon: '✨',
    type: 'select',
    options: ['New', 'Used', 'Damaged']
  }
];

export default CATEGORY_FILTERS;
