import React from "react";
import spider from "../../utils/API";
import { StatusContext } from "../../contexts/StatusContext";
import "./status.css";
import { FaDownload, FaHistory } from "react-icons/fa";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import TimelineModal from "../timeline/TimelineModal";
import store from "../../store";
import {
  setLoading,
  setToggled,
  setModalViewed,


} from '../../actions';

const cert_mapping = {
  1: "Bonafide",
  2: "Transcript",
  3: "Course De-Registration",
  4: "Course Re-Registration",
  5: "Rank Card",
  6: "Grade Card",
};


export default class Status extends React.Component {
  state = {
  //  loading: true,
  //  toggled: [],
  //  modalViewed: -1,
    checkStatus1: false,
    checkStatus2: false,
  };

  handleToggle = (id) => {
    let toggled = Object.assign([], store.getState().setToggled);
    if (toggled.includes(id)) {
      for (let i = 0; i < toggled.length; i++) {
        if (toggled[i] === id) {
          toggled.splice(i, 1);
        }
      }
      //this.setState({ toggled });
      store.dispatch(setToggled ({ toggled }));
      // return false;
    } else {
      toggled.push(id);
      //this.setState({ toggled });
      store.dispatch(setToggled ({ toggled }));
      // return true;
    }
  };
  
  //setModalViewed = (id) => {
  //  store.dispatch({
  //       modalViewed: id,
  //  });
  //};
  hideModalViewed = () => {
    store.dispatch({
      modalViewed: -1,
    });
  };

  componentDidMount = async () => {
    this.context.refreshCertData();
    //this.setState({ loading: false });
    store.dispatch(setLoading(false));
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

  noOfCopies = (data) => {
    let str = "";
    data.forEach((item) => {
      str += "Sem-" + item.semester_no + " (x" + item.no_copies + ") , ";
    });
    return str;
  };

  render() {
    return (
      <div>
        {this.context.state.checkStatus1 ||
        this.context.state.checkStatus2 ||
        this.context.state.checkStatus3 ? (
          <div id="cert-timeline">
            {this.context.state.checkStatus1 ? (
              <div className="cert-status">
                <div className="page-header row justify-content-center">
                  <h3 className="text-center cert-status-head">
                    Bonafide / Transcript Status
                  </h3>
                </div>
                {store.getState().setLoading ? (
                  <Loader
                    className="text-center"
                    type="Audio"
                    color="rgb(13, 19, 41)"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                  />
                ) : (
                  <div className="container req-status">
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
                        {/*eslint-disable-next-line*/}
                        {this.context.state.certData.map((data, index) => {
                          if (data.type === 1 || data.type === 2) {
                            this.context.state.certStatus1++;
                            return (
                              <React.Fragment key={`fragment${index}`}>
                                <tr key={index}>
                                  <td>{this.context.state.certStatus1}</td>
                                  <td>{cert_mapping[data.type]}</td>
                                  <td>{data.status}</td>
                                  <td>
                                    {data.email_status
                                      ? data.email_status
                                      : "-"}
                                  </td>
                                  <td>
                                    {data.postal_status
                                      ? data.postal_status
                                      : "-"}
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
                                          store.dispatch(setModalViewed(data.id));
                                        }}
                                      />
                                    </span>
                                  </td>
                                </tr>
                                <TimelineModal
                                  id={data.id}
                                  show={store.dispatch(setModalViewed(data.id))}
                                  hide={this.hideModalViewed}
                                  data={this.context.state.certHis[data.id]}
                                  email={data.email_status}
                                  postal={data.postal_status}
                                ></TimelineModal>
                              </React.Fragment>
                            );
                          }
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div></div>
            )}

            {this.context.state.checkStatus2 ? (
              <div className="cert-status">
                <div className="page-header row justify-content-center">
                  <h3 className="text-center cert-status-head">
                    Course Re / De-Registration Status
                  </h3>
                </div>
                {store.getState().setLoading ? (
                  <Loader
                    className="text-center"
                    type="Audio"
                    color="rgb(13, 19, 41)"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                  />
                ) : (
                  <div className="container req-status">
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
                        {/*eslint-disable-next-line*/}
                        {this.context.state.certData.map((data, index) => {
                          if (data.type === 3 || data.type === 4) {
                            this.context.state.certStatus2++;
                            return (
                              <React.Fragment key={`fragment${index}`}>
                                <tr key={index}>
                                  <td>{this.context.state.certStatus2}</td>
                                  <td>{cert_mapping[data.type]}</td>
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
                                          store.dispatch(setModalViewed(data.id));
                                        }}
                                      />
                                    </span>
                                  </td>
                                </tr>
                                <TimelineModal
                                  id={data.id}  
                                  show={store.dispatch(setModalViewed(data.id))}
                                  hide={this.hideModalViewed}
                                  data={this.context.state.certHis[data.id]}
                                ></TimelineModal>
                              </React.Fragment>
                            );
                          }
                          // return 0;
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div></div>
            )}

            {this.context.state.checkStatus3 ? (
              <div className="cert-status">
                <div className="page-header row justify-content-center">
                  <h3 className="text-center cert-status-head">
                    Rank / Grade Card Status
                  </h3>
                </div>
                {store.getState().setLoading ? (
                  <Loader
                    className="text-center"
                    type="Audio"
                    color="rgb(13, 19, 41)"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                  />
                ) : (
                  <div className="container req-status">
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
                        {/*eslint-disable-next-line*/}
                        {this.context.state.certData.map((data, index) => {
                          if (data.type === 5 || data.type === 6) {
                            this.context.state.certStatus3++;
                            return (
                              <React.Fragment key={`fragment${index}`}>
                                <tr key={index}>
                                  <td>{this.context.state.certStatus3}</td>
                                  <td>{cert_mapping[data.type]}</td>
                                  <td>{data.status}</td>
                                  <td>
                                    {data.email_status
                                      ? data.email_status
                                      : "-"}
                                  </td>
                                  <td>
                                    {data.postal_status
                                      ? data.postal_status
                                      : "-"}
                                  </td>
                                  <td>
                                    {data.type === 5
                                      ? data.no_copies
                                        ? data.no_copies
                                        : "-"
                                      : data.response_rank_grade_rows
                                      ? this.noOfCopies(
                                          data.response_rank_grade_rows
                                        )
                                      : "-"}
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
                                          store.dispatch(setModalViewed(data.id));
                                        }}
                                      />
                                    </span>
                                  </td>
                                </tr>
                                <TimelineModal
                                  id={data.id}
                                  show={store.dispatch(setModalViewed(data.id))}
                                  hide={this.hideModalViewed}
                                  data={this.context.state.certHis[data.id]}
                                  email={data.email_status}
                                  postal={data.postal_status}
                                ></TimelineModal>
                              </React.Fragment>
                            );
                          }
                          // return 0;
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div></div>
            )}
            <br />
          </div>
        ) : (
          <div className="container req-status">
            <h2 className="text-center"> Your Documents </h2>
            <p className="nor">
              <strong>No Documents</strong>
            </p>
          </div>
        )}
      </div>
    );
  }
}

Status.contextType = StatusContext;
