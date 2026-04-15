// ChangePinUI.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./ChangePIN.css";
import logo from "./logo.png"
import { useLoading } from "../../context/LoadingContext.jsx";
import Header from "../../components/common/Header.jsx";

export default function ChangePinUI({ setNotification }) {
  const [oldPinValue, setOldPinValue] = useState("");
  const [newPinValue, setNewPinValue] = useState("");
  const [confirmPinValue, setConfirmPinValue] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

const numericAmount = Number(amount);
const MAX_REQUEST = 10000; // per request

const isValid =
  numericAmount > 0 &&
  numericAmount <= MAX_REQUEST;

  function handleRequest() {
    if (!isValid) return;

    // simulate API call
    setTimeout(() => {
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setAmount("");
        setNote("");
      }, 2500);
    }, 800);
  }


  const mainPIN="1234";
    const handleTransfer = async () => {
   

    if (!amount || amount <= 0) {
      setNotification({ msg: "Enter valid amount", type: "error" });
      return;
    }


    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/account/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          toAccount: selectedUser.id,
          amount: Number(amount),
          PIN: mainPIN,
        }),
      });

      const data = await res.json();
      setRefresh(true);
      setNotification({ msg: "Request Successful", type: "success" });
       
      setAmount("");
    } catch {
      setNotification({ msg: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  };


  const isFormValid =
    newPinValue === confirmPinValue &&
    newPinValue.length === 4 &&
    oldPinValue.length === 4;
    

  async function handlePinUpdate() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:3000/api/account/changepin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPin: oldPinValue,
            newPin: newPinValue,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setNotification({
        msg: "PIN updated successfully",
        type: "success",
      });

      setOldPinValue("");
      setNewPinValue("");
      setConfirmPinValue("");

      navigate("/home");
    } catch (err) {
      setNotification({
        msg: err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

async function AddMoney() {
  try {
    const token = localStorage.getItem("token");
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setNotification({
        msg: "Enter a valid amount",
        type: "error"
      });
      return false;
    }

    setLoading(true);

    const res = await fetch(
      "http://localhost:3000/api/account/addmoney",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: numericAmount })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    setNotification({
      msg: `₹${numericAmount} added successfully`,
      type: "success"
    });

    return true; // ✅ IMPORTANT

  } catch (err) {
    setNotification({
      msg: err.message || "Network error",
      type: "error"
    });
    return false; // ❌ FAILED
  } finally {
    setLoading(false);
  }
}



  return (
    <div className="pin-root">
      <Header />
       <div className="MainContainerr">
      <div className="pin-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pin-card"
        >
          <h2 className="pin-title">Update UPI PIN</h2>

          <div className="pin-form">
            <div className="pin-field">
              <label>Old PIN</label>
              <input
                type="password"
                maxLength={4}
                inputMode="numeric"
                value={oldPinValue}
                placeholder="••••"
                autoComplete="off"
                onChange={(e) =>
                  setOldPinValue(e.target.value.replace(/\D/g, ""))
                }
                className="pin-input"
              />
            </div>

            <div className="pin-field">
              <label>New PIN</label>
              <input
                type="password"
                maxLength={4}
                autoComplete="off"
                inputMode="numeric"
                placeholder="••••"
                value={newPinValue}
                onChange={(e) =>
                  setNewPinValue(e.target.value.replace(/\D/g, ""))
                }
                className="pin-input"
              />
            </div>

            <div className="pin-field">
              <label>Confirm PIN</label>
              <input
                type="password"
                placeholder="••••"
                maxLength={4}
                autoComplete="off"
                inputMode="numeric"
                value={confirmPinValue}
                onChange={(e) =>
                  setConfirmPinValue(e.target.value.replace(/\D/g, ""))
                }
                className="pin-input"
              />
            </div>
          </div>

          <div className="pin-actions">
            <button
              disabled={!isFormValid}
              onClick={handlePinUpdate}
              className="pin-btn-primary"
            >
              Update PIN
            </button>

            <button
              onClick={() => navigate("/home")}
              className="pin-btn-secondary"
            >
              Go Home
            </button>
          </div>

          <p className="pin-footer">🔒 Your PIN is encrypted & secure</p>
        </motion.div>
      </div>
        <div className="reqp-root">

      {/* SUCCESS SCREEN */}
      {success && (
        <motion.div
          className="success-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="success-card"
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
          >
            <div className="tick">✓</div>
            <h2>Request Sent</h2>
           <p>₹{amount} request sent</p>

          </motion.div>
        </motion.div>
      )}

      {/* MAIN CARD */}
      <motion.div
        className="reqp-card"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >

        {/* BANK HEADER */}
        <div className="bank-header">
          <img
            src={logo}
            alt="bank"
            className="bank-logo"
          />
          <div>
            <p className="bank-name">ApexTrust Bank of India</p>
            <p className="bank-sub">UPI • Savings Account</p>
          </div>
        </div>
        

        <h2 className="reqp-title">Request Money</h2>

        {/* AMOUNT */}
        <div className="amount-box">
          <span>₹</span>
          <input
  type="number"
  placeholder="0"
  value={amount}
  onChange={(e) => {
    let value = e.target.value;

    if (value > MAX_REQUEST) {
      value = MAX_REQUEST;
    }

    setAmount(value);
  }}
/>
        </div>

        {/* NOTE */}
        <input
          type="text"
          placeholder="Add a note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="note"
        />

        {/* BUTTON */}
        <button
  disabled={!isValid}
  onClick={async () => {
    const success = await AddMoney();

    if (success) {
      handleRequest(); 
    }
  }}
  className="reqp-btn"
>
  Request
</button>

        <p className="secure">🔒 Secured by UPI</p>
      </motion.div>
    </div>
    </div>
    </div>
  );
}


