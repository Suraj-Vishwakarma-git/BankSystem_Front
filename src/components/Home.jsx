import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Home.css";
import TransferMoney from "../pages/transaction/TransferMoney";
import AccBalance from './transaction/AccBalance.jsx';
import Header from './common/Header.jsx';
import Pin from './transaction/Pin.jsx';
const Home = ({setNotification}) => {
  
  const navigate = useNavigate();
  function handleLogout(){
    localStorage.removeItem("token");
    navigate("/");
  }
  function check(){
    if(ispinExist){
      setNotification({
      msg: "User already has a PIN set",
     type: "error", // or "info"
  });
    }
  }
  const [ispinExist,setispinExits]=useState(false);
  const [balanceModel,setbalanceModel]=useState(false);
  const [pinModel,setPinModel]=useState(false);

  return (
    
    <div className="homeContainer">
      <Header setispinExits={setispinExits} setNotification={setNotification} />
      {
      balanceModel && (
        <div className="balance">
          <AccBalance setbalanceModel={setbalanceModel} />
        </div>
      )
    }
    {
      pinModel && !ispinExist &&  (
        <div className="setPin" >
        <Pin setPinModel={setPinModel} setNotification={setNotification}/>
        </div>
      )
    }

      <div className="mainBox">

        {/* LEFT CARD */}
        <div className="transactionBox">
          <h2 className="transferTitle">Transfer Money</h2>

          <div className="treeBoxes">

            <div className="optionCard" >
              <span className="icon">🏦</span>
              <span>Through Acc. No</span>
            </div>

            <div className="optionCard">
              <span className="icon">🔍</span>
              <span>Find Account</span>
            </div>

            <div className="optionCard" >
              <span className="icon">📧</span>
              <span>Through Email</span>
            </div>

          </div>
      <div className="tbtn">
     <Link to="/transfermoney"><button className="transferBtn">Continue</button></Link>
        </div>
        </div>

        {/* RIGHT CARD */}
        <div className="anotherBox">

          <div className="cardItem">
            <h3>Transaction History</h3>
          </div>

          <div className="cardItem">
            <h3>Request Money</h3>
          </div>

          <div className="cardItem" onClick={()=>{setPinModel(true),check()}}>
            <h3>Set Account PIN</h3>
          </div>
          <div className="cardItem changepin">
           <h3>Change Account PIN</h3> 
          </div>
          <div className="cardItem checkBalance" onClick={()=>setbalanceModel(true)}>
         <h3 >Check Account Balance</h3>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;