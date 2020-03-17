import React, { useState,useEffect } from "react";
import SideBar from "../utils/sidebar";
import {Button, Grid, Divider, Paper, List, ListItem} from "@material-ui/core"
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {SpinnerElement} from "../utils/spinner";
import axios from "axios";
import UnAuthorized from "../subPages/unAuth";
import {useSelector} from "react-redux";

const img = process.env.PUBLIC_URL +"sysImg/seabg.jpg";

export default function ProjectReport () {

    const uiData = useSelector(state => state.userReducer);
    const privs = useSelector(state => state.PrivsReducer);

    const [authStatus,setStatus] = useState();
    const [loading,setLoading] = useState(true);

    useEffect(()=> {
        setLoading(false);
    },[])

    return( (authStatus === true) ? (<UnAuthorized />)  :( (loading === true) ? ( <SpinnerElement /> ) :
    (
        <div id="App" style={ {height:"100%",width:"100%", backgroundImage: `url(${img})`,
        backgroundPosition:"center",position:"fixed" }}>
            <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
            <div id="page-wrap">
            <div>
            
            <Grid container spacing={1} alignItems="center">
            <Grid item xs={7} style={{marginLeft:"100px"}}><h2>Project </h2></Grid>
                <Grid item sm={2}> 
            </Grid>    {<Grid item sm={1}>{uiData.email}</Grid>}
            </Grid> <Divider/> 
            </div></div>
            <div style={{marginLeft:"100px"}}>
                
            </div>
              
        </div>  )
        )
    )
}

