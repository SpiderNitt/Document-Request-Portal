import React from "react";
import Upload from "./cert-upload/cert-upl";
import NavBar from "./navbar/navbar";
import Status from "./status/status";
import InstructionsModal from "./instructions-modal/instructions"

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
