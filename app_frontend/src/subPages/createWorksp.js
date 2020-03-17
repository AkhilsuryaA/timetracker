import React,{useState, useEffect} from "react";
import SideBar from "../utils/sidebar";
import UnAuthorized from "../subPages/unAuth";
import {Paper, TextField,Button} from "@material-ui/core"
import {SpinnerElement} from "../utils/spinner";
import axios from "axios";
import {useSelector} from "react-redux";
import { creatingWorkspace } from "../Components/addMember";

const img = process.env.PUBLIC_URL +"sysImg/seabg.jpg";

function CreateWorksp () {

    const uiData = useSelector(state => state.userReducer)
    const [authStatus,setAuthStat] = useState(false);
    const [loading,setLoading] = useState(true);
    const [name, setName] = useState("");
    useEffect(()=>{
        setLoading(false)
    },[]);

    const onChange = (e) => {
        setName(e.target.value)
    }
    const newWorksp = () => {
        console.log(name);
        creatingWorkspace(name,uiData.token)
        setName("");
    }

    return(
        (authStatus === true)? <UnAuthorized /> : ( (loading === true) ? ( <SpinnerElement /> ) :
    (        
        <div id="App" style={ {height:"100%",width:"100%", backgroundImage: `url(${img})`,
            backgroundPosition:"center",position:"fixed" }}>            
        <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
            <div id="page-wrap" ></div>


        <div style={{marginTop:"40px",marginLeft:"400px"}}>
            <h3>Create Workspace</h3></div>
            <div style={{margintop:"80px",marginLeft:"400px"}}>
                <Paper style={{width:"900px",height:"400px"}}>
                    <div style={{marginBottom:"40px",marginLeft:"250px",paddingTop:"40px"}}>   
                        <h3>Give Name to Your Workspace</h3>
                    </div>
                    <div style={{marginLeft:"150px"}}>
                    <TextField variant="filled" style={{width:"600px"}} onChange={onChange} 
                    value={name} onSubmit={newWorksp}></TextField>
                    </div>
                <div style={{marginLeft:"250px",paddingTop:"50px"}}>
                    <Button variant="contained" style={{marginRight:"200px",width:"100px"}}>Back</Button>
                    <Button variant="contained" color="secondary" style={{width:"100px"}} onClick={newWorksp}>Create</Button>
                </div>
                </Paper>
                </div>
         
        </div>  )
        )
    )
}

export default CreateWorksp;



