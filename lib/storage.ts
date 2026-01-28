import { TEAM_STORAGE_KEY } from "@/constants/StorageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getCurrentTeam(apply?: (team: string | null) => void) {
  const team = await AsyncStorage.getItem(TEAM_STORAGE_KEY);
  apply?.(team);
  return team;
}
