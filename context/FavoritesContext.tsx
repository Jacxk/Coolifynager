import { ResourceType } from "@/api/types/resources.types";
import { FAVORITES_STORAGE_KEY } from "@/constants/AppDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner-native";

export type FavoriteResource = {
  uuid: string;
  type: ResourceType;
};

type FavoritesContextType = {
  favorites: FavoriteResource[];
  isFavorite: (uuid: string) => boolean;
  toggleFavorite: (params: FavoriteResource) => Promise<void>;
  removeFavorite: (uuid: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: async () => {},
  removeFavorite: async () => {},
});

async function _getFavorites(): Promise<FavoriteResource[]> {
  const favoriteString = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
  return JSON.parse(favoriteString ?? "[]");
}

async function _setFavorites(favorites: FavoriteResource[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

async function sendToast({
  action,
  typeLabel,
  params,
  setFavorites,
}: {
  action: "add" | "remove";
  typeLabel: string;
  params: FavoriteResource;
  setFavorites: (favorites: FavoriteResource[]) => void;
}) {
  let toastId: string | number | null = null;

  if (action === "add") {
    toastId = toast.success(`${typeLabel} added to favorites`, {
      action: {
        label: "Undo",
        onClick: async () => {
          const current = await _getFavorites();
          const data = current.filter((fav) => fav.uuid !== params.uuid);

          await _setFavorites(data);
          setFavorites(data);

          if (toastId) toast.dismiss(toastId);
        },
      },
    });
  } else {
    toastId = toast.info(`${typeLabel} removed from favorites`, {
      action: {
        label: "Undo",
        onClick: async () => {
          const current = await _getFavorites();
          const data = [...current, params];

          await _setFavorites(data);
          setFavorites(data);

          if (toastId) toast.dismiss(toastId);
        },
      },
    });
  }
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<FavoriteResource[]>([]);

  useEffect(() => {
    _getFavorites().then(setFavorites);
  }, []);

  const isFavorite = useCallback(
    (uuid: string) => favorites.some((fav) => fav.uuid === uuid),
    [favorites]
  );

  const toggleFavorite = useCallback(async (params: FavoriteResource) => {
    const { uuid, type } = params;
    const prev = await _getFavorites();
    let data;
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

    if (prev.some((fav) => fav.uuid === uuid && fav.type === type)) {
      data = prev.filter((fav) => !(fav.uuid === uuid && fav.type === type));
      sendToast({ action: "remove", typeLabel, params, setFavorites });
    } else {
      data = [...prev, { uuid, type }];
      sendToast({ action: "add", typeLabel, params, setFavorites });
    }

    await _setFavorites(data);
    setFavorites(data);
  }, []);

  const removeFavorite = useCallback(async (uuid: string) => {
    const prev = await _getFavorites();
    const data = prev.filter((fav) => fav.uuid !== uuid);
    await _setFavorites(data);
    setFavorites(data);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  return useContext(FavoritesContext);
}
