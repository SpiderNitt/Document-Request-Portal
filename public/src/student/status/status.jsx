import React from "react";
import "./status.css";

function Status() {
  return (
    <div>
    <div className="page-header row justify-content-center">
            <h1>STATUS</h1>
          </div>
    <div className="container req-status">
      <div className="row">
        <div className="col-md-12">
          

          <div className="pre-className">
            <ul className="timeline timeline-horizontal pre-className-1">
              <li className="timeline-item">
                <div className="timeline-badge info"></div>
                <div className="timeline-panel">
                  <div className="timeline-heading">
                    <h4 className="timeline-title">Mussum ipsum cacilds 3</h4>
                    <p>
                      <small className="text-muted">
                        11 hours ago via Twitter
                      </small>
                    </p>
                  </div>
                  <div className="timeline-body">
                    <p>
                      Mussum ipsum cacilds, vidis litro abertis. Consetis
                      adipisci. Mé faiz elementum girarzis, nisi eros gostis.
                    </p>
                  </div>
                </div>
              </li>

              <li className="timeline-item">
                <div className="timeline-badge danger"></div>
                <div className="timeline-panel">
                  <div className="timeline-heading">
                    <h4 className="timeline-title">Mussum ipsum cacilds 4</h4>
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
                      adipisci. Mé faiz elementum girarzis, nisi eros gostis.
                    </p>
                  </div>
                </div>
              </li>

              <li className="timeline-item">
                <div className="timeline-badge danger"></div>
                <div className="timeline-panel">
                  <div className="timeline-heading">
                    <h4 className="timeline-title">Mussum ipsum cacilds 4</h4>
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
                      adipisci. Mé faiz elementum girarzis, nisi eros gostis.
                    </p>
                  </div>
                </div>
              </li>

              <li className="timeline-item">
                <div className="timeline-badge warning"></div>
                <div className="timeline-panel">
                  <div className="timeline-heading">
                    <h4 className="timeline-title">Mussum ipsum cacilds 5</h4>
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
                      adipisci. Mé faiz elementum girarzis, nisi eros gostis.
                    </p>
                  </div>
                </div>
              </li>

              <li className="timeline-item">
                <div className="timeline-badge"></div>
                <div className="timeline-panel">
                  <div className="timeline-heading">
                    <h4 className="timeline-title">Mussum ipsum cacilds 6</h4>
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
                      adipisci. Mé faiz elementum girarzis, nisi eros gostis. 
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Status;
