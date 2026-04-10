import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const itineraries = await prisma.itinerary.findMany({
      where: { userId: (session.user as any).id },
      include: {
        days: {
          include: { activities: true },
          orderBy: { dayNumber: 'asc' },
        },
        flights: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(itineraries);
  } catch (error: any) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itineraries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, destination, source, startDate, endDate, budget, mood, preferences, aiContext, flights, days } = body;

    const itinerary = await prisma.itinerary.create({
      data: {
        userId: (session.user as any).id,
        title,
        destination,
        source,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: Number(budget),
        mood,
        preferences: JSON.stringify(preferences),
        aiContext: JSON.stringify(aiContext),
        flights: {
          create: flights?.map((flight: any) => ({
            airline: flight.airline,
            departureTime: new Date(flight.departure_time),
            arrivalTime: new Date(flight.arrival_time),
            duration: flight.duration,
            price: flight.price,
            source,
            destination,
            carbonFootprint: flight.carbon_footprint,
          })) || [],
        },
        days: {
          create: days?.map((day: any, dayIndex: number) => ({
            dayNumber: day.day,
            date: new Date(new Date(startDate).getTime() + dayIndex * 24 * 60 * 60 * 1000),
            activities: {
              create: day.activities?.map((activity: any, activityIndex: number) => ({
                title: activity.title,
                category: activity.category,
                cuisineType: activity.cuisine_type,
                cost: activity.cost,
                carbonFootprint: activity.carbon_footprint,
                accessibilityInfo: activity.accessibility_info,
                startTime: activity.start_time,
                endTime: activity.end_time,
                latitude: activity.lat,
                longitude: activity.lng,
                order: activityIndex,
              })) || [],
            },
          })) || [],
        },
      },
      include: {
        days: {
          include: { activities: true },
          orderBy: { dayNumber: 'asc' },
        },
        flights: true,
      },
    });

    return NextResponse.json(itinerary);
  } catch (error: any) {
    console.error('Error creating itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to create itinerary' },
      { status: 500 }
    );
  }
}
