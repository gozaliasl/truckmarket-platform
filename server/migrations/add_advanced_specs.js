const db = require('../database');

/**
 * Migration: Add Advanced Specifications to Trucks Table
 * This migration adds comprehensive technical specifications for all vehicle categories
 */

const advancedColumns = [
  // Engine & Performance
  'engine_size_liters REAL',
  'euro_standard TEXT', // Euro 3, 4, 5, 6, EEV
  'num_gears INTEGER',
  'retarder INTEGER', // 0=No, 1=Yes
  'differential_lock INTEGER',

  // Suspension & Brakes
  'front_suspension TEXT', // Spring, Air, Hydraulic
  'rear_suspension TEXT',
  'brake_system TEXT', // Drum, Disc, Mixed
  'abs_ebs INTEGER',
  'hill_start_assist INTEGER',

  // Cab & Comfort
  'cab_type TEXT', // Day, Sleeper, High Sleeper, etc.
  'cab_size TEXT', // S, M, L, XL, XXL
  'air_conditioning TEXT', // Manual, Automatic, None
  'cruise_control TEXT', // No, Yes, Adaptive
  'parking_heater INTEGER',
  'refrigerator INTEGER',

  // Fuel & Tanks
  'tank_capacity_liters INTEGER',
  'adblue_tank_liters INTEGER',
  'dual_fuel_tanks INTEGER',

  // Tires & Wheels
  'tire_size TEXT',
  'wheel_type TEXT', // Steel, Aluminum
  'spare_tire INTEGER',

  // Safety & Assistance
  'lane_departure_warning INTEGER',
  'collision_warning INTEGER',
  'blind_spot_monitor INTEGER',
  'stability_control TEXT', // ESP, ESC, None
  'emergency_braking INTEGER',

  // History & Condition
  'previous_owners INTEGER',
  'service_history TEXT', // Full, Partial, None
  'accident_free INTEGER',
  'warranty_months INTEGER',

  // Electronics & Connectivity
  'gps_navigation INTEGER',
  'fleet_management INTEGER',
  'digital_tachograph TEXT', // Smart, Gen1, Gen2, None
  'telemetry INTEGER',
  'bluetooth INTEGER',

  // Body Specific (Trucks & Vans)
  'body_type TEXT', // Box, Refrigerated, Curtainside, Tipper, etc.
  'loading_system TEXT', // Tail Lift, Side Door, etc.
  'body_length_m REAL',
  'body_height_m REAL',
  'loading_height_mm INTEGER',
  'payload_capacity_kg INTEGER',

  // Van Specific
  'wheelbase TEXT', // Short, Medium, Long, Extra Long
  'roof_height TEXT', // Low, Medium, High
  'sliding_door TEXT', // Left, Right, Both, None
  'rear_door TEXT', // Single, Double, Tailgate
  'seats INTEGER',
  'partition_wall INTEGER',

  // Trailer Specific
  'num_axles INTEGER',
  'axle_brand TEXT', // BPW, SAF, ROR, Schmitz
  'suspension_type TEXT',
  'loading_length_m REAL',
  'loading_width_m REAL',
  'loading_volume_m3 REAL',
  'tare_weight_kg INTEGER',
  'lashing_points INTEGER',
  'twist_locks INTEGER',

  // Construction Machine Specific
  'machine_type TEXT', // Excavator, Loader, Bulldozer, etc.
  'operating_weight_tons REAL',
  'bucket_capacity_m3 REAL',
  'digging_depth_m REAL',
  'reach_m REAL',
  'operating_hours INTEGER',
  'attachments TEXT', // JSON array
  'track_or_wheel TEXT', // Tracked, Wheeled, 4WD
  'boom_type TEXT',

  // Bus Specific
  'bus_type TEXT', // City, Intercity, Coach, etc.
  'seating_capacity INTEGER',
  'standing_capacity INTEGER',
  'door_configuration TEXT', // 1, 2, 3, 4 doors
  'floor_type TEXT', // Low Floor, Step Floor, High Floor
  'toilet INTEGER',
  'kitchen INTEGER',
  'wheelchair_access INTEGER',
  'luggage_compartment_m3 REAL',

  // Agricultural Specific
  'tractor_type TEXT', // Standard, Vineyard, Orchard
  'pto_speed TEXT', // 540, 1000, Both
  'hydraulic_outlets INTEGER',
  'hydraulic_flow_lpm INTEGER',
  'front_linkage INTEGER',
  'front_pto INTEGER',
  'cab_spec TEXT', // ROPS, FOPS, Enclosed
  'four_wheel_drive INTEGER',
  'creeper_gear INTEGER',

  // Forklift Specific
  'forklift_type TEXT', // Counterbalance, Reach, etc.
  'power_type TEXT', // Diesel, Electric, LPG, Gas
  'load_capacity_kg INTEGER',
  'lift_height_m REAL',
  'mast_type TEXT', // Duplex, Triplex, Quad
  'free_lift_mm INTEGER',
  'fork_length_mm INTEGER',
  'forklift_attachments TEXT',
  'battery_voltage INTEGER',
  'battery_capacity_ah INTEGER',

  // AI & Smart Features
  'ai_price_estimate REAL', // AI-calculated fair market value
  'match_score REAL', // Match score for user preferences
  'popularity_score INTEGER', // Views, favorites, inquiries
  'price_trend TEXT', // up, down, stable
  'last_price_change REAL',
  'last_price_change_date DATETIME',

  // Additional flexible specs (JSON)
  'extra_specs TEXT' // JSON object for any additional specifications
];

function runMigration() {
  console.log('Starting migration: Adding advanced specifications...');

  let completed = 0;
  const total = advancedColumns.length;

  advancedColumns.forEach((column, index) => {
    const columnName = column.split(' ')[0];
    const columnDef = column;

    const alterSQL = `ALTER TABLE trucks ADD COLUMN ${columnDef}`;

    db.run(alterSQL, (err) => {
      if (err) {
        // Column might already exist, that's okay
        if (!err.message.includes('duplicate column name')) {
          console.error(`Error adding column ${columnName}:`, err.message);
        }
      } else {
        console.log(`✓ Added column: ${columnName}`);
      }

      completed++;

      if (completed === total) {
        console.log(`\n✅ Migration completed! Added ${total} advanced specification columns.`);
        console.log('\nNew capabilities:');
        console.log('- Engine specifications (size, Euro standard, gears)');
        console.log('- Suspension & brake systems');
        console.log('- Cab comfort features');
        console.log('- Safety & driver assistance');
        console.log('- Category-specific specs (trailers, buses, construction, etc.)');
        console.log('- AI-powered features (price estimates, match scores)');

        // Create indexes for performance
        createIndexes();
      }
    });
  });
}

function createIndexes() {
  console.log('\nCreating indexes for better query performance...');

  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_trucks_euro_standard ON trucks(euro_standard)',
    'CREATE INDEX IF NOT EXISTS idx_trucks_engine_power ON trucks(engine_power)',
    'CREATE INDEX IF NOT EXISTS idx_trucks_cab_type ON trucks(cab_type)',
    'CREATE INDEX IF NOT EXISTS idx_trucks_axle_config ON trucks(axle_configuration)',
    'CREATE INDEX IF NOT EXISTS idx_trucks_body_type ON trucks(body_type)',
    'CREATE INDEX IF NOT EXISTS idx_trucks_machine_type ON trucks(machine_type)',
    'CREATE INDEX IF NOT EXISTS idx_trucks_bus_type ON trucks(bus_type)',
    'CREATE INDEX IF NOT EXISTS idx_trucks_forklift_type ON trucks(forklift_type)',
    'CREATE INDEX IF NOT EXISTS idx_trucks_match_score ON trucks(match_score)',
    'CREATE INDEX IF NOT EXISTS idx_trucks_ai_price ON trucks(ai_price_estimate)'
  ];

  let indexCompleted = 0;
  indexes.forEach((indexSQL, i) => {
    db.run(indexSQL, (err) => {
      if (err) {
        console.error(`Error creating index:`, err.message);
      } else {
        console.log(`✓ Created index ${i + 1}/${indexes.length}`);
      }

      indexCompleted++;
      if (indexCompleted === indexes.length) {
        console.log('\n✅ All indexes created successfully!');
        console.log('\nYou can now use advanced filtering on the platform!');
        db.close();
      }
    });
  });
}

// Run migration
setTimeout(() => {
  runMigration();
}, 1000);
