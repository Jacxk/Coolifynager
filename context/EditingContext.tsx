import { createContext, useContext, useState } from "react";

const EditingContext = createContext<{
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}>({
  isEditing: false,
  setIsEditing: () => {},
});

export const EditingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <EditingContext.Provider value={{ isEditing, setIsEditing }}>
      {children}
    </EditingContext.Provider>
  );
};

export const useEditing = () => useContext(EditingContext);
