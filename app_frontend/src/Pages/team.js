
import React, {useState,useEffect}from "react";
import SideBar from "../utils/sidebar"
import {Grid, Button, Divider,DialogContent,Paper} from "@material-ui/core";
import axios from "axios";
import { Dialog,TextField,DialogTitle } from "@material-ui/core";
import decode from "jwt-decode";
import {member,createTeam} from "../Components/addMember";
import {useSelector} from "react-redux";
import UnAuthorized from "../subPages/unAuth";
import {SpinnerElement} from "../utils/spinner";

const img = process.env.PUBLIC_URL +"sysImg/seabg.jpg";

export default function Team() {
    
    const uiData = useSelector(state=>state.userReducer);
    const privs = useSelector(state=>state.PrivsReducer);
    const team_id = useSelector(state=>state.teamReducer.team_id);
    const [open, setOpen] = useState(false);
    const [array, setArray] = useState([]);
    const [authStatus,setAuthStat] = useState(false);
    const [loading,setLoading] = useState(true);
    useEffect(() => {
        setLoading(false)
        teamList();
    },[team_id]);

    const userLoginDetails = {
        token:uiData.token,
        email:uiData.email,
        uid:uiData.uid
    }
    
    const handleClickOpen = () => {
        console.log(team_id)
        setOpen(true);
    }


    const handleSubmit=(e)=>{
        console.log("called");
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        
            let data = {                     
                to: email,
                from:userLoginDetails.email,
                workspace_id:privs.workspace_id  
            };
            let url = "/api/sendEmail"
            axios.post(url,data,{ headers: {"Authorization" : `Bearer ${userLoginDetails.token}`}})
            .then((response)=>{
                if (response.data.msg === 'success'){
    
                    console.log("Invitation Sent."); 
                    handleClose();
                    inviteInDb(email);
                }else if(response.data.msg === 'fail'){
                    alert("Message failed to send.")
                }
            })
            .catch(err=>  {
                if(err.response.status === 403)
                { setAuthStat(true);
                }
                console.log(err)
              });
    }    
    const handleClose = () => {
        setOpen(false);
    }

    const inviteInDb = (email) => {
            let input = [];
        input[0] = email;
        input[1] = userLoginDetails.email;
        input[2] = team_id;
        console.log(input);
        axios.post("/api/createinvite",input,{ headers: {"Authorization" : `Bearer ${userLoginDetails.token}`}})
        .then(res => {
            if(res.status === 200) {
                console.log("successfully sent initation")
            }
        })
        .catch(err=> {
            if(err.response.status === 403)
            { setAuthStat(true);
            }
            console.log(err)
          });
    }

    const teamList = () => {
                let input = [];
                input[0] = team_id;
            axios.post("/api/getmembers",input,{ headers: {"Authorization" : `Bearer ${userLoginDetails.token}`} })
                .then(res => {
                    console.log(res.data.results);
                    setArray(res.data.results);
                })
                .catch(err=>  {
                    if(err.response.status === 403)
                    { setAuthStat(true);
                    }
                    console.log(err)
                  });
    }

    return( (authStatus === true)? <UnAuthorized /> : ( (loading === true) ? ( <SpinnerElement /> ) :
        ( <div id="App" style={ {height:"100%",width:"100%", backgroundImage: `url(${img})`,
        backgroundPosition:"center",position:"fixed" }}>            
        <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
        <div id="page-wrap" >
        <div >
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={7} style={{marginLeft:"100px"}}><h2>Team</h2></Grid>
                        <Grid item sm={2}> 
                        {(privs.ownership === 'owner' || privs.ownership === 'admin') ? 
                        <Button variant="contained" color="secondary" onClick={handleClickOpen} size="small">
                        Send Email
                      </Button>
                        : (<Button variant="contained" size="small">
                        Send Email
                      </Button>)}    
            </Grid>  {<Grid item sm={1}>{userLoginDetails.email}</Grid>}
                    </Grid><Divider/> 
                </div>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth={"xs"}>
            <DialogTitle id="form-dialog-title">Enter Email</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit}>
              
              <TextField id="email" name="client" autoFocus margin="dense" 
              type="email" fullWidth variant="filled" />
              </form>
            </DialogContent>   
              <Button type="submit" onClick={handleSubmit} color="secondary" variant="contained">
                Create
              </Button>
            </Dialog>
         
         
          <div style={{marginTop:"10px"}}><Paper style={{marginLeft:"40px",}}>
            <div style={{marginLeft:"100px"}}>
            <Grid container spacing={1} alignItems="center">
            <Grid style={{width:"250px"}}><h3>Team Members</h3></Grid>
            <Grid></Grid>
            </Grid>
            </div><Divider />
            </Paper> 
            <div>
                <ul>
                    {array.map(item => (
                        <div key={item.member_id}>
                            <Paper style={{alignItems:"center",marginTop:"0px"}}>
                            <div style={{display: "inline-block",marginLeft: "50px",width: "200px",overflow: "hidden"}}>{item.email}</div>
                        <div style={{display: "inline-block",marginLeft: "50px",width:"100px",overflow: "hidden"}}>
                    {item.access} </div>
                    <div style={{display: "inline-block",marginLeft: "50px",width:"100px",overflow: "hidden"}}>
                    {(item.ownership === null || item.ownership === "" || item.ownership === undefined) ?"":item.ownership}
                    </div>
                        <Divider/>
                            </Paper>

                        </div>
                    ))}
                </ul>
            </div>
            </div></div>
        </div> )
    )  
    )
}






    