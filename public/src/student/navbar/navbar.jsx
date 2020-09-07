import React from "react";
import "./navbar.css";
import { Link } from "react-scroll";

import Status from "../status/status"
import Upload from "../cert-upload/cert-upl"

function NavBar(props) {
  const logoutHandler = (e) => {
    localStorage.removeItem("bonafideNITT2020user");
    window.location.replace("/");
  };
  return (
    <div className="navMain">
      <div id="sideNav" className="sidenav">
        <a
          href="#!"
          className="closebtn"
          onClick={() => {
            document.getElementById("sideNav").style.width = "0";
          }}
        >
          &times;
        </a>
        {props.screen !== 1 && (
          <>
            {/* <Link
              to="certificateTemplate"
              spy={true}
              smooth={true}
              duration={500}
            >
              <span id="navEntry">Templates</span>
            </Link> */}
             <Link to="cert-upl" spy={true} smooth={true} duration={500}>
              <span id="navEntry">Request Certificate</span>
            </Link>
            <Link to="cert-status"spy={true} smooth={true} duration={500}>
              <span id="navEntry">View status</span>
            </Link>
           
          </>
        )}
        <Link to="#!" onClick={logoutHandler}>
          <span id="navEntry">Logout</span>
        </Link>
      </div>
      <span
        className="icon-nav"
        onClick={() => {
          document.getElementById("sideNav").style.width = "250px";
        }}
      >
        {/* &#9776; */}
        <strong>
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            className="bi bi-list-nested"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.5 11.5A.5.5 0 0 1 5 11h10a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 1 3h10a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </strong>
      </span>
    </div>
  );
}

export default NavBar;
