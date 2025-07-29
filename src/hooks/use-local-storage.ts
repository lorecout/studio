"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./use-auth";

function useLocalStorageWithUser<T>(
  key: string,
  initialValue: T,
  userId: string | null
): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  const userKey = userId ? `${key}_${userId}` : null;

  useEffect(() => {
    if (!userKey) {
        setLoading(false);
        setStoredValue(initialValue);
        return;
    };
    try {
      setLoading(true);
      const item = window.localStorage.getItem(userKey);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error(error);
      setStoredValue(initialValue);
    } finally {
      setLoading(false);
    }
  }, [userKey, initialValue]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (!userKey) return;
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(userKey, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    },
    [userKey, storedValue]
  );

  return [storedValue, setValue, loading];
}


export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, boolean] {
    const { user, loading: authLoading } = useAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const stableInitialValue = useCallback(() => initialValue, []);
    
    const [value, setValue, dataLoading] = useLocalStorageWithUser(key, stableInitialValue(), user?.uid ?? null);

    const isLoading = authLoading || dataLoading;

    return [value, setValue, isLoading];
}
