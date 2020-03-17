
import { combineReducers } from 'redux'
import userReducer from "./userReducer";
import teamReducer from "./teamReducer";
import ERReducer from "./eachProjeReducer";
import PrivsReducer from "./privsReducer";
import WorkspaceReducer from "./workspaceReducer"

 const rootReducer = combineReducers({
  teamReducer,
  userReducer,
  ERReducer,
  PrivsReducer,
  WorkspaceReducer
})

export default rootReducer;



