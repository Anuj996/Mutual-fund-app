import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { baseURL } from "../config";

export default function FundDetailsPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const { token } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`https://api.mfapi.in/mf/${code}`)
      .then((res) => res.json())
      .then(setFund)
      .catch((err) => {
        console.error("Fetch fund error:", err);
        setMessage("❌ Failed to load fund details.");
      });
  }, [code]);

  const saveFund = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setMessage("❌ You must be logged in to save a fund.");
      return;
    }

    const latestNav = fund?.data?.[0]?.nav || "0";

    try {
      const res = await fetch(`${baseURL}/api/funds/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          schemeCode: code,
          schemeName: fund.meta.scheme_name,
          nav: latestNav,
        }),
      });

      const data = await res.json();
      setMessage(res.ok ? "✅ Fund saved successfully!" : data.message || "❌ Failed to save fund.");
    } catch (err) {
      console.error("Save fund error:", err);
      setMessage("❌ Something went wrong. Please try again later.");
    }
  };

  if (!fund) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
      >
        ← Go Back
      </button>

      <h1 className="text-2xl font-bold mb-4 text-blue-700">{fund.meta.scheme_name}</h1>

      {/* ✅ Extended Fund Metadata */}
      <div className="mb-6 text-sm space-y-1">
        <p><strong>Fund House:</strong> {fund.meta.fund_house}</p>
        <p><strong>Scheme Type:</strong> {fund.meta.scheme_type}</p>
        <p><strong>Scheme Category:</strong> {fund.meta.scheme_category}</p>
        <p><strong>Plan:</strong> {fund.meta.plan}</p>
        {fund.meta.isin && <p><strong>ISIN:</strong> {fund.meta.isin}</p>}
        {fund.meta.benchmark && <p><strong>Benchmark:</strong> {fund.meta.benchmark}</p>}
        {fund.meta.launch_date && <p><strong>Launch Date:</strong> {fund.meta.launch_date}</p>}
        {fund.meta.exit_load && <p><strong>Exit Load:</strong> {fund.meta.exit_load}</p>}
        {fund.meta.minimum_investment && <p><strong>Minimum Investment:</strong> ₹{fund.meta.minimum_investment}</p>}
      </div>

      <button
        onClick={saveFund}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Save Fund
      </button>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-blue-700">
          {message}
        </p>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold">NAV History (Latest 5):</h2>
        <ul className="mt-2 space-y-1">
          {fund.data.slice(0, 5).map((entry, index) => (
            <li key={index} className="text-sm">
              {entry.date}: ₹{entry.nav}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
