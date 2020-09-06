import React from "react";
import "./App.css";
import Login from "./login/login";
import Footer from "./footer/footer";
import Student from "./student/student";
import Admin from "./admin/admin.jsx";
import { Switch, Route } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("bonafideNITT2020user") ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

function App() {
  return (
    <div>
      <Switch>
        <Route exact strict path="/">
        <div className="row justify-content-center">
          <Login />
        </div>
        </Route>
        <PrivateRoute component={Student} path="/student" exact />
        <PrivateRoute component={Admin} path="/admin" exact />
      </Switch>
      <div className="row">
      <Footer />
      </div>
    </div>
  );
}

export default App;