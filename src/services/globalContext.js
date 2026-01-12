import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  const [currentUserName, setCurrentUserName] = useState(null);

  return (
    <GlobalContext.Provider value={{
      events, setEvents, currentUserName, setCurrentUserName
    }}>
      {children}
    </GlobalContext.Provider>
  );
};