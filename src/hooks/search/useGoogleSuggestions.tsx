import { useState, useEffect, useCallback, useRef } from "react";

// Type definitions
interface GoogleSuggestionsOptions {
  enabled?: boolean;
  debounceMs?: number;
  minLength?: number;
  maxResults?: number;
}

interface GoogleSuggestionsResult {
  suggestions: string[];
  loading: boolean;
  error: string | null;
  clearSuggestions: () => void;
}

// Google API response type
type GoogleSuggestionsResponse = [
  string,
  string[],
  string[],
  { [key: string]: string }[]
];

const useGoogleSuggestions = (
  query: string,
  options: GoogleSuggestionsOptions = {}
): GoogleSuggestionsResult => {
  const {
    enabled = true,
    debounceMs = 300,
    minLength = 2,
    maxResults = 10,
  } = options;

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(
    async (searchQuery: string): Promise<void> => {
      if (!searchQuery || searchQuery.length < minLength) {
        setSuggestions([]);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        // Using CORS proxy or direct call (may need CORS handling)
        const response = await fetch(
          `/api/suggestions?client=firefox&q=${encodeURIComponent(
            searchQuery
          )}`,
          {
            signal: abortControllerRef.current.signal,
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: GoogleSuggestionsResponse = await response.json();

        // Google returns [query, [suggestions], ...other_data]
        const suggestions = data[1]?.slice(0, maxResults) || [];
        setSuggestions(suggestions);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [minLength, maxResults]
  );

  // Debounced search effect
  useEffect(() => {
    if (!enabled || !query) {
      setSuggestions([]);
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, enabled, fetchSuggestions, debounceMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const clearSuggestions = useCallback((): void => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    loading,
    error,
    clearSuggestions,
  };
};

export default useGoogleSuggestions;
export type { GoogleSuggestionsOptions, GoogleSuggestionsResult };
