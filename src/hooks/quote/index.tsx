import { useCallback, useEffect, useRef, useState } from "react";
import type { QuoteData } from "../../types";
import quotes from "../../data/quotes.json";

export const useQuote = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const getRandomQuote = useCallback((): QuoteData => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }, []);

  const fetchQuote = useCallback(async () => {
    try {
      hasFetched.current = false;
      setLoading(true);
      setError(null);

      // Simulate async fetch
      await new Promise((resolve) => setTimeout(resolve, 300));

      const randomQuote = getRandomQuote();
      if (!randomQuote) throw new Error("No quotes available");

      setQuote(randomQuote);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [getRandomQuote]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchQuote();
    }
  }, [fetchQuote]);

  return { quote, loading, error };
};
