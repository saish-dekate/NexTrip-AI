'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapView } from '@/components/map-view';
import { ItineraryCard } from '@/components/itinerary-card';
import { FlightCard } from '@/components/flight-card';
import { Header } from '@/components/header';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

export default function DemoPage() {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeSection, setActiveSection] = useState<'plan' | 'flights' | 'preview'>('plan');
  const [tripForm, setTripForm] = useState({
    destination: 'Paris',
    budget: 2000,
    duration: 4,
  });

  const handleDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowResults(true);
      setIsLoading(false);
    }, 2000);
  };

  const demoFlights = [
    { id: '1', airline: 'SkyWings', departureTime: new Date('2024-06-15T08:00:00'), arrivalTime: new Date('2024-06-15T14:30:00'), duration: '6h 30m', price: 450, source: 'New York', destination: 'Paris', carbonFootprint: 540 },
    { id: '2', airline: 'AeroFlex', departureTime: new Date('2024-06-15T10:00:00'), arrivalTime: new Date('2024-06-15T17:45:00'), duration: '7h 45m', price: 380, source: 'New York', destination: 'Paris', carbonFootprint: 620 },
    { id: '3', airline: 'Global Air', departureTime: new Date('2024-06-15T14:00:00'), arrivalTime: new Date('2024-06-15T22:30:00'), duration: '8h 30m', price: 320, source: 'New York', destination: 'Paris', carbonFootprint: 680 },
  ];

  const demoActivities = {
    1: [
      { id: '1', dayId: '1', title: 'Eiffel Tower Visit', category: 'visit', cost: 35, carbonFootprint: 2.5, startTime: '09:00', endTime: '12:00', latitude: 48.8584, longitude: 2.2945, order: 0 },
      { id: '2', dayId: '1', title: 'Le Petit Cler', category: 'food', cuisineType: 'French', cost: 45, carbonFootprint: 3.2, startTime: '12:30', endTime: '14:00', latitude: 48.8566, longitude: 2.3522, order: 1 },
      { id: '3', dayId: '1', title: 'Louvre Museum', category: 'visit', cost: 17, carbonFootprint: 1.8, startTime: '15:00', endTime: '19:00', latitude: 48.8606, longitude: 2.3376, order: 2 },
    ],
    2: [
      { id: '4', dayId: '2', title: 'Notre-Dame Cathedral', category: 'visit', cost: 0, carbonFootprint: 1.5, startTime: '09:00', endTime: '11:30', latitude: 48.8530, longitude: 2.3499, order: 0 },
      { id: '5', dayId: '2', title: 'Seine River Cruise', category: 'visit', cost: 15, carbonFootprint: 2.0, startTime: '12:00', endTime: '14:00', latitude: 48.8599, longitude: 2.3470, order: 1 },
      { id: '6', dayId: '2', title: 'Café de Flore', category: 'food', cuisineType: 'French', cost: 40, carbonFootprint: 2.8, startTime: '14:30', endTime: '16:00', latitude: 48.8540, longitude: 2.3326, order: 2 },
    ],
  };

  return (
    <div className={cn('min-h-screen', isDark ? 'dark' : '')}>
      <div className="bg-background text-foreground dark:bg-gray-900 dark:text-white">
        <Header onToggleTheme={() => setIsDark(!isDark)} isDark={isDark} />

        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="mb-4 px-4 py-1">Demo Mode</Badge>
              <h1 className="text-4xl font-bold mb-4">Try NexTrip AI</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience the power of AI-driven travel planning. This demo showcases
                the core features without requiring an account.
              </p>
            </motion.div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={activeSection === 'plan' ? 'default' : 'outline'}
              onClick={() => setActiveSection('plan')}
            >
              Quick Plan
            </Button>
            <Button
              variant={activeSection === 'flights' ? 'default' : 'outline'}
              onClick={() => setActiveSection('flights')}
            >
              Flights
            </Button>
            <Button
              variant={activeSection === 'preview' ? 'default' : 'outline'}
              onClick={() => setActiveSection('preview')}
              disabled={!showResults}
            >
              Preview
            </Button>
          </div>

          {activeSection === 'plan' && (
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Quick Trip Planner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label>Destination</Label>
                      <Input
                        value={tripForm.destination}
                        onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Budget (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={tripForm.budget}
                        onChange={(e) => setTripForm({ ...tripForm, budget: Number(e.target.value) })}
                        placeholder="Enter any amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Select
                        value={tripForm.duration.toString()}
                        onChange={(e: any) => setTripForm({ ...tripForm, duration: Number(e.target.value) })}
                      >
                        <option value="2">2 days</option>
                        <option value="3">3 days</option>
                        <option value="4">4 days</option>
                        <option value="5">5 days</option>
                        <option value="7">7 days</option>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleDemo} className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Demo Itinerary
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'flights' && (
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Paris Flight Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {demoFlights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight as any} />
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'preview' && showResults && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {[1, 2].map((day) => (
                  <ItineraryCard
                    key={day}
                    day={{
                      dayNumber: day,
                      date: new Date(),
                      activities: demoActivities[day as keyof typeof demoActivities] || [],
                    }}
                  />
                ))}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trip Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination</span>
                      <span className="font-medium">Paris, France</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{tripForm.duration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">{formatCurrency(tripForm.budget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Cost</span>
                      <span className="font-bold text-primary">{formatCurrency(152)}</span>
                    </div>
                  </CardContent>
                </Card>

                <MapView
                  activities={[
                    { id: '1', title: 'Eiffel Tower', lat: 48.8584, lng: 2.2945, category: 'visit' },
                    { id: '2', title: 'Louvre Museum', lat: 48.8606, lng: 2.3376, category: 'visit' },
                    { id: '3', title: 'Notre-Dame', lat: 48.8530, lng: 2.3499, category: 'visit' },
                  ]}
                />
              </div>
            </div>
          )}

          <div className="text-center mt-12 py-8 border-t">
            <p className="text-muted-foreground mb-4">Ready to create your own trips?</p>
            <Link href="/auth/register">
              <Button size="lg">
                Sign Up Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
