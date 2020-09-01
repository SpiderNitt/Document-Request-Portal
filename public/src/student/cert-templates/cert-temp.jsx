import React from "react";
import "./cert-temp.css";

import CertificateCard from "../cert-card/cert-card.jsx";

function CertificateTemplate(props) {
  return (
    <div className="container lmain">
        
        <div className="row ">
            <div className="col-md-2"></div>
            <div className="col-md-3">
            <div class="flexbox-container">
            <CertificateCard certificateTitle="Bonafide" downloadPath="/"/>
            </div>
            </div>

            <div className="col-md-3">
            <div class="flexbox-container">
            <CertificateCard certificateTitle="Transcript" downloadPath="/"/>
            </div>
            </div>

            <div className="col-md-3">
            <div class="flexbox-container">
            <CertificateCard certificateTitle="No Objection Certificate" downloadPath="/"/>
            </div>
            </div>

            
        
        </div>
        
    </div>  


   
  );
}

export default CertificateTemplate;
