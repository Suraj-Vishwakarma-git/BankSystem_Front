import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Home.css";
import AccBalance from './transaction/AccBalance.jsx';
import Header from './common/Header.jsx';
import Pin from './transaction/Pin.jsx';
import Graph from "./Graph2.jsx";
import { useLoading } from "../context/LoadingContext";
import GraphSilver from './GraphSilver.jsx';
import logo from "./logo.png"


const Home = ({ setNotification }) => {


  const navigate = useNavigate();
  const [ispinExist, setispinExits] = useState(false);
  const [balanceModel, setbalanceModel] = useState(false);
  const [pinModel, setPinModel] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  const [authPIN,setauthPIN]=useState("");
  const [isAuthorized,setisAuthorized]=useState(false);
  const [accno,setaccNo]=useState("");
  const [accBalance,setaccBalance]=useState("");
  const [sendMoney,setsendMoney]=useState("");
  const [receivedMoney,setreceivedMoney]=useState("");
  const [revealBalance,setrevealBalance]=useState(false);
 const {setLoading}=useLoading();
  const [graphdata,setgraphdata]=useState(null);
 const [gold, setGold] = useState(null);
  const [silver, setSilver] = useState(null);


  const [Goldprice,setGoldprice]=useState(0);
  const [Silverprice,setSilverprice]=useState(0);





  useEffect(() => {
    fetchPrices();
  }, []);
  function handleLogout() {
    localStorage.removeItem("token");
    sessionStorage.clear();
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
  async function fetchPrices() {
    try {
      const goldRes = await fetch("https://api.gold-api.com/price/XAU");
      const goldData = await goldRes.json();

      const silverRes = await fetch("https://api.gold-api.com/price/XAG");
      const silverData = await silverRes.json();

      setGold(goldData.price);
      setSilver(silverData.price);

    } catch (e) {
      console.log("API Error:", e);
    }
  }


async function authentification() {
  setLoading(true);
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/api/auth/securetransaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ PIN: authPIN })
  });

  const data = await res.json();

  if (!res.ok) {
    setLoading(false);
    setNotification({ msg: data.message, type: "error" });
    setisAuthorized(false);
    return;
  }

  // ✅ Mark user as verified (temporary)
  sessionStorage.setItem("pinVerified", "true");
  setLoading(false);
  setisAuthorized(false);
  navigate("/transfermoney");
}

  async function accData(){
    setLoading(true);
    const token=localStorage.getItem("token");
    const API=await fetch("http://localhost:3000/api/account/accdata",{
      method:"GET",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      }
    });
    if(!API.ok){
      setLoading(false);
      return setNotification({msg:"Error",type:"error"})
    }
    const data=await API.json();
    setgraphdata(data);
    setaccNo(data.accountNo);
    setaccBalance(data.balance);
    setsendMoney(data.debitAmt);
    setreceivedMoney(data.creditAmt);
    console.log(data);

    setLoading(false);
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
     
          <Link className='Link' to="/home">
          <div
            className={`navItem ${activeNav === 'dashboard' ? 'navItemActive' : ''}`}
            onClick={() => setActiveNav('dashboard')}
          >
            <span className="navIcon">⊞</span> Dashboard
          </div>
          </Link>

          <Link className='Link' to="/trade">
          <div
            className={`navItem ${activeNav === 'transfers' ? 'navItemActive' : ''}`}
            onClick={() => setActiveNav('transfers')}
          >
            <span className="navIcon">◎</span> Portfolio
          </div>
          </Link>
           

           <Link className='Link' to="/stockhistory">
          <div
            className={`navItem ${activeNav === 'history' ? 'navItemActive' : ''}`}
            onClick={() => setActiveNav('history')}
          >
            
            <span className="navIcon">↺</span> History
          </div>
          </Link>
          <Link className='Link' to="/trade">
          <div
            className={`navItem ${activeNav === 'trade' ? 'navItemActive' : ''}`}
            onClick={() => setActiveNav('trade')}
          >
            <span className="navIcon">⇄</span> Trade
          </div>
        </Link>


          <span className="navLabel" style={{ marginTop: '16px' }}>Account</span>

          <div
            className={`navItem ${activeNav === 'security' ? 'navItemActive' : ''}`}
            onClick={() => setActiveNav('security')}
          >
            <span className="navIcon">🔒</span> Security &amp; PIN
          </div>
          
          <Link className='Link' to="/setting">
          <div
            className={`navItem ${activeNav === 'settings' ? 'navItemActive' : ''}`}
            onClick={() => setActiveNav('settings')}
          >
            <span className="navIcon">⚙</span> Settings
          </div>
          </Link>
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
            revealBalance?(<span className="stripStatVal">₹ {accBalance.toFixed(2)}</span>):
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
           <div className="graphandaccstatus">
            <div className="balance">
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
  </div>
  <div className="TRADING">
 
  <div className="graph">
        <div className="GoldGraph">
      <h2>Gold</h2><br></br>
      <Graph setGoldprice={setGoldprice}/>
      </div>
      
      <div className="SilverGraph">
      <h2>Silver</h2><br></br>
      <GraphSilver setSilverprice={setSilverprice} />
  </div>
  
 
  </div>
<Link to="/trade" className='Link'> <span className="cta">Trade →</span></Link> 
</div>
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
                
                  <button className="transferBtn" onClick={() => {setisAuthorized(true)}} >Continue</button>
        
                
              </div>
            </div>


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

        <button className="process-btn" onClick={authentification}>
          Proceed
        </button>
        <button className="cancle-btn" onClick={()=>setisAuthorized(false)}>
          Cancle
        </button>

      </div>
    </div>
  )
}

            {/* RIGHT CARD */}
            <div className="anotherBox">
              <div className="anotherBoxTitle">More Options</div>
                
                <Link to="/stockhistory"className='Link' >
              <div className="cardItem">
                <h3>Transaction History</h3>
              </div>
              </Link>

              <Link className='Link' to="/changepin">
              <div className="cardItem">
                <h3>Request Money</h3>
              </div>
              </Link>

              <div className="cardItem" onClick={() => { setPinModel(true); check(); }}>
                <h3>Set Account PIN</h3>
              </div>
              <Link className='Link' to="/changepin">
              <div className="cardItem changepin">
                <h3>Change Account PIN</h3>
              </div>
              </Link>
              <Link className='Link' to="/setting">
              <div className="cardItem changepin">
                <h3>Setting</h3>
              </div>
              </Link>
            </div>
               
          </div>
       
        </div>
      </div>
    </div>
  );
};

export default Home;