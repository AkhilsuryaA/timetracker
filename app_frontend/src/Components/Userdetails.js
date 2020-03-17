import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {Typography,TextField,CssBaseline,FormControl,FormLabel,RadioGroup,FormControlLabel,Radio,Button} from "@material-ui/core";
import {MuiPickersUtilsProvider, KeyboardDatePicker, } from "@material-ui/pickers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apicall from "./Callapi";
import Timer from "../Pages/afterLogin";
import decode from "jwt-decode";
import axios from "axios";
import { creatingWorkspace, member } from "./addMember";
import {connect} from "react-redux"

//......styles

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
      },
      formControl: {
        margin: theme.spacing(3),
      },
      form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
      },submit: {
        margin: theme.spacing(3, 0, 2),
      },
  }));

const mapStateToProps = state => {
    
    console.log("statae ",state);
  return {  team_id:state.teamReducer.team_id,
            privilage: state.PrivsReducer}
  }

class UserDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: "",
            number: "",
            company: "",
            email2: "",
            dob: new Date(),
            gender: "female",
            state: "",
            country : "",
            pin : "",


            addErr : false,
            numErr : false,
            comErr : false,
            emErr : false,
            dobErr : false,
            stErr : false,
            coErr : false,
            pinErr : false,

            addErText : "",
            numErText : "",
            comErText : "",
            emErText : "",
            dobErText : "",
            stErText : "",
            coErText : "",
            pinErText : "",

            
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
        
        this.validate = this.validate.bind(this);
        
    }
    
    componentDidMount = () => {
        console.log("teamid ",this.props);
    }

    creatingTeam = () => {

        let workspace_id = this.props.privilage.workspace_id;
        let token = localStorage.getItem("myToken");
        let user = decode(token);
    let uid = user.id;
    let email1 = user.email;
    let email = email1[0].length === 1?email1:email1[0];
        console.log("team creation works");
        let arr = email.split('@');
        let name = arr[0] + "'s workspace";
       
        if(workspace_id === "" || workspace_id === undefined || workspace_id === null) {
            creatingWorkspace(name,token);
        } 

        else {
            console.log("join team");
            member(workspace_id)
            
        } 
    }
    
    handleChange(e){
        e.preventDefault();
        console.log(this.state)
        //this.setState({ [name]: event.target.value });
        //console.log(event.target.value);
        this.state.address = this.address.value;
        this.state.number = this.number.value;
        this.state.company = this.company.value;
        this.state.email2 = this.email.value;
        this.state.state = this.state.value;
        this.state.country = this.country.value;
        this.state.pin = this.pin.value;
        
        
        console.log(this.state.dob + this.state.address + this.state.number + this.state.company  + this.state.email2 +
             this.state.pin + this.state.gender + this.state.country + this.state.state);
       
             this.validate();
        let details = [];
        let deToken = decode(localStorage.getItem("myToken"));
        console.log(deToken.id);
        details[0] = this.state.address;
        details[1] = this.state.number;
        details[2] = this.state.company;
        details[3] = this.state.email2;
        details[4] = this.state.dob;
        details[5] = this.state.gender;
        details[6] = this.state.state;
        details[7] = this.state.country;
        details[8] = this.state.pin;
        details[9] = deToken.id;
        console.log(`${this.state.addErr} ${this.state.numErr} ${this.state.comErr} ${this.state.emErr} ${this.state.dobErr} 
        ${this.state.stErr} ${this.state.coErr} ${this.state.pinErr} `);
        if(this.state.addErr === false) {
            if(this.state.numErr === false) {
                if(this.state.comErr === false) {
                    if(this.state.emErr === false) {
                        if(this.state.dobErr === false) {
                            if(this.state.stErr === false) {
                                if(this.state.coErr === false) {
                                    if(this.state.pinErr === false) {
                                        let token = localStorage.getItem("myToken");
                                        console.log("api called");
                                        let url = "/api/user/details";
                                        axios.put(url, details,{ headers: {"Authorization" : `Bearer ${token}`} })
                                        .then(res => {
                                            console.log(res);
                                            if(res.data.ok === true) {
                                                this.creatingTeam();
                                                updateState();
                                            }
                                            
                                        })
                                        .catch(err=>{
                                            console.log(err);
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        this.address.value = "";
        this.number.value = "";
        this.company.value = "";
        this.email.value = "";
        this.state.value = "";
        this.country.value = "";
        this.pin.value = "";
        };
     
        handleRadio(e) {
          e.preventDefault();
          this.state.gender = e.target.value;
          this.setState({gender : e.target.value});
          console.log(this.state.gender);
        }

        handleDateChange = date => {
            console.log(date);
            this.setState({
            dob: date
            });
            this.state.dob = date;
        };
      
        validate() {
          
console.log("called");
console.log(this.state.address + " address");
          if(this.state.address === "") {
              console.log("error");
              this.setState({addErr : true})
              this.state.addErText = "The field cannot be empty";
          }
          else {
            this.state.addErr = false;
            this.state.addErText = null;
          }
          if (this.state.number === "") {
            console.log("error");
            this.setState({numErr : true});
            this.state.numErText = "The field cannot be empty";
          }
          else {
            this.state.numErr = false;
            this.state.numErText = null;
          } 
          if (this.state.company === "") {
            console.log("error");
            this.setState({comErr : true});
            this.state.comErText = "The field cannot be empty";
        }
        else {
            this.state.comErr = false;
            this.state.comErText = null;
        }
        if (this.state.email2 === "") {
            console.log("error");
            this.setState({emErr : true});
            this.state.emErText = "The field cannot be empty";
        }
        else {
            if ((this.state.email2).match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                
                //this.state.emailIsValid = true;
                this.setState({emErr : false});
                this.state.emErr = false;
                this.state.emErText = null;
            } else {
                console.log("error");
              this.state.emErr = true;
                this.state.emErText = "Email is not valid";
            }
        }
        if (this.state.dob === "" || this.state.dob === undefined) {
            console.log("error");
            this.setState({dobErr : true});
            this.state.dobErr = true;
            this.state.dobErText = "The field cannot be empty";
        }
        else {this.setState({dobErr : false});
            this.state.dobErr = false;
            this.state.dobErText = null;
            console.log(this.state.dobErr," else dob")
        }
        if (this.state.state === "") {
            console.log("error");
            this.setState({stErr : true});
            this.state.stErText = "The field cannot be empty";
        }
        else {
            this.state.stErr = false;
            this.state.stErText = null;
        }
        if (this.state.country === "") {
            console.log("error");
            this.setState({coErr : true});
            this.state.coErText = "The field cannot be empty";
        }
        else {
            this.state.coErr = false;
            this.state.coErText = null;
        }
        if (this.state.pin === "") {
            console.log("error");
            this.setState({pinErr : true});
            this.state.pinErText = "The field cannot be empty";
        }
        else {
            this.state.pinErr = false;
            this.state.pinErText = null;
        }
          
      }
    
      
    render() {
        
        return (
                <div style={
                {  marginLeft:"100px",
                  marginTop: "60px",
                  display: 'flex',
                  flexDirection: 'column',}
                  }>
                <div style={{marginLeft:"300px"}}>
                    <h3>Details</h3>
                </div>
                
                <div>
                    <div style={{marginLeft:"300px"}}>
                        <form noValidate onSubmit={this.handleChange}>
                            <div style={{width:"800px"}}>
                            <TextField
                                inputRef={(el) => {this.address = el}}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                type="text"
                                id="address"
                                label="Residence"
                                name="address"
                                autoComplete="address"
                                autoFocus
                                error={this.state.addErr}
                                helperText ={this.state.addErText}
                                />
                            </div>
                            <div style={{width:"800px"}}>
                            <TextField
                        inputRef={(el) => {this.number = el}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type="number"
                        id="phone"
                        name="number"
                        label="Phone Number"
                        autoComplete="Number"
                        autoFocus
                        error={this.state.numErr}
                        helperText ={this.state.numErText}
                        
                    />
                            </div>
                            <div style={{width:"800px"}}>
                            <TextField
                    inputRef={(el) => {this.company = el}}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type="text"
                        id="company"
                        name="company"
                        label="Company Name"
                        autoComplete="company"
                        autoFocus       
                        error={this.state.comErr}
                        helperText ={this.state.comErText} 
                    />
                            </div>
                            <div style={{width:"800px"}}>
                            <TextField
                            inputRef={(el) => {this.email = el}}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                type="email"
                                id="email"
                                name="dob"
                                label="Alternate Email"
                                autoComplete="Email"
                                autoFocus 
                                error={this.state.emErr}
                                helperText ={this.state.emErText}     
                            />
                            </div>
                            <div style={{width:"800px"}}>
                                <div style={{width:"300px",display:"inline-block"}}>
                                <TextField
                                inputRef={(el) => {this.country = el}}
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    type="country"
                                    id="country"
                                    name="country"
                                    label="Country"
                                    autoComplete="country"
                                    autoFocus 
                                    error={this.state.emErr}
                                    helperText ={this.state.emErText}     
                                />
                                </div>
                                <div style={{width:"200px",display:"inline-block"}}>
                                <FormControl component="fieldset" className={useStyles.formControl}>
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup aria-label="gender" name="gender" value={this.state.gender} onChange={this.handleRadio}>
                                <FormControlLabel
                                    
                                    value="female"
                                    control={<Radio color="primary" />}
                                    label="Female"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    
                                    value="male"
                                    control={<Radio color="primary" />}
                                    label="Male"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    
                                    value="other"
                                    control={<Radio color="primary" />}
                                    label="Other"
                                    labelPlacement="start"
                                />
                                </RadioGroup>
                                </FormControl>
                                </div>
                                <div style={{width:"300px",display:"inline-block"}}>
                                <TextField
                                inputRef={(el) => {this.pin = el}}
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    type="number"
                                    id="pin"
                                    name="pincode"
                                    label="Pin Code"
                                    autoComplete="pin"
                                    autoFocus 
                                    error={this.state.emErr}
                                    helperText ={this.state.emErText}     
                                />
                                </div>
                                
                            </div>
                            <div style={{width:"800px"}}>
                                <div style={{width:"200px",display:"inline-block"}}>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={this.state.dob}
                                    onChange={this.handleDateChange}
                                    />
                                </div>
                                
                                <div style={{width:"300px",display:"inline-block",marginLeft:"300px"}}>
                                <Button
                                type="submit"
                                onSubmit={this.handleChange}
                                fullWidth
                                align="center"
                                variant="contained"
                                color="primary"
                                className={useStyles.submit} >
                                    Submit...
                                </Button>
                                </div>
                            </div>
                            <div></div>
                        </form>
                    </div>
                </div>
                
                </div>
        );
    }
}

function updateState() {
    this.setState({isCompleted:true})
}

const InputDetail = connect(mapStateToProps)(UserDetail)

class Completed extends React.Component {

    constructor() {
        super() 
        this.state = {
            isCompleted: false
        }
        updateState = updateState.bind(this);
    }  

    render(){
        
    return (
      
        <div>
          { 
            (this.state.isCompleted) ?  <Timer /> : <InputDetail />         
          }
        </div>
      )}
}


export default Completed;