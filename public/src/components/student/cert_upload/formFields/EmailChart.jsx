import React, { Component } from "react";
import { getCert, setEmailCount, setEmails } from "../../../../actions/cert_upload";

export class EmailChart extends Component {
  render() {
    return (
      <>
        <div className="col-md-6  cert-right d-flex justify-content-center">
          <ul className="list-group emailList">
            {getCert().emails.length > 0 ? (
              <li className="list-group-item">
                {this.props.user + "@nitt.edu"}
              </li>
            ) : (
              <></>
            )}
            {getCert().emails.map((email, index) => {
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
                    {getCert().file !== "transcript" &&
                    getCert().file !== "rank card" &&
                    getCert().file !== "grade card" ? (
                      <button
                        className="btn btn-del"
                        onClick={(e) => {
                          e.preventDefault();
                          setEmailCount(getCert().emailCount - 1)
                          getCert().emails.splice(index, 1);
                          setEmails(getCert().emails);
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
      </>
    );
  }
}

export default EmailChart;
