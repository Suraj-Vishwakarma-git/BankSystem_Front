import React from 'react'

const LoginPage = () => {
  return (
    <div>
      <div className="mainBox">
        <input className='text' type='text' placeholder='Enter Your Email'/>
        <input className='text' type="text" placeholder='Enter Your Password'/>
        <div className="btns">
          <button className='loginbtn'>Login</button>
          <button className='forgetbtn' >Forget Password?</button>
          </div>
      </div>
    </div>
  )
}

export default LoginPage;
