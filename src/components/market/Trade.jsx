import React, { useEffect, useState } from "react";
import Graph2 from "../Graph2.jsx";
import GraphSilver from "../GraphSilver.jsx";
import Header from "../common/Header.jsx";
import { useLoading } from "../../context/LoadingContext.jsx";
import "./Trade.css";

const Trade = ({ setNotification }) => {
  const { setLoading } = useLoading();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLocalLoading] = useState(true);
  const [error, setError] = useState("");

  const [goldPrice, setGoldPrice] = useState(0);
  const [silverPrice, setSilverPrice] = useState(0);

  // BUY
  const [asset, setAsset] = useState("GOLD");
  const [quantity, setQuantity] = useState("");
  const [PIN, setPIN] = useState("");

  // SELL
  const [sellAssetType, setSellAssetType] = useState("GOLD");
  const [sellQuantity, setSellQuantity] = useState("");
  const [sellPIN, setSellPIN] = useState("");

  // ✅ BUY API
  const buyAsset = async () => {
    try {
      if (!quantity || quantity <= 0) {
        setNotification({ msg: "Enter valid quantity", type: "error" });
        return;
      }

      if (!PIN || PIN.length !== 4) {
        setNotification({ msg: "Enter valid 4-digit PIN", type: "error" });
        return;
      }

      setLoading(true);

      const token = localStorage.getItem("token");

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
        setNotification({ msg: data.message || "Buy failed", type: "error" });
        return;
      }

      setNotification({ msg: data.message, type: "success" });

      await fetchPortfolio();

      setQuantity("");
      setPIN("");
    } catch (err) {
      console.error(err);
      setNotification({ msg: "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ SELL API
  const sellAsset = async () => {
    try {
      if (!sellQuantity || sellQuantity <= 0) {
        setNotification({ msg: "Enter valid quantity", type: "error" });
        return;
      }

      if (!sellPIN || sellPIN.length !== 4) {
        setNotification({ msg: "Enter valid 4-digit PIN", type: "error" });
        return;
      }

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/stock/sellasset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset: sellAssetType,
          quantity: sellQuantity, // ✅ FIXED
          PIN:sellPIN,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setNotification({ msg: data.message || "Sell failed", type: "error" });
        return;
      }

      setNotification({
        msg: `Sold successfully | Profit: ₹${data.data.profit}`,
        type: "success",
      });

      await fetchPortfolio();

      setSellQuantity("");
      setSellPIN("");
    } catch (err) {
      console.error(err);
      setNotification({ msg: "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
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
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  // ✅ POLLING (no global loading here → avoids flicker)
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
  // if (!portfolio || portfolio.holdings.length === 0) {
  //   return (
  //     <div className="center">
  //       <h2>No Holdings Yet</h2>
  //       <p>Start investing 🚀</p>
  //     </div>
  //   );
  // }

  return (
    <div className="app">
      <header className="header">
        <Header />
      </header>

      <div className="summary">
        <div className="card big">
          <p>Total Value</p>
         <h2>
  ₹ {portfolio?.totalCurrentValue?.toLocaleString() || 0}
</h2>
        </div>

        <div className="card">
          <p>Balance</p>
          <h3>
  ₹ {portfolio?.balance?.toLocaleString() || 0}
</h3>
        </div>

        <div className="card">
          <p>P&L</p>
          <h3
  className={
    (portfolio?.totalProfitLoss || 0) >= 0 ? "profit" : "loss"
  }
>
  ₹ {portfolio?.totalProfitLoss?.toLocaleString() || 0}
</h3>
        </div>
      </div>

      <div className="oneBox">
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

        <div className="buySell">
          <div className="holdings">
            <h2>Your Holdings</h2>

         <div className="grid">
  {loading ? (
    <div className="holding empty">Loading...</div>
  ) : !portfolio?.holdings || portfolio.holdings.length === 0 ? (
    <div className="holding empty">
      <h2>No Holdings Yet</h2>
      <p>Start investing 🚀</p>
    </div>
  ) : (
    portfolio?.holdings?.map((item) => (
      <div key={item._id} className="holding">
        <div className="top">
          <h3>{item.asset}</h3>
          <span
            className={item.profitLoss >= 0 ? "profit" : "loss"}
          >
            {item.profitLoss >= 0 ? "▲" : "▼"}
          </span>
        </div>

        <div className="info">
          <p>Qty: {item.totalQuantity}</p>
          <p>Avg: ₹ {item.avgPrice.toFixed(2)}</p>
          <p>LTP: ₹ {item.currentPrice.toFixed(2)}</p>
        </div>

        <div className="bottom">
          <h3
            className={item.profitLoss >= 0 ? "profit" : "loss"}
          >
            ₹ {item.profitLoss.toLocaleString()}
          </h3>
        </div>
      </div>
    ))
  )}
</div>



          </div>

          {/* BUY + SELL UI unchanged */}
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

            {/* SELL */}
            <div className="trade-card sell">
              <h2>Sell Asset</h2>

              <div className="input-group">
                <label>Asset</label>
                <select
                  onChange={(e) =>
                    setSellAssetType(e.target.value)
                  }
                >
                  <option value="GOLD">Gold</option>
                  <option value="SILVER">Silver</option>
                </select>
              </div>

              <div className="input-group">
                <label>Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  onChange={(e) =>
                    setSellQuantity(e.target.value)
                  }
                />
              </div>

              <div className="input-group">
                <label>PIN</label>
                <input
                  type="password"
                  placeholder="Enter PIN"
                  onChange={(e) =>
                    setSellPIN(e.target.value)
                  }
                />
              </div>

              <button className="sell-btn full" onClick={sellAsset}>
                Sell Now
              </button>
            </div>
          </div>
        </div>
      </div>
   <div className="historyMain">
    <div className="history-title" >
  Transaction History →
</div>
</div>
    </div>
  );
};

export default Trade;