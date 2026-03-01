export const redixsessionInitialState = "";

export const redixsessionReducer = (state,action) => {
    switch(action.type){
        case "SetRedix":
            return action.payload;
        case "ResetRedix":
            return redixsessionInitialState;
        default:
            return state;
    }
}