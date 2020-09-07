import "./timeline.css";
import React from "react";
import TimelineItem from "./TimelineItem";

export default class Timeline extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div>
            <ul className="timeline timeline-horizontal pre-className-1">
              {this.props.data.map((ele, index) => {
                return <TimelineItem key={index} data={ele} />;
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
