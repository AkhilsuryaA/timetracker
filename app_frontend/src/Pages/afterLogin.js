import React from "react";
import { Grid, TextField, Paper, ListItem,Button,List, Divider, Link } from "@material-ui/core";
import {Dialog, DialogTitle, DialogContent} from "@material-ui/core";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from "axios";
import decode from "jwt-decode";
import SideBar from "../utils/sidebar";
import "../CSS Styles/csssidebar.css";
import PositionedSnackbar from "../utils/snackBar";
import LoginForm from "../Components/Loginform";
import {connect} from "react-redux";
import addUser from "../actions/actionUser"
import UnAuthorized from "../subPages/unAuth";
import {Privilage} from "../Components/privilage";
import addToTeam from "../actions/action";
import {SpinnerElement} from "../utils/spinner";
import privs from "../actions/actionPrivs";
import addWorksp from "../actions/actionWorkspace";

const img = process.env.PUBLIC_URL +"sysImg/seabg.jpg";

function mapDispatchToProps  (dispatch) {
  return { 
    addUser : (token,email,uid)=>  dispatch(addUser(token,email,uid)),
    addToTeam : (team_id) => dispatch(addToTeam(team_id)),
    privs:(ownership,workspace_id) => dispatch(privs(ownership,workspace_id)),
    addWorksp:(workspace) => dispatch(addWorksp(workspace))
  };
}



class PageAfterLogin extends React.Component {

    constructor(props){
      super(props);
      this.state = {

        isStop:1,
        textIn: "",
        listItems:[],
        newList: [],
        timerTime:  0,
        timerStart: 0,
        timerOn: false,
        projectList:[],
        lid:"",
        project: "",
        client:"",
        open:false,
        date: "",
        time: "",
        snack:0,
        newDate:"",
        deOpen:false,
        timer_id:0,
        confOpen:false,

        email:"",
        token:"",
        uid:"",

        authStatus : false,
        loading : true
        
      };
      this.onLogout =this.onLogout.bind(this);
      //this.handleListItemClick = this.handleListItemClick.bind(this);
    }
    
    snackbarRef = React.createRef();

componentDidMount = () =>{  

  let token = localStorage.getItem("myToken");
  let user = decode(token);
let uid = user.id;
let email = user.email;
this.props.addUser(token,email,uid);
  console.log(this.props.data)
  
  this.setState({ email:this.props.data.email,
                  token:this.props.data.token,
                  uid : this.props.data.uid,
                  loading:false
              });
    this.privilage(token);
    this.onPageStart();
    
  //this.userList();    
  } 
  
  privilage = (token) => {
    const uiData = decode(token);
    //console.log("called",uiData)
    let data = [];
    data[0] = uiData.id
    axios.post("/api/getUser",data,{ headers: {"Authorization" : `Bearer ${token}`} })
    .then(res => {
        //console.log(res);
        let data = res.data.data[0];
        this.props.privs(data.ownership,data.worksp_id);
        let input = [];
        input[0] = data.worksp_id;
        axios.post("/api/get/workspace",input,{ headers: {"Authorization" : `Bearer ${token}`} })
        .then(res => {
            console.log(res);
            if(res.data.ok === true) {
                this.props.addWorksp(res.data.results[0].workspace)
                //console.log(res.data.results[0].workspace);
            }
        })
        .catch(err => {
            console.log(err)
        })
    })
    .catch(err => {
        console.log(err)
    })
  }

   /*
  Privilage = () =>{

    
    
        let data = [];
        data[0] = this.state.uid
        axios.post("/api/get/workspList", data,{ headers: {"Authorization" : `Bearer ${this.state.token}`} })
        .then(res=> {
            console.log(res);
            let defaultWorksp;
            let owner;
            if(res.data.results.length > 0) {
            defaultWorksp = res.data.results[0].workspace;
            owner = this.state.email;
            let team = getTeam();
                let team_id = team.team_id;
    
                //calling reducer
            }
            else {
            owner = null;
            let team = getTeam();
                let team_id = team.team_id;
            defaultWorksp = team.work
            // calling reducer
            }
        })
    
    
        const 
      }*/
      getTeam = () => {
        //console.log(this.props.privilage," mean")
        axios.post("/api/getteam",{workspace_id:this.props.privilage.workspace_id},
         { headers: {"Authorization" : `Bearer ${this.props.data.token}`}  })
        .then(res=> {
            //console.log(res);
            if(res.data.results.length > 0) {
              this.props.addToTeam(res.data.results[0].team_id)
              //return res.data.results[0];  
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
    onPageStart = () => {
      this.getTeam();
      //Privilage();
      //document.getElementById("items").innerHTML=this.state.email;
      //console.log(this.props);
      let data = [];
      data[0] = this.props.data.uid;
      data[1] = this.props.workspace;
      let url = "/api/list";
      axios.post(url, data,{ headers: {"Authorization" : `Bearer ${this.props.data.token}`} })
      .then(response => {
        //console.log(response.data.data,"data")
        let arr = response.data.data;
        let len = arr.length;
        let lastRow = arr[len -1];
        if(lastRow !== undefined) {
        if(lastRow.isStop == 0) {

          //console.log("calld if")
          //console.log(arr,"arr");
          arr.pop();
          this.setState({  listItems:arr,
              timerStart:lastRow.timerStart,
              isStop:lastRow.isStop,
              textIn:lastRow.title,
              time:lastRow.time,
              project:lastRow.project,
              client:lastRow.client,
              date:lastRow.date.toString().slice(0, 19).replace('T', ' '),
              lid:lastRow.timer_id });

      //console.log(lastRow.title);
          this.startTimer();

          
           
        }
        else {
          //console.log("caled else1");
          this.setState({
            listItems:response.data.data,
            isStop:1,
            timerStart:0,
            timerTime:0,
            });
        }
      }
      else {
        //console.log("caled else2");
        this.setState({
          listItems:response.data.data,
          isStop:1,
          timerStart:0,
          timerTime:0,
          });
      }
      })
      .catch(err => {
        //console.log(err)
        if(err.response.status === 403) {
          this.setState({
            authStatus : true
          })
        }
        
      })
    }

    onLogout() {
      this.setState({email:""});
      localStorage.removeItem("em");
      localStorage.removeItem("myToken");
      window.location.href = '/';
    }


    userList = () => {
      
      let url = "/api/list";
      let data = [];
      let deToken = decode(localStorage.getItem("myToken"));  
      data[0] = this.state.uid;
      axios.post(url, data,{ headers: {"Authorization" : `Bearer ${this.state.token}`} })
      .then(response => {
        let arr = response.data.data;
        let len = arr.length;
        let newArr = arr[len -1];
        if(newArr.isStop == 1) {
          //console.log(arr);
          this.setState({email : deToken.email,
            listItems:arr,
            newList : this.sortRecordsByDate(arr)
          });
          this.sortRecordsByDate(arr)
        }
        else{
          arr.splice(-1,1);
          //console.log(arr);
        this.setState({email : deToken.email,
          listItems:arr,
          newList : this.sortRecordsByDate(arr)
        });
        this.sortRecordsByDate(arr)
        }
        
        })
      .catch(err => {
        if(err.response.status === 403) {
          this.setState({
            authStatus : true
          })
        }
        console.log(err)
      })
      //console.log(this.state.listItems);     
    }     
  
   startTimer = () => {

    ///......resume timer
    //console.log(this.state.isStop + " yy " + this.state.timerStart)

      if(this.state.isStop == 0 && this.state.timerStart != 0) {
        //console.log("resume timer started " + this.state.textIn);
        this.setState({
          timerOn :true,
          timerTime:Date.now() - this.state.timerStart,
          timerStart:this.state.timerStart,
          isStop:0
        });
        this.timer = setInterval(() => {
          this.setState({
            timerTime:Date.now() - this.state.timerStart
          });
        },10);
        //console.log(this.state.textIn);
        
        let url = "/api/user/timerResume";
        let data = [];
        data[0] = this.state.textIn;
        data[1] = this.state.project;
        data[2] = this.state.client;
        data[3] = this.state.timerStart;
        data[4] = this.state.email;
        data[5] = this.state.isStop;
        data[6] = this.state.date;
        data[7] = this.state.time;
        data[8] = this.state.lid;
        data[9] = this.state.uid;
        //console.log(data);
        let token = localStorage.getItem("myToken");
 
        axios.put(url, data,{ headers: {"Authorization" : `Bearer ${token}`} })
       .then(response => { 
          if(response.status === 403) {
            alert("error")
            this.setState({confOpen:true});
            //localStorage.setItem("status",403);
          }
          //localStorage.removeItem("status");
         //console.log(response.data.results)
        //console.log(this.state.lid); 
      })
       .catch(err => {
        if(err.response.status === 403) {
          this.setState({
            authStatus : true
          })
        }
        console.log(err)
      })
      } 

      //////////.........start new timer....

      else {
        let current_datetime = new Date();
        let time = `${current_datetime.getHours()}:${current_datetime.getMinutes()}:${current_datetime.getSeconds()}`;       

       let inText = this.text.value;
var dateAn = parseInt(current_datetime.getFullYear()) + "-"+ parseInt(current_datetime.getMonth()+1) +"-"+parseInt(current_datetime.getDate()) + " " + 
current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();

//console.log(dateAn);
      this.setState({
        
        timerOn :true,
        timerTime : this.state.timerStart,
        timerStart : Date.now() - this.state.timerTime,
        isStop:0,
        date:dateAn,
        time:time,
        textIn:inText       
      });  
      this.state.timerStart = Date.now() - this.state.timerTime;
      this.state.isStop = 0;
      this.state.date = dateAn;
      this.state.time = time;
      this.state.textIn = inText;
      //console.log(this.state.textIn);

       this.timer = setInterval(() => {
           this.setState({
               timerTime: Date.now() - this.state.timerStart
           });
       },10);

       let url = "/api/user/timerStart";
       let data = [];
       data[0] = this.state.textIn;
       data[1] = this.state.project;
       data[2] = this.state.client;
       data[3] = this.state.timerStart;
       data[4] = this.state.email;
       data[5] = this.state.isStop;
       data[6] = this.state.date;
       data[7] = this.state.time;
       data[8] = this.props.workspace;
      // console.log(data);
       

       axios.post(url, data,{ headers: {"Authorization" : `Bearer ${this.state.token}`} })
      .then(response => {
        //console.log(response);
        if(response.data.code === 403) {
          alert("error start timer")
          this.state.confOpen = true;
          this.setState({confOpen:true});
        }
        else{

                let arr = [];
                arr = response.data.results;
                //console.log(response.data.results);
                let lastRow = arr.pop();
                this.setState({lid:lastRow.timer_id})
        }
      
      })
      .catch(err => {
        if(err.response.status === 403) {
          this.setState({
            authStatus : true
          })
        }
        console.log(err)
      })
      }
   };


   stopTimer =() => {
    const { timerTime } = this.state;
    //let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
    let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
    let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
    let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);
    let cTime = `${hours}:${minutes}:${seconds}`;
    let inText = this.text.value;
   // console.log(cTime);

    //localStorage.setItem("isStop", true);
    //let userss = decode(token);
    //console.log(userss);
     let fields = [];
     
     this.setState({
      
      
      textIn: inText,
      timerOn:false,
      timerStart: 0,
      timerTime :0,
      isStop:1,
      email:this.state.email});
      
      this.state.isStop = 1;
            fields[0] = inText === ""?this.state.textIn:inText;
            fields[1] = this.state.project;
            fields[2] = this.state.client;
            fields[3] = this.state.timerStart;
            fields[4] = this.state.timerTime;
            fields[5] = cTime;
            fields[6] = this.state.email;
            fields[7] = this.state.isStop;
            fields[8] = this.state.date;
            fields[9] = this.state.time;
            fields[10] = this.state.lid;
            
          //console.log(fields);
            let url = "/api/user/updateTime";
            axios.put(url, fields,{ headers: {"Authorization" : `Bearer ${this.state.token}`} })
            .then(response => {
              if(response.status === 403) {
                alert("error")
                this.setState({confOpen:true});
               // localStorage.setItem("status",403);
              }
              else{
              //localStorage.removeItem("status");
              let res =[];
              res = response.data.results;
             // console.log(res);
             //console.log(res[0].timerTime);
              //this.userList();
              this.onPageStart();
              }
              
            })
            .catch(err => {
              if(err.response.status === 403) {
                this.setState({
                  authStatus : true
                })
              }
              console.log(err)
            })
        clearInterval(this.timer); 
    //localStorage.setItem("myTime",0);
    this.text.value = "";
    this.state.project = "";
    this.state.client = "";
           
   }

    handleClickOpen = () => {
      
    this.setState({open:true});
      let url = "/api/user/project/list";
      //console.log(this.state.uid);
      //console.log(this.props)
      let data = [];
      data[0] = this.state.uid;
      data[1] = this.props.privilage.workspace_id;
      data[2] = this.props.privilage.ownership;
      
      axios.post(url, data,{ headers: {"Authorization" : `Bearer ${this.state.token}`} })
      .then(res => {
        //console.log(res);
        //let cl = [];
        let arr = res.data.res;      
        /*arr.map((item) => {
          console.log(item)

        })*/ 
        this.setState({projectList : arr});
      })
      .catch(err => {
        if(err.response.status === 403) {
          this.setState({
            authStatus : true
          })
        }
        console.log(err)
      })
    };
    

handleClose = () => {
  this.setState({open:false});  
}
handleListItemClick = (value,a) => {

  this.setState({project:value,client:a});
  this.handleClose();
}

noProject = () => {
  this.setState({project:"",client:""});
  this.handleClose();
}

    sortRecordsByDate(records) {
    return records.map(record => {
        //console.log(record);
         const dateString = record.date.split('-').reverse().toString();
         const dateTimestamp = Date.parse(dateString);

         record.date = dateTimestamp;

         return record;
    }).sort((a, b) => b.date - a.date).map(record => {
        const date = new Date(record.date).toLocaleDateString('en-GB');
        record.date = date;
        //console.log(record);
        return record;
   });
};

sortRecordsByMonth(records) {
  var monthNames = {
    "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "11": 11, "12": 12 };
  records.sort(function(a,b) {
    return monthNames[a[0]] - monthNames[b[0]];
  })
}

deleteItem = () => {
  let data = [];
      let deToken = decode(localStorage.getItem("myToken"));
      data[0] = deToken.id;
      //console.log(this.state.timer_id);
      data[1] = this.state.timer_id;
      //console.log(data)
    let url = "/api/deleteItem";
      axios.delete(url, {data:{uid:this.state.uid, id:this.state.timer_id}})
      .then(response => {
        //console.log(response);
        if(response.status === 200) {
          this.deClose();
          //this.userList();
          this.onPageStart();
          this.setState({snack:200,snackDate:new Date()})
          //console.log('called snack');
        }
        else{
          alert("Something Happened");
        }
      }) 
      .catch(err => {
        if(err.response.status === 403) {
          this.setState({
            authStatus : true
          })
        }
        console.log(err)
      })

}
  deDialog = (id) => {
    //console.log(id);
    this.setState({deOpen:true,timer_id:id});
  }

   deClose = () => {
    this.setState({deOpen:false});  
   }

   confClose = () => {
     this.setState({confOpen:false});
   }

      render() {
        
        const { timerTime } = this.state;
        
        let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
        let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);
        
        return ( (this.state.authStatus === true) ? <UnAuthorized /> : ( (this.state.loading === true) ? ( <SpinnerElement /> ) :
       ( <div style={ {height:"100%",width:"100%", backgroundImage: `url(${img})`,
        backgroundPosition:"center",position:"fixed" }}>
            <div id="App">
            
          <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />

            <div id="page-wrap" style={{color: "blue"}}>
            <div>
          
          <Grid container spacing={1} alignItems="center">
          
            <Grid item sm={1}></Grid>
            <Grid item xs={6}>
          {/*<Paper className={styles.paper}>*/}
              <TextField style={{width:750,height:45}} variant="outlined" label="the text to be..." 
              inputRef={(el) => {this.text = el}}
              autoFocus
              margin="dense"></TextField>
            </Grid>
        <Grid item sm={1}>
          <Button startIcon={this.state.project === "" ?<FolderIcon />:""} style={{ position: "relative",whiteSpace:"nowrap",
                maxWidth: "100%",overflow: "hidden"}} onClick={this.handleClickOpen}>                                                                                                                                                         
                                                                                    
                                                                                    
            {this.state.project} : {this.state.client}
            </Button>
        
        </Grid>
          
            <Grid item sm={1}>   
            {hours} : {minutes} : {seconds} 
            
            </Grid>
            <Grid item sm ={1}>
          
          {this.state.timerOn === false && this.state.timerTime === 0 && (
            <Button onClick={this.startTimer} 
            style={{margin:1,color:"blue"}}size="small"  variant="contained" startIcon={<PlayArrowIcon/>}>
              START
            </Button>
          )}
          {this.state.timerOn === true && (
          <Button onClick={this.stopTimer} 
          style={{margin:1,color:"blue"}}size="small"  variant="contained" startIcon={<StopIcon/>}>
            STOP
          </Button>
          )}
          </Grid>{<Grid item sm={1}>{this.state.email}</Grid>}
          </Grid>
          <Divider/>
          
          <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Select Project</DialogTitle><Divider/>
              <DialogContent>                
                  <ListItem button onClick={this.noProject}>no project</ListItem>
                
                <ul>
                    {this.state.projectList.map(list => (
                      <List key={list.id}><div style={{backgroundColor:"powderblue"}} id="client">{list.client}</div>
                        <ListItem button onClick={() => this.handleListItemClick(list.project,list.client)}>
                          {list.project}
                        </ListItem><Divider/>
                      </List>
                    ))}
                </ul>                
              </DialogContent>
              
            </Dialog>

            <Dialog open={this.state.confOpen} onClose={this.confClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Unauthorised access!</DialogTitle><Divider/>
              <DialogContent>Login agin ?
              <Button onClick={() => this.onLogout()}> Yes </Button>  <Button onClick={this.confClose}>No</Button>  </DialogContent>
          </Dialog>
            
            
            {this.state.snack === 200?<PositionedSnackbar key={this.state.snackDate}/>:null}
          <Dialog open={this.state.deOpen} onClose={this.deClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Delete ?</DialogTitle>
              <DialogContent>   <Button onClick={this.deleteItem}>Yes</Button>  <Button onClick={this.deClose}>No</Button>  </DialogContent>
          </Dialog>
                            
          <div style={{height:"700px",overflowY:"scroll"}}>
          <ul >
            {this.state.listItems.map(its => (
              
            <div key={its.timer_id}>
              <div>
                  <Paper style={{marginTop:"8px"}}>
                   
                    <Grid container spacing={1} alignItems="center">
                      <Grid style={{marginLeft:"16px"}} item xs={10}>{its.date.slice(0,10).replace(/\-/g, "/")}</Grid>
                      <Grid item sm={1}></Grid>
                    </Grid>
                  
                    
                  <div><List  >
                      <ListItem  >
                        
                        <div style={{width:"200px",overflow: "hidden"}}>{its.title}</div>
                        <div style={{width:"200px",overflow: "hidden"}}>{its.project}</div>
                        <div style={{width:"200px",overflow: "hidden"}}>{its.client}</div>
                        <div style={{width:"200px",overflow: "hidden"}}>{its.time}</div>
                      {/* <Button onClick={() => this.deDialog(its.timer_id)}><DeleteIcon/></Button>*/}  
                        
                        <div style={{width:"640px",overflow: "hidden"}}>{its.displayTime}</div>
                         
                      </ListItem></List>    
                  </div>
                </Paper>
               </div>
            </div>))}
          </ul>
              </div>
              </div>
            </div>
          </div>
         
          </div>)
          )
        );
      }
    }

const mapStateToProps = state => {
  return {data  :state.userReducer,
          team_id : state.teamReducer,
          privilage : state.PrivsReducer,
          workspace : state.WorkspaceReducer.workspace
        }
}

const TimerPage = connect(mapStateToProps,mapDispatchToProps)(PageAfterLogin);

 class Timer extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
      status:0
     }
     
   }
   
   render() {
     return (
       <div>
         <TimerPage/>
       </div>
     )
   }
 }

 export default Timer;







