import React, { useEffect, useState } from "react";
import SideBar from "../utils/sidebar";
import "../CSS Styles/csssidebar.css";
import { Container, TextField,Divider, Dialog,Button,DialogContent,DialogTitle, Avatar,Paper } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import decode from "jwt-decode";
import EditIcon from '@material-ui/icons/Edit';
import {useSelector} from "react-redux";
import UnAuthorized from "../subPages/unAuth";
import {SpinnerElement} from "../utils/spinner";

const img = process.env.PUBLIC_URL +"sysImg/seabg.jpg";

const Styles =  makeStyles(theme => ({
    div:{
    marginLeft:"-100px",
    width:"800px",
    height:"60px",
    marginTop: "10px",
    display: 'inline-block',
    alignItems: 'center',
    marginBottom:"10px",
    
    },
    large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
   }
}));

export default function ProfilePage() {
    
    const uiData = useSelector(state=> state.userReducer);
    const [array, setArray] = useState([]);
    
    const [Details, setDetails] = useState({name:"",address:"",email:"",ps:"",ph:""});
    const [open,setOpen] = useState(false);
    const [openAd,setOpenAd] = useState(false);
    const [openEm,setOpenEm] = useState(false);
    const [openPs,setOpenPs] = useState(false);
    const [openPh,setOpenPh] = useState(false);
    const [openImg,setOpenImg] = useState(false);
    const [state,setState] = useState({file:null,fileName:null});
    const [authStatus,setAuthStat] = useState(false);
    const [val,setVal] = useState(); 
    const [nnn,setNnn] = useState({fName:"",lName:""})
    const [password,setPassword] = useState({curPass : "", newPass : "", confPass : ""});
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        setLoading(false)
        apiCall();
       
    },[]);
    const userLoginDetails = {
        token:uiData.token,
        email:uiData.email,
        uid:uiData.uid 
    }
    
    let name,arr;
    const classes = Styles();

    const apiCall = () => {
        let data = [];
        
        data[0] = userLoginDetails.uid;
        let url1 = "/api/getUser";
        axios.post(url1, data,{ headers: {"Authorization" : `Bearer ${userLoginDetails.token}`} })
        .then(response => {
            console.log(response.data.data)
            setArray(response.data.data);
            setValues(response.data.data);
        })
        .catch(err => {
            if(err.response.status === 403)
        { setAuthStat(true);
        }
            console.log(err)
        })
    }

    const setValues = (data) => {
        
        console.log(data[0].fName);
        setDetails({name:data[0].fName + " " + data[0].lName,
                    address:data[0].address,
                    email:data[0].email,
                    ps:"**********",
                    ph:data[0].phno
                })
                setState({fileName:data[0].image});
    }

    const handleChange =(e) => {
     setDetails({...Details,
    [e.target.name]:e.target.value })   
    setVal(e.target.name);
    }

    const passwordChange = (e) => {
        setPassword({...password,
        [e.target.name] : e.target.value
        })
    }

    const handleNChange = (e) => {
        setNnn({...nnn,
        [e.target.name]:e.target.value})
        setVal(e.target.name);
    }

    const imgClick = () => {
        setOpenImg(true);
    }
    const nameClick = () => {
        
        setOpen(true);
        setNnn({fName:array[0].fName,lName:array[0].lName})
        
    }


    const adClick = () => {
        setOpenAd(true);
       
    }
    const emClick = () => {
        setOpenEm(true);
    
    }
    const psClick = () => {
        setOpenPs(true);
       
       
    }
    const phClick = () => {
        setOpenPh(true);
        
        
    }

    const CloseImg = () => {
        setOpenImg(false);
    }

    const Close = () => {
        setOpen(false);
    }
    const CloseAd = () => {
        setOpenAd(false);
    }
    const CloseEm = () => {
        setOpenEm(false);
    }
    const ClosePs = () => {
        setOpenPs(false);
    }
    const ClosePh = () => {
        setOpenPh(false);
    }


    const update = () => {
        
        let data = [];
        let end;
        data[0] = userLoginDetails.uid;
        console.log("called")
        console.log(val);
        if(val === "fName" || val==="lName") {
            data[1] =nnn.fName;
            data[2] = nnn.lName;
            end = "name";
        }
        if(val === "address") {
            data[1] =Details.address;
            end = "address"; 
        }
        if(val === "email") {
            data[1] =Details.email;
            end="email";

        }
        if(val === "ph") {
            data[1] =Details.ph;
            end="ph"; 
        }
        console.log(data);
        let url = "/api/editProfile/" + end;
        console.log(url);

        axios.put(url, data,{ headers: {"Authorization" : `Bearer ${userLoginDetails.token}`} })
        .then(res => {
            console.log(res)
        })
        .catch(err =>     {
            if(err.response.status === 403)
        { setAuthStat(true);
        }
            console.log(err)
        })
        
    }

    const updatePass = () => {
        console.log("calledd",password.curPass,password.newPass,password.confPass)
       
        if(password.curPass ==="" || password.newPass === "" || password.confPass === "") {
            document.getElementById("newPsEr").innerHTML = "Please fill all columns";
        }
        else {
            if(password.newPass === password.confPass) {
                let data = [];
                data[0] = userLoginDetails.uid;
                data[1] = password.curPass;
                data[2] = password.newPass;
                data[3] = userLoginDetails.email;
                let url = "/api/editProfile/changePassword";
                axios.post(url, data,{headers : {'Authorization' : `Bearer ${userLoginDetails.token}`}})
                .then(res => {
                    console.log(res)
                    if(res.data.code === 200) {
                        ClosePs();
                    }
                    else if(res.data.code === 204) {
                        document.getElementById("curPsEr").innerHTML = "Passwords doesn't match";
                    }
                })
                .catch(err => {
                    if(err.response.status === 403)
                    { setAuthStat(true);
                    }
                        console.log(err)
                    })
            }
            else {
                console.log("called else");
                
                document.getElementById("newPsEr").innerHTML = "password doesn't match"
            }
        }
    }

    const onSubmit = (e) => {
     console.log("called submoit")
        e.preventDefault();
        const formData = new FormData();
        console.log(state.file);
        arr = state.file.name.split('.');
        console.log(arr.length);
        let len = arr.length;
        name = "uid" + userLoginDetails.uid + "." + arr[len - 1];
        console.log(name);
        
        formData.append('myImage',state.file,name);
        formData.append("user_id",userLoginDetails.uid);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                "Authorization" : `Bearer ${userLoginDetails.token}`
            }
        };
        console.log(formData)
        axios.post("/api/upload",formData,config)
            .then((response) => {
               // alert("The file is successfully uploaded");
               console.log("added"); 
               console.log(response);
               if(response.status === 200) {
                let ff = response.data.results.filename;
                setState({fileName:ff})
               setOpenImg(false);
               }
              
            }).catch((error) => {    if(error.response.status === 403)
                { setAuthStat(true);
                }
                    console.log(error)
                });
        
    }

    const onChange = (e) => {
        
        setState({file: e.target.files[0]});
    }

    return( (authStatus === true)? <UnAuthorized /> : ( (loading === true) ? ( <SpinnerElement /> ) :
    (
        <div id="App" style={ {height:"100%",width:"100%", backgroundImage: `url(${img})`,
        backgroundPosition:"center",position:"fixed" }}>
            <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
            <div id="page-wrap" >
            <div >
                </div>
                </div>
                <div>
                    <div style={{marginTop:"80px",marginLeft:"700px"}}><h3>Personal Info</h3></div>
                    <div style={{marginTop:"10px"}}>

                    <div>
                        <Paper style={{margin:"0px", marginRight:"375px",marginLeft:"375px"}}>
                            <div style={{alignItems:"center",marginTop:"20px"}}>
                                <div style={{display:"inline-block",width:"150px",marginLeft:"50px"}}>An Image   </div>
                                <div style={{display:"inline-block",width:"500px"}}></div>
                                <div style={{display:"inline-block",width:"60px",marginTop:"20px"}}> <Avatar onClick={imgClick}                                 
                                src={ state.fileName === null ? "":process.env.PUBLIC_URL+"uploads/" + state.fileName} 
                                className={classes.large} /></div>
                            </div><Divider/>
                            <div style={{alignItems:"center",marginTop:"40px"}}>
                                <div style={{display:"inline-block",width:"150px",marginLeft:"50px"}}>Name  </div>   
                                <div style={{display:"inline-block",width:"500px"}}>{Details.name}</div> 
                                    
                                <div style={{display:"inline-block",width:"25px"}} role="button" onClick={nameClick}><EditIcon/></div>
                            </div><Divider/>
                            <div style={{alignItems:"center",marginTop:"40px"}}>
                                <div style={{display:"inline-block",width:"150px",marginLeft:"50px"}}>Address</div>
                                <div style={{display:"inline-block",width:"500px"}}>{Details.address}</div>
                                <div style={{display:"inline-block",width:"25px"}} role="button" onClick={adClick}><EditIcon /></div>
                            </div><Divider/>
                            <div style={{alignItems:"center",marginTop:"40px"}}>
                                <div style={{display:"inline-block",width:"150px",marginLeft:"50px"}}>Password</div>
                                <div style={{display:"inline-block",width:"500px"}} >{Details.ps}</div>
                                <div style={{display:"inline-block",width:"25px"}} role="button" onClick={psClick}><EditIcon/> </div>
                            </div><Divider/>
                            <div style={{alignItems:"center",marginTop:"40px"}}>
                                <div style={{display:"inline-block",width:"150px",marginLeft:"50px"}}> Email  </div>
                                <div style={{display:"inline-block",width:"500px"}}>{Details.email}</div>
                                <div style={{display:"inline-block",width:"25px"}} role="button" onClick={emClick}><EditIcon/> </div>
                            </div><Divider/>
                            <div style={{alignItems:"center",marginTop:"40px"}}>
                                <div style={{display:"inline-block",width:"150px",marginLeft:"50px"}}>Phone No  </div>
                                <div style={{display:"inline-block",width:"500px"}}>{Details.ph}</div>
                                <div style={{display:"inline-block",width:"25px",marginBottom:"20px"}} role="button" onClick={phClick}>
                                    <EditIcon/> </div>
                                </div>
                        </Paper>
                    </div>
                    </div>
                    
                    <Dialog open={open} onClose={Close} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Name</DialogTitle><Divider/>
                <DialogContent>
                    <form>
                    <TextField name="fName" value={nnn.fName} fullWidth onChange={handleNChange}></TextField>
                    <TextField name="lName" value={nnn.lName} fullWidth onChange={handleNChange}></TextField>
                    </form>
                
                <Button onClick={update}> Yes </Button>  <Button onClick={Close}>No</Button>  </DialogContent>
            </Dialog>

                    <Dialog open={openAd} onClose={CloseAd} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Address</DialogTitle><Divider/>
                <DialogContent>
                <TextField name="address" value={Details.address} onChange={handleChange}></TextField>
                <Button onClick={update}> Yes </Button>  <Button onClick={Close}>No</Button>  </DialogContent>
            </Dialog>
            
                    <Dialog open={openEm} onClose={CloseEm} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Email</DialogTitle><Divider/>
                <DialogContent>
                <TextField name="email" value={Details.email} onChange={handleChange}></TextField>
                <Button onClick={update}> Yes </Button>  <Button onClick={Close}>No</Button>  </DialogContent>
            </Dialog>
            
                    <Dialog open={openPs} onClose={ClosePs} aria-labelledby="form-dialog-title"  maxWidth={"xs"}>
                <DialogTitle id="form-dialog-title">Change Password</DialogTitle><Divider/>
                <DialogContent>
                <TextField type="password" name="curPass" label="current password" onChange={passwordChange} fullWidth style={{marginTop:"10px"}}></TextField>
                    <div style={{color:"red"}} id="curPsEr"></div>
                <TextField type="password" name="newPass" label="new password" fullWidth style={{marginTop:"10px"}} onChange={passwordChange}> </TextField>
                <TextField type="password" name="confPass" label="confirm password" fullWidth style={{marginTop:"10px"}} onChange={passwordChange}></TextField>
                <div style={{color:"red"}} id="newPsEr"></div>
                  </DialogContent><Button onClick={updatePass}> Yes </Button>
            </Dialog>
            
                    <Dialog open={openPh} onClose={ClosePh} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Phone</DialogTitle><Divider/>
                <DialogContent>
                <TextField name="ph" value={Details.ph} onChange={handleChange}></TextField>
                <Button onClick={update}> Yes </Button>  <Button onClick={Close}>No</Button>  </DialogContent>
            </Dialog>
                    <Dialog open={openImg} onClose={CloseImg} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Select Your Profile Picture</DialogTitle><Divider/>
                <DialogContent>
                <h1>File Upload</h1>
                <input type="file" name="myImage" onChange= {onChange}/>
                <Button onClick={onSubmit}>Upload</Button>
                </DialogContent>
            </Dialog>

                    
            </div>
        </div>  )
    )
    )

}











