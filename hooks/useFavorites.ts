import { FAVORITES_STORAGE_KEY } from "@/constants/AppDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback } from "react";
import { toast } from "sonner-native";

export type FavoriteResource = {
  uuid: string;
  type: "application" | "database" | "service" | "project" | "server" | "team";
};

async function getFavorites(): Promise<FavoriteResource[]> {
  const favoriteString = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
  return JSON.parse(favoriteString ?? "[]");
}

async function setFavorites(favorites: FavoriteResource[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

export function useFavorites() {
  const isFavorite = useCallback(async (item: FavoriteResource) => {
    const favorites = await getFavorites();
    return favorites.some(
      (fav) => fav.uuid === item.uuid && fav.type === item.type
    );
  }, []);

  const toggleFavorite = useCallback(async (item: FavoriteResource) => {
    const prev = await getFavorites();
    let data;
    const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);
    if (prev.some((fav) => fav.uuid === item.uuid && fav.type === item.type)) {
      toast.success(`${typeLabel} removed from favorites`);
      data = prev.filter(
        (fav) => !(fav.uuid === item.uuid && fav.type === item.type)
      );
    } else {
      toast.success(`${typeLabel} added to favorites`);
      data = [...prev, item];
    }
    await setFavorites(data);
  }, []);

  const removeFavorite = useCallback(async (uuid: string) => {
    const prev = await getFavorites();
    const data = prev.filter((fav) => fav.uuid !== uuid);
    await setFavorites(data);
  }, []);

  return {
    getFavorites,
    setFavorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  };
}
