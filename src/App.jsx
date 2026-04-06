import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBord from './pages/dashbord/DashBord.jsx';
import Notification from './components/common/Notification.jsx';
import  TransferMoney from "./pages/transaction/TransferMoney";
import Home from './components/Home.jsx';
import TransactionHistry from './pages/transaction/TransactionHistry.jsx';
import { useLoading } from './context/LoadingContext.jsx';
import ChangeAccPIN from './pages/transaction/ChangeAccPIN.jsx';
function App() {
  const [notification,setNotification]=useState(null);
  const { loading} = useLoading();
  return (
    <BrowserRouter>
       {notification && (
              <Notification
                message={notification.msg}
                type={notification.type}
                onClose={() => setNotification(null)}
              />
      )}
      {loading && (
         <div className="overlay" id="overlay">
         <div className="spinner"></div>
          </div>
        ) }        
      <Routes>
        <Route path="/" element={<DashBord setNotification={setNotification} />} />
        <Route path="/home" element={<Home setNotification={setNotification} />} />
        <Route path="/transfermoney" element={<TransferMoney setNotification={setNotification}  />}/>
        <Route path="/transactionhistory" element={<TransactionHistry/>}/>
        <Route path='/changepin' element={< ChangeAccPIN setNotification={setNotification}  />} />
      </Routes>
    </BrowserRouter>
  );
  
}

export default App
