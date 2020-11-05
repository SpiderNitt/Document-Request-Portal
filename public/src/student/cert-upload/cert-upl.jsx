import React, { useEffect, useContext } from "react";
import spider from "../../utils/API";
import { StatusContext } from "../../contexts/StatusContext";
import { ToastContainer } from "react-toastify";
//import { Modal } from "react-bootstrap"; //eslint-disable-next-line
//import CertificateTemplate from "../cert-templates/cert-temp";
import SemCheckboxes from "./formFields/SemCheckboxes";
import CourseDetails from "./formFields/CourseDetails";
import Purpose from "./formFields/Purpose";
import Contact from "./formFields/Contact";
import NoOfCopies from "./formFields/NoOfCopies";
import FeeRef from "./formFields/FeeRef";
import CertAddition from "./formFields/CertAddition";
import CertType from "./formFields/CertType";
import Delivery from "./formFields/Delivery";
import AdminEmails from "./formFields/AdminEmails";
import EmailChart from "./formFields/EmailChart";
import FinalSubmitModal from "./formFields/FinalSubmitModal";
//import Loader from "react-loader-spinner";
import InstructionsModal from "../instructions-modal/instructions";
import SignatoriesInstructionsModal from "../instructions-modal/signatories-instructions";
import FilesModal from "./formFields/FilesModal";
//import { MdHelp } from "react-icons/md";
import store from "../../store";
import {
  setName,
  setEmails,
  setCertPdf,
  setEmailCount,
  setIdPdf,
  setCertFileName,
  setIdFileName,
  setInstructionModal,
  setSignatoriesModal,
  setCode,
  setCourse,
  setPurpose,
  setContact,
  setNoOfCopies,
  setFee,
  setFile,
  setDocId,
  setSemwiseMap,
  setSemester,
  setEmailDel,
  setAddress,
  setPreAddr,
  setIdFileButton,
  setAddressModal,
  setFileModal,
  setModal,
  setLoading,
  setCertFileButton,
} from "../../actions";
import "./cert-upl.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function Upload(props) {
  const user = JSON.parse(localStorage.getItem("bonafideNITT2020user")).user;
  let SemObj = [
    { id: 1, sem: "s1", semName: "Sem 1", copies: 0 },
    { id: 2, sem: "s2", semName: "Sem 2", copies: 0 },
    { id: 3, sem: "s3", semName: "Sem 3", copies: 0 },
    { id: 4, sem: "s4", semName: "Sem 4", copies: 0 },
    { id: 5, sem: "s5", semName: "Sem 5", copies: 0 },
    { id: 6, sem: "s6", semName: "Sem 6", copies: 0 },
    { id: 7, sem: "s7", semName: "Sem 7", copies: 0 },
    { id: 8, sem: "s8", semName: "Sem 8", copies: 0 },
    { id: 9, sem: "s9", semName: "Sem 9", copies: 0 },
    { id: 10, sem: "s10", semName: "Sem 10", copies: 0 },
  ];

  // UPLOAD DATA

  // const [file, setFile] = useState("bonafide"); reduxed
  //const [docId, setDocId] = useState([]); reduxed

  //const [semester, setSemester] = useState(SemObj);
  //const [semwiseMap, setSemwiseMap] = useState(false); reduxed

  //const [feeReceipt, setFee] = useState(""); reduxed
  //const [emailDel, setEmailDel] = useState(""); rdxd
  //const [address, setAddress] = useState(""); rdxd
  //const [preAddress, setPreAddr] = useState([]); rdxd
  //const [contact, setContact] = useState(""); reduxed
  //const [purpose, setPurpose] = useState(""); reduxed
  //const [no_of_copies, setNoOfCopies] = useState(0); reduxed
  //const [courseCode, setCode] = useState(""); reduxed
  //const [course, setCourse] = useState(""); reduxed

  // MODAL AND LOADING VARIABLES

  // const [fileModal, setFileModal] = useState(false); reduxed
  //const [instructionsModal, setInstructionsModal] = useState(true); reduxed
  //const [signatoriesModal, setSignatoriesModal] = useState(false); reduxed
  // const [addressModal, setAddressModal] = useState(false); reduxed
  // const [showModal, setModal] = useState(false); reduxed
  // const [isLoading, setLoading] = useState(false); reduxed
  // const [cert_fileButton, setCertFileButton] = useState("");
  // const [id_fileButton, setIdFileButton] = useState(""); reduxed

  const statusCtx = useContext(StatusContext);

  useEffect(() => {
    store.dispatch(setSemester(SemObj));
    spider
      .get("/api/student/certificate_types")
      .then((res) => {
        let docArr = [];
        res.data.forEach((add) => {
          //setDocId((p) => p.concat(add));
          docArr.push(add);
        });
        store.dispatch(setDocId(docArr));
      })
      .catch((err) => {}); // eslint-disable-next-line
  }, []);
  useEffect(() => {
    spider
      .get("/api/student/address")
      .then((res) => {
        let addrList = [];
        res.data.forEach((add) => {
          addrList.push(add);
        });
        store.dispatch(setPreAddr(addrList));
      })
      .catch((err) => {});
  }, []);

  const refreshStatus = () => {
    statusCtx.refreshCertData();
  };

  const setCopies = (semNo, noCopies) => {
    SemObj[semNo - 1].copies = noCopies;
    store.dispatch(setSemester(SemObj));
  };

  const handleSubmitClose = () => store.dispatch(setModal(false));
  const handleAddressClose = () => store.dispatch(setAddressModal(false));

  const handleCertFileUpload = (e) => {
    if (e.target.files[0]) {
      let filePath = e.target.value;
      var allowedExtensions = /(\.docx|\.DOCX|\.doc|\.DOC|\.pdf|\.PDF)$/;
      if (!allowedExtensions.exec(filePath)) {
        e.target.value = "";
        document.getElementById("file-error-message").innerHTML =
          "File extension must be .doc, .docx or .pdf";
      } else {
        document.getElementById("file-error-message").innerHTML = "";
        store.dispatch(setCertPdf(URL.createObjectURL(e.target.files[0])));
        store.dispatch(setCertFileButton(true));
        store.dispatch(setCertFileName(e.target.files[0].name));
      }
    } else {
      store.dispatch(setCertFileName(null));
      store.dispatch(setCertFileButton(true));
    }
  };

  const handleIdFileUpload = (e) => {
    if (e.target.files[0]) {
      let filePath = e.target.value;
      var allowedExtensions = /(\.docx|\.DOCX|\.doc|\.DOC|\.pdf|\.PDF)$/;
      if (!allowedExtensions.exec(filePath)) {
        e.target.value = "";
        document.getElementById("file-error-message").innerHTML =
          "File extension must be .doc, .docx or .pdf";
      } else {
        document.getElementById("file-error-message").innerHTML = "";
        store.dispatch(setIdPdf(URL.createObjectURL(e.target.files[0])));
        store.dispatch(setIdFileButton(true));
        store.dispatch(setIdFileName(e.target.files[0].name));
      }
    } else {
      store.dispatch(setIdFileName(null));
      store.dispatch(setIdFileButton(true));
    }
  };

  const handleClose = () => store.dispatch(setFileModal(false));
  const handleFileOpen = () => store.dispatch(setFileModal(true));

  const handleInstructionsClose = () =>
    store.dispatch(setInstructionModal(false));
  const handleInstructionsOpen = () =>
    store.dispatch(setInstructionModal(true));

  const handleSignatoriesClose = () =>
    store.dispatch(setSignatoriesModal(false));
  const handleSignatoriesOpen = () => store.dispatch(setSignatoriesModal(true));

  const certificateRequest = (e) => {
    e.preventDefault();
    store.dispatch(setLoading(true));
    let fileUpload = document.getElementById("cert").files[0];
    let college_id = document.getElementById("college-id").files[0];
    let cd = new FormData();
    for (var i = 0; i < store.getState().docId.length; i++) {
      if (
        store.getState().docId[i] &&
        store.getState().docId[i].name.toLowerCase() ===
          store.getState().file.toLowerCase()
      ) {
        cd.set("type", parseInt(store.getState().docId[i].id));
      }
    }
    cd.append("certificate", fileUpload);
    cd.append("certificate", college_id);
    if (
      store.getState().file === "course de-registration" ||
      store.getState().file === "course re-registration"
    ) {
      cd.set("course_code", store.getState().courseCode);
      cd.set("course_name", store.getState().course);
    }
    if (store.getState().semwiseMap === true) {
      let sems = "",
        copies = "";
      store.getState().semester.forEach((entry) => {
        if (entry.copies !== 0) {
          if (sems === "") sems += "" + entry.id;
          else sems += "," + entry.id;

          if (copies === "") copies += "" + entry.copies;
          else copies += "," + entry.copies;
        }
      });

      cd.set("semester_no", sems);
      cd.set("rank_grade_card_copies", copies);
    }
    if (
      (store.getState().emailDel &&
        document.getElementById("email-sel").checked &&
        store.getState().file === "transcript") ||
      store.getState().semwiseMap === true ||
      store.getState().file === "rank card"
    )
      cd.set("email", store.getState().emailDel);
    if (
      (store.getState().address &&
        document.getElementById("postal-del").checked &&
        store.getState().file === "transcript") ||
      store.getState().semwiseMap === true ||
      store.getState().file === "rank card"
    )
      cd.set("address", store.getState().address);
    if (store.getState().feeReceipt)
      cd.set("receipt", store.getState().feeReceipt);
    if (store.getState().contact) cd.set("contact", store.getState().contact);
    if (store.getState().purpose) cd.set("purpose", store.getState().purpose);
    if (store.getState().name) cd.set("name", store.getState().name);
    if (
      store.getState().file === "transcript" ||
      store.getState().file === "rank card"
    ) {
      if (store.getState().no_of_copies)
        cd.set("no_copies", store.getState().no_of_copies);
    }
    cd.set("path", store.getState().emails.toString()); //eslint-disable-next-line
    for (var pair of cd.entries()) {
    }
    spider
      .post("api/student/certificate_request", cd)
      .then((res) => {
        store.dispatch(setModal(false));
        store.dispatch(setLoading(false));
        store.dispatch(setEmailCount(0));
        store.dispatch(setEmails([]));
        store.dispatch(setCertFileButton(false));
        store.dispatch(setIdFileButton(false));
        store.dispatch(setFileModal(false));
        store.dispatch(setAddress(""));
        store.dispatch(setEmailDel(""));
        store.dispatch(setFee(""));
        store.dispatch(setPurpose(""));
        store.dispatch(setContact(""));
        store.dispatch(setCertPdf(null));
        store.dispatch(setIdPdf(null));
        store.dispatch(setCertFileName(""));
        store.dispatch(setIdFileName(""));
        store.dispatch(setPreAddr([]));
        store.dispatch(setCourse(""));
        store.dispatch(setCode(""));
        store.dispatch(setName(""));
        SemObj.forEach((obj) => {
          obj.copies = 0;
        });
        store.dispatch(setSemester(SemObj));
        store.dispatch(setNoOfCopies(null));
        spider
          .get("/api/student/address")
          .then((res) => {
            let addrList = [];
            res.data.forEach((add) => {
              addrList.push(add);
            });
            store.dispatch(setPreAddr(addrList));
          })
          .catch((err) => {});

        refreshStatus();

        document.getElementById("cert").value = "";
        if (document.getElementById("emaildel"))
          document.getElementById("emaildel").value = "";
        if (document.getElementById("feer"))
          document.getElementById("feer").value = "";
        if (document.getElementById("emaildel"))
          document.getElementById("emaildel").value = "";
        if (document.getElementById("postal-del"))
          document.getElementById("postal-del").value = "";
        if (document.getElementById("no_of_copies"))
          document.getElementById("no_of_copies").value = "";
        document.getElementById("contact-number").value = "";
        document.getElementById("purpose").value = "";
        document.getElementById("college-id").value = "";
        document.getElementById("username").value = "";
        let copyInputDivNodes = document.querySelectorAll(".copy-input-div");
        if (copyInputDivNodes) {
          copyInputDivNodes.forEach((node) => node.remove());
        }
        document.getElementById("certType").value = "bonafide";
        store.dispatch(setFile("bonafide"));
        store.dispatch(setSemwiseMap(false));
      })
      .catch((err) => {});
  };
  const calculate_source = () => {
    let anch = document.getElementById("anchorClick");
    if (anch) {
      let certType = document.getElementById("certType");
      if (certType) {
        let value = certType.value;
        if (value === "bonafide") anch.href = "Documents/bonafide.pdf";
        else if (value === "transcript") anch.href = "Documents/transcript.pdf";
        // anch.click();
      }
    }
  };
  return (
    <>
      <div className="container" id="cert-upl">
        <h2 className="text-center cert-upl-head">
          Document Requisition Portal
        </h2>

        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <div className="row">
          <div className="col-md-6 form-left">
            {/* Name */}

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
                  store.dispatch(setName(e.target.value));
                }}
              />
              <small id="name-error-message" className="error"></small>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              {store.getState().file === "bonafide" ||
              store.getState().file === "transcript" ? (
                <a
                  href="#!"
                  onClick={calculate_source}
                  id="anchorClick"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="float-right small-link"
                >
                  Download Template
                </a>
              ) : (
                <></>
              )}
            </div>

            <form id="request-main">
              {/*Certificate type */}
              <CertType
                //setSemwiseMap={setSemwiseMap}
                handleInstructionsOpen={handleInstructionsOpen}
              ></CertType>

              {/* Certificate Delivery */}

              <Delivery
                addressModal={store.getState().addressModal}
                handleAddressClose={handleAddressClose}
              ></Delivery>

              {/* Course Deregistration/Registration */}
              {store.getState().file === "course de-registration" ||
              store.getState().file === "course re-registration" ? (
                <CourseDetails></CourseDetails>
              ) : (
                <></>
              )}

              {/* Contact information */}
              <Contact></Contact>

              {/* Fee Receipt */}
              <FeeRef></FeeRef>

              {/*Semester and #copies for grade card */}
              <SemCheckboxes></SemCheckboxes>

              {/* Administrator Email Addition */}
              <AdminEmails
                handleSignatoriesOpen={handleSignatoriesOpen}
              ></AdminEmails>
              <br />

              {/* Purpose */}
              <Purpose></Purpose>

              {/* No of copies */}

              <NoOfCopies></NoOfCopies>

              {/* Certificate Addition */}
              <CertAddition
                handleIdFileUpload={handleIdFileUpload}
                handleCertFileUpload={handleCertFileUpload}
                cert_fileButton={store.getState().cert_fileButton}
                id_fileButton={store.getState().id_fileButton}
                handleFileOpen={handleFileOpen}
              ></CertAddition>

              {/* Submit button */}
              <div className="form-group text-center">
                <br />
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={(e) => {
                    e.preventDefault();
                    let fileUpload = document.getElementById("cert").files[0];
                    let college_id = document.getElementById("college-id")
                      .files[0];
                    let error = 0;
                    if (!store.getState().contact) {
                      document.getElementById(
                        "contact-error-message"
                      ).innerHTML = "Contact field cannot be blank";
                      error = 1;
                    } else {
                      // const re = /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/;
                      if (store.getState().contact.length !== 10) {
                        document.getElementById(
                          "contact-error-message"
                        ).innerHTML = "Enter a valid contact number";
                        error = 1;
                      } else {
                        document.getElementById(
                          "contact-error-message"
                        ).innerHTML = "";
                      }
                    }
                    if (!store.getState().name) {
                      document.getElementById("name-error-message").innerHTML =
                        "Name field cannot be blank";
                      error = 1;
                    } else {
                      document.getElementById("name-error-message").innerHTML =
                        "";
                    }
                    if (!store.getState().purpose) {
                      if (
                        store.getState().file === "bonafide" ||
                        store.getState().file === "transcript" ||
                        store.getState().file === "rank card" ||
                        store.getState().semwiseMap === true
                      ) {
                        document.getElementById(
                          "purpose-error-message"
                        ).innerHTML = "Purpose field cannot be blank";
                      } else if (
                        store.getState().file === "course de-registration"
                      ) {
                        document.getElementById(
                          "purpose-error-message"
                        ).innerHTML = "Enter reason for course de-registration";
                      } else {
                        document.getElementById(
                          "purpose-error-message"
                        ).innerHTML = "Enter reason for course re-registration";
                      }
                      error = 1;
                    } else {
                      document.getElementById(
                        "purpose-error-message"
                      ).innerHTML = "";
                    }
                    if (!fileUpload || !college_id) {
                      document.getElementById("file-error-message").innerHTML =
                        "Upload both files";
                      error = 1;
                    } else {
                      document.getElementById("file-error-message").innerHTML =
                        "";
                    }
                    if (store.getState().file === "bonafide") {
                      if (!store.getState().emailCount) {
                        document.getElementById(
                          "email-error-message"
                        ).innerHTML = "Add email addresses";
                        error = 1;
                      } else {
                        document.getElementById(
                          "email-error-message"
                        ).innerHTML = "";
                      }
                    } else if (
                      store.getState().file === "transcript" ||
                      store.getState().semwiseMap === true ||
                      store.getState().file === "rank card"
                    ) {
                      if (
                        store.getState().file === "transcript" ||
                        store.getState().file === "rank card"
                      ) {
                        if (store.getState().no_of_copies < 0) {
                          document.getElementById(
                            "no-of-copies-error-message"
                          ).innerHTML = "Number of copies cannot be negative";
                          error = 1;
                        } else {
                          document.getElementById(
                            "no-of-copies-error-message"
                          ).innerHTML = "";
                        }
                        if (store.getState().address) {
                          if (!store.getState().no_of_copies) {
                            document.getElementById(
                              "no-of-copies-error-message"
                            ).innerHTML = "Enter the number of copies required";
                            error = 1;
                          } else if (store.getState().no_of_copies <= 0) {
                            document.getElementById(
                              "no-of-copies-error-message"
                            ).innerHTML = "Enter the number of copies required";
                            error = 1;
                          } else {
                            document.getElementById(
                              "no-of-copies-error-message"
                            ).innerHTML = "";
                          }
                        }
                        if (!store.getState().feeReceipt) {
                          document.getElementById(
                            "fee-error-message"
                          ).innerHTML = "Enter fee reference number";
                          error = 1;
                        } else {
                          document.getElementById(
                            "fee-error-message"
                          ).innerHTML = "";
                        }
                      }
                      if (
                        !(
                          document.getElementById("email-sel").checked ||
                          document.getElementById("postal-del").checked
                        )
                      ) {
                        document.getElementById(
                          "select-delivery-type-error-message"
                        ).innerHTML = "Select a delivery method";
                        error = 1;
                      } else {
                        document.getElementById(
                          "select-delivery-type-error-message"
                        ).innerHTML = "";
                      }
                      if (document.getElementById("email-sel").checked) {
                        if (!store.getState().emailDel) {
                          document.getElementById(
                            "your-email-error-message"
                          ).innerHTML = "Enter your email address";
                          error = 1;
                        } else {
                          let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
                          if (
                            !regex.test(store.getState().emailDel.toLowerCase())
                          ) {
                            document.getElementById(
                              "your-email-error-message"
                            ).innerHTML = "Enter a valid email";
                            error = 1;
                          } else {
                            document.getElementById(
                              "your-email-error-message"
                            ).innerHTML = "";
                          }
                        }
                      } else {
                        store.dispatch(setEmailDel(""));
                      }
                      if (document.getElementById("postal-del").checked) {
                        if (!store.getState().address) {
                          document.getElementById(
                            "your-postal-error-message"
                          ).innerHTML = "Enter your postal address";
                          error = 1;
                        } else {
                          document.getElementById(
                            "your-postal-error-message"
                          ).innerHTML = "";
                        }
                      } else {
                        store.dispatch(setAddress(""));
                      }
                      if (store.getState().semwiseMap === true) {
                        if (
                          !(
                            document.getElementById("check_s1").checked ||
                            document.getElementById("check_s2").checked ||
                            document.getElementById("check_s3").checked ||
                            document.getElementById("check_s4").checked ||
                            document.getElementById("check_s5").checked ||
                            document.getElementById("check_s6").checked ||
                            document.getElementById("check_s7").checked ||
                            document.getElementById("check_s8").checked ||
                            document.getElementById("check_s9").checked ||
                            document.getElementById("check_s10").checked
                          )
                        ) {
                          document.getElementById(
                            "select-semester-error-message"
                          ).innerHTML = "Select a semester";
                          error = 1;
                        } else {
                          document.getElementById(
                            "select-semester-error-message"
                          ).innerHTML = "";
                        }

                        SemObj.forEach((obj) => {
                          obj.copies = 0;
                        });
                        store.dispatch(setSemester(SemObj));
                        let copyInputNodes = document.querySelectorAll(
                          ".copies-input"
                        );
                        copyInputNodes.forEach((node) => {
                          if (node.value > 0)
                            setCopies(parseInt(node.id.slice(14)), node.value);
                          else {
                            document.getElementById(
                              "rc-gc-no-of-copies-error-message"
                            ).innerHTML = "Enter valid no. of copies";
                            error = 1;
                          }
                        });
                      }
                    } else if (
                      store.getState().file === "course re-registration" ||
                      store.getState().file === "course de-registration"
                    ) {
                      if (!store.getState().emailCount) {
                        document.getElementById(
                          "email-error-message"
                        ).innerHTML = "Add email addresses";
                        error = 1;
                      } else {
                        document.getElementById(
                          "email-error-message"
                        ).innerHTML = "";
                      }
                      if (!store.getState().courseCode) {
                        document.getElementById(
                          "ccode-error-message"
                        ).innerHTML = "Enter your course code";
                      }
                      if (!store.getState().course) {
                        document.getElementById(
                          "cname-error-message"
                        ).innerHTML = "Enter your course name";
                      }
                    }
                    if (error === 0) {
                      store.dispatch(setModal(true));
                    }
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          <FinalSubmitModal
            showModal={store.getState().showModal}
            handleSubmitClose={handleSubmitClose}
            user={user}
            isLoading={store.getState().isLoading}
            certificateRequest={certificateRequest}
          ></FinalSubmitModal>

          <EmailChart user={user}></EmailChart>
        </div>

        {/* ID and certificate Modal*/}
        <FilesModal
          fileModal={store.getState().fileModal}
          handleClose={handleClose}
        >
          {" "}
        </FilesModal>

        <InstructionsModal
          //show={store.getState().instructionsModal}
          hide={handleInstructionsClose}
          centered
        ></InstructionsModal>

        <SignatoriesInstructionsModal
          //show={signatoriesModal}
          hide={handleSignatoriesClose}
          centered
        ></SignatoriesInstructionsModal>
      </div>
    </>
  );
}

export default Upload;
