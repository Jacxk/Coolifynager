import { FAVORITES_STORAGE_KEY } from "@/constants/AppDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { toast } from "sonner-native";

export function useFavorites<T extends Record<string, any>>(
  uniqueKey: keyof T = "uuid" as keyof T
) {
  const [favorites, setFavorites] = useState<T[]>([]);

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
    (item: T) => favorites.some((fav) => fav[uniqueKey] === item[uniqueKey]),
    [favorites, uniqueKey]
  );

  const toggleFavorite = useCallback(
    async (item: T) => {
      const favoriteString = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      const prev: T[] = JSON.parse(favoriteString ?? "[]");
      let data;
      if (prev.some((fav) => fav[uniqueKey] === item[uniqueKey])) {
        toast.success(`${item.name} removed from favorites`);
        data = prev.filter((fav) => fav[uniqueKey] !== item[uniqueKey]);
      } else {
        toast.success(`${item.name} added to favorites`);
        data = [...prev, item];
      }
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(data));
      setFavorites(data);
    },
    [uniqueKey]
  );

  return { favorites, isFavorite, toggleFavorite };
}
