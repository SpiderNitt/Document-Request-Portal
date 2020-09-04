import React, { useState } from "react";
import "./cert-temp.css";

function Certificate(props) {
  let docpath = "bf.pdf";
  if (props.doc === "bonafide") docpath = "bf.pdf";
  else if (props.doc === "x") docpath = "trans.pdf";

  return (
    <div className="row justify-content-center">
      <object data={docpath} type="application/pdf" className="docView">
        {/* The document cannot be viewed on a mobile browser. Open it here:{" "}
        <a href={docpath} target="_blank" rel="noopener noreferrer">
          {props.doc}
        </a> */}
      </object>
      <button className="btn btn-primary mobl-docView ">
        <a href={docpath} target="_blank" rel="noopener noreferrer">
          {props.doc}
        </a>
      </button>
    </div>
  );
}
function CertificateTemplate() {
  const [document, setDoc] = useState("bonafide");
  return (
    <div className="certificateTemplate mt-2">
      <div className="container">
        <div className="form-group">
          <select
            name="templateSel"
            id="templateSel"
            className="form-control"
            onChange={(e) => {
              e.preventDefault();
              setDoc(e.target.value);
            }}
          >
            <option value="bonafide">Bonafide</option>
            <option value="x">Certificate X</option>
          </select>
        </div>
        <div className="docDisplay">
          <Certificate doc={document} />
        </div>
      </div>
    </div>
  );
}

export default CertificateTemplate;
