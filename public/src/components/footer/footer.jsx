import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer>
      Weaved with 🕸 by
      <a
        className="spider-link"
        href="https://spider.nitt.edu"
        target="_blank"
        rel="noopener noreferrer"
      >
        {" "}
        Spider
      </a>
    </footer>
  );
}
export default Footer;
