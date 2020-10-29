import React from "react";
import Upload from "./cert-upload/cert-upl";
import NavBar from "./navbar/navbar";
import Status from "./status/status";
import { Provider } from "react-redux";
import store from "../store";
function Student() {
  return (
    <div>
      <Provider store={store}>
        <NavBar screen={0} />
        <br />
        <Upload />

        <br />
        <br />
        <Status />
      </Provider>
    </div>
  );
}

export default Student;
