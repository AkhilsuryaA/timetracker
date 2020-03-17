
import React, { useState, useEffect } from "react";
import SideBar from "../utils/sidebar";
import {Button, Grid, Divider, Paper, List, ListItem, Dialog,DialogContent,DialogTitle} from "@material-ui/core"
import {useSelector} from "react-redux"
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import axios from "axios";
import ProjectStatusDD from "../utils/projectStatusDD";
import ProjectPrioDD from "../utils/projectPrioDD";
import UnAuthorized from "../subPages/unAuth";
import {SpinnerElement} from "../utils/spinner";
import AddIcon from '@material-ui/icons/Add';


export default function EachProject () {

    const proData = useSelector(state => state.ERReducer.projInfo);
    const uiData = useSelector(state => state.userReducer);
    const privs = useSelector(state => state.PrivsReducer);
    const [projMembers, setProjMembers] = useState([]);
    const [authStatus,setAuthStat] = useState(false); 
    const [loading,setLoading] = useState(true);
    const [runTime,setTime] = useState();
    const [openMemList, setOpenList] = useState(false);
    const [memList,setMemList] = useState([]);
    useEffect(()=> {
        setLoading(false);
        projmemberList();
    },[]);
    //const {data} = props.location
    //console.log("here",data)
    const img = process.env.PUBLIC_URL +"sysImg/seabg.jpg";
    
    const ProjTime = () => {
        let seconds = ("0" + (Math.floor(runTime / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(runTime / 60000) % 60)).slice(-2);
        let hours = ("0" + Math.floor(runTime / 3600000)).slice(-2);
        return (
            
                <Paper style={{marginLeft:"50px",height:"150px",width:"200px",marginBottom:"5px",}}>
                    <div style={{marginLeft:"45px",top:"10px",paddingTop:"20px"}}>
                        Total Run Time
                    </div>
                    <div style={{marginLeft:"58px",marginTop:"30px"}}>
                    {hours} : {minutes} : {seconds}
                    </div>
                    
                </Paper>
            
        )
    }

    const projmemberList = () => {
        console.log(privs,uiData);
        let data = [];
        data[0] = proData.id;
        let url = "/api/user/getProjMember";
        console.log(data);
        axios.post(url, data,{ headers: {"Authorization" : `Bearer ${uiData.token}`} })
        .then(res=>{
            console.log(res.data.response)
            setProjMembers(res.data.response);
        })
        .catch(err=>{
            if(err.response.status === 403)
            { 
                setAuthStat(true);
            }
            console.log(err)
        });

        if(privs.ownership === 'owner' || privs.ownership === 'admin') {
            console.log("hello");
            timeByProj();
        }
    }

    const timeByProj = () => {

        let data = [];
        data[0] = uiData.uid;
        data[1] = proData.client;
        data[2] = proData.project;
        let url = "/api/user/timeByProject";
        axios.post(url,data,{ headers:{"Authorization" : `Bearer ${uiData.token}`} })
        .then(res => {
            console.log(res.data.results);
            setTime(res.data.results[0].timebyproj)
        })
        .catch(err =>{
            if(err.response.status === 403)
            { 
                setAuthStat(true);
            }
            console.log(err)
        });
    }

    const addMemClick = () => {
        console.log("called");
        setOpenList(true);
    }

    const handleMemList = () => {
        setOpenList(false);
    }
    
    const addMember = () => {
        
    }

    return( (authStatus === true) ? (<UnAuthorized />)  :( (loading === true) ? ( <SpinnerElement /> ) :
    (
        <div id="App" style={ {height:"100%",width:"100%", backgroundImage: `url(${img})`,
        backgroundPosition:"center",position:"fixed" }}>
            <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
            <div id="page-wrap">
            <div>
            
            <Grid container spacing={1} alignItems="center">
            <Grid item xs={7} style={{marginLeft:"100px"}}><h2>Project <KeyboardArrowRightIcon style={{color:"red"}} fontSize="large" />
            <FiberManualRecordIcon fontSize="small" /> {proData.project} </h2></Grid>
                <Grid item sm={2}> 
                
                </Grid>    {<Grid item sm={1}>{uiData.email}</Grid>}
            </Grid> <Divider/> 
            </div></div>
            <div style={{marginLeft:"100px",marginTop:"20px",display:"flex"}}>
                <div style={{display:"inline-block"}}>
                    <Paper style={{height:"150px",width:"85%",marginBottom:".5px"}}>
                    <div style={{marginLeft:"10px"}}>
                    <div style={{display:"inline-block", width:"75px", marginTop:"10px"}}>status</div>
                    <div style={{display:"inline-block", width:"150px", marginTop:"10px"}}><ProjectStatusDD /></div>
                    <div style={{display:"inline-block", width:"75px", marginTop:"10px",marginLeft:"50px"}}>priority</div>
                    <div style={{display:"inline-block", width:"100px", marginTop:"10px"}}><ProjectPrioDD /></div>
                    <div style={{display:"inline-block", width:"160px",marginLeft:"480px", marginTop:"5px"}}>
                    {(privs.ownership === 'owner' || privs.ownership === 'admin') 
                    ?   <Button variant="contained" onClick={addMemClick} color="secondary" startIcon={<AddIcon/>}>add member</Button>
                    :   <Button variant="contained" startIcon={<AddIcon/>}>add member</Button>
                     }
                        </div>
                </div>
                    <div style={{marginTop:'40px', marginLeft:"10px"}}>
                        <div style={{display:"inline-block", width:"150px", marginBottom:"10px"}} >Team Members</div>
                        <div style={{display:"inline-block",width:"75px",marginLeft:"60%",marginBottom:"10px"}}>Role</div>
                    </div>
                </Paper></div>
                <div style={{display:"inline-block"}}>
                    {(privs.ownership === 'owner' || privs.ownership === 'admin') ? <ProjTime />:"" }
                </div>
            </div>
                
            <Dialog open={openMemList} onClose={handleMemList} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Select Members</DialogTitle><Divider/>
                <DialogContent>                
                    {/*<ListItem button onClick={noClient}>no client</ListItem>*/}                
                <ul>
                    {memList.map(list => (
                    <List key={list.id}>
                        <ListItem button onClick={() => addMember(list.client)}>
                            {list.client}
                        </ListItem>
                    </List>
                    ))}
                </ul></DialogContent>
            </Dialog>

            <ul>
                {projMembers.map(item => (<div key={item.pm_id}>
                    <Paper style={{marginLeft:"60px",width:"65%"}}>
                        <List>
                            <ListItem>
                            <div style={{width:"60%"}}>{item.members}</div>
                            <div>{item.role}</div>
                            </ListItem>
                        </List>
                    </Paper>
                </div>))}
            </ul>            
        </div>  )
    )
    )
}
