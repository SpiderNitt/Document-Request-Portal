import React, { useState,useEffect } from "react";
import "./login.css";
import spider from "../utils/API";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtHandler from "../utils/parsejwt";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
function AlumniLogin(props) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [emailId, setEmail] = useState("");
  const [otpVerify, otpVerifyBox] = useState(false);
  useEffect(()=>{
    if(otpVerify){
      if(seconds>0){
        setTimeout(()=>{
          setSeconds(seconds-1);
        },1000);
        document.getElementById("resOtp").innerHTML=`Resend OTP in ${Math.floor(seconds/60)}:${Math.floor((seconds%60)/10)}${Math.floor(seconds%10)}`;
        document.getElementById("resOtp").disabled = true;
      }
      else{
        document.getElementById("resOtp").innerHTML=`Resend OTP`;
        document.getElementById("resOtp").disabled = false;
      }
    }
  })
  const otpSubmit = (e) => {
    otpVerifyBox(false);
    e.preventDefault();
    setLoading(true);
    let email = emailId;
    let received_otp = document.getElementById("otp").value;
    const re = /\S+@\./;
    if (email.length && received_otp.length) {
      if (re.test(email) === false) {
        spider
          .post("/alumni/verify_otp", {
            email: email.trim(),
            received_otp: received_otp,
          })
          .then((res, err) => {
            const token = {};
            token.jwt = res.data.token;
            let user = jwtHandler(res.data.token);
            token.user = user.data.username;
            token.alumni = true;
            setLoading(false);
            localStorage.setItem("bonafideNITT2020user", JSON.stringify(token));
            history.push("/student");
          })
          .catch((err) => {
            setLoading(false);
            switch (err.response.status) {
              case 400:
              case 401:
              case 404:
              case 500:
              case 503:
                document.getElementById("login-error-message").innerHTML = "";
                break;
              default:
                document.getElementById("login-error-message").innerHTML =
                  "Service currently unavailable. Please try again later.";
                setLoading(false);
                break;
            }
          });
      } else {
        setLoading(false);
        document.getElementById("username-error-message").innerHTML =
          "Invalid email id";
      }
    } else {
      setLoading(false);
      document.getElementById("login-error-message").innerHTML =
        "Invalid OTP";
      document.getElementById("loginForm").reset();
    }
  }
  const loginHandler = (e) => {
    otpVerifyBox(false);
    setLoading(true);
    e.preventDefault();
    let email = document.getElementById("email").value;
    setEmail(email);
    if (email.length) {
      spider
        .post("/alumni/login", {
          email: email,
        })
        .then((res,err) => {
          console.log(res);
          setLoading(false);
          document.getElementById("login-error-message").innerHTML = "";
          otpVerifyBox(true);
          setSeconds(100);
        })
        .catch((err) => {
          setLoading(false);
          switch (err.response.status) {
            case 400:
            case 401:
            case 404:
            case 409:
            case 500:
            case 503:
              document.getElementById("login-error-message").innerHTML = "";
              break;
            default:
              setLoading(false);
              document.getElementById("login-error-message").innerHTML =
                "Service currently unavailable. Please try again later.";
              break;
          }
        });
    } else {
      setLoading(false);
      document.getElementById("login-error-message").innerHTML =
        "Fill all the fields!";
      document.getElementById("loginForm").reset();
    }
  };
  const resendOtp=(e)=>{
    otpVerifyBox(false);
    setLoading(true);
    e.preventDefault();
    let email = emailId;
      spider
        .post("/alumni/resend_otp", {
          email: email,
        })
        .then((res,err) => {
          setLoading(false);
          otpVerifyBox(true);
          document.getElementById("login-error-message").innerHTML = "";
          setSeconds(100);  
        })
        .catch((err) => {
          setLoading(false);
          switch (err.response.status) {
            case 400:
              document.getElementById("login-error-message").innerHTML = "";
              break;
            case 401:
            case 404:
            case 409:
            case 500:
            case 503:
            default:
              setLoading(false);
              document.getElementById("login-error-message").innerHTML =
                "Service currently unavailable. Please try again later.";
              break;
          }
        });
 }

  return (
    <div className="container-fluid lmain" id="login-content">
      <div id="main-content">
        <div className="row lmain-logo justify-content-center ">
          <img src="../nitt-lr.png" alt="logo" />
        </div>
        <br />
        <div className="row lmain-head justify-content-center">
          <h1>Document Requisition Portal</h1>
        </div>
        <div className="row lmain-head justify-content-center">
          <h4>(Alumni Login)</h4>
        </div>
        <br />
        <form id="loginForm">
          <div className="row lmain-pass justify-content-center">
            <div className="col-6">
              <label htmlFor="email">
                <b>Email</b>
              </label>
            </div>
            <div className="col-6">
              <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  required
                  onChange={() => {
                    document.getElementById("login-error-message").innerHTML =
                      "";
                  }} 
              />
            </div>
          </div>
          <small id="login-error-message" className="error"></small>
          <br />
          <br />
          {isLoading ? (
            <Loader
              className="text-center"
              type="Audio"
              color="rgb(13, 19, 41)"
              height={100}
              width={100}
            />
          ) : (
            <div className="row lmain-btn justify-content-center">
              {otpVerify ? (
                <div className="row lmain-rno justify-content-center">
                  <div className="col-12">
                    <label htmlFor="otp">
                      <b>Enter OTP</b>
                    </label>
                  </div>
                  <div className="col-12">
                    <input
                      type="number"
                      name="otp"
                      id="otp"
                      required
                      maxLength="6"
                    /> 
                  </div>
                  <div className="mt-3">
                    <Button variant="secondary" onClick={resendOtp} id="resOtp">
                      Resend OTP
                    </Button>
                    <Button variant="primary" className="ml-2" onClick={otpSubmit}>
                      Submit
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="col-md-12">
                  <button
                    type="submit"
                    onClick={loginHandler}
                    className="btn btn-primary"
                  >
                    Send OTP
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <>
        </>
      </div>
    </div>
  );
}

export default AlumniLogin;