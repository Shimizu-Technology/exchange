import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  MARKETPLACE_AREAS,
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_CONDITIONS,
} from "../../shared/marketplace-constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number): string {
  if (cents === 0) return "Free — just take it";
  return `$${(cents / 100).toFixed(0)}`;
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export const CATEGORIES = ["All", ...MARKETPLACE_CATEGORIES] as const;

export const AREAS = MARKETPLACE_AREAS;

export const CONDITIONS = MARKETPLACE_CONDITIONS;
