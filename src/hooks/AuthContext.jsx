import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  onAuthStateChange,
  signInWithPassword,
  signOut,
  sendPasswordReset,
  updatePassword,
} from "../services/supabase/auth";
import { syncAll } from "../services/supabaseSync";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      if (u) syncAll();
    });

    const unsubscribe = onAuthStateChange((u, event) => {
      setUser(u);
      if (event === "PASSWORD_RECOVERY") {
        setPasswordRecovery(true);
      } else if (u) {
        syncAll();
      }
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

  function clearPasswordRecovery() {
    setPasswordRecovery(false);
  }

  return (
    <AuthContext.Provider
      value={{ user, passwordRecovery, clearPasswordRecovery, signInWithPassword, signOut, sendPasswordReset, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
