import React, { useEffect, useState } from "react";
import spider from "../utils/API";
import NavBar from "../student/navbar/navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./admin.css";

const Approve = (props) => {
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

const Reject = (props) => {
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
const Upload = () => <input type="file" id="myfile" name="myfile" />;

const Download = (props) => (
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

function CustomStylesGSheets() {
  const [certReq, setReq] = useState([]);
  const [isLoading, setLoad] = useState(true);
  useEffect(() => {
    spider
      .get("/api/admin")
      .then((res) => {
        let temp = [];
        res.data.forEach((cc) => {
          if (cc.status === "PENDING") temp = Object.assign([], res.data);
        });
        // let temp = Object.assign([], res.data);
        console.log(temp.length);
        for (let i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
          if (temp[i].certificate_type === 1)
            temp[i].certificate_type = "Bonafide";
        }
        setReq(Object.assign(certReq, temp));
        setLoad(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container-fluid admin">
      <NavBar screen={1} />
      <h2 className="text-center cert-upl-head">Admin Certificate Portal</h2>
      {isLoading === false && (
        <>
          <table className="table cert-table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">S.No</th>
                <th scope="col">Roll No.</th>
                <th scope="col">Certificate Type</th>
                <th scope="col">Status</th>
                <th scope="col">Certificate file</th>
                <th scope="col">Upload Certificate</th>
                <th scope="col">Decision</th>
              </tr>
            </thead>

            <tbody>
              {certReq.map((data, index) => {
                return (
                  <tr key={index}>
                    <th>{data.id}</th>
                    <td>{data.applier_roll}</td>
                    <td>{data.certificate_type}</td>
                    <th>{data.status}</th>
                    <td>
                      <Download
                        certId={data.certificate_id}
                        roll={data.applier_roll}
                        certType={data.certificate_type}
                      />
                    </td>
                    <td>
                      <Upload />
                    </td>
                    <td>
                      <Approve
                        certId={data.certificate_id}
                        status={data.status}
                      />{" "}
                      <Reject
                        certId={data.certificate_id}
                        roll={data.applier_roll}
                        status={data.status}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}{" "}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default CustomStylesGSheets;
