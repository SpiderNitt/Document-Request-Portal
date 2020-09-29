import React from "react";
import { Modal } from "react-bootstrap";

export default class InstructionsModal extends React.Component {
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
                <ol>
                    <li>Select document type (Bonafide / Transcript / Course De-Registration / Course Re-Registration)<br /></li>
                    <li>Enter Contact Number<br /></li>
                    <li>Signatories' Email address pathway for the documents<br/>
                        <ul>
                            <li><strong>Bonafide</strong> : Warden -> HOD -> Associate Dean</li>
                            <li><strong>Transcript</strong> : Default Path</li>
                            <li><strong>Course Dereg / Rereg</strong> : Faculty -> HOD -> UG DEAN Acad -> UG Office</li>
                        </ul>
                        <br />
                        <strong>NOTE :</strong> Get the webmails of faculties from <a target="_blank" href="https://www.nitt.edu/">here</a><br />
                        <br />
                    </li>
                    <li>Upload document
                        Download the necessary documents :<br/>
                        <ul>
                            <li><strong>Bonafide</strong> : Formats for Download</li>
                            <li><strong>Transcript</strong> : Fee Receipt</li>
                            <li><strong>Course De-Reg / Re-Reg</strong> : Course Plan</li>
                        </ul>
                    </li>
                </ol>
            </Modal.Body>
        </Modal>
    );
  }
}
