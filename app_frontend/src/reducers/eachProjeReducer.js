
const initState = {
    projInfo:""
}

function EPReducer (state = initState, action) {
    //console.log(action,"hehe")
    if(action.type === "PASS_PROJ") {
        return Object.assign({}, state, {
            projInfo:action.data
        })
    }
    return state;
}

export default EPReducer;
    