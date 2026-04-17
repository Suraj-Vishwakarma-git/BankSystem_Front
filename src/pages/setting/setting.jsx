// Setting.jsx
import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import "./setting.css";
import { useLoading } from "../../context/LoadingContext.jsx";

const Setting = () => {
  const [name, setName] = useState("");
  const [accNo, setAccNo] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState(null);
  const [showBalance, setShowBalance] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const { setLoading } = useLoading();
  const [loading, setLocalLoading] = useState(true);

  async function accDetails() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:3000/api/auth/accdetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setData(data.userAccount);
      setAccNo(data.userAccount.accountNumber);
      setName(data.userAccount.name);
      setEmail(data.email);

    } catch (error) {
      console.log("Error:", error);
    }
  }

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
      console.log(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    accDetails();

    const interval = setInterval(() => {
      fetchPortfolio();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stg-root">
      <Header />

      <div className="stg-main">

        {/* ================= LEFT PROFILE ================= */}
        <div className="stg-profile-wrap">
          <div className="stg-profile-card">

            <div className="stg-profile-header">
              <div className="stg-avatar">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>

              <div className="stg-profile-info">
                <h2>{name}</h2>
                <p>{email}</p>
              </div>
            </div>

            {/* BALANCE */}
            <div className="stg-balance-box">

              <div className="stg-balance-top">
                <span>Available Balance</span>
                <button
                  className="stg-toggle-btn"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? "Hide" : "Show"}
                </button>
              </div>

              <div className="stg-balance-amount">
                {showBalance
                  ? `₹${data?.balance?.toFixed(2) || "0.00"}`
                  : "₹ ••••••"}
              </div>

            </div>

            {/* DETAILS */}
            <div className="stg-details">

              <div className="stg-row">
                <span className="stg-label">Account Number</span>
                <span className="stg-value txt">
                  {accNo}
                </span>
              </div>

              <div className="stg-row">
                <span className="stg-label">Account Status</span>
                <span
                  className={`stg-value ${
                    data?.status === "ACTIVE"
                      ? "stg-status-active"
                      : "stg-status-inactive"
                  } txt` }
                >
                  {data?.status || "Active"}
                </span>
              </div>

              <div className="stg-row">
                <span className="stg-label">Created On</span>
                <span className="stg-value txt">
                  {data?.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : "-"}
                </span>
              </div>

            </div>

            <button className="stg-btn">
              Change Password
            </button>

          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="stg-right">

          {/* ASSETS */}
          <div className="stg-assets-card">
            <div className="stg-grid">

              {loading ? (
                <div className="stg-holding-empty">Loading...</div>
              ) : !portfolio?.holdings || portfolio.holdings.length === 0 ? (
                <div className="stg-holding-empty">
                  <h2>No Holdings Yet</h2>
                  <p>Start investing 🚀</p>
                </div>
              ) : (
                portfolio.holdings.map((item) => (
                  <div key={item._id} className="stg-holding">

                    <div className="stg-holding-top">
                      <h3>{item.asset}</h3>
                      <span
                        className={
                          item.profitLoss >= 0
                            ? "stg-profit"
                            : "stg-loss"
                        }
                      >
                        {item.profitLoss >= 0 ? "▲" : "▼"}
                      </span>
                    </div>

                    <div className="stg-holding-info">
                      <p>Qty: {item.totalQuantity}</p>
                      <p>Avg: ₹ {item.avgPrice.toFixed(2)}</p>
                      <p>LTP: ₹ {item.currentPrice.toFixed(2)}</p>
                    </div>

                    <div className="stg-holding-bottom">
                      <h3
                        className={
                          item.profitLoss >= 0
                            ? "stg-profit"
                            : "stg-loss"
                        }
                      >
                        ₹ {item.profitLoss.toLocaleString()}
                      </h3>
                    </div>

                  </div>
                ))
              )}

            </div>
         
          </div>

          {/* OPTIONS */}
          <div className="stg-options">
            <div className="stg-option-card">🔐 Change PIN</div>
            <div className="stg-option-card">💸 Request Money</div>
            <div className="stg-option-card">⚙️ Set PIN</div>
            <div className="stg-option-card">📄 Support</div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Setting;