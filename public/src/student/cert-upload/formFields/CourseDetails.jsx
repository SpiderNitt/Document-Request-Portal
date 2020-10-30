import React, { Component } from "react";
import store from "../../../store";
import { setCode, setCourse } from "../../../actions";

export class CourseDetails extends Component {
  render() {
    return (
      <>
        <div className="form-group">
          <label htmlFor="course-code">
            Course Code <span className="cmpl">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="ccode"
            id="course-code"
            placeholder="Course code"
            required
            onChange={(e) => {
              store.dispatch(setCode(e.target.value));
            }}
          />
          <small id="ccode-error-message" className="error"></small>
        </div>
        <div className="form-group">
          <label htmlFor="course-name">
            Course Name <span className="cmpl">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="cname"
            id="course-name"
            placeholder=" Course name"
            required
            onChange={(e) => {
              store.dispatch(setCourse(e.target.value));
            }}
          />
          <small id="cname-error-message" className="error"></small>
        </div>
      </>
    );
  }
}

export default CourseDetails;
