'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Leaf, MapPin, Star, Utensils, Hotel, Camera, Car } from 'lucide-react';
import { formatCurrency, formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Activity } from '@/types';

interface ItineraryCardProps {
  day: {
    dayNumber: number;
    date: Date;
    activities: Activity[];
  };
  className?: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  hotel: <Hotel className="h-4 w-4" />,
  food: <Utensils className="h-4 w-4" />,
  visit: <Camera className="h-4 w-4" />,
  transport: <Car className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  hotel: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  food: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  visit: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  transport: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export function ItineraryCard({ day, className }: ItineraryCardProps) {
  const getPeriod = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  };

  const sortedActivities = [...day.activities].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  const totalCost = day.activities.reduce((sum, a) => sum + a.cost, 0);
  const totalCarbon = day.activities.reduce((sum, a) => sum + a.carbonFootprint, 0);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Day {day.dayNumber}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {formatCurrency(totalCost)}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Leaf className="h-3 w-3 text-green-600" />
              {totalCarbon.toFixed(1)}kg
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y">
          {sortedActivities.map((activity, index) => (
            <div key={activity.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                    categoryColors[activity.category] || categoryColors.visit
                  )}
                >
                  {categoryIcons[activity.category] || categoryIcons.visit}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{activity.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {getPeriod(activity.startTime)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(activity.cost)}
                    </span>
                    {activity.cuisineType && (
                      <span className="flex items-center gap-1">
                        <Utensils className="h-3 w-3" />
                        {activity.cuisineType}
                      </span>
                    )}
                  </div>

                  {activity.accessibilityInfo && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      ♿ {activity.accessibilityInfo}
                    </p>
                  )}

                  {activity.latitude && activity.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${activity.latitude},${activity.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
                    >
                      <MapPin className="h-3 w-3" />
                      View on map
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
