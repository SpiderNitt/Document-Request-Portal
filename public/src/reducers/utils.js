export default function reducer(
    state = {
        instructionsModal: true,
        signatoriesModal: false,
        isLoading: false,
    },
    action
) {
    switch (action.type) {
        case "SET_INSTRUCTIONS_MODAL": {
            return {
                ...state,
                instructionsModal: action.payload
            };
        }
        case "SET_SIGNATORIES_MODAL": {
            return {
                ...state,
                signatoriesModal: action.payload
            };
        }
        case "SET_LOADING": {
            return {
                ...state,
                isLoading: action.payload
            };
        }
        case "SET_DEFAULT": {
            return {
                instructionsModal: false,
                signatoriesModal: false,
                isLoading: false}
        }
        default:
            return state;
    }
};
