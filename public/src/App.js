import React from "react";
import "./App.css";
import Login from "./login/login";
import Footer from "./footer/footer";
import Student from "./student/student";
import Admin from "./admin/admin.jsx";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const PrivateRoutes = () => {
  let token = JSON.parse(localStorage.getItem("bonafideNITT2020user"));
  return token ? (
    isNaN(token.user) ? (
      <Route component={Admin} path="/admin" exact />
    ) : (
      <Route component={Student} path="/student" exact />
    )
  ) : (
    <Redirect to="/" />
  );
};

function App() {
  return (
    <div className="App">
    <Router basename="/bonafide-system">
      <Switch>
        <Route exact strict path="/">
          <div className="row justify-content-center">
            <Login />
          </div>
        </Route>
        {/* //<PrivateRoute component={Student} path="/student" exact />
          //<PrivateRoute component={Admin} path="/admin" exact /> */}
        <PrivateRoutes />
      </Switch>
    </Router>
      <div className="row">
        <Footer />
      </div>
    </div>
  );
}

export default App;
