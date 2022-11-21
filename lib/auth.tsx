import { createContext, useState, useEffect, useContext } from "react";
import { getAuth, User } from "firebase/auth";
import nookies from "nookies";
import { firebaseClient, firebaseClientAuth } from "../firebase/firebaseClient";

const AuthContext = createContext<{ user: User | null }>({
  user: null,
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).nookies = nookies;
    }
    return firebaseClientAuth.onIdTokenChanged(async (user) => {
      // console.log(`token changed!`);
      if (!user) {
        // console.log(`no token found...`);
        setUser(null);
        nookies.destroy(null, "token");
        nookies.set(undefined, 'token', '', {path: '/'})
        return;
      }
      // console.log(`updating token...`);
      const token = await user.getIdToken();
      setUser(user);
      nookies.destroy(null, "token");
      nookies.set(null, "token", token, {path: '/'});
    });
  },[]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}
