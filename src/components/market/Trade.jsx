import React, { useState } from "react";
import Graph2 from "../Graph2.jsx";
import GraphSilver from "../GraphSilver.jsx";
import Header from "../common/Header.jsx";
import { useLoading } from "../../context/LoadingContext.jsx";
import "./Trade.css";

const Trade = () => {
  const [asset, setAsset] = useState("GOLD");
  const [quantity, setQuantity] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [Goldprice, setGoldprice] = useState(0);
  const [Silverprice, setSilverprice] = useState(0);

  const [isAuthorized, setisAuthorized] = useState(false);
  const [authPIN, setauthPIN] = useState("");

  const { loading, setLoading } = useLoading();

  async function currentPrice() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      if (!quantity || quantity <= 0) {
        throw new Error("Enter valid quantity");
      }

      const res = await fetch("http://localhost:3000/api/stock/currentprice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset,
          quantity: Number(quantity),
        }),
      });

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

  async function buyAsset() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/stock/buyasset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        asset,
        quantity,
        PIN: authPIN,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Server Error");
      return;
    }

    alert(data.message);
    setisAuthorized(false);
  }

  return (
    <div className="trade-page">
      <Header />

      {/* DASHBOARD */}
      <div className="dashboard">
        <div className="asset-card">
          <div className="asset-header">
            <h3>Gold</h3>
            <span className="price">₹{(Goldprice*93).toFixed(2) || "--"}</span>
          </div>
          <div className="graph-wrapper">
            <Graph2 setGoldprice={setGoldprice} />
          </div>
        </div>

        <div className="asset-card">
          <div className="asset-header">
            <h3>Silver</h3>
            <span className="price">₹{(Silverprice*93).toFixed(2) || "--"}</span>
          </div>
          <div className="graph-wrapper">
            <GraphSilver setSilverprice={setSilverprice} />
          </div>
        </div>
      </div>

      {/* TRADE PANEL */}
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
              Total: ₹{(result.totalAmount).toFixed(2)}
            </p>
            <button className="button " onClick={()=>setisAuthorized(true)}>Purchase</button>
          </div>
        )}
             {
  isAuthorized && (
    <div className="authorization">
      <div className="auth-card">
        
        <p className="auth-title">Enter PIN</p>
        <p className="auth-sub">Secure your transaction</p>

        <input
          type="password"
          maxLength={4}
          placeholder="••••"
          className="pin-input"
          onChange={(e) => setauthPIN(e.target.value)}
        />

        <button className="process-btn" onClick={buyAsset}>
          Proceed
        </button>
        <button className="cancle-btn" onClick={()=>setisAuthorized(false)}>
          Cancle
        </button>

      </div>
    </div>
  )
}
      </div>
    </div>
  );
};

export default Trade;