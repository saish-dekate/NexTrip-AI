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
      
      const flights = generateFlights(formData.source, formData.destination, formData.duration);
      const transport = generateTransport(formData.source, formData.destination);
      
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

  const generateFlights = (source: string, destination: string, days: number): Flight[] => {
    const airlines = ['IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'Emirates', 'Singapore Airlines'];
    const flights: Flight[] = [];
    
    for (let i = 0; i < 5; i++) {
      const isDirect = i < 2;
      const stops = isDirect ? 0 : Math.random() > 0.5 ? 1 : 2;
      const basePrice = stops === 0 ? 8000 : stops === 1 ? 6500 : 5500;
      const priceVariation = Math.floor(Math.random() * 4000);
      const departureHour = 6 + i * 2;
      
      flights.push({
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        departure_time: `${departureHour.toString().padStart(2, '0')}:00`,
        arrival_time: `${(departureHour + 2 + stops).toString().padStart(2, '0')}:30`,
        duration: `${2 + stops * 2}h ${Math.floor(Math.random() * 40)}m`,
        price: basePrice + priceVariation,
        carbon_footprint: 350 + stops * 100,
        stops,
        booking_link: `https://www.makemytrip.com/flights/${source.toLowerCase()}-to-${destination.toLowerCase()}-flights.html`,
      });
    }
    
    return flights.sort((a, b) => a.price - b.price);
  };

  const generateTransport = (source: string, destination: string) => {
    const indianDestinations = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'jaipur', 'goa', 'agra', 'udaipur', 'varanasi', 'shimla', 'manali', 'kerala'];
    const isIndianRoute = indianDestinations.includes(destination.toLowerCase()) || indianDestinations.includes(source.toLowerCase());
    
    if (isIndianRoute) {
      return {
        bus: {
          name: 'Volvo AC Bus',
          price: Math.floor(Math.random() * 3000) + 1500,
          bookingUrl: 'https://www.redbus.in',
          duration: `${Math.floor(Math.random() * 10) + 6}h`,
        },
        train: {
          name: 'Rajdhani Express',
          price: Math.floor(Math.random() * 2000) + 800,
          bookingUrl: 'https://www.irctc.co.in',
          duration: `${Math.floor(Math.random() * 12) + 4}h`,
        },
        car: {
          name: 'Sedan with Driver',
          price: Math.floor(Math.random() * 15) + 10,
          bookingUrl: 'https://www.olacabs.com',
          duration: `${Math.floor(Math.random() * 10) + 5}h`,
        },
      };
    } else {
      return {
        bus: {
          name: 'Luxury Coach',
          price: Math.floor(Math.random() * 5000) + 2000,
          bookingUrl: 'https://www.busfinder.com',
          duration: `${Math.floor(Math.random() * 15) + 8}h`,
        },
        train: {
          name: 'Express Train',
          price: Math.floor(Math.random() * 3000) + 1200,
          bookingUrl: 'https://www.trainline.com',
          duration: `${Math.floor(Math.random() * 18) + 6}h`,
        },
        car: {
          name: 'Car Rental',
          price: Math.floor(Math.random() * 50) + 30,
          bookingUrl: 'https://www.hertz.com',
          duration: `${Math.floor(Math.random() * 12) + 4}h`,
        },
      };
    }
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
              <TabsTrigger value="flights" disabled={!itinerary}>Flights</TabsTrigger>
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

          <TabsContent value="flights">
            {itinerary && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plane className="h-5 w-5" />
                      Available Flights - {itinerary.source} to {itinerary.destination}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {itinerary.flights.map((flight, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={cn(
                            "p-4 rounded-lg border-2 cursor-pointer transition-all",
                            selectedFlight === flight ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          )}
                          onClick={() => setSelectedFlight(flight)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <p className="text-lg font-bold">{flight.departure_time}</p>
                                <p className="text-xs text-muted-foreground">{itinerary.source}</p>
                              </div>
                              <div className="flex flex-col items-center">
                                <p className="text-xs text-muted-foreground">{flight.duration}</p>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                  <div className="w-20 h-px bg-border relative">
                                    {flight.stops > 0 && (
                                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-500" />
                                    )}
                                  </div>
                                  <Plane className="h-3 w-3 text-primary" />
                                </div>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold">{flight.arrival_time}</p>
                                <p className="text-xs text-muted-foreground">{itinerary.destination}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">{formatCurrency(flight.price)}</p>
                              <p className="text-xs text-muted-foreground">{flight.airline}</p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {flight.carbon_footprint.toFixed(0)} kg CO₂
                              </Badge>
                            </div>
                          </div>
                          {selectedFlight === flight && (
                            <div className="mt-4 pt-4 border-t flex justify-between items-center">
                              <div className="flex gap-2">
                                <Badge variant="secondary">Best Price</Badge>
                                {flight.stops === 0 && <Badge variant="outline">Direct Flight</Badge>}
                              </div>
                              <a href={flight.booking_link} target="_blank" rel="noopener noreferrer">
                                <Button size="sm">
                                  Book on MakeMyTrip
                                  <ExternalLink className="h-3 w-3 ml-2" />
                                </Button>
                              </a>
                            </div>
                          )}
                        </motion.div>
                      ))}
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
                        Continue to Itinerary
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transport">
            {itinerary && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation2 className="h-5 w-5" />
                      Alternative Transport Options - {itinerary.source} to {itinerary.destination}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {itinerary.transport?.bus && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Card className="h-full hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <Bus className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{itinerary.transport.bus.name}</CardTitle>
                                  <p className="text-sm text-muted-foreground">Bus</p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Duration</span>
                                  <span className="font-medium">{itinerary.transport.bus.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Price</span>
                                  <span className="font-bold text-xl text-primary">{formatCurrency(itinerary.transport.bus.price)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Carbon</span>
                                  <Badge variant="outline">{Math.floor(Math.random() * 30) + 20} kg CO₂</Badge>
                                </div>
                                <a href={itinerary.transport.bus.bookingUrl} target="_blank" rel="noopener noreferrer" className="block mt-4">
                                  <Button className="w-full" variant="outline">
                                    Book on RedBus
                                    <ExternalLink className="h-3 w-3 ml-2" />
                                  </Button>
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}

                      {itinerary.transport?.train && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Card className="h-full hover:shadow-lg transition-shadow border-green-200 dark:border-green-800">
                            <CardHeader className="pb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <Train className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{itinerary.transport.train.name}</CardTitle>
                                  <p className="text-sm text-muted-foreground">Train</p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Duration</span>
                                  <span className="font-medium">{itinerary.transport.train.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Price</span>
                                  <span className="font-bold text-xl text-primary">{formatCurrency(itinerary.transport.train.price)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Carbon</span>
                                  <Badge variant="outline" className="bg-green-50 text-green-700">{(Math.floor(Math.random() * 15) + 5).toFixed(0)} kg CO₂</Badge>
                                </div>
                                <a href={itinerary.transport.train.bookingUrl} target="_blank" rel="noopener noreferrer" className="block mt-4">
                                  <Button className="w-full" variant="outline">
                                    Book on IRCTC
                                    <ExternalLink className="h-3 w-3 ml-2" />
                                  </Button>
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}

                      {itinerary.transport?.car && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Card className="h-full hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Car className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{itinerary.transport.car.name}</CardTitle>
                                  <p className="text-sm text-muted-foreground">Car/Taxi</p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Duration</span>
                                  <span className="font-medium">{itinerary.transport.car.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Price (per day)</span>
                                  <span className="font-bold text-xl text-primary">{formatCurrency(itinerary.transport.car.price)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Carbon</span>
                                  <Badge variant="outline">{(Math.floor(Math.random() * 50) + 30).toFixed(0)} kg CO₂</Badge>
                                </div>
                                <a href={itinerary.transport.car.bookingUrl} target="_blank" rel="noopener noreferrer" className="block mt-4">
                                  <Button className="w-full" variant="outline">
                                    Book on Ola/Uber
                                    <ExternalLink className="h-3 w-3 ml-2" />
                                  </Button>
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </div>

                    <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">💡 Travel Tips</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Trains are the most eco-friendly option with lowest carbon footprint</li>
                        <li>• Buses are budget-friendly and offer scenic routes</li>
                        <li>• Car rentals give you flexibility but consider fuel costs</li>
                        <li>• For international destinations, flights may be the only option</li>
                      </ul>
                    </div>

                    <div className="mt-6 flex justify-center">
                      <Button onClick={() => setActiveTab('itinerary')} size="lg">
                        Continue to Itinerary
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
