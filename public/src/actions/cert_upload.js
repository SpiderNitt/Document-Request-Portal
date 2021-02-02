import store from '../store';

export function setName(name) {
    store.dispatch({type: "SET_NAME", payload: name})
}
export function setEmails(emails) {
    store.dispatch({type: "SET_EMAILS", payload: emails})
}
export function setCertPdf(url) {
    store.dispatch({type: "SET_CERT_PDF", payload: url})
}
export function setEmailCount(num) {
    store.dispatch({type: "SET_EMAIL_COUNT", payload: num})
}
export function setIdPdf(id) {
    store.dispatch({type: "SET_ID_PDF", payload: id})
}
export function setCertFileName(name) {
    store.dispatch({type: "SET_CERT_FILENAME", payload: name})
}
export function setIdFileName(id) {
    store.dispatch({type: "SET_ID_FILENAME", payload: id})
}
export function setCertFileButton(id) {
    store.dispatch({type: "SET_CERT_FILEBUTTON", payload: id})
}
export function setIdFileButton(bool) {
    store.dispatch({type: "SET_ID_FILEBUTTON", payload: bool})
}
export function setPurpose(url) {
    store.dispatch({type: "SET_PURPOSE", payload: url})
}
export function setCode(url) {
    store.dispatch({type: "SET_CODE", payload: url})
}
export function setCourse(url) {
    store.dispatch({type: "SET_COURSE", payload: url})
}
export function setContact(url) {
    store.dispatch({type: "SET_CONTACT", payload: url})
}
export function setFee(url) {
    store.dispatch({type: "SET_FEE", payload: url})
}
export function setNoOfCopies(url) {
    store.dispatch({type: "SET_NO_OF_COPIES", payload: url})
}
export function setFile(file) {
    store.dispatch({type: "SET_FILE", payload: file})
}
export function setDocId(id) {
    store.dispatch({type: "SET_DOC_ID", payload: id})
}
export function setSemwiseMap(bool) {
    store.dispatch({type: "SET_SEMWISE_MAP", payload: bool})
}
export function setSemester(sem) {
    store.dispatch({type: "SET_SEMESTER", payload: sem})
}
export function setEmailDel(email) {
    store.dispatch({type: "SET_EMAIL_DEL", payload: email})
}
export function setAddress(addr) {
    store.dispatch({type: "SET_ADDRESS", payload: addr})
}
export function setPreAddr(preaddr) {
    store.dispatch({type: "SET_PRE_ADDRESS", payload: preaddr})
}
export function setAddressModal(bool) {
    store.dispatch({type: "SET_ADDRESS_MODAL", payload: bool})
}
export function setFileModal(bool) {
    store.dispatch({type: "SET_FILE_MODAL", payload: bool})
}
export function setModal(bool) {
    store.dispatch({type: "SET_MODAL", payload: bool})
}
export function resetCertUpl() {
    store.dispatch({type: "RESET_CERT_UPL"})
    store.dispatch({type: "SET_DEFAULT"})
}
export function getCert() {
    return store.getState().cert_upload;
}