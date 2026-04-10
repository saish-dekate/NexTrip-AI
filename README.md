# NexTrip AI - Your AI-Powered Travel Planner

A full-stack travel planning application inspired by Trip.com, powered by Google's Gemini AI.

## Features

- **AI-Powered Itinerary Generation** - Generate personalized travel plans using Gemini 2.5 Flash
- **Smart Flight Search** - Find flights with price, duration, and carbon footprint filters
- **Interactive Maps** - Visualize your trip with activity markers
- **Cost Optimization** - Smart budget splitting and recommendations
- **Carbon Footprint Tracking** - Track and reduce your environmental impact
- **Collaboration** - Share itineraries and plan trips with friends
- **Travel Journal** - Auto-generate blog-style trip summaries
- **Accessibility Support** - Wheelchair-friendly activity recommendations
- **PWA Support** - Installable app with offline access
- **Dark/Light Mode** - Modern UI with theme switching

## Tech Stack

- **Frontend**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS + Shadcn UI + Framer Motion
- **Database**: PostgreSQL (Neon serverless)
- **Auth**: NextAuth.js (Google OAuth + Email/Password)
- **AI**: Google Gemini 2.5 Flash API (free tier)
- **Maps**: React Leaflet + OpenStreetMap
- **Images**: Unsplash API

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon or local)
- Google Gemini API key
- Google OAuth credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextrip-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Gemini AI (Free)
GEMINI_API_KEY="your-gemini-api-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Getting API Keys

### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Free tier includes 1,500 requests/day

### Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Neon PostgreSQL (Free)
1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string

## Project Structure

```
/app
  /(auth)              # Authentication pages
  /api                 # API routes
  /dashboard           # Main application
/components            # Reusable UI components
/lib                   # Utilities and configs
/types                 # TypeScript definitions
```

## API Endpoints

- `POST /api/ai` - Generate AI itinerary
- `GET/POST /api/itineraries` - CRUD operations
- `GET /api/flights` - Search flights
- `POST /api/auth/register` - User registration

## Usage

1. **Sign Up/Login** - Create an account or use Google OAuth
2. **Plan a Trip** - Fill in your travel preferences
3. **Generate Itinerary** - AI creates a personalized plan
4. **Customize** - Modify activities, budget, and more
5. **Save & Share** - Save your trip or share with friends

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | JWT secret (32+ chars) | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | No |

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
