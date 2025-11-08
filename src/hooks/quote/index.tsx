import { useCallback, useEffect, useRef, useState } from "react";
import type { QuoteData } from "../../types";
import quotes from "../../data/quotes.json";
import { useDashboardSettings } from "../../context/DashboardSettingsContext";

export const useQuote = () => {
  const { isQuoteToggled } = useDashboardSettings();

  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const [shouldRender, setShouldRender] = useState(isQuoteToggled);

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

  const handleAnimationEnd = () => {
    if (!isQuoteToggled) setShouldRender(false);
  };

  useEffect(() => {
    // Will only fetch if quote is toggled to avoid unecessary api calls
    if (!hasFetched.current && isQuoteToggled) {
      hasFetched.current = true;
      setShouldRender(true);
      fetchQuote();
    }
  }, [fetchQuote, isQuoteToggled]);

  return {
    quote,
    loading,
    error,
    isQuoteToggled,
    shouldRender,
    handleAnimationEnd,
  };
};
