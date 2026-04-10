import { NextRequest, NextResponse } from 'next/server';

interface FlightOffer {
  id: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  source: string;
  destination: string;
  carbonFootprint: number;
}

const AIRLINES = [
  'SkyWings', 'AeroFlex', 'Global Air', 'Swift Airways', 'Horizon Airlines',
  'Pacific Wings', 'Atlas Air', 'Nova Airlines', 'Summit Air', 'Coastal Aviation'
];

function generateFlightNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
  const number = Math.floor(Math.random() * 9000) + 100;
  return `${prefix}${number}`;
}

function calculateDuration(departure: Date, arrival: Date): string {
  const diff = arrival.getTime() - departure.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

function estimateCarbon(duration: string, price: number): number {
  const hours = parseInt(duration.split('h')[0]);
  const baseEmission = hours * 90;
  const priceFactor = price > 500 ? 1.2 : price > 200 ? 1.0 : 0.8;
  return Math.round(baseEmission * priceFactor * 10) / 10;
}

function generateFlights(source: string, destination: string, date: string, count: number = 10): FlightOffer[] {
  const flights: FlightOffer[] = [];
  const basePrice = Math.floor(Math.random() * 400) + 150;
  
  const departureHours = [6, 8, 10, 12, 14, 16, 18, 20, 22];
  const shuffled = departureHours.sort(() => Math.random() - 0.5).slice(0, Math.min(count, departureHours.length));

  shuffled.forEach((hour, index) => {
    const departure = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`);
    const flightDuration = Math.floor(Math.random() * 6) + 2;
    const arrivalHour = (hour + flightDuration) % 24;
    const arrival = new Date(`${date}T${arrivalHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`);
    
    const priceVariation = Math.floor(Math.random() * 200) - 100;
    const price = Math.max(100, basePrice + priceVariation + (index * 30));

    flights.push({
      id: `flight-${Date.now()}-${index}`,
      airline: AIRLINES[Math.floor(Math.random() * AIRLINES.length)],
      departureTime: departure.toISOString(),
      arrivalTime: arrival.toISOString(),
      duration: calculateDuration(departure, arrival),
      price,
      source,
      destination,
      carbonFootprint: estimateCarbon(calculateDuration(departure, arrival), price),
    });
  });

  return flights.sort((a, b) => a.price - b.price);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const sortBy = searchParams.get('sortBy') || 'price';

    if (!source || !destination || !date) {
      return NextResponse.json(
        { error: 'Missing required parameters: source, destination, date' },
        { status: 400 }
      );
    }

    const flights = generateFlights(source, destination, date);

    let sortedFlights = [...flights];
    if (sortBy === 'price') {
      sortedFlights.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'duration') {
      sortedFlights.sort((a, b) => {
        const aHours = parseInt(a.duration.split('h')[0]);
        const bHours = parseInt(b.duration.split('h')[0]);
        return aHours - bHours;
      });
    } else if (sortBy === 'emissions') {
      sortedFlights.sort((a, b) => a.carbonFootprint - b.carbonFootprint);
    }

    return NextResponse.json({
      flights: sortedFlights,
      meta: {
        source,
        destination,
        date,
        count: sortedFlights.length,
      },
    });
  } catch (error: any) {
    console.error('Flight search error:', error);
    return NextResponse.json(
      { error: 'Failed to search flights' },
      { status: 500 }
    );
  }
}
