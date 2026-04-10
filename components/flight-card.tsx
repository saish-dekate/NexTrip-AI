'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Clock, DollarSign, Leaf, ArrowRight } from 'lucide-react';
import { formatCurrency, formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Flight } from '@/types';

interface FlightCardProps {
  flight: Flight;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export function FlightCard({ flight, isSelected, onSelect, className, variant = 'default' }: FlightCardProps) {
  const formatDuration = (duration: string) => {
    return duration;
  };

  return (
    <Card
      className={cn(
        'transition-all cursor-pointer hover:shadow-lg',
        isSelected && 'ring-2 ring-primary',
        className
      )}
      onClick={onSelect}
    >
      <CardContent className={cn('p-4', variant === 'compact' ? 'p-3' : 'p-4')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-semibold text-lg">{formatTime(flight.departureTime.toString().split('T')[1]?.substring(0, 5) || '00:00')}</p>
              <p className="text-xs text-muted-foreground">{flight.source}</p>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-xs text-muted-foreground mb-1">{formatDuration(flight.duration)}</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-20 h-px bg-border" />
                <Plane className="h-4 w-4 text-primary" />
                <div className="w-20 h-px bg-border" />
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{flight.airline}</p>
            </div>

            <div className="text-center">
              <p className="font-semibold text-lg">{formatTime(flight.arrivalTime.toString().split('T')[1]?.substring(0, 5) || '00:00')}</p>
              <p className="text-xs text-muted-foreground">{flight.destination}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <p className="text-2xl font-bold text-primary">{formatCurrency(flight.price)}</p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {flight.duration}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-green-600">
                <Leaf className="h-3 w-3" />
                {flight.carbonFootprint.toFixed(1)}kg CO₂
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface FlightListProps {
  flights: Flight[];
  selectedFlightId?: string;
  onSelectFlight?: (flight: Flight) => void;
  className?: string;
  sortBy?: 'price' | 'duration' | 'emissions';
}

export function FlightList({ flights, selectedFlightId, onSelectFlight, className, sortBy = 'price' }: FlightListProps) {
  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'duration':
        return a.duration.localeCompare(b.duration);
      case 'emissions':
        return a.carbonFootprint - b.carbonFootprint;
      default:
        return 0;
    }
  });

  return (
    <div className={cn('space-y-3', className)}>
      {sortedFlights.map((flight) => (
        <FlightCard
          key={flight.id}
          flight={flight}
          isSelected={selectedFlightId === flight.id}
          onSelect={() => onSelectFlight?.(flight)}
        />
      ))}
    </div>
  );
}
