// src/_core/hooks/useAuth.ts
import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example: check localStorage or token validity
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  return { isAuthenticated, loading };
}
