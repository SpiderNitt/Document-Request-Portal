import React, { Component } from 'react'
import store from "../../../store";
import { setEmailCount, setEmails } from "../../../actions";

export class EmailChart extends Component {
    render() {
        return (
        <>
        <div className="col-md-6  cert-right d-flex justify-content-center">
            <ul className="list-group emailList">
              {store.getState().emails.length > 0 ? (
                <li className="list-group-item">{this.props.user + "@nitt.edu"}</li>
              ) : (
                <></>
              )}
              {store.getState().emails.map((email, index) => {
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
                      {store.getState().file !== "transcript" &&
                      store.getState().file !== "rank card" &&
                      store.getState().file !== "grade card" ? (
                        <button
                          className="btn btn-del"
                          onClick={(e) => {
                            e.preventDefault();
                            store.dispatch(
                              setEmailCount(store.getState().emailCount - 1)
                            );
                            store.getState().emails.splice(index, 1);
                            store.dispatch(setEmails(store.getState().emails));
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
        )
    }
}

export default EmailChart
