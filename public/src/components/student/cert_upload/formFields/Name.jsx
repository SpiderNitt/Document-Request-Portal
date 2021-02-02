import React, { Component } from 'react'
import { setName } from '../../../../actions/cert_upload'

export class Name extends Component {
    render() {
        return (
            <div className="form-group">
                <label htmlFor="username">
                    Enter your Name <span className="cmpl">*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    name="contact"
                    id="username"
                    placeholder="Name"
                    required
                    onChange={(e) => {
                    setName(e.target.value);
                    }}
                />
                <small id="name-error-message" className="error"></small>
            </div>
        )
    }
}

export default Name
