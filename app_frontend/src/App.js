
import React from 'react';
import './index.css';
import App1 from './App';
//import * as serviceWorker from './serviceWorker';
import App_Timer from "./Components/Loginform.js";
import {Route, BrowserRouter as Router} from "react-router-dom";
import UserdeIn from "./Components/Signupform";
import Timer from "../src/Pages/afterLogin";
import Logout from "./Pages/logout";
import ProjectPage from "./Pages/projects"
import ClientPage from './Pages/client';
import Reports from "./Pages/reports";
import MyChart from "../src/Pages/charts";
import ProfilePage from "../src/Pages/profile";
import Team from "../src/Pages/team";
import Completed from "../src/Components/Userdetails";
import newUseredIn from "../src/Components/Signupform";
import EachProject from './subPages/eachProject';
import CreateWorksp from "./subPages/createWorksp";
import ProjectReport from "./subPages/projectReport";

export default function App () {

  
    return (
<Router>
      <div>
            <Route path="/" exact component={App_Timer}/>
            <Route path="/Loginform" component={App_Timer}/>
            <Route path="/Signupform" component={newUseredIn}/>
            <Route path="/Userdetails" component={Completed}/>
            <Route path="/afterLogin" component={Timer}/>
            <Route path="/clients" component={ClientPage}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/home" component={Timer}/>
            <Route path="/projects" component={ProjectPage}/>
            <Route path="/reports" component={Reports}/>
            <Route path="/chart" component={MyChart}/>
            <Route path="/profilePage" component={ProfilePage}/>
            <Route path="/team" component={Team}/>
            <Route path="/eachProject" component={EachProject} />
            <Route path="/createWorkspace" component={CreateWorksp} />
            <Route path="/App" component={App1}/>
            <Route path="/projectReport" component={ProjectReport} />
      </div>
    </Router>  
    )
}

