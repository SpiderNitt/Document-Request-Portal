import React from "react";
import spider from "../../utils/API";
import "./status.css";
import { FaDownload, FaHistory } from "react-icons/fa";
import Timeline from "../timeline/timeline";
import { Collapse } from "react-bootstrap";

const cert_mapping = {
  1: "Bonafide",
  2: "Transcript",
};
export default class Status extends React.Component {
  state = {
    certHis: {},
    loading: true,
    certData: [],
    toggled: [],
  };

  handleToggle = (id) => {
    let toggled = Object.assign([], this.state.toggled);
    if (toggled.includes(id)) {
      for (let i = 0; i < toggled.length; i++) {
        if (toggled[i] === id) {
          toggled.splice(i, 1);
        }
      }
      this.setState({ toggled });
      // return false;
    } else {
      toggled.push(id);
      this.setState({ toggled });
      // return true;
    }
  };

  componentDidMount = async () => {
    try {
      let cid = [];
      let certHis = Object.assign({}, this.state.certHis);
      let res = await spider.get("/api/student");
      let certs = res.data;
      cid = Object.assign([], certs);
      console.log("this is CID shankar:: ", cid);
      this.setState({ certData: cid });

      for (const cc of cid) {
        // console.log(index);
        // let cc = cid[index];
        // console.log(cc);

        let response = await spider.get("/api/student/certificate_history", {
          params: { id: cc.id },
        });
        // console.log("response??:", response);
        certHis[cc.id] = response.data;
        // console.log(certHis);

        // res.data.id = cc.id;
        // certHis.push(res.data);
      }
      // console.log("OUTSIDE IFF");
      this.setState({
        certHis,
        loading: false,
      });
    } catch (err) {
      console.log(err);
    }
  };
  handleDownload = async (id, type) => {
    const usertoken = JSON.parse(localStorage.getItem("bonafideNITT2020user"));
    const roll = usertoken.user;
    let response = await spider.get("api/student/certificate_download", {
      params: { id },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", roll + "_" + type + ".pdf");
    document.body.appendChild(link);
    link.click();
  };

  render() {
    return (
      <div id="cert-status">
        {this.state.loading ? (
          <p>LOADING</p>
        ) : (
          <>
            <div className="page-header row justify-content-center">
              <h1>Your Certificates</h1>
            </div>
            <div className="container req-status">
              <table className="table cert-table status-table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Certificate Type</th>
                    <th scope="col">Current Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.certData.map((data, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{cert_mapping[data.type]}</td>
                          <td>{data.status}</td>
                          <td>
                            <span className="table-icons">
                              <FaDownload
                                onClick={() => {
                                  this.handleDownload(
                                    data.id,
                                    cert_mapping[data.type]
                                  );
                                }}
                                className="table-icons-item"
                              />
                              <FaHistory
                                className="table-icons-item history"
                                onClick={() => {
                                  // console.log("clicked");
                                  this.handleToggle(data.id);
                                }}
                              />
                            </span>
                            {/* <Download
                      certId={data.certificate_id}
                      roll={data.applier_roll}
                      certType={data.certificate_type}
                    /> */}
                          </td>
                        </tr>
                        <Collapse
                          className="timeline-main"
                          in={this.state.toggled.includes(data.id)}
                        >
                          <tr>
                            <td colSpan={4}>
                              {/* {" "}/ */}
                              <Timeline data={this.state.certHis[data.id]} />
                            </td>
                          </tr>
                        </Collapse>
                      </>
                    );
                  })}
                </tbody>
              </table>

              {/* {certificateId.map((cert, index) => {
          return ( */}
              {/* );
        })} */}
            </div>
          </>
        )}
      </div>
    );
  }
}
