import React, { useState } from "react";
import "./Pin.css";

const Pin = ({setPinModel ,setNotification}) => {
  const [pin, setPin] = useState("");
  const [cpin, setCpin] = useState("");
  const [userData, setUserData] = useState(null);

  function handleModel(){
    setPinModel(false);
  }

  async function handleSetPin() {
    if (pin !== cpin) {
      setNotification({
             msg:"Pins not match",
             type: "error"
          })
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      setNotification({
             msg:"PIN must be exactly 4 digits",
             type: "error"
          })
       return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/account/setpin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();
     
      if(data.message==="Transaction PIN set successfully"){
          setUserData(data.user);
          setNotification({
             msg:"Transaction PIN set successfully",
             type: "success"
          })
          setPinModel(false);
      }else if(data.message==="PIN already set. Use change PIN."){
        setNotification({
             msg:"PIN already set. Use change PIN.",
             type: "error"
          })
          setPinModel(false);
      }
      

    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <div className="overlay">
      <div className="card">

        <h2 className="title">🔐 Set Your PIN</h2>

        {!userData ? (
          <>
            <input
              type="password"
              placeholder="Enter PIN"
              className="input"
              onChange={(e) => setPin(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm PIN"
              className="input"
              onChange={(e) => setCpin(e.target.value)}
            />
          </>
        ) : (
          <div className="userInfo">
            <h3>✅ PIN Set Successfully</h3>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Balance:</strong> ₹ {userData.balance}</p>
          </div>
        )}
         <div className="buttons">
            <button className="button" onClick={handleSetPin}>
              Set PIN
            </button>
            <button className="button" onClick={handleModel} >
              Cancel
            </button>
            
            </div>


      </div>
    </div>
  );
};

export default Pin;