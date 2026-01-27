import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getCurrentTeam } from "./storage";

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

/**
 * Filters a single resource by team_id. Returns null if the resource doesn't belong to the selected team.
 * @overload
 * @param resource - The resource to filter
 * @param getTeamId - Function to extract team_id from the resource (currentTeam will be fetched automatically)
 * @returns The resource if it belongs to the team, null otherwise
 */
export function filterResourceByTeam<T>(
  resource: T,
  getTeamId: (resource: T) => number | string | undefined
): Promise<T | null>;
/**
 * Filters a single resource by team_id. Returns null if the resource doesn't belong to the selected team.
 * @overload
 * @param resource - The resource to filter
 * @param currentTeam - The currently selected team ID (as string)
 * @param getTeamId - Function to extract team_id from the resource
 * @returns The resource if it belongs to the team, null otherwise
 */
export function filterResourceByTeam<T>(
  resource: T,
  currentTeam: string | null,
  getTeamId: (resource: T) => number | string | undefined
): Promise<T | null>;
export async function filterResourceByTeam<T>(
  resource: T,
  currentTeamOrGetTeamId: string | null | ((resource: T) => number | string | undefined),
  getTeamId?: (resource: T) => number | string | undefined
): Promise<T | null> {
  let currentTeam: string | null;
  let teamIdExtractor: (resource: T) => number | string | undefined;

  // Determine which overload was called
  if (typeof currentTeamOrGetTeamId === 'function') {
    // First overload: (resource, getTeamId)
    currentTeam = await getCurrentTeam();
    teamIdExtractor = currentTeamOrGetTeamId;
  } else {
    // Second overload: (resource, currentTeam, getTeamId)
    currentTeam = currentTeamOrGetTeamId;
    teamIdExtractor = getTeamId!;
  }

  if (!currentTeam) {
    return resource;
  }

  const resourceTeamId = teamIdExtractor(resource);
  if (resourceTeamId === undefined) {
    return resource;
  }

  if (resourceTeamId.toString() !== currentTeam) {
    return null;
  }

  return resource;
}

/**
 * Filters an array of resources by team_id. Returns only resources that belong to the selected team.
 * @overload
 * @param resources - Array of resources to filter
 * @param getTeamId - Function to extract team_id from each resource (currentTeam will be fetched automatically)
 * @returns Array of resources that belong to the team
 */
export function filterResourcesByTeam<T>(
  resources: T[],
  getTeamId: (resource: T) => number | string | undefined
): Promise<T[]>;
/**
 * Filters an array of resources by team_id. Returns only resources that belong to the selected team.
 * @overload
 * @param resources - Array of resources to filter
 * @param currentTeam - The currently selected team ID (as string)
 * @param getTeamId - Function to extract team_id from each resource
 * @returns Array of resources that belong to the team
 */
export function filterResourcesByTeam<T>(
  resources: T[],
  currentTeam: string | null,
  getTeamId: (resource: T) => number | string | undefined
): Promise<T[]>;
export async function filterResourcesByTeam<T>(
  resources: T[],
  currentTeamOrGetTeamId: string | null | ((resource: T) => number | string | undefined),
  getTeamId?: (resource: T) => number | string | undefined
): Promise<T[]> {
  let currentTeam: string | null;
  let teamIdExtractor: (resource: T) => number | string | undefined;

  // Determine which overload was called
  if (typeof currentTeamOrGetTeamId === 'function') {
    // First overload: (resources, getTeamId)
    currentTeam = await getCurrentTeam();
    teamIdExtractor = currentTeamOrGetTeamId;
  } else {
    // Second overload: (resources, currentTeam, getTeamId)
    currentTeam = currentTeamOrGetTeamId;
    teamIdExtractor = getTeamId!;
  }

  if (!currentTeam) {
    return resources;
  }

  return resources.filter((resource) => {
    const resourceTeamId = teamIdExtractor(resource);
    if (resourceTeamId === undefined) {
      return true;
    }
    return resourceTeamId.toString() === currentTeam;
  });
}