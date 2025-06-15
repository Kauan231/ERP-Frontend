// context/BusinessContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const BusinessContext = createContext();

export function BusinessProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [currentBusiness, setCurrentBusiness] = useState(undefined);
  const [businesses, setBusinesses] = useState([]);

  const getBusinesses = async () => {
    if (!user || !user.token) {
      console.warn("Usuário não autenticado.");
      return;
    }

    try {
      const res = await fetch("https://localhost:7011/User/Businesses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${JSON.parse(user.token).token}`
        }
      });

      if (!res.ok) {
        console.error("Erro ao buscar empresas:", res.status);
        if (res.status === 404) {
          setCurrentBusiness(undefined);
        }
        return;
      }

      const results = await res.json();
      console.log("Empresas obtidas:", results);
      setBusinesses(results);

      const localBusiness = localStorage.getItem("currentBusinessId");

      if (!localBusiness && results.length > 0) {
        localStorage.setItem("currentBusinessId", results[0].id);
        setCurrentBusiness(results[0].id);
      } else {
        setCurrentBusiness(localBusiness);
      }

    } catch (err) {
      console.error("Erro de rede ao buscar empresas:", err);
    }
  };

  useEffect(() => {
    const localBusiness = localStorage.getItem("currentBusinessId");

    if (!localBusiness || businesses.length == 0) {
      if (user && user.token) {
        getBusinesses();
      }
    } else {
      setCurrentBusiness(localBusiness);
    }
  }, []);

  useEffect(() => {
    if (currentBusiness !== undefined) {
      localStorage.setItem("currentBusinessId", currentBusiness);
    }
  }, [currentBusiness]);

  return (
    <BusinessContext.Provider value={{ currentBusiness, businesses, setCurrentBusiness, getBusinesses }}>
      {children}
    </BusinessContext.Provider>
  );
}
