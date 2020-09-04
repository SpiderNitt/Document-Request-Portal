import React from "react";
import "./login.css";
import spider from "../utils/API";
import { useHistory } from "react-router-dom";

function Login(props) {
  const history = useHistory();
  const loginHandler = (e) => {
    e.preventDefault();
    let username = document.getElementById("rno").value;
    let password = document.getElementById("pass").value;

    if (username.length && password.length) {
      spider
        .post("/login", {
          username: username,
          password: password,
        })
        .then((res, err) => {
          console.log("Cool");
          localStorage.setItem(
            "bonafideNITT2020user",
            JSON.stringify(res.data.token)
          );
          console.log(localStorage.getItem("bonafideNITT2020user"));
          history.push("/student");
        })
        .catch((err) => {
          console.log(err);
        });
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
        <div className="col-md-6">
          <label htmlFor="rno">
            <b>Roll Number</b>
          </label>
        </div>
        <div className="col-md-6">
          <input type="text" name="rno" id="rno" required />
        </div>
      </div>
      <br />
      <div className="row lmain-pass justify-content-center">
        <div className="col-md-6">
          <label htmlFor="pass">
            <b>Password</b>
          </label>
        </div>
        <div className="col-md-6">
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
    </div>
  );
}

export default Login;
