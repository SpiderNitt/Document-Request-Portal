import React from "react";
import "./App.css";
import Login from "./login/login.jsx";
import Footer from "./footer/footer.jsx";
import Student from "./student/student";
import NavBar from "./student/navbar/navbar";
import Upload from "./student/cert-upload/cert-upl";

function App() {
  return (
    <div>
      <NavBar />
      {/* <Login /> */}
      {/* <Student /> */}
      <Upload />
      <Footer />
    </div>
  );
}

export default App;
