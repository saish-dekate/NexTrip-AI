# NexTrip AI - Specification Document

## Overview
NexTrip AI is a full-stack AI-powered travel planner inspired by Trip.com, featuring intelligent itinerary generation, flight search, and collaborative planning tools.

## Tech Stack (100% FREE)
- **Frontend**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS + Shadcn UI + Framer Motion
- **Database**: PostgreSQL (Neon serverless)
- **Auth**: NextAuth.js (Google OAuth + Email/Password)
- **AI**: Google Gemini 2.5 Flash API (free tier)
- **Maps**: React Leaflet + OpenStreetMap
- **Images**: Unsplash API

## Architecture
```
/app
  /(auth)         - Login/Register pages
  /(dashboard)    - Main app pages
  /api            - API routes
/components       - Reusable UI components
/lib              - Utilities and configurations
/hooks            - Custom React hooks
/types            - TypeScript type definitions
```

## Database Schema

### Users Table
- id, email, name, image, password, created_at, updated_at

### Itineraries Table
- id, user_id, title, description, destination, start_date, end_date, budget, mood, preferences, share_token, created_at, updated_at

### Days Table
- id, itinerary_id, day_number, date

### Activities Table
- id, day_id, title, category, cuisine_type, cost, carbon_footprint, accessibility_info, start_time, end_time, latitude, longitude, order

### Flights Table
- id, itinerary_id, airline, departure_time, arrival_time, duration, price, source, destination, carbon_footprint

### Collaborators Table
- id, itinerary_id, user_id, role, joined_at

## AI Chatbot Engine (Gemini 2.5 Flash)

### Input Parameters
- source, destination, budget, duration, mood, group_type, preferences, accessibility_needs

### Output Format (Strict JSON)
```json
{
  "flights": [{ airline, departure_time, arrival_time, duration, price, carbon_footprint }],
  "days": [{ day, activities: [{ title, category, cuisine_type, start_time, end_time, cost, carbon_footprint, accessibility_info, lat, lng }] }]
}
```

## Features
1. AI-powered itinerary generation
2. Flight search with filters
3. Smart travel bundles
4. Cuisine recommendations
5. Carbon footprint tracking
6. Accessibility options
7. Cost optimization
8. Interactive map system
9. Timeline view
10. Real-time chat interface
11. Collaboration & sharing
12. Travel journal generation
13. PWA support
14. Dark/Light mode

## Design
- Trip.com inspired modern UI
- Glassmorphism effects
- Bento grid layouts
- Smooth Framer Motion animations
- Responsive design
