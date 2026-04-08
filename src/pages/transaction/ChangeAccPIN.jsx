import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./ChangePIN.css";
import { useLoading } from "../../context/LoadingContext.jsx";
import Header from "../../components/common/Header.jsx";

export default function ChangePinUI({ setNotification }) {
  const [oldPIN, setOldPIN] = useState("");
  const [newPIN, setNewPIN] = useState("");
  const [confirmPIN, setConfirmPIN] = useState("");

  const { setLoading } = useLoading(); // ✅ only from context
  const navigate = useNavigate();

  const isValid =
    newPIN === confirmPIN &&
    newPIN.length === 4 &&
    oldPIN.length === 4;

  async function handleChangePIN() {
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

      // reset fields
      setOldPIN("");
      setNewPIN("");
      setConfirmPIN("");

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
                value={oldPIN}
                onChange={(e) =>
                  setOldPIN(e.target.value.replace(/\D/g, ""))
                }
                className="input"
              />
            </div>

            <div className="field">
              <label>Enter New PIN</label>
              <input
                type="password"
                maxLength={4}
                inputMode="numeric"
                value={newPIN}
                onChange={(e) =>
                  setNewPIN(e.target.value.replace(/\D/g, ""))
                }
                className="input"
              />
            </div>

            <div className="field">
              <label>Confirm New PIN</label>
              <input
                type="password"
                maxLength={4}
                inputMode="numeric"
                value={confirmPIN}
                onChange={(e) =>
                  setConfirmPIN(e.target.value.replace(/\D/g, ""))
                }
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

            <button
              onClick={() => navigate("/home")}
              className="btn_Home"
              style={{ width: "120px", margin: "10px" }}
            >
              Home
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