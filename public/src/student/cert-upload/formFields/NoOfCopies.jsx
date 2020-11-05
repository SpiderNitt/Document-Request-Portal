import React, { Component } from "react";
import store from "../../../store";
import { setNoOfCopies } from "../../../actions";

export class NoOfCopies extends Component {
  render() {
    return (
      <>
        {store.getState().file === "transcript" ||
        store.getState().file === "rank card" ? (
          <div className="form-group">
            <label htmlFor="no_of_copies">
              Enter Number of copies (if you opted by post){" "}
              <span className="cmpl">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              name="no_of_copies"
              id="no_of_copies"
              placeholder="Number of copies"
              required
              onChange={(e) => {
                store.dispatch(setNoOfCopies(e.target.value));
              }}
              min="0"
            />
            <small id="no-of-copies-error-message" className="error"></small>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default NoOfCopies;
