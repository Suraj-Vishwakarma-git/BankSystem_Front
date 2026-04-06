import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./ChangePIN.css";
import Header from "../../components/common/Header";

export default function ChangePinUI({ setNotification, setLoading }) {
  const [oldPIN, setOldPIN] = useState("");
  const [newPIN, setNewPIN] = useState("");
  const [confirmPIN, setConfirmPIN] = useState("");

  const navigate = useNavigate();

  const isValid = newPIN === confirmPIN && newPIN.length === 4;

  // ✅ renamed function (important)
  async function handleChangePIN() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:3000/api/account/changepin",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPin: oldPIN,
            newPin: newPIN,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setNotification({
        msg: "PIN changed successfully",
        type: "success",
      });

      setOldPIN("");
      setNewPIN("");
      setConfirmPIN("");

      // ✅ OPTIONAL: redirect after success
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

  return (
    <div className="mainn">
      <Header />

      {/* ✅ HOME BUTTON FIX */}
      <button
        onClick={() => navigate("/home")}
        className="btn_Home"
        style={{ width: "120px", margin: "10px" }}
      >
        Home
      </button>

      <div className="page">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card"
        >
          <h2 className="title">Change UPI PIN</h2>

          <div className="inputGroup">
            <div className="field">
              <label>Enter Old PIN</label>
              <input
                type="password"
                maxLength={4}
                inputMode="numeric"
                placeholder="••••"
                value={oldPIN}
                onChange={(e) => setOldPIN(e.target.value)}
                className="input"
              />
            </div>

            <div className="field">
              <label>Enter New PIN</label>
              <input
                type="password"
                maxLength={4}
                inputMode="numeric"
                placeholder="••••"
                value={newPIN}
                onChange={(e) => setNewPIN(e.target.value)}
                className="input"
              />
            </div>

            <div className="field">
              <label>Confirm New PIN</label>
              <input
                type="password"
                maxLength={4}
                inputMode="numeric"
                placeholder="••••"
                value={confirmPIN}
                onChange={(e) => setConfirmPIN(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="btns">
            <button
              disabled={!isValid}
              onClick={handleChangePIN}
              className="btn"
            >
              Update PIN
            </button>
          </div>

          <p className="footerText">
            Your PIN is secure and encrypted 🔒
          </p>
        </motion.div>
      </div>
    </div>
  );
}