import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./dashboardMain.png"
import "./common.css" 
const Dashboard = () => {
  const [login, setLogin] = useState(true);
  const [name,setName]=useState("");
  const [password,setPassword]=useState("");
  const [email,setEmail]=useState("");


  async function Signup(){
    const API=await fetch("http://localhost:3000/api/auth/signup",{
           method:"POST",
           headers:{
            "Content-Type":"application/json"
           },
           body:JSON.stringify({
            name:name,
            email:email,
            password:password
           })
          });
     const data=await API.json();
     console.log(data);
     alert(data.message);
     setName("");
     setEmail("");
     setPassword("");
  }


  return (
    <div className="mainContainer">


      <div className="content">

        {/* LEFT SIDE */}
        <div className="left">
          <div className="textt">
          <h2 className="txt">Investments</h2>
          <p className="txt1">That bring you closer to your dreams</p>
          </div>
          <div className="img">
         <img src={logo} className="logoImg" style={{height:"100px"}} />
         </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <div className="authCard">

            <h2>Welcome to ApexTrust</h2>

            <div className="topBtn">
              <button
                className={login ? "active" : ""}
                onClick={() => setLogin(true)}
              >
                Login
              </button>

              <button
                className={!login ? "active" : ""}
                onClick={() => setLogin(false)}
              >
                Register
              </button>

              <div className={`slider ${login ? "left" : "right"}`} />
            </div>
            <div className="animationBar">
            <AnimatePresence mode="wait">
              {login ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.3 }}
                >
              <div>
              <div className="mainBox">
                <input className='text' type='text' placeholder='Enter Your Email' onChange={(e)=>setEmail(e.target.value)}/>
                <input className='text' type="password" placeholder='Enter Your Password' onChange={(e)=>setPassword(e.target.value)} />
                <div className="btns">
                  <button className='loginbtn'>Login</button>
                  <button className='forgetbtn' >Forget Password?</button>
                  </div>
              </div>
            </div>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                >
                   <div>
                <div className="mainBox">
                  <input className='text' type='text' placeholder='Enter Your Name' onChange={(e)=>setName(e.target.value)}/>
                  <input className='text' type='text' placeholder='Enter Your Email'onChange={(e)=>setEmail(e.target.value)} />
                  <input className='text' type="password" placeholder='Password'onChange={(e)=>setPassword(e.target.value)}/>
                  <div className="btns">
                    <button className='signupbtn' onClick={Signup}>Signup</button>
                    </div>
                </div>
              </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>          

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;