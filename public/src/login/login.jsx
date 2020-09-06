import React from "react";
import "./login.css";
import spider from "../utils/API";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login(props) {
  const history = useHistory();
  const loginHandler = (e) => {
    console.log("clicked");
    e.preventDefault();
    let username = document.getElementById("rno").value;
    let password = document.getElementById("pass").value;
    const re = /\S+@nitt\.edu/;
    if (username.length && password.length) {
      if (re.test(username) === false) {
        spider
          .post("/login", {
            username: username,
            password: password,
          })
          .then((res, err) => {
            console.log(res);
            localStorage.setItem(
              "bonafideNITT2020user",
              JSON.stringify(res.data.token)
            );
            console.log(localStorage.getItem("bonafideNITT2020user"));
            if (isNaN(username)) history.push("/admin");
            else history.push("/student");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        alert("Not @nitt");
      }
    } else {
      console.log("Invalid username or password");
    }
  };

  return (
    <div className="container-fluid lmain ">
      <div className="row lmain-logo justify-content-center ">
        <img src="nitt-lr.png" alt="logo" />
      </div>
      <br />
      <div className="row lmain-head justify-content-center">
        <h1>Certificate Approval Portal</h1>
      </div>
      <br />
      <div className="row lmain-rno justify-content-center">
        <div className="col-12">
          <label htmlFor="rno">
            <b>Roll Number</b>
          </label>
        </div>
        <div className="col-12">
          <input type="text" name="rno" id="rno" required />
        </div>
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
  );
}

export default Login;
