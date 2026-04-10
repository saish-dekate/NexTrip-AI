import { z } from 'zod';

export const ActivityCategory = z.enum(['hotel', 'food', 'visit', 'transport']);
export type ActivityCategory = z.infer<typeof ActivityCategory>;

export const Mood = z.enum(['relaxed', 'adventurous', 'romantic', 'party']);
export type Mood = z.infer<typeof Mood>;

export const GroupType = z.enum(['solo', 'family', 'friends', 'couple']);
export type GroupType = z.infer<typeof GroupType>;

export const activitySchema = z.object({
  title: z.string(),
  category: z.string(),
  cuisine_type: z.string().optional(),
  start_time: z.string(),
  end_time: z.string(),
  cost: z.number(),
  carbon_footprint: z.number(),
  accessibility_info: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
});

export const flightSchema = z.object({
  airline: z.string(),
  departure_time: z.string(),
  arrival_time: z.string(),
  duration: z.string(),
  price: z.number(),
  carbon_footprint: z.number(),
});

export const daySchema = z.object({
  day: z.number(),
  activities: z.array(activitySchema),
});

export const itineraryAISchema = z.object({
  flights: z.array(flightSchema),
  days: z.array(daySchema),
});

export type ItineraryAI = z.infer<typeof itineraryAISchema>;

export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  destination: string;
  source: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  mood?: string | null;
  preferences?: string | null;
  shareToken: string;
  aiContext?: string | null;
  createdAt: Date;
  updatedAt: Date;
  days?: Day[];
  flights?: Flight[];
}

export interface Day {
  id: string;
  itineraryId: string;
  dayNumber: number;
  date: Date;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  dayId: string;
  title: string;
  category: string;
  cuisineType?: string | null;
  cost: number;
  carbonFootprint: number;
  accessibilityInfo?: string | null;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  order: number;
}

export interface Flight {
  id: string;
  itineraryId: string;
  airline: string;
  departureTime: Date;
  arrivalTime: Date;
  duration: string;
  price: number;
  source: string;
  destination: string;
  carbonFootprint: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TravelPreferences {
  source: string;
  destination: string;
  budget: number;
  duration: number;
  mood: string;
  groupType: string;
  preferences: string[];
  accessibility: boolean;
  dietaryRestrictions?: string[];
}

export interface CostBreakdown {
  flights: number;
  hotels: number;
  food: number;
  activities: number;
  transport: number;
  total: number;
}

export interface CarbonFootprint {
  flights: number;
  activities: number;
  total: number;
}
