export default function reducer(
    state = {
        name: "",
        emails: [],
        cert_pdf: null,
        emailCount: 0,
        id_pdf: null,
        cert_fileName: "",
        id_fileName: "",
        cert_fileButton: false,
        id_fileButton: false,
        purpose: "",
        courseCode: "",
        course: "",
        contact: "",
        no_of_copies: 0,
        feeReceipt: "",
        file: "bonafide",
        docId: [],
        semwiseMap: false,
        semester: [],
        emailDel: "",
        address: "",
        preAddress: [],
        addressModal: false,
        fileModal: false,
        showModal: false
    },
    action
) {
    switch (action.type) {
        case "SET_NAME": {
            return {
                ...state,
                name: action.payload
            };
        }
        case "SET_EMAILS": {
            return {
                ...state,
                emails: action.payload
            };
        }
        case "SET_CERT_PDF": {
            return {
                ...state,
                cert_pdf: action.payload
            };
        }
        case "SET_EMAIL_COUNT": {
            return {
                ...state,
                emailCount: action.payload
            };
        }
        case "SET_ID_PDF": {
            return {
                ...state,
                id_pdf: action.payload
            };
        }
        case "SET_CERT_FILENAME": {
            return {
                ...state,
                cert_fileName: action.payload
            };
        }
        case "SET_ID_FILENAME": {
            return {
                ...state,
                id_fileName: action.payload
            };
        }
        case "SET_CERT_FILEBUTTON": {
            return {
                ...state,
                cert_fileButton: action.payload
            };
        }
        case "SET_ID_FILEBUTTON": {
            return {
                ...state,
                id_fileButton: action.payload
            };
        }
        case "SET_PURPOSE": {
            return {
                ...state,
                purpose: action.payload
            };
        }
        case "SET_CODE": {
            return {
                ...state,
                courseCode: action.payload
            };
        }
        case "SET_COURSE": {
            return {
                ...state,
                course: action.payload
            };
        }
        case "SET_CONTACT": {
            return {
                ...state,
                contact: action.payload
            };
        }
        case "SET_NO_OF_COPIES": {
            return {
                ...state,
                no_of_copies: action.payload
            };
        }
        case "SET_FEE": {
            return {
                ...state,
                feeReceipt: action.payload
            };
        }
        case "SET_FILE": {
            return {
                ...state,
                file: action.payload
            };
        }
        case "SET_DOC_ID": {
            return {
                ...state,
                docId: action.payload
            };
        }
        case "SET_SEMWISE_MAP": {
            return {
                ...state,
                semwiseMap: action.payload
            };
        }
        case "SET_SEMESTER": {
            return {
                ...state,
                semester: action.payload
            };
        }
        case "SET_EMAIL_DEL": {
            return {
                ...state,
                emailDel: action.payload
            };
        }
        case "SET_ADDRESS": {
            return {
                ...state,
                address: action.payload
            };
        }
        case "SET_PRE_ADDRESS": {
            return {
                ...state,
                preAddress: action.payload
            };
        }
        case "SET_ADDRESS_MODAL": {
            return {
                ...state,
                addressModal: action.payload
            };
        }
        case "SET_FILE_MODAL": {
            return {
                ...state,
                fileModal: action.payload
            };
        }
        case "SET_MODAL": {
            return {
                ...state,
                showModal: action.payload
            };
        }
        case "RESET_CERT_UPL": {
            return {
                ...state,
                name: "",
                emails: [],
                cert_pdf: null,
                emailCount: 0,
                id_pdf: null,
                cert_fileName: "",
                id_fileName: "",
                cert_fileButton: false,
                id_fileButton: false,
                purpose: "",
                courseCode: "",
                course: "",
                contact: "",
                no_of_copies: 0,
                feeReceipt: "",
                docId: [],
                semwiseMap: false,
                semester: [],
                emailDel: "",
                address: "",
                preAddress: [],
                addressModal: false,
                fileModal: false,
                showModal: false
            }
        }
        default:
            return state;
    }
};
