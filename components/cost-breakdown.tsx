'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Hotel, Utensils, Camera, Car, Plane, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { CostBreakdown } from '@/types';

interface CostBreakdownProps {
  breakdown: CostBreakdown;
  className?: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  flights: <Plane className="h-4 w-4" />,
  hotels: <Hotel className="h-4 w-4" />,
  food: <Utensils className="h-4 w-4" />,
  activities: <Camera className="h-4 w-4" />,
  transport: <Car className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  flights: 'bg-blue-500',
  hotels: 'bg-purple-500',
  food: 'bg-orange-500',
  activities: 'bg-green-500',
  transport: 'bg-indigo-500',
};

export function CostBreakdownCard({ breakdown, className }: CostBreakdownProps) {
  const categories = [
    { key: 'flights', label: 'Flights', amount: breakdown.flights },
    { key: 'hotels', label: 'Hotels', amount: breakdown.hotels },
    { key: 'food', label: 'Food & Dining', amount: breakdown.food },
    { key: 'activities', label: 'Activities', amount: breakdown.activities },
    { key: 'transport', label: 'Local Transport', amount: breakdown.transport },
  ];

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Cost Breakdown
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {categories.map((category) => {
          const percentage = breakdown.total > 0 ? (category.amount / breakdown.total) * 100 : 0;
          return (
            <div key={category.key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-white', categoryColors[category.key])}>
                    {categoryIcons[category.key]}
                  </div>
                  <span className="font-medium">{category.label}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{formatCurrency(category.amount)}</span>
                  <span className="text-muted-foreground ml-2">({percentage.toFixed(0)}%)</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', categoryColors[category.key])}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total Budget</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(breakdown.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BudgetOptimizerProps {
  currentBudget: number;
  targetBudget: number;
  onAdjustBudget: (newBudget: number) => void;
  className?: string;
}

export function BudgetOptimizer({ currentBudget, targetBudget, onAdjustBudget, className }: BudgetOptimizerProps) {
  const difference = targetBudget - currentBudget;
  const percentageChange = currentBudget > 0 ? ((difference / currentBudget) * 100).toFixed(0) : 0;

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Budget Adjustment
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Budget</span>
          <span className="font-semibold">{formatCurrency(currentBudget)}</span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onAdjustBudget(currentBudget * 0.8)}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
          >
            -20%
          </button>
          <button
            onClick={() => onAdjustBudget(currentBudget * 0.9)}
            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm hover:bg-orange-200 transition-colors"
          >
            -10%
          </button>
          <button
            onClick={() => onAdjustBudget(currentBudget * 1.1)}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
          >
            +10%
          </button>
          <button
            onClick={() => onAdjustBudget(currentBudget * 1.2)}
            className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm hover:bg-emerald-200 transition-colors"
          >
            +20%
          </button>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Adjusted Budget</span>
            <span className="font-semibold">{formatCurrency(targetBudget)}</span>
          </div>
          {difference !== 0 && (
            <div className="flex items-center gap-1 mt-2">
              {difference < 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500">
                    {Math.abs(Number(percentageChange))}% decrease
                  </span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">
                    +{percentageChange}% increase
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
