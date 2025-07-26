import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUrl(url: string) {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url.trim());
}

export function groupBy<T, K extends keyof any>(
  list: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return list.reduce((acc, item) => {
    const key = getKey(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

export function getDirtyData<T>(
  data: T,
  dirtyFields: Record<string, boolean>
): Partial<T> {
  return Object.keys(dirtyFields).reduce((acc, key) => {
    if (dirtyFields[key]) {
      acc[key as keyof T] = data[key as keyof T];
    }
    return acc;
  }, {} as Partial<T>);
}
