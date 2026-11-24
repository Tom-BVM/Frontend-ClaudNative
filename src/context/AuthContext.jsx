import { useEffect, useMemo, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { api, setAuthToken } from "../lib/api";
import { AuthContext } from "./authContextInstance";
import { jwtDecode } from "jwt-decode";
import { loginRequest } from "../authConfig";

export default function AuthProvider({ children }) {
  const { instance } = useMsal();

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [role, setRole] = useState(() => localStorage.getItem("role") || "administrador");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // Atrapa el regreso de Microsoft de forma segura
  useEffect(() => {
    instance.handleRedirectPromise().then((response) => {
      if (response) {
        const msalToken = response.accessToken || response.idToken;
        
        setToken(msalToken);
        localStorage.setItem("token", msalToken);
        setAuthToken(msalToken);

        const account = response.account;
        const userData = {
          nombre_usuario: account?.username || account?.name || "admin_microsoft",
          correo: account?.username
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        setRole("administrador");
        localStorage.setItem("role", "administrador");

        // Salto definitivo al home
        window.location.replace("/home");
      }
    }).catch(err => console.error("Error MSAL:", err));
  }, [instance]);

  // Login tradicional de Atlas
  const login = async ({ nombre_usuario, password }) => {
    setLoading(true);
    try {
      const { data } = await api.post("/autenticacion/login", { nombre_usuario, password });
      const newToken = data?.token;
      
      setToken(newToken);
      localStorage.setItem("token", newToken);
      setAuthToken(newToken);
      
      let decodedToken = null;
      try { decodedToken = jwtDecode(newToken); } catch (error) {}
      
      const userData = { nombre_usuario, ...(decodedToken || {}) };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      const r = localStorage.getItem("role") || "administrador";
      setRole(r);
      localStorage.setItem("role", r);
    } finally {
      setLoading(false);
    }
  };

  // Login oficial redireccionando a Microsoft (NO USAMOS POPUP)
  const loginWithMicrosoft = () => {
    instance.loginRedirect(loginRequest);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    instance.logoutRedirect();
  };

  const value = useMemo(
    () => ({ token, user, role, setRole, loading, login, loginWithMicrosoft, logout }),
    [token, user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}