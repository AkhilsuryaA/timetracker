
const initState = {
    ownership:"",
    workspace_id : ""
}

function PrivsReducer (state = initState, action) {
    //console.log("check ", state, action);
    if(action.type === "ADD_PRIVILAGE") {
        return Object.assign({}, state, {
            ownership:action.ownership,
            workspace_id:action.workspace_id
        })
    }
    return state;
}

export default PrivsReducer;

