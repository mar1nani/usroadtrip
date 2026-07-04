import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, onAuthStateChange, signInWithMagicLink, signOut } from "../services/supabase/auth";
import { syncAll } from "../services/supabaseSync";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      if (u) syncAll();
    });

    const unsubscribe = onAuthStateChange((u) => {
      setUser(u);
      if (u) syncAll();
    });

    function handleOnline() {
      syncAll();
    }
    window.addEventListener("online", handleOnline);

    return () => {
      unsubscribe();
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInWithMagicLink, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
