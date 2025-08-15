import * as LocalAuthentication from "expo-local-authentication";
import { useState } from "react";

export function useDestructiveAction() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDestructiveAction = async <T>(
    action: () => Promise<T> | T,
    {
      onCancel = () => {},
      promptMessage = "Please confirm",
    }: {
      onCancel?: () => void;
      promptMessage?: string;
    } = {}
  ): Promise<T> => {
    const result = await LocalAuthentication.authenticateAsync({
      cancelLabel: "Undo",
      promptMessage,
    });

    if (!result.success) {
      if (result.error === "user_cancel") {
        onCancel();
      }
      setSuccess(false);
      setError(result.error);
      throw new Error(result.error);
    }

    setSuccess(true);
    return await action();
  };

  return {
    success,
    error,
    handleDestructiveAction,
  };
}
