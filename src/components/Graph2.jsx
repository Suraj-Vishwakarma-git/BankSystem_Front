import React, { useState, useEffect, useRef } from "react";
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

const Graph2 = ({ setGoldprice }) => {
  const [data, setData] = useState([]);
  const intervalRef = useRef(null);

  // 🔥 Fetch from backend
  const fetchPrice = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/stock/graph?asset=GOLD"
      );

      if (!res.ok) {
        console.error("Error fetching graph");
        return;
      }

      const apiData = await res.json();
      const graph = apiData.graph || [];

      setData(graph);

      if (graph.length > 0) {
        const latest = graph[graph.length - 1].price;
        setGoldprice(latest);
      }

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // 🔥 Run on load + interval
  useEffect(() => {
    fetchPrice();

    intervalRef.current = setInterval(fetchPrice, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 🔥 Loading state
  if (!data || data.length === 0) {
    return (
      <div className="graph-container">
        <div className="loading">Loading market data...</div>
      </div>
    );
  }

  // 🔥 Smooth + filter data (IMPORTANT)
  const displayData = data
    .filter((_, i) => i % 2 === 0) // reduce points
    .map((point, i, arr) => {
      if (i === 0 || i === arr.length - 1) return point;

      const avg =
        (arr[i - 1].price + point.price + arr[i + 1].price) / 3;

      return {
        ...point,
        price: Number(avg.toFixed(2))
      };
    });

  // 🔥 Calculations
  const first = Number(displayData[0]?.price) || 0;
  const last = Number(displayData[displayData.length - 1]?.price) || 0;

  const change = last - first;
  const percent = first ? ((change / first) * 100).toFixed(2) : 0;

  const isUp = change >= 0;

  return (
    <div className="graph-container">

      {/* 🔥 HEADER */}
      <div className="graph-top">

        <div className="graph-left">
          <h2 className="live-price">₹ {last.toLocaleString()}</h2>
        </div>

        <div className={`graph-change ${isUp ? "up" : "down"}`}>
          <span className="arrow">{isUp ? "▲" : "▼"}</span>
          <span>
            {isUp ? "+" : ""}
            {change.toFixed(2)} ({percent}%)
          </span>
        </div>

      </div>

      {/* 🔥 GRAPH */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.08} />

          <Line
            type="monotone"
            dataKey="price"
            stroke={isUp ? "#16c784" : "#ea3943"}
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={true}
          />

          <YAxis
            domain={["dataMin - 10", "dataMax + 10"]}
            tickFormatter={(v) => v.toFixed(0)}
            axisLine={false}
            tickLine={false}
          />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(v) => {
              const num = Number(v);
              return isNaN(num) ? v : `₹ ${num.toFixed(2)}`;
            }}
            contentStyle={{
              backgroundColor: "#111",
              border: "none",
              borderRadius: "8px",
              color: "#fff"
            }}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default Graph2;