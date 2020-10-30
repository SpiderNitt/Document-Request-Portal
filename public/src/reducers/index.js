export default (state, action) => {
  console.log(action);
  switch (action.type) {
    case "SET_INSTRUCTIONS_MODAL": {
      return {
        ...state,
        instructionsModal: action.payload.instructionsModal,
      };
    }
    case "SET_SIGNATORIES_MODAL": {
      return {
        ...state,
        signatoriesModal: action.payload.signatoriesModal,
      };
    }
    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    }
    case "SET_NAME": {
      return {
        ...state,
        name: action.payload.name,
      };
    }
    case "SET_EMAILS": {
      return {
        ...state,
        emails: action.payload.emails,
      };
    }
    case "SET_CERT_PDF": {
      return {
        ...state,
        cert_pdf: action.payload.cert_pdf,
      };
    }
    case "SET_PURPOSE": {
      return {
        ...state,
        purpose: action.payload.purpose,
      };
    }
    case "SET_CODE": {
      return {
        ...state,
        courseCode: action.payload.courseCode,
      };
    }
    case "SET_COURSE": {
      return {
        ...state,
        course: action.payload.course,
      };
    }
    default:
      return state;
  }
};
