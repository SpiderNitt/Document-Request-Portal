export default (state, action) => {
  console.log(action);
  switch (action.type) {
    case "SET_INSTRUCTIONS_MODAL": {
      return {
        ...state,
        instructionsModal: action.payload.instructionsModal,
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
    case "SET_EMAIL_COUNT": {
      return {
        ...state,
        emailCount: action.payload.emailCount,
      };
    }
    case "SET_ID_PDF": {
      return {
        ...state,
        id_pdf: action.payload.id_pdf,
      };
    }
    case "SET_CERT_FILENAME": {
      return {
        ...state,
        cert_fileName: action.payload.cert_fileName,
      };
    }
    case "SET_ID_FILENAME":{
      return{
        ...state,
        id_fileName:action.payload.id_fileName
      }
    }
    case "SET_CERT_FILEBUTTON":{
      return{
        ...state,
        cert_fileButton:action.payload.cert_fileButton
      }
    }
    case "SET_ID_FILEBUTTON":{
      return{
        ...state,
        id_fileButton:action.payload.id_fileButton
      }
    } 
    default:
      return state;
  }
};
