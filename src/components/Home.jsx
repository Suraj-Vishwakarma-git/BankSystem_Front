import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Home.css";
import AccBalance from './transaction/AccBalance.jsx';
import Header from './common/Header.jsx';
import Pin from './transaction/Pin.jsx';

const Home = ({ setNotification }) => {


  const navigate = useNavigate();
  const [ispinExist, setispinExits] = useState(false);
  const [balanceModel, setbalanceModel] = useState(false);
  const [pinModel, setPinModel] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  const [accno,setaccNo]=useState("");
  const [accBalance,setaccBalance]=useState("");
  const [sendMoney,setsendMoney]=useState("");
  const [receivedMoney,setreceivedMoney]=useState("");
  const [revealBalance,setrevealBalance]=useState(false);

  const [graphdata,setgraphdata]=useState(null);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function check() {
    if (ispinExist) {
      setNotification({
        msg: "User already has a PIN set",
        type: "error",
      });
    }
  }

  async function accData(){
    const token=localStorage.getItem("token");
    const API=await fetch("http://localhost:3000/api/account/accdata",{
      method:"GET",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      }
    });
    if(!API.ok){
      return setNotification({msg:"Error",type:"error"})
    }
    const data=await API.json();
    setgraphdata(data);
    setaccNo(data.accountNo);
    setaccBalance(data.balance);
    setsendMoney(data.debitAmt);
    setreceivedMoney(data.creditAmt);
    console.log(data);

  }
  useEffect(()=>{
    accData()
  },[])

  return (
    <div className="homeContainer">

      {/* ── MODALS (unchanged) ─────────────────── */}
      {balanceModel && (
        <div className="balance">
          <AccBalance setbalanceModel={setbalanceModel} />
        </div>
      )}
      {pinModel && !ispinExist && (
        <div className="setPin">
          <Pin setPinModel={setPinModel} setNotification={setNotification} />
        </div>
      )}

      {/* ── SIDEBAR ────────────────────────────── */}
      <aside className="sidebar">
       

        <nav className="sidebarNav">
          <span className="navLabel">Main</span>

          <div
            className={`navItem ${activeNav === 'dashboard' ? 'navItemActive' : ''}`}
            onClick={() => setActiveNav('dashboard')}
          >
            <span className="navIcon">⊞</span> Dashboard
          </div>

          <div
            className={`navItem ${activeNav === 'transfers' ? 'navItemActive' : ''}`}
            onClick={() => setActiveNav('transfers')}
          >
            <span className="navIcon">⇄</span> Transfers
          </div>

          <div
            className={`navItem ${activeNav === 'history' ? 'navItemActive' : ''}`}
            onClick={() => setActiveNav('history')}
          >
            <span className="navIcon">↺</span> History
          </div>

          <div
            className={`navItem ${activeNav === 'requests' ? 'navItemActive' : ''}`}
            onClick={() => setActiveNav('requests')}
          >
            <span className="navIcon">◎</span> Requests
          </div>

          <span className="navLabel" style={{ marginTop: '16px' }}>Account</span>

          <div
            className={`navItem ${activeNav === 'security' ? 'navItemActive' : ''}`}
            onClick={() => setActiveNav('security')}
          >
            <span className="navIcon">🔒</span> Security &amp; PIN
          </div>

          <div
            className={`navItem ${activeNav === 'settings' ? 'navItemActive' : ''}`}
            onClick={() => setActiveNav('settings')}
          >
            <span className="navIcon">⚙</span> Settings
          </div>
        </nav>

        <div className="sidebarFooter">
          <div className="logoutBtn" onClick={handleLogout}>
            <span>↩</span> Log out
          </div>
        </div>
      </aside>

      {/* ── RIGHT PANEL ────────────────────────── */}
      <div className="rightPanel">

        {/* TOPBAR — Header component renders here */}
        <div className="topbar">
          <Header setispinExits={setispinExits} setNotification={setNotification} />
        </div>

        {/* ACCOUNT STRIP */}
        <div className="acctStrip">
          <div className="acctChip">
            <div className="acctChipIcon">🏦</div>
            <div>
              <div className="acctChipLabel">Account No.</div>
              <div className="acctChipVal">{accno}</div>
            </div>
          </div>
     
          <div className="stripDivider" />

          <div className="stripStat">
            <span className="stripStatLabel">Available Balance</span>
            {
            revealBalance?(<span className="stripStatVal">₹ {accBalance}</span>):
            (<span className="stripStatVal">₹ *****</span>)
          }
          </div>

          <div className="stripDivider" />

          <div className="stripStat">
            <span className="stripStatLabel">This month's spend</span>
            <span className="stripStatVal">₹ {sendMoney}</span>
          </div>

          <div className="stripAction" onClick={() => setrevealBalance(!revealBalance)}>
            Reveal Balance
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="contentScroll">

          {/* STATS ROW */}
           <div className="statCard">
          <div className="statLabel">Sent</div>
         <div className="statVal">₹ {sendMoney}</div> 
         <span
           className={`statBadge ${sendMoney > receivedMoney ? "down" : "up"}`}
         >
           {sendMoney > receivedMoney ? "High Spend" : "Low Spend"}
         </span>
       </div>

  {/* Received */}
  <div className="statCard">
    <div className="statLabel">Received</div>
    <div className="statVal">₹ {receivedMoney}</div>

    <span
      className={`statBadge ${receivedMoney > sendMoney ? "up" : "down"}`}
    >
      {receivedMoney > sendMoney ? "High Income" : "Low Income"}
    </span>
  </div>

          {/* MAIN BOX — unchanged classNames */}
          <div className="mainBox">

            {/* LEFT CARD */}
            <div className="transactionBox">
              <h2 className="transferTitle">Transfer Money</h2>

              <div className="treeBoxes">
                <div className="optionCard">
                  <span className="icon">🏦</span>
                  <span>Through Acc. No</span>
                </div>
                <div className="optionCard">
                  <span className="icon">🔍</span>
                  <span>Find Account</span>
                </div>
                <div className="optionCard">
                  <span className="icon">📧</span>
                  <span>Through Email</span>
                </div>
              </div>

              <div className="tbtn">
                <Link to="/transfermoney">
                  <button className="transferBtn">Continue</button>
                </Link>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="anotherBox">
              <div className="anotherBoxTitle">More Options</div>

              <div className="cardItem">
                <h3>Transaction History</h3>
              </div>

              <div className="cardItem">
                <h3>Request Money</h3>
              </div>

              <div className="cardItem" onClick={() => { setPinModel(true); check(); }}>
                <h3>Set Account PIN</h3>
              </div>

              <div className="cardItem changepin">
                <h3>Change Account PIN</h3>
              </div>

              <div className="cardItem checkBalance" onClick={() => setbalanceModel(true)}>
                <h3>Check Account Balance</h3>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;