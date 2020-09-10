import React, { useEffect, useState } from "react";
import spider from "../utils/API";
import NavBar from "../student/navbar/navbar";
import { Approve, Reject, Upload, Download } from "./sub_buttons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Accordion from "react-bootstrap/Accordion";
import { Card } from "react-bootstrap";
import "./admin.css";

function Admin() {
  const [certReq, setReq] = useState([]);
  const [isLoading, setLoad] = useState(true);
  const [certTypes, setTypes] = useState([]);

  useEffect(() => {
    spider
      .get("/api/student/certificate_types")
      .then((res) => {
        // console.log(res);
        res.data.map((x) => {
          x.certificate_type_id = x.id;
          x.certificate_type = x.type;
          delete x.type;
          delete x.id;
          return true;
        });
        setTypes(Object.assign(certTypes, res.data));
      })
      .catch((err) => {
        console.log(err);
      });
    spider
      .get("/api/admin")
      .then(async (res) => {
        // console.log(res);
        let temp = [];
        res.data.forEach((cc) => {
          if (cc.status === "PENDING") temp = Object.assign([], res.data);
        });
        for (let i = 0; i < temp.length; i++) {
          let approval_list = [];
          temp[i].approved = [];

          let res = await spider.get("/api/student/certificate_history", {
            params: { id: temp[i].certificate_id },
          });
          res.data.forEach((t) => {
            if (t.status === "APPROVED") {
              approval_list.push(t.path_email);
              console.log(approval_list);
            }
          });
          temp[i].approved = approval_list;
          // console.log("for:", approval_list[0]);
          temp[i].id = i + 1;
        }
        let merged = [];
        // console.log("temp;", temp[0].approved[0]);

        certTypes.forEach((typ) => {
          let tempType = {
            certificate_type_id: typ.certificate_type_id,
            certificate_type: typ.certificate_type,
            certificates: [],
          };
          temp.map((c) => {
            if (c.certificate_type === typ.certificate_type_id) {
              delete c.certificate_type;
              tempType.certificates.push(c);
            }
            return true;
          });
          merged.push(tempType);
        });
        setReq(Object.assign(certReq, merged));
        setLoad(false);
        console.log("final:", certReq[1].certificates[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <NavBar screen={1} />
      <h1 className="text-center cert-upl-head">Admin Certificate Portal</h1>
      <div className="container admin">
        <br />
        {isLoading ? (
          <p>LOADING</p>
        ) : (
          certReq.map((cert, index) => {
            return (
              <Accordion className="acc-main text-center" key={index}>
                <Card className="table-main">
                  <Card.Header className="tableHeader">
                    <Accordion.Toggle
                      as={Card.Header}
                      variant="link"
                      eventKey="0"
                      className="text-center"
                    >
                      {cert.certificate_type}
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <table className="table cert-table">
                        <thead className="thead-dark">
                          <tr>
                            <th scope="col">S.No</th>
                            <th scope="col">Roll No.</th>
                            <th scope="col">Status</th>
                            <th scope="col">Previous Approvals</th>
                            <th scope="col">Certificate file</th>
                            <th scope="col">Upload Certificate</th>
                            <th scope="col">Decision</th>
                          </tr>
                        </thead>

                        <tbody>
                          {cert.certificates.map((data, index) => {
                            return (
                              <tr key={index}>
                                <th>{data.id}</th>
                                <td>{data.applier_roll}</td>
                                <th>{data.status}</th>
                                <td>
                                  {data.approved.map((emails, index) => {
                                    return (
                                      <div key={index}>
                                        {emails}
                                        <br />
                                      </div>
                                    );
                                  })}
                                </td>
                                <td>
                                  <Download
                                    certId={data.certificate_id}
                                    roll={data.applier_roll}
                                    certType={cert.certificate_type}
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
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            );
          })
        )}
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
    </>
  );
}

export default Admin;
