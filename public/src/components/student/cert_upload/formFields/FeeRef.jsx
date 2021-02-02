import React, { Component } from "react";
import { getCert, setFee } from "../../../../actions/cert_upload";

export class FeeRef extends Component {
  render() {
    return (
      <div>
        {getCert().file === "transcript" ||
        getCert().file === "rank card" ||
        getCert().semwiseMap === true ? (
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
                  setFee(e.target.value);
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
