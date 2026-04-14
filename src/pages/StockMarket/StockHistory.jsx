import React, { useEffect, useState } from "react";
import History from "../transaction/History";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header";
import "./StockHistory.css"
const Stock = () => {
  const [stockData, setStockData] = useState([]);

  async function stockHistory() {
    const token = localStorage.getItem("token");

    try {
      const API = await fetch(
        "http://localhost:3000/api/stock/stockhistory",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await API.json();

      if (!API.ok) {
        console.log(data);
        return;
      }

      setStockData(data.data || []);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    stockHistory();
  }, []);

  return (
    <div className="stk-main">
      <Header />

      <div className="stk-wrapper">
        <div className="stk-history-left">
          <History />
        </div>

        <div className="stk-history-right">
          {stockData.length === 0 ? (
            <div className="stk-empty">No transactions yet</div>
          ) : (
            <>
              <h3 className="stk-title">Recent Stock Transactions</h3>

              <div className="stk-transactions">
                {stockData.map((tx) => (
                  <div key={tx.id} className="stk-card">
                    <div className="stk-left">
                      <div
                        className={`stk-icon ${
                          tx.type === "BUY"
                            ? "stk-debit"
                            : "stk-credit"
                        }`}
                      >
                        {tx.type === "BUY" ? "↓" : "↑"}
                      </div>

                      <div>
                        <p className="stk-asset">{tx.asset}</p>
                        <p className="stk-sub">
                          {tx.type} •{" "}
                          {new Date(tx.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                      <div className="stk-price">
                        <h4>PerUnit</h4>
                         ₹ {tx.pricePerUnit}
                        
                        <h5>quantity:{tx.quantity}</h5>
                     
                    </div>


                    <div
                      className={`stk-amount ${
                        tx.type === "BUY"
                          ? "stk-debit-text"
                          : "stk-credit-text"
                      }`}
                    >
                      {tx.type === "BUY" ? "- " : "+ "}₹ {tx.totalAmount}
                    </div>

  
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stock;