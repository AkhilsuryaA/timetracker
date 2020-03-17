
import React,{useState} from "react";
import axios from "axios"
import decode from "jwt-decode"
import privs from "../actions/actionPrivs";
import {connect} from "react-redux";

function mapDispatchToProps (dispatch) {
    return {
        privs:(ownership,workspace_id) => dispatch(privs(ownership,workspace_id))
    }
}

const PrivFunction = (token) => {


    
    const uiData = decode(token);
    console.log("called",uiData)
    let data = [];
    data[0] = uiData.id
    axios.post("/api/getUser",data,{ headers: {"Authorization" : `Bearer ${token}`} })
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err)
    })


    const getTeam = () => {
        axios.post("/api/getteam",uiData.email,{ headers: {"Authorization" : `Bearer ${token}`} })
        .then(res=> {
            console.log(res);
            if(res.data.results.length > 0) {
              return res.data.results[0];  
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

}


let Privilage = connect(null,mapDispatchToProps)(PrivFunction);

