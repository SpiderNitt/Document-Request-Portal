import React from "react";
import { Modal } from "react-bootstrap";
import "./instructions.css"
export default class SignatoriesInstructionsModal extends React.Component {
    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.hide}
                keyboard={false}
                dialogClassName="approveModal"
                aria-labelledby="modal-inst"
                className="certModal"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h3>Order of Signatories</h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="instructions-body">
                
                        <ul>
                            <li><strong>Bonafide</strong> : Warden → HOD → Associate Dean (adsw@nitt.edu)</li>
                            <li><strong>Course De-Reg / Re-Reg</strong> : Faculty → HOD → ugacad@nitt.edu → ugsection@nitt.edu</li>
                        </ul>
                        <br />
                        <div>
                            <h4>RELEVANT LINKS:</h4>
                            <ul>
                                <li>Get the webmails of wardens <a target="_blank" href="https://www.nitt.edu/home/students/facilitiesnservices/hostelsnmess/administration" >here</a></li>
                                <li>Get the webmails of faculties <a target="_blank" href="https://www.nitt.edu/home/academics/departments/faculty/">here</a></li>
                                <li>Get the webmails of HODs <a target="_blank" href="https://www.nitt.edu/home/administration/hods/">here</a></li>
                            </ul>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
