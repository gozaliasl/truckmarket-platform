# Advanced Filter System Specification

## Category-Specific Filters

### 1. SEMI-TRAILER TRUCKS (Truck Tractors)
**General Filters:**
- Brand: Mercedes-Benz, MAN, Scania, Volvo, DAF, Renault, Iveco, etc.
- Model Series:
  - Mercedes: Actros, Arocs, Atego
  - MAN: TGX, TGS, TGL, TGM, TGE
  - Scania: R-Series, S-Series, G-Series, P-Series
  - Volvo: FH, FH16, FM, FMX, FL
  - DAF: XF, XG, XG+, CF, LF
  - Renault: T, C, K, D
  - Iveco: S-Way, Stralis, X-Way, Eurocargo

**Technical Specifications:**
- Engine Power: Range (HP) - 200-700 HP
- Engine Size: Range (Liters) - 4L to 16L
- Euro Standard: Euro 3, Euro 4, Euro 5, Euro 6, EEV
- Axle Configuration: 4x2, 4x4, 6x2, 6x4, 8x2, 8x4, 8x6, 8x8
- Transmission Type: Manual, Automatic, Semi-automatic
- Number of Gears: 6-16 gears
- Retarder: Yes/No/Optional
- Differential Lock: Yes/No

**Suspension & Brakes:**
- Front Suspension: Spring, Air, Hydraulic
- Rear Suspension: Spring, Air, Hydraulic
- Brake System: Drum, Disc, Mixed
- ABS/EBS: Yes/No
- Hill Start Assist: Yes/No

**Cab & Comfort:**
- Cab Type: Day Cab, Sleeper Cab, High Sleeper, Low Sleeper, Mega Sleeper
- Cab Size: S, M, L, XL, XXL
- Air Conditioning: Manual, Automatic, None
- Cruise Control: Yes/No/Adaptive
- Parking Heater: Yes/No (Webasto, Eberspächer)
- Refrigerator: Yes/No

**Fuel & Tank:**
- Fuel Type: Diesel, LNG, CNG, Hybrid, Electric
- Tank Capacity: Range (Liters) - 200-1500L
- AdBlue Tank: Range (Liters)
- Dual Fuel Tanks: Yes/No

**Tires & Wheels:**
- Tire Size: 295/80R22.5, 315/70R22.5, 385/65R22.5, etc.
- Wheel Type: Steel, Aluminum
- Spare Tire: Yes/No/2x

**Safety & Driver Assistance:**
- Lane Departure Warning: Yes/No
- Collision Warning: Yes/No
- Blind Spot Monitor: Yes/No
- Stability Control: ESP, ESC
- Emergency Braking: Yes/No

**Condition & History:**
- Mileage Range: 0-50k, 50-100k, 100-200k, 200-400k, 400-600k, 600-800k, 800k+
- First Registration: Year range
- Previous Owners: 1, 2, 3, 4+
- Service History: Full, Partial, None
- Accident Free: Yes/No/Unknown
- Warranty: Yes/No - Months remaining

**Connectivity & Electronics:**
- GPS Navigation: Yes/No
- Fleet Management System: Yes/No
- Digital Tachograph: Yes/No (Smart/Gen 1/Gen 2)
- Telemetry: Yes/No
- Bluetooth: Yes/No

---

### 2. TRUCKS OVER 7.5T
**Additional Specific Filters:**
- Body Type: Box, Refrigerated, Curtainside, Tipper, Platform, Dropside
- Loading System: Tail Lift, Side Door, Roller Door, Barn Doors
- Body Length: 4m, 5m, 6m, 7m, 8m, 9m, 10m+
- Body Height: Standard, High, Extra High
- Loading Height: Range (mm)
- Payload Capacity: Range (kg)

---

### 3. VANS & LIGHT TRUCKS (≤ 7.5T)
**Specific Filters:**
- Wheelbase: Short, Medium, Long, Extra Long
- Roof Height: Low, Medium, High
- Sliding Door: Left, Right, Both, None
- Rear Door: Single, Double, Tailgate
- Seats: 2, 3, 6, 9
- Partition Wall: Yes/No

---

### 4. CONSTRUCTION MACHINES
**Machine Type Specific:**
- Machine Type: Excavator, Wheel Loader, Bulldozer, Backhoe, Grader, Roller
- Operating Weight: Range (tons)
- Bucket Capacity: Range (m³)
- Digging Depth: Range (m)
- Reach: Range (m)
- Operating Hours: Range
- Attachments: Bucket, Hammer, Grapple, etc.
- Track/Wheel: Tracked, Wheeled, 4WD
- Boom Type: Standard, Long Reach, Telescopic

---

### 5. TRAILERS & SEMI-TRAILERS
**Specific Filters:**
- Trailer Type: Curtainside, Box, Platform, Tipper, Refrigerated, Tanker, Low Loader
- Number of Axles: 1, 2, 3, 4+
- Axle Type: BPW, SAF, ROR, Schmitz
- Brake System: Drum, Disc
- Suspension: Air, Spring, Hydraulic
- Loading Length: Range (m)
- Loading Width: Range (m)
- Loading Height: Range (m)
- Loading Volume: Range (m³)
- Payload: Range (kg)
- Tare Weight: Range (kg)
- Lashing Points: Number
- Twist Locks: Yes/No (for containers)

---

### 6. BUSES & COACHES
**Specific Filters:**
- Bus Type: City, Intercity, Coach, School, Minibus, Double Decker, Articulated
- Seating Capacity: Range (seats)
- Standing Capacity: Range
- Door Configuration: 1, 2, 3, 4 doors
- Floor Type: Low Floor, Step Floor, High Floor
- Toilet: Yes/No
- Kitchen: Yes/No
- Wheelchair Access: Yes/No
- Luggage Compartment: Volume (m³)

---

### 7. AGRICULTURAL VEHICLES
**Tractor Specific:**
- Tractor Type: Standard, Vineyard, Orchard, Utility
- Power (HP): Range
- PTO Speed: 540 rpm, 1000 rpm, Both
- Hydraulic Outlets: Number (2-6)
- Hydraulic Flow: Range (L/min)
- Front Linkage: Yes/No
- Front PTO: Yes/No
- Cab: ROPS, FOPS, Enclosed
- Four-Wheel Drive: Yes/No
- Creeper Gear: Yes/No

---

### 8. FORKLIFTS
**Specific Filters:**
- Forklift Type: Counterbalance, Reach, Order Picker, Pallet Truck
- Power Type: Diesel, Electric, LPG, Gas
- Load Capacity: Range (kg/tons)
- Lift Height: Range (m)
- Mast Type: Duplex, Triplex, Quad
- Free Lift: Range (mm)
- Fork Length: Range (mm)
- Attachments: Side Shift, Fork Positioner, Clamp, Rotator
- Battery: Voltage (V), Capacity (Ah)
- Operating Hours: Range

---

## AI-Powered Features

### 1. Smart Search
- Natural language processing: "I need a Mercedes Actros with Euro 6, automatic transmission, low mileage"
- Auto-suggestions based on partial input
- Search by VIN number
- Image-based search (upload photo, find similar trucks)

### 2. Price Intelligence
- AI price estimation based on specs
- Market price comparison
- Price trend analysis
- Value for money score

### 3. Recommendations
- "Similar vehicles you might like"
- "Users who viewed this also viewed"
- "Best value in this category"
- "Recently reduced prices"

### 4. Match Score
- Calculate compatibility score based on user requirements
- Highlight why a vehicle matches (or doesn't match) criteria
- Missing features alert

### 5. Saved Searches & Alerts
- Save complex filter combinations
- Email/SMS alerts for new matching listings
- Price drop alerts
- Favorite comparisons

### 6. Virtual Assistant
- Chat-based search: "Show me all Scania R450 from 2020-2023 with under 500k km"
- Specification explanations
- Buying advice based on use case

---

## Database Schema Updates Required

### New Tables:
1. `truck_specifications` - Extended technical specs
2. `truck_features` - Features checklist (checkboxes)
3. `truck_images` - Multiple images per truck
4. `user_searches` - Saved searches
5. `price_history` - Track price changes
6. `user_favorites` - Saved vehicles
7. `vehicle_comparisons` - Side-by-side comparisons
8. `ai_recommendations` - ML-based recommendations

### Updated Columns in `trucks` table:
- All technical specifications listed above
- JSON field for flexible additional specs
- Search vector for full-text search
