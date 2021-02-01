import { createStore } from "redux";
import reducer from "../reducers/index";

const initalState = {
  instructionsModal: true,
  signatoriesModal: false,
  isLoading: false,
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
  showModal: false,
  certTypes: [],
  certReq: [],
  isRefreshing: false,
  loading: true,
  length: 0,
  showModalApprove: false,
  fileStatus: false,
  emailModel: false,
  emailLoad: false,
  postalModel: false,
  rejectModel: false,
};
const store = createStore(
  reducer,
  initalState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
