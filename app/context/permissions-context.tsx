"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context";

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface CommunityRole {
  id: number;
  role: string;
  description: string;
}

interface CommunityPermission {
  communityId: number;
  role: CommunityRole;
  permissions: string[];
}

interface PermissionsContextType {
  userPermissions: CommunityPermission[];
  loading: boolean;
  hasPermission: (communityId: number, permission: string) => boolean;
  getUserRole: (communityId: number) => string | null;
  isAdmin: (communityId: number) => boolean;
  isFounder: (communityId: number) => boolean;
  isModerator: (communityId: number) => boolean;
  refreshPermissions: () => Promise<void>;
  getCurrentCommunityId: () => number | null;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

const getCookieValue = (name: string): string => {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()!.split(";").shift()!;
    return decodeURIComponent(cookieValue);
  }
  return "";
};

const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  if (typeof document !== "undefined") {
    await fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include",
    });
  }

  const token = getCookieValue("XSRF-TOKEN");

  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
      ...options.headers,
    },
  });
};

export function PermissionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [userPermissions, setUserPermissions] = useState<CommunityPermission[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchUserPermissions = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(
        "http://localhost:8000/api/user/permissions"
      );

      if (response.ok) {
        const data = await response.json();
        setUserPermissions(data.permissions || []);
      }
    } catch (error) {
      console.error("Error fetching user permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPermissions();
    } else {
      setUserPermissions([]);
      setLoading(false);
    }
  }, [user]);

  const hasPermission = (communityId: number, permission: string): boolean => {
    const communityPermission = userPermissions.find(
      (p) => p.communityId === communityId
    );
    return communityPermission?.permissions.includes(permission) || false;
  };

  const getUserRole = (communityId: number): string | null => {
    const communityPermission = userPermissions.find(
      (p) => p.communityId === communityId
    );
    return communityPermission?.role.role || null;
  };

  const isAdmin = (communityId: number): boolean => {
    const role = getUserRole(communityId);
    return role === "Kurucu" || role === "Yönetici";
  };

  const isFounder = (communityId: number): boolean => {
    const role = getUserRole(communityId);
    return role === "Kurucu";
  };

  const isModerator = (communityId: number): boolean => {
    const role = getUserRole(communityId);
    return role === "Moderatör";
  };
  const refreshPermissions = async () => {
    await fetchUserPermissions();
  };
  const getCurrentCommunityId = (): number | null => {
    // For now, return the first community ID from user permissions
    // In a real app, this might come from URL params or global state
    if (userPermissions.length > 0) {
      return userPermissions[0].communityId;
    }
    return null;
  };

  return (
    <PermissionsContext.Provider
      value={{
        userPermissions,
        loading,
        hasPermission,
        getUserRole,
        isAdmin,
        isFounder,
        isModerator,
        refreshPermissions,
        getCurrentCommunityId,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};

// Safe hook that returns null if not in context (useful for pages that may not need permissions)
export const usePermissionsSafe = () => {
  const context = useContext(PermissionsContext);
  return context || null;
};

// Conditional wrapper that only provides permissions when user is authenticated
export function ConditionalPermissionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (user) {
    return <PermissionsProvider>{children}</PermissionsProvider>;
  }

  return <>{children}</>;
}
