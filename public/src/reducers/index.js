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
} from "../actions/types";

// eslint-disable-next-line
export default (state, action) => {
  switch (action.type) {
    case SET_INSTRUCTIONS_MODAL: {
      return {
        ...state,
        instructionsModal: action.payload.instructionsModal,
      };
    }
    case SET_SIGNATORIES_MODAL: {
      return {
        ...state,
        signatoriesModal: action.payload.signatoriesModal,
      };
    }
    case SET_LOADING: {
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    }
    case SET_NAME: {
      return {
        ...state,
        name: action.payload.name,
      };
    }
    case SET_EMAILS: {
      return {
        ...state,
        emails: action.payload.emails,
      };
    }
    case SET_CERT_PDF: {
      return {
        ...state,
        cert_pdf: action.payload.cert_pdf,
      };
    }
    case SET_EMAIL_COUNT: {
      return {
        ...state,
        emailCount: action.payload.emailCount,
      };
    }
    case SET_ID_PDF: {
      return {
        ...state,
        id_pdf: action.payload.id_pdf,
      };
    }
    case SET_CERT_FILENAME: {
      return {
        ...state,
        cert_fileName: action.payload.cert_fileName,
      };
    }
    case SET_ID_FILENAME: {
      return {
        ...state,
        id_fileName: action.payload.id_fileName,
      };
    }
    case SET_CERT_FILEBUTTON: {
      return {
        ...state,
        cert_fileButton: action.payload.cert_fileButton,
      };
    }
    case SET_ID_FILEBUTTON: {
      return {
        ...state,
        id_fileButton: action.payload.id_fileButton,
      };
    }
    case SET_PURPOSE: {
      return {
        ...state,
        purpose: action.payload.purpose,
      };
    }
    case SET_CODE: {
      return {
        ...state,
        courseCode: action.payload.courseCode,
      };
    }
    case SET_COURSE: {
      return {
        ...state,
        course: action.payload.course,
      };
    }
    case SET_CONTACT: {
      return {
        ...state,
        contact: action.payload.contact,
      };
    }
    case SET_NO_OF_COPIES: {
      return {
        ...state,
        no_of_copies: action.payload.no_of_copies,
      };
    }
    case SET_FEE: {
      return {
        ...state,
        feeReceipt: action.payload.feeReceipt,
      };
    }
    case SET_FILE: {
      return {
        ...state,
        file: action.payload.file,
      };
    }
    case SET_DOC_ID: {
      return {
        ...state,
        docId: action.payload.docId,
      };
    }
    case SET_SEMWISE_MAP: {
      return {
        ...state,
        semwiseMap: action.payload.semwiseMap,
      };
    }
    case SET_SEMESTER: {
      return {
        ...state,
        semester: action.payload.semester,
      };
    }
    case SET_EMAIL_DEL: {
      return {
        ...state,
        emailDel: action.payload.emailDel,
      };
    }
    case SET_ADDRESS: {
      return {
        ...state,
        address: action.payload.address,
      };
    }
    case SET_PRE_ADDRESS: {
      return {
        ...state,
        preAddress: action.payload.preAddress,
      };
    }
    case SET_ADDRESS_MODAL: {
      return {
        ...state,
        addressModal: action.payload.addressModal,
      };
    }
    case SET_FILE_MODAL: {
      return {
        ...state,
        fileModal: action.payload.fileModal,
      };
    }
    case SET_MODAL: {
      return {
        ...state,
        showModal: action.payload.showModal,
      };
    }
    case SET_TOGGLED: {
      return {
        ...state,
        toggled: action.payload.toggled,
      };
    }
    case SET_MODAL_VIEWED: {
      return {
        ...state,
        modalViewed: action.payload.modalViewed,
      };
    }
    default:
      return state;
  }
};
