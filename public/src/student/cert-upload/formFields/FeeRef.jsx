import React, { Component } from "react";
import store from "../../../store";
import { setFee } from "../../../actions";

export class FeeRef extends Component {
  render() {
    return (
      <div>
        {store.getState().file === "transcript" ||
        store.getState().file === "rank card" ||
        store.getState().semwiseMap === true ? (
          <div className="fee-receipt">
            <div className="form-group">
              <label htmlFor="feer">
                Enter Fee Reference ID <span className="cmpl">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="feer"
                id="feer"
                required
                placeholder="Fee Reference ID"
                onChange={(e) => {
                  store.dispatch(setFee(e.target.value));
                }}
              />
              <small id="fee-error-message" className="error"></small>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default FeeRef;
