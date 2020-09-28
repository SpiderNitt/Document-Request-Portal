import "./timeline.css";
import React from "react";

export default function TimelineItem(props) {
  let status_map = {
    PENDING: "warning",
    "INITIATED REQUEST": "primary",
    APPROVED: "success",
    DECLINED: "danger",
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  let classNameString = "timeline-badge " + status_map[props.data.status];
  return (
    <li className="Timeline-item">
      <span className={classNameString}></span>
      <div>
        <div className="timeline-heading">
          <h6 className="timeline-title" style={{overflow: 'scroll'}}>{props.data.path_email}</h6>
          <p>
            {props.data.status}
            <small className="text-muted">
              {" "}
              <br></br>
              {props.data.status === "PENDING"
                ? ""
                : formatDate(props.data.time)}
            </small>
            <br></br>

            {props.data.comments ? (
              <small className="text-muted">{props.data.comments}</small>
            ) : (
              <small></small>
            )}
            {/* {props.email ? (
              <small>Email sent to your email address.</small>
            ) : (
              <></>
            )}
            <br />
            {props.postal ? (
              <small>
                Document sent. <br></br>
                <i>Postal info: {props.postal}</i>
              </small>
            ) : (
              <></>
            )} */}
          </p>
        </div>
      </div>
    </li>
  );
}
