import React, { useState } from "react";
import "./login.css";
import spider from "../utils/API";
import { useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TextField from "@material-ui/core/TextField";
import "react-toastify/dist/ReactToastify.css";
import jwtHandler from "../utils/parsejwt";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
function AlumniLogin(props) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [emailId, setEmail] = useState("");
  const [otpVerify, otpVerifyBox] = useState(false);
  const handleClose = () => otpVerifyBox(false);
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
        "Incomplete Username or Password";
      document.getElementById("loginForm").reset();
    }
  }
  const loginHandler = (e) => {
    setLoading(true);
    e.preventDefault();
    let email = document.getElementById("email").value||emailId;
    setEmail(email);
    if (email.length) {
      spider
        .post("/alumni/login", {
          email: email,
        })
        .then((res,err) => {
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
                  Send OTP
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
          <Modal show={otpVerify} onHide={handleClose} backdrop="static">
            <Modal.Header>
              <Modal.Title>Verify OTP</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">The OTP is sent to your email ID.</div>
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
              <Button variant="secondary" onClick={loginHandler}>
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

export default AlumniLogin;