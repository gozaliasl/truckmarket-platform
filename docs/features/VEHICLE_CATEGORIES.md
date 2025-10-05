# Vehicle Categories & Advanced Filtering

The TruckMarket platform now features a comprehensive vehicle category selection system with advanced filtering capabilities.

## 🚛 Available Vehicle Categories

The homepage presents 9 main vehicle categories:

### 1. **Trucks over 7.5 t** 🚛
Heavy duty trucks and lorries for commercial transport

### 2. **Trailer** 🚜
All types of trailers for various purposes

### 3. **Vans/Trucks up to 7.5 t** 🚐
Light commercial vehicles for urban delivery and small transport

### 4. **Semi-Trailer Trucks** 🚚
Tractor units designed to pull semi-trailers

### 5. **Semi-trailer** 🚛
Semi-trailers and platforms for long-haul transport

### 6. **Buses and Coaches** 🚌
Passenger transport vehicles for public and private use

### 7. **Agricultural Vehicles** 🚜
Tractors and farming equipment for agricultural operations

### 8. **Construction Machines** 🏗️
Excavators, loaders, and other construction equipment

### 9. **Forklift Trucks** ⚙️
Industrial forklifts for warehouse and logistics operations

---

## 🔍 Advanced Filtering System

After selecting a vehicle category, users can filter results using multiple criteria:

### Filter Options:

#### **Make**
- Dropdown selection
- Options: Any, Mercedes-Benz, Volvo, Scania, MAN, DAF, Iveco, Renault, Isuzu, Hino, Freightliner, Mack, Peterbilt, Kenworth
- Allows filtering by manufacturer

#### **Model**
- Text input field
- Free-form entry
- Example: "Actros 1851", "FH16", etc.

#### **1st Registration**
- Date range filter
- From year: Dropdown (Any, 1990-2025)
- To year: Dropdown (Any, 1990-2025)
- Filter vehicles by registration date

#### **Mileage**
- Numeric input
- "Up to" filter (maximum mileage in km)
- Example: 150000 km
- Shows only vehicles below specified mileage

#### **Price Type**
- Radio button selection
- Options:
  - **Gross**: Price including VAT
  - **Net**: Price excluding VAT
- Affects how prices are displayed and filtered

#### **Price**
- Numeric input
- "Up to" filter (maximum price in €)
- Example: 50000 €
- Shows only vehicles below specified price

#### **Location**
- Text input field
- City or ZIP code
- Example: "Hamburg", "20095"
- Filter by vehicle location

---

## 📱 User Experience

### Homepage Flow:

1. **Landing Page**
   - Hero section with gradient background
   - Title: "Find Your Perfect Commercial Vehicle"
   - Subtitle: "Browse thousands of trucks, trailers, and commercial vehicles"

2. **Category Selection**
   - 9 large, clickable category cards
   - Each with:
     - Icon (emoji representation)
     - Category name
     - Description
   - Hover effects with elevation and color

3. **Filter Panel**
   - Appears after category selection
   - Breadcrumb navigation ("← Back to Categories")
   - Category icon and name displayed
   - Filter form with all options
   - Two buttons:
     - "Reset Filters" - Clear all filters
     - "Search" - Apply filters and search

4. **Results Display**
   - Number of vehicles found
   - Grid layout of vehicle cards
   - Loading spinner during search
   - Empty state if no results

---

## 🎨 Design Features

### Visual Elements:

**Hero Section**:
- Purple gradient background (#667eea → #764ba2)
- Large, bold title text
- Professional appearance

**Category Cards**:
- White background with border
- Large emoji icons (64px)
- Hover effects:
  - Border color changes to purple
  - Card elevates 8px
  - Box shadow appears
  - Smooth transitions (0.3s)

**Filter Form**:
- Clean, modern input fields
- 2-column grid layout (responsive)
- Focus states with purple accent
- Clear labels and placeholders
- Radio buttons for price type

**Action Buttons**:
- "Reset Filters": Gray outline style
- "Search": Purple gradient with icon
- Hover elevates button
- Smooth animations

---

## 💻 Technical Implementation

### State Management:

```javascript
const [selectedCategory, setSelectedCategory] = useState(null);
const [filters, setFilters] = useState({
  make: '',
  model: '',
  yearFrom: '',
  yearTo: '',
  mileageTo: '',
  priceType: 'gross',
  priceTo: '',
  location: ''
});
```

### API Integration:

When searching, the component sends a request to:
```
GET /api/trucks?category=CATEGORY&make=MAKE&model=MODEL&...
```

Empty filters are automatically removed from the request.

### Responsive Design:

- **Desktop**: Multi-column grid layouts
- **Tablet**: 2-column layouts
- **Mobile**: Single column, full-width inputs

---

## 🔄 Navigation

### Breadcrumb Navigation:

```
← Back to Categories / Semi-Trailer Trucks
```

Clicking "Back to Categories" returns to category selection, resetting all filters.

### State Preservation:

- Selecting a category initializes empty filters
- Changing category resets all filters
- Filters persist while searching within a category

---

## 🎯 Filter Behavior

### Reset Filters:
Clicking "Reset Filters" sets all fields to:
- Make: '' (Any)
- Model: ''
- Year From: ''
- Year To: ''
- Mileage: ''
- Price Type: 'gross' (default)
- Price: ''
- Location: ''

### Search:
Triggers `fetchVehicles()` which:
1. Gathers all filter values
2. Removes empty/default values
3. Calls backend API with params
4. Updates results display
5. Shows loading spinner during fetch

---

## 📊 Results Display

### Loading State:
- Spinner animation
- "Loading vehicles..." text
- Clean, centered design

### Empty State:
- Search icon (🔍)
- "No vehicles found" message
- Suggestion to adjust filters
- "Reset Filters" button for quick reset

### Results Grid:
- Uses existing `TruckCard` component
- Responsive grid layout
- Shows vehicle count: "X vehicles found"
- Auto-adjusts columns based on screen size

---

## 🚀 Future Enhancements

Potential additions to the filtering system:

1. **Advanced Filters**:
   - Transmission type (Manual/Automatic)
   - Fuel type (Diesel/Electric/Hybrid)
   - Emission standard (Euro 5/6)
   - Engine power range
   - Axle configuration

2. **Sorting Options**:
   - Price (Low to High / High to Low)
   - Year (Newest / Oldest)
   - Mileage (Low to High / High to Low)

3. **Save Search**:
   - Save filter combinations
   - Get notifications for new matches

4. **Compare Vehicles**:
   - Select multiple vehicles
   - Side-by-side comparison

5. **Map View**:
   - Show vehicles on map
   - Filter by distance from location

---

## 📝 Usage Examples

### Example 1: Finding a Recent Mercedes Truck

1. Click "Trucks over 7.5 t"
2. Select Make: "Mercedes-Benz"
3. Set 1st Registration From: "2020"
4. Set Price up to: "80000"
5. Click "Search"

### Example 2: Finding Local Forklifts

1. Click "Forklift Trucks"
2. Enter Location: "Hamburg"
3. Set Mileage up to: "5000"
4. Click "Search"

### Example 3: Budget Semi-Trailers

1. Click "Semi-trailer"
2. Select Price Type: "Net"
3. Set Price up to: "15000"
4. Click "Search"

---

## ✅ Accessibility

The new homepage includes:

- Clear, descriptive labels for all inputs
- Keyboard navigation support
- Focus indicators on interactive elements
- Semantic HTML structure
- Responsive touch targets (minimum 44x44px)
- Screen reader friendly

---

## 🎉 Summary

The new vehicle category system provides:

✅ **9 distinct vehicle categories**  
✅ **7 filter criteria** per category  
✅ **Beautiful, intuitive UI**  
✅ **Responsive design**  
✅ **Fast, smooth interactions**  
✅ **Clear visual feedback**  
✅ **Professional appearance**  

Perfect for users looking for any type of commercial vehicle!
