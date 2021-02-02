import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { getCert } from "../../../../actions/cert_upload";

export class FinalSubmitModal extends Component {
  render() {
    return (
      <>
        <Modal
          show={this.props.showModal}
          onHide={this.props.handleSubmitClose}
          keyboard={false}
          dialogClassName="approveModal"
          aria-labelledby="contained-modal-title-vcenter"
          className="certModal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Submit Request - final
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.isLoading ? (
              <Loader
                className="text-center"
                type="Audio"
                color="rgb(13, 19, 41)"
                height={100}
                width={100}
                timeout={3000} //3 secs
              />
            ) : (
              <>
                <h5 className="text-center">
                  <strong>Confirm the order of approval:</strong>
                </h5>
                <br />
                <ul className="modal-pop list-group text-center">
                  <li className="modal-pop list-group-item">
                    {this.props.user + "@nitt.edu"}
                  </li>
                  {getCert().emails.map((email, index) => {
                    return (
                      <li key={index} className="modal-pop list-group-item">
                        <div className="d-block text-center">
                          <img
                            src="down.svg"
                            alt="Down arrow"
                            height="60"
                            width="30"
                          />
                        </div>
                        {email}
                      </li>
                    );
                  })}
                </ul>
                <br />
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={this.props.certificateRequest}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default FinalSubmitModal;
