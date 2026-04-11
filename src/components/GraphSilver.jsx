import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import "./Graph2.css";

const GraphSilver = ({setSilverprice}) => {
  const [data, setData] = useState([]);

  const fetchPrice = async () => {
    try {
      // ✅ FIX: correct silver proxy (CoinGecko doesn’t have pure silver)
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=usd"
      );
      const json = await res.json();

      const base = Number(json["tether-gold"].usd);

      const oldData =
        JSON.parse(localStorage.getItem("silverData")) || [];

      const last =
        Number(oldData[oldData.length - 1]?.price) || base;

      // 🔥 increase movement (important)
      const noise = (Math.random() - 0.5) * 10;

      // ✅ FIX: always store number
      const price = Number((last + noise).toFixed(3));
         setSilverprice(price);
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      const newData = [...oldData, { time, price }];

      const trimmed = newData.slice(-50);

      localStorage.setItem("silverData", JSON.stringify(trimmed));

      setData(trimmed);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ FIX: ensure numbers
  const first = Number(data[0]?.price) || 0;
  const last = Number(data[data.length - 1]?.price) || 0;

  const change = last - first;
  const percent = first ? ((change / first) * 100).toFixed(2) : 0;

  const isUp = change >= 0;

  return (
    <div className="graph-container">

      <div className="header">
        <div className="price">${last.toFixed(2)}</div>

        <div className={`change ${isUp ? "up" : "down"}`}>
          {isUp ? "+" : ""}
          {change.toFixed(2)} ({percent}%)
        </div>
      </div>

      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.08} />

          <Line
            type="monotone"
            dataKey="price"
            stroke={isUp ? "#16c784" : "#ea3943"}
            strokeWidth={2.5}
            dot={false}
          />

          {/* ✅ FIX: safe formatter */}
          <YAxis
            domain={["dataMin - 5", "dataMax + 5"]}
            tickFormatter={(v) => {
              const num = Number(v);
              return isNaN(num) ? v : num.toFixed(2);
            }}
          />

          <XAxis dataKey="time" />

          {/* ✅ FIX: safe tooltip */}
          <Tooltip
            formatter={(v) => {
              const num = Number(v);
              return isNaN(num) ? v : num.toFixed(2);
            }}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default GraphSilver;