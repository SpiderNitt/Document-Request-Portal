import "./timeline.css";
import React from "react";
import TimelineItem from "./TimelineItem";

export default class Timeline extends React.Component {
  render() {
    let path_len = this.props.data.length;
    return (
      <div className="row">
        <div className="col-md-12">
          <span className="timebar"></span>
          <div>
            <ul className="Timeline">
              {this.props.data.map((ele, index) => {
                if (path_len === index + 1) {
                  return (
                    <TimelineItem
                      key={index}
                      data={ele}
                      email={this.props.email}
                      postal={this.props.postal}
                    />
                  );
                }
                return <TimelineItem key={index} data={ele} />;
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
