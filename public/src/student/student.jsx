import React from "react";
import Upload from "./cert-upload/cert-upl";
import NavBar from "./navbar/navbar";
import Footer from "./footer/footer.jsx";
import CertificateTemplate from "./cert-templates/cert-temp";

function Student() {
  return (
    <div>
      <NavBar />
      <Upload />
      <CertificateTemplate />
      <Footer />
    </div>
  );
}

export default Student;
