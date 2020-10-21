import React, { useEffect, useState } from "react";
import spider from "../utils/API";
import NavBar from "../student/navbar/navbar";
import {
  Approve,
  Reject,
  Upload,
  Download,
  DownloadStudentId,
  AddEmailDetails,
  AddPostalDetails,
} from "./sub_buttons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Accordion from "react-bootstrap/Accordion";
import { Card } from "react-bootstrap";
import Loader from "react-loader-spinner";
import "./admin.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import xlsExport from "xlsexport";

import { FaListAlt } from "react-icons/fa";

function Admin() {
  const [certReq, setReq] = useState([]);
  const [isLoading, setLoad] = useState(true);
  const [certTypes, setTypes] = useState([]);
  const [length, setLength] = useState(0);

  useEffect(() => {
    spider
      .get("/api/student/certificate_types")
      .then((res) => {
        res.data.map((x) => {
          x.certificate_type_id = x.id;
          x.certificate_type = x.name;
          delete x.name;
          delete x.id;
          return true;
        });
        setTypes(Object.assign(certTypes, res.data));
      })
      .catch((err) => {});
    spider
      .get("/api/admin")
      .then(async (res) => {
        if (res === undefined) {
          window.location = "/";
        }
        let temp = [];
        res.data.forEach((cc) => {
          temp = Object.assign([], res.data);
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
            }
          });
          temp[i].approved = approval_list;
          temp[i].id = i + 1;
        }
        let merged = [];

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
        setLength(
          certReq[0].certificates.length +
            certReq[1].certificates.length +
            certReq[2].certificates.length +
            certReq[3].certificates.length +
            certReq[4].certificates.length +
            certReq[5].certificates.length
        );
        setLoad(false);
      })
      .catch((err) => {});
  }, []);
  const createButton = () => {
    var buttons = [];
    var certs = [];
    certReq.map((certreq) => {
      certreq.certificates.forEach((cert) => {
        certs.push(certreq);
      });
    });
    certs = [...new Set(certs)];
    certs.map((item, index) => {
      buttons.push(
        <div id={item.certificate_type} key={index}>
          <button
            onClick={() => {
              exportToExcel(item);
            }}
            style={{ margin: "10px" }}
          >
            Export to Excel
          </button>
        </div>
      );
    });
    return buttons;
  };
  const exportToExcel = (certreq) => {
    var excelData = [];
    let index = 0;
    if (certreq.certificate_type === "Bonafide") {
      certreq.certificates.map((cert) => {
        let temp = {};
        index = index + 1;
        if (document.getElementById(cert.id).checked === true) {
          temp["S.No"] = index;
          temp["Document Type"] = certreq.certificate_type;
          temp["Roll number"] = cert["applier_roll"];
          temp["Purpose"] = cert["purpose"];
          temp["Contact"] = cert["contact"];
          temp["Status"] = cert["status"];
          temp["Approved"] = cert["approved"];
          temp["name"] = cert["name"];
          excelData.push(temp);
        }
      });
    } else if (certreq.certificate_type === "Transcript") {
      certreq.certificates.map((cert) => {
        let temp = {};
        index = index + 1;
        if (document.getElementById(cert.id).checked === true) {
          temp["S.No"] = index;
          temp["Document Type"] = certreq.certificate_type;
          temp["Roll number"] = cert["applier_roll"];
          temp["Address"] = cert["address"];
          temp["Email"] = cert["email"];
          temp["Purpose"] = cert["purpose"];
          temp["Contact"] = cert["contact"];
          temp["Receipt"] = cert["receipt"];
          temp["Number of copies"] = cert["no_copies"];
          temp["Status"] = cert["status"];
          temp["Postal Status"] = cert["postal_status"];
          temp["Email Status"] = cert["email_status"];
          temp["Approved"] = cert["approved"];
          temp["name"] = cert["name"];
          excelData.push(temp);
        }
      });
    } else if (
      certreq.certificate_type === "Course Re-Registration" ||
      certreq.certificate_type === "Course De-Registration"
    ) {
      certreq.certificates.map((cert) => {
        let temp = {};
        index = index + 1;
        if (document.getElementById(cert.id).checked === true) {
          temp["S.No"] = index;
          temp["Document Type"] = certreq.certificate_type;
          temp["Roll number"] = cert["applier_roll"];
          temp["Purpose"] = cert["purpose"];
          temp["Contact"] = cert["contact"];
          temp["Course Code"] = cert["course_code"];
          temp["Course Name"] = cert["course_name"];
          temp["Status"] = cert["status"];
          temp["Approved"] = cert["approved"];
          temp["name"] = cert["name"];
          excelData.push(temp);
        }
      });
    } else {
      certreq.certificates.map((cert) => {
        let semesterCopiesInfo = "";
        for (let i = 0; i < cert.response_rank_grade_rows.length; i++) {
          semesterCopiesInfo +=
            "Sem " +
            cert.response_rank_grade_rows[i].semester_no +
            " - (x" +
            cert.response_rank_grade_rows[i].no_copies +
            "), ";
        }
        let temp = {};
        index = index + 1;
        if (document.getElementById(cert.id).checked === true) {
          temp["S.No"] = index;
          temp["Document Type"] = certreq.certificate_type;
          temp["Roll number"] = cert["applier_roll"];
          temp["Purpose"] = cert["purpose"];
          temp["Contact"] = cert["contact"];
          temp["Semester Copies"] = semesterCopiesInfo;
          temp["Status"] = cert["status"];
          temp["Approved"] = cert["approved"];
          temp["name"] = cert["name"];
          excelData.push(temp);
        }
      });
    }
    if (excelData.length) {
      const xls = new xlsExport(excelData, "Info");
      xls.exportToXLS(`${certreq.certificate_type}_Request_List.xls`);
    }
  };

  return (
    <>
      <NavBar screen={1} />
      <h1 className="text-center cert-upl-head">Admin Document Portal</h1>
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
        ) : length ? (
          <div>
            {certReq.map((cert, index) => {
              let pending = 0,
                approved = 0;
              cert.certificates.forEach((certificate) => {
                if (certificate.status.includes("APPROVED")) {
                  approved = approved + 1;
                } else if (certificate.status.includes("PENDING")){
                  pending = pending + 1;
                }
              });
              return (
                <div key={index}>
                  {cert.certificates.length ? (
                    <Accordion className="acc-main text-center">
                      <Card className="table-main">
                        <Card.Header className="tableHeader">
                          <Accordion.Toggle
                            as={Card.Header}
                            variant="link"
                            eventKey="0"
                            className="card-header acc-title"
                          >
                            <p>{cert.certificate_type}</p>
                            <span className="pending-approved-number">
                              Pending:
                              <span className="req-notif">{pending}</span>
                            </span>
                            {/* {cert.certificate_type === "Transcript" ? ( */}
                            <span className="pending-approved-number">
                              Approved:
                              <span className="req-notif">{approved}</span>
                            </span>
                            {/* ) : (
                              <></>
                            )} */}
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            <div className="download-details">
                              {createButton().filter((button) => {
                                if (button.props.id === cert.certificate_type)
                                  return button;
                              })}
                            </div>
                            {(pending === 0 &&
                              approved === 0 &&
                              cert.certificate_type === "Transcript") ||
                            (pending === 0 &&
                              approved === 0 &&
                              cert.certificate_type === "Bonafide") ||
                            (pending === 0 &&
                              approved === 0 &&
                              cert.certificate_type ===
                                "Course De-Registration") ||
                            (pending === 0 &&
                              approved === 0 &&
                              cert.certificate_type ===
                                "Course Re-registration") ||
                            (pending === 0 &&
                              approved === 0 &&
                              cert.certificate_type === "Rank Card") ||
                            (pending === 0 &&
                              approved === 0 &&
                              cert.certificate_type === "Grade Card") ||
                            0 ? (
                              <p className="placeholder-nil text-center">
                                <FaListAlt className="mr-2" />
                                No document requests
                              </p>
                            ) : (
                              <>
                                {pending ? (
                                  <div className="table-responsive">
                                    <div style={{ fontWeight: "bold", fontSize: "1.75em" }}>
                                      Pending
                                    </div>
                                    <table
                                      id="cert_table"
                                      className="table cert-table"
                                    >
                                      <thead className="thead-dark">
                                        <tr>
                                          <th scope="col">S.No</th>
                                          <th scope="col">Name (Roll No.)</th>
                                          <th scope="col">
                                            Previous Approvals
                                          </th>
                                          <th scope="col">Document file</th>
                                          <th scope="col">Student ID</th>
                                          {cert.certificate_type ===
                                          "Bonafide" ? (
                                            <th scope="col">Upload Document</th>
                                          ) : (
                                            <></>
                                          )}
                                          {cert.certificate_type ===
                                            "Course De-Registration" ||
                                          cert.certificate_type ===
                                            "Course Re-registration" ? (
                                            <>
                                              <th scope="col">Course Code</th>
                                              <th scope="col">Course Name</th>
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                          {cert.certificate_type ===
                                          "Transcript" ? (
                                            <th>Number of copies</th>
                                          ) : (
                                            <></>
                                          )}
                                          {cert.certificate_type ===
                                            "Rank Card" ||
                                          cert.certificate_type ===
                                            "Grade Card" ? (
                                            <th>Semester Copies</th>
                                          ) : (
                                            <></>
                                          )}
                                          <th>Purpose</th>
                                          <th>Contact</th>
                                          <th scope="col">Decision</th>
                                          <th></th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {cert.certificates.map(
                                          (data, index) => {
                                            if (
                                              data.status.includes("PENDING")
                                            ) {
                                              if (
                                                cert.certificate_type ===
                                                  "Rank Card" ||
                                                cert.certificate_type ===
                                                  "Grade Card"
                                              ) {
                                                var semCopies = "";
                                                for (
                                                  let i = 0;
                                                  i <
                                                  data.response_rank_grade_rows
                                                    .length;
                                                  i++
                                                ) {
                                                  semCopies +=
                                                    "Sem " +
                                                    data
                                                      .response_rank_grade_rows[
                                                      i
                                                    ].semester_no +
                                                    " - (x" +
                                                    data
                                                      .response_rank_grade_rows[
                                                      i
                                                    ].no_copies +
                                                    "), ";
                                                }
                                              }
                                              return (
                                                <tr key={index + 1}>
                                                  <th>{index + 1}</th>
                                                  <td>
                                                    {data.name} (
                                                    {data.applier_roll})
                                                  </td>
                                                  <td>
                                                    {data.approved.length === 0
                                                      ? "-"
                                                      : data.approved.map(
                                                          (emails, index) => {
                                                            return (
                                                              <div key={index}>
                                                                {emails}
                                                                <br />
                                                              </div>
                                                            );
                                                          }
                                                        )}
                                                  </td>
                                                  <td>
                                                    <Download
                                                      certId={
                                                        data.certificate_id
                                                      }
                                                      roll={data.applier_roll}
                                                      certType={
                                                        cert.certificate_type
                                                      }
                                                      ext={
                                                        data.certificate_extension
                                                      }
                                                    />
                                                  </td>
                                                  <td>
                                                    <DownloadStudentId
                                                      Id={data.certificate_id}
                                                      roll={data.applier_roll}
                                                      certType={
                                                        cert.certificate_type
                                                      }
                                                      ext={data.id_extension}
                                                    />
                                                  </td>
                                                  {cert.certificate_type ===
                                                    "Course De-Registration" ||
                                                  cert.certificate_type ===
                                                    "Course Re-registration" ? (
                                                    <>
                                                      <td>
                                                        {data.course_code}
                                                      </td>
                                                      <td>
                                                        {data.course_name}
                                                      </td>
                                                    </>
                                                  ) : (
                                                    <></>
                                                  )}
                                                  {cert.certificate_type ===
                                                  "Bonafide" ? (
                                                    <td>
                                                      <Upload
                                                        ID={index}
                                                        roll={data.applier_roll}
                                                        certType={
                                                          cert.certificate_type
                                                        }
                                                      />
                                                      <span
                                                        className="cancel-btn"
                                                        id={
                                                          "cancel-btn" + index
                                                        }
                                                      ></span>
                                                    </td>
                                                  ) : (
                                                    <></>
                                                  )}
                                                  {cert.certificate_type ===
                                                  "Transcript" ? (
                                                    <td>{data.no_copies}</td>
                                                  ) : (
                                                    <></>
                                                  )}
                                                  {cert.certificate_type ===
                                                    "Rank Card" ||
                                                  cert.certificate_type ===
                                                    "Grade Card" ? (
                                                    <td>{semCopies}</td>
                                                  ) : (
                                                    <></>
                                                  )}
                                                  <td>
                                                    {data.purpose
                                                      ? data.purpose
                                                      : "-"}
                                                  </td>
                                                  <td>
                                                    {data.contact
                                                      ? data.contact
                                                      : "-"}
                                                  </td>
                                                  <td>
                                                    <Approve
                                                      ID={index}
                                                      roll={data.applier_roll}
                                                      certId={
                                                        data.certificate_id
                                                      }
                                                      status={data.status}
                                                      certType={
                                                        cert.certificate_type
                                                      }
                                                    />{" "}
                                                    <Reject
                                                      roll={data.applier_roll}
                                                      certId={
                                                        data.certificate_id
                                                      }
                                                      status={data.status}
                                                      certType={
                                                        cert.certificate_type
                                                      }
                                                    />
                                                  </td>
                                                  <td>
                                                    <input
                                                      id={data.id}
                                                      type="checkbox"
                                                      defaultChecked="true"
                                                    />
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <></>
                                )}
                                {approved ? (
                                  <div className="table-responsive">
                                    <div style={{ fontWeight: "bold", fontSize: "1.75em" }}>
                                      Approved
                                    </div>
                                    <table
                                      id="cert_table"
                                      className="table cert-table"
                                    >
                                      <thead className="thead-dark">
                                        <tr>
                                          <th scope="col">S.No</th>
                                          <th scope="col">Name (Roll No.)</th>
                                          <th scope="col">
                                            Previous Approvals
                                          </th>
                                          {cert.certificate_type ===
                                            "Course De-Registration" ||
                                          cert.certificate_type ===
                                            "Course Re-registration" ? (
                                            <>
                                              <th scope="col">Course Code</th>
                                              <th scope="col">Course Name</th>
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                          {cert.certificate_type ===
                                          "Transcript" ? (
                                            <>
                                              <th scopr="col">
                                                Number of copies
                                              </th>
                                              <th scope="col">Email Address</th>
                                              <th scope="col">
                                                Postal Address
                                              </th>
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                          {cert.certificate_type ===
                                            "Rank Card" ||
                                          cert.certificate_type ===
                                            "Grade Card" ? (
                                            <>
                                              <th scopr="col">
                                                Semester Copies
                                              </th>
                                              <th scope="col">Email Address</th>
                                              <th scope="col">
                                                Postal Address
                                              </th>
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                          <th scope="col">Contact</th>
                                          <th scope="col">Document file</th>
                                          {cert.certificate_type ===
                                          "Bonafide" ? (
                                            <th scope="col">Upload Document</th>
                                          ) : (
                                            <></>
                                          )}
                                          {cert.certificate_type ===
                                            "Transcript" ||
                                          cert.certificate_type ===
                                            "Rank Card" ||
                                          cert.certificate_type ===
                                            "Grade Card" ? (
                                            <>
                                              <th scope="col">Email</th>
                                              <th scope="col">Postal</th>
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                          <th></th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {cert.certificates.map(
                                          (data, index) => {
                                            if (
                                              data.status.includes("APPROVED")
                                            ) {
                                              if (
                                                cert.certificate_type ===
                                                  "Rank Card" ||
                                                cert.certificate_type ===
                                                  "Grade Card"
                                              ) {
                                                var semCopies = "";
                                                for (
                                                  let i = 0;
                                                  i <
                                                  data.response_rank_grade_rows
                                                    .length;
                                                  i++
                                                ) {
                                                  semCopies +=
                                                    "Sem " +
                                                    data
                                                      .response_rank_grade_rows[
                                                      i
                                                    ].semester_no +
                                                    " - (x" +
                                                    data
                                                      .response_rank_grade_rows[
                                                      i
                                                    ].no_copies +
                                                    "), ";
                                                }
                                              }
                                              return (
                                                <tr key={index + 1}>
                                                  <th>{index + 1}</th>
                                                  <td>
                                                    {data.name} (
                                                    {data.applier_roll})
                                                  </td>
                                                  <td>
                                                    {data.approved.length === 0
                                                      ? "-"
                                                      : data.approved.map(
                                                          (emails, index) => {
                                                            return (
                                                              <div key={index}>
                                                                {emails}
                                                                <br />
                                                              </div>
                                                            );
                                                          }
                                                        )}
                                                  </td>
                                                  {cert.certificate_type ===
                                                    "Course De-Registration" ||
                                                  cert.certificate_type ===
                                                    "Course Re-registration" ? (
                                                    <>
                                                      <td>
                                                        {data.course_code}
                                                      </td>
                                                      <td>
                                                        {data.course_name}
                                                      </td>
                                                    </>
                                                  ) : (
                                                    <></>
                                                  )}
                                                  {cert.certificate_type ===
                                                  "Transcript" ? (
                                                    <>
                                                      <td>{data.no_copies}</td>
                                                      <td>
                                                        {data.email
                                                          ? data.email
                                                          : "-"}
                                                      </td>
                                                      <td>
                                                        {data.address
                                                          ? data.address
                                                          : "-"}
                                                      </td>
                                                    </>
                                                  ) : (
                                                    <></>
                                                  )}
                                                  {cert.certificate_type ===
                                                    "Rank Card" ||
                                                  cert.certificate_type ===
                                                    "Grade Card" ? (
                                                    <>
                                                      <td>{semCopies}</td>
                                                      <td>
                                                        {data.email
                                                          ? data.email
                                                          : "-"}
                                                      </td>
                                                      <td>
                                                        {data.address
                                                          ? data.address
                                                          : "-"}
                                                      </td>
                                                    </>
                                                  ) : (
                                                    <></>
                                                  )}
                                                  <td>
                                                    {data.contact
                                                      ? data.contact
                                                      : "-"}
                                                  </td>
                                                  <td>
                                                    <Download
                                                      certId={
                                                        data.certificate_id
                                                      }
                                                      roll={data.applier_roll}
                                                      certType={
                                                        cert.certificate_type
                                                      }
                                                      ext={
                                                        data.certificate_extension
                                                      }
                                                    />
                                                  </td>
                                                  {cert.certificate_type ===
                                                  "Bonafide" ? (
                                                    <td>
                                                      <Upload
                                                        ID={index}
                                                        roll={data.applier_roll}
                                                        certType={
                                                          cert.certificate_type
                                                        }
                                                      />
                                                      <span
                                                        className="cancel-btn"
                                                        id={
                                                          "cancel-btn" + index
                                                        }
                                                      ></span>
                                                    </td>
                                                  ) : (
                                                    <></>
                                                  )}
                                                  {cert.certificate_type ===
                                                    "Transcript" ||
                                                  cert.certificate_type ===
                                                    "Rank Card" ||
                                                  cert.certificate_type ===
                                                    "Grade Card" ? (
                                                    <>
                                                      <td>
                                                        {data.email ? (
                                                          <AddEmailDetails
                                                            roll={
                                                              data.applier_roll
                                                            }
                                                            certType={
                                                              cert.certificate_type
                                                            }
                                                            certId={
                                                              data.certificate_id
                                                            }
                                                            email_status={
                                                              data.email_status
                                                            }
                                                            postal_status={
                                                              data.postal_status
                                                            }
                                                          />
                                                        ) : (
                                                          <>-</>
                                                        )}
                                                      </td>
                                                      <td>
                                                        {data.address ? (
                                                          <AddPostalDetails
                                                            roll={
                                                              data.applier_roll
                                                            }
                                                            certType={
                                                              cert.certificate_type
                                                            }
                                                            certId={
                                                              data.certificate_id
                                                            }
                                                            email_status={
                                                              data.email_status
                                                            }
                                                            postal_status={
                                                              data.postal_status
                                                            }
                                                          />
                                                        ) : (
                                                          <>-</>
                                                        )}
                                                      </td>
                                                    </>
                                                  ) : (
                                                    <></>
                                                  )}
                                                  <td>
                                                    <input
                                                      id={data.id}
                                                      type="checkbox"
                                                      defaultChecked="true"
                                                    />
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </>
                            )}
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
            <br />
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.5em",
            }}
          >
            No document requests
          </div>
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
