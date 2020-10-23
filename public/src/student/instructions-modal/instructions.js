import React from "react";
import { Modal } from "react-bootstrap";
import "./instructions.css";
export default class InstructionsModal extends React.Component {
  render() {
    console.log = console.warn = console.error = () => {};
    return (
      /*eslint-disable-next-line*/
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
            <h3> Instructions</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="instructions-body">
            <h5>GENERAL INSTRUCTIONS</h5>
            <ol>
              <li>
                <strong>Bonafide</strong>
                <ul>
                  <li>
                    Download the document from{" "}
                    <a
                      target="_blank"
                      href="bonafide-new.pdf"
                      rel="noopener noreferrer"
                    >
                      <strong>here</strong>
                    </a>
                    .
                  </li>

                  <li>
                    <strong>Scan and upload</strong> the complete bonafide
                    document.
                  </li>

                  <li>
                    <strong>Signatories</strong> : HOD → Associate
                    Dean(adsw@nitt.edu).
                  </li>
                </ul>
              </li>

              <li>
                <strong>Bonafide (with Residence Proof)</strong>
                <ul>
                  <li>
                    Download the document from{" "}
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href="https://www.nitt.edu/home/academics/formats/BONAFIDE-CERTIFICATE-2016.pdf"
                    >
                      <strong>here </strong>
                    </a>
                    .
                  </li>

                  <li>
                    <strong>Scan and upload</strong> the complete bonafide
                    document.
                  </li>

                  <li>
                    <strong>Signatories</strong> : Warden → HOD → Associate
                    Dean(adsw@nitt.edu).
                  </li>
                </ul>
              </li>

              <li>
                <strong>Transcript</strong>
                <ul>
                  <li>Upload the fee receipt after payment.</li>
                  <li>
                    Refer{" "}
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href="https://www.nitt.edu/home/academics/academic_documents/"
                    >
                      here
                    </a>{" "}
                    for payment information.
                  </li>
                  <li>
                    <strong>Signatories</strong> : transcript@nitt.edu (No need
                    to specify).
                  </li>
                  <li>Choose a mode of delivery of document.</li>
                </ul>
              </li>
              <li>
                <strong>Course Re-Registration/De-Registration</strong>
                <ul>
                  <li>
                    Upload the Course Registration form as obtained from MIS.
                  </li>
                  <li>
                    <strong>Signatories</strong> : Faculty → HOD →
                    ugacad@nitt.edu → ugsection@nitt.edu.
                  </li>
                </ul>
              </li>
            </ol>

            <h5>RELEVANT LINKS:</h5>
            <ul>
              <li>
                Get the webmails of wardens{" "}
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://www.nitt.edu/home/students/facilitiesnservices/hostelsnmess/administration"
                >
                  here
                </a>
              </li>
              <li>
                Get the webmails of faculties{" "}
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://www.nitt.edu/home/academics/departments/faculty/"
                >
                  here
                </a>
              </li>
              <li>
                Get the webmails of HODs{" "}
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://www.nitt.edu/home/administration/hods/"
                >
                  here
                </a>
              </li>
            </ul>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
