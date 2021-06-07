import React, { useState } from "react";
import "./login.css";
import spider from "../utils/API";
import TextField from "@material-ui/core/TextField";
import { useHistory, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtHandler from "../utils/parsejwt";
import Loader from "react-loader-spinner";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
function AlumniRegister(props) {
  const history = useHistory();
  const [otpVerify, otpVerifyBox] = useState(false);
  const [emailId, setEmail] = useState("");
  const handleClose = () => otpVerifyBox(false);
  const [isLoading, setLoading] = useState(false);
  const resendOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    let email = emailId;
    spider
    .post("/alumni/resend_otp",{
      email:email
    }).then((res, err) => {
      setLoading(false);
      document.getElementById("login-error-message").innerHTML = "";
    }).catch((err) => {
      setLoading(false);
      switch (err.response.status) {
        case 400:
          document.getElementById("login-error-message").innerHTML = "Unable to send OTP";
          break;
        default:
          document.getElementById("login-error-message").innerHTML =
            "Service currently unavailable. Please try again later.";
          setLoading(false);
          break;
      }
    });
  }
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
            token.alumni = true;
            token.user = user.data.username;
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
        "Incomplete Username or Password";
      document.getElementById("loginForm").reset();
    }
  }
  const regHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let name = document.getElementById("name").value;
    let roll_no = document.getElementById("roll").value;
    let department = document.getElementById("dept").value;
    let email = document.getElementById("email").value;
    setEmail(email);
    let mobile = document.getElementById("mobile").value;
    if (name.length && roll_no.length && department.length && email.length && mobile.length) {
        spider
          .post("/alumni/register", {
            name: name,
            roll_no: roll_no,
            department: department,
            email: email,
            mobile: mobile
          })
          .then((res, err) => {
            setLoading(false);
            document.getElementById("login-error-message").innerHTML = "";
            otpVerifyBox(true);
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
          <h4>(Alumni Registration)</h4>
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
                <label htmlFor="name">
                  <b>Name</b>
                </label>
              </div>
              <div className="col-12">
                <input
                  type="text"
                  name="name"
                  id="name"
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
            <div className="row lmain-rno justify-content-center">
              <div className="col-12">
                <label htmlFor="roll">
                  <b>Roll Number</b>
                </label>
              </div>
              <div className="col-12">
                <input
                  type="number"
                  name="roll"
                  id="roll"
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
            <div className="row lmain-rno justify-content-center">
              <div className="col-12">
                <label htmlFor="dept">
                  <b>Department</b>
                </label>
              </div>
              <div className="col-12">
                <input
                  type="text"
                  name="dept"
                  id="dept"
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
                <label htmlFor="email">
                  <b>Email</b>
                </label>
              </div>
              <div className="col-12">
                <input type="email" name="email" id="email" required />
              </div>
            </div>
            <br />
            <div className="row lmain-rno justify-content-center">
              <div className="col-12">
                <label htmlFor="mobile">
                  <b>Mobile Number</b>
                </label>
              </div>
              <div className="col-12">
                <input
                  type="number"
                  name="mobile"
                  id="mobile"
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
              <small id="login-error-message" className="error"></small>
            </div>
            <br />
            <div className="row lmain-btn justify-content-center">
              <div className="col-md-12">
                <button
                  type="submit"
                  onClick={regHandler}
                  className="btn btn-primary"
                >
                  Register
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
        <>
        <Modal show={otpVerify} onHide={handleClose} >
          <Modal.Header  closeButton>
            <Modal.Title>Verify OTP</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form noValidate autoComplete="off">
                <TextField
                  id="otp"
                  label="Enter OTP"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resendOtp}>
              Resend OTP
            </Button>
            <Button variant="primary" onClick={otpSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
      </div>
    </div>
  );
}

export default AlumniRegister;