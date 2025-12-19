import { useEffect, useRef, useCallback } from "react";

interface UseFormPersistOptions<T> {
  key: string;
  values: T;
  onRestore: (values: T) => void;
  debounceMs?: number;
}

export function useFormPersist<T extends Record<string, any>>({
  key,
  values,
  onRestore,
  debounceMs = 500,
}: UseFormPersistOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasRestoredRef = useRef(false);
  const initialValuesRef = useRef(values);

  // Serialize values, converting Date objects to ISO strings
  const serialize = useCallback((data: T): string => {
    return JSON.stringify(data, (_, value) => {
      if (value instanceof Date) {
        return { __type: "Date", value: value.toISOString() };
      }
      return value;
    });
  }, []);

  // Deserialize values, converting ISO strings back to Date objects
  const deserialize = useCallback((json: string): T | null => {
    try {
      return JSON.parse(json, (_, value) => {
        if (value && typeof value === "object" && value.__type === "Date") {
          return new Date(value.value);
        }
        return value;
      });
    } catch {
      return null;
    }
  }, []);

  // Check if values have changed from initial state
  const hasChanges = useCallback((): boolean => {
    const current = serialize(values);
    const initial = serialize(initialValuesRef.current);
    return current !== initial;
  }, [values, serialize]);

  // Restore saved data on mount
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    const saved = localStorage.getItem(key);
    if (saved) {
      const restored = deserialize(saved);
      if (restored) {
        onRestore(restored);
      }
    }
  }, [key, deserialize, onRestore]);

  // Debounced save to localStorage
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (hasChanges()) {
        localStorage.setItem(key, serialize(values));
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, values, serialize, debounceMs, hasChanges]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges()) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  // Clear saved data (call after successful submission)
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(key);
    initialValuesRef.current = values;
  }, [key, values]);

  return { clearSavedData };
}
