import React, { Component } from 'react'
import store from "../../../store";
import { setEmailCount, setEmails } from "../../../actions";
import { MdHelp } from "react-icons/md";

export class AdminEmails extends Component {
    render() {
        return (
            store.getState().file === "transcript" ||
              store.getState().file === "rank card" ||
              store.getState().semwiseMap === true ? (
                <></>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="emailaddr">
                      Enter Signatories' Email address{" "}
                      <span className="cmpl">*</span>
                      <MdHelp
                        onClick={this.props.handleSignatoriesOpen}
                        style={{ position: "absolute", right: "1em" }}
                      />
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="emailaddr"
                      id="emailaddr"
                      aria-describedby="emailHelp"
                      placeholder="Email addresses in the order of processing"
                      required
                      onChange={(e) => {
                        var format = /[ `!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/; // eslint-disable-line
                        if (format.test(e.target.value)) {
                          document.getElementById(
                            "email-error-message"
                          ).innerHTML = "No special characters allowed";
                        } else {
                          document.getElementById(
                            "email-error-message"
                          ).innerHTML = "";
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
                          const student_webmail = /^\d+@nitt\.edu/;
                          const format = /[`!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/; // eslint-disable-line
                          if (format.test(emailValues.value) === true) {
                            alert("No special characters allowed");
                          } else if (re.test(emailValues.value) === true) {
                            if (
                              student_webmail.test(emailValues.value) === true
                            ) {
                              alert("Cannot enter student webmail");
                            } else if (
                              !store
                                .getState()
                                .emails.includes(emailValues.value)
                            ) {
                              store.dispatch(
                                setEmailCount(store.getState().emailCount + 1)
                              );
                              store.dispatch(
                                setEmails(
                                  store
                                    .getState()
                                    .emails.concat(emailValues.value)
                                )
                              );
                            } else {
                              alert("Duplicate entry!");
                            }
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
              )
        )
    }
}

export default AdminEmails
