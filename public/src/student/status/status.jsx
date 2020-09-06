import React from "react";
import spider from "../../utils/API";
import "./status.css";

export default class Status extends React.Component {
  state = {
    certHis: [],
  };

  componentDidMount = async () => {
    try {
      let cid = [];
      let certHis = Object.assign([], this.state.certHis);
      let res = await spider.get("/api");
      let certs = res.data;
      cid = Object.assign([], certs);
      console.log("this is CID shankar:: ", cid);

      for (const cc of cid) {
        // console.log(index);
        // let cc = cid[index];
        // console.log(cc);

        let response = await spider.get("/api/certificate_history", { params: { id: cc.id } });
        console.log(response);

        // res.data.id = cc.id;
        certHis.push(res.data);
       

      }
      console.log("OUTSIDE IFF")
      this.setState(
        {
          certHis
        },
        console.log("CERTHIS::: ", certHis)
      );
    }


    catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div>
        <div className="page-header row justify-content-center">
          <h1>STATUS</h1>
        </div>
        <div className="container req-status">
          {/* {certificateId.map((cert, index) => {
          return ( */}
          <div className="row">
            <div className="col-md-12">
              <div className="pre-className">
                <ul className="timeline timeline-horizontal pre-className-1">
                  <li className="timeline-item">
                    <div className="timeline-badge info"></div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <h4 className="timeline-title">
                          Mussum ipsum cacilds 3
                        </h4>
                        <p>
                          <small className="text-muted">
                            11 hours ago via Twitter
                          </small>
                        </p>
                      </div>
                      <div className="timeline-body">
                        <p>
                          Mussum ipsum cacilds, vidis litro abertis. Consetis
                          adipisci. Mé faiz elementum girarzis, nisi eros
                          gostis.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li className="timeline-item">
                    <div className="timeline-badge danger"></div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <h4 className="timeline-title">
                          Mussum ipsum cacilds 4
                        </h4>
                        <p>
                          <small className="text-muted">
                            {" "}
                            11 hours ago via Twitter
                          </small>
                        </p>
                      </div>
                      <div className="timeline-body">
                        <p>
                          Mussum ipsum cacilds, vidis litro abertis. Consetis
                          adipisci. Mé faiz elementum girarzis, nisi eros
                          gostis.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li className="timeline-item">
                    <div className="timeline-badge danger"></div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <h4 className="timeline-title">
                          Mussum ipsum cacilds 4
                        </h4>
                        <p>
                          <small className="text-muted">
                            {" "}
                            11 hours ago via Twitter
                          </small>
                        </p>
                      </div>
                      <div className="timeline-body">
                        <p>
                          Mussum ipsum cacilds, vidis litro abertis. Consetis
                          adipisci. Mé faiz elementum girarzis, nisi eros
                          gostis.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li className="timeline-item">
                    <div className="timeline-badge warning"></div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <h4 className="timeline-title">
                          Mussum ipsum cacilds 5
                        </h4>
                        <p>
                          <small className="text-muted">
                            {" "}
                            11 hours ago via Twitter
                          </small>
                        </p>
                      </div>
                      <div className="timeline-body">
                        <p>
                          Mussum ipsum cacilds, vidis litro abertis. Consetis
                          adipisci. Mé faiz elementum girarzis, nisi eros
                          gostis.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li className="timeline-item">
                    <div className="timeline-badge"></div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <h4 className="timeline-title">
                          Mussum ipsum cacilds 6
                        </h4>
                        <p>
                          <small className="text-muted">
                            {" "}
                            11 hours ago via Twitter
                          </small>
                        </p>
                      </div>
                      <div className="timeline-body">
                        <p>
                          Mussum ipsum cacilds, vidis litro abertis. Consetis
                          adipisci. Mé faiz elementum girarzis, nisi eros
                          gostis.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* );
        })} */}
        </div>
      </div>
    );
  }
}
