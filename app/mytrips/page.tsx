'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/header';
import { Plus, MapPin, Calendar, DollarSign, Plane, MoreVertical, Trash2, Copy, Share2, Edit, ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'planned' | 'ongoing' | 'completed';
  image?: string;
  daysCount: number;
  activitiesCount: number;
}

const demoTrips: Trip[] = [];

export default function MyTripsPage() {
  const [isDark, setIsDark] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filter, setFilter] = useState<'all' | 'planned' | 'ongoing' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('nextrip_trips') || '[]');
    setTrips(savedTrips.length > 0 ? savedTrips : demoTrips);
    setLoading(false);
  }, []);

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    return trip.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'ongoing': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleDelete = (tripId: string) => {
    const updatedTrips = trips.filter(t => t.id !== tripId);
    setTrips(updatedTrips);
    localStorage.setItem('nextrip_trips', JSON.stringify(updatedTrips));
  };

  const handleDuplicate = (trip: Trip) => {
    const newTrip = {
      ...trip,
      id: `trip-${Date.now()}`,
      title: `${trip.title} (Copy)`,
    };
    const updatedTrips = [newTrip, ...trips];
    setTrips(updatedTrips);
    localStorage.setItem('nextrip_trips', JSON.stringify(updatedTrips));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onToggleTheme={() => setIsDark(!isDark)} isDark={isDark} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Trips</h1>
            <p className="text-muted-foreground">Manage and track all your travel plans</p>
          </div>
          <Link href="/dashboard">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Plan New Trip
            </Button>
          </Link>
        </div>

        <div className="flex gap-2 mb-8">
          {[
            { key: 'all', label: 'All Trips', count: trips.length },
            { key: 'planned', label: 'Planned', count: trips.filter(t => t.status === 'planned').length },
            { key: 'ongoing', label: 'Ongoing', count: trips.filter(t => t.status === 'ongoing').length },
            { key: 'completed', label: 'Completed', count: trips.filter(t => t.status === 'completed').length },
          ].map(item => (
            <Button
              key={item.key}
              variant={filter === item.key ? 'default' : 'outline'}
              onClick={() => setFilter(item.key as any)}
              size="sm"
            >
              {item.label}
              <Badge variant="secondary" className="ml-2">
                {item.count}
              </Badge>
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-4">
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group hover:shadow-lg transition-all">
                  <div className="aspect-video relative overflow-hidden">
                    {trip.image ? (
                      <img 
                        src={trip.image} 
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Plane className="h-16 w-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge 
                      className={`absolute top-3 left-3 ${getStatusColor(trip.status)}`}
                    >
                      {trip.status}
                    </Badge>
                    <div className="absolute top-3 right-3">
                      <Button size="icon" variant="ghost" className="bg-white/20 hover:bg-white/40">
                        <MoreVertical className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="text-xl font-bold">{trip.title}</h3>
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <MapPin className="h-3 w-3" />
                        {trip.destination}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-4 text-sm">
                        <span>{trip.daysCount} days</span>
                        <span>{trip.activitiesCount} activities</span>
                      </div>
                      <span className="font-bold text-primary">{formatCurrency(trip.budget)}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/dashboard?trip=${trip.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          View/Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDuplicate(trip)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(trip.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No trips found</h3>
            <p className="text-muted-foreground mb-6">
              {filter === 'all' 
                ? "You haven't planned any trips yet. Start planning your next adventure!"
                : `No ${filter} trips at the moment.`
              }
            </p>
            <Link href="/dashboard">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Plan Your First Trip
              </Button>
            </Link>
          </Card>
        )}

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <Link href="/dashboard">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Plan New Trip</h3>
                    <p className="text-sm text-muted-foreground">Create a custom itinerary</p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <Link href="/explore">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Explore Destinations</h3>
                    <p className="text-sm text-muted-foreground">Discover new places</p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Share & Collaborate</h3>
                  <p className="text-sm text-muted-foreground">Invite friends to plan together</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-16 py-12 bg-muted/50 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Travel Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4">
            <div>
              <div className="text-4xl font-bold text-primary">{trips.length}</div>
              <div className="text-sm text-muted-foreground">Total Trips</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">
                {trips.reduce((sum, t) => sum + t.daysCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Days Traveled</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">
                {trips.reduce((sum, t) => sum + t.activitiesCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Activities Done</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">
                {formatCurrency(trips.reduce((sum, t) => sum + t.budget, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
