import React, { useState } from "react";
import "./AccBalance.css";

const AccBalance = ({setbalanceModel}) => {
  const [PIN, setPIN] = useState("");
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  async function FetchBalance() {
    try {
      setError("");
      const token = localStorage.getItem("token");

      const API = await fetch(
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

      const data = await API.json();
      if (!API.ok) {
        setError(data.message);
        return;
      }
      setBalance(data.TotalBalance);
      setHistory(data.History);
    } catch (err) {
      setError("Something went wrong");
    }
  }

  return (
    
    <div className="overlay balance-container ">
      
      <div className="card">
        <div onClick={()=>setbalanceModel(false)} className="canclebtn">X</div>
        <h2>💳 Account Balance</h2>
        <input
          type="password"
          placeholder="Enter 4 digit PIN"
          value={PIN}
          onChange={(e) => setPIN(e.target.value)}
        />
        <button onClick={FetchBalance}>Check Balance</button>

        {error && <p className="error">{error}</p>}

        {balance !== null && (
          <div className="balance-box">
            <h3>₹ {balance}</h3>
          </div>
        )}
         
      </div>

      {history.length > 0 && (
        <div className="history">
          <h3>Recent Transactions</h3>
          {history.map((tx, index) => (
            <div key={index} className="tx">
              <p>{tx.type}</p>
              <p>₹ {tx.amount}</p>
            </div>
          ))}
        </div>
      )}
     
    </div>
  );
};

export default AccBalance;