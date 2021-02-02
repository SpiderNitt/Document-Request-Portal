import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { getCert } from "../../../../actions/cert_upload";

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
              {getCert().cert_fileName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <embed
              src={getCert().cert_pdf}
              className="embed-modal"
              height={document.documentElement.clientHeight * 0.75}
            />
          </Modal.Body>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Uploaded files: <br /> Id file: {getCert().id_fileName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <embed
              src={getCert().id_pdf}
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
