import React, { Component } from "react";

export class CertAddition extends Component {
  render() {
    return (
      <>
        <div className="form-group">
          <label htmlFor="cert" style={{ width: "50%" }}>
            Upload Document <span className="cmpl">*</span>
          </label>
          <label htmlFor="college-id" style={{ width: "50%" }}>
            Upload Student ID <span className="cmpl">*</span>
          </label>
          <input
            type="file"
            // className="form-control-file"
            onChange={this.props.handleCertFileUpload}
            id="cert"
            style={{ width: "50%" }}
          />
          <input
            type="file"
            // className="form-control-file"
            id="college-id"
            onChange={this.props.handleIdFileUpload}
            style={{ width: "50%" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "1em",
              margin: "1em",
            }}
          >
            <small id="file-error-message" className="error"></small>
          </div>

          <span style={{ display: "flex", justifyContent: "center" }}>
            {this.props.cert_fileButton && this.props.id_fileButton === true ? (
              <button
                type="button"
                className="btn btn-primary mr-2 mobl-btn"
                onClick={this.props.handleFileOpen}
                style={{ margin: "0.5em", width: "50%", minWidth: "2em" }}
              >
                Show Uploaded Files
              </button>
            ) : (
              <></>
            )}
          </span>
        </div>
      </>
    );
  }
}

export default CertAddition;
