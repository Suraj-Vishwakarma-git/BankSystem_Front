import React, { useEffect, useState } from "react";
import Graph2 from "../Graph2.jsx";
import GraphSilver from "../GraphSilver.jsx";
import Header from "../common/Header.jsx";
import "./Trade.css";

const Trade = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [goldPrice, setGoldPrice] = useState(0);
  const [silverPrice, setSilverPrice] = useState(0);

  // ✅ FORM STATES
  const [asset, setAsset] = useState("GOLD");
  const [quantity, setQuantity] = useState("");
  const [PIN, setPIN] = useState("");

  const [sellAssetType, setSellAssetType] = useState("GOLD");
  const [sellQuantity, setSellQuantity] = useState("");
  const [sellPIN, setSellPIN] = useState("");

  // ✅ BUY API
  const buyAsset = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!quantity || quantity <= 0) {
        alert("Enter valid quantity");
        return;
      }

      if (!PIN || PIN.length !== 4) {
        alert("Enter valid 4-digit PIN");
        return;
      }

      const res = await fetch("http://localhost:3000/api/stock/buyasset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset,
          quantity: Number(quantity),
          PIN: Number(PIN),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Buy failed");
        return;
      }
      console.log(data);
      alert(data.message);

      // ✅ refresh portfolio instantly
      fetchPortfolio();

      // ✅ reset inputs
      setQuantity("");
      setPIN("");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const sellAsset = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!sellQuantity || sellQuantity <= 0) {
      alert("Enter valid quantity");
      return;
    }

    if (!sellPIN || sellPIN.length !== 4) {
      alert("Enter valid 4-digit PIN");
      return;
    }

    const res = await fetch("http://localhost:3000/api/stock/sellasset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        asset: sellAssetType,
        quantity: Number(sellQuantity),
        PIN: Number(sellPIN),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Sell failed");
      return;
    }

    alert(`Sold successfully\nProfit: ₹${data.data.profit}`);

    // ✅ refresh portfolio
    fetchPortfolio();

    // ✅ reset inputs
    setSellQuantity("");
    setSellPIN("");

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};

  // ✅ FETCH PORTFOLIO
  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:3000/api/stock/getPortfolio",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);

      setPortfolio(data.data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ POLLING
  useEffect(() => {
    fetchPortfolio();

    const interval = setInterval(() => {
      fetchPortfolio();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ✅ STATES
  if (loading) return <div className="center">Loading...</div>;
  if (error) return <div className="center error">{error}</div>;

  if (!portfolio || portfolio.holdings.length === 0) {
    return (
      <div className="center">
        <h2>No Holdings Yet</h2>
        <p>Start investing 🚀</p>
      </div>
    );
  }

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <Header />
      </header>

      {/* SUMMARY */}
      <div className="summary">

        <div className="card big">
          <p>Total Value</p>
          <h2>₹ {portfolio.totalCurrentValue.toLocaleString()}</h2>
        </div>

        <div className="card">
          <p>Balance</p>
          <h3>₹ {portfolio.balance.toLocaleString()}</h3>
        </div>

        <div className="card">
          <p>P&L</p>
          <h3 className={portfolio.totalProfitLoss >= 0 ? "profit" : "loss"}>
            ₹ {portfolio.totalProfitLoss.toLocaleString()}
          </h3>
        </div>

      </div>

      <div className="oneBox">

        {/* CHARTS */}
        <div className="charts">

          <div className="card chart">
            <h3>Gold</h3>
            <Graph2 setGoldprice={setGoldPrice} />
          </div>

          <div className="card chart">
            <h3>Silver</h3>
            <GraphSilver setSilverPrice={setSilverPrice} />
          </div>

        </div>

        {/* HOLDINGS + BUY/SELL */}
        <div className="buySell">

          {/* HOLDINGS */}
          <div className="holdings">
            <h2>Your Holdings</h2>

            <div className="grid">
              {portfolio.holdings.map((item) => (
                <div key={item._id} className="holding">

                  <div className="top">
                    <h3>{item.asset}</h3>
                    <span className={item.profitLoss >= 0 ? "profit" : "loss"}>
                      {item.profitLoss >= 0 ? "▲" : "▼"}
                    </span>
                  </div>

                  <div className="info">
                    <p>Qty: {item.totalQuantity}</p>
                    <p>Avg: ₹ {item.avgPrice.toFixed(2)}</p>
                    <p>LTP: ₹ {item.currentPrice.toFixed(2)}</p>
                  </div>

                  <div className="bottom">
                    <h3 className={item.profitLoss >= 0 ? "profit" : "loss"}>
                      ₹ {item.profitLoss.toLocaleString()}
                    </h3>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* BUY + SELL */}
          <div className="BuyAndSell">

            {/* BUY */}
            <div className="trade-card buy">

              <h2>Buy Asset</h2>

              <div className="input-group">
                <label>Asset</label>
                <select
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                >
                  <option value="GOLD">Gold</option>
                  <option value="SILVER">Silver</option>
                </select>
              </div>

              <div className="input-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  placeholder="Enter quantity"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>PIN</label>
                <input
                  type="password"
                  value={PIN}
                  placeholder="Enter PIN"
                  onChange={(e) => setPIN(e.target.value)}
                />
              </div>

              <button className="buy-btn full" onClick={buyAsset}>
                Buy Now
              </button>

            </div>

            {/* SELL (UI only for now) */}
            <div className="trade-card sell">

              <h2>Sell Asset</h2>

              <div className="input-group">
                <label>Asset</label>
                <select onChange={(e)=>setSellAssetType(e.target.value)}>
                  <option value="GOLD">Gold</option>
                  <option value="SILVER">Silver</option>
                </select>
              </div>

              <div className="input-group">
                <label>Quantity</label>
                <input type="number" placeholder="Enter quantity" onChange={(e)=>setSellQuantity(e.target.value)} />
              </div>

              <div className="input-group">
                <label>PIN</label>
                <input type="password" placeholder="Enter PIN" onChange={(e)=>setSellPIN(e.target.value)} />
              </div>

              <button className="sell-btn full" onClick={sellAsset}>
                Sell Now
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Trade;