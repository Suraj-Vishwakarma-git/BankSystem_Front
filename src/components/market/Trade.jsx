import React, { useState } from "react";
import Graph2 from "../Graph2.jsx";
import GraphSilver from "../GraphSilver.jsx";
import Header from "../common/Header.jsx";
import { useLoading } from "../../context/LoadingContext.jsx";
import "./Trade.css";

const Trade = () => {
  const [asset, setAsset] = useState("GOLD"); // ✅ default
  const [quantity, setQuantity] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [Goldprice,setGoldprice]=useState(0);
   const [Silverprice,setSilverprice]=useState(0);
 
 

  const { loading, setLoading } = useLoading(); // ✅ correct usage

  async function currentPrice() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      if (!quantity || quantity <= 0) {
        throw new Error("Enter valid quantity");
      }

      const res = await fetch(
        "http://localhost:3000/api/stock/currentprice",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            asset,
            quantity: Number(quantity), // ✅ FIX
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header />

      <div className="graph">
        <div className="GoldGraph">
      <h2>Gold</h2><br></br>
      <Graph2 setGoldprice={setGoldprice}/>
      </div>
      
      <div className="SilverGraph">
      <h2>Silver</h2><br></br>
      <GraphSilver setSilverprice={setSilverprice} />
  </div>
  </div>

      {/* TRADE CARD */}
      <div className="trade-card">
        <h2>Trade Assets</h2>

        <div className="form-group">
          <label>Asset</label>
          <select value={asset} onChange={(e) => setAsset(e.target.value)}>
            <option value="GOLD">Gold</option>
            <option value="SILVER">Silver</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button className="button" onClick={currentPrice} disabled={loading}>
          {loading ? "Calculating..." : "Get Price"}
        </button>

        {/* ERROR */}
        {error && <div className="error">{error}</div>}

        {/* RESULT */}
        {result && (
          <div className="result">
            <p><strong>Asset:</strong> {result.asset}</p>
            <p><strong>Price per Unit:</strong> ₹{result.pricePerUnit}</p>
            <p><strong>Quantity:</strong> {result.quantity}</p>
            <p className="total">
              Total: ₹{result.totalAmount}
            </p>
          </div>
        )}
      </div>

      <div className="portfolio"></div>
    </div>
  );
};

export default Trade;