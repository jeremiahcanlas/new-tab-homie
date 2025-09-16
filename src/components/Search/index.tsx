import { useSearch } from "../../hooks/search";

const Search = (): React.JSX.Element => {
  const {
    query,
    setQuery,
    handleAnimationEnd,
    handleSubmit,
    shouldRender,
    isSearchToggled,
  } = useSearch();

  if (!shouldRender) return <></>;

  return (
    <form
      onSubmit={handleSubmit}
      className={
        "relative max-w-md mt-5 shadow-outline" +
        (isSearchToggled
          ? " animate-slide-in-right"
          : " animate-slide-out-right")
      }
      role="search-form"
      onAnimationEnd={handleAnimationEnd}
    >
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
