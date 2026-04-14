import React, { useEffect, useState } from "react";
import "./History.css";
import { useLoading } from "../../context/LoadingContext";


const History = ({ setNotification ,refresh,setRefresh}) => {
  const [showBalance,setShowBalance]=useState(false);
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const {setLoading}=useLoading();
 
  async function FetchBalance() {
    setLoading(true);
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
    }finally{
      setLoading(false);
    }
  }

 useEffect(() => {
  if (refresh) {
    FetchBalance();
    setRefresh(false);
  }
}, [refresh]);

  useEffect(()=>{
    FetchBalance();

  },[])


return (
  <div className="history-container">

    {/* HEADER (STATIC) */}
    <div className="history-header">
      <h2>Account Overview</h2>

   

      {balance !== null && (
        <div className="balance-card">
          <p>Total Balance</p>
          <div className="AccBalance">
          <h1>₹ {showBalance?balance.toLocaleString():"****"}</h1>
           <button className="toggle-btn" onClick={()=>setShowBalance(!showBalance)}>
            {showBalance ? "Hide" : "Show"}
          </button>
          </div>
        </div>
      )}
    </div>

    <div className="transactions-section">


      { history.length > 0 && (
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