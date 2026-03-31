import React, { useState } from "react";
import "./History.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const History = ({ setNotification }) => {
  const [showBalance,setShowBalance]=useState(true);
  const [PIN, setPIN] = useState("");
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);

  async function FetchBalance() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:3000/api/account/fetchbalance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ PIN }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setNotification({ msg: data.message, type: "error" });
        return;
      }

      setBalance(data.TotalBalance);
      setHistory(data.History);
    } catch {
      setNotification({ msg: "Something went wrong", type: "error" });
    }
  }

return (
  <div className="history-container">

    {/* HEADER (STATIC) */}
    <div className="history-header">
      <h2>Account Overview</h2>

      <div className="pin-row">
        <input
          type="password"
          placeholder="Enter PIN"
          value={PIN}
          onChange={(e) => setPIN(e.target.value)}
        />
        <button onClick={FetchBalance}>Check</button>
      </div>

      {balance !== null && (
        <div className="balance-card">
          <p>Total Balance</p>
          <button className="toggle-btn" onClick={()=>setShowBalance(!showBalance)}>
            {showBalance ? <Visibility /> : <VisibilityOff />}
          </button>
          <h1>₹ {balance.toLocaleString()}</h1>
        </div>
      )}
    </div>

    {/* SCROLLABLE TRANSACTIONS */}
    <div className="transactions-section">

      {/* 👇 Show message if PIN not entered */}
      {!PIN && (
        <div className="empty-state">
          Enter PIN to check history
        </div>
      )}

      {/* 👇 Show transactions only if available */}
      {PIN && history.length > 0 && (
        <>
          <h3>Recent Transactions</h3>

          <div className="transactions">
            {history.map((tx) => (
              <div key={tx._id} className="transaction-card">

                <div className="tx-left">
                  <div className={`tx-icon ${tx.type === "DEBIT" ? "debit" : "credit"}`}>
                    {tx.type === "DEBIT" ? "↓" : "↑"}
                  </div>

                  <div>
                    <p className="tx-title">{tx.description}</p>
                    <p className="tx-sub">
                      {tx.type} • {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div
                  className={`tx-amount ${
                    tx.type === "DEBIT" ? "debit-text" : "credit-text"
                  }`}
                >
                  {tx.type === "DEBIT" ? "- " : "+ "}₹ {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </div>
);
};

export default History;