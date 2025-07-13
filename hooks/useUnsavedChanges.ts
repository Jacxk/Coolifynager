import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner-native";

type UnsavedChangesProps<T> = {
  isDirty: boolean;
  onSave: () => void;
  onCancel: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  onLostFocus?: () => void;
  onFocus?: () => void;
};

export function useUnsavedChanges<T>({
  isDirty,
  onSave,
  onCancel,
  onOpen,
  onClose,
  onLostFocus,
  onFocus,
}: UnsavedChangesProps<T>) {
  const toastId = useRef<string | number | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      onFocus?.();
      return () => {
        if (toastId.current) toast.dismiss(toastId.current);
        toastId.current = undefined;
        onLostFocus?.();
      };
    }, [])
  );

  useEffect(() => {
    if (isDirty && !toastId.current) {
      const newToastId = toast("You have unsaved changes", {
        dismissible: false,
        description: "Save your changes or cancel to discard them.",
        duration: Infinity,
        action: {
          label: "Save",
          onClick: onSave,
        },
        cancel: {
          label: "Cancel",
          onClick: onCancel,
        },
      });
      toastId.current = newToastId;
      onOpen?.();
      setIsOpen(true);
    } else if (!isDirty && toastId.current) {
      toast.dismiss(toastId.current);
      toastId.current = undefined;
      onClose?.();
      setIsOpen(false);
    }
  }, [isDirty]);

  return isOpen;
}
