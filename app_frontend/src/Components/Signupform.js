
import React from 'react';

//import App from "./Loginform.js";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
//import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Link} from "react-router-dom";
import apicall from "./Callapi";
import UserDetail from "./Userdetails";
import axios from "axios";
import privs from '../actions/actionPrivs';
import {connect} from "react-redux";



////.......style for form.....

    const useStyles = makeStyles(theme => ({
      '@global': {
        body: {
          backgroundColor: theme.palette.common.white,
        },
      },
      paper: {
        marginTop: theme.spacing(10),
        display: 'flex',
        flexDirection: 'column',
      },
      avatar: {
        alignItems:"centre",
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
      },
      form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
      },
    }));


    function mapDispatchToProps  (dispatch) {
      console.log(dispatch);
      return { privs:(ownership,workspace_id) => dispatch(privs(ownership,workspace_id))
      };
    }

    ///////.....class signup......

    class SignUp extends React.Component {

      

      constructor(props){
        super(props);
      this.state = { 
      formFields : {  
        fname : "",
        lname : "",
        email : "",
        pass  : "",
      },
    emailValid : false,
    passwordValid: false,
    errorFn : false,
    errorLn : false,
    erroEm  : false,
    errorPs : false,
    ferrorT : "",
    lerrorT : "",
    eerrorT : "",
    perrorT : "",

    isSignupValid : false  

    }
      //this.UserData = this.UserData.bind(this);
    }

    componentDidMount() {
        let url_string = window.location.href;
          var url = new URL(url_string);
        var c = url.searchParams.get("q");
        console.log(c);
    }
    validation() {

      console.log(this.state.fname + " " + this.state.lname);

      if(this.state.fname === "") {
        console.log(this.state.fname);
        this.state.errorFn = true;
        this.state.ferrorT = "Field cannot be empty";
      }
      else{
        this.state.errorFn = false;
        this.state.ferrorT = null;
      }
        if(this.state.lname === "") {
          console.log(this.state.fname);
          this.state.errorLn = true;
          this.state.lerrorT = "Field cannot be empty";
        }
        else {
          this.state.errorLn = false;
          this.state.lerrorT = null;
        }
        if(this.state.email === "") {
          this.state.errorEm = true;
          this.state.eerrorT = "Field cannot be empty";
        }
        else {
          if ((this.state.email).match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.state.emailValid = true;
            this.state.errorEm = false;
            this.setState({
              eerrorT : null
            });
          }
          else {
            this.state.errorEm = true;
            this.setState({
              eerrorT : "this is not a valid email"
            });
          }
        }
        
        if (this.state.pass === "") {
          this.state.errorPs = true;
            this.setState({
                perrorT : "field cannot be empty"
            });
        } else {
            if (this.state.pass.length >= 6) {
              this.state.errorPs = false;
              console.log(this.state.pass.length);
              this.state.passwordValid = true;
                this.setState({
                    perrorT : null
                });
            } else {
              this.state.errorPs = true;
                this.setState({
                    perrorT : "Your password must be at least 6 characters"
                });
            }
        }

        console.log(`${this.state.errorFn} ${this.state.errorLn} ${this.state.errorEm} ${this.state.errorPs}`);

    }

    UserData(formFeilds) {
      try{

        formFeilds.preventDefault();
        console.log("coming");
        
        let fn = this.firstname.value;
        let ln = this.lastname.value;
        let em = this.username.value;
        let ps = this.password.value;
        
        this.state.fname = fn;
        this.state.lname= ln;
        this.state.email= em;
        this.state.pass  = ps;
        
        var inputdata = [];
        inputdata[0]  = this.state.fname;
        inputdata[1]  = this.state.lname;
        inputdata[2]  = this.state.email;
        inputdata[3]  = this.state.pass;
        
        this.validation();
     
       console.log(inputdata);
       if(this.state.errorFn === false) {
        if(this.state.errorLn === false) {
        if(this.state.errorEm === false) {
        if (this.state.errorPs === false) {
                console.log("post print");
                axios.post("/api/user/signup",inputdata)
                .then(response => {    
                    console.log(response.data);
                    if(response.data.ok === true) {
                      console.log(response.data.token);
                      localStorage.setItem("myToken",response.data.token);
                      console.log("yeah");
                      this.state.isSignupValid = true;
                      
                      let url_string = window.location.href;
                      var url = new URL(url_string);
                      var c = url.searchParams.get("q");
                      console.log(c);
                      if(c !== null || undefined) {
                        this.props.privs('member',c);
                      }
                      
                      SignupValid(this.state.isSignupValid);                      
                    }    
                    return response;
                })
                .catch(err => {
                    console.log(err);
                });
       }
       }
       }
      }

      
    }
  catch(err) {
    console.log(err);
  }
  this.firstname.value = "";
  this.lastname.value = "";
  this.username.value = "";
  this.password.value = "";
  }



      /////........render form.........
        render () {
    return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div  style={
        { marginTop: "100px",
          display: 'flex',
          flexDirection: 'column',}
          }>
        <Avatar style={{
          margin: "10px",
          backgroundColor: "red",
        }} 
          >
          <LockOutlinedIcon />
          
        </Avatar>
        <Typography component="h1" variant="h5" align="center" >
          Sign up
        </Typography>
        <form onSubmit={this.UserData.bind(this)} className={useStyles.form} noValidate >
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
            <TextField
          inputRef={(el) => {this.firstname = el}}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="text"
            id="fname"
            label="First name"
            name="fname"
            autoComplete="first name"
            autoFocus
            error = {this.state.errorFn}
            helperText={this.state.ferrorT}
          />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
          inputRef={(el) => {this.lastname = el}}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="text"
            id="lname"
            label="last name"
            name="lname"
            autoComplete="last name"
            autoFocus
            error = {this.state.errorLn}
            helperText={this.state.lerrorT}
          />
            </Grid>
            <Grid item xs={12}>
            <TextField
          inputRef={(el) => {this.username = el}}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="email"
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error = {this.state.errorEm}
            helperText={this.state.eerrorT}
          />
             {/* <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                inputRef={el => {this.email = el}}
                label="Email Address"
                name="email"
                autoComplete="email"
             />*/}
            </Grid>
            <Grid item xs={12}>
            <TextField
          inputRef={(el) => {this.password = el}}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"    
            autoFocus
            error = {this.state.errorPs}
            helperText={this.state.perrorT}
          />
            </Grid>
            <Grid item xs={12}>
             { /*<FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
             />  */}
            </Grid>
          </Grid> 
          
            
            {this.state.isSignupValid ? <Link to="Userdetails" >
            <Button
            type="submit"
            onSubmit={this.UserData.bind(this)}
            fullWidth
            variant="contained"
            color="primary"
            className={useStyles.submit} 
          >Sign Up 
          </Button>
          </Link>
          :
          <Button
            type="submit"
            onSubmit={this.UserData.bind(this)}
            fullWidth
            variant="contained"
            color="primary"
            className={useStyles.submit} 
          >Sign Up
          </Button>}
          
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/Loginform" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
    }

    let SignupForm = connect(null,mapDispatchToProps)(SignUp);
    function SignupValid(valid){
      this.setState({valid})
      console.log(valid, "valid signup");
    }
    
      class InputUser extends React.Component {
    
      
      constructor(props) { 
        super(props)
    
        this.state = {
          valid :false
        }
        SignupValid = SignupValid.bind(this);
    
      }

      render() {
       // const loaderEl = this.state.validS? <UserDetail/> : <SignUp/>
          
        
        return (
          <div>
            {
              (this.state.valid) ? 
                <UserDetail />
              :
                <SignupForm />
            }
            
            
          </div>
        )
        
      }
    }
    

  
  export default InputUser;
  




