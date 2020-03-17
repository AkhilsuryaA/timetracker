

const initialState = {
    token:"",
    email:"",
    uid:""
    
  };
  
    function userReducer(state = initialState, action) {
    //console.log("check ", state, action);
  
    switch(action.type) {
        case "ADD_USER":
            return Object.assign({}, state, {
                token : action.token,
                email : action.email,
                uid : action.uid
            });
        default : return state;
    }
    
    }
    
    export default userReducer;




