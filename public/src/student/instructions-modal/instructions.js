import React from "react";
import { Modal } from "react-bootstrap";
import "./instructions.css"
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
                        <h3> Instructions</h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='instructions-body'>
                        <h5>GENERAL INSTRUCTIONS</h5>
                        <ol>
                            <li>
                                <strong>Bonafide</strong>
                                <ul>
                                    <li><strong>Scan and upload</strong> the complete bonafide document.</li>
                                    <li>Download the document from <a target="_blank" href='https://www.nitt.edu/home/academics/formats/BONAFIDE-CERTIFICATE-2016.pdf'><strong>here </strong></a></li>
                                    <li><strong>Signatories</strong> : Warden → HOD → Associate Dean(adsw@nitt.edu)</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Transcript</strong>
                                <ul>
                                    <li>Upload the fee receipt after payment</li>
                                    <li>Refer <a target="_blank" href="https://www.nitt.edu/home/academics/academic_documents/">here</a> for payment information</li>
                                    <li><strong>Signatories</strong> : transcript@nitt.edu (No need to specify)</li>
                                    <li>Choose a mode of delivery of document</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Course Re-Registraion/De-Registraion</strong>
                                <ul>
                                    <li>Upload the Course Registration form as obtained from MIS.</li>
                                    <li><strong>Signatories</strong> : Faculty → HOD → ugacad@nitt.edu → ugsection@nitt.edu</li>
                                </ul>
                            </li>
                        </ol>

                        <h5>RELEVANT LINKS:</h5>
                            <ul>
                                <li>Get the webmails of faculties <a target="_blank" href="https://www.nitt.edu/home/academics/departments/faculty/">here</a></li>
                                <li>Get the webmails of HODs <a target="_blank" href="https://www.nitt.edu/home/administration/hods/">here</a></li>
                               
                            </ul>


                    </div>
                </Modal.Body>
            </Modal >
        );
    }
}
