'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/header';
import { MapPin, Search, Star, Users, Leaf, Sparkles, ArrowRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const destinations = [
  { 
    name: 'Delhi', 
    country: 'India', 
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600', 
    rating: 4.8,
    places: 500,
    category: 'Heritage',
    description: 'Experience the perfect blend of ancient and modern India'
  },
  { 
    name: 'Mumbai', 
    country: 'India', 
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600', 
    rating: 4.7,
    places: 400,
    category: 'Metro',
    description: 'The city that never sleeps - Bollywood, beaches, and more'
  },
  { 
    name: 'Goa', 
    country: 'India', 
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', 
    rating: 4.9,
    places: 300,
    category: 'Beach',
    description: 'Golden beaches, vibrant nightlife, Portuguese heritage'
  },
  { 
    name: 'Jaipur', 
    country: 'India', 
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', 
    rating: 4.8,
    places: 250,
    category: 'Heritage',
    description: 'The Pink City - majestic forts and royal palaces'
  },
  { 
    name: 'Kerala', 
    country: 'India', 
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', 
    rating: 4.9,
    places: 350,
    category: 'Nature',
    description: 'God\'s own country - backwaters, tea gardens, and Ayurveda'
  },
  { 
    name: 'Agra', 
    country: 'India', 
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600', 
    rating: 4.8,
    places: 150,
    category: 'Heritage',
    description: 'Home to the iconic Taj Mahal'
  },
  { 
    name: 'Dubai', 
    country: 'UAE', 
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', 
    rating: 4.7,
    places: 400,
    category: 'Modern',
    description: 'Luxury shopping, futuristic architecture, desert adventures'
  },
  { 
    name: 'Singapore', 
    country: 'Singapore', 
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600', 
    rating: 4.8,
    places: 300,
    category: 'Modern',
    description: 'Garden city with world-class attractions'
  },
  { 
    name: 'Paris', 
    country: 'France', 
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', 
    rating: 4.9,
    places: 500,
    category: 'Romantic',
    description: 'The city of love, art, and fashion'
  },
  { 
    name: 'Bali', 
    country: 'Indonesia', 
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', 
    rating: 4.8,
    places: 280,
    category: 'Beach',
    description: 'Tropical paradise with temples and rice terraces'
  },
  { 
    name: 'London', 
    country: 'UK', 
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600', 
    rating: 4.7,
    places: 450,
    category: 'Historic',
    description: 'Royal palaces, world-class museums, iconic landmarks'
  },
  { 
    name: 'Udaipur', 
    country: 'India', 
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', 
    rating: 4.8,
    places: 200,
    category: 'Romantic',
    description: 'City of Lakes - romantic palaces and serene views'
  },
];

const categories = ['All', 'Heritage', 'Beach', 'Nature', 'Metro', 'Modern', 'Romantic', 'Historic'];

const popularSearches = ['Taj Mahal', 'Goa Beaches', 'Kerala Backwaters', 'Rajasthan Forts', 'Himalayan Adventure'];

export default function ExplorePage() {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header onToggleTheme={() => setIsDark(!isDark)} isDark={isDark} />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore Destinations</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover amazing places across India and around the world
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map(search => (
              <button
                key={search}
                onClick={() => setSearchQuery(search)}
                className="text-sm text-primary hover:underline"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest, index) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    {dest.category}
                  </Badge>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="text-xl font-bold">{dest.name}</h3>
                    <p className="text-sm opacity-90">{dest.country}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">{dest.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {dest.rating}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {dest.places} places
                      </span>
                    </div>
                    <Link href={`/dashboard?destination=${encodeURIComponent(dest.name)}`}>
                      <Button size="sm" variant="ghost">
                        Plan Trip
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No destinations found</h3>
            <p className="text-muted-foreground">Try a different search term or category</p>
          </div>
        )}

        <section className="mt-16 py-12 bg-muted/50 rounded-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Why Explore with NexTrip AI?</h2>
            <p className="text-muted-foreground">Smart features to enhance your travel experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <Card className="bg-background">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">Get personalized itineraries generated by smart AI</p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="p-6 text-center">
                <Leaf className="h-10 w-10 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Eco-Friendly</h3>
                <p className="text-sm text-muted-foreground">Track carbon footprint and choose sustainable options</p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2">Collaborative</h3>
                <p className="text-sm text-muted-foreground">Plan trips together with friends and family</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
