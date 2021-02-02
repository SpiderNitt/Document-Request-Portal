import React, { Component } from "react";
import { getCert, setPurpose } from "../../../../actions/cert_upload";

export class Purpose extends Component {
  render() {
    return (
      <>
        <div className="form-group">
          {getCert().file === "bonafide" ||
          getCert().file === "transcript" ||
          getCert().semwiseMap === true ||
          getCert().file === "rank card" ? (
            <>
              <label htmlFor="purpose">
                Enter Purpose <span className="cmpl">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="purpose"
                id="purpose"
                placeholder="Purpose for document requisition"
                required
                onChange={(e) => {
                  setPurpose(e.target.value);
                }}
              />
              <small id="purpose-error-message" className="error"></small>
            </>
          ) : (
            <>
              {getCert().file === "course de-registration" ||
              getCert().file === "course re-registration" ? (
                <>
                  Enter Reason <span className="cmpl">*</span>
                  <input
                    type="text"
                    className="form-control"
                    name="purpose"
                    id="purpose"
                    placeholder={
                      getCert().file === "course de-registration"
                        ? "Reason for Course De-Registration"
                        : "Reason for Course Re-registration"
                    }
                    required
                    onChange={(e) => {
                      setPurpose(e.target.value);
                    }}
                  />
                  <small id="purpose-error-message" className="error"></small>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </>
    );
  }
}

export default Purpose;
