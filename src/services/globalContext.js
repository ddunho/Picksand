import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  return (
    <GlobalContext.Provider value={{
      events, setEvents
    }}>
      {children}
    </GlobalContext.Provider>
  );
};