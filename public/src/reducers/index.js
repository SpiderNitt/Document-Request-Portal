export default (state,action)=>{
    console.log(action);
    switch(action.type)
    {
        case 'SET_INSTRUCTIONS_MODAL':{
            return{
                ...state,
                instructionsModal:action.payload.instructionsModal
            }
        }
        case 'SET_LOADING':{
            return{
                ...state,
                isLoading:action.payload.isLoading
            }
        }
        case 'SET_NAME':{
            return{
                ...state,
                name:action.payload.name
            }
        }
        case 'SET_EMAILS':{
            return{
                ...state,
                emails:action.payload.emails
            }
        }
        case 'SET_CERT_PDF':{
            return{
                ...state,
                cert_pdf:action.payload.cert_pdf
            }
        }
        default: return state;
    }
}