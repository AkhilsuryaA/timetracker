import React, {useState, useEffect} from "react";
import { Button, Dialog,TextField,DialogActions,DialogContentText,List, ListItem, Paper, Chip } from "@material-ui/core";
import { DialogContent, DialogTitle,Grid,Divider,makeStyles } from "@material-ui/core";
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import decode from "jwt-decode"
import SideBar from "../utils/sidebar";
import "../CSS Styles/csssidebar.css";
import axios from "axios";
import {useSelector} from "react-redux";
import UnAuthorized from "../subPages/unAuth";
import {SpinnerElement} from "../utils/spinner";

const img = process.env.PUBLIC_URL +"sysImg/seabg.jpg";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    //justifyContent: 'center',
    marginTop:"5px",
    marginLeft:"40px",
    flexWrap: 'wrap',
    //padding: theme.spacing(0.5),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));


function ClientPage() {

  const classes = useStyles();

  const uiData = useSelector(state=>state.userReducer);
  const worksp = useSelector(state => state.WorkspaceReducer.workspace);
  const privs = useSelector(state => state.PrivsReducer);
  const [state,setState] = useState("");
  useEffect(() => {
    setLoading(false);
    clientList();
},[state]);

    const [open, setOpen] = React.useState(false);
    const [clientObj, setValues] = useState({ client: "" });
    const [clientArr, setArr] = useState([]);
    const [authStatus,setAuthStat] = useState(false);
    const [loading,setLoading] = useState(true);
    const handleClickOpen = () => {
      setOpen(true);
    }

    const updateField = e => {
      setValues({...clientObj,
        [e.target.name]: e.target.value
      });
      
    };

    const addItem = () => {
      if(clientObj.client === "") {
        return alert("fields cannot be empty");
      }

      let url = "/api/user/client";
      let data = [];
      data[0] = clientObj.client;
      data[1] = uiData.uid;
      data[2] = privs.workspace_id;
      
      axios.post(url, data,{ headers: {"Authorization" : `Bearer ${uiData.token}`} })
      .then(res => {
        console.log(res);
        if(res.data.ok === true) {
          setState(res.data);
        }
        else alert("something happened in adding")
      })
      .catch(err =>  {
        if(err.response.status === 403)
        { setAuthStat(true);
        }
        console.log(err)
      });
        
      setOpen(false);
      setValues({ client:"" });
      
    };
  
    const clientList = () => {
      
      console.log(privs);
      let url = "/api/user/client/list";
      let data = [];
      data[0] = uiData.uid;
      data[1] = privs.workspace_id;
      console.log(data);
      axios.post(url,data,{ headers: {"Authorization" : `Bearer ${uiData.token}`} })
      .then(res => {
        
        if(res.data.error === false) {
        let arr = res.data.res;
        console.log(arr);
        setArr(arr);
        }
        else alert("something happened in list")
      })
      .catch(err => {
        if(err.response.status === 403)
        { setAuthStat(true);
        }
        console.log(err)
      });
    };
    
    const handleClose = () => {
      setOpen(false);
    };

    

    return ( (authStatus === true)? <UnAuthorized /> : ( (loading === true) ? ( <SpinnerElement /> ) :
        (
          <div id="App" style={ {height:"100%",width:"100%", backgroundImage: `url(${img})`,
        backgroundPosition:"center",position:"fixed" }}>            
        <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
        <div id="page-wrap" >
        <div >
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={7} style={{marginLeft:"100px"}}><h2>Client</h2></Grid>
                        <Grid item sm={2}> 
                        <Button variant="contained" color="secondary" onClick={handleClickOpen} startIcon={<CreateNewFolderIcon/>} size="small">
                New Client
              </Button>
            </Grid>  {<Grid item sm={1}>{uiData.email}</Grid>}
                    </Grid><Divider/> 
                </div>
                <div style={{marginLeft:"40px"}}><Paper style={{marginTop:"20px"}}>
                <div style={{marginLeft:"65px"}}>
                  <Grid container spacing={1} alignItems="center">
                  <Grid style={{width:"250px"}}><h3>Client</h3></Grid>
                </Grid>
                </div>
                </Paper>
                </div> 
                
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth={"xs"}>
                <DialogTitle id="form-dialog-title">Create Client</DialogTitle>
                <DialogContent>
                  <form onSubmit={addItem}>
                  
                  <TextField name="client" autoFocus margin="dense" id="client" label="Client Name" value={clientObj.client}
                  type="text" fullWidth variant="filled" onChange={updateField}/>
                  </form>
                </DialogContent>   
                  <Button onClick={addItem} color="secondary" variant="contained">
                    Create
                  </Button>
              </Dialog>
                              
                <Paper className={classes.root}>
                  {clientArr.map(item => ( <Chip key={item.id} variant="outlined" 
                  color="secondary" label={item.client}
                  className={classes.chip}
                  > </Chip>))}
                </Paper></div></div>
        )
            )
          
      );
  }

export default ClientPage;
