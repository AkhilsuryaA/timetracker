import React from "react";
import decode from "jwt-decode";
import { slide as Menu } from "react-burger-menu";
import { Link,NavLink } from "react-router-dom";
import WorkspaceButton from "./workspbutton";

export default props => {

  //isOpen noOverlay disableCloseOnEsc

  let token = localStorage.getItem("myToken");
  let user = decode(token);
  let em = user.email;
  return (
    // Pass on our props
    <Menu {...props} width={ 250 }  >   

      <NavLink className="menu-item" to="/home">   Timer   </NavLink>

      <NavLink className="menu-item" to="/clients">    Clients   </NavLink>

      <NavLink className="menu-item" to="/projects">    Projects    </NavLink>

      <NavLink className="menu-item" to="/reports">      Reports</NavLink>
      
     {/* <NavLink className="menu-item" to="/chart">                      chart      </NavLink> */}
      
      <NavLink className="menu-item" to="/profilePage">  Profile    </NavLink>
      
      <NavLink className="menu-item" to="/team">  Team    </NavLink>

      <NavLink className="menu-item" to="/logout" style={{marginBottom:"300px"}}>  Logout  </NavLink>
     {<WorkspaceButton /> } 
      <a style={{marginTop:"10px"}} className="menu-item">   {em}    </a>
    </Menu>
  );
};
