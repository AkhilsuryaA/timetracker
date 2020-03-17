
import React from "react";
import decode from "jwt-decode";
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import Timer from "../Pages/afterLogin";
import "../CSS Styles/login.css";
import { Link } from "react-router-dom";
// screen after login

const generator = require('generate-password');

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    padding : "10px",
    margin: theme.spacing(1),
    color: '#fff',
    backgroundColor: green[500],
    
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ErrorValidationLabel = ({ txtLbl }) => (
  <label htmlFor="" style={{ color: "red" }}>
      {txtLbl}
  </label>
);

class LoginForm extends React.Component {


  constructor (props) {
    super(props);
      this.state = {
        email: "",
        password: "",
        email_error_text: null,
        password_error_text: null,
        emailIsValid : false,
        passwordIsValid : false,
        errorEm : false,
        errorPs : false,
        invalidLogin:false
      };
      this.loginData = this.loginData.bind(this);
      this.prepareLoginButton = this.prepareLoginButton.bind(this);
      
  }

  componentDidMount() {

    
    this.googleSDK();
  }

  prepareLoginButton = () => {
    console.log("clicked")
    this.auth2.attachClickHandler(this.refs.example, {},
        (googleUser) => {

 
        let profile = googleUser.getBasicProfile();
        let token = googleUser.getAuthResponse().id_token;
        
        localStorage.setItem("myToken", token);
        let email = profile.getEmail();

        axios.post("/api/checkEmail",{email})
        .then(res =>{
          console.log(res)
          if(res.data.data.length === 0) {
            console.log(0);
            
            let name = profile.getName();
            /*let imgurl = profile.getImageUrl();
            let id = profile.getId();
            console.log('Token || ' + googleUser.getAuthResponse().id_token);
            console.log('ID: ' + profile.getId());
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail());
            */
            let data = [];
            let arr = name.split(/ (.*)/);
            let password = generator.generate({
              length: 10, numbers: true
            });
            data[0] = arr[0];
            data[1] = arr[1];
            data[2] = email;
            data[3] = password;
            axios.post("/api/user/signup",data)
            .then(res => {
              console.log(res);
              
            })
            .catch(err => {
              console.log(err);
            })
          }
          else{

            axios.post("/api/googleLogin",{email})
            .then(res => {
              console.log(res)
              if(res.status === 200) {
                localStorage.setItem("myToken",res.data.token);
                localStorage.setItem("em",email);
                updateState(email);
              }
              
            })
            .catch(err => {
              console.log(err);
            })
            
          }
        })
        .catch(err => {
          console.log(err);
        })

        
       /* let data = [];
        data[0] = email;
        axios.post("/user/google",data)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err);
        })*/
               
        }, (error) => {
          console.log(JSON.stringify(error, undefined, 2))
           // alert(JSON.stringify(error, undefined, 2));
        });
 
    }

    //........the api  used is mine from google plus 

  googleSDK = () => {
 
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '549840178971-4rorhmr2plc3n780da536saf2hq65ab6.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.prepareLoginButton();
      });
    }
 
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
 
  }



isDisabled() {

        if (this.state.email === "") {
          this.state.errorEm = true;
          this.state.email_error_text = "field cannot be empty";
        } else {
            if ((this.state.email).match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
                this.state.emailIsValid = true;
                this.state.errorEm = false;
                this.setState({
                    email_error_text: null
                });
            } else {
              this.state.errorEm = true;
                this.setState({
                    email_error_text: "Sorry, this is not a valid email"
                });
            }
        }       
        console.log(this.state.emailIsValid,this.state.email_error_text);

        if (this.state.password === "") {
          this.state.errorPs = true;
            this.setState({
                password_error_text: "field cannot be empty"
            });
        } else {
            if (this.state.password.length >= 6) {
              this.state.errorPs = false;
              console.log(this.state.password.length);
              this.state.passwordIsValid = true;
                this.setState({
                    password_error_text: null
                });
            } else {
              this.state.errorPs = true;
                this.setState({
                    password_error_text: "Your password must be at least 6 characters"
                });
            }
        }

        console.log(this.state.passwordIsValid,this.state.password_error_text);
    }

    handleChange= (event) => {
      this.setState({
        [event.target.name]: event.target.value
    });
    }


   loginData=(e)=> {

    console.log(this.state.email,this.state.password);
    let inputData = [];
    inputData[0] = this.state.email;
    inputData[1] = this.state.password;
    console.log(inputData);
    this.isDisabled();
     if(this.state.emailIsValid === true && this.state.passwordIsValid === true) {
      console.log("post print");
      axios.post("/api/user/signin", inputData)
      .then(response => {
          console.log(response.data.code);
          if(response.data.code === 200) {
            let tt = response.data.token;
            localStorage.setItem("myToken",tt);
            
            localStorage.setItem("em",this.state.email);
            
            updateState(this.state.email);

          }
          else {
            //alert("password or email is invalid")
            this.setState({invalidLogin : true});
          }
          
      })
      .catch(err => {
          console.log(err);
      });

     }
     
   

  };
  render() {

    const renderEmailValidationError = this.state.emailIsValid ?  "" : <ErrorValidationLabel txtLbl={this.state.email_error_text} />;
    const renderPasswordValidationError = this.state.passwordIsValid ? "" : <ErrorValidationLabel txtLbl={this.state.password_error_text} />;
    const renderInvalidLogin =   this.state.invalidLogin ? <ErrorValidationLabel txtLbl={" * Invalid Email or Password "}/>:"" ;

    return (
      
        
      
      <div>
        {/**<!-- Optional JavaScript -->
          <!-- jQuery first, then Popper.js, then Bootstrap JS --> */} 
          
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
          
          <link href="https://fonts.googleapis.com/css?family=Quicksand:400,500,600,700&display=swap" rel="stylesheet"/>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" 
                integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"/>
          <link rel="stylesheet" href="../CSS Styles/login.css" />

          <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" 
          integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossOrigin="anonymous"></script>
          
          <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" 
          integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"></script>
          
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" 
          integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossOrigin="anonymous"></script>

          <div class="main-wrapper" style={{marginTop:"80px"}}>
              <div class="content-container">
                  <div class="l-section  d-flex justify-content-center align-items-center">
                      <div class="max-380 text-center py-4">
                          <img src="../loginImg/white-logo.png" alt=""/>
                          <p class="mt-4 text-white">
                              Lorem Ipsum is simply dummy text of the printing
                              and typesetting industry. Lorem Ipsum has been 
                              the industry's standard dummy 
                              text ever since the 1500s,
                              <br/><br/>
                              when an unknown printer took a galley 
                              of type and scrambled it to make a type 
                              specimen book. It has survived not only 
                              five centuries.
                          </p>
                      </div>
                  </div>
                  <div class="r-section d-flex justify-content-center">
                      <div class="max-380 text-center py-4">
                          <p class="font-weight-bolder text-secondary">WELCOME TO </p>
                          <img src="../loginImg/logo.png" class="mb-3"  alt="" />
                          <p class="text-dark mt-3 mb-4">Login to get in the moment updates on the things
                              that intrest you
                          </p>
                          <div class="input-group flex-nowrap icon-group mb-3">
                              <div class="input-group-prepend">
                              <span class="input-group-text">
                                  <img src="../loginImg/user-icon.png" alt=""/>
                              </span>
                              </div>
                              <input type="text" class="form-control" placeholder="Username" name="email" onChange={this.handleChange}
                                      aria-label="Username" aria-describedby="addon-wrapping" required/>
                          </div> {renderEmailValidationError}
                          <div class="input-group flex-nowrap icon-group mb-4">
                              <div class="input-group-prepend">
                              <span class="input-group-text">
                                  <img src="../loginImg/lock-icon.png" alt=""/>
                              </span>
                              </div>
                              <input type="password" class="form-control" placeholder="Password" name="password" onChange={this.handleChange} 
                                      aria-label="Username" aria-describedby="addon-wrapping" required/>
                          </div>{renderPasswordValidationError}   {renderInvalidLogin}
                          <button type="submit" class="btn btn-round-attr" onClick={this.loginData}>LOGIN NOW</button>
                          <p class="font-weight-bolder text-secondary mt-3">Don’t have an account ? <Link class="text-pink " to="/signupForm">Sign UP Now</Link> </p>
                          <div class="d-flex align-items-center w-75 m-auto">
                              <i class="border-top w-100 my-2"></i><b class="mx-3 text-secondary">Or</b><i class="border-top w-100 my-2"></i>
                          </div>
                          <p class="font-weight-bolder text-secondary mt-3">Continue with social media</p>
                          <div class="text-center"><img src="../loginImg/social-logotwo.png" alt=""/>&nbsp;&nbsp;
                           <img src="../loginImg/googleicon.png" alt="" onClick={this.prepareLoginButton} ref="example"></img> 
                          </div>
                      </div>
                      

                  </div>
              </div>
          </div>
          </div>
    );
  };
}

function updateState(user){
  this.setState({user})
  console.log(user, "update state");
}

class App_Timer extends React.Component {

  
  constructor(props) { 
    super(props)

    this.state = {
      user :null
    }
    updateState = updateState.bind(this);

  }

  render() {
    let lem = localStorage.getItem("em");
    if(lem){
      this.state.user =lem;
    }
    else localStorage.removeItem("em");

    return (
      
      <div>
        { 
          (this.state.user) ? 
            <Timer 

            />
          :
            <LoginForm 
             
            />
        }
        
      </div>
    )
    
  }
}

export default App_Timer;



