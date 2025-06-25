import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { baseURL } from "../config";

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

        if (!res.ok) throw new Error("Failed to fetch saved funds");

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10 px-6">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-10">
        Your Saved Mutual Funds
      </h1>

      {savedFunds.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          You haven’t saved any mutual funds yet.
        </p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {savedFunds.map((fund) => (
            <div
              key={fund.schemeCode}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
            >
              <Link
                to={`/fund/${fund.schemeCode}`}
                className="text-xl font-semibold text-blue-700 hover:underline block mb-2"
              >
                {fund.schemeName}
              </Link>
              <p className="text-gray-600 text-sm">
                Latest NAV: <span className="font-medium">₹{fund.nav}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
