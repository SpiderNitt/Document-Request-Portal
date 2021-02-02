import React, { Component } from "react";
import { MdHelp } from "react-icons/md";
import {
  setFile,
  setCourse,
  setCode,
  setEmailCount,
  setEmails,
  setSemwiseMap,
  getCert,
} from "../../../../actions/cert_upload";

export class CertType extends Component {
  render() {
    return (
      <>
        <div className="form-group">
          <label htmlFor="certType">
            Enter Document type <span className="cmpl">*</span>
            <MdHelp
              onClick={this.props.handleInstructionsOpen}
              style={{ position: "absolute", right: "1em" }}
            />
          </label>

          <select
            name="certType"
            id="certType"
            className="form-control"
            onChange={(e) => {
              let certType = e.target.value;
              setFile(certType);
              getCert().docId.forEach((type) => {
                if (type.name.toLowerCase() === certType) {
                  if (type.semwise_mapping === true)
                    setSemwiseMap(true);
                  else setSemwiseMap(false);
                }
              });
              // setName("");
              // document.getElementById("username").value = "";
              if (
                getCert().file === "course de-registration" ||
                getCert().file === "course re-registration"
              ) {
                if (
                  document.getElementById("course-code") &&
                  document.getElementById("course-name")
                ) {
                  document.getElementById("course-code").value = "";
                  document.getElementById("course-name").value = "";
                }
                setCourse("");
                setCode("");
              }
              if (
                certType === "transcript" ||
                certType === "rank card" ||
                certType === "grade card"
              ) {
                setEmailCount(getCert().emailCount + 1);
                setEmails(["transcript@nitt.edu"]);
                if(document.getElementById("contact-error-message"))
                  document.getElementById("contact-error-message").innerHTML = "";
                if (document.getElementById("purpose-error-message")) {
                  document.getElementById("purpose-error-message").innerHTML =
                    "";
                }
                if(document.getElementById("file-error-message"))
                  document.getElementById("file-error-message").innerHTML = "";
              } else {
                setEmailCount(0);
                setEmails([]);
                if(document.getElementById("contact-error-message"))
                  document.getElementById("contact-error-message").innerHTML = "";
                if(document.getElementById("purpose-error-message"))
                  document.getElementById("purpose-error-message").innerHTML = "";
                if(document.getElementById("file-error-message"))
                  document.getElementById("file-error-message").innerHTML = "";
                if (document.getElementById("ccode-error-message")) {
                  document.getElementById("ccode-error-message").innerHTML = "";
                }
                if (document.getElementById("cname-error-message")) {
                  document.getElementById("cname-error-message").innerHTML = "";
                }
                if (document.getElementById("email-error-message")) {
                  document.getElementById("email-error-message").innerHTML = "";
                }
              }
            }}
          >
            {getCert().docId.map((id, index) => {
              return (
                <option key={index} value={id.name.toLowerCase()}>
                  {id.name}
                </option>
              );
            })}
          </select>
        </div>
      </>
    );
  }
}

export default CertType;
