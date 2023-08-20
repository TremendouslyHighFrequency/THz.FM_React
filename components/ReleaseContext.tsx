import React, { createContext, useContext, ReactNode, useState } from 'react';

// Define the shape of the context
interface ReleaseContextType {
  data: ReleaseItem | null;
  setData: React.Dispatch<React.SetStateAction<ReleaseItem | null>>;
}

// Create the context with a default value
const ReleaseContext = createContext<ReleaseContextType | undefined>(undefined);

// Create a Provider component
interface ReleaseProviderProps {
  children: ReactNode;
}

export const ReleaseProvider: React.FC<ReleaseProviderProps> = ({ children }) => {
  const [data, setData] = useState<ReleaseItem | null>(null);

  return (
    <ReleaseContext.Provider value={{ data, setData }}>
      {children}
    </ReleaseContext.Provider>
  );
};

// Create a custom hook to use this context
export const useReleaseData = (): ReleaseContextType => {
  const context = useContext(ReleaseContext);
  if (!context) {
    throw new Error('useReleaseData must be used within a ReleaseProvider');
  }
  return context;
};
