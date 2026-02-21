import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const CATEGORIES = [
  "All",
  "Jewelry & Watches",
  "Clothes & Accessories",
  "Electronics",
  "Furniture & Home",
  "Books & Media",
  "Gifts & Misc",
  "Stuff They Left Behind",
] as const;

export const AREAS = [
  "Dededo", "Yigo", "Tamuning", "Tumon", "Hagatna",
  "Mangilao", "Barrigada", "Chalan Pago", "Sinajana",
  "Agana Heights", "Mongmong-Toto-Maite", "Asan", "Piti",
  "Santa Rita", "Agat", "Talofofo", "Inarajan", "Merizo", "Umatac",
] as const;

export const CONDITIONS = [
  "New",
  "Like New",
  "Good",
  "Fair",
  "It's Been Through a Lot",
] as const;
