import { useFocusEffect } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { toast } from "sonner-native";

type ConfigurationContextType<T> = {
  configuration: T;
  setConfiguration: (configuration: T) => void;
  updateConfiguration: (updates: Partial<T>) => void;
  openSaveToast: () => void;
  closeSaveToast: (reset?: boolean) => void;
  resetConfiguration: () => void;
  updateInitialValues: (newInitialValues: T) => void;
  hasUnsavedChanges: boolean;
};

const ConfigurationContext = createContext<ConfigurationContextType<any>>({
  configuration: {},
  setConfiguration: () => {},
  updateConfiguration: () => {},
  openSaveToast: () => {},
  closeSaveToast: () => {},
  resetConfiguration: () => {},
  updateInitialValues: () => {},
  hasUnsavedChanges: false,
});

type ConfigurationState<T> = {
  configuration: T;
  initialValues: T;
  toastId: string | number | null;
};

type ConfigurationAction<T> =
  | { type: "SET_CONFIGURATION"; payload: T }
  | { type: "UPDATE_CONFIGURATION"; payload: Partial<T> }
  | { type: "UPDATE_INITIAL_VALUES"; payload: T }
  | { type: "RESET_CONFIGURATION" }
  | { type: "OPEN_TOAST"; payload: string | number }
  | { type: "CLOSE_TOAST" };

function configurationReducer<T>(
  state: ConfigurationState<T>,
  action: ConfigurationAction<T>
): ConfigurationState<T> {
  switch (action.type) {
    case "SET_CONFIGURATION":
      return {
        ...state,
        configuration: action.payload,
      };

    case "UPDATE_CONFIGURATION":
      return {
        ...state,
        configuration: { ...state.configuration, ...action.payload },
      };

    case "UPDATE_INITIAL_VALUES":
      return {
        ...state,
        initialValues: action.payload,
      };

    case "RESET_CONFIGURATION":
      return {
        ...state,
        configuration: state.initialValues,
      };

    case "OPEN_TOAST":
      return {
        ...state,
        toastId: action.payload,
      };

    case "CLOSE_TOAST":
      return {
        ...state,
        toastId: null,
      };

    default:
      return state;
  }
}

export function ConfigurationProvider<T>({
  initialValues,
  children,
  handleSave,
  handleCancel,
  onToastOpen,
  onToastClose,
}: {
  initialValues: T;
  children: React.ReactNode;
  handleSave: (
    configuration: T,
    openSaveToast: () => void,
    closeSaveToast: (reset?: boolean) => void,
    updateInitialValues: (newInitialValues: T) => void
  ) => void;
  handleCancel: () => void;
  onToastOpen: () => void;
  onToastClose: () => void;
}) {
  const [state, dispatch] = useReducer(configurationReducer<T>, {
    configuration: initialValues,
    initialValues,
    toastId: null,
  });

  const closeSaveToastRef = useRef<((reset?: boolean) => void) | null>(null);

  // Derived state
  const hasUnsavedChanges =
    JSON.stringify(state.configuration) !== JSON.stringify(state.initialValues);

  // Update initial values when prop changes
  useEffect(() => {
    dispatch({ type: "UPDATE_INITIAL_VALUES", payload: initialValues });
  }, [initialValues]);

  // Actions
  const setConfiguration = useCallback((configuration: T) => {
    dispatch({ type: "SET_CONFIGURATION", payload: configuration });
  }, []);

  const updateConfiguration = useCallback((updates: Partial<T>) => {
    dispatch({ type: "UPDATE_CONFIGURATION", payload: updates });
  }, []);

  const updateInitialValues = useCallback((newInitialValues: T) => {
    dispatch({ type: "UPDATE_INITIAL_VALUES", payload: newInitialValues });
  }, []);

  const resetConfiguration = useCallback(() => {
    dispatch({ type: "RESET_CONFIGURATION" });
  }, []);

  const closeSaveToast = useCallback(
    (reset: boolean = true) => {
      if (state.toastId) {
        toast.dismiss(state.toastId);
        dispatch({ type: "CLOSE_TOAST" });
        onToastClose();
        if (reset) {
          resetConfiguration();
        }
      }
    },
    [state.toastId, onToastClose, resetConfiguration]
  );

  // Store the latest closeSaveToast for focus effect
  closeSaveToastRef.current = closeSaveToast;

  const openSaveToast = useCallback(() => {
    // Dismiss existing toast if any
    if (state.toastId) {
      toast.dismiss(state.toastId);
    }

    const newToastId = toast("You have unsaved changes", {
      dismissible: false,
      description: "Save your changes or cancel to discard them.",
      duration: Infinity,
      action: {
        label: "Save",
        onClick: () => {
          handleSave(
            state.configuration,
            openSaveToast,
            closeSaveToast,
            updateInitialValues
          );
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          // Reset first, then call handleCancel to prevent race conditions
          dispatch({ type: "RESET_CONFIGURATION" });
          closeSaveToast(false); // Don't reset again since we already did it
          handleCancel();
        },
      },
    });

    dispatch({ type: "OPEN_TOAST", payload: newToastId });
    onToastOpen();
  }, [
    state.toastId,
    state.configuration,
    handleSave,
    handleCancel,
    closeSaveToast,
    updateInitialValues,
    onToastOpen,
  ]);

  // Handle toast visibility based on unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges && !state.toastId) {
      openSaveToast();
    } else if (!hasUnsavedChanges && state.toastId) {
      closeSaveToast(false); // Don't reset when auto-closing
    }
  }, [hasUnsavedChanges, state.toastId, openSaveToast, closeSaveToast]);

  // Close toast when component loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        closeSaveToastRef.current?.(true); // Reset configuration when losing focus
      };
    }, [])
  );

  return (
    <ConfigurationContext.Provider
      value={{
        configuration: state.configuration,
        setConfiguration,
        updateConfiguration,
        openSaveToast,
        closeSaveToast,
        resetConfiguration,
        updateInitialValues,
        hasUnsavedChanges,
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
}

export function useConfiguration<T>() {
  return useContext<ConfigurationContextType<T>>(ConfigurationContext);
}
