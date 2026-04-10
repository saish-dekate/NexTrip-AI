'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Sparkles, MapPin, Calendar, Users, Shield, Zap, Leaf, Globe, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleTryFree = () => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    } else {
      router.push('/auth/register');
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      router.refresh();
    }
  }, [status, router]);

  const features = [
    { icon: <Sparkles className="h-6 w-6" />, title: 'AI-Powered Planning', description: 'Generate personalized itineraries in seconds using smart AI algorithms' },
    { icon: <Plane className="h-6 w-6" />, title: 'Smart Flight Search', description: 'Find the best flights with carbon footprint tracking and price comparison' },
    { icon: <MapPin className="h-6 w-6" />, title: 'Interactive Maps', description: 'Visualize your entire trip with day-by-day routes and location markers' },
    { icon: <Users className="h-6 w-6" />, title: 'Real-time Collaboration', description: 'Plan trips together with friends and family with shared itineraries' },
    { icon: <Leaf className="h-6 w-6" />, title: 'Eco-Friendly Options', description: 'Track and reduce your carbon footprint with sustainable choices' },
    { icon: <Shield className="h-6 w-6" />, title: 'Accessible Travel', description: 'Wheelchair-friendly recommendations and accessibility info included' },
  ];

  const popularDestinations = [
    { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400', places: '500+ places' },
    { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400', places: '400+ places' },
    { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400', places: '300+ places' },
    { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400', places: '250+ places' },
    { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400', places: '350+ places' },
    { name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', places: '400+ places' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="bg-background text-foreground dark:bg-gray-900 dark:text-white transition-colors">
        <Header onToggleTheme={() => setIsDark(!isDark)} isDark={isDark} />

        <main className="container mx-auto px-4">
          <section className="py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                ✨ 100% Free - No Subscription Required
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Plan Your Perfect
                <br />
                <span className="gradient-text">Trip with AI</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                NexTrip AI transforms how you travel. Get personalized itineraries, smart flight recommendations, 
                and collaborative planning - completely free forever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" onClick={handleTryFree}>
                  {status === 'authenticated' ? 'Go to Dashboard' : 'Start Planning Free'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Open App
                  </Button>
                </Link>
              </div>
            </motion.div>
          </section>

          <section className="py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Popular Destinations</h2>
            <p className="text-center text-muted-foreground mb-12">Explore trending destinations across India and worldwide</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularDestinations.map((dest, index) => (
                <motion.div
                  key={dest.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-all group">
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={dest.image} 
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white">
                        <h3 className="font-semibold">{dest.name}</h3>
                        <p className="text-xs opacity-80">{dest.places}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="py-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who plan smarter with NexTrip AI. Your perfect trip is just a click away.
            </p>
            <Button size="lg" className="text-lg px-8" onClick={handleTryFree}>
              Get Started Now - It's Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </section>

          <section className="py-16 border-t">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Free Forever</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Destinations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Places Covered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">AI Assistance</div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Plane className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">NexTrip AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2024 NexTrip AI. Plan your dream trips with AI.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
