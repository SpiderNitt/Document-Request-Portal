import React, { Component } from "react";
import {
  setEmailDel,
  setAddress,
  setModal,
  getCert,
} from '../../../../actions/cert_upload'

export class SubmitBtn extends Component {
  render() {
    return (
      <>
        <div className="form-group text-center">
          <br />
          <button
            type="submit"
            className="btn btn-success"
            onClick={(e) => {
              e.preventDefault();
              let fileUpload = document.getElementById("cert").files[0];
              let college_id = document.getElementById("college-id").files[0];
              let error = 0;
              if (!getCert().contact) {
                document.getElementById("contact-error-message").innerHTML =
                  "Contact field cannot be blank";
                error = 1;
              } else {
                // const re = /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/;
                if (getCert().contact.length !== 10) {
                  document.getElementById("contact-error-message").innerHTML =
                    "Enter a valid contact number";
                  error = 1;
                } else {
                  document.getElementById("contact-error-message").innerHTML =
                    "";
                }
              }
              if (!getCert().name) {
                document.getElementById("name-error-message").innerHTML =
                  "Name field cannot be blank";
                error = 1;
              } else {
                document.getElementById("name-error-message").innerHTML = "";
              }
              if (!getCert().purpose) {
                if (
                  getCert().file === "bonafide" ||
                  getCert().file === "transcript" ||
                  getCert().file === "rank card" ||
                  getCert().semwiseMap === true
                ) {
                  document.getElementById("purpose-error-message").innerHTML =
                    "Purpose field cannot be blank";
                } else if (getCert().file === "course de-registration") {
                  document.getElementById("purpose-error-message").innerHTML =
                    "Enter reason for course de-registration";
                } else {
                  document.getElementById("purpose-error-message").innerHTML =
                    "Enter reason for course re-registration";
                }
                error = 1;
              } else {
                document.getElementById("purpose-error-message").innerHTML = "";
              }
              if (!fileUpload || !college_id) {
                document.getElementById("file-error-message").innerHTML =
                  "Upload both files";
                error = 1;
              } else {
                document.getElementById("file-error-message").innerHTML = "";
              }
              if (getCert().file === "bonafide") {
                if (!getCert().emailCount) {
                  document.getElementById("email-error-message").innerHTML =
                    "Add email addresses";
                  error = 1;
                } else {
                  document.getElementById("email-error-message").innerHTML = "";
                }
              } else if (
                getCert().file === "transcript" ||
                getCert().semwiseMap === true ||
                getCert().file === "rank card"
              ) {
                if (
                  getCert().file === "transcript" ||
                  getCert().file === "rank card"
                ) {
                  if (getCert().no_of_copies < 0) {
                    document.getElementById(
                      "no-of-copies-error-message"
                    ).innerHTML = "Number of copies cannot be negative";
                    error = 1;
                  } else {
                    document.getElementById(
                      "no-of-copies-error-message"
                    ).innerHTML = "";
                  }
                  if (getCert().address) {
                    if (!getCert().no_of_copies) {
                      document.getElementById(
                        "no-of-copies-error-message"
                      ).innerHTML = "Enter the number of copies required";
                      error = 1;
                    } else if (getCert().no_of_copies <= 0) {
                      document.getElementById(
                        "no-of-copies-error-message"
                      ).innerHTML = "Enter the number of copies required";
                      error = 1;
                    } else {
                      document.getElementById(
                        "no-of-copies-error-message"
                      ).innerHTML = "";
                    }
                  }
                  if (!getCert().feeReceipt) {
                    document.getElementById("fee-error-message").innerHTML =
                      "Enter fee reference number";
                    error = 1;
                  } else {
                    document.getElementById("fee-error-message").innerHTML = "";
                  }
                }
                if (
                  !(
                    document.getElementById("email-sel").checked ||
                    document.getElementById("postal-del").checked
                  )
                ) {
                  document.getElementById(
                    "select-delivery-type-error-message"
                  ).innerHTML = "Select a delivery method";
                  error = 1;
                } else {
                  document.getElementById(
                    "select-delivery-type-error-message"
                  ).innerHTML = "";
                }
                if (document.getElementById("email-sel").checked) {
                  if (!getCert().emailDel) {
                    document.getElementById(
                      "your-email-error-message"
                    ).innerHTML = "Enter your email address";
                    error = 1;
                  } else {
                    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
                    if (!regex.test(getCert().emailDel.toLowerCase())) {
                      document.getElementById(
                        "your-email-error-message"
                      ).innerHTML = "Enter a valid email";
                      error = 1;
                    } else {
                      document.getElementById(
                        "your-email-error-message"
                      ).innerHTML = "";
                    }
                  }
                } else {
                  setEmailDel("");
                }
                if (document.getElementById("postal-del").checked) {
                  if (!getCert().address) {
                    document.getElementById(
                      "your-postal-error-message"
                    ).innerHTML = "Enter your postal address";
                    error = 1;
                  } else {
                    document.getElementById(
                      "your-postal-error-message"
                    ).innerHTML = "";
                  }
                } else {
                  setAddress("");
                }
                if (getCert().semwiseMap === true) {
                  if (
                    !(
                      document.getElementById("check_s1").checked ||
                      document.getElementById("check_s2").checked ||
                      document.getElementById("check_s3").checked ||
                      document.getElementById("check_s4").checked ||
                      document.getElementById("check_s5").checked ||
                      document.getElementById("check_s6").checked ||
                      document.getElementById("check_s7").checked ||
                      document.getElementById("check_s8").checked ||
                      document.getElementById("check_s9").checked ||
                      document.getElementById("check_s10").checked
                    )
                  ) {
                    document.getElementById(
                      "select-semester-error-message"
                    ).innerHTML = "Select a semester";
                    error = 1;
                  } else {
                    document.getElementById(
                      "select-semester-error-message"
                    ).innerHTML = "";
                  }

                  this.props.clearSemObj();

                  let copyInputNodes = document.querySelectorAll(
                    ".copies-input"
                  );
                  copyInputNodes.forEach((node) => {
                    if (node.value > 0)
                      this.props.setCopies(parseInt(node.id.slice(14)), node.value);
                    else {
                      document.getElementById(
                        "rc-gc-no-of-copies-error-message"
                      ).innerHTML = "Enter valid no. of copies";
                      error = 1;
                    }
                  });
                }
              } else if (
                getCert().file === "course re-registration" ||
                getCert().file === "course de-registration"
              ) {
                if (!getCert().emailCount) {
                  document.getElementById("email-error-message").innerHTML =
                    "Add email addresses";
                  error = 1;
                } else {
                  document.getElementById("email-error-message").innerHTML = "";
                }
                if (!getCert().courseCode) {
                  document.getElementById("ccode-error-message").innerHTML =
                    "Enter your course code";
                }
                if (!getCert().course) {
                  document.getElementById("cname-error-message").innerHTML =
                    "Enter your course name";
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
      </>
    );
  }
}

export default SubmitBtn;
