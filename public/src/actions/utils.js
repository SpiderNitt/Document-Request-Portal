import store from '../store';

export function setInstructionModal(bool) {
    store.dispatch({type: "SET_INSTRUCTIONS_MODAL", payload: bool})
}
export function setSignatoriesModal(bool) {
    store.dispatch({type: "SET_SIGNATORIES_MODAL", payload:  bool})
}
export function setLoading(bool) {
    store.dispatch({type: "SET_LOADING", payload: bool})
}
export function isLoading() {
    return store.getState().utils.isLoading;
}