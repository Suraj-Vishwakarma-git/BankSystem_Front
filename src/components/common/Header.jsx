import React, { useEffect, useState } from 'react'
import logo from "./logo.png"
import { useNavigate } from 'react-router-dom';
import "./Header.css"
import { useLoading } from '../../context/LoadingContext.jsx';
const Header = ({setispinExits}) => {
  
  const [name,setName]=useState("");
  const [accNo,setaccNo]=useState("");
  const [email,setEmail]=useState("");
  const [profileModel,setprofileModel]=useState(false);
 
  const navigate = useNavigate();
  function handleLogout(){
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/");
  }
  const {setLoading}=useLoading();

  if(!localStorage.getItem("token")){
    sessionStorage.clear();
    navigate("/");
  }


 async function accDetails() {
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    const API = await fetch("http://localhost:3000/api/auth/accdetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await API.json();
    console.log(data);

    setaccNo(data.userAccount.accountNumber);
    setName(data.userAccount.name);
    setEmail(data.email);

    if (data.userAccount.transactionPin && typeof setispinExits === "function") {
      setispinExits(true);
    }

  } catch (error) {
    console.log("Error:", error);
  } finally {
    setLoading(false);   // ✅ ALWAYS runs
  }
}

  useEffect(()=>{
    accDetails();
  },[])

  return (
    <div className='Header'>
      {
        profileModel && (
          <div className="navBar">
            <div className="Alogo"></div>
            <div className="Aname">{name}</div>
            <div className="Aemail">{email}</div>
            <div className="AaccNo">{accNo}</div>
            <div className="btnss">
            <div className="logoutbtn" onClick={handleLogout}>Logout</div>
            <div className="cancle" onClick={()=>setprofileModel(false)}>Cancel</div>
          </div>
          </div>
        )
      }
  
  <div className="Headerlogo"> 
    <img src={logo} className='Headlogo' />
    <h2 className="Headtitle">ApexTrust</h2>
  </div>

  <button className="profileInfo" onClick={()=>setprofileModel(true)}>
    <img 
      src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
      alt="dp" 
      className="profileImg"
    />
    <span className="username">{name}</span>
  </button>

</div>
  )
}

export default Header
