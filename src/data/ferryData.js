export const TERMINALS = [
  {
    id: 'jack-layton',
    name: 'Jack Layton Ferry Terminal',
    shortName: 'Jack Layton',
    type: 'mainland',
    location: '9 Queens Quay West, Toronto',
    description: 'Main downtown departure hub at the foot of Bay Street with 4 active boarding slips, ticket kiosks, and transit links.',
    transit: 'TTC Union Station (Subway Line 1), 509 Harbourfront & 510 Spadina Streetcars',
    coordinates: { x: 50, y: 15 },
    gates: ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4']
  },
  {
    id: 'centre-island',
    name: 'Centre Island Terminal',
    shortName: 'Centre Island',
    type: 'island',
    location: 'Central Toronto Island',
    description: 'Most popular island destination featuring Centreville Amusement Park, Franklin Children’s Garden, bike rentals, and vast picnic grounds.',
    transit: 'Island Tram Service, Bicycles, Walking Paths',
    coordinates: { x: 50, y: 75 },
    transitTimeMinutes: 13,
    distanceKm: 2.1
  },
  {
    id: 'hanlans-point',
    name: "Hanlan's Point Terminal",
    shortName: "Hanlan's Point",
    type: 'island',
    location: 'Western Toronto Island',
    description: 'Direct access to Hanlan’s Point Beach, historic Gibraltar Point Lighthouse (1808), baseball diamonds, and bike trails.',
    transit: 'Billy Bishop Pedestrian Tunnel nearby, Walking/Bike Trails',
    coordinates: { x: 22, y: 65 },
    transitTimeMinutes: 11,
    distanceKm: 1.8
  },
  {
    id: 'wards-island',
    name: "Ward's Island Terminal",
    shortName: "Ward's Island",
    type: 'island',
    location: 'Eastern Toronto Island',
    description: 'Charming 1920s historic cottage community, tranquil sandy beaches, waterfront boardwalk, and The Riviera Cafe.',
    transit: 'Waterfront Boardwalk, Residential Footpaths',
    coordinates: { x: 78, y: 70 },
    transitTimeMinutes: 15,
    distanceKm: 2.5
  }
];

export const FLEET = [
  {
    id: 'sam-mcbride',
    name: 'MV Sam McBride',
    yearBuilt: 1939,
    capacity: 750,
    speedKnots: 10.4,
    status: 'In Service',
    assignedRoute: 'Centre Island',
    currentLoad: 480,
    captain: 'Capt. R. Campbell',
    batteryFuel: '92%',
    type: 'Double-Ended Passenger'
  },
  {
    id: 'thomas-rennie',
    name: 'MV Thomas Rennie',
    yearBuilt: 1951,
    capacity: 750,
    speedKnots: 9.8,
    status: 'In Service',
    assignedRoute: "Hanlan's Point",
    currentLoad: 310,
    captain: 'Capt. M. D’Souza',
    batteryFuel: '88%',
    type: 'Double-Ended Passenger'
  },
  {
    id: 'william-inglis',
    name: 'MV William Inglis',
    yearBuilt: 1935,
    capacity: 750,
    speedKnots: 10.1,
    status: 'In Service',
    assignedRoute: "Ward's Island",
    currentLoad: 410,
    captain: 'Capt. L. Tremblay',
    batteryFuel: '84%',
    type: 'Double-Ended Passenger'
  },
  {
    id: 'ongiara',
    name: 'MV Ongiara',
    yearBuilt: 1963,
    capacity: 220,
    vehicleCapacity: 10,
    speedKnots: 8.5,
    status: 'In Service',
    assignedRoute: 'Hanlan’s Vehicle / Cargo',
    currentLoad: 65,
    captain: 'Capt. E. Kovacs',
    batteryFuel: '79%',
    type: 'Vehicle & Passenger Ro-Ro'
  },
  {
    id: 'ps-trillium',
    name: 'PS Trillium',
    yearBuilt: 1910,
    capacity: 800,
    speedKnots: 7.5,
    status: 'Standby / Special Events',
    assignedRoute: 'Charter & Peak Relief',
    currentLoad: 0,
    captain: 'Capt. H. Sterling',
    batteryFuel: '95%',
    type: 'Historic Side-Wheel Steam Paddle Ferry'
  }
];

export const INITIAL_SCHEDULES = [
  {
    id: 'SCH-01',
    from: 'Jack Layton Ferry Terminal',
    to: 'Centre Island',
    vessel: 'MV Sam McBride',
    departureTime: '15:45',
    frequencyMins: 15,
    status: 'Boarding',
    gate: 'Gate 2',
    capacityTotal: 750,
    capacityBooked: 520,
    weatherNotice: 'Calm water crossing'
  },
  {
    id: 'SCH-02',
    from: 'Jack Layton Ferry Terminal',
    to: "Hanlan's Point",
    vessel: 'MV Thomas Rennie',
    departureTime: '16:00',
    frequencyMins: 30,
    status: 'On Time',
    gate: 'Gate 1',
    capacityTotal: 750,
    capacityBooked: 340,
    weatherNotice: 'Light breeze 8 kts'
  },
  {
    id: 'SCH-03',
    from: 'Jack Layton Ferry Terminal',
    to: "Ward's Island",
    vessel: 'MV William Inglis',
    departureTime: '16:15',
    frequencyMins: 30,
    status: 'On Time',
    gate: 'Gate 3',
    capacityTotal: 750,
    capacityBooked: 390,
    weatherNotice: 'Good visibility'
  },
  {
    id: 'SCH-04',
    from: 'Centre Island',
    to: 'Jack Layton Ferry Terminal',
    vessel: 'MV Sam McBride',
    departureTime: '16:30',
    frequencyMins: 15,
    status: 'Scheduled',
    gate: 'Centre Dock',
    capacityTotal: 750,
    capacityBooked: 290,
    weatherNotice: 'Normal return transit'
  },
  {
    id: 'SCH-05',
    from: 'Jack Layton Ferry Terminal',
    to: 'Centre Island',
    vessel: 'MV Sam McBride',
    departureTime: '17:00',
    frequencyMins: 15,
    status: 'Scheduled',
    gate: 'Gate 2',
    capacityTotal: 750,
    capacityBooked: 180,
    weatherNotice: 'Peak evening service'
  },
  {
    id: 'SCH-06',
    from: "Ward's Island",
    to: 'Jack Layton Ferry Terminal',
    vessel: 'MV William Inglis',
    departureTime: '17:15',
    frequencyMins: 30,
    status: 'Scheduled',
    gate: "Ward's Dock",
    capacityTotal: 750,
    capacityBooked: 145,
    weatherNotice: 'Quiet commuter transit'
  }
];

export const FARES = {
  adult: { title: 'Adult', subtitle: 'Ages 20 – 64', price: 9.11, icon: 'Users' },
  senior: { title: 'Senior', subtitle: 'Ages 65+', price: 5.86, icon: 'Award' },
  youth: { title: 'Youth', subtitle: 'Ages 15 – 19', price: 5.86, icon: 'UserCheck' },
  junior: { title: 'Junior / Child', subtitle: 'Ages 2 – 14', price: 4.29, icon: 'Smile' },
  infant: { title: 'Infant', subtitle: 'Under 2 years', price: 0.0, icon: 'Heart' },
  bicycle: { title: 'Bicycle / Stroller', subtitle: 'Free transport with passenger', price: 0.0, icon: 'Bike' }
};

export const PARKS_AND_TRAILS = [
  {
    id: 'centreville-amusement',
    name: 'Centreville Amusement Park',
    category: 'Family Attractions',
    destination: 'Centre Island',
    image: '/images/centre-island.jpg',
    hours: '10:30 AM – 7:00 PM',
    rating: 4.8,
    reviewsCount: 3420,
    description: 'Over 30 vintage rides, historic carousel, roller coasters, swan pedal boats, and sweet treat shops nestled in lush gardens.',
    features: ['30+ Rides & Carousel', 'Far Enough Farm Petting Zoo', 'Food & Ice Cream', 'Family Restrooms'],
    accessible: true,
    distanceFromDock: '3 min walk from Centre Island Dock'
  },
  {
    id: 'hanlans-beach',
    name: "Hanlan's Point Beach & Dunes",
    category: 'Beaches & Waterfront',
    destination: "Hanlan's Point",
    image: '/images/hanlan-beach.jpg',
    hours: 'Dawn to 11:00 PM',
    rating: 4.9,
    reviewsCount: 2890,
    description: 'Famous sandy beach with soft dunes, sunset views over Lake Ontario, and both family recreational and clothing-optional areas.',
    features: ['Soft Sandy Shoreline', 'Lifeguards on Duty (Summer)', 'Beach Volleyball Nets', 'Clothing-Optional Area'],
    accessible: true,
    distanceFromDock: '8 min walk from Hanlan’s Dock'
  },
  {
    id: 'gibraltar-lighthouse',
    name: 'Gibraltar Point Lighthouse',
    category: 'Historic Landmarks',
    destination: "Hanlan's Point",
    image: '/images/hanlan-beach.jpg',
    hours: 'Open 24/7 (Exterior Grounds)',
    rating: 4.7,
    reviewsCount: 1540,
    description: 'Constructed in 1808, this is the oldest surviving stone structure in Toronto and oldest operating lighthouse on the Great Lakes.',
    features: ['Heritage 1808 Stone Tower', 'Ghost Legend of J.P. Radelmüller', 'Interpretive Plaques', 'Paved Cycling Path'],
    accessible: true,
    distanceFromDock: '12 min walk / 4 min cycle'
  },
  {
    id: 'island-boardwalk-trail',
    name: 'The Great Island Boardwalk Trail',
    category: 'Scenic Trails',
    destination: "Ward's Island to Centre Island",
    image: '/images/hero-ferry.jpg',
    hours: 'Open 24/7',
    rating: 4.9,
    reviewsCount: 4210,
    description: 'Scenic 5.5-kilometre paved and wooden boardwalk running along the south shore of Lake Ontario with panoramic lake and skyline vistas.',
    features: ['5.5 km Scenic Walking Route', 'Lake Ontario Breeze & Sunsets', 'Rest Benches every 200m', 'Dog Friendly on Leash'],
    accessible: true,
    distanceFromDock: 'Directly at Ward’s & Centre Docks'
  },
  {
    id: 'franklin-childrens-garden',
    name: 'Franklin Children’s Garden',
    category: 'Family Attractions',
    destination: 'Centre Island',
    image: '/images/centre-island.jpg',
    hours: 'Dawn to Dusk',
    rating: 4.8,
    reviewsCount: 1890,
    description: 'Based on the beloved Franklin the Turtle book series, featuring interactive story stations, frog ponds, and hands-on pollinator gardens.',
    features: ['Turtle Pond & Statues', 'Pollinator Conservatory', 'Storybook Trail', 'Free Admission'],
    accessible: true,
    distanceFromDock: '5 min walk from Centre Island Dock'
  },
  {
    id: 'wards-island-community',
    name: "Ward's Island Heritage Cottages & Riviera Cafe",
    category: 'Dining & Heritage',
    destination: "Ward's Island",
    image: '/images/hero-ferry.jpg',
    hours: '11:00 AM – 9:00 PM',
    rating: 4.9,
    reviewsCount: 2150,
    description: 'Unique car-free bohemian community of 1920s heritage cottage gardens, artisan studios, and the iconic patio of The Island Cafe and Riviera.',
    features: ['Car-free Peaceful Streets', 'Lakeside Patio Dining', 'Local Artisans', 'Historic 1920s Architecture'],
    accessible: true,
    distanceFromDock: '2 min walk from Ward’s Dock'
  }
];

export const INITIAL_ALERTS = [
  {
    id: 'ALT-101',
    severity: 'Advisory',
    title: 'Weekend High Rider Volume Anticipated',
    message: 'Warm sunny weather expected this weekend. Online advance ticket purchases recommended to bypass in-person terminal queues.',
    time: 'Updated 25m ago',
    active: true,
    route: 'All Ferry Routes'
  },
  {
    id: 'ALT-102',
    severity: 'Normal',
    title: 'All Four Terminals Operating On Regular Spring Schedule',
    message: 'Jack Layton, Centre Island, Hanlan’s Point, and Ward’s Island docks are operating with 15-minute headway on primary runs.',
    time: 'Updated 1h ago',
    active: true,
    route: 'System-Wide'
  },
  {
    id: 'ALT-103',
    severity: 'Notice',
    title: 'Bicycle & Cargo Loading Guidelines',
    message: 'Bicycles, strollers, and wagons board via Port Gate 3 at Jack Layton Terminal. Electric cargo bikes must not exceed 20 km/h on island trails.',
    time: 'Permanent Advisory',
    active: true,
    route: 'Jack Layton Terminal'
  }
];

export const INITIAL_USER_PASSES = [
  {
    id: 'TO-FRY-98214',
    date: '2026-10-18',
    route: 'Jack Layton Terminal ➔ Centre Island',
    from: 'Jack Layton Ferry Terminal',
    to: 'Centre Island',
    passengers: '2 Adults, 1 Junior',
    tripType: 'Round Trip',
    amount: 22.51,
    status: 'Active / Valid',
    gate: 'Gate 2',
    qrPayload: 'TORONTO-ISLAND-FERRY:TO-FRY-98214:VALID:2A1J',
    vessel: 'MV Sam McBride',
    departureSlot: '15:45'
  },
  {
    id: 'TO-FRY-84192',
    date: '2026-10-12',
    route: "Jack Layton Terminal ➔ Ward's Island",
    from: 'Jack Layton Ferry Terminal',
    to: "Ward's Island",
    passengers: '1 Adult + 1 Bicycle',
    tripType: 'Single Trip',
    amount: 9.11,
    status: 'Completed',
    gate: 'Gate 3',
    qrPayload: 'TORONTO-ISLAND-FERRY:TO-FRY-84192:COMPLETED:1A',
    vessel: 'MV William Inglis',
    departureSlot: '10:30'
  }
];

export const AMENITIES_LIST = [
  { name: 'Jack Layton Public Restrooms', status: 'Open', accessible: true, location: 'Terminal Concourse' },
  { name: 'Centre Island Main Washrooms', status: 'Open', accessible: true, location: 'Adjacent to Ferry Dock' },
  { name: 'Centreville Family Restrooms', status: 'Open', accessible: true, location: 'Amusement Park Gate' },
  { name: "Hanlan's Beach Washroom Pavillion", status: 'Open', accessible: true, location: 'Beach Boardwalk' },
  { name: "Ward's Island Community Restrooms", status: 'Open', accessible: true, location: 'Opposite Ferry Dock' },
  { name: 'Water Bottle Refill Stations (12x)', status: 'Active', accessible: true, location: 'All Terminal Entrances' },
  { name: 'Island First Aid & Paramedic Post', status: 'Staffed', accessible: true, location: 'Centre Island Central Hub' },
  { name: 'City Bike Lock Stations', status: 'Available', accessible: true, location: 'All 4 Ferry Docks' }
];
