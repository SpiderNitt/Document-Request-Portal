import React from "react";
import "./App.css";
import Login from "./login/login.jsx";
import Footer from "./footer/footer.jsx";
import Admin from "./admin/admin";
import NavBar from "./student/navbar/navbar";
import CertificateTemplate from "./student/cert-templates/cert-temp";
import Upload from "./student/cert-upload/cert-upl";

function App() {
  return (
    <div>
      <Login />
      <Footer />
    </div>
  );
}

export default App;
