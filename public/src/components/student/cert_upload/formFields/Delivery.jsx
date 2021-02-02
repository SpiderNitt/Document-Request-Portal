import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { setEmailDel, setAddress, setAddressModal, getCert } from "../../../../actions/cert_upload";

export class Delivery extends Component {
  render() {
    return getCert().file === "transcript" ||
      getCert().file === "rank card" ||
      getCert().semwiseMap === true ? (
      <>
        <div className="form-group">
          <label htmlFor="delivery-sel">
            Select document delivery method <span className="cmpl">*</span>
          </label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="email-sel"
              id="email-sel"
              value="email"
              onChange={(e) => {
                if (document.getElementById("email-sel").checked) {
                  document.getElementById("email-del-entry").style.display =
                    "block";
                } else {
                  document.getElementById("email-del-entry").style.display =
                    "none";
                }
              }}
            />
            <label className="form-check-label" htmlFor="email">
              Email
            </label>
          </div>

          {/* Email delivery */}

          <div id="email-del-entry">
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                name="email-del"
                id="emaildel"
                aria-describedby="emailHelp"
                placeholder="Email Id"
                onChange={(e) => {
                  e.preventDefault();
                  let emailValues = document.getElementById("emaildel");
                  // if (emailValues.value !== "") {
                  setEmailDel(emailValues.value);
                  // }
                }}
                required
              />
              <small id="your-email-error-message" className="error"></small>
            </div>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="postal"
              id="postal-del"
              value="postal"
              onChange={(e) => {
                if (document.getElementById("postal-del").checked) {
                  document.getElementById("postal-del-entry").style.display =
                    "block";
                } else {
                  document.getElementById("postal-del-entry").style.display =
                    "none";
                }
              }}
            />
            <label className="form-check-label" htmlFor="postal">
              Postal delivery
            </label>
          </div>
          <small
            id="select-delivery-type-error-message"
            className="error"
          ></small>
        </div>

        {/* Postal information */}

        <>
          <div id="postal-del-entry" className="text-center">
            <p id="emailHelp" className="form-text text-muted">
              Choose addresses from your previous entries:
            </p>
            {getCert().preAddress.length !== 0 ? (
              getCert().preAddress.map((addr, index) => {
                if (addr !== "" || addr !== " ")
                  return (
                    <div className="form-check" key={index}>
                      <input
                        className="form-check-input radio-addr"
                        type="radio"
                        name="radio"
                        id={"radio" + index}
                        value={addr !== null ? addr : ""}
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                      />
                      <label className="form-check-label" htmlFor="radio">
                        {addr}
                      </label>
                    </div>
                  );
                return 0;
              })
            ) : (
              <small className="form-text text-muted">
                No previously saved addresses.
              </small>
            )}
            <br />
            {getCert().address ? (
              <>
                <small className="form-text text-muted">
                  Address entered/selected:{" "}
                  <strong>{getCert().address}</strong>
                </small>
                <br />
              </>
            ) : (
              <></>
            )}
            <small className="form-text text-muted">
              Else, enter a new one:
            </small>
            <br />
            <div className="text-center">
              <button
                className="btn btn-success p-1 m-1"
                width="50"
                type="button"
                onClick={(e) => {
                  setAddressModal(true);
                  Array.prototype.forEach.call(
                    document.getElementsByClassName("radio-addr"),
                    (el) => {
                      if (el.checked) {
                        el.checked = false;
                      }
                    }
                  );
                }}
              >
                Add New Address
              </button>
              <br />
              <small id="your-postal-error-message" className="error"></small>
            </div>
            <br />
            <Modal
              show={this.props.addressModal}
              onHide={this.props.handleAddressClose}
              keyboard={false}
              dialogClassName="approveModal"
              aria-labelledby="contained-modal-title-vcenter"
              className="certModal"
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Add New Address
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <br />
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      Address <span className="cmpl">*</span>
                    </span>
                  </div>
                  <textarea
                    id="address-text-box1"
                    className="form-control"
                    aria-label="With textarea"
                  ></textarea>
                </div>
                <br />
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      Pin Code <span className="cmpl">*</span>
                    </span>
                  </div>
                  <input
                    type="number"
                    id="address-text-box2"
                    className="form-control"
                  ></input>
                </div>
                <br />
                <small id="emailHelp" className="form-text text-muted">
                  Optional
                </small>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Landmark</span>
                  </div>
                  <textarea
                    id="address-text-box3"
                    className="form-control"
                    aria-label="With textarea"
                  ></textarea>
                </div>
                <br />
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={(e) => {
                      let addr = document.getElementById("address-text-box1")
                        .value;
                      let pin = document.getElementById("address-text-box2")
                        .value;
                      let landm = document.getElementById("address-text-box3")
                        .value;
                      if (addr && pin) {
                        let addressText =
                          addr + " ," + pin + (landm ? " ," + landm : "");
                        setAddress(addressText);
                        setAddressModal(false);
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </>
        <br />
      </>
    ) : (
      <></>
    );
  }
}

export default Delivery;
