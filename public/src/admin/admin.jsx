import React, { useEffect, useState } from "react";
import spider from "../utils/API";
import NavBar from "../student/navbar/navbar";
import { Approve, Reject, Upload, Download, AddEmailDetails, AddPostalDetails } from "./sub_buttons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Accordion from "react-bootstrap/Accordion";
import { Card } from "react-bootstrap";
import Loader from "react-loader-spinner";
import "./admin.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import xlsExport from "xlsexport";

import { FaListAlt } from 'react-icons/fa'

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
        console.log(certReq, certReq[0].certificates);
        setLoad(false);
        console.log("final:", certReq[1].certificates[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  const exportToExcel = () => {
    var excelData = [];
    let index = 0;
    certReq[0].certificates.map(cert => {
      let temp = {};
      index = index + 1;
      if(document.getElementById(cert.id).checked === true) {
        temp["S.No"] = index;
        temp["Roll number"] = cert["applier_roll"];
        temp["Address"] = cert["address"];
        temp["Email"] = cert["email"];
        temp["Status"] = cert["status"];
        temp["Postal Status"] = cert["postal_status"];
        temp["Email Status"] = cert["email_status"];
        temp["Receipt"] = cert["receipt"];
        temp["Approved"] = cert["approved"];
        temp["Certificate Type"] = "Bonafide";
        excelData.push(temp);
      }
    });
    certReq[1].certificates.map(cert => {
      index = index + 1;
      let temp = {};
      if(document.getElementById(cert.id).checked === true) {
        temp["S.No"] = index;
        temp["Roll number"] = cert["applier_roll"];
        temp["Address"] = cert["address"];
        temp["Email"] = cert["email"];
        temp["Status"] = cert["status"];
        temp["Postal Status"] = cert["postal_status"];
        temp["Email Status"] = cert["email_status"];
        temp["Receipt"] = cert["receipt"];
        temp["Approved"] = cert["approved"];
        temp["Certificate Type"] = "Transcript";
        excelData.push(temp);
      }
    });
    const xls = new xlsExport(excelData, "Info");
    xls.exportToXLS('export.xls')
  }

  return (
    <>
      <NavBar screen={1} />
      <h1 className="text-center cert-upl-head">Admin Certificate Portal</h1>
      <div className="container-fluid admin">
        <br />
        {isLoading ? (
          <Loader
            className="text-center"
            type="Audio"
            color="rgb(13, 19, 41)"
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
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
                        className="text-center card-header acc-title"
                      >
                        {cert.certificate_type}
                        <p className="req-notif">
                          {" "}
                          {cert.certificates.length}{" "}
                        </p>
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>
                      <div
                          className="download-details"
                        >
                          <button
                            onClick={() => {exportToExcel()}}
                          >
                            Export to Excel
                          </button>
                        </div>
                        {cert.certificates.length == 0 ? <p className="placeholder-nil text-center"><FaListAlt className='mr-2'/>No pending certificates </p> : <>
                          <table id="cert_table" className="table cert-table">
                            <thead className="thead-dark">
                              <tr>
                                <th scope="col">S.No</th>
                                <th scope="col">Roll No.</th>
                                <th scope="col">Status</th>
                                <th scope="col">Previous Approvals</th>
                                <th scope="col">Certificate file</th>
                                {cert.certificate_type === "Bonafide"
                                ? <th scope="col">Upload Certificate</th>
                                : <div></div>
                                }
                                <th scope="col">Email</th>
                                <th scope="col">Postal</th>
                                <th scope="col">Decision</th>
                                <th></th>
                              </tr>
                            </thead>

                            <tbody>
                              {
                                cert.certificates.map((data, index) => {
                                  return (
                                    <tr key={index}>
                                      <th>{index + 1}</th>
                                      <td>{data.applier_roll}</td>
                                      <th>{data.status}</th>
                                      <td>
                                        {data.approved.length == 0 ? '-' :
                                          data.approved.map((emails, index) => {
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
                                      { cert.certificate_type === "Bonafide"
                                      ? <td>
                                          <Upload 
                                            ID={index}
                                            roll={data.applier_roll}
                                            certType={cert.certificate_type}
                                          />
                                          <span
                                            className="cancel-btn"
                                            id={"cancel-btn" + index}
                                          ></span>
                                        </td> 
                                      : <div></div>
                                      }
                                      <td>
                                        <AddEmailDetails 
                                          roll={data.applier_roll}
                                          certType={cert.certificate_type}
                                        />
                                      </td>
                                      <td>
                                        <AddPostalDetails
                                          roll={data.applier_roll}
                                          certType={cert.certificate_type}
                                        />
                                      </td>
                                      <td>
                                        <Approve
                                          ID={index}
                                          roll={data.applier_roll}
                                          certId={data.certificate_id}
                                          status={data.status}
                                          certType={cert.certificate_type}
                                        />{" "}
                                        <Reject
                                          roll={data.applier_roll}
                                          certId={data.certificate_id}
                                          status={data.status}
                                          certType={cert.certificate_type}
                                        />
                                      </td>
                                      <td>
                                        <input 
                                          id={data.id} 
                                          certType={cert.certificate_type}
                                          type="checkbox" 
                                          defaultChecked="true" 
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </>
                        }
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
