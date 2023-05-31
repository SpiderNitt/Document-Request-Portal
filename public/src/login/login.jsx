import React, { useState } from "react";
import "./login.css";
import spider from "../utils/API";
import { useHistory, Link } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtHandler from "../utils/parsejwt";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Card,Badge,Image } from "react-bootstrap";
import {
  useGoogleReCaptcha,
  GoogleReCaptchaProvider,
} from "react-google-recaptcha-v3";
import { LynxLoginAPICall, AdminAPICall } from "../utils/lynxAuthApi";
import { BrowserRouter as Router, Route } from "react-router-dom/cjs/react-router-dom.min";
import OtpVerify from "./otpVerify";

function Login(props) {
  const SITE_KEY = process.env.REACT_APP_SITE_KEY;
  const { executeRecaptcha } = useGoogleReCaptcha();
  const history = useHistory();
  const [otp,openOtp] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const loginHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let username = document.getElementById("rno").value;
    let password = document.getElementById("pass").value;
    const re = /\S+@nitt\.edu/;
    if (username.length && password.length) {
      if (re.test(username) === false) {
        spider
          .post("/login", {
            username: username.trim(),
            password: password,
          })
          .then((res, err) => {
            const token = {};
            token.jwt = res.data.token;
            let user = jwtHandler(res.data.token);
            token.user = user.data.username;
            setLoading(false);
            localStorage.setItem("bonafideNITT2020user", JSON.stringify(token));
            if (isNaN(username)) history.push("/admin");
            else history.push("/student");
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
          "Enter username without @nitt suffix";
      }
    } else {
      setLoading(false);
      document.getElementById("login-error-message").innerHTML =
        "Incomplete Username or Password";
      document.getElementById("loginForm").reset();
    }
  };

  const otpSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    let username = document.getElementById("rno").value;
    document.getElementById("rno").readonly=true;
    const re = /\S+@nitt\.edu/;
    if (username.length) {
      if (re.test(username) === false) {
        let reCaptchaToken = "";
      if (!executeRecaptcha) {
       //console.log("cannot be done");
      } else {
        reCaptchaToken = await executeRecaptcha();
        //console.log("done");
        if (!reCaptchaToken) {
          toast.error("Please enter recaptcha");
          return;
        }
      }
      if (!reCaptchaToken) {
        toast.error("Please enter recaptcha");
      } else {
        try {
          spider
          .post("/login/otp", {
            username: username.trim(),
            reCaptchaToken,
          })
          setLoading(false);
          localStorage.setItem("rollNo", username);
          openOtp(true);
          // if (isNaN(username)) 
          // history.push("/otpadmin");
          //   else history.push("/otpstudent");
        } catch (error) {
          setLoading(false);
          toast.error(error.response.message);
        }
      }
    }
       else {
        setLoading(false);
        document.getElementById("username-error-message").innerHTML =
          "Enter username without @nitt suffix";
      }
    } else {
      setLoading(false);
      document.getElementById("login-error-message").innerHTML =
        "Incomplete Username or Password";
      document.getElementById("loginForm").reset();
    }
    
  }
  const loginHandlerLYNX = async (e) => {
    e.preventDefault();
    setLoading(true);
    let username = document.getElementById("rno").value;
    let otp = document.getElementById("pass").value;
      if (!otp) {
       toast.error("Enter otp")
       return;
      } 
       else {
        try {
          spider
          .post("/login", {
            username: username.trim(),
            otp,
          }).then((res, err) => {
            const token = {};
            token.jwt = res.data.token;
            let user = jwtHandler(res.data.token);
            token.user = user.data.username;
            setLoading(false);
            localStorage.setItem("bonafideNITT2020user", JSON.stringify(token));
            if (isNaN(username)) history.push("/admin");
            else history.push("/student");
          })
        } catch (error) { 
          setLoading(false)         
          toast.error(error.response.message);
        }
      }
    }
  
  

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={SITE_KEY}
      scriptProps={{ async: true }}>
    <div className="container-fluid lmain" id="login-content">
      <div id="main-content">
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
        {isLoading ? (
          <Loader
            className="text-center"
            type="Audio"
            color="rgb(13, 19, 41)"
            height={100}
            width={100}
          />
        ) : (
          <form id="loginForm">
            <div className="row lmain-rno justify-content-center">
              <div className="col-12">
                <label htmlFor="rno">
                  <b>Roll Number / Username</b>
                </label>
              </div>
              <div className="col-12">
                <input
                  type="text"
                  name="rno"
                  id="rno"
                  required
                  onChange={() => {
                    document.getElementById("login-error-message").innerHTML =
                      "";
                    document.getElementById(
                      "username-error-message"
                    ).innerHTML = "";
                  }}
                />
              </div>
              <small id="username-error-message" className="error"></small>
            </div>
            <br />
            {otp&&(
            <div className="row lmain-pass justify-content-center">

              <div className="col-12">
                <label htmlFor="pass">
                  <b>Password</b>
                </label>
              </div>
              <div className="col-12">
                <input type="password" name="pass" id="pass" required />
              </div>
              
            </div>)
            }
            <br />
            <div className="row lmain-pass justify-content-center">
              {/* <div className="col-12">
                <label htmlFor="pass">
                  <b>Password</b>
                </label>
              </div>
              <div className="col-12">
                <input type="password" name="pass" id="pass" required />
              </div> */}
              <button
                  type="submit"
                  onClick={otp?loginHandler:otpSend}
                  className="btn btn-primary"
                >
                   
                  {otp?"Submit": <Link to="/verifyOTP"><><Badge><Image src="icons/lynx.png" width='50' height='50' /></Badge><span style={{color:"white"}}>Login with LYNX Auth/Send OTP to Webmail</span></></Link>}
                </button>
            </div>
            <small id="login-error-message" className="error"></small>
            <br />
            <div className="row lmain-btn justify-content-center">
              {/* <div className="col-md-12">
              
                
                <button
                  type="submit"
                  onClick={loginHandler}
                  className="btn btn-primary"
                >
                  Login
                </button>
              </div> */}
            </div>
            <br />
            <div className="row lmain-btn justify-content-center">
              <a href="https://students.nitt.edu/authpass/">Forgot Password? </a>&nbsp; <span>(Click to reset password, Your IP will be blocked after few incorrect attempts)</span>
            </div>
            <br></br>
            <div className="row lmain-btn justify-content-center">
              <b> Are you an alumni? </b> <b>&nbsp;Click </b>  &nbsp;<Link to="/alumni"><b>here. </b></Link>
            </div>
          </form>
        )}
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
      </div>
    </div>
    
    </GoogleReCaptchaProvider>
  );
}

export default Login;
