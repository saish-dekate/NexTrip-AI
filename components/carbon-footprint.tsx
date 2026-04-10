'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Plane, Car, Footprints, TreePine, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CarbonFootprint } from '@/types';

interface CarbonFootprintProps {
  footprint: CarbonFootprint;
  className?: string;
}

export function CarbonFootprintCard({ footprint, className }: CarbonFootprintProps) {
  const getRating = () => {
    if (footprint.total < 500) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (footprint.total < 1000) return { label: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const rating = getRating();

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          Carbon Footprint
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center py-6">
          <p className="text-4xl font-bold text-green-600">{footprint.total.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground mt-1">kg CO₂ equivalent</p>
          <Badge className={cn('mt-3', rating.bg, rating.color)}>{rating.label}</Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Flights</span>
            </div>
            <span className="font-medium">{footprint.flights.toFixed(1)} kg</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Activities</span>
            </div>
            <span className="font-medium">{footprint.activities.toFixed(1)} kg</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <TreePine className="h-4 w-4 mt-0.5" />
            <p>To offset this, you would need to plant approximately {Math.ceil(footprint.total / 21)} trees.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface EcoTipsProps {
  className?: string;
}

export function EcoTipsCard({ className }: EcoTipsProps) {
  const tips = [
    { icon: Footprints, text: 'Use public transport or walk between attractions' },
    { icon: Plane, text: 'Choose direct flights to reduce emissions' },
    { icon: TreePine, text: 'Support local businesses and eco-friendly accommodations' },
    { icon: Leaf, text: 'Bring a reusable water bottle and shopping bag' },
  ];

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-green-600" />
          Eco-Friendly Tips
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <tip.icon className="h-5 w-5 text-green-600 mt-0.5" />
              <span className="text-sm">{tip.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
