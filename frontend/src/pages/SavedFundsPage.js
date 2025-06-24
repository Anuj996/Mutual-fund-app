import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { baseURL } from "../config"; // ✅ import baseURL from centralized config

export default function SavedFundsPage() {
  const { token } = useContext(AuthContext);
  const [savedFunds, setSavedFunds] = useState([]);

  useEffect(() => {
    const fetchSavedFunds = async () => {
      try {
        const res = await fetch(`${baseURL}/api/funds/saved`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch saved funds");
        }

        const data = await res.json();
        setSavedFunds(data.savedFunds);
      } catch (err) {
        console.error("Error fetching saved funds:", err);
        alert("Unable to load saved funds. Please ensure you're logged in.");
      }
    };

    if (token) fetchSavedFunds();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        Your Saved Mutual Funds
      </h1>

      {savedFunds.length === 0 ? (
        <p className="text-center text-gray-600">No funds saved yet.</p>
      ) : (
        <ul className="max-w-3xl mx-auto space-y-4">
          {savedFunds.map((fund) => (
            <li
              key={fund.schemeCode}
              className="bg-white p-4 shadow rounded hover:shadow-lg transition"
            >
              <Link
                to={`/fund/${fund.schemeCode}`}
                className="text-lg text-blue-600 hover:underline"
              >
                {fund.schemeName}
              </Link>
              <p className="text-sm text-gray-500 mt-1">NAV: ₹{fund.nav}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
