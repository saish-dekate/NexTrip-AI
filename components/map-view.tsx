'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

interface ActivityMarker {
  id: string;
  title: string;
  lat: number;
  lng: number;
  category: string;
  day?: number;
  image?: string;
}

interface MapViewProps {
  activities: ActivityMarker[];
  className?: string;
  showRoute?: boolean;
  destination?: string;
}

const categoryColors: Record<string, string> = {
  hotel: '#3B82F6',
  food: '#F97316',
  visit: '#22C55E',
  transport: '#8B5CF6',
};

export function MapView({ activities, className, showRoute = true }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapRef.current || mapInstance) return;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;

        const map = L.map(mapRef.current!).setView(
          [activities[0]?.lat || 28.6139, activities[0]?.lng || 77.2090],
          12
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        const bounds = L.latLngBounds([]);

        activities.forEach((activity, index) => {
          const color = categoryColors[activity.category] || '#EF4444';
          
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                width: 32px;
                height: 32px;
                background: ${color};
                border: 2px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 12px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              ">
                ${index + 1}
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          L.marker([activity.lat, activity.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`
              <div style="min-width: 150px; padding: 4px;">
                <strong style="font-size: 13px;">${activity.title}</strong>
                <p style="margin: 4px 0 0; font-size: 11px; color: #666; text-transform: capitalize;">
                  ${activity.category} ${activity.day ? `• Day ${activity.day}` : ''}
                </p>
              </div>
            `);

          bounds.extend([activity.lat, activity.lng]);
        });

        if (showRoute && activities.length > 1) {
          const routeCoords = activities.map(a => [a.lat, a.lng] as [number, number]);
          
          L.polyline(routeCoords, {
            color: '#3B82F6',
            weight: 3,
            opacity: 0.7,
            dashArray: '8, 8',
          }).addTo(map);
        }

        if (activities.length > 1) {
          map.fitBounds(bounds, { padding: [40, 40] });
        }

        setMapInstance(map);
      } catch (error) {
        console.error('Map error:', error);
      }
    };

    initMap();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [isMounted, activities, showRoute, mapInstance]);

  if (!isMounted) {
    return (
      <Card className={cn('h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20', className)}>
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden relative', className)}>
      <div ref={mapRef} className="h-[400px] w-full z-0" />
      
      <div className="absolute bottom-4 left-4 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
        <p className="text-xs font-semibold mb-2 text-foreground">Legend</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full border border-white shadow"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs capitalize text-foreground">{category}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-[1000]">
        <Badge variant="secondary" className="shadow-lg">
          {activities.length} stops
        </Badge>
      </div>

      {showRoute && activities.length > 1 && (
        <div className="absolute top-4 left-4 z-[1000]">
          <Badge variant="outline" className="shadow-lg bg-white/90 dark:bg-gray-800/90">
            📍 Route: {activities.length - 1} segments
          </Badge>
        </div>
      )}
    </Card>
  );
}
