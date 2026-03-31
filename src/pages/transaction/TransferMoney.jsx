import React, { useEffect, useState } from "react";
import "./TransferMoney.css";
import Header from "../../components/common/Header.jsx";

const TransferMoney = () => {

  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // 🔹 Fetch default contacts
  async function fetchContacts() {
    try {
      const res = await fetch("http://localhost:3000/api/auth/allaccounts");
      const data = await res.json();

      setAccounts(data?.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  // 🔹 Search and highlight user
  async function handleSearch() {
    if (!search.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/searchaccount?search=${encodeURIComponent(search)}`
      );

      const data = await res.json();

      // ❗ Multiple users
      if (data.multiple) {
        alert(data.message);
        return;
      }

      // ❗ No user
      if (!data.user) {
        alert("No user found");
        return;
      }

      // ✅ Select user
      setSelectedUser(data.user);
      setEmail(data.user.email);

      // ✅ Add to list if not already present
      const exists = accounts.some(acc => acc.id === data.user.id);

      if (!exists) {
        setAccounts(prev => [data.user, ...prev]);
      }

      // ✅ Scroll to selected user
      setTimeout(() => {
        document.querySelector(".contact-pill.active")?.scrollIntoView({
          behavior: "smooth",
          inline: "center"
        });
      }, 100);

    } catch (err) {
      console.error("Search error:", err);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div>
      <Header />

      <div className="transactionbox">
        <div className="transfer-card">

          {/* HEADER */}
          <div className="card-header">
            <h2>Transfer Money</h2>
            <p>Select a contact or search user</p>
          </div>

          {/* 🔍 SEARCH */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {/* 🔥 CONTACT SCROLL */}
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
                Sending to: {selectedUser.name} ({selectedUser.email})
              </div>
            )}

            <div className="input-group">
              <label>Receiver Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSelectedUser(null);
                }}
                placeholder="example@gmail.com"
              />
            </div>

            <div className="input-group">
              <label>Amount</label>
              <input type="number" placeholder="₹ Enter amount" />
            </div>

            <div className="input-group">
              <label>PIN</label>
              <input type="password" placeholder="••••" />
            </div>

            <button className="send-btn">Proceed →</button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default TransferMoney;