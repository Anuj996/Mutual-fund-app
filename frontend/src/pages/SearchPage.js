import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSearchResults = async (searchText) => {
    if (!searchText.trim()) return setResults([]);
    setLoading(true);
    try {
      const res = await fetch(`https://api.mfapi.in/mf/search?q=${searchText}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleFundClick = (fund) => {
    navigate(`/fund/${fund.schemeCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Search Mutual Funds
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Start typing fund name..."
        />
      </div>

      {loading && <p className="text-center text-blue-600 mb-4">Searching...</p>}

      <ul className="max-w-2xl mx-auto space-y-3">
        {results.map((fund) => (
          <li
            key={fund.schemeCode}
            onClick={() => handleFundClick(fund)}
            className="bg-white cursor-pointer p-4 rounded-lg shadow hover:bg-blue-50 transition duration-200"
          >
            {fund.schemeName}
          </li>
        ))}
      </ul>
    </div>
  );
}
