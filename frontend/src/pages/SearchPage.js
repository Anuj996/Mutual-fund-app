import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundDetails, setFundDetails] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setFundDetails(null);
    }
  }, [query]);

  const fetchFundDetails = async (code) => {
    try {
      const res = await fetch(`https://api.mfapi.in/mf/${code}`);
      const data = await res.json();
      setFundDetails(data);
    } catch (err) {
      console.error("Details fetch error:", err);
    }
  };

  const handleFundClick = (fund) => {
    setSelectedFund(fund);
    fetchFundDetails(fund.schemeCode);
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

      {fundDetails && (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            {fundDetails.meta.scheme_name}
          </h2>
          <p><strong>Fund House:</strong> {fundDetails.meta.fund_house}</p>
          <p><strong>Scheme Type:</strong> {fundDetails.meta.scheme_type}</p>
          <p><strong>Scheme Category:</strong> {fundDetails.meta.scheme_category}</p>
          <p><strong>Latest NAV:</strong> ₹{fundDetails.data[0]?.nav}</p>
          <p><strong>Last Updated:</strong> {fundDetails.data[0]?.date}</p>
        </div>
      )}
    </div>
  );
}
