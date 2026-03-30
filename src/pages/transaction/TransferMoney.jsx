import React, { useState } from 'react'
import  Header from "../../components/common/Header.jsx";
const TransferMoney = () => {

    const [selected,setselected]=useState(true);
    const [accounts,setAccounts]=useState([]);
    

  return (
    <div>
      <Header/>

      <div className="transactionbox">
       { selected && (
        <div className="Money">
            <div className="TransferMoney">
                <div className="txt">TransferMoney</div>
                <div className="email">
                    <div className="inputfield">
                    <input type='email' placeholder='Search Account' />
                    <button className="sendMoney">Search</button>
                    </div>
                    <input type="Number" placeholder='Amount'/>
                    <input type="password" placeholder='Enter PIN'/>
                    <button className="sendMoney">Procced</button>
                </div>
            </div>
        </div>
)        }
      </div>

    </div>
  )
}

export default TransferMoney
