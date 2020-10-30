import React, { Component } from "react";

export class SemCheckboxes extends Component {
  render() {
    return (
      <>
        {this.props.semwiseMap === true ? (
          <div className="semesters">
            <div className="form-group">
              <label htmlFor="semester">
                Choose required semesters <span className="cmpl">*</span>
              </label>
              <div className="row mx-2">
                {this.props.semester.map((sem) => {
                  return (
                    <>
                      <div className="form-check col-sm-3 col-6">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          min="1"
                          id={"check_" + sem.sem}
                          name={sem.sem}
                          onChange={(e) => {
                            if (!document.getElementById(`${sem.sem}box`)) {
                              let semDiv = document.createElement("div");
                              semDiv.id = `${sem.sem}box`;
                              semDiv.classList.add(
                                "form-group",
                                "copy-input-div"
                              );
                              semDiv.style.background = "#f5f5f5";
                              semDiv.style.padding = "1rem";
                              semDiv.innerHTML = `<label for="no_of_copies_${sem.sem}"> 
                                                          ${sem.semName} - Number of Copies
                                                          <span class="cmpl">*</span>
                                                        </label> 
                                                        <input type="number" 
                                                              class="form-control copies-input" 
                                                              name="no_of_copies_${sem.sem}"
                                                              id="no_of_copies_${sem.sem}"
                                                              placeholder="Number of copies for ${sem.semName}" 
                                                              value=1
                                                              required                                                         
                                                              min="1" 
                                                        />
                                                        <small
                                                        id="rc-gc-no-of-copies-error-message"
                                                        class="error"
                                                      ></small>
                                                        <small id="${sem.sem}-no-of-copies-error-message" class="error"></small>`;
                              document
                                .getElementById("semesterCopies")
                                .appendChild(semDiv);
                            } else {
                              document.getElementById(`${sem.sem}box`).remove();
                            }
                          }}
                        />

                        <label htmlFor={sem.sem}> {sem.semName} </label>
                      </div>
                    </>
                  );
                })}
              </div>
              <small
                id="select-semester-error-message"
                className="error"
              ></small>
            </div>
            <div className="form-group">
              <div id="semesterCopies"></div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default SemCheckboxes;
