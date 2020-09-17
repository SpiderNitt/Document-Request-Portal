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
  const [fileButton, setFileButton] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [file, setFile] = useState("Bonafide");
  const [fileModal, setFileModal] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showModal, setModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [feeReceipt, setFee] = useState("");
  const [emailDel, setEmailDel] = useState("");
  const [address, setAddress] = useState("");
  const [preAddress, setPreAddr] = useState([]);
  const [addressModal, setAddressModal] = useState(false);

  useEffect(() => {
    spider
      .get("/api/student/address")
      .then((res) => {
        res.data.forEach((add) => {
          setPreAddr(preAddress.concat(add));
        });
        // console.log(preAddress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmitClose = () => setModal(false);
  const handleAddressClose = () => setAddressModal(false);

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setFileName("hello");
      setFileButton(true);
      setFileName(true);
    } else {
      setFileName("hiii");
      setFileName(null);
      setFileButton(true);
    }
    setPdf(URL.createObjectURL(e.target.files[0]));
  };

  const handleClose = () => setFileModal(false);
  const handleFileOpen = () => setFileModal(true);

  const certificateRequest = (e) => {
    e.preventDefault();
    setLoading(true);
    let fileUpload = document.getElementById("cert").files[0];
    let certType = document.getElementById("certType").value;
    let cd = new FormData();
    if (certType === "bonafide") cd.set("type", parseInt(1));
    else cd.set("type", parseInt(2));
    cd.append("certificate", fileUpload);
    if (emailDel) cd.set("email", emailDel);
    if (address) cd.set("address", address);
    if (feeReceipt) cd.set("receipt", feeReceipt);
    cd.set("path", emails.toString());
    for (var pair of cd.entries()) {
      console.log("ccd:", pair[0] + ", " + pair[1]);
    }
    spider
      .post("api/student/certificate_request", cd)
      .then((res) => {
        setLoading(false);
        setCount(0);
        setEmails([]);
        setFileButton(false);
        setFileModal(false);
        setFileName("");
        document.getElementById("cert").value = "";
        setModal(false);

        // console.log("ss", res);
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  };
  const calculate_source = () => {
    let anch = document.getElementById("anchorClick");
    if (anch) {
      let certType = document.getElementById("certType");
      if (certType) {
        let value = certType.value;
        if (value === "bonafide") anch.href = "/bf.pdf";
        else if (value === "X") anch.href = "/trans.pdf";
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
        <div className="row">
          <div className="col-md-6 form-left">
            <form id="request-main">
              <div className="form-group">
                <label htmlFor="certType">Enter certificate type</label>
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
                    if (certType === "X") {
                      setCount(emailCount + 1);
                      setEmails(emails.concat("transcript@nitt.edu"));
                      console.log(emails);
                    }
                  }}
                >
                  <option value="bonafide" defaultValue>
                    Bonafide
                  </option>
                  <option value="X">Transcript</option>
                </select>
              </div>

              {/* Certificate Delivery */}

              <div className="form-group">
                <label htmlFor="delivery-sel">
                  Select certificate delivery method
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
                      onChange={(e) => {
                        e.preventDefault();
                        let emailValues = document.getElementById("emaildel");
                        if (emailValues.value !== "") {
                          setEmailDel(emailValues.value);
                          console.log(emailDel, emailValues.value);
                        }
                      }}
                      required
                    />
                    <small id="emailHelp" className="form-text text-muted">
                      Enter your email
                    </small>
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
              </div>

              {/* Postal information */}

              <>
                <div id="postal-del-entry" className="text-center">
                  <p id="emailHelp" className="form-text text-muted">
                    Choose addresses from your previous list.
                  </p>
                  {preAddress.length !== 0 ? (
                    preAddress.map((addr, index) => {
                      return (
                        <div className="form-check" key={index}>
                          <input
                            className="form-check-input radio-addr"
                            type="radio"
                            name="radio"
                            id={"radio" + index}
                            value={addr}
                            onChange={(e) => {
                              console.log("asdkajd", e.target.value, "zdf");
                              setAddress(e.target.value);
                              console.log(address);
                            }}
                          />
                          <label className="form-check-label" htmlFor="radio">
                            {addr}
                          </label>
                        </div>
                      );
                    })
                  ) : (
                    <small className="form-text text-muted">
                      No previous addresses
                    </small>
                  )}
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
                      Add new address
                    </button>
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
                          <span className="input-group-text">Address*</span>
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
                          <span className="input-group-text">Pin Code*</span>
                        </div>
                        <textarea
                          id="address-text-box2"
                          className="form-control"
                          aria-label="With textarea"
                        ></textarea>
                      </div>
                      <br />
                      <small id="emailHelp" className="form-text text-muted">
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
                            let addressText =
                              document.getElementById("address-text-box1")
                                .value +
                              "," +
                              document.getElementById("address-text-box2")
                                .value +
                              "," +
                              document.getElementById("address-text-box3")
                                .value;
                            setAddress(addressText);
                            console.log(address, addressText);
                            setAddressModal(false);
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

              {/* Fee Receipt */}
              {/* {file === "X" ? ( */}
              <div className="fee-receipt">
                <div className="form-group">
                  <label htmlFor="emailaddr">Fee Reference Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="feer"
                    id="feer"
                    required
                    onChange={(e) => {
                      setFee(e.target.value);
                      console.log(feeReceipt);
                    }}
                  />
                </div>
              </div>
              {/* ) : (
                <></>
              )} */}
              {file === "X" ? (
                <></>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="emailaddr">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="emailaddr"
                      id="emailaddr"
                      aria-describedby="emailHelp"
                      required
                    />
                    <small id="emailHelp" className="form-text text-muted">
                      Enter email addresses in the order of processing.
                    </small>
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
                          if (re.test(emailValues.value) === true) {
                            setCount(emailCount + 1);
                            setEmails(emails.concat(emailValues.value));
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
              <div className="form-group">
                <label htmlFor="cert">Add certificate</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="form-control-file"
                  id="cert"
                />
              </div>
              <br />

              <div className="form-group text-center">
                {fileButton ? (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={handleFileOpen}
                  >
                    Show Uploaded File
                  </button>
                ) : (
                  <></>
                )}
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={() => {
                    let certType = document.getElementById("certType").value;

                    if (certType && emailCount && fileName) setModal(true);
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
                              src="/down.svg"
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
                        src="/down.svg"
                        alt="Down arrow"
                        height="60"
                        width="30"
                      />
                    </div>
                    {/* </div> */}
                    <li key={index} className="list-group-item gray">
                      {email}
                      <button
                        className="btn btn-del"
                        onClick={(e) => {
                          e.preventDefault();
                          setCount(emailCount - 1);
                          emails.splice(index - 1, 1);
                          setEmails(emails);
                        }}
                      >
                        <span>&#127335;</span>
                      </button>
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
              {fileName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <embed
              src={pdf}
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
