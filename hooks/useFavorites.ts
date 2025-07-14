import { FAVORITES_STORAGE_KEY } from "@/constants/AppDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { toast } from "sonner-native";

export type FavoriteResource = {
  uuid: string;
  type: "application" | "database" | "service" | "project" | "server" | "team";
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteResource[]>([]);

  const loadFavorites = useCallback(() => {
    AsyncStorage.getItem(FAVORITES_STORAGE_KEY).then((favorite) => {
      setFavorites(JSON.parse(favorite ?? "[]"));
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const isFavorite = useCallback(
    (item: FavoriteResource) =>
      favorites.some((fav) => fav.uuid === item.uuid && fav.type === item.type),
    [favorites]
  );

  const toggleFavorite = useCallback(async (item: FavoriteResource) => {
    const favoriteString = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    const prev: FavoriteResource[] = JSON.parse(favoriteString ?? "[]");
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

    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(data));
    setFavorites(data);
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
