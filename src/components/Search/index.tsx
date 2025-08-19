import { useState } from "react";

const Search = (): React.JSX.Element => {
  const [query, setQuery] = useState("");
  //   const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const baseUrl = "https://www.google.com/search";

    window.location.href = `${baseUrl}?q=${encodeURIComponent(query)}`;
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md mt-5">
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-l"
        />
        <button
          type="submit"
          className="px-4 py-2 border border-gray-300 border-l-0  text-current rounded-r hover:bg-gray-700"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default Search;
