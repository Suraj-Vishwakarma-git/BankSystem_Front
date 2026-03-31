import React, { useEffect, useState } from "react";
import "./TransferMoney.css";
import Header from "../../components/common/Header.jsx";
import { useLoading } from "../../context/LoadingContext";
import logo from "./ApexTrust.png"
import History from "./History.jsx";
const TransferMoney = ({ setNotification }) => {
  const { setLoading } = useLoading();

  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txnData, setTxnData] = useState(null);

  const API_URL = "http://localhost:3000";

  // 🔹 Success Animation
  const triggerSuccessAnimation = (data) => {
    setTxnData(data);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  // 🔹 Fetch Contacts
  async function fetchContacts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/allaccounts`);
      const data = await res.json();
      setAccounts(data?.users || []);
    } catch (err) {
      setNotification({ msg: "Failed to load contacts", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Search
  async function handleSearch() {
    if (!search.trim()) {
      setNotification({ msg: "Enter something to search", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/auth/searchaccount?search=${encodeURIComponent(search)}`
      );

      const data = await res.json();

      if (data.multiple) {
        setNotification({ msg: data.message, type: "error" });
        return;
      }

      if (!data.user) {
        setNotification({ msg: "No user found", type: "error" });
        return;
      }

      setSelectedUser(data.user);
      setEmail(data.user.email);

      const exists = accounts.some((acc) => acc.id === data.user.id);

      if (!exists) {
        setAccounts((prev) => [data.user, ...prev]);
      }

      setTimeout(() => {
        document
          .querySelector(".contact-pill.active")
          ?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
          });
      }, 100);
    } catch {
      setNotification({ msg: "Search failed", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // 🔹 TRANSFER (FINAL)
  const handleTransfer = async () => {
    if (!selectedUser) {
      setNotification({ msg: "Select a user first", type: "error" });
      return;
    }

    if (!amount || amount <= 0) {
      setNotification({ msg: "Enter valid amount", type: "error" });
      return;
    }

    if (!pin || !/^\d{4}$/.test(pin)) {
      setNotification({ msg: "Enter valid 4-digit PIN", type: "error" });
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
          PIN: pin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setNotification({ msg: data.message, type: "error" });
        return;
      }

      setNotification({ msg: "Payment Successful", type: "success" });

      triggerSuccessAnimation(data);

      setAmount("");
      setPin("");
    } catch {
      setNotification({ msg: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    
    <div >
      <Header />
       <div className="MainTransactionFile">
      

      {/* SUCCESS ANIMATION */}
      {showSuccess && (
  <div className="success-overlay">
    <div className="success-card-new">

      <div className="success-icon">
        ✔
      </div>

      <h2 className="success-title">
        Payment Successful
      </h2>

      <div className="bank-info">
        <img src={logo} alt="bank" className="bank-logo" />
        <p>{txnData?.to}</p>
      </div>

      <p className="balance-label">Amount Sent</p>
      <h1 className="success-amount">₹ {txnData?.amount}</h1>

    </div>
  </div>
)}

      <div className="transactionbox">
        <div className="transfer-card">

          <div className="card-header">
            <h2>Transfer Money</h2>
            <p>Select a contact or search user</p>
          </div>

          {/* SEARCH */}
          <div className="search-box">
            <input
              type="text"
              value={search}
              className="searchBox"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
            />
            <button onClick={handleSearch} className="searchUser" >Search</button>
          </div>

          {/* CONTACTS */}
          <div className="contacts-scroll">
            {accounts.map((user) => (
              <div
                key={user.id}
                className={`contact-pill ${
                  selectedUser?.id === user.id ? "active" : ""
                }`}
                onClick={() => {
                  setEmail(user.email);
                  setSelectedUser(user);
                }}
              >
                <div className="avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <p>{user.name.split(" ")[0]}</p>
              </div>
            ))}
          </div>

          {/* FORM */}
          <div className="card-body">

            {selectedUser && (
              <div className="selected-user">
                Sending to: {selectedUser.name}
              </div>
            )}

            <div className="input-group">
              <label>Email</label>
              <div className="receiverMail">
              <input type="text" value={email} className="readOnly" readOnly style={{cursor:"default"}} />
              <button className="cancelEmail" onClick={()=>{setSelectedUser(null),setEmail("")}}>X</button>
            </div>
             </div>
            <div className="input-group">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                placeholder="Amount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>PIN</label>
              <input
                type="password"
                value={pin}
                placeholder="PIN"
                onChange={(e) => setPin(e.target.value)}
              />
            </div>

            <button className="send-btn" onClick={handleTransfer}>
              Proceed →
            </button>

          </div>
        </div>
      </div>

      <div className="transactionHistoryBox">
        <History setNotification={setNotification} />
      </div>
    </div>
    </div>
  );
};

export default TransferMoney;