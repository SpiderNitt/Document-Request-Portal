import React, { useEffect, useContext } from "react";
import spider from "../../../utils/API";
import { StatusContext } from "../../../contexts/StatusContext";
import { ToastContainer } from "react-toastify";
import Name from './formFields/Name'
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
import SubmitBtn from './formFields/SubmitBtn';
import InstructionsModal from "../instructions_modal/instructions";
import SignatoriesInstructionsModal from "../instructions_modal/signatories_instructions";
import FilesModal from "./formFields/FilesModal";
import {
  setName,
  setEmails,
  setCertPdf,
  setEmailCount,
  setIdPdf,
  setCertFileName,
  setIdFileName,
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
  setCertFileButton,
  resetCertUpl,
  getCert
} from "../../../actions/cert_upload";
import { setInstructionModal, setSignatoriesModal, setLoading } from "../../../actions/utils"
import "./cert_upl.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { getCertTypes } from "../../../actions/student_actions";

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

  const statusCtx = useContext(StatusContext);

  useEffect(() => {
    setSemester(SemObj);
    getCertTypes();
  }, []);

  useEffect(() => {
    spider
      .get("/api/student/address")
      .then((res) => {
        let addrList = [];
        res.data.forEach((add) => {
          addrList.push(add);
        });
        setPreAddr(addrList);
      })
      .catch((err) => {console.log(err)});
  }, []);

  const refreshStatus = () => {
    statusCtx.refreshCertData();
  };

  const clearSemObj=()=>{
    SemObj.forEach((obj) => {
      obj.copies = 0;
    });
    setSemester(SemObj);
  }

  const setCopies = (semNo, noCopies) => {
    SemObj[semNo - 1].copies = noCopies;
    setSemester(SemObj);
  };

  const handleSubmitClose = () => setModal(false);
  const handleAddressClose = () => setAddressModal(false);

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
        setCertPdf(URL.createObjectURL(e.target.files[0]));
        setCertFileButton(true);
        setCertFileName(e.target.files[0].name);
      }
    } else {
      setCertFileName(null);
      setCertFileButton(true);
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
        setIdPdf(URL.createObjectURL(e.target.files[0]));
        setIdFileButton(true);
        setIdFileName(e.target.files[0].name);
      }
    } else {
      setIdFileName(null);
      setIdFileButton(true);
    }
  };

  const handleClose = () => setFileModal(false);
  const handleFileOpen = () => setFileModal(true);

  const handleInstructionsClose = () => setInstructionModal(false);
  const handleInstructionsOpen = () => setInstructionModal(true);

  const handleSignatoriesClose = () => setSignatoriesModal(false);
  const handleSignatoriesOpen = () => setSignatoriesModal(true);

  const certificateRequest = (e) => {
    e.preventDefault();
    setLoading(true);
    let fileUpload = document.getElementById("cert").files[0];
    let college_id = document.getElementById("college-id").files[0];
    let cd = new FormData();
    for (var i = 0; i < getCert().docId.length; i++) {
      if (
        getCert().docId[i] &&
        getCert().docId[i].name.toLowerCase() ===
          getCert().file.toLowerCase()
      ) {
        cd.set("type", parseInt(getCert().docId[i].id));
      }
    }
    cd.append("certificate", fileUpload);
    cd.append("certificate", college_id);
    if (
      getCert().file === "course de-registration" ||
      getCert().file === "course re-registration"
    ) {
      cd.set("course_code", getCert().courseCode);
      cd.set("course_name", getCert().course);
    }
    if (getCert().semwiseMap === true) {
      let sems = "",
        copies = "";
      getCert().semester.forEach((entry) => {
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
      (getCert().emailDel &&
        document.getElementById("email-sel").checked &&
        getCert().file === "transcript") ||
      getCert().semwiseMap === true ||
      getCert().file === "rank card"
    )
      cd.set("email", getCert().emailDel);
    if (
      (getCert().address &&
        document.getElementById("postal-del").checked &&
        getCert().file === "transcript") ||
      getCert().semwiseMap === true ||
      getCert().file === "rank card"
    )
      cd.set("address", getCert().address);
    if (getCert().feeReceipt)
      cd.set("receipt", getCert().feeReceipt);
    if (getCert().contact) cd.set("contact", getCert().contact);
    if (getCert().purpose) cd.set("purpose", getCert().purpose);
    if (getCert().name) cd.set("name", getCert().name);
    if (
      getCert().file === "transcript" ||
      getCert().file === "rank card"
    ) {
      if (getCert().no_of_copies)
        cd.set("no_copies", getCert().no_of_copies);
    }
    cd.set("path", getCert().emails.toString()); //eslint-disable-next-line
    for (var pair of cd.entries()) {
    }
    spider
      .post("api/student/certificate_request", cd)
      .then((res) => {
        resetCertUpl();
        getCertTypes();
        setSemester(SemObj);
        SemObj.forEach((obj) => {
          obj.copies = 0;
        });
        spider
          .get("/api/student/address")
          .then((res) => {
            let addrList = [];
            res.data.forEach((add) => {
              addrList.push(add);
            });
            setPreAddr(addrList);
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
        setFile("bonafide");
        setSemwiseMap(false);
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
            <Name></Name>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              {getCert().file === "bonafide" ||
              getCert().file === "transcript" ? (
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
                addressModal={getCert().addressModal}
                handleAddressClose={handleAddressClose}
              ></Delivery>

              {/* Course Deregistration/Registration */}
              {getCert().file === "course de-registration" ||
              getCert().file === "course re-registration" ? (
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
                cert_fileButton={getCert().cert_fileButton}
                id_fileButton={getCert().id_fileButton}
                handleFileOpen={handleFileOpen}
              ></CertAddition>

              {/* Submit button */}
              <SubmitBtn
                SemObj={SemObj}
                clearSemObj={clearSemObj}
                setCopies={setCopies}
              ></SubmitBtn>

            </form>
          </div>

          <FinalSubmitModal
            showModal={getCert().showModal}
            handleSubmitClose={handleSubmitClose}
            user={user}
            isLoading={getCert().isLoading}
            certificateRequest={certificateRequest}
          ></FinalSubmitModal>

          <EmailChart user={user}></EmailChart>
        </div>

        {/* ID and certificate Modal*/}
        <FilesModal
          fileModal={getCert().fileModal}
          handleClose={handleClose}
        >
          {" "}
        </FilesModal>

        <InstructionsModal
          //show={getCert()instructionsModal}
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