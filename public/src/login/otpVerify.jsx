import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./otpVerify.css"


const OtpVerify = () => {
    
    const [enteredOTP, setEnteredOTP] = useState();
    const [otpArray, setOtpArray] = useState(new Array(6).fill(""));
    const [otpSent, setOtpSent] = useState(false); // resending otp
    const [timer, setTimer] = useState(120);
    const [isDisabled, setDisabled] = useState(true);

    const isAllInputFilled = () => {
      return otpArray.every((value) => value !== '');
    };

    const verifyOTP=()=> {
      // console.log(OTP);
      //make API Call
      let otp = 123456; //for example

      if(isAllInputFilled()){
        if(otp === enteredOTP){
          toast.info('Verified!');
        }
        else{
        toast.error('Wrong OTP!');
        }
      }
      else{
        toast.error('Fill OTP Completely');
      }
   };

    const resendOTP=()=>{
      //Make api call


      setOtpSent(true);
      if(otpSent){
        toast.info('OTP Sent Successfully!');

        setDisabled(true);
        setTimer(120);
      }

    }

    const handleInputOtp=(element, index)=>{
        if(isNaN(element.value))  return false;

        setOtpArray([...otpArray.map((d, idx)=> (idx===index) ? element.value : d)])
        toggleFilledClass(element);
        if(element.nextSibling)
            element.nextSibling.focus();
    }

    const toggleFilledClass=(field)=>{
      if (field.value) {
        field.classList.add("filled");
      } else {
        field.classList.remove("filled");
      }
    };

    
    const handleBackspace=(e,element, index)=>{ //handle delete otp using backSpace
      if(e.keyCode === 8){
        e.preventDefault();
        // element.value='';
        toggleFilledClass(element);
        setOtpArray([...otpArray.map((d, idx)=> (idx===index)?'':d)])
        if(element.previousSibling)
          element.previousSibling.focus();
      }
    }

    useEffect(() => {
        setEnteredOTP(parseInt(otpArray.join("")));

        const interval = setInterval(() => {
          if (timer > 0) {
            setTimer(timer - 1);
          }
          if (timer === 0) {
            setDisabled(false);
            setTimer(0);
          }
        }, 1000);
        return () => {
          clearInterval(interval);
        };
      }, [timer]);

    
  return (
    <div className="container-fluid lmain" id="otp-verify-content">
      <div id="main-content justify-content-center">
        <div className="row lmain-logo justify-content-center ">
          <img src="nitt-lr.png" alt="logo" />
        </div>
        <br />
        <div className="row lmain-head justify-content-center">
          <h1>Document Requisition Portal</h1>
        </div>
        <div className="row lmain-head justify-content-center">
          <h4>(Student Login)</h4>
        </div>
        <br />
        <div className="row lmain-head justify-content-center mb-4">
          <h4>OTP Verification</h4>
        </div>
        <div>
        <p>Enter the OTP received in the Lynx</p>
        <div className="otp-group">
            {otpArray.map((digit, idx) => (
                <input
                key={idx}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength="1"
                pattern="\d{1}"
                className="otp-input"
                value={digit}
                onInput={e => handleInputOtp(e.target, idx)}
                onKeyDown={e => handleBackspace(e,e.target, idx)}
                // onFocus={e => e.target.select()}
                />
            ))}
        </div>
        </div>
        
        <div className='verify-resend-button' style={{width:"100%"}}>
            <button className="btn btn-secondary mr-5" disabled={isDisabled} onClick={resendOTP}>Resend</button>
            <button type='submit' className='btn btn-primary'onClick={verifyOTP}>Verify OTP</button>
        </div>
        <div className="resend-otp">Resend OTP in <span className='resend-timer'>{timer}</span> sec</div>

       </div>
       <ToastContainer
       position="top-right"
       autoClose={5000}
       hideProgressBar
       newestOnTop={false}
       closeOnClick
       rtl={false}
       pauseOnFocusLoss
       draggable
       pauseOnHover
       theme="light"
       />
    </div>
  )
}

export default OtpVerify
