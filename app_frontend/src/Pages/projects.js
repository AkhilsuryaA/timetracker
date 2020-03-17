import React, {useState, useEffect, } from "react";
import { Button, Dialog,TextField,List, ListItem, Paper,makeStyles } from "@material-ui/core";
import { DialogContent, DialogTitle,Grid,Divider } from "@material-ui/core";
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import SideBar from "../utils/sidebar";
import "../CSS Styles/csssidebar.css";
import axios from "axios";
import ProjectStatusDD from "../utils/projectStatusDD";
import ProjectPrioDD from "../utils/projectPrioDD";
import {useSelector, useDispatch} from "react-redux";
import { Link, NavLink } from "react-router-dom";
import passProj from "../actions/passProject";
import UnAuthorized from "../subPages/unAuth";
import decode from "jwt-decode";
import {SpinnerElement} from "../utils/spinner";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const useStyles = makeStyles(theme=> ({
  dialogPaper: {
    minHeight: '42vh',
    maxHeight: '42vh',
    width:"300px",
    alignItems: 'center',
    
},
}))

const img = process.env.PUBLIC_URL +"sysImg/seabg.jpg";
 function ProjectPage() {
    

  const selectedData = useSelector(state=> state.userReducer);
  const team_id = useSelector(state => state.teamReducer.team_id);
  const worksp = useSelector(state => state.WorkspaceReducer.workspace);
  const privs = useSelector(state => state.PrivsReducer);
  const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [vals, setVals] = useState({project:""});                                             
    const [client, setClient] = useState("");
    const [projectArr, setArr] = useState([]);
    const [clientList, setClientList] = useState([]);
    const [openClient, setClientOpen] = useState(false);
    const [state,setState] = useState("");
    const [authStatus,setAuthStat] = useState(false); 
    const [loading,setLoading] = useState(true);
    const [selectedOption,setOption] = useState(worksp);
    const [wpArray,setWpArray] = useState([]);
    useEffect(() => {
      workspList()
      setLoading(false);
      projectList();
    },[worksp,state]);

    const userLoginDetails = {
      token:selectedData.token,
      email:selectedData.email,
      uid:selectedData.uid,
    };

    const classes = useStyles();

    const updateVals = e => {
      setVals({...vals,
        [e.target.name]:e.target.value });
      //console.log(project);
    };
    
    const workspList = () => {
      let data =[];
      data[0] = userLoginDetails.uid;
      axios.post("/api/get/workspList", data,{ headers: {"Authorization" : `Bearer ${userLoginDetails.token}`} })
      .then(res => {
          //console.log(res)
          setWpArray(res.data.results);
      })
      .catch(err => {
          console.log(err)
      })
  }

    const addItem = () => {
      console.log(selectedOption)
      console.log(team_id," add");
      if(vals.project === "" || selectedOption === "" || client === "") {
        return alert("fields cannot be empty");
      }
      let url = "/api/user/project";
      let data = [];
      data[0] = vals.project;
      data[1] = selectedOption;
      data[2] = client;
      data[3] = userLoginDetails.email;
      data[4] = privs.workspace_id;
      console.log(data );
      axios.post(url, data,{ headers: {"Authorization" : `Bearer ${userLoginDetails.token}`} })
      .then(res => {
        console.log(res);
        if(res.data.ok === true) {
          console.log(res.data.results.insertId)

          let input = [];
          input[0] = res.data.results.insertId;
          input[1] = userLoginDetails.uid;
          input[2] = team_id;
          input[3] = "manager";
          input[4] = userLoginDetails.email;
          console.log(input)
          let url1 = "/api/user/projmember";
          axios.post(url1, input, { headers : {"Authorization" : `Bearer ${userLoginDetails.token}`} })
          .then(response => { console.log(response)})
          .catch(error => {
            if(error.response.status === 403)
        { setAuthStat(true);
        }
            console.log(error)})
          console.log(team_id);
          //alert(" project added successfully");
          setState(res.data);
        }
        else alert("something happened in adding")
      })
      .catch(err => {
        if(err.response.status === 403)
        { setAuthStat(true);
        }
        console.log(err)
      });
      setOpen(false);
      setVals({project:"",
    workspace:""})
      //setWork("");
      setClient("");
    };

    
    const projectList = () => {
      console.log(privs);
       let url = "/api/user/project/list";
       let data = [];
       data[0] = selectedData.uid;
       data[1] = privs.workspace_id;
       data[2] = privs.ownership;
       console.log(data);
      axios.post(url,data,{ headers: {"Authorization" : `Bearer ${userLoginDetails.token}`} })
      .then(res => {
        console.log(res);
        if(res.data.error === false) {
          console.log(res);
          let arr = res.data.res;
          setArr(arr);
        }
        else { alert("something happened in list");
        
      }
      })
      .catch(err => {
        if(err.response.status === 403)
        { setAuthStat(true);
        }
        console.log(err)
      });
    };

    const WorkspaceSelector = () => {
      const handleSelect = (eventKey, event) => {
        //console.log(arr);
        setOption(wpArray[eventKey].workspace);
        console.log(wpArray[eventKey])
      }

      return (
        <div className="select_option" >
            
            <DropdownButton
                    overflow="true"
                    drop='right'
                    title={selectedOption}
                    id="document-type"
                    size="lg"
                    variant="outline-secondary"
                    onSelect={handleSelect}
                >
                {wpArray.map((map,i) => (
                    <Dropdown.Item key={i} eventKey={i}>
                        {map.workspace}
                    </Dropdown.Item>
                ))}
                
            </DropdownButton>
        </div>  
    )
    }

    const handleClickOpen = () => {
      
      setOpen(true);
  }

    const handleClose = () => {
     
      setOpen(false);
    };

  const  handleClickClientOpen = () => {
    
      setClientOpen(true);
      
        let url = "/api/user/client/list";
        let data = [];
      data[0] = userLoginDetails.uid;
      data[1] = privs.workspace_id;
        axios.post(url, data,{ headers: {"Authorization" : `Bearer ${userLoginDetails.token}`} })
        .then(res => {         
          let arr = res.data.res;    
          setClientList(arr);       
        })
        .catch(err =>{
          if(err.response.status === 403)
        { setAuthStat(true);
        }
          console.log(err)
          
        });
      };      

const  handleClientClose = () => {
    setClientOpen(false);  
  }

const  handleListItemClick = value => {
    console.log(value);
    setClient(value);
    handleClientClose();
  }

const  noClient = () => {
    setClient("");
    handleClientClose();
  }  
 const ClickProject = (item) => {
   
console.log("shee",item);
dispatch(passProj(item));
 }


    return (  (authStatus === true)? <UnAuthorized /> : ( (loading === true) ? ( <SpinnerElement /> ) :
        (
          <div id="App" style={ {height:"100%",width:"100%", backgroundImage: `url(${img})`,
    backgroundPosition:"center",position:"fixed" }}>
      <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
      <div id="page-wrap" >
        <div >
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={7} style={{marginLeft:"100px"}}><h2>Project</h2></Grid>
              <Grid item sm={2}> 
                <Button variant="contained" color="secondary" onClick={handleClickOpen} startIcon={<CreateNewFolderIcon/>} size="small">
                  New Project
                </Button>
              </Grid>    {<Grid item sm={1}>{userLoginDetails.email}</Grid>}
          </Grid> <Divider/>
              </div>
              <div style={{marginLeft:"38px"}}><Paper style={{marginTop:"20px"}}>
              <div style={{marginLeft:"65px"}}>
                <Grid container spacing={1} alignItems="center">
                <Grid style={{width:"500px"}}><h3>Project</h3></Grid>
                <Grid style={{width:"250px"}}><h3>Workspace</h3></Grid>
                <Grid style={{width:"250px"}}><h3>Client</h3></Grid>
                <Grid style={{width:"200px"}}><h3>Status</h3></Grid>
                <Grid style={{width:"200px"}}><h3>Priority</h3></Grid>
              </Grid>
              </div>
              </Paper>
              </div>
                </div>
              <Dialog classes={{paper:classes.dialogPaper}} open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth>
              <DialogTitle id="form-dialog-title">Create Project</DialogTitle>
              <DialogContent>
                <form onSubmit={addItem} style={{alignItems:"center"}}>
                <TextField name="project" autoFocus  id="project" label="Project Name" variant="outlined" 
                value={vals.project} type="text" style={{width:"218px"}}  onChange={updateVals}/>
                
                <div style={{marginTop:"10px",width:"218px"}}>
                <WorkspaceSelector/>
                </div>
                
                <TextField id="standard-read-only-input" label="Client Name" variant="outlined"
                value={client}  onClick={handleClickClientOpen } style={{marginTop:"10px",width:"218px"}}
                   InputProps={{ readOnly: true, }}  />
                </form>
              </DialogContent>
              <Button onClick={addItem} color="secondary" fullWidth variant="contained" style={{marginTop:"10px"}}>
                  Create
                </Button></Dialog>

            <Dialog open={openClient} onClose={handleClientClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Select Client</DialogTitle><Divider/>
                <DialogContent>                
                  <ListItem button onClick={noClient}>no client</ListItem>                
                <ul>
                    {clientList.map(list => (
                      <List key={list.id}>
                        <ListItem button onClick={() => handleListItemClick(list.client)}>
                          {list.client}
                        </ListItem>
                      </List>
                    ))}
                </ul></DialogContent>
            </Dialog>

              <div><ul>
                  {projectArr.map(item => (<div key={item.id} ><NavLink to={{pathname:"/eachProject",data:item}} >
                    <Paper style={{display:"flex",marginTop:"1px", height:"40px",alignItems:"center"}} >
                    <List  style={{marginLeft:"50px"}} >
                      <ListItem button onClick={() => ClickProject(item)}>
                        <div style={{width:"500px",color:"black"}}>{item.project}</div>
                        <div style={{width:"250px"}}>{item.workspace}</div>
                        <div style={{width:"250px"}}>{item.client}</div>
                        <div style={{width:"200px"}}>status  </div>
                        <div style={{width:"200px"}}>priority  </div>
                      </ListItem>
                    </List></Paper></NavLink>
                      </div>
                  ))}
                </ul></div>
                
                </div>
        )
            )
          
      );
}

export default ProjectPage;