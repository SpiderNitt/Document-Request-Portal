export function setInstructionModal(bool) {
  return {
    type: "SET_INSTRUCTIONS_MODAL",
    payload: {
      instructionsModal: bool,
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
