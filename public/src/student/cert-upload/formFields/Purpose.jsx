import React, { Component } from "react";
import store from "../../../store";
import { setPurpose } from "../../../actions";

export class Purpose extends Component {
  render() {
    return (
      <>
        <div className="form-group">
          {this.props.file === "bonafide" ||
          this.props.file === "transcript" ||
          this.props.semwiseMap === true ||
          this.props.file === "rank card" ? (
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
                  store.dispatch(setPurpose(e.target.value));
                }}
              />
              <small id="purpose-error-message" className="error"></small>
            </>
          ) : (
            <>
              {this.props.file === "course de-registration" ||
              this.props.file === "course re-registration" ? (
                <>
                  Enter Reason <span className="cmpl">*</span>
                  <input
                    type="text"
                    className="form-control"
                    name="purpose"
                    id="purpose"
                    placeholder={
                      this.props.file === "course de-registration"
                        ? "Reason for Course De-Registration"
                        : "Reason for Course Re-registration"
                    }
                    required
                    onChange={(e) => {
                      store.dispatch(setPurpose(e.target.value));
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
