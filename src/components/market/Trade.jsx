import React, { useEffect, useState } from "react";
import Graph2 from "../Graph2.jsx";
import GraphSilver from "../GraphSilver.jsx";
import Header from "../common/Header.jsx";
import { useLoading } from "../../context/LoadingContext.jsx";
import "./Trade.css";

/* ─── mock data – replace with real API calls ─── */
const MOCK_PORTFOLIO = {
  totalValue: 412850.0,
  todayPnL: +2340.5,
  totalPnL: +18420.0,
  totalInvested: 394430.0,
};

const MOCK_HOLDINGS = [
  { asset: "Gold",   symbol: "GOLD",   qty: 12,  avgBuy: 5800,  ltp: 6100, currentVal: 73200  },
  { asset: "Silver", symbol: "SILVER", qty: 150, avgBuy: 720,   ltp: 780,  currentVal: 117000 },
];

/* ─── small helpers ─── */
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
const pct = (buy, ltp) => (((ltp - buy) / buy) * 100).toFixed(2);

const Trade = () => {
  const [activeNav, setActiveNav] = useState("dashboard");

  /* trade state */
  const [asset, setAsset]       = useState("GOLD");
  const [quantity, setQuantity] = useState("");
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authPIN, setAuthPIN]   = useState("");

  /* price display */
  const [goldPrice, setGoldPrice]     = useState(0);
  const [silverPrice, setSilverPrice] = useState(0);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  function handleLogout() {
    localStorage.removeItem("token");
    sessionStorage.clear();
    window.location.href = "/";
  }

async function fetchPortfolio() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Login required");
    return;
  }

  try {
    const res = await fetch(
      "http://localhost:3000/api/stock/getPortfolio",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to load portfolio");
      return;
    }

    setPortfolio(data.data);

  } catch (err) {
    console.error("Portfolio error:", err);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  fetchPortfolio();
}, []);

  if (loading) {
  return <div className="portfolio-card">Loading portfolio...</div>;
}

if (!portfolio || portfolio.holdings.length === 0) {
  return (
    <div className="portfolio-card empty">
      <h2>No Holdings Yet</h2>
      <p>Start buying Gold or Silver to build your portfolio.</p>
    </div>
  );
}


  async function currentPrice() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      if (!quantity || quantity <= 0) throw new Error("Enter valid quantity");
      const res = await fetch("http://localhost:3000/api/stock/currentprice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset, quantity: Number(quantity) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
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
      body: JSON.stringify({ asset, quantity, PIN: authPIN }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error || "Server Error"); return; }
    alert(data.message);
    setIsAuthorized(false);
  }

  /* ─── NAV ITEMS ─── */
  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "portfolio", icon: "◎", label: "Portfolio" },
    { id: "holdings",  icon: "📊", label: "Holdings"  },
    { id: "trade",     icon: "⇄", label: "Trade"     },
    { id: "history",   icon: "↺", label: "History"   },
  ];

  const accountItems = [
    { id: "security", icon: "🔒", label: "Security & PIN" },
    { id: "settings", icon: "⚙",  label: "Settings"       },
  ];

  return (
    <div className="tp-root">
      <Header />

      <div className="tp-body">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <nav className="sidebarNav">
          <span className="navLabel">Main</span>
          {navItems.map(({ id, icon, label }) => (
            <div
              key={id}
              className={`navItem ${activeNav === id ? "navItemActive" : ""}`}
              onClick={() => setActiveNav(id)}
            >
              <span className="navIcon">{icon}</span> {label}
            </div>
          ))}

          <span className="navLabel" style={{ marginTop: 16 }}>Account</span>
          {accountItems.map(({ id, icon, label }) => (
            <div
              key={id}
              className={`navItem ${activeNav === id ? "navItemActive" : ""}`}
              onClick={() => setActiveNav(id)}
            >
              <span className="navIcon">{icon}</span> {label}
            </div>
          ))}
        </nav>

        <div className="sidebarFooter">
          <div className="logoutBtn" onClick={handleLogout}>
            <span>↩</span> Log out
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="tp-main">

        {/* ════ DASHBOARD ════ */}
        {activeNav === "dashboard" && (
          <section className="tp-section">
            <h2 className="section-title">Market Overview</h2>
            <div className="tp-board">
              <div className="tp-box">
                <div className="tp-head">
                  <h3>Gold</h3>
                  <span className="tp-rate">₹{(goldPrice * 93).toFixed(2) || "--"}</span>
                </div>
                <div className="tp-graph-wrap">
                  <Graph2 setGoldprice={setGoldPrice} />
                </div>
              </div>

              <div className="tp-box">
                <div className="tp-head">
                  <h3>Silver</h3>
                  <span className="tp-rate">₹{(silverPrice * 93).toFixed(2) || "--"}</span>
                </div>
                <div className="tp-graph-wrap">
                  <GraphSilver setSilverprice={setSilverPrice} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════ PORTFOLIO ════ */}
        {activeNav === "portfolio" && (
         <div className="portfolio-card">

    {/* 🔥 SUMMARY */}
    <div className="portfolio-summary">
      <h2>Portfolio</h2>

      <p>Balance: ₹ {portfolio.balance.toLocaleString()}</p>

      <p>Total Value: ₹ {portfolio.totalCurrentValue.toLocaleString()}</p>

      <p>
        Profit/Loss:{" "}
        <span
          style={{
            color:
              portfolio.totalProfitLoss >= 0 ? "#16c784" : "#ea3943"
          }}
        >
          ₹ {portfolio.totalProfitLoss.toLocaleString()}
        </span>
      </p>
    </div>

    {/* 🔥 HOLDINGS */}
    <div className="holdings">

      {portfolio.holdings.map((item) => (
        <div key={item._id} className="holding-card">

          <h3>◎ {item.asset}</h3>

          <p>Quantity: {item.totalQuantity}</p>

          <p>Avg Price: ₹ {item.avgPrice.toFixed(2)}</p>

          <p>Current Price: ₹ {item.currentPrice.toFixed(2)}</p>

          <p>Value: ₹ {item.currentValue.toLocaleString()}</p>

          <p
            style={{
              color:
                item.profitLoss >= 0 ? "#16c784" : "#ea3943"
            }}
          >
            P/L: ₹ {item.profitLoss.toLocaleString()}
          </p>

        </div>
      ))}

    </div>

  </div>
        )}

        {/* ════ HOLDINGS ════ */}
        {activeNav === "holdings" && (
          <section className="tp-section">
            <h2 className="section-title">Holdings</h2>
            <div className="holdings-table-wrap">
              <table className="holdings-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Qty</th>
                    <th>Avg Buy (₹)</th>
                    <th>LTP (₹)</th>
                    <th>Current Value</th>
                    <th>P&amp;L</th>
                    <th>Change %</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_HOLDINGS.map((h) => {
                    const pl    = (h.ltp - h.avgBuy) * h.qty;
                    const change = pct(h.avgBuy, h.ltp);
                    const isUp  = pl >= 0;
                    return (
                      <tr key={h.symbol}>
                        <td>
                          <span className="asset-badge">{h.symbol[0]}</span>
                          {h.asset}
                        </td>
                        <td>{h.qty}</td>
                        <td>{h.avgBuy.toLocaleString("en-IN")}</td>
                        <td>{h.ltp.toLocaleString("en-IN")}</td>
                        <td>{fmt(h.currentVal)}</td>
                        <td className={isUp ? "clr-green" : "clr-red"}>
                          {isUp ? "+" : ""}{fmt(pl)}
                        </td>
                        <td className={isUp ? "clr-green" : "clr-red"}>
                          {isUp ? "▲" : "▼"} {Math.abs(change)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ════ TRADE ════ */}
        {activeNav === "trade" && (
          <section className="tp-section tp-section--center">
            <div className="tp-trade">
              <h2>Trade Assets</h2>

              <div className="tp-field">
                <label>Asset</label>
                <select value={asset} onChange={(e) => setAsset(e.target.value)}>
                  <option value="GOLD">Gold</option>
                  <option value="SILVER">Silver</option>
                </select>
              </div>

              <div className="tp-field">
                <label>Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <button className="tp-btn" onClick={currentPrice} disabled={loading}>
                {loading ? "Calculating..." : "Get Price"}
              </button>

              {error && <div className="tp-error">{error}</div>}

              {result && (
                <div className="tp-output">
                  <p><strong>Asset:</strong> {result.asset}</p>
                  <p><strong>Price per Unit:</strong> ₹{result.pricePerUnit}</p>
                  <p><strong>Quantity:</strong> {result.quantity}</p>
                  <p className="tp-total">Total: ₹{result.totalAmount.toFixed(2)}</p>
                  <button className="tp-btn" onClick={() => setIsAuthorized(true)}>
                    Purchase
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ════ HISTORY / SECURITY / SETTINGS placeholders ════ */}
        {["history", "security", "settings"].includes(activeNav) && (
          <section className="tp-section">
            <h2 className="section-title" style={{ textTransform: "capitalize" }}>
              {activeNav}
            </h2>
            <p className="placeholder-text">This section is coming soon.</p>
          </section>
        )}
      </main>
      </div>

      {/* ── PIN AUTH OVERLAY ── */}
      {isAuthorized && (
        <div className="tp-auth-overlay">
          <div className="tp-auth-box">
            <p className="auth-title">Enter PIN</p>
            <p className="auth-sub">Secure your transaction</p>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              className="tp-pin"
              onChange={(e) => setAuthPIN(e.target.value)}
            />
            <button className="tp-confirm" onClick={buyAsset}>Proceed</button>
            <button className="tp-cancel" onClick={() => setIsAuthorized(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trade;