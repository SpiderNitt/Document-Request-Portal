import React, { useState } from "react";
import "./login.css";
import spider from "../utils/API";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtHandler from "../utils/parsejwt";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function Login(props) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const loginHandler = (e) => {
    e.preventDefault();
    // document.getElementById("main-content").classList.add("blur");
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
            // document.getElementById("main-content").classList.remove("blur");
            setLoading(false);
            localStorage.setItem("bonafideNITT2020user", JSON.stringify(token));
            if (isNaN(username)) history.push("/admin");
            else history.push("/student");
          })
          .catch((err) => {
            // document.getElementById("loginForm").reset();
            // document.getElementById("main-content").classList.remove("blur");
            setLoading(false);
            // if (err.status === 401) {
            //   document.getElementById("login-error-message").innerHTML =
            //     "Invalid Username or Password";
            // if (err.status === 500) {
            //   document.getElementById("login-error-message").innerHTML =
            //     "Internal Server Error. Please try again later.";

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
        // alert("Not @nitt");
        // document.getElementById("main-content").classList.remove("blur");
        setLoading(false);
        document.getElementById("username-error-message").innerHTML =
          "Enter username without @nitt suffix";
      }
    } else {
      // document.getElementById("main-content").classList.remove("blur");
      setLoading(false);
      document.getElementById("login-error-message").innerHTML =
        "Incomplete Username or Password";
      document.getElementById("loginForm").reset();
    }
  };

  return (
    <div className="container-fluid lmain" id="login-content">
      {/* <div id="loader"> */}

      {/* </div> */}
      <div id="main-content">
        <div className="row lmain-logo justify-content-center ">
          <img src="nitt-lr.png" alt="logo" />
        </div>
        <br />
        <div className="row lmain-head justify-content-center">
          <h1>Document Requisition Portal</h1>
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
            <div className="row lmain-pass justify-content-center">
              <div className="col-12">
                <label htmlFor="pass">
                  <b>Password</b>
                </label>
              </div>
              <div className="col-12">
                <input type="password" name="pass" id="pass" required />
              </div>
            </div>
            <small id="login-error-message" className="error"></small>
            <br />
            <br />
            <div className="row lmain-btn justify-content-center">
              <div className="col-md-12">
                <button
                  type="submit"
                  onClick={loginHandler}
                  className="btn btn-primary"
                >
                  Login
                </button>
              </div>
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
  );
}

export default Login;
