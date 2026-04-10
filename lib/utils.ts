import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function calculateDuration(start: string, end: string): string {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const startMins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  const duration = endMins - startMins;
  const hours = Math.floor(duration / 60);
  const mins = duration % 60;
  return `${hours}h ${mins}m`;
}

export function generateShareToken(): string {
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

export function getDayPeriod(time: string): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function estimateCarbonFootprint(distance: number, mode: 'flight' | 'car' | 'train' = 'flight'): number {
  const factors = {
    flight: 0.255,
    car: 0.171,
    train: 0.041,
  };
  return distance * factors[mode];
}

export function calculateBudgetSplit(budget: number): { category: string; amount: number; percentage: number }[] {
  return [
    { category: 'Stay', amount: budget * 0.4, percentage: 40 },
    { category: 'Food', amount: budget * 0.3, percentage: 30 },
    { category: 'Activities', amount: budget * 0.2, percentage: 20 },
    { category: 'Transport', amount: budget * 0.1, percentage: 10 },
  ];
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function groupActivitiesByPeriod(activities: { startTime: string; [key: string]: any }[]): {
  morning: any[];
  afternoon: any[];
  evening: any[];
  night: any[];
} {
  return activities.reduce(
    (acc, activity) => {
      const period = getDayPeriod(activity.startTime);
      acc[period].push(activity);
      return acc;
    },
    { morning: [], afternoon: [], evening: [], night: [] } as {
      morning: any[];
      afternoon: any[];
      evening: any[];
      night: any[];
    }
  );
}
