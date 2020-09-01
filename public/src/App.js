import React from "react";
import "./App.css";
import Login from "./login/login.jsx";
import Footer from "./footer/footer.jsx";
import Upload from "./student/cert-upload/cert-upl";

function App() {
  return (
    <div>
      {/* <Login /> */}
      <Upload />
      <Footer />
    </div>
  );
}

export default App;
