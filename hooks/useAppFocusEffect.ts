import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

/**
 * Custom hook that runs an effect when the app becomes active (gains focus)
 * Similar to useFocusEffect but for app-level focus changes
 *
 * @param callback - Function to run when app becomes active
 * @param deps - Dependency array (optional)
 */
export function useAppFocusEffect(callback: () => void) {
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        callback();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription?.remove();
    };
  }, []);
}
