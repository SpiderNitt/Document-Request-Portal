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
