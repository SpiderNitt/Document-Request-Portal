import React from "react";
import { Modal } from "react-bootstrap";

export default class SignatoriesInstructionsModal extends React.Component {
  render() {
    return (
        <Modal
            show={this.props.show}
            onHide={this.props.hide}
            keyboard={false}
            dialogClassName="approveModal"
            aria-labelledby="contained-modal-title-vcenter"
            className="certModal"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Instructions
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>Signatories' Email address pathway for the documents</div>
                <ol>
                    <li><strong>Bonafide</strong> : Warden -> HOD -> Associate Dean</li>
                    <li><strong>Transcript</strong> : Default Path</li>
                    <li><strong>Course De-Reg / Re-Reg</strong> : Faculty -> HOD -> Ugdean@nitt.edu -> Ugoffice@nitt.edu</li>
                </ol>
                <br />
                <div>
                    <strong>NOTE :</strong> Get the webmails of faculties from <a target="_blank" href="https://www.nitt.edu/">here</a><br />
                </div>
            </Modal.Body>
        </Modal>
    );
  }
}
