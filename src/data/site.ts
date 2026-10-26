// Central content & configuration for The 33rd Executive Suites.
// No rates are published on the site: bookings are sent as requests and the
// reservations team replies with availability and the best available rate.

export const site = {
  name: 'The 33rd Executive Suites',
  shortName: 'The 33rd',
  tagline: 'Conscious luxury in the heart of Thimphu',
  description:
    'A boutique luxury hotel in Babesa, Thimphu — one of Bhutan’s only 100% vegetarian and vegan-friendly hotels, with a rooftop bar, Om Spa, signature dining and valley-view suites.',
  url: 'https://the33rdes.com',
  address: {
    street: 'Babesa Highway',
    city: 'Thimphu',
    postalCode: '11001',
    country: 'Bhutan',
    full: 'Babesa Highway, Thimphu 11001, Bhutan',
  },
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=The+33rd+Executive+Suites+Thimphu',
  mapEmbed:
    'https://www.google.com/maps?q=The+33rd+Executive+Suites,+Babesa,+Thimphu,+Bhutan&output=embed',
  phone: '+975 16993333',
  phoneHref: 'tel:+97516993333',
  whatsappHref: 'https://wa.me/97516993333',
  email: 'reservation@the33rdes.com',
  // Booking and enquiry forms post here (FormSubmit, no API key needed). The first submission sends
  // an activation email to this address; click "Activate Form" in it once and requests start arriving.
  formEndpoint: 'https://formsubmit.co/ajax/choki@abit.bt',
  social: {
    facebook: 'https://www.facebook.com/share/1Cpdm4A9DZ/',
    instagram: 'https://www.instagram.com/the33rdexecutivesuites',
    tiktok: 'https://www.tiktok.com/@the33rdexecutivesuites',
  },
  checkIn: '2:00 PM',
  checkOut: '12:00 PM',
  // Hero video. Replace /public/video/hero.* with the hotel's own film when ready.
  heroVideo: {
    webm: '/video/hero.webm?v=2',
    mp4: '/video/hero.mp4?v=2',
    poster: '/video/hero-poster.jpg?v=2',
  },
};

export const nav = [
  { label: 'Overview', href: '/', image: 'lobby-2' },
  { label: 'Destination', href: '/destination', image: 'guide-buddha-point' },
  {
    label: 'Accommodation',
    href: '/rooms',
    image: 'deluxe-4',
    children: [
      { label: 'Valley Suite', href: '/rooms/valley-suite' },
      { label: 'Executive Suite', href: '/rooms/executive-suite' },
      { label: 'Deluxe Suite', href: '/rooms/deluxe-suite' },
      { label: 'Deluxe Premium', href: '/rooms/deluxe-premium' },
      { label: 'Deluxe Standard', href: '/rooms/deluxe-standard' },
    ],
  },
  {
    label: 'Dining',
    href: '/experiences/artisans-table',
    image: 'dining-4',
    children: [
      { label: 'Artisan’s Table', href: '/experiences/artisans-table' },
      { label: 'Salts Rooftop Bar', href: '/experiences/salts-rooftop-bar' },
      { label: 'Sugar Box Café', href: '/experiences/sugar-box-cafe' },
    ],
  },
  {
    label: 'Spa',
    href: '/experiences/om-spa',
    image: 'spa-3',
    children: [
      { label: 'Om Spa', href: '/experiences/om-spa' },
      { label: 'Fitness Centre', href: '/experiences/gym' },
    ],
  },
  { label: 'Meeting & Events', href: '/experiences/the-boardroom', image: 'board-6' },
  { label: 'Travel Guide', href: '/travel-guide', image: 'guide-dochula' },
  { label: 'Gallery', href: '/gallery', image: 'gallery-2' },
  { label: 'Get in Touch', href: '/contact', image: 'lobby-3' },
] as const;

export const policies = {
  maxNights: 30,
  maxRooms: 5,
};

export type Room = {
  slug: string;
  name: string;
  short: string;
  tagline?: string;
  description: string;
  highlight?: string;
  /** The signature room, given pride of place on the home page. */
  featured?: boolean;
  size: string;
  bed: string;
  capacity: number;
  view: string;
  hero: string;
  images: string[];
};

// Deluxe Suite, Deluxe Premium and Deluxe Standard share the Deluxe content for now —
// update each one's description, size and photos once the details are final.
const deluxeDescription = (name: string) =>
  `The ${name} offers a perfect balance of comfort and style. Designed with modern touches and a cosy ambience, it provides everything you need for a relaxing stay — an excellent choice for both leisure and business travellers seeking a refined experience at exceptional value.`;

export const rooms: Room[] = [
  {
    slug: 'valley-suite',
    name: 'Valley Suite',
    short: 'Valley',
    tagline: 'Our most exclusive accommodation.',
    description:
      'The Valley Suite is our most exclusive accommodation, offering a stunning panoramic view of the nunnery across the mountains. Thoughtfully designed for two guests, it blends comfort with sophistication, featuring modern interiors and premium amenities — perfect for travellers who seek both tranquillity and breathtaking scenery.',
    highlight: 'Signature suite · Nunnery view',
    featured: true,
    size: '30 m²',
    bed: 'King or Twin',
    capacity: 2,
    view: 'Valley & nunnery view',
    hero: 'valley-1',
    images: ['valley-1', 'exec-1', 'exec-4', 'exec-2', 'exec-5'],
  },
  {
    slug: 'executive-suite',
    name: 'Executive Suite',
    short: 'Executive',
    tagline: 'Crafted for elegance and relaxation.',
    description:
      'Crafted for elegance and relaxation, the Executive Suite offers a spacious, modern setting with refined interiors and premium amenities. Its luxurious bathtub invites you to unwind in complete comfort — the perfect retreat for those seeking style and tranquillity in the heart of Thimphu.',
    size: '30 m²',
    bed: 'King or Twin',
    capacity: 2,
    view: 'City view',
    hero: 'exec-1',
    images: ['exec-1', 'exec-4', 'exec-3', 'exec-2', 'exec-5'],
  },
  {
    slug: 'deluxe-suite',
    name: 'Deluxe Suite',
    short: 'Deluxe Suite',
    description: deluxeDescription('Deluxe Suite'),
    size: '30 m²',
    bed: 'King or Twin',
    capacity: 2,
    view: 'City view',
    hero: 'deluxe-4',
    images: ['deluxe-4', 'deluxe-3', 'deluxe-1', 'deluxe-5', 'deluxe-2'],
  },
  {
    slug: 'deluxe-premium',
    name: 'Deluxe Premium',
    short: 'Deluxe Premium',
    description: deluxeDescription('Deluxe Premium'),
    size: '30 m²',
    bed: 'King or Twin',
    capacity: 2,
    view: 'City view',
    hero: 'deluxe-3',
    images: ['deluxe-3', 'deluxe-4', 'deluxe-1', 'deluxe-5', 'deluxe-2'],
  },
  {
    slug: 'deluxe-standard',
    name: 'Deluxe Standard',
    short: 'Deluxe Standard',
    description: deluxeDescription('Deluxe Standard'),
    size: '30 m²',
    bed: 'King or Twin',
    capacity: 2,
    view: 'City view',
    hero: 'about-1',
    images: ['about-1', 'deluxe-4', 'deluxe-1', 'deluxe-5', 'deluxe-2'],
  },
];

export const roomAmenities = [
  'Mini kitchen & microwave',
  'Bathtub & rain shower',
  'Air conditioning',
  'Smart TV with satellite channels',
  'High-speed in-room Wi-Fi',
  'Minibar & fridge',
  'Tea & coffee making facilities',
  'Bathrobes & slippers',
  'Premium toiletries & hairdryer',
  'In-room safe',
  'Study desk & telephone',
  'Complimentary refilled water',
  '24-hour room service',
  'Laundry service',
  'Wake-up call service',
];

export type Addon = {
  id: string;
  name: string;
  description: string;
};

// Optional extras guests can ask for when they book.
export const addons: Addon[] = [
  {
    id: 'airport-transfer',
    name: 'Paro Airport Transfer',
    description: 'Private chauffeured transfer between Paro International Airport and the hotel (one way).',
  },
  {
    id: 'spa-ritual',
    name: 'Om Spa Signature Massage',
    description: '60-minute full-body massage with steam & sauna access.',
  },
  {
    id: 'private-dinner',
    name: 'Chef’s Table Dinner',
    description: 'A five-course vegetarian tasting menu at Artisan’s Table.',
  },
  {
    id: 'celebration',
    name: 'Celebration Package',
    description: 'In-room cake from Sugar Box Café, flowers and a bottle of sparkling wine.',
  },
  {
    id: 'late-checkout',
    name: 'Late Check-out',
    description: 'Keep your room until 4:00 PM on your day of departure (subject to availability).',
  },
];

export type Experience = {
  slug: string;
  name: string;
  kind: string;
  tagline: string;
  intro: string;
  body: string[];
  location: string;
  hours: { label: string; value: string }[];
  reserve: 'dining' | 'spa' | 'event' | 'none';
  hero: string;
  images: string[];
};

export const experiences: Experience[] = [
  {
    slug: 'artisans-table',
    name: 'Artisan’s Table',
    kind: 'Signature Restaurant',
    tagline: 'Pure vegetarian, beautifully made.',
    intro:
      'The signature dining experience of The 33rd — sophisticated yet welcoming, from a casual lunch with friends to an elegant dinner with colleagues.',
    body: [
      'Thoughtfully designed with modern décor and subtle artistic touches, Artisan’s Table complements the original artwork displayed throughout the hotel.',
      'We focus on top-quality ingredients, prepared in a strictly pathogen-free kitchen and served with warm, attentive hospitality. Our menu celebrates pure vegetarian cuisine — Indian, Western, Thai and gourmet artisanal dishes. A dedicated Indian chef ensures every Indian dish reflects the richness of its tradition, while all other creations are crafted by our executive chef.',
      'Seating 60 guests, it is a comfortable and inviting space for everything from a leisurely breakfast to a gourmet dinner.',
    ],
    location: '1st Floor',
    hours: [
      { label: 'Breakfast', value: '7:00 AM – 10:00 AM' },
      { label: 'All-day dining', value: '9:00 AM – 9:30 PM' },
    ],
    reserve: 'dining',
    hero: 'dining-4',
    images: ['dining-4', 'dining-5', 'dining-6', 'dining-3', 'food-thali', 'food-zheycha', 'food-salad', 'dining-1', 'food-mango', 'food-burger', 'food-cheesecake'],
  },
  {
    slug: 'salts-rooftop-bar',
    name: 'Salts Rooftop Bar',
    kind: 'Rooftop Bar',
    tagline: 'Sunset above the city.',
    intro:
      'The ultimate rooftop escape — an open-air, tropical setting with relaxed vibes and panoramic views of Thimphu City.',
    body: [
      'With a full bar and a carefully curated selection of craft beers, wines, rums and spirits, Salts is perfect for a sunset cocktail, catching up with friends, or hosting an informal gathering with colleagues.',
      'Our bartenders craft both classic and inventive cocktails, while light bites and snacks complete the experience. Tropical décor, a gentle breeze and a warm welcome make Salts a serene haven above the city.',
    ],
    location: '7th Floor · Rooftop',
    hours: [{ label: 'Daily', value: '10:00 AM – 12:00 AM' }],
    reserve: 'dining',
    hero: 'spa-1',
    images: ['spa-1', 'home-2'],
  },
  {
    slug: 'sugar-box-cafe',
    name: 'Sugar Box Café',
    kind: 'Artisan Bakery & Café',
    tagline: 'Fresh from our in-house bakery.',
    intro:
      'Our in-house bakery and café, serving freshly baked artisanal breads, pastries, cakes and specialty coffee throughout the day.',
    body: [
      'From babka and Japanese milk bread to butter cookies and celebration cakes, everything at Sugar Box is baked in-house every day — the perfect companion to a morning coffee or an afternoon pause.',
    ],
    location: '7th Floor',
    hours: [{ label: 'Daily', value: '10:00 AM – 12:00 AM' }],
    reserve: 'none',
    hero: 'home-1',
    images: ['home-1', 'cafe-3', 'cafe-1', 'gallery-4', 'cafe-2', 'gallery-3'],
  },
  {
    slug: 'om-spa',
    name: 'Om Spa',
    kind: 'Spa & Wellness',
    tagline: 'Rejuvenate body and mind.',
    intro:
      'A sanctuary designed to rejuvenate both body and mind, with personalised treatments, steam and sauna.',
    body: [
      'Our skilled massage therapists offer personalised treatments to ease tension and restore balance, while our steam and sauna facilities provide a soothing environment to refresh and revitalise.',
      'Complemented by invigorating showers and tranquil spaces, Om Spa combines modern comfort with a serene ambience — the perfect escape after a busy day, or a full wellness experience in its own right.',
    ],
    location: '2nd Floor',
    hours: [{ label: 'Daily', value: '10:00 AM – 9:00 PM' }],
    reserve: 'spa',
    hero: 'spa-3',
    images: ['spa-3', 'gallery-1', 'exec-4'],
  },
  {
    slug: 'the-boardroom',
    name: 'The Boardroom',
    kind: 'Meetings & Events',
    tagline: 'Gatherings of up to 100 guests.',
    intro:
      'A versatile conference space designed to host meetings, events and corporate gatherings with ease and style.',
    body: [
      'With a capacity of up to 100 people, The Boardroom provides a professional and comfortable environment for productive sessions or special occasions.',
      'Equipped with modern facilities and thoughtful amenities, it serves hotel guests and local visitors alike — ideal for business meetings, workshops, seminars and private events. Flexible seating and a well-designed layout ensure every gathering runs smoothly.',
    ],
    location: '2nd Floor',
    hours: [{ label: 'Daily', value: '9:00 AM – 12:00 AM' }],
    reserve: 'event',
    hero: 'board-6',
    images: ['board-6', 'board-5', 'board-3', 'spa-2', 'board-1', 'board-2', 'board-4', 'home-3'],
  },
  {
    slug: 'gym',
    name: 'Fitness Centre',
    kind: 'Gym',
    tagline: 'Stay active, feel refreshed.',
    intro:
      'A fully equipped fitness centre with modern cardio and strength-training equipment and views over the valley.',
    body: [
      'Whether you are starting the day with an invigorating workout or unwinding after meetings or sightseeing, the gym is a comfortable and convenient space to maintain your routine and leave feeling refreshed.',
    ],
    location: '2nd Floor',
    hours: [{ label: 'Daily', value: '6:00 AM – 10:00 PM' }],
    reserve: 'none',
    hero: 'gym-1',
    images: ['gym-1', 'gym-2', 'gym-3'],
  },
];

export const stayIncludes = [
  { title: 'Daily breakfast', text: 'Vegetarian breakfast buffet at Artisan’s Table' },
  { title: 'Fitness centre', text: 'Modern cardio & strength equipment' },
  { title: 'High-speed Wi-Fi', text: 'Throughout the hotel and in every room' },
  { title: 'Kitchenette', text: 'Mini kitchen, fridge & microwave in every room' },
  { title: 'Room service', text: 'Attentive in-room dining' },
  { title: 'Free parking', text: 'Secure on-site parking' },
  { title: 'Laundry', text: 'Same-day laundry & pressing' },
  { title: 'Concierge', text: 'Sightseeing, permits & travel planning' },
];

export const attractionCategories = [
  { slug: 'sacred', label: 'Sacred landmarks', intro: 'Dzongs, stupas and mountain passes at the spiritual heart of the capital.' },
  { slug: 'nature', label: 'Nature & outdoors', intro: 'Forest trails, open parks and Bhutan’s national animal — minutes from the city.' },
  { slug: 'culture', label: 'Culture & local life', intro: 'Weaving, museums, markets and archery — the everyday craft and character of Thimphu.' },
] as const;

export type AttractionCategory = (typeof attractionCategories)[number]['slug'];

export const attractions: {
  name: string;
  sub?: string;
  text: string;
  detail: string;
  distance: string;
  image: string;
  category: AttractionCategory;
  featured?: boolean;
}[] = [
  {
    name: 'Buddha Dordenma', sub: 'Kuensel Phodrang', category: 'sacred', featured: true,
    text: 'Panoramic views of the valley beneath the towering Buddha Dordenma statue.',
    detail: 'One of the largest seated Buddha statues in the world, gilded in bronze and gold, looks out over the southern entrance to the valley — and over Babesa. Come early for quiet, or at dusk when the statue glows above the city lights.',
    distance: 'Nearby', image: 'guide-buddha-point',
  },
  {
    name: 'National Memorial Chorten', category: 'sacred',
    text: 'A sacred stupa and spiritual landmark in the heart of Thimphu.',
    detail: 'Built in memory of the Third King, the white-and-gold chorten is circled from dawn until dark by locals spinning prayer wheels and counting beads. Join the walk clockwise — it is one of the most authentic moments in the city.',
    distance: 'In Thimphu', image: 'guide-chorten',
  },
  {
    name: 'Tashichho Dzong', category: 'sacred', featured: true,
    text: 'A majestic fortress and seat of Bhutan’s government and monastic body.',
    detail: 'The great whitewashed dzong on the banks of the Wang Chhu houses the throne room, government offices and the summer home of the central monk body. Visitors are welcome in the evening, when the flag-lowering ceremony takes place.',
    distance: 'In Thimphu', image: 'guide-tashichoedzong',
  },
  {
    name: 'Dochula Pass', category: 'sacred', featured: true,
    text: 'Breathtaking Himalayan views and 108 memorial chortens.',
    detail: 'At 3,100 m on the road to Punakha, 108 chortens stand among prayer flags. On a clear day — most often between October and February — the snow peaks of the eastern Himalaya line the horizon.',
    distance: '19 km · 33 min', image: 'guide-dochula',
  },
  {
    name: 'Chang Yul Park', category: 'nature',
    text: 'A peaceful retreat, perfect for leisurely walks.',
    detail: 'Landscaped paths, open lawns and a children’s play area make this riverside park an easy, unhurried outing — ideal for a morning stroll or an afternoon with the family.',
    distance: '6.5 km · 12 min', image: 'guide-changyul-park',
  },
  {
    name: 'Jigme Dorji National Park', category: 'nature', featured: true,
    text: 'Bhutan’s largest protected area, rich in biodiversity and trekking routes.',
    detail: 'Stretching north from Thimphu to the Tibetan border, the park shelters snow leopards, red pandas and blue sheep, and is crossed by some of the country’s great treks. Our concierge can arrange day hikes and guides.',
    distance: '5.6 km · 13 min', image: 'guide-JNDP',
  },
  {
    name: 'Motithang Takin Preserve', category: 'nature',
    text: 'Home to Bhutan’s national animal, the takin.',
    detail: 'A forested hillside reserve where you can see the takin — a gentle, curious creature that looks part goat, part cow — in a natural setting above the city.',
    distance: '11 km · 26 min', image: 'guide-takin',
  },
  {
    name: 'Royal Textile Academy', category: 'culture',
    text: 'The country’s finest weaving heritage and artistry.',
    detail: 'Galleries of royal and ceremonial textiles sit beside working looms, where weavers create intricate kira and gho patterns by hand. A beautiful introduction to Bhutan’s most celebrated art.',
    distance: 'In Thimphu', image: 'guide-RTA',
  },
  {
    name: 'Folk Heritage Museum', category: 'culture',
    text: 'Step back in time into Bhutanese rural life and traditions.',
    detail: 'A restored three-storey farmhouse, furnished as it would have been a century ago, with traditional kitchens, grain stores and household tools — and seasonal demonstrations of rural crafts.',
    distance: 'In Thimphu', image: 'guide-heritage',
  },
  {
    name: 'Centenary Farmers Market', category: 'culture',
    text: 'Local produce, handicrafts and authentic Bhutanese flavours.',
    detail: 'Two floors of chillies, mountain cheese, red rice and fresh produce from across the valleys, with handicraft stalls across the cantilever footbridge. Busiest — and liveliest — from Friday to Sunday.',
    distance: 'In Thimphu', image: 'guide-farmer-market',
  },
  {
    name: 'Changlimithang Stadium', category: 'culture',
    text: 'The national sports hub, often hosting archery matches.',
    detail: 'The national stadium and its neighbouring archery ground are where you can watch Bhutan’s national sport — with targets 145 metres away, singing, dancing and good-natured teasing between teams.',
    distance: 'In Thimphu', image: 'guide-changlimithang',
  },
  {
    name: 'Bhutan Postal Museum', category: 'culture',
    text: 'Bhutan’s unique postal history and famous stamps.',
    detail: 'From runners carrying mail over mountain passes to the world-famous talking-record and 3D stamps, the museum tells the story of Bhutan through its post — and you can print your own personalised stamp.',
    distance: 'In Thimphu', image: 'guide-post',
  },
];

export const stats = [
  { value: '68', label: 'Rooms & suites across two towers' },
  { value: '100%', label: 'Vegetarian & vegan-friendly' },
  { value: '7th', label: 'Floor rooftop bar' },
  { value: '10', label: 'Minutes from Thimphu town' },
];
