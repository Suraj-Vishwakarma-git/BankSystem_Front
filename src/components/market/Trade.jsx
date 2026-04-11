import React, { useState } from "react";
import Graph2 from "../Graph2.jsx";
import GraphSilver from "../GraphSilver.jsx";
import Header from "../common/Header.jsx";
import { useLoading } from "../../context/LoadingContext.jsx";
import "./Trade.css";

const Trade = () => {
  const [asset, setAsset] = useState("GOLD"); // ✅ default
  const [quantity, setQuantity] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [Goldprice,setGoldprice]=useState(0);
   const [Silverprice,setSilverprice]=useState(0);
   const [isAuthorized,setisAuthorized]=useState(false);
  const [authPIN,setauthPIN]=useState(null);
  const { loading, setLoading } = useLoading(); // ✅ correct usage


  async function currentPrice() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      if (!quantity || quantity <= 0) {
        throw new Error("Enter valid quantity");
      }

      const res = await fetch(
        "http://localhost:3000/api/stock/currentprice",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            asset,
            quantity: Number(quantity), // ✅ FIX
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function buyAsset() {
    const token=localStorage.getItem("token");
    const API=await fetch("http://localhost:3000/api/stock/buyasset",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}` 
        },
        body:JSON.stringify({asset,quantity,PIN:authPIN})
    });
    if(!API.ok){
        alert("Server Error");
    }
    const data=await API.json();
    if(data.message==="Asset purchased successfully"){
        alert(data.message);
    }
    setisAuthorized(false);
  }

  return (
    <div>
      <Header />

      <div className="graph">
        <div className="GoldGraph size">
      <h2>Gold</h2><br></br>
      <Graph2 setGoldprice={setGoldprice}/>
      </div>
      
      <div className="SilverGraph size">
      <h2>Silver</h2><br></br>
      <GraphSilver setSilverprice={setSilverprice} />
  </div>
  </div>

      {/* TRADE CARD */}
      <div className="trade-card">
        <h2>Trade Assets</h2>

        <div className="form-group">
          <label>Asset</label>
          <select value={asset} onChange={(e) => setAsset(e.target.value)}>
            <option value="GOLD">Gold</option>
            <option value="SILVER">Silver</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button className="button" onClick={currentPrice} disabled={loading}>
          {loading ? "Calculating..." : "Get Price"}
        </button>

        {/* ERROR */}
        {error && <div className="error">{error}</div>}

        {/* RESULT */}
        {result && (
          <div className="result">
            <p><strong>Asset:</strong> {result.asset}</p>
            <p><strong>Price per Unit:</strong> ₹{result.pricePerUnit}</p>
            <p><strong>Quantity:</strong> {result.quantity}</p>
            <p className="total">
              Total: ₹{result.totalAmount}
            </p>
            <button className="button " onClick={()=>setisAuthorized(true)}>Purchase</button>
          </div>
        )}
             {
  isAuthorized && (
    <div className="authorization">
      <div className="auth-card">
        
        <p className="auth-title">Enter PIN</p>
        <p className="auth-sub">Secure your transaction</p>

        <input
          type="password"
          maxLength={4}
          placeholder="••••"
          className="pin-input"
          onChange={(e) => setauthPIN(e.target.value)}
        />

        <button className="process-btn" onClick={buyAsset}>
          Proceed
        </button>
        <button className="cancle-btn" onClick={()=>setisAuthorized(false)}>
          Cancle
        </button>

      </div>
    </div>
  )
}
      </div>

      <div className="portfolio"></div>
    </div>
  );
};

export default Trade;