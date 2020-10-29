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
};
const store = createStore(
  reducer,
  initalState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
