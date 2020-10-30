export function setInstructionModal(bool) {
  return {
    type: "SET_INSTRUCTIONS_MODAL",
    payload: {
      instructionsModal: bool,
    },
  };
}
export function setSignatoriesModal(bool) {
  return {
    type: "SET_SIGNATORIES_MODAL",
    payload: {
      signatoriesModal: bool,
    },
  };
}
export function setLoading(bool) {
  return {
    type: "SET_LOADING",
    payload: {
      isLoading: bool,
    },
  };
}
export function setName(name) {
  return {
    type: "SET_NAME",
    payload: {
      name: name,
    },
  };
}
export function setEmails(emails) {
  return {
    type: "SET_EMAILS",
    payload: {
      emails: emails,
    },
  };
}
export function setCertPdf(url) {
  return {
    type: "SET_CERT_PDF",
    payload: {
      cert_pdf: url,
    },
  };
}
export function setEmailCount(num) {
  return {
    type: "SET_EMAIL_COUNT",
    payload: {
      emailCount: num,
    },
  };
}
export function setIdPdf(id) {
  return {
    type: "SET_ID_PDF",
    payload: {
      id_pdf: id,
    },
  };
}
export function setCertFileName(name) {
  return {
    type: "SET_CERT_FILENAME",
    payload: {
      cert_fileName: name,
    },
  };
}
export function setIdFileName(id) {
  return {
    type: "SET_ID_FILENAME",
    payload: {
      id_fileName: id,
    },
  };
}
export function setCertFileButton(id) {
  return {
    type: "SET_CERT_FILEBUTTON",
    payload: {
      cert_fileButton: id,
    },
  };
}
export function setIdFileButton(bool) {
  return {
    type: "SET_ID_FILEBUTTON",
    payload: {
      id_fileButton: bool,
    },
  };
}

export function setPurpose(url) {
  return {
    type: "SET_PURPOSE",
    payload: {
      purpose: url,
    },
  };
}
export function setCode(url) {
  return {
    type: "SET_CODE",
    payload: {
      courseCode: url,
    },
  };
}
export function setCourse(url) {
  return {
    type: "SET_COURSE",
    payload: {
      course: url,
    },
  };
}
export function setContact(url) {
  return {
    type: "SET_CONTACT",
    payload: {
      contact: url,
    },
  };
}
export function setFee(url) {
  return {
    type: "SET_FEE",
    payload: {
      feeReceipt: url,
    },
  };
}
export function setNoOfCopies(url) {
  return {
    type: "SET_NO_OF_COPIES",
    payload: {
      no_of_copies: url,
    },
  };
}
