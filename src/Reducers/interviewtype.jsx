export const interviewTypeInitialState = "";


export const interviewTypeReducer = (state,action) => {
    switch(action.type){
        case "ShowResume":{
            return "ShowResume";
        };
        case "NoResume":{
            return "NoResume";
        };
        default: 
            return state
    }

}