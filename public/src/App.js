import React from "react";
import "./App.css";
import Login from "./login/login";
import OtpVerify from "./login/otpVerify";
import Alumni from "./login/alumni";
import Footer from "./footer/footer";
import Student from "./student/student";
import Admin from "./admin/admin.jsx";
import { StatusProvider } from "./contexts/StatusContext";
import NotFound from "./404/404";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const MainRoutes = () => {
  if (
    window.location.pathname === "/student" ||
    window.location.pathname === "/admin"
  ) {
    let token = JSON.parse(localStorage.getItem("bonafideNITT2020user"));
    if (token) {
      if (token.alumni) {
        return <Route component={Student} path="/student" exact />;
      } else if (isNaN(token.user)) {
        if (window.location.pathname === "/student")
          return <Redirect to="/admin" />;
        return <Route component={Admin} path="/admin" exact />;
      } else {
        if (window.location.pathname === "/admin")
          return <Redirect to="/student" />;
        return <Route component={Student} path="/student" exact />;
      }
    }
    return <Redirect to="/" />;
  }
  return <Route component={NotFound} />;
};

function App() {
  return (
    <StatusProvider>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/">
              <div className="row justify-content-center">
                <Login />
              </div>
            </Route>
            <Route exact path="/verifyOTP">
              <div className="row justify-content-center">
                <OtpVerify/>
              </div>
            </Route>
            <Route exact path="/alumni">
              <div className="row justify-content-center">
                <Alumni />
              </div>
            </Route>
            <MainRoutes />
          </Switch>
        </Router>
        <div className="row">
          <Footer />
        </div>
      </div>
    </StatusProvider>
  );
}

export default App;
