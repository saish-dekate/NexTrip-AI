'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Download, Camera, Calendar, DollarSign, BookOpen, Share2 } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface JournalEntry {
  day: number;
  date: Date;
  summary: string;
  highlights: string[];
  totalCost: number;
  imageUrl?: string;
  activitiesCount?: number;
}

interface TravelJournalProps {
  itinerary: {
    title: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    days: { dayNumber: number; date: Date; activities: any[] }[];
  };
  className?: string;
}

export function TravelJournal({ itinerary, className }: TravelJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(
    itinerary.days.map((day) => ({
      day: day.dayNumber,
      date: day.date,
      summary: '',
      highlights: [],
      totalCost: day.activities.reduce((sum, a) => sum + a.cost, 0),
      activitiesCount: day.activities.length,
      imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(itinerary.destination)},travel`,
    }))
  );
  const [currentEntry, setCurrentEntry] = useState(0);

  const updateEntry = (field: keyof JournalEntry, value: any) => {
    setEntries((prev) =>
      prev.map((entry, idx) =>
        idx === currentEntry ? { ...entry, [field]: value } : entry
      )
    );
  };

  const exportJournal = () => {
    const content = entries
      .map(
        (entry) => `
# Day ${entry.day} - ${formatDate(entry.date)}

${entry.summary || 'No summary yet.'}

## Highlights
${entry.highlights.map((h) => `- ${h}`).join('\n') || 'No highlights yet.'}

**Daily Cost:** ${formatCurrency(entry.totalCost)}
`
      )
      .join('\n---\n');

    const blob = new Blob([`# ${itinerary.title}\n\n${content}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${itinerary.title.toLowerCase().replace(/\s+/g, '-')}-journal.md`;
    a.click();
  };

  const totalCost = entries.reduce((sum, e) => sum + e.totalCost, 0);

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Travel Journal
          </CardTitle>
          <Button variant="outline" size="sm" onClick={exportJournal}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {entries.map((entry, index) => (
            <Button
              key={entry.day}
              variant={currentEntry === index ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentEntry(index)}
              className="flex-shrink-0"
            >
              Day {entry.day}
            </Button>
          ))}
        </div>

        {entries[currentEntry] && (
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
              <img
                src={entries[currentEntry].imageUrl}
                alt={`Day ${entries[currentEntry].day}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold">Day {entries[currentEntry].day}</h3>
                <p className="text-sm opacity-90">{formatDate(entries[currentEntry].date)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Day Summary</label>
              <Textarea
                placeholder="Write about your experiences..."
                value={entries[currentEntry].summary}
                onChange={(e) => updateEntry('summary', e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  Daily Cost
                </div>
                <p className="text-xl font-semibold">{formatCurrency(entries[currentEntry].totalCost)}</p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Camera className="h-4 w-4" />
                  Photos
                </div>
                <p className="text-xl font-semibold">{entries[currentEntry].activitiesCount || 0} moments</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Trip Total</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(totalCost)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
