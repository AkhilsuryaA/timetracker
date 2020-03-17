
import React, {Component} from "react";
import axios from "axios";

  async  function apicall(method, url, data){
            console.log("api called");
            if (method === "GET") {
                console.log("get print");
                axios.get(url,data)
                //.then(response => response.json())
                .then(response => {
                console.log(response.data);
                return response.data;
                })
                .catch(err => {
                    console.log(err);
                });
            }
        if (method === "POST") {
            console.log("post print");
            axios.post(url,data,{headers: {
                'Authorization': 'our token from local storage',
                'Content-Type': 'application/x-www-form-urlencoded'
            }})
            .then(response => {    
                console.log(response.data);    
                return response;
            })
            .catch(err => {
                console.log(err);
            });
        }
        }

export default apicall;






