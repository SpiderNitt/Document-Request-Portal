import React from "react";
import spider from "../utils/API";
import "./admin.css";

export const Approve = (props) => {
  if (props.status !== "PENDING") {
    return (
      <button className="btn btn-dark p-1 m-1" width="50" type="button">
        Approve
      </button>
    );
  }
  return (
    <button
      className="btn btn-success p-1 m-1"
      width="50"
      type="button"
      onClick={(e) => {
        let file =
          e.target.parentNode.parentNode.childNodes[5].childNodes[0].files[0];
        if (file) {
          let cd = new FormData();
          cd.set("certificate_id", parseInt(props.certId));
          cd.append("certificate", file);
          console.log(cd);

          spider
            .post("api/admin/approve", cd)
            .then((res) => {
              console.log(res);
              console.log("Approved");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          alert("Enter signed file");
        }
      }}
    >
      Approve
    </button>
  );
};

export const Reject = (props) => {
  if (props.status !== "PENDING")
    return (
      <button className="btn btn-dark p-1 m-1" width="50" type="button">
        Reject
      </button>
    );
  return (
    <button
      className="btn btn-danger p-1 m-1"
      width="50"
      type="button"
      onClick={(e) => {
        let r = window.confirm(`Confirm decline for roll  no: ${props.roll}`);
        if (r === true) {
          spider
            .post("api/admin/decline", {
              certificate_id: props.certId,
            })
            .then((res) => {
              console.log("Done");
              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }}
    >
      Reject
    </button>
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
        .get("api/certificate_download", {
          params: { id: props.certId },
          responseType: "blob",
        })
        .then((res) => {
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
