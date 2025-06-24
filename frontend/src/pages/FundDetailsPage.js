import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { baseURL } from "../config"; // ✅ import live backend URL

export default function FundDetailsPage() {
  const { code } = useParams();
  const [fund, setFund] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetch(`https://api.mfapi.in/mf/${code}`)
      .then((res) => res.json())
      .then(setFund);
  }, [code]);

  const saveFund = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to save a fund.");
      return;
    }

    const latestNav = fund.data?.[0]?.nav || "0";

    try {
      const res = await fetch(`${baseURL}/api/funds/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          schemeCode: code,
          schemeName: fund.meta.scheme_name,
          nav: latestNav,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Fund saved successfully!");
      } else {
        alert(data.message || "❌ Failed to save fund.");
      }
    } catch (err) {
      console.error("Save fund error:", err);
      alert("❌ Something went wrong. Please try again later.");
    }
  };

  if (!fund) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{fund.meta.scheme_name}</h1>
      <button onClick={saveFund} className="bg-green-600 text-white px-4 py-2 rounded">
        Save Fund
      </button>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">NAV History:</h2>
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
