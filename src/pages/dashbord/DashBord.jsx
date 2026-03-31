import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./dashboardMain.png";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";
import "./common.css";

/* ─── Animation Variants ───────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", delay },
  }),
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const formItem = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
};

const modalOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit:   { opacity: 0, transition: { duration: 0.22, ease: "easeIn" } },
};

const modalCard = {
  hidden:  { opacity: 0, scale: 0.86, y: 36 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.28, ease: "easeIn" } },
};

/* ─── Component ────────────────────────────────────────────── */



const Dashboard = ({ setNotification }) => {
  const {setLoading}=useLoading();
  const navigate=useNavigate();
  const [isLoginView, setIsLoginView]           = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [name, setName]    = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail]       = useState("");
  const [newAccountName, setNewAccountName]     = useState("");
  const [newAccountEmail, setNewAccountEmail]   = useState("");

  async function handleSignup() {
    try {
      setLoading(true);
      const res  = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.message === "Signup Successfully") {
        setShowAccountModal(true);
        setNewAccountEmail(data.userData.email);
        setNewAccountName(data.userData.name);
        localStorage.setItem("token", data.token);
        setNotification({ msg: data.message, type: "success" });
        return;
      }
      setNotification({ msg: data.message, type: "error" });
      setLoading(false);
    } catch {
      setNotification({ msg: "Something went wrong. Please try again.", type: "error" });
    }finally {
    setLoading(false); // ✅ ALWAYS runs
  }
  }

async function handleCreateAccount() {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/auth/createaccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.message === "Account Created Successfully") {
      setNotification({ msg: data.message, type: "success" });
      navigate("/home");
    } else {
      setNotification({ msg: data.message, type: "error" });
    }

    setShowAccountModal(false);

  } catch {
    setNotification({ msg: "Something went wrong. Please try again.", type: "error" });
  } finally {
    setLoading(false); // ✅ always safe
  }
}

async function handleLogin() {
  try {
    setLoading(true);

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.message === "Login successful") {
      localStorage.setItem("token", data.token);
      setNotification({ msg: data.message, type: "success" });

      setTimeout(() => {
        navigate("/home");
      }, 500);

      return;
    }

    setNotification({ msg: data.message, type: "error" });

  } catch {
    setNotification({ msg: "Something went wrong. Please try again.", type: "error" });
  } finally {
    setLoading(false); // ✅ guaranteed
  }
}

  return (
    <div className="page-wrapper">
      <div className="page-content">

        {/* ── Modal ── */}
        <AnimatePresence>
          {showAccountModal && (
            <motion.div
              className="modal-overlay"
              variants={modalOverlay}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="modal-card"
                variants={modalCard}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div className="modal-brand" variants={fadeUp} initial="hidden" animate="visible" custom={0.05}>
                  <span>ApexTrust</span>
                  <motion.img
                    src={logo}
                    className="modal-logo"
                    alt="ApexTrust logo"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>

                <motion.div className="modal-user-name"  variants={fadeUp} initial="hidden" animate="visible" custom={0.15}>{newAccountName}</motion.div>
                <motion.div className="modal-user-email" variants={fadeUp} initial="hidden" animate="visible" custom={0.22}>{newAccountEmail}</motion.div>

                <motion.button
                  className="modal-confirm-btn"
                  onClick={handleCreateAccount}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={0.3}
                  whileHover={{ scale: 1.05, transition: { duration: 0.18 } }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Account
                </motion.button>

                <motion.p className="modal-warning" variants={fadeIn} initial="hidden" animate="visible" custom={0.4}>
                  *All transaction details will be sent to this email
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Hero / Left ── */}
        <motion.div className="hero-panel" variants={slideLeft} initial="hidden" animate="visible">
          <motion.div className="hero-text" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.h2 className="hero-title" variants={formItem}>Investments</motion.h2>
            <motion.p  className="hero-subtitle" variants={formItem}>That bring you closer to your dreams</motion.p>
          </motion.div>

          <motion.img
            src={logo}
            className="hero-logo"
            alt="ApexTrust"
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.6, ease: "easeOut", delay: 0.2 },
              scale:   { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
              rotate:  { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
              y:       { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
            }}
          />
        </motion.div>

        {/* ── Auth Card / Right ── */}
        <motion.div className="auth-panel" variants={slideRight} initial="hidden" animate="visible">
          <motion.div
            className="auth-card"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <motion.h2
              className="auth-heading"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.25}
            >
              Welcome to ApexTrust
            </motion.h2>

            {/* Tab Switcher */}
            <motion.div
              className="auth-tab-switcher"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.35}
            >
              <button
                className={isLoginView ? "tab-btn tab-btn--active" : "tab-btn"}
                onClick={() => setIsLoginView(true)}
              >
                Login
              </button>
              <button
                className={!isLoginView ? "tab-btn tab-btn--active" : "tab-btn"}
                onClick={() => setIsLoginView(false)}
              >
                Register
              </button>
              <motion.div
                className="tab-slider"
                layout
                style={{
                  position: "absolute", width: "50%", height: "100%",
                  borderRadius: "12px", background: "#00c2a8", zIndex: 1,
                  left: isLoginView ? "0%" : "50%",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            </motion.div>

            {/* ── Form Area: fixed height so card never resizes ── */}
            <div className="auth-form-area">
              <AnimatePresence mode="wait">
                {isLoginView ? (
                  <motion.div
                    key="login"
                    className="form-motion-wrapper"
                    initial={{ opacity: 0, x: -40, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0,   scale: 1    }}
                    exit={{    opacity: 0, x:  40, scale: 0.97 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div
                      className="form-group"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.input
                        className="form-input"
                        type="email"
                        placeholder="Enter Your Email"
                        onChange={(e) => setEmail(e.target.value)}
                        variants={formItem}
                        whileFocus={{ scale: 1.025, transition: { duration: 0.18 } }}
                      />
                      <motion.input
                        className="form-input"
                        type="password"
                        placeholder="Enter Your Password"
                        onChange={(e) => setPassword(e.target.value)}
                        variants={formItem}
                        whileFocus={{ scale: 1.025, transition: { duration: 0.18 } }}
                      />
                      <motion.div className="form-actions" variants={formItem}>
                        <motion.button
                          className="btn-primary"
                          onClick={handleLogin}
                          whileHover={{ scale: 1.06, transition: { duration: 0.16 } }}
                          whileTap={{ scale: 0.94 }}
                        >
                          Login
                        </motion.button>
                        <motion.button
                          className="btn-ghost"
                          whileHover={{ scale: 1.04, transition: { duration: 0.16 } }}
                          whileTap={{ scale: 0.94 }}
                        >
                          Forgot Password?
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    className="form-motion-wrapper"
                    initial={{ opacity: 0, x:  40, scale: 0.97 }}
                    animate={{ opacity: 1, x:   0, scale: 1    }}
                    exit={{    opacity: 0, x: -40, scale: 0.97 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div
                      className="form-group"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.input
                        className="form-input"
                        type="text"
                        placeholder="Enter Your Name"
                        onChange={(e) => setName(e.target.value)}
                        variants={formItem}
                        whileFocus={{ scale: 1.025, transition: { duration: 0.18 } }}
                      />
                      <motion.input
                        className="form-input"
                        type="email"
                        placeholder="Enter Your Email"
                        onChange={(e) => setEmail(e.target.value)}
                        variants={formItem}
                        whileFocus={{ scale: 1.025, transition: { duration: 0.18 } }}
                      />
                      <motion.input
                        className="form-input"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        variants={formItem}
                        whileFocus={{ scale: 1.025, transition: { duration: 0.18 } }}
                      />
                      <motion.div className="form-actions" variants={formItem}>
                        <motion.button
                          className="btn-primary"
                          onClick={handleSignup}
                          whileHover={{ scale: 1.06, transition: { duration: 0.16 } }}
                          whileTap={{ scale: 0.94 }}
                        >
                          Sign Up
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;