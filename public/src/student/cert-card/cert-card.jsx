import React from "react";
import "./cert-card.css";

function CertificateCard(props) {
  return (
    <div class="card" >
        <div class="card-body">
            <h5 class="card-title">{props.certificateTitle}</h5>
           <div className="row mx-md-n3">
                <div className="col py-1 px-md-1">
                <button type="submit" className="btn btn-dark">
                  <a href={props.downloadPath} download> Download</a>
                </button>
              
                </div>
            </div>
            
            
        </div>
    </div>
  );
}

export default CertificateCard;
