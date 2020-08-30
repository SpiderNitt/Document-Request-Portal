import React from "react";
import "./login.css";

function Login(props) {
  return (
    // <div>
    <div className="container lmain">
      <div className="row lmain-logo justify-content-center ">
        <img src="nitt-lr.png" alt="logo" />
      </div>
      <br />
      <div className="row lmain-head justify-content-center">
        <h1>Certificate Approval Portal</h1>
      </div>
      <br />
      <div className="row lmain-rno justify-content-center">
        <div className="col-md-2">
          <label htmlFor="rno">
            <b>Roll Number</b>
          </label>
        </div>
        <div className="col-md-2">
          <input type="text" name="rno" required />
        </div>
      </div>
      <br />
      <div className="row lmain-pass justify-content-center">
        <div className="col-md-2">
          <label htmlFor="pass">
            <b>Password</b>
          </label>
        </div>
        <div className="col-md-2">
          <input type="password" name="pass" required />
        </div>
      </div>
      <br />
      <div className="row lmain-btn justify-content-center">
        <div className="col-md-1">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </div>
    </div>
    // </div>
  );
}

export default Login;
