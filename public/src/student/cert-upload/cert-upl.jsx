import React, { useState, useEffect } from "react";
import spider from "../../utils/API";
import { ToastContainer } from "react-toastify";
import { Modal } from "react-bootstrap";
import CertificateTemplate from "../cert-templates/cert-temp";
import Loader from "react-loader-spinner";

import "./cert-upl.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function Upload(props) {
  const user = JSON.parse(localStorage.getItem("bonafideNITT2020user")).user;
  const [emailCount, setCount] = useState(0);
  const [emails, setEmails] = useState([]);

  const [cert_pdf, setCertPdf] = useState(null);
  const [id_pdf, setIdPdf] = useState(null);
  const [view_file, setViewFile] = useState(null);

  const [file, setFile] = useState("Bonafide");
  const [fileModal, setFileModal] = useState(false);
  const [fileName, setFileName] = useState("");

  const [cert_fileName, setCertFileName] = useState("");
  const [id_fileName, setIdFileName] = useState("");
  const [cert_fileButton, setCertFileButton] = useState("");
  const [id_fileButton, setIdFileButton] = useState("");

  const [showModal, setModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [feeReceipt, setFee] = useState("");
  const [emailDel, setEmailDel] = useState("");
  const [address, setAddress] = useState("");
  const [preAddress, setPreAddr] = useState([]);
  const [addressModal, setAddressModal] = useState(false);
  const [contact, setContact] = useState("");
  const [purpose, setPurpose] = useState("");

  useEffect(() => {
    spider
      .get("/api/student/address")
      .then((res) => {
        res.data.forEach((add) => {
          setPreAddr((p) => p.concat(add));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmitClose = () => setModal(false);
  const handleAddressClose = () => setAddressModal(false);

  const handleCertFileUpload = (e) => {
    if (e.target.files[0]) {
      let filePath = e.target.value;
      var allowedExtensions = /(\.docx|\.DOCX|\.doc|\.DOC|\.pdf|\.PDF)$/;
      if (!allowedExtensions.exec(filePath)) {
        e.target.value = "";
        document.getElementById("file-error-message").innerHTML =
          "File extension must be .doc, .docx or .pdf";
      } else {
        document.getElementById("file-error-message").innerHTML = "";
        setCertPdf(URL.createObjectURL(e.target.files[0]));
        setCertFileButton(true);
        setCertFileName(e.target.files[0].name);
      }
    } else {
      setCertFileName(null);
      setCertFileButton(true);
    }
  };

  const handleIdFileUpload = (e) => {
    if (e.target.files[0]) {
      let filePath = e.target.value;
      var allowedExtensions = /(\.docx|\.DOCX|\.doc|\.DOC|\.pdf|\.PDF)$/;
      if (!allowedExtensions.exec(filePath)) {
        e.target.value = "";
        document.getElementById("file-error-message").innerHTML =
          "File extension must be .doc, .docx or .pdf";
      } else {
        document.getElementById("file-error-message").innerHTML = "";
        setIdPdf(URL.createObjectURL(e.target.files[0]));
        setIdFileButton(true);
        setIdFileName(e.target.files[0].name);
      }
    } else {
      setIdFileName(null);
      setIdFileButton(true);
    }
  };

  const handleClose = () => setFileModal(false);
  const handleFileOpen = () => setFileModal(true);

  const certificateRequest = (e) => {
    e.preventDefault();
    setLoading(true);
    let fileUpload = document.getElementById("cert").files[0];
    let college_id = document.getElementById("college-id").files[0];
    let certType = document.getElementById("certType").value;
    let cd = new FormData();
    if (certType === "bonafide") cd.set("type", parseInt(1));
    else cd.set("type", parseInt(2));
    cd.append("certificate", fileUpload);
    cd.append("certificate", college_id);
    if (emailDel && document.getElementById("email-sel").checked) cd.set("email", emailDel);
    if (address && document.getElementById("postal-del").checked) cd.set("address", address);
    if (feeReceipt) cd.set("receipt", feeReceipt);
    if (contact) cd.set("contact", contact);
    if (purpose) cd.set("purpose", purpose);
    cd.set("path", emails.toString());
    for (var pair of cd.entries()) {
      console.log("ccd:", pair[0] + ", " + pair[1]);
    }
    spider
      .post("api/student/certificate_request", cd)
      .then((res) => {
        console.log(res);
        setModal(false);
        setLoading(false);
        setCount(0);
        setEmails([]);
        setCertFileButton(false);
        setIdFileButton(false);
        setFileModal(false);
        setFileName("");
        setAddress("");
        setEmailDel("");
        setFee("");
        setPurpose("");
        setContact("");
        setCertPdf(null);
        setIdPdf(null);
        setCertFileName("");
        setIdFileName("");
        setCertFileButton("");
        setIdFileButton("");
        setPreAddr([]);
        spider
        .get("/api/student/address")
        .then((res) => {
          res.data.forEach((add) => {
            setPreAddr((p) => p.concat(add));
          });
        })
        .catch((err) => {
          console.log(err);
        });
        document.getElementById("cert").value = "";
        if (document.getElementById("emaildel"))
          document.getElementById("emaildel").value = "";
        if (document.getElementById("feer"))
          document.getElementById("feer").value = "";
        if(document.getElementById("emaildel"))
          document.getElementById("emaildel").value = "";
        if(document.getElementById("postal-del"))
          document.getElementById("postal-del").value = "";
        document.getElementById("contact-number").value = "";
        document.getElementById("purpose").value = "";
        document.getElementById("college-id").value = "";
        document.getElementById("certType").value = "bonafide";
        setFile("bonafide");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const calculate_source = () => {
    let anch = document.getElementById("anchorClick");
    if (anch) {
      let certType = document.getElementById("certType");
      if (certType) {
        let value = certType.value;
        if (value === "bonafide") anch.href = "Documents/bonafide.pdf";
        else if (value === "transcript") anch.href = "Documents/transcript.pdf";
        // anch.click();
      }
    }
  };
  return (
    <>
      <div className="container" id="cert-upl">
        <h2 className="text-center cert-upl-head">
          Request Certificate Verification
        </h2>
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

        {/* Cetificate Type */}

        <div className="row">
          <div className="col-md-6 form-left">
            <form id="request-main">
              <div className="form-group">
                <label htmlFor="certType">
                  Enter certificate type <span className="cmpl">*</span>
                </label>
                <a
                  href="#!"
                  onClick={calculate_source}
                  id="anchorClick"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="float-right small-link"
                >
                  Download Template
                </a>
                <select
                  name="certType"
                  id="certType"
                  className="form-control"
                  onChange={(e) => {
                    let certType = e.target.value;
                    setFile(certType);
                    if (certType === "transcript") {
                      setCount(emailCount + 1);
                      setEmails(["transcript@nitt.edu"]);
                      document.getElementById("contact-error-message").innerHTML = "";
                      document.getElementById("purpose-error-message").innerHTML = "";
                      document.getElementById("file-error-message").innerHTML = "";
                    } else {
                      setCount(0);
                      setEmails([]);
                      document.getElementById("contact-error-message").innerHTML = "";
                      document.getElementById("purpose-error-message").innerHTML = "";
                      document.getElementById("file-error-message").innerHTML = "";
                    }
                  }}
                >
                  <option value="bonafide" defaultValue>
                    Bonafide
                  </option>
                  <option value="transcript">Transcript</option>
                </select>
              </div>

              {/* Certificate Delivery */}

              {file === "transcript" ? (
                <>
                  <div className="form-group">
                    <label htmlFor="delivery-sel">
                      Select certificate delivery method{" "}
                      <span className="cmpl">*</span>
                    </label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="email-sel"
                        id="email-sel"
                        value="email"
                        onChange={(e) => {
                          if (document.getElementById("email-sel").checked) {
                            document.getElementById(
                              "email-del-entry"
                            ).style.display = "block";
                          } else {
                            document.getElementById(
                              "email-del-entry"
                            ).style.display = "none";
                          }
                        }}
                      />
                      <label className="form-check-label" htmlFor="email">
                        Email
                      </label>
                    </div>

                    {/* Email delivery */}

                    <div id="email-del-entry">
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          name="email-del"
                          id="emaildel"
                          aria-describedby="emailHelp"
                          placeholder="Enter your email id"
                          onChange={(e) => {
                            e.preventDefault();
                            let emailValues = document.getElementById("emaildel");
                            // if (emailValues.value !== "") {
                              setEmailDel(emailValues.value);
                              console.log(emailDel, emailValues.value);
                            // }
                          }}
                          required
                        />
                        <small id="your-email-error-message" className="error"></small>
                      </div>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="postal"
                        id="postal-del"
                        value="postal"
                        onChange={(e) => {
                          if (document.getElementById("postal-del").checked) {
                            document.getElementById(
                              "postal-del-entry"
                            ).style.display = "block";
                          } else {
                            console.log("Ddf");
                            document.getElementById(
                              "postal-del-entry"
                            ).style.display = "none";
                          }
                        }}
                      />
                      <label className="form-check-label" htmlFor="postal">
                        Postal delivery
                      </label>
                    </div>
                    <small id="select-delivery-type-error-message" className="error"></small>
                  </div>

                  {/* Postal information */}

                  <>
                    <div id="postal-del-entry" className="text-center">
                      <p id="emailHelp" className="form-text text-muted">
                        Choose addresses from your previous entries:
                      </p>
                      {preAddress.length !== 0 ? (
                        preAddress.map((addr, index) => {
                          if (addr !== "" || addr !== " ")
                            return (
                              <div className="form-check" key={index}>
                                <input
                                  className="form-check-input radio-addr"
                                  type="radio"
                                  name="radio"
                                  id={"radio" + index}
                                  value={addr !== null ? addr : ""}
                                  onChange={(e) => {
                                    setAddress(e.target.value);
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="radio"
                                >
                                  {addr}
                                </label>
                              </div>
                            );
                        })
                      ) : (
                        <small className="form-text text-muted">
                          No previously saved addresses.
                        </small>
                      )}
                      <br />
                      {address ? (
                        <>
                          <small className="form-text text-muted">
                            Address entered/selected: <strong>{address}</strong>
                          </small>
                          <br />
                        </>
                      ) : (
                        <></>
                      )}
                      <small className="form-text text-muted">
                        Else, enter a new one:
                      </small>
                      <br />
                      <div className="text-center">
                        <button
                          className="btn btn-success p-1 m-1"
                          width="50"
                          type="button"
                          onClick={(e) => {
                            setAddressModal(true);
                            Array.prototype.forEach.call(
                              document.getElementsByClassName("radio-addr"),
                              (el) => {
                                if (el.checked) {
                                  el.checked = false;
                                }
                              }
                            );
                          }}
                        >
                          Add New Address
                        </button>
                        <br />
                        <small id="your-postal-error-message" className="error"></small>
                      </div>
                      <br />
                      <Modal
                        show={addressModal}
                        onHide={handleAddressClose}
                        keyboard={false}
                        dialogClassName="approveModal"
                        aria-labelledby="contained-modal-title-vcenter"
                        className="certModal"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="contained-modal-title-vcenter">
                            Add New Address
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <br />
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                Address <span className="cmpl">*</span>
                              </span>
                            </div>
                            <textarea
                              id="address-text-box1"
                              className="form-control"
                              aria-label="With textarea"
                            ></textarea>
                          </div>
                          <br />
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                Pin Code <span className="cmpl">*</span>
                              </span>
                            </div>
                            <input
                              type="number"
                              id="address-text-box2"
                              className="form-control"
                            ></input>
                          </div>
                          <br />
                          <small
                            id="emailHelp"
                            className="form-text text-muted"
                          >
                            Optional
                          </small>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Landmark</span>
                            </div>
                            <textarea
                              id="address-text-box3"
                              className="form-control"
                              aria-label="With textarea"
                            ></textarea>
                          </div>
                          <br />
                          <div className="text-center">
                            <button
                              type="submit"
                              className="btn btn-primary"
                              onClick={(e) => {
                                let addr = document.getElementById(
                                  "address-text-box1"
                                ).value;
                                let pin = document.getElementById(
                                  "address-text-box2"
                                ).value;
                                let landm = document.getElementById(
                                  "address-text-box3"
                                ).value;
                                if (addr && pin) {
                                  let addressText =
                                    addr +
                                    " ," +
                                    pin +
                                    (landm ? " ," + landm : "");
                                  setAddress(addressText);
                                  console.log(address, addressText);
                                  setAddressModal(false);
                                }
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </div>
                  </>
                  <br />
                </>
              ) : (
                <></>
              )}

              {/* Contact information */}

              <div className="form-group">
                <label htmlFor="contact-number">
                  Contact Number <span className="cmpl">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="contact"
                  id="contact-number"
                  placeholder="Enter contact number"
                  required
                  onChange={(e) => {
                    setContact(e.target.value);
                  }}
                />
                <small id="contact-error-message" className="error"></small>
              </div>
              {/* Fee Receipt */}
              {file === "transcript" ? (
                <div className="fee-receipt">
                  <div className="form-group">
                    <label htmlFor="feer">
                      Fee Reference Number <span className="cmpl">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="feer"
                      id="feer"
                      required
                      placeholder="Enter Fee Reference Number"
                      onChange={(e) => {
                        setFee(e.target.value);
                        console.log(feeReceipt);
                      }}
                    />
                    <small id="fee-error-message" className="error"></small>
                  </div>
                </div>
              ) : (
                <></>
              )}

              {/* Administrator Email Addition */}

              {file === "transcript" ? (
                <></>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="emailaddr">
                      Administrator Email address{" "}
                      <span className="cmpl">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="emailaddr"
                      id="emailaddr"
                      aria-describedby="emailHelp"
                      placeholder="Enter email addresses in the order of processing"
                      required
                      onChange={(e) => {
                        var format = /[ `!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
                        if(format.test(e.target.value)) {
                          document.getElementById("email-error-message").innerHTML = "No special characters allowed";
                        } else {
                          document.getElementById("email-error-message").innerHTML = "";
                        }
                      }}
                    />
                    <small id="email-error-message" className="error"></small>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        let emailValues = document.getElementById("emailaddr");
                        if (emailValues.value !== "") {
                          const re = /\S+@nitt\.edu/;
                          const format = /[`!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
                          if(format.test(emailValues.value) === true) {
                            alert("No special characters allowed");
                          } else if (re.test(emailValues.value) === true) {
                            if (!emails.includes(emailValues.value)) {
                              console.log("bomom");
                              setCount(emailCount + 1);
                              setEmails(emails.concat(emailValues.value));
                            } else {
                              alert("Duplicate entry!");
                            }
                            // console.log(emailCount);
                            // console.log(emails);
                          } else {
                            alert("Enter valid nitt email.");
                          }
                          emailValues.value = "";
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </>
              )}
              <br />

              {/* Purpose */}

              <div className="form-group">
                <label htmlFor="purpose">
                  Purpose <span className="cmpl">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="purpose"
                  id="purpose"
                  placeholder="Enter purpose for requesting certificate"
                  required
                  onChange={(e) => {
                    setPurpose(e.target.value);
                  }}
                />
                <small id="purpose-error-message" className="error"></small>
              </div>

              {/* Certificate Addition */}

              <div className="form-group">
                <label htmlFor="cert" style={{ width: "50%" }}>
                  Add certificate <span className="cmpl">*</span>
                </label>
                <label htmlFor="college-id" style={{ width: "50%" }}>
                  Upload Student ID <span className="cmpl">*</span>
                </label>
                <input
                  type="file"
                  // className="form-control-file"
                  onChange={handleCertFileUpload}
                  id="cert"
                  style={{ width: "50%" }}
                />
                <input
                  type="file"
                  // className="form-control-file"
                  id="college-id"
                  onChange={handleIdFileUpload}
                  style={{ width: "50%" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "1em",
                    margin: "1em",
                  }}
                >
                  <small id="file-error-message" className="error"></small>
                </div>
                <span style={{display: 'flex', justifyContent: 'center'}}>
                  {cert_fileButton && id_fileButton ? (
                    <button
                      type="button"
                      className="btn btn-primary mr-2"
                      onClick={handleFileOpen}
                      style={{margin: '0.5em', width: '50%', minWidth: '2em'}}
                    >
                      Show Uploaded Certificate
                    </button>
                  ) : (
                    <></>
                  )}
                </span>
              </div>
              <div className="form-group text-center">
                <br />
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={(e) => {
                    e.preventDefault();
                    let fileUpload = document.getElementById("cert").files[0];
                    let college_id = document.getElementById("college-id").files[0];
                    let certType = document.getElementById("certType").value;
                    let error = 0;
                    if(!contact) {
                      document.getElementById("contact-error-message").innerHTML = "Contact field cannot be blank";
                      error = 1;
                    } else {
                      // const re = /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/;
                      if (contact.length !== 10) {
                        document.getElementById("contact-error-message").innerHTML = "Enter a valid contact number";
                        error = 1;
                      } else {
                        document.getElementById("contact-error-message").innerHTML = "";
                      }
                    }
                    if(!purpose) {
                      document.getElementById("purpose-error-message").innerHTML = "Purpose field cannot be blank";
                      error = 1;
                    } else {
                      document.getElementById("purpose-error-message").innerHTML = "";
                    }
                    if(!fileUpload || !college_id) {
                      document.getElementById("file-error-message").innerHTML = "Upload both files";
                      error = 1;
                    } else {
                      document.getElementById("file-error-message").innerHTML = "";
                    }
                    if(certType === "bonafide") {
                      if(!emailCount) {
                        document.getElementById("email-error-message").innerHTML = "Add email addresses";
                        error = 1;
                      } else {
                        document.getElementById("email-error-message").innerHTML = "";
                      }
                    } else {
                      if(!feeReceipt) {
                        document.getElementById("fee-error-message").innerHTML = "Enter fee reference number";
                        error = 1;
                      } else {
                        document.getElementById("fee-error-message").innerHTML = "";
                      }
                      if(!(document.getElementById("email-sel").checked || document.getElementById("postal-del").checked)) {
                        document.getElementById("select-delivery-type-error-message").innerHTML = "Select a delivery method";
                        error = 1;
                      } else {
                        document.getElementById("select-delivery-type-error-message").innerHTML = "";
                      }
                      if(document.getElementById("email-sel").checked) {
                        if(!emailDel) {
                          document.getElementById("your-email-error-message").innerHTML = "Enter your email address";
                          error = 1;
                        } else {
                          let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                          if(!regex.test(emailDel.toLowerCase())) {
                            document.getElementById("your-email-error-message").innerHTML = "Enter a valid email";
                            error = 1;
                          } else {
                            document.getElementById("your-email-error-message").innerHTML = "";
                          }
                        }
                      } else {
                        setEmailDel("");
                      }
                      if(document.getElementById("postal-del").checked) {
                        if(!address) {
                          document.getElementById("your-postal-error-message").innerHTML = "Enter your postal address";
                          error = 1;
                        }
                        else {
                          document.getElementById("your-postal-error-message").innerHTML = "";
                        }
                      } else {
                        setAddress("");
                      }
                    }
                    if (error === 0) {
                      setModal(true);
                    }
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          <Modal
            show={showModal}
            onHide={handleSubmitClose}
            keyboard={false}
            dialogClassName="approveModal"
            aria-labelledby="contained-modal-title-vcenter"
            className="certModal"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Submit Request - final
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {isLoading ? (
                <Loader
                  className="text-center"
                  type="Audio"
                  color="rgb(13, 19, 41)"
                  height={100}
                  width={100}
                  timeout={3000} //3 secs
                />
              ) : (
                <>
                  <h5 className="text-center">
                    <strong>Confirm the order of approval:</strong>
                  </h5>
                  <br />
                  <ul className="modal-pop list-group text-center">
                    <li className="modal-pop list-group-item">
                      {user + "@nitt.edu"}
                    </li>
                    {emails.map((email, index) => {
                      return (
                        <li key={index} className="modal-pop list-group-item">
                          <div className="d-block text-center">
                            <img
                              src="down.svg"
                              alt="Down arrow"
                              height="60"
                              width="30"
                            />
                          </div>
                          {email}
                        </li>
                      );
                    })}
                  </ul>
                  <br />
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={certificateRequest}
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </Modal.Body>
          </Modal>

          <div className="col-md-6  cert-right d-flex justify-content-center">
            <ul className="list-group emailList">
              {emails.length > 0 ? (
                <li className="list-group-item">{user + "@nitt.edu"}</li>
              ) : (
                <></>
              )}
              {emails.map((email, index) => {
                return (
                  <div key={index}>
                    <div className="d-block text-center">
                      <img
                        src="down.svg"
                        alt="Down arrow"
                        height="60"
                        width="30"
                      />
                    </div>
                    {/* </div> */}
                    <li key={index} className="list-group-item gray">
                      {email}
                      {file !== "transcript" ? (
                        <button
                          className="btn btn-del"
                          onClick={(e) => {
                            e.preventDefault();
                            setCount(emailCount - 1);
                            emails.splice(index, 1);
                            setEmails(emails);
                          }}
                        >
                          <span>&#127335;</span>
                        </button>
                      ) : (
                        <></>
                      )}
                    </li>
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
        <Modal
          size="lg"
          show={fileModal}
          onHide={handleClose}
          keyboard={false}
          dialogClassName="pdfModal"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {cert_fileName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <embed
              src={cert_pdf}
              className="embed-modal"
              height={document.documentElement.clientHeight * 0.75}
            />
          </Modal.Body>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {id_fileName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <embed
              src={id_pdf}
              className="embed-modal"
              height={document.documentElement.clientHeight * 0.75}
            />
          </Modal.Body>
        </Modal>
        <CertificateTemplate fileType={file} />
      </div>
    </>
    // )}
    // </>
  );
}

export default Upload;
