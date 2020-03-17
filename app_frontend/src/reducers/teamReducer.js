const initialState = {
    team_id: ""
    
  };
  
  function teamReducer(state = initialState, action) {
    //console.log("check ", state, action);
  
    switch(action.type) {
        case "ADD_TEAM":
            return Object.assign({}, state, {
                team_id: action.team_id
            });
        case "NEW_TEAM":
            return Object.assign({},state, {
                team_id:""
            });
        default : return state;
    }
   
    }
  
  export default teamReducer;

  