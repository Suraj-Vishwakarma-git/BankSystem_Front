import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#ff4d4f", "#52c41a"]; // Red = Spent, Green = Remaining

const BalanceChart = ({ totalBalance, spentAmount }) => {
  const spentPercent =
    totalBalance > 0 ? (spentAmount / totalBalance) * 100 : 0;

  const remainingPercent = 100 - spentPercent;

  const data = [
    { name: "Spent", value: spentPercent },
    { name: "Remaining", value: remainingPercent }
  ];

  return (
    <div style={{ position: "relative", width: 260, height: 260 }}>
      <PieChart width={260} height={260}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={100}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
      </PieChart>

      {/* Center Content */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center"
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>
          Remaining
        </p>
        <h4 style={{ margin: 0 }}>
          {remainingPercent.toFixed(1)}%
        </h4>
      </div>
    </div>
  );
};

export default BalanceChart;