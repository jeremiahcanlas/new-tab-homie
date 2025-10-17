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
        "relative max-w-2xl w-[100%] mt-20 shadow-outline mx-auto" +
        (isSearchToggled ? " animate-fade-in" : " animate-slide-out-right")
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
