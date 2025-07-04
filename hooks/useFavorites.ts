import { FAVORITES_STORAGE_KEY } from "@/constants/AppDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
// Only import useFocusEffect if available (for React Navigation/Expo Router)
let useFocusEffect: any = null;
try {
  // Dynamically require to avoid breaking in non-navigation environments
  useFocusEffect = require("@react-navigation/native").useFocusEffect;
} catch {}

export function useFavorites<T extends Record<string, any>>(
  uniqueKey: keyof T = "uuid" as keyof T,
  options?: { refreshOnFocus?: boolean }
) {
  const [favorites, setFavorites] = useState<T[]>([]);

  const loadFavorites = useCallback(() => {
    AsyncStorage.getItem(FAVORITES_STORAGE_KEY).then((favorite) => {
      setFavorites(JSON.parse(favorite ?? "[]"));
    });
  }, []);

  // If refreshOnFocus is true and useFocusEffect is available, use it
  if (options?.refreshOnFocus && useFocusEffect) {
    useFocusEffect(
      useCallback(() => {
        loadFavorites();
      }, [loadFavorites])
    );
  } else {
    useEffect(() => {
      loadFavorites();
    }, [loadFavorites]);
  }

  const isFavorite = useCallback(
    (item: T) => favorites.some((fav) => fav[uniqueKey] === item[uniqueKey]),
    [favorites, uniqueKey]
  );

  const toggleFavorite = useCallback(
    (item: T) => {
      setFavorites((prev) => {
        let data;
        if (prev.some((fav) => fav[uniqueKey] === item[uniqueKey])) {
          data = prev.filter((fav) => fav[uniqueKey] !== item[uniqueKey]);
        } else {
          data = [...prev, item];
        }
        AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(data));
        return data;
      });
    },
    [uniqueKey]
  );

  return { favorites, isFavorite, toggleFavorite };
}
