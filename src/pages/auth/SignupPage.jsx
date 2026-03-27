import React from 'react'

const SignupPage = () => {
  return (
    <div>
      <div className="mainBox">
        <input className='text' type='text' placeholder='Enter Your Name'/>
        <input className='text' type='text' placeholder='Enter Your Email'/>
        <input className='text' type="password" placeholder='Enter Your Password'/>
        <div className="btns"><button className='signupbtn'>Signup</button></div>
         
      </div>
    </div>
  )
}

export default SignupPage
