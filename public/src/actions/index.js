import {
  SET_INSTRUCTIONS_MODAL,
  SET_SIGNATORIES_MODAL,
  SET_LOADING,
  SET_NAME,
  SET_EMAILS,
  SET_CERT_PDF,
  SET_EMAIL_COUNT,
  SET_ID_PDF,
  SET_CERT_FILENAME,
  SET_ID_FILENAME,
  SET_CERT_FILEBUTTON,
  SET_ID_FILEBUTTON,
  SET_PURPOSE,
  SET_CODE,
  SET_COURSE,
  SET_CONTACT,
  SET_NO_OF_COPIES,
  SET_FEE,
  SET_FILE,
  SET_DOC_ID,
  SET_SEMWISE_MAP,
  SET_SEMESTER,
  SET_EMAIL_DEL,
  SET_ADDRESS,
  SET_PRE_ADDRESS,
  SET_ADDRESS_MODAL,
  SET_FILE_MODAL,
  SET_MODAL,
  SET_CERT_TYPE,
  SET_REQ,
  SET_REFRESHING,
  SET_LOAD,
  SET_LENGTH,
  SET_APPROVE_MODEL,
  SET_FILE_STATUS,
  SET_EMAIL_MODEL,
  SET_EMAIL_LOAD,
  SET_POSTAL_MODEL,
  SET_REJECT_MODEL,
} from "./types";
export function setInstructionModal(bool) {
  return {
    type: SET_INSTRUCTIONS_MODAL,
    payload: {
      instructionsModal: bool,
    },
  };
}
export function setSignatoriesModal(bool) {
  return {
    type: SET_SIGNATORIES_MODAL,
    payload: {
      signatoriesModal: bool,
    },
  };
}
export function setLoading(bool) {
  return {
    type: SET_LOADING,
    payload: {
      isLoading: bool,
    },
  };
}
export function setName(name) {
  return {
    type: SET_NAME,
    payload: {
      name: name,
    },
  };
}
export function setEmails(emails) {
  return {
    type: SET_EMAILS,
    payload: {
      emails: emails,
    },
  };
}
export function setCertPdf(url) {
  return {
    type: SET_CERT_PDF,
    payload: {
      cert_pdf: url,
    },
  };
}
export function setEmailCount(num) {
  return {
    type: SET_EMAIL_COUNT,
    payload: {
      emailCount: num,
    },
  };
}
export function setIdPdf(id) {
  return {
    type: SET_ID_PDF,
    payload: {
      id_pdf: id,
    },
  };
}
export function setCertFileName(name) {
  return {
    type: SET_CERT_FILENAME,
    payload: {
      cert_fileName: name,
    },
  };
}
export function setIdFileName(id) {
  return {
    type: SET_ID_FILENAME,
    payload: {
      id_fileName: id,
    },
  };
}
export function setCertFileButton(id) {
  return {
    type: SET_CERT_FILEBUTTON,
    payload: {
      cert_fileButton: id,
    },
  };
}
export function setIdFileButton(bool) {
  return {
    type: SET_ID_FILEBUTTON,
    payload: {
      id_fileButton: bool,
    },
  };
}

export function setPurpose(url) {
  return {
    type: SET_PURPOSE,
    payload: {
      purpose: url,
    },
  };
}
export function setCode(url) {
  return {
    type: SET_CODE,
    payload: {
      courseCode: url,
    },
  };
}
export function setCourse(url) {
  return {
    type: SET_COURSE,
    payload: {
      course: url,
    },
  };
}
export function setContact(url) {
  return {
    type: SET_CONTACT,
    payload: {
      contact: url,
    },
  };
}
export function setFee(url) {
  return {
    type: SET_FEE,
    payload: {
      feeReceipt: url,
    },
  };
}
export function setNoOfCopies(url) {
  return {
    type: SET_NO_OF_COPIES,
    payload: {
      no_of_copies: url,
    },
  };
}
export function setFile(file) {
  return {
    type: SET_FILE,
    payload: {
      file: file,
    },
  };
}
export function setDocId(id) {
  return {
    type: SET_DOC_ID,
    payload: {
      docId: id,
    },
  };
}
export function setSemwiseMap(bool) {
  return {
    type: SET_SEMWISE_MAP,
    payload: {
      semwiseMap: bool,
    },
  };
}
export function setSemester(sem) {
  return {
    type: SET_SEMESTER,
    payload: {
      semester: sem,
    },
  };
}
export function setEmailDel(email) {
  return {
    type: SET_EMAIL_DEL,
    payload: {
      emailDel: email,
    },
  };
}
export function setAddress(addr) {
  return {
    type: SET_ADDRESS,
    payload: {
      address: addr,
    },
  };
}
export function setPreAddr(preaddr) {
  return {
    type: SET_PRE_ADDRESS,
    payload: {
      preAddress: preaddr,
    },
  };
}
export function setAddressModal(bool) {
  return {
    type: SET_ADDRESS_MODAL,
    payload: {
      addressModal: bool,
    },
  };
}
export function setFileModal(bool) {
  return {
    type: SET_FILE_MODAL,
    payload: {
      fileModal: bool,
    },
  };
}
export function setModal(bool) {
  return {
    type: SET_MODAL,
    payload: {
      showModal: bool,
    },
  };
}
export function setCertType(certTypes) {
  return {
    type: SET_CERT_TYPE,
    payload: {
      certTypes: certTypes,
    },
  };
}
export function setReq(certReq) {
  return {
    type: SET_REQ,
    payload: {
      certReq: certReq,
    },
  };
}
export function setRefreshing(isRefreshing) {
  return {
    type: SET_REFRESHING,
    payload: {
      isRefreshing: isRefreshing,
    },
  };
}
export function setLoad(loading) {
  return {
    type: SET_LOAD,
    payload: {
      loading: loading,
    },
  };
}
export function setLength(length) {
  return {
    type: SET_LENGTH,
    payload: {
      length: length,
    },
  };
}
export function setApproveModel(showModalApprove) {
  return {
    type: SET_APPROVE_MODEL,
    payload: {
      showModalApprove: showModalApprove,
    },
  };
}
export function setFilestatus(fileStatus) {
  return {
    type: SET_FILE_STATUS,
    payload: {
      fileStatus: fileStatus,
    },
  };
}
export function setEmailModel(emailModel) {
  return {
    type: SET_EMAIL_MODEL,
    payload: {
      emailModel: emailModel,
    },
  };
}
export function setEmailLoad(emailLoad) {
  return {
    type: SET_EMAIL_LOAD,
    payload: {
      emailLoad: emailLoad,
    },
  };
}
export function setPostalModel(postalModel) {
  return {
    type: SET_POSTAL_MODEL,
    payload: {
      postalModel: postalModel,
    },
  };
}
export function setRejectModel(rejectModel) {
  return {
    type: SET_REJECT_MODEL,
    payload: {
      rejectModel: rejectModel,
    },
  };
}


