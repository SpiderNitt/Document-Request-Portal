import React, { useState } from "react";
import "./cert-upl.css";
import spider from "../../utils/API";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from 'react-bootstrap';

function Upload() {

  let usertoken = JSON.parse(localStorage.getItem('bonafideNITT2020user')).split('.')[1];
  const decodedData = JSON.parse(window.atob(usertoken));
  const user = decodedData.data.username;
  const [emailCount, setCount] = useState(0);
  const [emails, setEmails] = useState([]);
  const [fileButton, setFileButton] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [fileModal, setFileModal] = useState(false);
  const [fileName, setFileName] = useState("");


  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      console.log(file.name);
      setFileName("hello");
      setFileButton(true);
      setFileName(true);
    }
    else {
      // setFileModal(false);
      setFileName("hiii");
      setFileName(null);
      setFileButton(true);
    }
    console.log(e.target.files[0])
    setPdf(URL.createObjectURL(e.target.files[0]));


  }

  const handleClose = () => setFileModal(false);
  const handleFileOpen = () => setFileModal(true);

  const certificateRequest = (e) => {
    e.preventDefault();
    let fileUpload = document.getElementById("cert").files[0];
    let certType = document.getElementById("certType").value;
    if (emailCount && fileUpload && certType) {
      let r = window.confirm(`Confirm selection: ${emails}`);
      if (r === true) {
        let cd = new FormData();
        cd.set("type", parseInt(1));
        cd.append("certificate", fileUpload);
        let emails_array = [];
        if (emails.length === 1) {
          emails_array.push(emails[0] + ",");
        } else {
          emails.forEach(function (ele) {
            emails_array.push(ele);
          });
        }
        cd.set("path", emails_array);
        for (var value of cd.values()) {
          console.log(value);
        }
        spider
          .post("api/certificate_request", cd)
          .then((res) => {
            console.log("posted");
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  const calculate_source = () =>{
    let anch = document.getElementById('anchorClick');
    if(anch){
      let typeSelect = document.getElementById('typeSelect')
      if(typeSelect){

    let value = typeSelect.value;
    if(value === 'bonafide')
    anch.href = '/bf.pdf';
    else if(value === 'X')
    anch.href = '/trans.pdf';
    anch.click();
      }
    }
   
    // return '/bf.pdf';
    // console.log(document.getElementById('typeSelect').value)
  }
  return (
    <>
      <div className="container" id="cert-upl">
        <h2 className="text-center cert-upl-head">
          Request Certificate Verification
      </h2>
        <div className="row">
          <div className="col-md-6 form-left">
            <form>
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
                        console.log(emailCount);
                        console.log(emails);
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
              <br />
              <div className="form-group">
                <label htmlFor="certType">Enter certificate type</label>
                <a onClick={calculate_source} id='anchorClick' download class="float-right small-link">Download sample</a>
                <select name="certType" id="certType" className="form-control" id='typeSelect'>
                  <option value="bonafide" selected>Bonafide</option>
                  <option value="X">Certificate X</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="cert">Add certificate</label>
                <input type="file" onChange={handleFileUpload} className="form-control-file" id="cert" />
              </div>
              <br />

              <div className="form-group text-center">
                {fileButton ? <button className="btn btn-primary mr-2" onClick={handleFileOpen}>Show Uploaded File</button> : <></>}
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={certificateRequest}
                >
                  Submit
              </button>
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
            </form>
          </div>
          <div className="col-md-6  cert-right d-flex justify-content-center">
            <ul className="list-group emailList">
              {emails.length > 0 ? <li className='list-group-item'>{user + '@nitt.edu'}</li> : <></>}
              {emails.map((email, index) => {

                return (
                  <div key={index} >
                    <div className='d-block text-center'>
                      <img src='/down.svg' alt="Down arrow" height='60' width='30' /></div>
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
          />

        </Modal.Body>
      </Modal>
    </>
  );
}

export default Upload;
