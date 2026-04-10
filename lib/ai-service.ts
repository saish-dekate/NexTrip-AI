import { itineraryAISchema, ItineraryAI } from '@/types';

interface GenerateItineraryParams {
  source: string;
  destination: string;
  budget: number;
  duration: number;
  mood: string;
  groupType: string;
  preferences: string[];
  accessibility: boolean;
}

interface ActivityData {
  name: string;
  lat: number;
  lng: number;
  description: string;
  bestTime: string;
  visitDuration: string;
  image: string;
  tips: string;
}

interface RestaurantData {
  name: string;
  type: string;
  bookingUrl: string;
  image: string;
  priceRange: string;
}

const destinationData: Record<string, { lat: number; lng: number; country: string; activities: ActivityData[]; hotels: { name: string; image: string; bookingUrl: string }[]; restaurants: RestaurantData[]; transport: { bus?: string; train?: string; car?: string; flight?: string } }> = {
  'delhi': {
    lat: 28.6139, lng: 77.2090, country: 'India',
    activities: [
      { name: 'India Gate', lat: 28.6129, lng: 77.2295, description: 'Iconic war memorial built in 1931, honors soldiers who died in WWI. The surrounding area comes alive with food vendors and boat rides in the evening.', bestTime: 'Evening', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', tips: 'Best visited during sunset. Try the ice cream vendors nearby.' },
      { name: 'Red Fort', lat: 28.6562, lng: 77.2410, description: 'UNESCO World Heritage Site, the main residence of Mughal emperors for nearly 200 years. Features stunning red sandstone architecture.', bestTime: 'Morning', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', tips: 'Book tickets online to skip queues. Sound & light show in evening.' },
      { name: 'Qutub Minar', lat: 28.5245, lng: 77.1855, description: 'World\'s tallest brick minaret at 73m, built in 1193. Surrounded by ancient ruins and the Iron Pillar of India.', bestTime: 'Morning', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1585133301658-15d6df45033e?w=800', tips: 'Photography allowed. Great light for photos in morning.' },
      { name: 'Lotus Temple', lat: 28.5535, lng: 77.2588, description: 'Bahá\'í House of Worship shaped like a lotus flower with 27 marble petals. Known for its peaceful ambiance.', bestTime: 'Afternoon', visitDuration: '1.5 hours', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800', tips: 'Maintain silence inside. Free entry, no prior booking needed.' },
      { name: 'Humayun\'s Tomb', lat: 28.5933, lng: 77.2507, description: 'First garden tomb on Indian subcontinent, UNESCO site. Predecessor to the Taj Mahal with beautiful Mughal architecture.', bestTime: 'Morning', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?w=800', tips: 'Visit during spring for beautiful gardens. Great for photography.' },
      { name: 'Akshardham Temple', lat: 28.6127, lng: 77.2790, description: 'Hindu temple complex showcasing millennia of traditional Hindu culture and architecture. Features the Guinness-record wristband.', bestTime: 'Full day', visitDuration: '4 hours', image: 'https://images.unsplash.com/photo-1544985361-b420d7a77043?w=800', tips: 'Allow 3-4 hours. Book exhibition tickets separately.' },
      { name: 'Chandni Chowk', lat: 28.6508, lng: 77.2093, description: 'Historic market established in 17th century, famous for street food, spices, textiles, and jewelry. Narrow lanes full of chaos and charm.', bestTime: 'Evening', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', tips: 'Bargaining expected. Try parathas at Paranthe Wali Gali.' },
      { name: 'Rashtrapati Bhavan', lat: 28.6142, lng: 77.1997, description: 'Presidential residence with 340 rooms, built in 1929. Features Mughal and British architectural elements.', bestTime: 'Morning', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1587519317946-16f7f6a73a82?w=800', tips: 'Guided tours available on specific days. Book in advance.' },
    ],
    hotels: [
      { name: 'The Leela Palace', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', bookingUrl: 'https://www.booking.com/hotel/in/the-leela-palace-new-delhi.html' },
      { name: 'Taj Palace', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', bookingUrl: 'https://www.booking.com/hotel/in/taj-palace-new-delhi.html' },
      { name: 'ITC Maurya', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', bookingUrl: 'https://www.booking.com/hotel/in/itc-maurya-new-delhi.html' },
    ],
    restaurants: [
      { name: 'Paranthe Wali Gali', type: 'Street Food', bookingUrl: 'https://www.zomato.com/ncr/paranthe-wali-gali-chandni-chowk-new-delhi', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800', priceRange: '₹200-500' },
      { name: 'Karim\'s', type: 'Mughlai', bookingUrl: 'https://www.zomato.com/ncr/karims-jama-masjid-new-delhi', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', priceRange: '₹500-1500' },
      { name: 'Sardarji Fish Fry', type: 'North Indian', bookingUrl: 'https://www.google.com/maps/search/Sardarji+Fish+Fry+Delhi', image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800', priceRange: '₹300-800' },
    ],
    transport: { bus: 'https://www.redbus.in', train: 'https://www.irctc.co.in', car: 'https://www.olacabs.com', flight: 'https://www.makemytrip.com' }
  },
  'mumbai': {
    lat: 19.0760, lng: 72.8777, country: 'India',
    activities: [
      { name: 'Gateway of India', lat: 18.9220, lng: 72.8347, description: 'Iconic 26m arch monument built in 1924, overlooking the Arabian Sea. Starting point for Elephanta Caves boat rides.', bestTime: 'Evening', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', tips: 'Best at sunset. Boat rides to Elephanta Caves depart from here.' },
      { name: 'Marine Drive', lat: 18.9440, lng: 72.8237, description: '3.98km C-shaped promenade along the Arabian Sea. Known as the Queen\'s Necklace for its string of lights at night.', bestTime: 'Sunset', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800', tips: 'Perfect for evening strolls. Try local chaat from vendors.' },
      { name: 'Chhatrapati Shivaji Terminus', lat: 18.9396, lng: 72.8355, description: 'UNESCO World Heritage Site, Victorian Gothic railway station built in 1888. Stunning architecture blending Indian and Gothic styles.', bestTime: 'Morning', visitDuration: '1.5 hours', image: 'https://images.unsplash.com/photo-1570448940862-5159aaf25eb4?w=800', tips: 'Photography allowed outside. UNESCO site since 2004.' },
      { name: 'Elephanta Caves', lat: 18.9633, lng: 72.9315, description: 'UNESCO rock-cut caves dedicated to Lord Shiva, dating back to 5th-8th century. Features the impressive 20ft Trimurti sculpture.', bestTime: 'Morning', visitDuration: '4 hours', image: 'https://images.unsplash.com/photo-1626621341517-bbf9d11b4859?w=800', tips: 'Take a ferry from Gateway of India. Wear comfortable shoes.' },
      { name: 'Bandra-Worli Sea Link', lat: 19.5269, lng: 72.8236, description: 'Cable-stayed bridge connecting Bandra to Worli, 5.6km long. Engineering marvel with 8-lane cable-stayed design.', bestTime: 'Evening', visitDuration: '1 hour', image: 'https://images.unsplash.com/photo-1605296830714-2f5c8b2d5fa5?w=800', tips: 'Best viewed from Bandra reclamation or Worli Sea Face.' },
      { name: 'Juhu Beach', lat: 19.0883, lng: 72.8265, description: 'Popular beach in Mumbai, 6km long. Famous for Bollywood sightings, street food, and sunset views.', bestTime: 'Evening', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1612690669207-eed4c5a83b3c?w=800', tips: 'Try pani puri and bhel puri from beach vendors.' },
      { name: 'Colaba Causeway', lat: 18.9217, lng: 72.8334, description: 'Famous shopping street near Gateway of India. Offers everything from clothes to antiques at bargain prices.', bestTime: 'Afternoon', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', tips: 'Bargaining is expected. Best on weekends.' },
      { name: 'Sanjay Gandhi National Park', lat: 19.2147, lng: 72.9782, description: '400-acre urban forest within the city. Home to Kanheri Caves, ancient Buddhist rock-cut monuments.', bestTime: 'Morning', visitDuration: '4 hours', image: 'https://images.unsplash.com/photo-1597078376508-4ff7a7f16dbc?w=800', tips: 'Wear comfortable hiking shoes. Carry water and snacks.' },
    ],
    hotels: [
      { name: 'The Taj Mahal Palace', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', bookingUrl: 'https://www.booking.com/hotel/in/the-taj-mahal-palace-mumbai.html' },
      { name: 'The St. Regis', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', bookingUrl: 'https://www.booking.com/hotel/in/the-st-regis-mumbai.html' },
      { name: 'Trident Hotel', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', bookingUrl: 'https://www.booking.com/hotel/in/trident-mumbai.html' },
    ],
    restaurants: [
      { name: 'Leopold Cafe', type: 'Multi-cuisine', bookingUrl: 'https://www.zomato.com/mumbai/leopold-cafe-colaba', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', priceRange: '₹800-2000' },
      { name: 'Brittany\'s', type: 'Seafood', bookingUrl: 'https://www.zomato.com/mumbai/brittanys-grill-chowpatty', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', priceRange: '₹1000-2500' },
      { name: 'Swati Snacks', type: 'Gujarati', bookingUrl: 'https://www.zomato.com/mumbai/swati-snacks-restaurant-tardeo', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800', priceRange: '₹400-1000' },
    ],
    transport: { bus: 'https://www.redbus.in', train: 'https://www.irctc.co.in', car: 'https://www.olacabs.com', flight: 'https://www.makemytrip.com' }
  },
  'goa': {
    lat: 15.2993, lng: 74.1240, country: 'India',
    activities: [
      { name: 'Calangute Beach', lat: 15.5426, lng: 73.7545, description: 'Queen of Beaches, largest beach in North Goa. Water sports hub with banana rides, jet skiing, and parasailing.', bestTime: 'Morning/Evening', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', tips: 'Morning for water sports, evening for sunset views.' },
      { name: 'Basilica of Bom Jesus', lat: 15.5009, lng: 73.9116, description: 'UNESCO World Heritage Site, built in 1605. Contains the mortal remains of St. Francis Xavier.', bestTime: 'Morning', visitDuration: '1.5 hours', image: 'https://images.unsplash.com/photo-1602825469649-578a4cb4a7b3?w=800', tips: 'Old Goa is UNESCO site. Best viewed early morning.' },
      { name: 'Fort Aguada', lat: 15.4821, lng: 73.7739, description: 'Portuguese fort built in 17th century with lighthouse offering panoramic views. Freshwater spring inside provided water to ships.', bestTime: 'Afternoon', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800', tips: 'Sunset views from the lighthouse are spectacular.' },
      { name: 'Anjuna Beach', lat: 15.5825, lng: 73.7422, description: 'Famous for Wednesday flea market and trance parties. Rocky terrain with scenic sunset views.', bestTime: 'Evening', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', tips: 'Visit the Wednesday flea market. Famous for full moon parties.' },
      { name: 'Dudhsagar Falls', lat: 15.3142, lng: 74.3149, description: 'Four-tiered waterfall in Bhagwan Mahaveer Sanctuary, 310m high. Fourth tallest waterfall in India.', bestTime: 'Morning', visitDuration: 'Full day', image: 'https://images.unsplash.com/photo-1602301002554-e5c4f4087d59?w=800', tips: 'Best visited in monsoon. Jeep Safari from Kulem.' },
      { name: 'Se Cathedral', lat: 15.5002, lng: 73.9096, description: 'Largest church in Asia, built in 1562. Features a golden bell weighing 2500kg and beautiful Portuguese architecture.', bestTime: 'Morning', visitDuration: '1 hour', image: 'https://images.unsplash.com/photo-1549399359-7a5b4e37b97c?w=800', tips: 'Part of Old Goa heritage walk. Mass at 7am and 6pm.' },
      { name: 'Old Goa Heritage Walk', lat: 15.5005, lng: 73.9120, description: 'Explore the churches and monuments of Old Goa, UNESCO World Heritage Site. Includes Se Cathedral, Basilica, and more.', bestTime: 'Morning', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?w=800', tips: 'Start early morning. Wear comfortable walking shoes.' },
      { name: 'Night Market at Arpora', lat: 15.5677, lng: 73.7622, description: 'Saturday night flea market with 500+ stalls. Clothing, jewelry, spices, and live music.', bestTime: 'Evening', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', tips: 'Open on Saturdays. Bargaining expected.' },
    ],
    hotels: [
      { name: 'Taj Fort Aguada', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', bookingUrl: 'https://www.booking.com/hotel/in/taj-fort-aguada-resort.html' },
      { name: 'W Goa', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', bookingUrl: 'https://www.booking.com/hotel/in/w-goa.html' },
      { name: 'Alila Diwa Goa', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', bookingUrl: 'https://www.booking.com/hotel/in/alila-diwa-goa.html' },
    ],
    restaurants: [
      { name: 'Fisherman\'s Wharf', type: 'Seafood', bookingUrl: 'https://www.zomato.com/goa/fishermans-wharf-cocozal', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', priceRange: '₹1000-3000' },
      { name: 'Gunpowder', type: 'Goan Fusion', bookingUrl: 'https://www.zomato.com/goa/gunpowder-anjuna', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', priceRange: '₹800-2000' },
      { name: 'Coconut Creek', type: 'Multi-cuisine', bookingUrl: 'https://www.zomato.com/goa/coconut-creek-benaulim', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', priceRange: '₹600-1500' },
    ],
    transport: { bus: 'https://www.redbus.in', train: 'https://www.irctc.co.in', car: 'https://www.goa.gov.in/travel/', flight: 'https://www.makemytrip.com' }
  },
  'jaipur': {
    lat: 26.9124, lng: 75.7873, country: 'India',
    activities: [
      { name: 'Hawa Mahal', lat: 26.9239, lng: 75.8267, description: 'Palace of Winds with 953 intricately carved windows. Built in 1799 for royal women to observe street festivals.', bestTime: 'Morning', visitDuration: '1 hour', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', tips: 'Best photos from outside. Small museum inside.' },
      { name: 'Amber Fort', lat: 26.9855, lng: 75.8513, description: 'UNESCO site, hilltop fortress built in 1592. Features Sheesh Mahal with mirror work and Ganesh Pole.', bestTime: 'Morning', visitDuration: '4 hours', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', tips: 'Take Jeep or Elephant ride up. Audio guide recommended.' },
      { name: 'City Palace', lat: 26.9068, lng: 75.8213, description: 'Royal residence with museum displaying royal costumes and armory. Chandra Mahal still houses the royal family.', bestTime: 'Morning', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', tips: 'Combined ticket with other attractions available.' },
      { name: 'Jantar Mantar', lat: 26.9248, lng: 75.8246, description: 'UNESCO astronomical observatory built in 1734. Features 19 astronomical instruments including the world\'s largest sundial.', bestTime: 'Afternoon', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1597938087647-e1df9b3f8555?w=800', tips: 'Guided tour explains the instruments well.' },
      { name: 'Nahargarh Fort', lat: 27.0054, lng: 75.8336, description: 'Hilltop fort with panoramic views of Jaipur city. Known for the Hollywood movie hangout and sunset views.', bestTime: 'Evening', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', tips: 'Evening visit for sunset. Famous for dinner at Padao restaurant.' },
      { name: 'Jal Mahal', lat: 26.8874, lng: 75.8022, description: 'Water Palace in Man Sagar Lake, built in 1699. 5 stories with 4 underwater levels, visible only during low water.', bestTime: 'Sunset', visitDuration: '1 hour', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', tips: 'Best viewed from the road. Cannot enter the palace.' },
      { name: 'Albert Hall Museum', lat: 26.9186, lng: 75.8205, description: 'Oldest museum in Rajasthan, designed by Sir Samuel Swinton Jacob. Egyptian mummy and various artifacts.', bestTime: 'Afternoon', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?w=800', tips: 'Beautiful building, great for photography.' },
      { name: 'Bazaars of Jaipur', lat: 26.9200, lng: 75.8200, description: 'Johari Bazaar, Bapu Bazaar, and Chandpole Bazaar. Famous for jewelry, textiles, and traditional Rajasthani items.', bestTime: 'Afternoon', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', tips: 'Bargaining expected. Evening is more lively.' },
    ],
    hotels: [
      { name: 'Rambagh Palace', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', bookingUrl: 'https://www.booking.com/hotel/in/rambagh-palace.html' },
      { name: 'Taj Jai Mahal Palace', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', bookingUrl: 'https://www.booking.com/hotel/in/taj-jai-mahal-palace.html' },
      { name: 'Fairmont Jaipur', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', bookingUrl: 'https://www.booking.com/hotel/in/fairmont-jaipur.html' },
    ],
    restaurants: [
      { name: 'Suvarna Mahal', type: 'Royal Rajasthani', bookingUrl: 'https://www.zomato.com/jaipur/suvarna-mahal-rambagh', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', priceRange: '₹2000-5000' },
      { name: 'Spice Court', type: 'North Indian', bookingUrl: 'https://www.zomato.com/jaipur/spice-court-sindhi-camp', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', priceRange: '₹600-1500' },
      { name: 'Chawanti', type: 'Multi-cuisine', bookingUrl: 'https://www.zomato.com/jaipur/chawanti-iq-city', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', priceRange: '₹800-2000' },
    ],
    transport: { bus: 'https://www.redbus.in', train: 'https://www.irctc.co.in', car: 'https://www.olacabs.com', flight: 'https://www.makemytrip.com' }
  },
  'kerala': {
    lat: 10.8505, lng: 76.2711, country: 'India',
    activities: [
      { name: 'Alleppey Backwaters', lat: 9.4981, lng: 76.3388, description: 'UNESCO recognized network of lagoons and lakes. Houseboat cruise through serene backwaters with village life views.', bestTime: 'Morning', visitDuration: 'Full day', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', tips: 'Overnight houseboat experience is a must. Best in winter.' },
      { name: 'Munnar Tea Gardens', lat: 10.0889, lng: 77.0595, description: 'UNESCO site, rolling tea plantations spread over 32km. Over 50 million kg of tea produced annually.', bestTime: 'Morning', visitDuration: '4 hours', image: 'https://images.unsplash.com/photo-1587411768637-c97c3b0e0a55?w=800', tips: 'Visit Tea Museum. Best morning views before mist clears.' },
      { name: 'Eravikulam National Park', lat: 10.1283, lng: 77.1000, description: 'Home to endangered Nilgiri Tahr. Famous for Neelakurinji flowers that bloom once every 12 years.', bestTime: 'Morning', visitDuration: '4 hours', image: 'https://images.unsplash.com/photo-1597078376508-4ff7a7f16dbc?w=800', tips: 'Book permits online. Closed during calving season.' },
      { name: 'Mattupetty Dam', lat: 10.1500, lng: 77.1500, description: 'Dam built in 1923 with panoramic views of surrounding hills. Elephant riding and boating available.', bestTime: 'Afternoon', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1597078376508-4ff7a7f16dbc?w=800', tips: 'Combine with Echo Point visit. Boating costs extra.' },
      { name: 'Kochi Fort', lat: 9.9658, lng: 76.2421, description: 'Historic waterfront with Chinese fishing nets, St. Francis Church, and Jewish synagogue. UNESCO World Heritage Site.', bestTime: 'Evening', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1602301002554-e5c4f4087d59?w=800', tips: 'Evening walk for sunset and Kathakali show.' },
      { name: 'Varkala Beach', lat: 8.7333, lng: 76.7167, description: 'Cliff beach with spiritual significance. Papanasam Beach believed to wash away sins. Ayurvedic treatments available.', bestTime: 'Evening', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', tips: 'Cliff restaurants for sunset. Try Ayurvedic massage.' },
      { name: 'Kumarakom Bird Sanctuary', lat: 9.6167, lng: 76.4333, description: 'Home to migratory birds including Siberian storks. Located on Vembanad Lake, part of Kerala\'s backwaters.', bestTime: 'Morning', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1597078376508-4ff7a7f16dbc?w=800', tips: 'Best during November-February for bird watching.' },
      { name: 'Athirappilly Falls', lat: 10.2833, lng: 76.5667, description: 'Thiruvananthapuram\'s Niagara Falls. 25m high waterfall in the middle of dense forest. Film location for many Bollywood movies.', bestTime: 'Afternoon', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1597078376508-4ff7a7f16dbc?w=800', tips: 'Monsoon season (June-September) has best water flow.' },
    ],
    hotels: [
      { name: 'Taj Kumarakom', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', bookingUrl: 'https://www.booking.com/hotel/in/taj-kumarakom-resort-spa.html' },
      { name: 'Spice Tree Munnar', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', bookingUrl: 'https://www.booking.com/hotel/in/spice-tree-munnar.html' },
      { name: 'Kumarakom Lake Resort', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', bookingUrl: 'https://www.booking.com/hotel/in/kumarakom-lake-resort.html' },
    ],
    restaurants: [
      { name: 'Kashi Art Cafe', type: 'Multi-cuisine', bookingUrl: 'https://www.zomato.com/kochi/kashi-art-cafe-fort-kochi', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', priceRange: '₹400-1000' },
      { name: 'Thali Restaurant', type: 'Kerala Thali', bookingUrl: 'https://www.zomato.com/kochi/kerala-hotel-thali', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', priceRange: '₹300-700' },
      { name: 'Harbor Restaurant', type: 'Seafood', bookingUrl: 'https://www.zomato.com/kochi/harbour-restaurant-fort-kochi', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', priceRange: '₹600-1500' },
    ],
    transport: { bus: 'https://www.keralartc.com', train: 'https://www.irctc.co.in', car: 'https://www.olacabs.com', flight: 'https://www.makemytrip.com' }
  },
  'agra': {
    lat: 27.1767, lng: 78.0081, country: 'India',
    activities: [
      { name: 'Taj Mahal', lat: 27.1751, lng: 78.0421, description: 'UNESCO World Wonder, ultimate symbol of love built by Shah Jahan. 20,000 workers built this marble masterpiece over 22 years.', bestTime: 'Sunrise', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', tips: 'Book sunrise entry ticket online. Best viewed at sunrise.' },
      { name: 'Agra Fort', lat: 27.1795, lng: 78.0211, description: 'UNESCO World Heritage Site, Mughal fortress and residence. 94-hectare fort with beautiful palaces and audience halls.', bestTime: 'Afternoon', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', tips: 'Audio guide recommended. Closed on Fridays.' },
      { name: 'Fatehpur Sikri', lat: 27.0945, lng: 77.6679, description: 'UNESCO ghost city built by Akbar in 1571. City was abandoned after 15 years due to water shortage.', bestTime: 'Morning', visitDuration: '4 hours', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', tips: 'Panch Mahal and Buland Darwaza are highlights. Half day trip.' },
      { name: 'Itimad-ud-Daulah', lat: 27.1872, lng: 78.0398, description: 'Baby Taj, first Mughal tomb with pietra dura work. Built between 1622-1628, inspired Taj Mahal design.', bestTime: 'Evening', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', tips: 'Beautiful at sunset. Less crowded than Taj.' },
      { name: 'Mehtab Bagh', lat: 27.1616, lng: 78.0740, description: 'Garden on opposite bank of Yamuna for Taj Mahal sunset views. Built by Babur as last of garden complexes.', bestTime: 'Sunset', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', tips: 'Best sunset view of Taj. Carry mosquito repellent.' },
      { name: 'Sikandra', lat: 27.2167, lng: 78.0500, description: 'Akbar\'s tomb, first garden tomb in India. Construction started by Akbar, completed by Jahangir.', bestTime: 'Morning', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', tips: 'Deer park inside. Less crowded, peaceful visit.' },
      { name: 'Kinari Bazaar', lat: 27.1760, lng: 78.0100, description: 'Traditional market near Jama Masjid. Famous for leather goods, marble, and wedding items.', bestTime: 'Evening', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', tips: 'Bargaining expected. Good for marble replicas.' },
      { name: 'Mughal Heritage Walk', lat: 27.1820, lng: 78.0150, description: 'Explore Mughal-era lanes including Gyarah Sidi, Kachhpura, and Method Mahal. Supporting local communities.', bestTime: 'Morning', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', tips: 'Book through local NGO. Great for community tourism.' },
    ],
    hotels: [
      { name: 'Taj Hotel & Convention Centre', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', bookingUrl: 'https://www.booking.com/hotel/in/taj-hotel-convention-centre-agra.html' },
      { name: 'ITC Mughal', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', bookingUrl: 'https://www.booking.com/hotel/in/itc-mughal-agra.html' },
      { name: 'Courtyard by Marriott', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', bookingUrl: 'https://www.booking.com/hotel/in/courtyard-agra.html' },
    ],
    restaurants: [
      { name: 'Peshawri', type: 'Mughlai', bookingUrl: 'https://www.zomato.com/agra/peshawri-ITC-mughal-agra', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', priceRange: '₹1500-4000' },
      { name: 'Dasaprakash', type: 'South Indian', bookingUrl: 'https://www.zomato.com/agra/dasaprakash-sanadi', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', priceRange: '₹300-800' },
      { name: 'Joney\'s Place', type: 'Fast Food', bookingUrl: 'https://www.google.com/maps/search/Johny\'s+Place+Agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', priceRange: '₹200-500' },
    ],
    transport: { bus: 'https://www.redbus.in', train: 'https://www.irctc.co.in', car: 'https://www.olacabs.com', flight: 'https://www.makemytrip.com' }
  },
  'dubai': {
    lat: 25.2048, lng: 55.2708, country: 'UAE',
    activities: [
      { name: 'Burj Khalifa', lat: 25.1972, lng: 55.2744, description: 'World\'s tallest building at 828m. Observation decks on 124th and 148th floors offer panoramic city views.', bestTime: 'Evening', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', tips: 'Book sunset time slot for best views. Fast track available.' },
      { name: 'Dubai Mall', lat: 25.1985, lng: 55.2796, description: 'One of the largest malls in the world with 1200+ shops. Connected to Burj Khalifa and features aquarium.', bestTime: 'Afternoon', visitDuration: '4 hours', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', tips: 'Combine with Dubai Aquarium and fountain show.' },
      { name: 'Palm Jumeirah', lat: 25.1124, lng: 55.1390, description: 'Iconic palm-shaped artificial island with luxury hotels. Monorail tour available for unique aerial views.', bestTime: 'Morning', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', tips: 'Visit Atlantis Aquaventure water park. Beach clubs open to public.' },
      { name: 'Dubai Marina', lat: 25.0767, lng: 55.1403, description: 'Upscale waterfront with restaurants and cafes. Dhow cruise offers dinner with city skyline views.', bestTime: 'Evening', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', tips: 'Evening walk for fountain show at 6pm, 8pm, 10pm.' },
      { name: 'Gold Souk', lat: 25.2647, lng: 55.2975, description: 'Traditional gold and jewelry market with 300+ shops. Experience traditional bartering in air-conditioned shops.', bestTime: 'Morning', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', tips: 'Prices are fixed but you can negotiate on making charges.' },
      { name: 'Desert Safari', lat: 25.0500, lng: 55.2000, description: 'Thrilling dune bashing, camel rides, and BBQ dinner under the stars. Cultural experiences including henna and belly dance.', bestTime: 'Afternoon', visitDuration: '5 hours', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', tips: 'Book through reputable tour operators. Pickup from hotel included.' },
      { name: 'Dubai Creek', lat: 25.2694, lng: 55.3095, description: 'Historic waterfront with abra rides and old souks. UNESCO heritage area showcasing Dubai\'s trading roots.', bestTime: 'Morning', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', tips: 'Take abra to Gold and Spice Souks. Visit Heritage Village.' },
      { name: 'Atlantis Aquaventure', lat: 25.1300, lng: 55.1161, description: 'Water park at Palm Jumeirah with thrilling rides. Access to Lost Chambers aquarium included.', bestTime: 'Full day', visitDuration: '6 hours', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', tips: 'Book online for discount. Lockers and towels available to rent.' },
    ],
    hotels: [
      { name: 'Burj Al Arab', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', bookingUrl: 'https://www.booking.com/hotel/ae/burj-al-arab-dubai.html' },
      { name: 'Atlantis The Palm', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', bookingUrl: 'https://www.booking.com/hotel/ae/atlantis-the-palm.html' },
      { name: 'Jumeirah Beach Hotel', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', bookingUrl: 'https://www.booking.com/hotel/ae/jumeirah-beach-hotel.html' },
    ],
    restaurants: [
      { name: 'At.mosphere', type: 'Fine Dining', bookingUrl: 'https://www.google.com/maps/search/Atmosphere+Burj+Khalifa', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', priceRange: 'AED 500-1500' },
      { name: 'Pierchic', type: 'Seafood', bookingUrl: 'https://www.google.com/maps/search/Pierchic+Dubai', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', priceRange: 'AED 300-800' },
      { name: 'Zuma', type: 'Japanese', bookingUrl: 'https://www.google.com/maps/search/Zuma+Dubai', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', priceRange: 'AED 400-1000' },
    ],
    transport: { bus: 'https://www.rta.ae', train: 'https://www.rta.ae/en/metro/', car: 'https://www.uber.com', flight: 'https://www.makemytrip.com' }
  },
  'singapore': {
    lat: 1.3521, lng: 103.8198, country: 'Singapore',
    activities: [
      { name: 'Marina Bay Sands', lat: 1.2834, lng: 103.8607, description: 'Iconic integrated resort with rooftop infinity pool. Skypark offers 360-degree views of the city.', bestTime: 'Evening', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', tips: 'SkyPark observation deck has best views. Pool access for hotel guests.' },
      { name: 'Gardens by the Bay', lat: 1.2816, lng: 103.8636, description: 'Futuristic nature park with Supertrees. Cloud Forest and Flower Dome are world\'s largest greenhouse.', bestTime: 'Afternoon', visitDuration: '4 hours', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', tips: 'Garden by the Bay light show at 7:45pm and 8:45pm free.' },
      { name: 'Sentosa Island', lat: 1.2494, lng: 103.8303, description: 'Beach resort island with Universal Studios, S.E.A. Aquarium, and adventure activities.', bestTime: 'Full day', visitDuration: '6 hours', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', tips: 'Get iCity pass for multiple attractions. Beach clubs popular.' },
      { name: 'Orchard Road', lat: 1.3048, lng: 103.8318, description: 'Premier shopping district with ION Orchard, Takashimaya, and Paragon. Over 5000 retail brands.', bestTime: 'Evening', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', tips: 'Best after 7pm when malls are lit up. Tax refund available.' },
      { name: 'Chinatown', lat: 1.2833, lng: 103.8443, description: 'Historic Chinese heritage area with traditional shops and street food. Buddha Tooth Relic Temple is a must-visit.', bestTime: 'Morning', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', tips: 'Chinatown Complex for affordable local food. Night market on weekends.' },
      { name: 'Little India', lat: 1.3069, lng: 103.8518, description: 'Vibrant Indian cultural enclave with temples, colorful shophouses, and curry restaurants.', bestTime: 'Morning', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', tips: 'Try Tekka Centre for affordable Indian food. Sri Veeramakaliamman Temple.' },
      { name: 'Singapore Zoo', lat: 1.4043, lng: 103.7930, description: 'World-renowned wildlife park with open concept enclosures. Night Safari and River Safari nearby.', bestTime: 'Morning', visitDuration: '4 hours', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', tips: 'Book night safari separately. Orangutan breakfast is popular.' },
      { name: 'Merlion Park', lat: 1.2868, lng: 103.8545, description: 'Iconic half-lion half-fish statue, Singapore\'s national symbol. 8.6m tall merlion with water spouting from its mouth.', bestTime: 'Evening', visitDuration: '1 hour', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', tips: 'Free entry. Best at night when illuminated.' },
    ],
    hotels: [
      { name: 'Marina Bay Sands', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', bookingUrl: 'https://www.booking.com/hotel/sg/marina-bay-sands.html' },
      { name: 'Raffles Hotel', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', bookingUrl: 'https://www.booking.com/hotel/sg/raffles-hotel.html' },
      { name: 'The Fullerton Hotel', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', bookingUrl: 'https://www.booking.com/hotel/sg/the-fullerton.html' },
    ],
    restaurants: [
      { name: 'Hawker Centre', type: 'Local Food', bookingUrl: 'https://www.google.com/maps/search/Hawker+Centre+Singapore', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', priceRange: 'SGD 5-20' },
      { name: 'Jumbo Seafood', type: 'Seafood', bookingUrl: 'https://www.google.com/maps/search/Jumbo+Seafood+Singapore', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', priceRange: 'SGD 30-80' },
      { name: 'Burnt Ends', type: 'Modern Australian', bookingUrl: 'https://www.google.com/maps/search/Burnt+Ends+Singapore', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', priceRange: 'SGD 50-150' },
    ],
    transport: { bus: 'https://www.transitlink.com.sg', train: 'https://www.sbstransit.com.sg', car: 'https://www.grab.com', flight: 'https://www.makemytrip.com' }
  },
  'bangkok': {
    lat: 13.7563, lng: 100.5018, country: 'Thailand',
    activities: [
      { name: 'Grand Palace', lat: 13.7500, lng: 100.4914, description: 'Opulent royal palace complex, home to Emerald Buddha temple. Built in 1782, showcase of Thai architecture.', bestTime: 'Morning', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', tips: 'Dress code enforced - no shorts or open shoes. Arrive early to avoid crowds.' },
      { name: 'Wat Pho', lat: 13.7465, lng: 100.4930, description: 'Home of the Reclining Buddha (46m long) and birthplace of Thai massage. Oldest temple in Bangkok.', bestTime: 'Morning', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', tips: 'Adjacent to Grand Palace. Famous for traditional Thai massage.' },
      { name: 'Chatuchak Market', lat: 13.7999, lng: 100.5507, description: 'Massive weekend market with 15000+ stalls. Everything from vintage clothes to pets and plants.', bestTime: 'Morning', visitDuration: '4 hours', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', tips: 'Open Sat-Sun. Go early for best finds. Wear comfortable shoes.' },
      { name: 'Khao San Road', lat: 13.7590, lng: 100.4970, description: 'Famous backpacker street with bars, restaurants, and shops. The original Bangkok backpacker hub.', bestTime: 'Evening', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', tips: 'Best at night. Street food and nightlife are main attractions.' },
      { name: 'MBK Center', lat: 13.7440, lng: 100.5295, description: 'Popular 8-story shopping mall with 2000+ shops. Famous for electronics, fashion, and mobile phones.', bestTime: 'Afternoon', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', tips: 'Good for bargaining. Cinema on 7th floor.' },
      { name: 'Wat Arun', lat: 13.7437, lng: 100.4888, description: 'Temple of Dawn on Chao Phraya River. Famous for 70m central spire covered in colorful porcelain.', bestTime: 'Evening', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', tips: 'Cross by ferry from Tha Tien. Climb to top for river views.' },
      { name: 'Chinatown Yaowarat', lat: 13.7411, lng: 100.5105, description: 'Bustling Chinese heritage district, one of the oldest Chinatown in the world. Street food paradise.', bestTime: 'Evening', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', tips: 'Try bird\'s nest soup and seafood. Evening visit recommended.' },
      { name: 'Jim Thompson House', lat: 13.7466, lng: 100.5345, description: 'Traditional Thai silk museum in a teak house. American businessman revived Thai silk industry here.', bestTime: 'Afternoon', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', tips: 'Guided tours included. Nearby Express Boat to National Stadium.' },
    ],
    hotels: [
      { name: 'Mandarin Oriental', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', bookingUrl: 'https://www.booking.com/hotel/th/mandarin-oriental-bangkok.html' },
      { name: 'The Peninsula', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', bookingUrl: 'https://www.booking.com/hotel/th/the-peninsula-bangkok.html' },
      { name: 'Shangri-La', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', bookingUrl: 'https://www.booking.com/hotel/th/shangri-la-bangkok.html' },
    ],
    restaurants: [
      { name: 'Jay Fai', type: 'Street Food', bookingUrl: 'https://www.google.com/maps/search/Jay+Fai+Bangkok', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', priceRange: 'THB 1000-3000' },
      { name: 'Gaggan', type: 'Modern Thai', bookingUrl: 'https://www.google.com/maps/search/Gaggan+Bangkok', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', priceRange: 'THB 3000-8000' },
      { name: 'Thipsamai', type: 'Pad Thai', bookingUrl: 'https://www.google.com/maps/search/Thipsamai+Bangkok', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', priceRange: 'THB 150-400' },
    ],
    transport: { bus: 'https://www.transport.co.th', train: 'https://www.railway.co.th', car: 'https://www.grab.com/th/en/', flight: 'https://www.makemytrip.com' }
  },
};

const defaultCityData = {
  lat: 28.6139,
  lng: 77.2090,
  country: 'India',
  activities: [
    { name: 'City Center', lat: 28.6139, lng: 77.2090, description: 'Explore the main city area with local attractions', bestTime: 'Morning', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800', tips: 'Wear comfortable shoes for walking.' },
    { name: 'Local Market', lat: 28.6200, lng: 77.2150, description: 'Shopping and local experience', bestTime: 'Afternoon', visitDuration: '3 hours', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', tips: 'Bargaining expected at local markets.' },
    { name: 'Heritage Site', lat: 28.6100, lng: 77.2050, description: 'Historical monument worth visiting', bestTime: 'Morning', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', tips: 'Best visited in morning for photography.' },
    { name: 'Nature Park', lat: 28.6300, lng: 77.2200, description: 'Green space for relaxation', bestTime: 'Evening', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1597078376508-4ff7a7f16dbc?w=800', tips: 'Perfect for evening walks.' },
    { name: 'Local Temple', lat: 28.6080, lng: 77.2000, description: 'Spiritual and cultural site', bestTime: 'Morning', visitDuration: '1.5 hours', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800', tips: 'Dress modestly and remove shoes.' },
    { name: 'Riverside Walk', lat: 28.6250, lng: 77.2100, description: 'Scenic waterfront promenade', bestTime: 'Evening', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1477936432016-8172ed08637e?w=800', tips: 'Beautiful sunset views.' },
    { name: 'Art Gallery', lat: 28.6180, lng: 77.2080, description: 'Local art and culture', bestTime: 'Afternoon', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?w=800', tips: 'Check for special exhibitions.' },
    { name: 'Night Market', lat: 28.6150, lng: 77.2120, description: 'Evening shopping and food', bestTime: 'Evening', visitDuration: '2 hours', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', tips: 'Try local street food.' },
  ],
  hotels: [
    { name: 'Grand Hotel', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', bookingUrl: 'https://www.booking.com' },
    { name: 'City View Hotel', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', bookingUrl: 'https://www.booking.com' },
    { name: 'Heritage Resort', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', bookingUrl: 'https://www.booking.com' },
  ],
  restaurants: [
    { name: 'Local Kitchen', type: 'Traditional', bookingUrl: 'https://www.google.com/maps/search/restaurants+nearby', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', priceRange: '₹300-800' },
    { name: 'Food Court', type: 'Multi-cuisine', bookingUrl: 'https://www.google.com/maps/search/restaurants+nearby', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', priceRange: '₹200-500' },
    { name: 'Rooftop Restaurant', type: 'Fine Dining', bookingUrl: 'https://www.google.com/maps/search/restaurants+nearby', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', priceRange: '₹1000-3000' },
  ],
  transport: { bus: 'https://www.redbus.in', train: 'https://www.irctc.co.in', car: 'https://www.olacabs.com', flight: 'https://www.makemytrip.com' }
};

function generateDetailedItinerary(params: GenerateItineraryParams): ItineraryAI {
  const { source, destination, budget, duration, mood, groupType, accessibility } = params;
  
  const cityKey = destination.toLowerCase().trim();
  const cityData = destinationData[cityKey] || defaultCityData;
  
  const totalBudget = budget;
  const dailyBudget = (totalBudget * 0.7) / duration;
  
  const moodActivities: Record<string, string[]> = {
    relaxed: ['Spa session', 'Garden walk', 'Tea plantation visit', 'Sunset point visit', 'Cultural show'],
    adventurous: ['Trekking expedition', 'Water sports', 'Rock climbing', 'Wildlife safari', 'Paragliding'],
    romantic: ['Candlelight dinner', 'Sunset cruise', 'Couples spa', 'Rooftop dining', 'Horse riding'],
    party: ['Nightclub tour', 'Bar hopping', 'Live music show', 'Beach party', 'Rooftop lounge'],
  };
  
  const groupPricing: Record<string, number> = { solo: 1, couple: 1.8, family: 2.5, friends: 2 };
  const groupMultiplier = groupPricing[groupType] || 1;
  
  const activities = moodActivities[mood] || moodActivities.relaxed;
  const shuffledAttractions = [...cityData.activities].sort(() => Math.random() - 0.5);
  
  const days = [];
  for (let d = 1; d <= duration; d++) {
    const dayActivities = [];
    
    // Morning: Attraction/Visit
    const morningActivity = shuffledAttractions[(d - 1) % shuffledAttractions.length];
    dayActivities.push({
      title: morningActivity.name,
      category: 'visit',
      cuisine_type: '',
      start_time: d === 1 ? '09:00' : '08:30',
      end_time: d === 1 ? '12:00' : '11:30',
      cost: Math.round((dailyBudget * 0.2) / groupMultiplier),
      carbon_footprint: 1.5 + Math.random() * 1,
      accessibility_info: accessibility ? 'Full wheelchair access available' : '',
      lat: morningActivity.lat + (d * 0.005),
      lng: morningActivity.lng + (d * 0.005),
      description: morningActivity.description,
      image: morningActivity.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
      tips: morningActivity.tips || 'Enjoy your visit!',
    });
    
    // Lunch: Restaurant
    const restaurant = cityData.restaurants[(d - 1) % cityData.restaurants.length];
    dayActivities.push({
      title: restaurant.name,
      category: 'food',
      cuisine_type: restaurant.type,
      start_time: d === 1 ? '12:30' : '12:00',
      end_time: d === 1 ? '14:00' : '13:30',
      cost: Math.round((dailyBudget * 0.25) / groupMultiplier),
      carbon_footprint: 2.5 + Math.random() * 1.5,
      accessibility_info: accessibility ? 'Ground floor, spacious seating' : '',
      lat: morningActivity.lat + (d * 0.005) + 0.002,
      lng: morningActivity.lng + (d * 0.005) + 0.002,
      description: `Try authentic ${restaurant.type} cuisine at ${restaurant.name}. ${restaurant.priceRange ? `Price range: ${restaurant.priceRange}.` : ''} Known for its traditional recipes and warm hospitality.`,
      booking_link: restaurant.bookingUrl || `https://www.google.com/maps/search/${encodeURIComponent(restaurant.name + ' ' + destination)}`,
      image: restaurant.image || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      tips: `Try the signature dishes. Lunch hours can be busy.`,
    });
    
    // Afternoon: Second attraction or activity
    const afternoonActivity = shuffledAttractions[d % shuffledAttractions.length];
    dayActivities.push({
      title: `${activities[d % activities.length]} - ${mood.charAt(0).toUpperCase() + mood.slice(1)} Experience`,
      category: 'visit',
      cuisine_type: '',
      start_time: d === 1 ? '15:00' : '14:30',
      end_time: d === 1 ? '17:30' : '17:00',
      cost: Math.round((dailyBudget * 0.15) / groupMultiplier),
      carbon_footprint: 1.0 + Math.random() * 1,
      accessibility_info: accessibility ? 'Accessibility features confirmed' : '',
      lat: afternoonActivity.lat + (d * 0.005),
      lng: afternoonActivity.lng + (d * 0.005),
      description: `Experience an exciting ${activities[d % activities.length].toLowerCase()} activity perfect for a ${mood} mood. Professional guides available.`,
      image: afternoonActivity.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      tips: `Wear comfortable clothing. Stay hydrated.`,
    });
    
    // Evening: Check-in or relaxation
    if (d === 1) {
      const hotel = cityData.hotels[0];
      dayActivities.push({
        title: hotel.name,
        category: 'hotel',
        cuisine_type: '',
        start_time: '18:00',
        end_time: '19:00',
        cost: Math.round((dailyBudget * 0.25) / groupMultiplier),
        carbon_footprint: 3.0 + Math.random() * 2,
        accessibility_info: accessibility ? 'Ground floor rooms, wide doorways, grab bars available' : '',
        lat: morningActivity.lat + (d * 0.003),
        lng: morningActivity.lng + (d * 0.003),
        description: `Check-in at ${hotel.name}. Premium accommodation with modern amenities and excellent service. Comfortable rooms with city views.`,
        booking_link: hotel.bookingUrl || `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`,
        image: hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        tips: `Check-in available from 2 PM. Early check-in subject to availability.`,
      });
    }
    
    // Night: Dinner or market visit
    const eveningActivity = shuffledAttractions[(d + 1) % shuffledAttractions.length];
    dayActivities.push({
      title: `${eveningActivity.name} - Evening Visit`,
      category: 'visit',
      cuisine_type: '',
      start_time: '19:30',
      end_time: '22:00',
      cost: Math.round((dailyBudget * 0.15) / groupMultiplier),
      carbon_footprint: 0.8 + Math.random() * 0.5,
      accessibility_info: '',
      lat: eveningActivity.lat + (d * 0.005),
      lng: eveningActivity.lng + (d * 0.005),
      description: `Explore ${eveningActivity.name} in the evening. The atmosphere is magical with lights and street vendors. Perfect time for photography.`,
      image: eveningActivity.image || 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
      tips: eveningActivity.tips || 'Evening visit recommended for best experience.',
    });
    
    days.push({ day: d, activities: dayActivities });
  }
  
  const airlines = ['IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'Emirates', 'Singapore Airlines'];
  
  return {
    flights: [{
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      departure_time: '06:00',
      arrival_time: '08:30',
      duration: '2h 30m',
      price: Math.round(totalBudget * 0.2 / groupMultiplier),
      carbon_footprint: 350 + Math.random() * 100,
    }],
    days,
  };
}

export async function generateItinerary(params: GenerateItineraryParams): Promise<ItineraryAI> {
  return generateDetailedItinerary(params);
}

export async function getChatResponse(message: string, context?: string): Promise<string> {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('budget')) {
    return "For optimal budget allocation: 20% flights, 35% accommodation, 25% food, 15% activities, 5% transport. Our itineraries automatically optimize this split!";
  }
  if (lowerMsg.includes('goa') || lowerMsg.includes('beach')) {
    return "Goa is perfect! Beautiful beaches, water sports, Portuguese heritage, and vibrant nightlife. Best time: October to March. Need help planning?";
  }
  if (lowerMsg.includes('kerala')) {
    return "Kerala offers backwaters, tea gardens, beaches, and Ayurveda. Houseboat stays in Alleppey are a must! Best time: September to March.";
  }
  if (lowerMsg.includes('heritage') || lowerMsg.includes('rajasthan')) {
    return "Rajasthan has magnificent forts, palaces, and desert experiences. Jaipur, Udaipur, and Jodhpur are must-visit destinations!";
  }
  if (lowerMsg.includes('help')) {
    return "Just fill in the trip form: destination, budget, duration, mood, and group type. I'll create a complete itinerary with flights, hotels, activities, and restaurant recommendations!";
  }
  
  return "I'm your travel assistant! Fill in your trip details and I'll generate a complete personalized itinerary with booking links and recommendations.";
}
