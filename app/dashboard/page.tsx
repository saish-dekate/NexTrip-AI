'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapView } from '@/components/map-view';
import { Header } from '@/components/header';
import { Plane, Calendar, DollarSign, Loader2, MapPin, ArrowRight, Sparkles, Leaf, Utensils, Hotel, Camera, Car, ExternalLink, Clock, ChevronRight, Info, Star, Navigation, RefreshCw, Save, Check, Train, Bus, Navigation2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

interface DayActivity {
  title: string;
  category: string;
  cuisine_type?: string;
  start_time: string;
  end_time: string;
  cost: number;
  carbon_footprint: number;
  accessibility_info?: string;
  lat: number;
  lng: number;
  image?: string;
  description?: string;
  booking_link?: string;
  tips?: string;
}

interface Flight {
  airline: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  price: number;
  carbon_footprint: number;
  stops: number;
  booking_link: string;
}

interface GeneratedItinerary {
  destination: string;
  source: string;
  duration: number;
  budget: number;
  mood: string;
  flights: Flight[];
  days: { day: number; activities: DayActivity[] }[];
  transport?: {
    bus?: { name: string; price: number; bookingUrl: string; duration: string };
    train?: { name: string; price: number; bookingUrl: string; duration: string };
    car?: { name: string; price: number; bookingUrl: string; duration: string };
  };
}

const indianCities = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
  'Pune', 'Jaipur', 'Goa', 'Kerala', 'Agra', 'Udaipur', 'Varanasi', 
  'Shimla', 'Manali', 'Rishikesh', 'Mysore', 'Ahmedabad', 'Chandigarh'
];

const internationalCities = [
  'Dubai', 'Singapore', 'Bali', 'Paris', 'London', 'Bangkok', 
  'Tokyo', 'New York', 'Sydney', 'Malaysia', 'Nepal', 'Sri Lanka'
];

const allCities = [...indianCities, ...internationalCities];

const destinationImages: Record<string, string> = {
  'Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400',
  'Mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400',
  'Goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400',
  'Jaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400',
  'Kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400',
  'Agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400',
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400',
  'Bangkok': 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400',
};

interface TransportOption {
  type: string;
  name: string;
  icon: string;
  description: string;
  price: number;
  duration: string;
  carbon: number;
  bookingUrl: string;
  provider: string;
  priceUnit?: string;
  available?: boolean;
  notPossibleReason?: string;
}

const TransportCard = ({ transport, delay }: { transport: TransportOption; delay: number }) => {
  const isAvailable = transport.available !== false;
  
  const getIcon = () => {
    switch (transport.icon) {
      case 'plane': return <Plane className="h-6 w-6" />;
      case 'train': return <Train className="h-6 w-6" />;
      case 'bus': return <Bus className="h-6 w-6" />;
      case 'car': return <Car className="h-6 w-6" />;
      case 'subway': return <Navigation2 className="h-6 w-6" />;
      case 'ship': return <Navigation className="h-6 w-6" />;
      default: return <MapPin className="h-6 w-6" />;
    }
  };

  const getColor = () => {
    if (!isAvailable) {
      return { bg: 'bg-gray-100 dark:bg-gray-800/30', text: 'text-gray-400', border: 'border-gray-200 dark:border-gray-700' };
    }
    switch (transport.type) {
      case 'flight': return { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-600', border: 'border-sky-200 dark:border-sky-800' };
      case 'train': return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600', border: 'border-green-200 dark:border-green-800' };
      case 'bus': return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600', border: 'border-orange-200 dark:border-orange-800' };
      case 'car': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600', border: 'border-blue-200 dark:border-blue-800' };
      case 'metro': return { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600', border: 'border-purple-200 dark:border-purple-800' };
      case 'ferry': return { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600', border: 'border-teal-200 dark:border-teal-800' };
      default: return { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const colors = getColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isAvailable ? 1 : 0.6, y: 0 }}
      transition={{ delay }}
    >
      <Card className={cn("h-full hover:shadow-lg transition-shadow border-2", colors.border)}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", colors.bg)}>
              <span className={colors.text}>{getIcon()}</span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">{transport.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">{transport.type} - {transport.provider}</p>
            </div>
            {!isAvailable && (
              <Badge variant="destructive" className="text-xs">Not Available</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{transport.description}</p>
          {isAvailable ? (
            <>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{transport.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold text-lg text-primary">
                    {transport.priceUnit === 'per km' || transport.priceUnit === 'per day' 
                      ? `₹${transport.price} ${transport.priceUnit}` 
                      : formatCurrency(transport.price)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Carbon</span>
                  <Badge variant="outline" className={cn(transport.carbon < 30 && 'bg-green-50 text-green-700')}>
                    {transport.carbon} kg CO₂
                  </Badge>
                </div>
              </div>
              <a href={transport.bookingUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full" variant={transport.type === 'flight' ? 'default' : 'outline'}>
                  Book on {transport.provider}
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </a>
            </>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {transport.notPossibleReason || 'This option is not available for your selected budget'}
              </p>
              <p className="text-xs text-muted-foreground/70">
                Try increasing your budget or selecting a different transport option
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nextrip-theme') === 'dark';
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('plan');
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nextrip-theme', isDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [isDark]);

  const [formData, setFormData] = useState({
    source: searchParams.get('source') || '',
    destination: searchParams.get('destination') || '',
    budget: 50000,
    duration: 3,
    mood: 'relaxed',
    groupType: 'solo',
    accessibility: false,
  });

  const handleGenerate = async () => {
    if (!formData.source || !formData.destination) {
      toast.error('Please enter both source and destination');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to generate');
      }

      const data = await res.json();
      
      const flights = generateFlights(formData.source, formData.destination, formData.duration, formData.budget);
      const transport = generateTransport(formData.source, formData.destination, formData.budget);
      
      setItinerary({
        destination: formData.destination,
        source: formData.source,
        duration: formData.duration,
        budget: formData.budget,
        mood: formData.mood,
        flights: flights,
        days: data.days || [],
        transport: transport,
      });

      setActiveTab('flights');
      toast.success('Itinerary generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateFlights = (source: string, destination: string, days: number, budget: number): Flight[] => {
    const srcLower = source.toLowerCase();
    const destLower = destination.toLowerCase();
    
    const metroCities = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'jaipur', 'goa', 'kochi', 'ahmedabad'];
    const internationalCities = ['dubai', 'singapore', 'bangkok', 'paris', 'london', 'tokyo', 'new york', 'sydney', 'bali', 'malaysia', 'nepal', 'sri lanka'];
    const shortRoutes = ['delhi-mumbai', 'mumbai-delhi', 'delhi-jaipur', 'delhi-agra', 'bangalore-mysore', 'mumbai-pune', 'delhi-chandigarh', 'mumbai-goa'];
    
    const routeKey = `${srcLower}-${destLower}`;
    const reverseRouteKey = `${destLower}-${srcLower}`;
    
    const isInternational = internationalCities.includes(srcLower) || internationalCities.includes(destLower);
    const hasDirectFlights = metroCities.includes(srcLower) && metroCities.includes(destLower) && !isInternational;
    const isShortRoute = shortRoutes.includes(routeKey) || shortRoutes.includes(reverseRouteKey);
    const isNearbyCities = ['delhi-agra', 'agra-delhi', 'mumbai-goa', 'goa-mumbai'].includes(routeKey);
    
    const airlinesIndian = ['IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'AirAsia'];
    const airlinesInternational = ['Emirates', 'Singapore Airlines', 'Qatar Airways', 'Thai Airways', 'Air India'];
    
    const availableAirlines = isInternational ? airlinesInternational : airlinesIndian;
    
    if (isInternational) {
      const intlFlights: Flight[] = [];
      const intlBudget = budget * 0.4;
      
      for (let i = 0; i < 3; i++) {
        const hasOneStop = i === 0;
        const hasTwoStops = i === 1;
        const hasDirect = i === 2 && Math.random() > 0.7;
        
        let basePrice: number;
        let flightDuration: string;
        let carbon: number;
        
        if (hasDirect) {
          basePrice = 25000 + Math.floor(Math.random() * 20000);
          flightDuration = `${6 + Math.floor(Math.random() * 4)}h ${Math.floor(Math.random() * 50)}m`;
          carbon = 1500 + Math.floor(Math.random() * 500);
        } else if (hasOneStop) {
          basePrice = 18000 + Math.floor(Math.random() * 15000);
          flightDuration = `${8 + Math.floor(Math.random() * 5)}h ${Math.floor(Math.random() * 50)}m`;
          carbon = 1200 + Math.floor(Math.random() * 400);
        } else {
          basePrice = 12000 + Math.floor(Math.random() * 10000);
          flightDuration = `${12 + Math.floor(Math.random() * 8)}h ${Math.floor(Math.random() * 50)}m`;
          carbon = 900 + Math.floor(Math.random() * 300);
        }
        
        if (basePrice <= intlBudget) {
          intlFlights.push({
            airline: availableAirlines[Math.floor(Math.random() * availableAirlines.length)],
            departure_time: `${(6 + i * 4).toString().padStart(2, '0')}:00`,
            arrival_time: `${(14 + i * 3).toString().padStart(2, '0')}:30`,
            duration: flightDuration,
            price: basePrice,
            carbon_footprint: carbon,
            stops: hasDirect ? 0 : hasOneStop ? 1 : 2,
            booking_link: `https://www.makemytrip.com/international-flights/`,
          });
        }
      }
      
      return intlFlights.sort((a, b) => a.price - b.price);
    }
    
    const flights: Flight[] = [];
    const domesticBudget = budget * 0.3;
    
    if (hasDirectFlights) {
      for (let i = 0; i < 3; i++) {
        const basePrice = 3500 + Math.floor(Math.random() * 6000);
        const departureHour = 6 + i * 3;
        
        if (basePrice <= domesticBudget) {
          flights.push({
            airline: availableAirlines[Math.floor(Math.random() * availableAirlines.length)],
            departure_time: `${departureHour.toString().padStart(2, '0')}:00`,
            arrival_time: `${(departureHour + 2).toString().padStart(2, '0')}:15`,
            duration: '2h 15m',
            price: basePrice,
            carbon_footprint: 250 + Math.floor(Math.random() * 100),
            stops: 0,
            booking_link: `https://www.makemytrip.com/flights/${source.toLowerCase()}-to-${destination.toLowerCase()}-flights.html`,
          });
        }
      }
      
      for (let i = 0; i < 2; i++) {
        const basePrice = 2800 + Math.floor(Math.random() * 4000);
        const departureHour = 8 + i * 4;
        
        if (basePrice <= domesticBudget) {
          flights.push({
            airline: availableAirlines[Math.floor(Math.random() * availableAirlines.length)],
            departure_time: `${departureHour.toString().padStart(2, '0')}:30`,
            arrival_time: `${(departureHour + 5).toString().padStart(2, '0')}:45`,
            duration: '5h 15m',
            price: basePrice,
            carbon_footprint: 400 + Math.floor(Math.random() * 100),
            stops: 1,
            booking_link: `https://www.makemytrip.com/flights/${source.toLowerCase()}-to-${destination.toLowerCase()}-flights.html`,
          });
        }
      }
    } else {
      for (let i = 0; i < 2; i++) {
        const basePrice = 4500 + Math.floor(Math.random() * 8000);
        const departureHour = 6 + i * 5;
        
        if (basePrice <= domesticBudget) {
          flights.push({
            airline: availableAirlines[Math.floor(Math.random() * availableAirlines.length)],
            departure_time: `${departureHour.toString().padStart(2, '0')}:00`,
            arrival_time: `${(departureHour + 6).toString().padStart(2, '0')}:30`,
            duration: '6h 30m',
            price: basePrice,
            carbon_footprint: 500 + Math.floor(Math.random() * 150),
            stops: 1,
            booking_link: `https://www.makemytrip.com/flights/${source.toLowerCase()}-to-${destination.toLowerCase()}-flights.html`,
          });
        }
      }
    }
    
    return flights.sort((a, b) => a.price - b.price);
  };

  const generateTransport = (source: string, destination: string, budget: number) => {
    const indianCities = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'jaipur', 'goa', 'agra', 'udaipur', 'varanasi', 'shimla', 'manali', 'kerala', 'mysore', 'ahmedabad', 'chandigarh'];
    const coastalCities = ['goa', 'kerala', 'mumbai', 'chennai', 'kolkata'];
    const metroCities = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'jaipur', 'kochi'];
    
    const destLower = destination.toLowerCase();
    const srcLower = source.toLowerCase();
    const isIndianRoute = indianCities.includes(destLower) || indianCities.includes(srcLower);
    const isCoastalDestination = coastalCities.includes(destLower);
    const hasMetro = metroCities.includes(destLower);
    
    const transport: any = {};
    const budgetForTransport = budget * 0.4;
    
    if (isIndianRoute) {
      const flightPrice = Math.floor(Math.random() * 6000) + 4000;
      transport.flight = {
        type: 'flight',
        name: 'IndiGo / Air India / Vistara',
        icon: 'plane',
        description: 'Fastest way to reach',
        price: flightPrice,
        duration: `${Math.floor(Math.random() * 3) + 1}h`,
        carbon: Math.floor(Math.random() * 400) + 250,
        bookingUrl: `https://www.makemytrip.com/flights/${source.toLowerCase()}-to-${destination.toLowerCase()}-flights.html`,
        provider: 'MakeMyTrip',
        available: flightPrice <= budgetForTransport,
        notPossibleReason: 'Flight exceeds budget',
      };
      
      const trainPrice = Math.floor(Math.random() * 1500) + 600;
      transport.train = {
        type: 'train',
        name: 'Rajdhani / Shatabdi Express',
        icon: 'train',
        description: 'Comfortable & scenic journey',
        price: trainPrice,
        duration: `${Math.floor(Math.random() * 10) + 4}h`,
        carbon: Math.floor(Math.random() * 15) + 5,
        bookingUrl: 'https://www.irctc.co.in',
        provider: 'IRCTC',
        available: true,
      };
      
      const busPrice = Math.floor(Math.random() * 2000) + 600;
      transport.bus = {
        type: 'bus',
        name: 'Volvo AC Seater / Sleeper',
        icon: 'bus',
        description: 'Budget-friendly option',
        price: busPrice,
        duration: `${Math.floor(Math.random() * 10) + 6}h`,
        carbon: Math.floor(Math.random() * 40) + 25,
        bookingUrl: 'https://www.redbus.in',
        provider: 'RedBus',
        available: busPrice <= budgetForTransport,
        notPossibleReason: 'Bus exceeds budget',
      };
      
      const carPrice = Math.floor(Math.random() * 10) + 8;
      transport.car = {
        type: 'car',
        name: 'Sedan / SUV with Driver',
        icon: 'car',
        description: 'Door-to-door convenience',
        price: carPrice,
        duration: `${Math.floor(Math.random() * 8) + 5}h`,
        carbon: Math.floor(Math.random() * 80) + 50,
        bookingUrl: 'https://www.olacabs.com',
        provider: 'Ola / Uber',
        priceUnit: 'per km',
        available: carPrice <= 15,
        notPossibleReason: 'Car rental exceeds budget',
      };
      
      if (hasMetro) {
        transport.metro = {
          type: 'metro',
          name: 'Metro Rail / Local Train',
          icon: 'subway',
          description: 'City commute within destination',
          price: Math.floor(Math.random() * 80) + 40,
          duration: `${Math.floor(Math.random() * 1.5) + 0.5}h`,
          carbon: Math.floor(Math.random() * 3) + 1,
          bookingUrl: `https://www.google.com/maps/search/metro+station+${destination.toLowerCase()}`,
          provider: 'Local Metro',
          available: true,
        };
      }
      
      if (isCoastalDestination || destLower === 'kerala') {
        transport.ferry = {
          type: 'ferry',
          name: 'Ferry / Cruise',
          icon: 'ship',
          description: 'Scenic coastal route',
          price: Math.floor(Math.random() * 1200) + 400,
          duration: `${Math.floor(Math.random() * 5) + 2}h`,
          carbon: Math.floor(Math.random() * 20) + 10,
          bookingUrl: `https://www.google.com/maps/search/ferry+${destination.toLowerCase()}`,
          provider: 'Local Ferry',
          available: true,
        };
      }
      
    } else {
      const flightPrice = Math.floor(Math.random() * 20000) + 12000;
      transport.flight = {
        type: 'flight',
        name: 'Emirates / Singapore Airlines',
        icon: 'plane',
        description: 'Only option for international',
        price: flightPrice,
        duration: `${Math.floor(Math.random() * 8) + 3}h`,
        carbon: Math.floor(Math.random() * 2000) + 1000,
        bookingUrl: `https://www.makemytrip.com/international-flights/`,
        provider: 'MakeMyTrip',
        available: flightPrice <= budgetForTransport,
        notPossibleReason: 'International flight exceeds budget',
      };
      
      const trainPrice = Math.floor(Math.random() * 4000) + 1500;
      transport.train = {
        type: 'train',
        name: 'International Rail / Eurostar',
        icon: 'train',
        description: 'Available in Europe & Asia',
        price: trainPrice,
        duration: `${Math.floor(Math.random() * 12) + 5}h`,
        carbon: Math.floor(Math.random() * 50) + 20,
        bookingUrl: 'https://www.trainline.com',
        provider: 'Trainline',
        available: trainPrice <= budgetForTransport,
        notPossibleReason: 'Train not available for this route',
      };
      
      const busPrice = Math.floor(Math.random() * 3000) + 1200;
      transport.bus = {
        type: 'bus',
        name: 'Luxury Coach / FlixBus',
        icon: 'bus',
        description: 'Budget intercity travel',
        price: busPrice,
        duration: `${Math.floor(Math.random() * 15) + 8}h`,
        carbon: Math.floor(Math.random() * 60) + 30,
        bookingUrl: 'https://www.busfinder.com',
        provider: 'FlixBus',
        available: busPrice <= budgetForTransport,
        notPossibleReason: 'Bus not available for this route',
      };
      
      transport.car = {
        type: 'car',
        name: 'Rental Car / Taxi',
        icon: 'car',
        description: 'Flexible exploration',
        price: Math.floor(Math.random() * 60) + 35,
        duration: `${Math.floor(Math.random() * 10) + 4}h`,
        carbon: Math.floor(Math.random() * 100) + 60,
        bookingUrl: 'https://www.hertz.com',
        provider: 'Hertz / Sixt',
        priceUnit: 'per day',
        available: true,
      };
      
      transport.metro = {
        type: 'metro',
        name: 'Metro / MRT',
        icon: 'subway',
        description: 'City transport at destination',
        price: Math.floor(Math.random() * 150) + 40,
        duration: `${Math.floor(Math.random() * 1.5) + 0.5}h`,
        carbon: Math.floor(Math.random() * 2) + 1,
        bookingUrl: `https://www.google.com/maps/search/metro+${destination.toLowerCase()}`,
        provider: 'Local Metro',
        available: true,
      };
    }
    
    return transport;
  };

  const getAllActivities = () => {
    if (!itinerary) return [];
    return itinerary.days.flatMap(day => 
      day.activities.map((a, idx) => ({ ...a, day: day.day, id: `${day.day}-${idx}` }))
    );
  };

  const getDayActivities = (dayNum: number) => {
    if (!itinerary) return [];
    const day = itinerary.days.find(d => d.day === dayNum);
    return day?.activities || [];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hotel': return <Hotel className="h-4 w-4" />;
      case 'food': return <Utensils className="h-4 w-4" />;
      case 'visit': return <Camera className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hotel': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'food': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'visit': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getBookingLink = (activity: DayActivity, destination: string) => {
    switch (activity.category) {
      case 'hotel':
        return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`;
      case 'food':
        return `https://www.zomato.com/${destination.toLowerCase()}/restaurants`;
      case 'visit':
        return `https://www.google.com/maps/search/${encodeURIComponent(activity.title)}+${encodeURIComponent(destination)}`;
      default:
        return `https://www.google.com/search?q=${encodeURIComponent(activity.title)}`;
    }
  };

  const getActivityTips = (activity: DayActivity) => {
    if (activity.category === 'food') {
      return 'Best visited during meal times. Try local specialties!';
    }
    if (activity.category === 'visit') {
      return 'Best visited early morning or late afternoon for best experience.';
    }
    if (activity.category === 'hotel') {
      return 'Check-in available from 2 PM. Early check-in subject to availability.';
    }
    return '';
  };

  const totalCost = itinerary?.days.reduce((sum, day) => 
    sum + day.activities.reduce((s, a) => s + a.cost, 0), 0
  ) || 0;

  const totalCarbon = itinerary?.days.reduce((sum, day) => 
    sum + day.activities.reduce((s, a) => s + a.carbon_footprint, 0), 0
  ) || 0;

  const handleSaveTrip = () => {
    if (!itinerary) return;
    
    const tripData = {
      id: `trip-${Date.now()}`,
      title: `${itinerary.destination} Trip`,
      destination: itinerary.destination,
      source: itinerary.source,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + itinerary.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: itinerary.budget,
      status: 'planned' as const,
      image: `https://source.unsplash.com/600x400/?${encodeURIComponent(itinerary.destination + ' travel')}`,
      daysCount: itinerary.duration,
      activitiesCount: itinerary.days.reduce((sum, day) => sum + day.activities.length, 0),
      itineraryData: itinerary,
    };

    const existingTrips = JSON.parse(localStorage.getItem('nextrip_trips') || '[]');
    const updatedTrips = [tripData, ...existingTrips];
    localStorage.setItem('nextrip_trips', JSON.stringify(updatedTrips));
    
    setIsSaved(true);
    toast.success('Trip saved successfully!');
    
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onToggleTheme={() => setIsDark(!isDark)} isDark={isDark} />

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Plan Your Trip</h1>
              <p className="text-muted-foreground">Create your perfect AI-generated itinerary</p>
            </div>
            <TabsList>
              <TabsTrigger value="plan">Plan</TabsTrigger>
              <TabsTrigger value="travel" disabled={!itinerary}>Travel Options</TabsTrigger>
              <TabsTrigger value="transport" disabled={!itinerary}>Transport</TabsTrigger>
              <TabsTrigger value="itinerary" disabled={!itinerary}>Itinerary</TabsTrigger>
              <TabsTrigger value="map" disabled={!itinerary}>Map</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="plan">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Trip Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>From</Label>
                      <Input 
                        placeholder="e.g., Mumbai"
                        value={formData.source}
                        onChange={(e) => setFormData({...formData, source: e.target.value})}
                        list="sources"
                      />
                      <datalist id="sources">
                        {allCities.map(city => <option key={city} value={city} />)}
                      </datalist>
                    </div>
                    <div className="space-y-2">
                      <Label>To</Label>
                      <div className="relative">
                        <Input 
                          placeholder="Select destination"
                          value={formData.destination}
                          onChange={(e) => setFormData({...formData, destination: e.target.value})}
                          onFocus={() => setShowDestinationDropdown(true)}
                          onBlur={() => setTimeout(() => setShowDestinationDropdown(false), 200)}
                        />
                        {showDestinationDropdown && (
                          <div className="absolute z-50 mt-1 w-full bg-background border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                            <div className="p-2">
                              <p className="text-xs font-semibold text-muted-foreground mb-2">Popular Destinations</p>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(destinationImages).map(([city, image]) => (
                                  <button
                                    key={city}
                                    onClick={() => {
                                      setFormData({...formData, destination: city});
                                      setShowDestinationDropdown(false);
                                    }}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors text-left"
                                  >
                                    <img src={image} alt={city} className="w-10 h-10 rounded-md object-cover" />
                                    <span className="text-sm font-medium">{city}</span>
                                  </button>
                                ))}
                              </div>
                              <p className="text-xs font-semibold text-muted-foreground mb-2 mt-4">Other Cities</p>
                              <div className="space-y-1">
                                {allCities.filter(c => !destinationImages[c]).map(city => (
                                  <button
                                    key={city}
                                    onClick={() => {
                                      setFormData({...formData, destination: city});
                                      setShowDestinationDropdown(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                                  >
                                    <MapPin className="h-3 w-3 inline mr-2 text-muted-foreground" />
                                    {city}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Budget (₹)</Label>
                      <Input 
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Select 
                        value={formData.duration.toString()}
                        onChange={(e: any) => setFormData({...formData, duration: Number(e.target.value)})}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 10, 14].map(d => (
                          <option key={d} value={d}>{d} Day{d > 1 ? 's' : ''}</option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mood</Label>
                      <Select 
                        value={formData.mood}
                        onChange={(e: any) => setFormData({...formData, mood: e.target.value})}
                      >
                        <option value="relaxed">🧘 Relaxed</option>
                        <option value="adventurous">🏔️ Adventurous</option>
                        <option value="romantic">💑 Romantic</option>
                        <option value="party">🎉 Party</option>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Group</Label>
                      <Select 
                        value={formData.groupType}
                        onChange={(e: any) => setFormData({...formData, groupType: e.target.value})}
                      >
                        <option value="solo">👤 Solo</option>
                        <option value="couple">👫 Couple</option>
                        <option value="family">👨‍👩‍👧 Family</option>
                        <option value="friends">👥 Friends</option>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerate} 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Your Trip...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Trip with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Indian Destinations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {indianCities.slice(0, 8).map(city => (
                        <button
                          key={city}
                          onClick={() => setFormData({...formData, destination: city})}
                          className="p-2 text-left rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors text-sm"
                        >
                          <MapPin className="h-3 w-3 text-primary inline mr-1" />
                          {city}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-600" />
                      Why NexTrip AI?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="flex items-center gap-2"><span className="text-green-500">✓</span> 100% Free - No hidden charges</p>
                    <p className="flex items-center gap-2"><span className="text-green-500">✓</span> AI-powered personalized itineraries</p>
                    <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Interactive trip maps with routes</p>
                    <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Flight booking links</p>
                    <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Restaurant & attraction links</p>
                    <p className="flex items-center gap-2"><span className="text-green-500">✓</span> Carbon footprint tracking</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="travel">
            {itinerary && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation2 className="h-5 w-5" />
                      All Travel Options - {itinerary.source} to {itinerary.destination}
                    </CardTitle>
                    <p className="text-muted-foreground">Compare all available transport options for your trip</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {itinerary.transport?.flight && (
                        <TransportCard transport={itinerary.transport.flight} delay={0} />
                      )}
                      {itinerary.transport?.train && (
                        <TransportCard transport={itinerary.transport.train} delay={0.1} />
                      )}
                      {itinerary.transport?.bus && (
                        <TransportCard transport={itinerary.transport.bus} delay={0.2} />
                      )}
                      {itinerary.transport?.car && (
                        <TransportCard transport={itinerary.transport.car} delay={0.3} />
                      )}
                      {itinerary.transport?.metro && (
                        <TransportCard transport={itinerary.transport.metro} delay={0.4} />
                      )}
                      {itinerary.transport?.ferry && (
                        <TransportCard transport={itinerary.transport.ferry} delay={0.5} />
                      )}
                    </div>

                    <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">💡 Travel Tips</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• <span className="text-green-600 font-medium">Trains</span> are the most eco-friendly with lowest carbon footprint</li>
                        <li>• <span className="text-orange-600 font-medium">Buses</span> are budget-friendly with scenic routes</li>
                        <li>• <span className="text-blue-600 font-medium">Cars</span> offer flexibility for stop-and-explore trips</li>
                        <li>• <span className="text-primary font-medium">Flights</span> are fastest but have highest carbon impact</li>
                      </ul>
                    </div>

                    <div className="mt-6 flex justify-center gap-4">
                      <Button 
                        variant="outline"
                        onClick={handleSaveTrip}
                        disabled={isSaved}
                        size="lg"
                      >
                        {isSaved ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Saved!
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Trip
                          </>
                        )}
                      </Button>
                      <Button onClick={() => setActiveTab('itinerary')} size="lg">
                        View Itinerary
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="itinerary">
            {itinerary && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          {itinerary.destination}
                          <Badge variant="outline">{itinerary.mood}</Badge>
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {itinerary.duration} days • {formatCurrency(itinerary.budget)} budget • {formData.groupType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{formatCurrency(totalCost)}</p>
                        <p className="text-sm text-muted-foreground">Estimated Total</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {itinerary.days.map(day => (
                    <Button
                      key={day.day}
                      variant={selectedDay === day.day ? 'default' : 'outline'}
                      onClick={() => setSelectedDay(day.day)}
                      className="flex-shrink-0"
                    >
                      Day {day.day}
                    </Button>
                  ))}
                </div>

                <div className="space-y-4">
                  {getDayActivities(selectedDay).map((activity, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex">
                            <div className="w-16 bg-primary/10 flex flex-col items-center justify-center p-2">
                              <span className="text-2xl font-bold text-primary">{idx + 1}</span>
                              <span className="text-xs text-muted-foreground">Stop</span>
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <div className={cn('p-2 rounded-lg', getCategoryColor(activity.category))}>
                                    {getCategoryIcon(activity.category)}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-lg">{activity.title}</h4>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {activity.start_time} - {activity.end_time}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        {formatCurrency(activity.cost)}
                                      </span>
                                    </div>
                                    {activity.cuisine_type && (
                                      <Badge variant="outline" className="mt-2">
                                        {activity.cuisine_type}
                                      </Badge>
                                    )}
                                    {activity.description && (
                                      <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
                                    )}
                                    {activity.accessibility_info && (
                                      <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                        <Info className="h-3 w-3" />
                                        {activity.accessibility_info}
                                      </p>
                                    )}
                                    <p className="text-xs text-blue-600 mt-2 italic">
                                      💡 {getActivityTips(activity)}
                                    </p>
                                  </div>
                                </div>
                                <a 
                                  href={getBookingLink(activity, itinerary.destination)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex-shrink-0"
                                >
                                  <Button size="sm" variant="outline">
                                    {activity.category === 'hotel' && 'Book Hotel'}
                                    {activity.category === 'food' && 'View Restaurant'}
                                    {activity.category === 'visit' && 'Get Directions'}
                                    {activity.category === 'transport' && 'Book Transport'}
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </Button>
                                </a>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Day {selectedDay} Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{getDayActivities(selectedDay).length}</p>
                        <p className="text-xs text-muted-foreground">Activities</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{formatCurrency(getDayActivities(selectedDay).reduce((s, a) => s + a.cost, 0))}</p>
                        <p className="text-xs text-muted-foreground">Day Cost</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{getDayActivities(selectedDay).reduce((s, a) => s + a.carbon_footprint, 0).toFixed(1)} kg</p>
                        <p className="text-xs text-muted-foreground">Carbon</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{getDayActivities(selectedDay).filter(a => a.category === 'food').length}</p>
                        <p className="text-xs text-muted-foreground">Food Stops</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center gap-4">
                  <Button onClick={() => setActiveTab('map')} size="lg">
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedDay(prev => prev > 1 ? prev - 1 : itinerary.days.length)} size="lg">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Previous Day
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedDay(prev => prev < itinerary.days.length ? prev + 1 : 1)} size="lg">
                    Next Day
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="map">
            {itinerary && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <MapView
                      activities={getAllActivities().map((a, idx) => ({
                        id: `${idx}`,
                        title: a.title,
                        lat: a.lat,
                        lng: a.lng,
                        category: a.category,
                        day: a.day,
                      }))}
                      className="h-[600px]"
                      showRoute={true}
                    />
                  </div>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Trip Route</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                          {itinerary.days.map(day => (
                            <div key={day.day}>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Badge>Day {day.day}</Badge>
                              </h4>
                              {day.activities.map((activity, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm mb-2 ml-2 pl-3 border-l-2 border-primary/30">
                                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                                    {idx + 1}
                                  </span>
                                  <span className="truncate flex-1">{activity.title}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Stops</span>
                          <span className="font-bold">{getAllActivities().length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Days</span>
                          <span>{itinerary.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Est. Cost</span>
                          <span className="font-bold text-primary">{formatCurrency(totalCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CO₂ Emissions</span>
                          <span>{(totalCarbon + (selectedFlight?.carbon_footprint || 0)).toFixed(1)} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hotels</span>
                          <span>{getAllActivities().filter(a => a.category === 'hotel').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Restaurants</span>
                          <span>{getAllActivities().filter(a => a.category === 'food').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Attractions</span>
                          <span>{getAllActivities().filter(a => a.category === 'visit').length}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
