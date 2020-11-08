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
  SET_TOGGLED,
  SET_MODAL_VIEWED,
  // SET_STATUS1,
  // SET_STATUS2
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
export function setToggled(toggled) {
  return {
    type: SET_TOGGLED,
    payload: {
      toggled: toggled,
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
export function setModalViewed(id) {
  return {
    type: SET_MODAL_VIEWED,
    payload: {
      modalViewed: id,
    },
  };
}
// export function checkStatus1(bool) {
//   return {
//     type: SET_STATUS1,
//     payload: {
//       status1:false,
//     },
//   };
// }
// export function checkStatus2(bool) {
//   return {
//     type: SET_STATUS2,
//     payload: {
//       status2:false,
//     },
//   };
// }
