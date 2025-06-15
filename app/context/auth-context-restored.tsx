"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  roles: string[];
  setRoles: (roles: string[]) => void;
  fetchUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  roles: [],
  setRoles: () => {},
  fetchUser: async () => {},
  loading: true,
});

const getCookieValue = (name: string): string => {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift()!;
  return "";
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const token = getCookieValue("XSRF-TOKEN");

      const res = await fetch("http://localhost:8000/api/me-legacy", {
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": token,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? data);
        setRoles(data.roles ?? []);
      } else if (res.status === 401) {
        setUser(null);
        setRoles([]);
      } else {
        console.error("Unexpected error fetching user", res.status);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        roles,
        setRoles,
        fetchUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
