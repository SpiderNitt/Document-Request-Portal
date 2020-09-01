import React from "react";
import "./navbar.css";

function NavBar() {
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
        <a href="#!">Home</a>
        <a href="#!">Templates</a>
        <a href="#!">Request Certificate</a>
        <a href="#!">Timeline</a>
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
