
const initState = {
    workspace : ""
}

function WorkspaceReducere (state = initState,action) {
    if(action.type === "ADD_WORKSPACE") {
        return Object.assign({}, state, {
            workspace:action.workspace
        })
    }
    return state;
}

export default WorkspaceReducere;
