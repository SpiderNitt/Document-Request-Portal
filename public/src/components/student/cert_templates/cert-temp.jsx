import React from "react";
import "./cert-temp.css";

function Certificate(props) {
  let docpath = "Documents/bonafide.pdf";
  if (props.doc === "bonafide") docpath = "Documents/bonafide.pdf";
  else if (props.doc === "transcript") docpath = "Documents/transcript.pdf";

  return (
    <div className="row justify-content-center">
      <object
        data={docpath}
        aria-label={props.doc}
        type="application/pdf"
        className="docView"
      ></object>
      <button className="btn btn-primary mobl-docView ">
        <a href={docpath} target="_blank" rel="noopener noreferrer">
          {props.doc}
        </a>
      </button>
    </div>
  );
}
function CertificateTemplate(props) {
  // const [document, setDoc] = useState("bonafide");
  return (
    <div className="certificateTemplate mt-2">
      <div className="container">
        {/* <div className="form-group">
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
            <option value="transcript">Certificate X</option>
          </select>
        </div> */}
        <div className="docDisplay">
          <Certificate doc={props.fileType} />
        </div>
      </div>
    </div>
  );
}

export default CertificateTemplate;
