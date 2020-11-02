import React, { Component } from 'react'
import { MdHelp } from "react-icons/md";
import store from "../../../store";
import { setFile, setCourse, setCode, setEmailCount, setEmails, setSemwiseMap } from "../../../actions";

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
                    store.dispatch(setFile(certType));
                    store.getState().docId.forEach((type) => {
                      if (type.name.toLowerCase() === certType) {
                        if (type.semwise_mapping === true) store.dispatch(setSemwiseMap(true));
                        else store.dispatch(setSemwiseMap(false));
                      }
                    });
                    // setName("");
                    // document.getElementById("username").value = "";
                    if (
                      store.getState().file === "course de-registration" ||
                      store.getState().file === "course re-registration"
                    ) {
                      if(document.getElementById('course-code') && document.getElementById("course-name"))
                      {
                        document.getElementById("course-code").value = "";
                        document.getElementById("course-name").value = "";
                      }
                      store.dispatch(setCourse(""));
                      store.dispatch(setCode(""));
                    }
                    if (
                      certType === "transcript" ||
                      certType === "rank card" ||
                      certType === "grade card"
                    ) {
                      store.dispatch(
                        setEmailCount(store.getState().emailCount + 1)
                      );
                      store.dispatch(setEmails(["transcript@nitt.edu"]));
                      document.getElementById(
                        "contact-error-message"
                      ).innerHTML = "";
                      if(document.getElementById("purpose-error-message"))
                      {
                        document.getElementById(
                          "purpose-error-message"
                        ).innerHTML = "";
                      }
                      document.getElementById("file-error-message").innerHTML =
                        "";
                    } else {
                      store.dispatch(setEmailCount(0));
                      store.dispatch(setEmails([]));
                      document.getElementById(
                        "contact-error-message"
                      ).innerHTML = "";
                      document.getElementById(
                        "purpose-error-message"
                      ).innerHTML = "";
                      document.getElementById("file-error-message").innerHTML =
                        "";
                      if (document.getElementById("ccode-error-message")) {
                        document.getElementById(
                          "ccode-error-message"
                        ).innerHTML = "";
                      }
                      if (document.getElementById("cname-error-message")) {
                        document.getElementById(
                          "cname-error-message"
                        ).innerHTML = "";
                      }
                      if (document.getElementById("email-error-message")) {
                        document.getElementById(
                          "email-error-message"
                        ).innerHTML = "";
                      }
                    }
                  }}
                >
                  {store.getState().docId.map((id, index) => {
                    return (
                      <option key={index} value={id.name.toLowerCase()}>
                        {id.name}
                      </option>
                    );
                  })}
                </select>
              </div> 
            </>
        )
    }
}

export default CertType
