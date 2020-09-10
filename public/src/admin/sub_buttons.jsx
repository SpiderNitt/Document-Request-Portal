import React, { useState } from "react";
import spider from "../utils/API";
import "./admin.css";
import { Modal } from "react-bootstrap";

export const Approve = (props) => {
  const [showModal, setModal] = useState(false);
  const [fileStatus, setFileStatus] = useState(false);
  const [, updateState] = useState();
  // const forceUpdate = React.useCallback(() => updateState({}), []);
  var file;
  const handleClose = () => setModal(false);
  const approveHandler = (e) => {
    console.log("clicke");
    e.preventDefault();
    let cd = new FormData();
    if (fileStatus) {
      cd.append("certificate", file);
    }
    if (document.getElementById("comments-app").value) {
      cd.set("comments", document.getElementById("comments-app").value);
    }
    cd.set("certificate_id", parseInt(props.certId));
    spider
      .post("api/admin/approve", cd)
      .then((res) => {
        console.log("Approved");
        setModal(false);
        updateState({}, []);
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <button
        className="btn btn-success p-1 m-1"
        width="50"
        type="button"
        onClick={(e) => {
          setModal(true);
          console.log("click");
          file =
            e.target.parentNode.parentNode.childNodes[5].childNodes[0].files[0];
          console.log(file);
          if (file) setFileStatus(true);
          else setFileStatus(false);

          console.log(fileStatus);
        }}
      >
        Approve
      </button>
      <Modal
        show={showModal}
        onHide={handleClose}
        keyboard={false}
        dialogClassName="approveModal"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Approval - final
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group comments-main text-center">
            <label htmlFor="comments-app">Comments (Optional)</label>
            <input
              type="text"
              className="form-control"
              id="comments-app"
              placeholder="Add optional comments"
            />
            {!fileStatus ? (
              <>
                <p className="file-check-msg">
                  <strong>No file uploaded! Proceed with approval?</strong>
                </p>
                <br />
              </>
            ) : (
              <></>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              onClick={approveHandler}
            >
              Approve
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export const Reject = (props) => {
  const [showModal, setModal] = useState(false);
  const handleClose = () => setModal(false);
  const declineHandler = (e) => {
    console.log("clicke");
    e.preventDefault();
    let comments = "";
    if (document.getElementById("comments-dec").value) {
      comments = document.getElementById("comments-dec").value;
    }
    spider
      .post("api/admin/decline", {
        certificate_id: parseInt(props.certId),
        comments: comments,
      })
      .then((res) => {
        console.log("Declined");
        setModal(false);
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // if (props.status !== "PENDING")
  //   return (
  //     <button className="btn btn-dark p-1 m-1" width="50" type="button">
  //       Reject
  //     </button>
  //   );
  return (
    <>
      <button
        className="btn btn-danger p-1 m-1"
        width="50"
        type="button"
        onClick={() => {
          setModal(true);
        }}
      >
        Reject
      </button>
      <Modal
        show={showModal}
        onHide={handleClose}
        keyboard={false}
        dialogClassName="approveModal"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Decline - final
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group comments-main text-center">
            <label htmlFor="comments-dec">Comments (Optional)</label>
            <input
              type="text"
              className="form-control"
              id="comments-dec"
              placeholder="Add optional comments"
            />

            <button
              type="submit"
              className="btn btn-primary"
              onClick={declineHandler}
            >
              Approve
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export const Upload = () => <input type="file" id="myfile" name="myfile" />;

export const Download = (props) => (
  <button
    className="btn btn-primary p-1 m-1"
    width="50"
    type="button"
    onClick={(e) => [
      spider
        .get("api/student/certificate_download", {
          params: { id: props.certId },
          responseType: "blob",
        })
        .then((res) => {
          console.log(res);
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            props.roll + "_" + props.certType + ".pdf"
          );
          document.body.appendChild(link);
          link.click();
        }),
    ]}
  >
    Download
  </button>
);
