import React,{useState,useEffect} from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import axios from "axios";
import {useSelector,useDispatch} from "react-redux";
import {Button} from "@material-ui/core"
import AddIcon from '@material-ui/icons/Add';
import { NavLink } from "react-router-dom";
import addWorksp from "../actions/actionWorkspace";
import privs from "../actions/actionPrivs";
import addToTeam from "../actions/action";

const variance = ["light", "primary", "warning", "success","info","danger", "secondary" ];

function WorkspaceButton ()  {  

    const [arr,setArr] = useState([]);
    const uiData = useSelector(state => state.userReducer);
    const worksp = useSelector(state => state.WorkspaceReducer.workspace);
    const dispatch = useDispatch();
    useEffect(()=> {
        //console.log("1")
        workspList()
    },[]);
    //console.log("2")
    const [selectedOption,setOption] = useState(worksp);

    const workspList = () => {
        let data =[];
        data[0] = uiData.uid;
        axios.post("/api/get/workspList", data,{ headers: {"Authorization" : `Bearer ${uiData.token}`} })
        .then(res => {
            //console.log(res)
            setArr(res.data.results);
        })
        .catch(err => {
            console.log(err)
        })
    }
   
    const handleSelect = (eventKey, event) => {
        //console.log(arr);
        setOption(arr[eventKey].workspace);
        //console.log(arr[eventKey])
        let tid = [];
        tid[0] = arr[eventKey].team_id;
        dispatch(addToTeam(tid[0]));
        axios.post("/api/getmembers",tid,{headers:{"Authorization" : `Bearer ${uiData.token}`}})
        .then(res => {
            //console.log(res.data.results)
            if(res.data.ok === true) {

                let members = res.data.results;
                members.map(item => {
                    if(uiData.uid === item.user_id) {
                        dispatch(privs(item.access,arr[eventKey].id))
                        
                        let input = [];
                        input[0] = item.access;
                        input[1] = arr[eventKey].id;
                        input[2] = uiData.uid
                        axios.put("/api/update/privilage",input,{ headers: {"Authorization" : `Bearer ${uiData.token}`} })
                        .then(res => {
                            //console.log(res)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    }
                })
                dispatch(addWorksp(arr[eventKey].workspace))
            }
        })
        .catch(err => {
            console.log(err)
        })

        
    }
    
    return (
        <div className="select_option">
            <DropdownButton
                    overflow="true"
                    drop='right'
                    style={{width:"200px"}}
                    title={selectedOption}
                    id="document-type"
                    size="md"
                    variant="outline-secondary"
                    onSelect={handleSelect}
                >
                {arr.map((map,i) => (
                    <Dropdown.Item key={i} eventKey={i}>
                        {map.workspace}
                    </Dropdown.Item>
                ))}
                <NavLink to="/createWorkspace">
                    <Button color="primary" fullWidth startIcon={<AddIcon/>}>create</Button>
                </NavLink>
            </DropdownButton>
        </div>  
    )
}

export default WorkspaceButton;
