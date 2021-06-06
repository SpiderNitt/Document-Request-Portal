import React, { useState } from "react";
import "./login.css";
import spider from "../utils/API";
import { useHistory, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtHandler from "../utils/parsejwt";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function AlumniLogin(props) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const loginHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let email = document.getElementById("email").value;
    if (email.length) {
        spider
          .post("/login", {
            email: email
          })
          .then((res, err) => {
            // const token = {};
            // token.jwt = res.data.token;
            // let user = jwtHandler(res.data.token);
            // token.user = user.data.username;
            // setLoading(false);
            // localStorage.setItem("bonafideNITT2020user", JSON.stringify(token));
            // if (isNaN(username)) history.push("/admin");
            // else history.push("/student");

            //TODO: IF THE EMAIL ID IS REGISTERED, NEED TO SHOW THE SCREEN TO INPUT OTP
            //ELSE RESPONSE ERROR FROM BACKEND
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
      document.getElementById("login-error-message").innerHTML =
        "Fill all the fields!";
      document.getElementById("loginForm").reset();
    }
  };

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
            <div className="row lmain-pass justify-content-center">
              <div className="col-12">
                <label htmlFor="email">
                  <b>Email</b>
                </label>
              </div>
              <div className="col-12">
                <input type="email" name="email" id="email" required />
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
            <br />
            <div className="row lmain-btn justify-content-center">
              <b> Not registered yet? </b> <Link to="/alumni/register"> <b> &nbsp;Register </b>  </Link> <b> &nbsp;here. </b>
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

export default AlumniLogin;