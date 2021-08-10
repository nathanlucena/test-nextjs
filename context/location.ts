import React from 'react';

interface cityLocation {
  coordinates: number[];
  city: string;
}

interface ContextType {
  tempLocation: cityLocation;
  setTempLocation: (e: cityLocation) => void;
}

const locationContext = React.createContext({} as ContextType);

export default locationContext;
