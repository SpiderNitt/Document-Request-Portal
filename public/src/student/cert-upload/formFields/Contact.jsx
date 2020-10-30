import React, { Component } from "react";
import store from "../../../store";
import { setContact } from "../../../actions";

export class Contact extends Component {
  render() {
    return (
      <>
        <div className="form-group">
          <label htmlFor="contact-number">
            Enter your Contact Number <span className="cmpl">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            name="contact"
            id="contact-number"
            placeholder="Contact number"
            required
            onChange={(e) => {
              store.dispatch(setContact(e.target.value));
            }}
          />
          <small id="contact-error-message" className="error"></small>
        </div>
      </>
    );
  }
}

export default Contact;
