import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import store from "../../../store";

export class FilesModal extends Component {
  render() {
    return (
      <>
        <Modal
          size="lg"
          show={this.props.fileModal}
          onHide={this.props.handleClose}
          keyboard={false}
          dialogClassName="pdfModal"
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Uploaded files: <br /> Certificate:{" "}
              {store.getState().cert_fileName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <embed
              src={store.getState().cert_pdf}
              className="embed-modal"
              height={document.documentElement.clientHeight * 0.75}
            />
          </Modal.Body>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Uploaded files: <br /> Id file: {store.getState().id_fileName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <embed
              src={store.getState().id_pdf}
              className="embed-modal"
              height={document.documentElement.clientHeight * 0.75}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default FilesModal;
