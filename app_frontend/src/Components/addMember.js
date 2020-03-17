
import React from "react";
import axios from "axios";
import decode from "jwt-decode";



   

    export const member = (workspace_id) => { 
        let token = localStorage.getItem("myToken");
        let user = decode(token)
        let uid = user.id;
        let email = user.email;
        let access = "member";
        
        axios.post("/api/getteam/", {workspace_id:workspace_id}, { headers: {"Authorization" : `Bearer ${token}`}})
        .then(res=> {
            console.log(res, " getteam");
            if(res.data.ok === true) {
                let data = [];
                data[0] = res.data.results[0].team_id;
                data[1] = uid;
                data[2] = email;
                data[3] = access;
                data[4] = "";
                console.log(data)
                axios.post("/api/addmember",data,{ headers: {"Authorization" : `Bearer ${token}`}})
                .then(res => {
                    console.log(res," addmember")
                    if(res.data.ok === true) {
                        let input = [];
                        input[0] = "member";
                        input[1] = workspace_id;
                        input[2] = uid;
                        console.log(input);
                        axios.put("/api/update/privilage",input,{ headers: {"Authorization" : `Bearer ${token}`} })
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })                        
            }            
        })
        .catch(err => {
                console.log(err)
        })   
    }
 
    export const creatingWorkspace = (name,token) => {  
    let user = decode(token);
    let uid = user.id;
    let email = user.email;
    
    let input = [];
    
    input[0] = name;
    input[1] = uid;
    axios.post("/api/createworkspace",input,{ headers: {"Authorization" : `Bearer ${token}`} })
    .then(res => {
        console.log(res)
        if(res.data.ok === true) {
            let data = [];    
            let workspace_id = res.data.results.insertId;
            data[0] = uid;
            data[1] = email;
            data[2] = "admin";
            data[3] = workspace_id;
            axios.post("/api/createteam", data,{ headers: {"Authorization" : `Bearer ${token}`} })
            .then(res => {
                console.log(res)
                if(res.status=== 200) {
                    let d = [];
                    d[0] = res.data.results.insertId;
                    d[1] = uid;
                    d[2] = email;
                    d[3] = "admin";
                    d[4] = "owner";
                    axios.post("/api/addmember", d,{ headers: {"Authorization" : `Bearer ${token}`} })
                    .then(res => {console.log(res)})
                    .catch(err=> {console.log(err)});
                    let input = [];
                    input[0] = res.data.results.insertId;
                    input[1] = workspace_id;
                    axios.post("/api/worksp/teamid",input,{ headers: {"Authorization" : `Bearer ${token}`} })
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }
            })
            .catch(err =>{
                console.log(err);
            })

            let input = [];
            input[0] = "owner";
            input[1] = workspace_id;
            input[2] = uid;
            console.log(input,token);
            axios.put("/api/update/privilage",input,{ headers: {"Authorization" : `Bearer ${token}`} })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
        }
    })
    .catch(err => {
        console.log(err);
    }) 
    }



