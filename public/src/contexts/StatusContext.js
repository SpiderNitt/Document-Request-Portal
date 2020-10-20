import React, { createContext, Component } from "react";
import spider from "../utils/API";

export const StatusContext = createContext();

export class StatusProvider extends Component {
  state = {
    certHis: {},
    certData: [],
    checkStatus1: false,
    checkStatus2: false,
    checkStatus3: false,
    certStatus1: 0,
    certStatus2: 0,
    certStatus3: 0,
  };

  refreshCertData = async () => {
    try {
      let cid = [];
      let certHis = Object.assign({}, this.state.certHis);
      let res = await spider.get("/api/student");
      let certs = res.data;
      cid = Object.assign([], certs);
      this.setState({ certData: cid });
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].type === 1 || res.data[i].type === 2) {
          this.setState({ checkStatus1: true });
        } else if (res.data[i].type === 3 || res.data[i].type === 4) {
          this.setState({ checkStatus2: true });
        } else {
          this.setState({ checkStatus3: true });
        }
      }
      for (const cc of cid) {
        let response = await spider.get("/api/student/certificate_history", {
          params: { id: cc.id },
        });
        certHis[cc.id] = response.data;
      }
      this.setState({
        certHis,
        loading: false,
        certStatus1: 0,
        certStatus2: 0,
        certStatus3: 0,
      });
    } catch (err) {}
  };

  render() {
    return (
      <StatusContext.Provider
        value={{
          state: this.state,
          refreshCertData: () => this.refreshCertData(),
        }}
      >
        {this.props.children}
      </StatusContext.Provider>
    );
  }
}

export default StatusProvider;
