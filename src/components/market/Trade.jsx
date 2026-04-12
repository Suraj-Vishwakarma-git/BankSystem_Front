import React, { useState } from "react";
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

  const { loading, setLoading } = useLoading();

  function handleLogout() {
    localStorage.removeItem("token");
    sessionStorage.clear();
    window.location.href = "/";
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
          <section className="tp-section">
            <h2 className="section-title">Portfolio</h2>

            <div className="pf-summary-grid">
              <div className="pf-card">
                <span className="pf-label">Total Value</span>
                <span className="pf-value">{fmt(MOCK_PORTFOLIO.totalValue)}</span>
              </div>
              <div className="pf-card">
                <span className="pf-label">Total Invested</span>
                <span className="pf-value">{fmt(MOCK_PORTFOLIO.totalInvested)}</span>
              </div>
              <div className={`pf-card ${MOCK_PORTFOLIO.totalPnL >= 0 ? "pf-green" : "pf-red"}`}>
                <span className="pf-label">Overall P&amp;L</span>
                <span className="pf-value">{fmt(MOCK_PORTFOLIO.totalPnL)}</span>
              </div>
              <div className={`pf-card ${MOCK_PORTFOLIO.todayPnL >= 0 ? "pf-green" : "pf-red"}`}>
                <span className="pf-label">Today's P&amp;L</span>
                <span className="pf-value">{fmt(MOCK_PORTFOLIO.todayPnL)}</span>
              </div>
            </div>

            {/* allocation bar */}
            <div className="pf-alloc">
              <h3 className="pf-alloc-title">Asset Allocation</h3>
              <div className="alloc-bar-wrap">
                <div className="alloc-bar gold-bar" style={{ width: "38%" }}>
                  <span>Gold 38%</span>
                </div>
                <div className="alloc-bar silver-bar" style={{ width: "62%" }}>
                  <span>Silver 62%</span>
                </div>
              </div>
            </div>
          </section>
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