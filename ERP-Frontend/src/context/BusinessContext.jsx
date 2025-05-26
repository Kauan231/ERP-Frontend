// context/BusinessContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export const BusinessContext = createContext();

export function BusinessProvider({ children }) {
  //Auth
  const { user } = useContext(AuthContext);
  const [currentBusiness, setCurrentBusiness] = useState(null);


  const getBusinesses = async () => {
    const res = await fetch("https://localhost:7011/User/Businesses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(user.token).token}`
      }
    });

    if (!res.ok) {
      console.error("Erro ao buscar dados:", res.status);
      if (res.status === 404) {
        setCurrentBusiness(null);
      }
      return;
    }

    let results = await res.json();
    return setCurrentBusiness(results[0].id);
    //return results.map(result => result.id);
  }

  useEffect(() => {
    if (currentBusiness == null) {
      let results = getBusinesses();
      setCurrentBusiness(results[0]);
    }
  }, []);

  return (
    <BusinessContext.Provider value={{ currentBusiness, setCurrentBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
}
