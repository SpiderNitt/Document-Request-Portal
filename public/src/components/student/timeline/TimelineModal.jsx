import React from "react";
import { Modal } from "react-bootstrap";
import Timeline from "../timeline/timeline";

export default class TimelineModal extends React.Component {
  render(props) {
    console.log = console.warn = console.error = () => {};
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.hide}
        keyboard={false}
        dialogClassName="approveModal"
        aria-labelledby="contained-modal-title-vcenter"
        className="certModal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Timeline
            data={this.props.data}
            email={this.props.email}
            postal={this.props.postal}
          ></Timeline>
        </Modal.Body>
      </Modal>
    );
  }
}
