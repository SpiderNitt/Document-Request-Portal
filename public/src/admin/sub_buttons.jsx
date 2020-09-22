import React, { useState } from "react";
import spider from "../utils/API";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import "./admin.css";
import { Modal } from "react-bootstrap";

export const Approve = (props) => {
  const [showModal, setModal] = useState(false);
  const [fileStatus, setFileStatus] = useState(false);
  // const [, updateState] = useState();

  const handleClose = () => setModal(false);

  const approveHandler = (e) => {
    e.preventDefault();
    let cd = new FormData();
    if (props.certType === "Bonafide") {
      if (fileStatus) {
        cd.append(
          "certificate",
          document.getElementById("myfile" + props.ID).files[0]
        );
      }
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
        // updateState({}, []);
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
          if (props.certType === "Bonafide") {
            let file = document.getElementById("myfile" + props.ID).files[0];
            if (file) setFileStatus(true);
            else setFileStatus(false);
          }
        }}
      >
        Verify
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
            Are you sure you want to approve the {props.certType} for{" "}
            {props.roll} ? <br />
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
            {!fileStatus && props.certType === "Bonafide" ? (
              <>
                <p className="file-check-msg">
                  <strong>No file uploaded! Proceed with approval?</strong>
                </p>
              </>
            ) : (
              <></>
            )}
            <br />
            <button
              type="submit"
              className="btn btn-success"
              onClick={approveHandler}
            >
              Verify
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export const AddEmailDetails = (props) => {
  const [showModal, setModal] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleClose = () => setModal(false);

  const approveHandler = (e) => {
    e.preventDefault();
    let data = new FormData();
    setLoading(true);
    if (document.getElementById("upload-cert").value) {
      data.append(
        "certificate",
        document.getElementById("upload-cert").files[0]
      );
      data.set("certificate_id", parseInt(props.certId));
      spider
        .post("/api/admin/email", data)
        .then((res) => {
          setModal(false);
          console.log(res, "Added email details");
          // window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {props.email_status ? (
        <button
          className="btn btn-secondary p-1 m-1"
          width="50"
          type="button"
          disabled
        >
          <div>Email Sent</div>
        </button>
      ) : (
        <button
          className="btn btn-success p-1 m-1"
          width="50"
          type="button"
          onClick={(e) => {
            setModal(true);
          }}
        >
          <div>Send via Email</div>
        </button>
      )}

      <Modal
        show={showModal}
        onHide={handleClose}
        keyboard={false}
        dialogClassName="approveModal"
        aria-labelledby="contained-modal-title-vcenter"
      >
        {isLoading ? (
          <>
            <br />
            <Loader
              className="text-center"
              type="Audio"
              color="rgb(13, 19, 41)"
              height={100}
              width={100}
              timeout={3000} //3 secs
            />
            <br />
          </>
        ) : (
          <>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Send {props.certType} to {props.roll} by mail
                <br />
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group comments-main text-center">
                <br />
                <input type="file" id="upload-cert" />
                <br />
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={approveHandler}
                >
                  Submit
                </button>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
};

export const AddPostalDetails = (props) => {
  const [showModal, setModal] = useState(false);

  const handleClose = () => setModal(false);

  const approveHandler = (e) => {
    e.preventDefault();

    if (document.getElementById("postal").value) {
      spider
        .post("/api/admin/postal_status", {
          postal_status: document.getElementById("postal").value,
          certificate_id: props.certId,
        })
        .then((res) => {
          console.log("Added postal details", res);
          setModal(false);
          // window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {props.postal_status ? (
        <button
          className="btn btn-secondary p-1 m-1"
          width="50"
          type="button"
          disabled
        >
          Post Sent
        </button>
      ) : (
        <button
          className="btn btn-success p-1 m-1"
          width="50"
          type="button"
          onClick={(e) => {
            setModal(true);
          }}
        >
          Send via post
        </button>
      )}

      <Modal
        show={showModal}
        onHide={handleClose}
        keyboard={false}
        dialogClassName="approveModal"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Send {props.certType} to {props.roll} by post
            <br />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group comments-main text-center">
            <label htmlFor="comments-app">Postal Details</label>
            {/* <textarea
              type="text"
              className="form-control"
              id="postal"
              placeholder="Add email body"
            /> */}
            <input
              type="text"
              className="form-control"
              id="postal"
              placeholder="Add postal information"
            />
            <br />
            <button
              type="submit"
              className="btn btn-success"
              onClick={approveHandler}
            >
              Submit
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
        window.location.reload();
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
            Are you sure you want to decline the {props.certType} for{" "}
            {props.roll} ? <br />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group comments-main text-center">
            <label htmlFor="comments-dec">Enter Comments (Optional)</label>
            <input
              type="text"
              className="form-control"
              id="comments-dec"
              placeholder="Add optional comments"
            />
            <br />

            <button
              type="submit"
              className="btn btn-danger"
              onClick={declineHandler}
            >
              Decline
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export const Upload = (props) => {
  return (
    <>
      <input
        type="file"
        id={"myfile" + props.ID}
        name="myfile"
        onChange={(e) => {
          let cal = "";
          let cancelbtn = document.getElementById("cancel-btn" + props.ID);
          if (e.target.value) cal = "&#127335;";
          else cal = "";
          console.log(e.target.value);
          cancelbtn.innerHTML = cal;
          cancelbtn.onclick = () => {
            document.getElementById("myfile" + props.ID).value = "";
            cancelbtn.innerHTML = "";
          };
        }}
      />
    </>
  );
};

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

export const DownloadStudentId = (props) => (
  <button
    className="btn btn-primary p-1 m-1"
    width="50"
    type="button"
    onClick={(e) => [
      spider
        .get("api/student/certificate_download", {
          params: { id: props.Id, id_cert: "junk" },
          responseType: "blob",
        })
        .then((res) => {
          console.log(res);
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", props.roll + "_id.pdf");
          document.body.appendChild(link);
          link.click();
        }),
    ]}
  >
    Download
  </button>
);
