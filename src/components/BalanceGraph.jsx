import React from "react";

const SimpleBalanceBar = ({ spent = 0, balance = 0 }) => {

  const total = spent + balance;
  const spentPercent = total > 0 ? (spent / total) * 100 : 0;

  return (
    <div style={{ width: "300px", margin: "20px auto" }}>

      {/* BALANCE TEXT */}
      <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
        ₹ {balance} Available
      </div>

      {/* BAR BACKGROUND */}
      <div style={{
        width: "100%",
        height: "20px",
        backgroundColor: "#eee",
        borderRadius: "10px",
        overflow: "hidden"
      }}>

        {/* SPENT BAR */}
        <div style={{
          width: `${spentPercent}%`,
          height: "100%",
          backgroundColor: "#ff4d4d",
          transition: "0.5s"
        }}></div>

      </div>

      {/* PERCENT TEXT */}
      <div style={{ marginTop: "5px", fontSize: "12px" }}>
        {spentPercent.toFixed(1)}% spent
      </div>

    </div>
  );
};

export default SimpleBalanceBar;