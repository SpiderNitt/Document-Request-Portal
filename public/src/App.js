import React from "react";
import "./App.css";
import Login from "./login/login.jsx";
import Footer from "./footer/footer.jsx";
import Upload from "./student/cert-upload/cert-upl";
import NavBar from "./student/navbar/navbar";

function App() {
  return (
    <div>
      <NavBar />
      {/* <Login /> */}
      <Upload />
      <Footer />
    </div>
  );
}

export default App;
