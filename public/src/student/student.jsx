import React from "react";
import Upload from "./cert-upload/cert-upl";
import NavBar from "./navbar/navbar";

import CertificateTemplate from "./cert-templates/cert-temp";
import Status from "./status/status";

function Student() {
  return (
    <div>
      <NavBar screen={0} />
      <br />
      <Upload />

      <br />
      <br />
      <Status />
    </div>
  );
}

export default Student;
