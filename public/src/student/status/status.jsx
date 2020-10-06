import React from "react";
import spider from "../../utils/API";
import "./status.css";
import { FaDownload, FaHistory } from "react-icons/fa";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import TimelineModal from "../timeline/TimelineModal";

const cert_mapping = {
  1: "Bonafide",
  2: "Transcript",
  3: "Course De-Registration",
  4: "Course Re-Registration",
};

let certStatus1 = 0, certStatus2 = 0, checkStatus1 = 0, checkStatus2 = 0;

export default class Status extends React.Component {
  state = {
    certHis: {},
    loading: true,
    certData: [],
    toggled: [],
    modalViewed: -1,
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
  setModalViewed = (id) => {
    this.setState({
      modalViewed: id,
    });
  };
  hideModalViewed = () => {
    this.setState({
      modalViewed: -1,
    });
  };

  componentDidMount = async () => {
    try {
      let cid = [];
      let certHis = Object.assign({}, this.state.certHis);
      let res = await spider.get("/api/student"); 
      for(let i = 0; i < res.data.length; i++) {
        if(res.data[i].type == 1 || res.data[i].type == 2) {
          checkStatus1++;
        } else {
          checkStatus2++;
        }
      }
      let certs = res.data;
      cid = Object.assign([], certs);
      this.setState({ certData: cid });
      for (const cc of cid) {
        let response = await spider.get("/api/student/certificate_history", {
          params: { id: cc.id },
        });
        certHis[cc.id] = response.data;
      }
      this.setState({
        certHis,
        loading: false,
      });
    } catch (err) {
     
    }
  };
  handleDownload = async (id, type, ext) => {
    const usertoken = JSON.parse(localStorage.getItem("bonafideNITT2020user"));
    const roll = usertoken.user;
    let response = await spider.get("api/student/certificate_download", {
      params: { id },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", roll + "_" + type + "." + ext);
    document.body.appendChild(link);
    link.click();
  };

  render() {
    return (
      <div id="cert-timeline">
        <div className="cert-status">
          <div className="page-header row justify-content-center">
            <h3 className="text-center">Bonafide/Transcript Status</h3>
          </div>
          {this.state.loading ? (
            <Loader
              className="text-center"
              type="Audio"
              color="rgb(13, 19, 41)"
              height={100}
              width={100}
              timeout={3000} //3 secs
            />
          ) : (
            <>
              <div className="container req-status">
                {checkStatus1 === 0 ? (
                  <>
                    <p className="nor">
                      <strong>No Documents</strong>
                    </p>
                  </>
                ) : (
                  <table className="table cert-table status-table timeline-ovf">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Document Type</th>
                        <th scope="col">Current Status</th>
                        <th scope="col">Email Status</th>
                        <th scope="col">Postal Status</th>
                        <th scope="col">No. of Copies</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.certData.map((data, index) => {
                        if(data.type == 1 || data.type == 2) {
                          certStatus1++;
                        return (
                          <>
                            <tr key={index}>
                              <td>{certStatus1}</td>
                              <td>
                                {cert_mapping[data.type]}
                              </td>
                              <td>{data.status}</td>
                              <td>
                                {data.email_status ? data.email_status : "-"}
                              </td>
                              <td>
                                {data.postal_status ? data.postal_status : "-"}
                              </td>
                              <td>
                                {data.no_copies ? data.no_copies : "-"}
                              </td>
                              <td>
                                <span className="table-icons">
                                  <FaDownload
                                    onClick={() => {
                                      this.handleDownload(
                                        data.id,
                                        cert_mapping[data.type],
                                        data.certificate_extension
                                      );
                                    }}
                                    className="table-icons-item"
                                  />
                                  <FaHistory
                                    className="table-icons-item history"
                                    onClick={() => {
                                      this.setModalViewed(data.id);
                                    }}
                                  />
                                </span>
                              </td>
                            </tr>
                            <TimelineModal
                              id={data.id}
                              show={this.state.modalViewed === data.id}
                              hide={this.hideModalViewed}
                              data={this.state.certHis[data.id]}
                              email={data.email_status}
                              postal={data.postal_status}
                            ></TimelineModal>
                          </>
                        );
                      }})}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>

        <div className="cert-status">
          <div className="page-header row justify-content-center">
            <h3 className="text-center">Course Re/De-Registeration Status</h3>
          </div>
          {this.state.loading ? (
            <Loader
              className="text-center"
              type="Audio"
              color="rgb(13, 19, 41)"
              height={100}
              width={100}
              timeout={3000} //3 secs
            />
          ) : (
            <>
              <div className="container req-status">
                {checkStatus2 === 0 ? (
                  <>
                    <p className="nor">
                      <strong>No Documents</strong>
                    </p>
                  </>
                ) : (
                  <table className="table cert-table status-table timeline-ovf">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Document Type</th>
                        <th scope="col">Current Status</th>
                        <th scope="col">Course Code</th>
                        <th scope="col">Course Name</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.certData.map((data, index) => {
                        if(data.type == 3 || data.type == 4) {
                          certStatus2++;
                        return (
                          <>
                            <tr key={index}>
                              <td>{certStatus2}</td>
                              <td>
                                {cert_mapping[data.type]}
                              </td>
                              <td>{data.status}</td>
                              <td>
                                {data.course_code ? data.course_code : "-"}
                              </td>
                              <td>
                                {data.course_name ? data.course_name : "-"}
                              </td>
                              <td>
                                <span className="table-icons">
                                  <FaDownload
                                    onClick={() => {
                                      this.handleDownload(
                                        data.id,
                                        cert_mapping[data.type],
                                        data.certificate_extension
                                      );
                                    }}
                                    className="table-icons-item"
                                  />
                                  <FaHistory
                                    className="table-icons-item history"
                                    onClick={() => {
                                      this.setModalViewed(data.id);
                                    }}
                                  />
                                </span>
                              </td>
                            </tr>
                            <TimelineModal
                              id={data.id}
                              show={this.state.modalViewed === data.id}
                              hide={this.hideModalViewed}
                              data={this.state.certHis[data.id]}
                            ></TimelineModal>
                          </>
                        );
                      }})}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}