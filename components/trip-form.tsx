'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Sparkles, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TravelPreferences } from '@/types';

interface TripFormProps {
  onSubmit: (preferences: TravelPreferences) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export function TripForm({ onSubmit, isLoading = false, className }: TripFormProps) {
  const [preferences, setPreferences] = useState<TravelPreferences>({
    source: '',
    destination: '',
    budget: 50000,
    duration: 3,
    mood: 'relaxed',
    groupType: 'solo',
    preferences: [],
    accessibility: false,
    dietaryRestrictions: [],
  });

  const [preferenceInput, setPreferenceInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(preferences);
  };

  const addPreference = () => {
    if (preferenceInput.trim() && preferences.preferences.length < 5) {
      setPreferences((prev) => ({
        ...prev,
        preferences: [...prev.preferences, preferenceInput.trim()],
      }));
      setPreferenceInput('');
    }
  };

  const removePreference = (index: number) => {
    setPreferences((prev) => ({
      ...prev,
      preferences: prev.preferences.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Plan Your Trip
        </CardTitle>
        <CardDescription>Tell us about your dream destination and preferences</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">From (Source)</Label>
              <Input
                id="source"
                placeholder="e.g., New York"
                value={preferences.source}
                onChange={(e) => setPreferences((prev) => ({ ...prev, source: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">To (Destination)</Label>
              <Input
                id="destination"
                placeholder="e.g., Paris"
                value={preferences.destination}
                onChange={(e) => setPreferences((prev) => ({ ...prev, destination: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                value={preferences.budget}
                onChange={(e) => setPreferences((prev) => ({ ...prev, budget: Number(e.target.value) }))}
                required
                placeholder="Enter any amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="30"
                value={preferences.duration}
                onChange={(e) => setPreferences((prev) => ({ ...prev, duration: Number(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Select
                id="mood"
                value={preferences.mood}
                onChange={(e) => setPreferences((prev) => ({ ...prev, mood: e.target.value }))}
              >
                <option value="relaxed">Relaxed</option>
                <option value="adventurous">Adventurous</option>
                <option value="romantic">Romantic</option>
                <option value="party">Party</option>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupType">Group Type</Label>
            <Select
              id="groupType"
              value={preferences.groupType}
              onChange={(e) => setPreferences((prev) => ({ ...prev, groupType: e.target.value }))}
            >
              <option value="solo">Solo</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Preferences (max 5)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., museums, local food"
                value={preferenceInput}
                onChange={(e) => setPreferenceInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference())}
                disabled={preferences.preferences.length >= 5}
              />
              <Button type="button" variant="outline" onClick={addPreference} disabled={preferences.preferences.length >= 5}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {preferences.preferences.map((pref, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => removePreference(index)}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                  {pref} ×
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="accessibility"
              checked={preferences.accessibility}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, accessibility: checked }))}
            />
            <Label htmlFor="accessibility">Accessibility requirements (wheelchair-friendly)</Label>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating your itinerary...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Trip with AI
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
