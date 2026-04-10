import { NextRequest, NextResponse } from 'next/server';
import { generateItinerary } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, destination, budget, duration, mood, groupType, preferences, accessibility } = body;

    if (!source || !destination || !duration) {
      return NextResponse.json(
        { error: 'Please provide source, destination, and duration' },
        { status: 400 }
      );
    }

    const itinerary = await generateItinerary({
      source,
      destination,
      budget: Number(budget) || 50000,
      duration: Number(duration),
      mood: mood || 'relaxed',
      groupType: groupType || 'solo',
      preferences: preferences || [],
      accessibility: accessibility || false,
    });

    return NextResponse.json(itinerary);
  } catch (error: any) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    );
  }
}
