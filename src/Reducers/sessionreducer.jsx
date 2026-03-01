export const sessionInitialstate = "";

export const sessionReducer = (state,action) => {
    switch(action.type){
        case "Set":
            return action.payload;
        case "Reset":
            return sessionInitialstate;
        default:
            return state;
    }
}