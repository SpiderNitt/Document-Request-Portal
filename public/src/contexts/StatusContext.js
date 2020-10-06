import React, { createContext, Component } from 'react'
import spider from "../utils/API";


export const StatusContext=createContext();

export class StatusProvider extends Component {

    state={
        certHis: {},
        certData: []
    }

    refreshCertData=async ()=>{
        try {
            let cid = [];
            let certHis = Object.assign({}, this.state.certHis);
            let res = await spider.get("/api/student");
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
              certHis
            });
          } 
        catch (err) {
           console.log(err);
          }
    }


    render() {
        return (
                <StatusContext.Provider value={
                {    state: this.state,
                    refreshCertData: ()=>this.refreshCertData()
                }} >
                {this.props.children}
                </StatusContext.Provider>
        )
    }
}

export default StatusProvider;