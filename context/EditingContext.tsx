import { createContext, useContext, useState } from "react";

const EditingContext = createContext<{
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  isEditingDetails: boolean;
  setIsEditingDetails: (isEditingDetails: boolean) => void;
}>({
  isEditing: false,
  setIsEditing: () => {},
  isEditingDetails: false,
  setIsEditingDetails: () => {},
});

export function EditingProvider({ children }: { children: React.ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  return (
    <EditingContext.Provider
      value={{ isEditing, setIsEditing, isEditingDetails, setIsEditingDetails }}
    >
      {children}
    </EditingContext.Provider>
  );
}

export const useEditing = () => useContext(EditingContext);
