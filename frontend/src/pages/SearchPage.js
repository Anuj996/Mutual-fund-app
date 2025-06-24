import { useState } from "react";
import { Link } from "react-router-dom";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFunds = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.mfapi.in/mf/search?q=${query}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Search Mutual Funds
      </h1>

      <div className="flex justify-center mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-80 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter fund name..."
        />
        <button
          onClick={searchFunds}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg transition duration-200"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-center text-blue-600">Searching...</p>}

      <ul className="max-w-2xl mx-auto space-y-4">
        {results.map((fund) => (
          <li
            key={fund.schemeCode}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-200"
          >
            <Link
              to={`/fund/${fund.schemeCode}`}
              className="text-lg text-blue-600 hover:underline"
            >
              {fund.schemeName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
