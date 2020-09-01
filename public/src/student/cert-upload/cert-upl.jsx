import React, { useState } from "react";
import "./cert-upl.css";

function Upload(porps) {
  const [emailCount, setCount] = useState(0);
  const [emails, setEmails] = useState([]);
  return (
    <div className="container" id="cert-upl">
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
                Enter email addresses in the order of preference from highest.
              </small>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                let emailValues = document.getElementById("emailaddr");
                if (emailValues.value !== "") {
                  setCount(emailCount + 1);
                  setEmails(emails.concat(emailValues.value));
                  console.log(emailCount);
                  console.log(emails);
                  emailValues.value = "";
                }
              }}
            >
              Add
            </button>
            <br />
            <br />
            <div className="form-group">
              <label htmlFor="certType">Enter certificate type</label>
              <select name="certType" id="certType" className="form-control">
                <option value="bonafide">Bonafide</option>
                <option value="X">Certificate X</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="cert">Add certificate</label>
              <input type="file" className="form-control-file" id="cert" />
            </div>
            <div className="form-group text-center">
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </div>
          </form>
        </div>
        {/* <hr className="divider" /> */}
        <div className="col-md-6   d-flex justify-content-center">
          <ul className="list-group emailList">
            {emails.map((email, index) => {
              return (
                <li key={index} className="list-group-item">
                  <strong>{index + 1})</strong> {email}
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
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Upload;
