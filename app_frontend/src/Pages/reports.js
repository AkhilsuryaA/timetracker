import React, {useState,useEffect,useRef} from "react";
import axios from "axios";
import decode from "jwt-decode";
import {Grid, Button,Divider, Paper, TextField, InputAdornment, Dialog, DialogContent, DialogTitle, List, ListItem} from "@material-ui/core";
import SideBar from "../utils/sidebar";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {MuiPickersUtilsProvider,
    KeyboardDatePicker,
    } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { Line, Bar, Pie, Doughnut, defaults } from 'react-chartjs-2';
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import originalMoment from "moment";
import { extendMoment } from "moment-range";
import {useSelector} from "react-redux";
import UnAuthorized from "../subPages/unAuth";
import { makeStyles } from '@material-ui/core/styles';
import {SpinnerElement} from "../utils/spinner";
import { NavLink } from "react-router-dom";

const moment = extendMoment(originalMoment); 
const img = process.env.PUBLIC_URL +"sysImg/seabg.jpg";
const today = moment();

const height = window.innerHeight;

export default function Reports() {

    const uiData = useSelector(state=>state.userReducer);
    const worksp = useSelector(state => state.WorkspaceReducer.workspace);
    const chart = useRef(null);
    const [displayReport, setDisplayReport] = useState([]);
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const months = [{month:"January",pos:1}, {month:"February",pos:2}, {month:"March",pos:3}, {month:"April",pos:4}, {month:"May",pos:5},{month:"June",pos:6},
    {month:"July",pos:7},{month:"August",pos:8}, {month:"September",pos:9}, {month:"October",pos:10}, {month:"November",pos:11}, {month:"December",pos:12}];
    
    const [array,setArray] = useState([]);
    const [reportHeight,setHeight] = useState(height - 500)
    const [open, setOpen] = useState(false);
    const [state,setState] = useState({
        isOpen: false,
        value: moment.range(today.clone().subtract(7, "days"), today.clone())
      });
      const styles = makeStyles(theme => ({
        div1:{
            display: "inline-block",marginLeft: "50px",width:"200px",overflow: "hidden",marginTop:"10px",marginBottom:"10px"
        },
        div2:{
            display: "inline-block",marginLeft: "50px",width:"200px",overflow: "hidden",marginTop:"10px",marginBottom:"10px"
        }
    }))
    const [loading,setLoading] = useState(true);
    const [allTime, setAllTime] = useState([]);
    const [projInMonth, setProj] = useState([]);
    const [openD, setDOpen] = useState(false)
    const [authStatus,setAuthStat] = useState(false);
    
    useEffect(() => {
        setLoading(false);
        userList();
        getAllReport();
        return function Cleanup () {
            setLoading(false);
        }
    },[]);

    
    const userLoginDetails = {
        token:uiData.token,
        email:uiData.email,
        uid:uiData.uid
    }

    const onSelect = (value, states) => {
        setState({ value, states });
        getAllReport(value);
      };
      
    const renderSelectionValue = () => {
        let val1,val2;
         val1 = state.value.start.format("YYYY-MM-DD");
         val2 = state.value.end.format("YYYY-MM-DD");
       
        return (
          <div>
            <div style={{marginTop:"20px",alignItems:"center"}}></div>
            {val1} {" - "} {val2}
          </div>
        );
      };  

    const handleDateChange = (e,date) => {
        console.log("date= " + date);
        setSelectedDate(date);
    };
    


    const handleClose = () => {
        setOpen(false);
      };

    const userList = () => {
        
        let url = "/api/list";
        let data = [];
        
        data[0] = userLoginDetails.uid;
  
        axios.post(url, data,{ headers: {"Authorization" : `Bearer ${userLoginDetails.token}`} })
        .then(response => {
          //console.log(response.data.data);
        })
        .catch(err =>  {
            if(err.response.status === 403)
            { setAuthStat(true);
            }
            console.log(err)
          }); 
       
      }

    /** get all times enteres betweeen the two dates and update the display reports and graph*/
    
    const getAllReport = (value) => {
        setProj("");
        setAllTime("");
        let dd1,dd2;
        //console.log(value);
        if(value === undefined) {
            dd1 = state.value.start._d;
            dd2 = state.value.end._d;
            //console.log(dd1,dd2," if");
        }
        else{
            dd1 = value.start._d;
            dd2 = value.end._d;
            //console.log(dd1,dd2," else");
        }
        
        //console.log(moment(dd1).format("YYYY-MM-DD"));
        let start = moment(dd1).format("YYYY-MM-DD");
        let end = moment(dd2).format("YYYY-MM-DD");
       // console.log(start+" gh " + end);
        let data = [];
        
        data[0] = userLoginDetails.uid;
        data[1] = start;
        data[2] = end;
        data[3] = worksp;
        let url = "/api/user/list/allReport";
        let arr;
        axios.post(url, data,{ headers: {"Authorization" : `Bearer ${userLoginDetails.token}`} })
        .then(response => {
            //console.log("all report");
            //console.log(response.data.res)
            arr = response.data.res;
            let pp = response.data.res;
            let len = arr.length;
            console.log(arr);
            let newA = arr[len -1];
            //console.log(newA);
            if(arr.length > 0) {
                if(newA.isStop === "1") {
               
                    setDisplayReport(pp);
                    dataP(start,end);        
                    //console.log(pp);        
                }
                else {
                    arr.splice(-1,1);
                    setDisplayReport(arr);
                    dataP(start,end);        
                }
            }
            else{
                setDisplayReport([]);
            }
        })
        .catch(err =>  {
            if(err.response.status === 403)
            { setAuthStat(true);
            }
            console.log(err)
          });
}

    const nnnnnn = () => {
     
        let val1 = state.value.start;
        let val2 =  state.value.end;
        
        let val = Math.abs(moment.duration(val1.diff(val2)).asDays()) + 1;
        let dd1 = moment(val1).format('YYYY-MM-DD');
        let dd2 = moment(val2).format('YYYY-MM-DD');
        let start = moment(dd1).startOf('month');
        let end = moment(dd1).endOf('month');
        if(dd1 === moment(start).format('YYYY-MM-DD') && dd2 === moment(end).format('YYYY-MM-DD')) {
            let values = moment.range(val1.clone().add(1,"month"), val1.clone().add(1, "month").endOf("month"));
            setState({isOpen: false,
                value: moment.range(val1.clone().add(1,"month"), val1.clone().add(1, "month").endOf("month"))
            });
            //console.log(values ," values");
            getAllReport(values);
        }
        else{
            //console.log("called else")
            setState({isopen:false,
                value: moment.range( val2.clone().add(1, "days"), val2.clone().add(val, "days"), )
            })
            let values =  moment.range( val2.clone().add(1, "days"), val2.clone().add(val, "days"));
                //console.log(values ," values");
                getAllReport(values);
        }
    }

    const pppppp = () => {
        //console.log(state.value);
        //console.log("called");
        let val1 = state.value.start;
        let val2 =  state.value.end;
        let val = Math.abs(moment.duration(val1.diff(val2)).asDays()) + 1;
        //console.log("prev ",val);
        let dd1 = moment(val1).format('YYYY-MM-DD');
        let dd2 = moment(val2).format('YYYY-MM-DD');
        
        let start = moment(dd1).startOf('month');
        let end = moment(dd1).endOf('month');
        
        if(dd1 === moment(start).format('YYYY-MM-DD') && dd2 === moment(end).format('YYYY-MM-DD')) {
            //console.log("called if");
            let values = moment.range(val1.clone().subtract(1, "month"), val1.clone().subtract(1, "month").endOf("month"));
            
            setState({isOpen:false,
                    value:moment.range(val1.clone().subtract(1, "month"), val1.clone().subtract(1, "month").endOf("month"))
                })
            getAllReport(values);

        }
        else {
            //console.log("called else")
            setState({isopen:false,
                value: moment.range( val1.clone().subtract(val, "days"), val1.clone().subtract(1, "days"))
            })
            let values = moment.range( val1.clone().subtract(val, "days"), val1.clone().subtract(1, "days"));
                //console.log(values ," values");
                getAllReport(values);
        } 
        
    }

    const converse = (time) => {
        let seconds = ("0" + (Math.floor(time / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(time / 60000) % 60)).slice(-2);
        let hours = ("0" + Math.floor(time / 3600000)).slice(-2);

        return(
        <div>{hours} : {minutes} : {seconds}</div>
        )
    }

    const pad = (num) => {
        if(num < 10) {
          return "0" + num;
        } else {
          return "" + num;
        }
      }

      const data = {
  
        labels: projInMonth,
            datasets: [
                {
                    
                    label: 'Time Spent',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: "#6610f2",//'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 2,
                    pointHitRadius: 10,
                    data: allTime,
                }
            ],
            
    }; 

    const dataP = (start,end) => {
        
        //console.log(start+" dataP " + end);
        let data = [];
        
        data[0] = userLoginDetails.uid;
        data[1] = start;
        data[2] = end;
        data[3] = worksp;
        let url = "/api/dataP";
       
        axios.post(url, {data:data},{ headers: {"Authorization" : `Bearer ${userLoginDetails.token}`} })
        .then(res => {
            
            console.log(res.data.results)
            let array = res.data.results;
            setArray(array);
            if(array.length>0) {
                array.map(item => {
                setProj(projInMonth => [...projInMonth,item.project]);
                let minutes = pad(Math.floor(item.erTime/60000));
                setAllTime(allTime => [...allTime,minutes]);
            })
        }
        else{
            setProj("")
            setAllTime("");
        }
        })
        .catch(err =>  {
            if(err.response.status === 403)
            { setAuthStat(true);
            }
            console.log(err)
          });
    }  

    const handleDClick = () => {
        setDOpen(true);
    }
    const Close = () => {
        setDOpen(false);
    }

    const RenderElement = () => {
        return (
            <div id="App" style={ {height:"100%",width:"100%", backgroundImage: `url(${img})`,
        backgroundPosition:"center",position:"fixed", overflow:"auto" }}> 
        <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
        <div id="page-wrap" style={{overflowY:"auto"}}>
        <div style={{alignItems:"center"}}>
            <div style={{marginLeft:"100px",display:"inline-block",width:"700px",color:"#BAE8E7"}}>
            <h2>Report</h2>
            </div>
            <div style={{display:"inline-block",marginLeft:"20px"}}>
            <Button onClick={pppppp}><ArrowBackIosIcon/></Button>
            </div>
            <div style={{display:"inline-block",alignItems:"center"}}>
                <Button 
                onClick={handleDClick}
                //onClick={() => setOpen(true)}
                startIcon={<CalendarTodayIcon />}
                > {renderSelectionValue()}</Button> 
            </div>
            <div style={{display:"inline-block"}}>
            <Button onClick={nnnnnn}><ArrowForwardIosIcon/></Button>
            </div>
            <div style={{display:"inline-block",width:"150px"}}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around">
                            <KeyboardDatePicker 
                                disableToolbar
                                variant="inline"
                                format="yyyy/MM/dd"
                                margin="normal"
                                id="datepicker"
                                value={selectedDate}
                                onChange={handleDateChange}
                                open={open}
                                onClose={handleClose}
                                style={{display:"none"}}
                                //KeyboardDatePicker={{"aria-label" : "change date",}}
                           >
                           </KeyboardDatePicker>
                        </Grid>
                    </MuiPickersUtilsProvider>
            </div>
            
            <Divider/> 
        </div>

        <Dialog open={openD} onClose={Close} aria-labelledby="form-dialog-title" style={{
            position: 'absolute',   zIndex: 1000,top: -400,left: 360,bottom: 0,right: 0}}>                                                                        
              {/*<DialogTitle id="form-dialog-title">Unauthorised access!</DialogTitle>*/}<Divider/>
              <DialogContent><DateRangePicker
              
                    hoverRange="month"
                    ranges={[]}
                    value={state.value}
                    onSelect={onSelect}
                    singleDateRange={true}
                />     </DialogContent>
          </Dialog>

        <div style={{marginLeft:"100px",width:"1000px",height:"300px",color:"#BAE8E7"}}>
            <h2 >Bar Graph</h2>
            <Bar ref={chart} data={data} 
                width={100}
                height={150}
                options={{
                    responsive:true, maintainAspectRatio: false, legend:false, 

                    scales: {
                        yAxes: [{
                            ticks:{
                                fontColor:"#BAE8E7", fontSize:14
                            },
                          scaleLabel: {
                            display: true, labelString: 'minutes', fontColor:"#BAE8E7",fontSize:16
                          }
                        }],
                    xAxes:[{
                        ticks:{
                            fontColor:"#BAE8E7", fontSize:16
                        },
                        scaleLabel:{
                        display:true, labelString:"projects", fontColor:"#BAE8E7",fontSize:16
                        }
                    }]
                    }
                }}
            />
        </div>

    <div style={{marginTop:"50px",marginLeft:"100px",marginBottom:"20px",}}>
            <div style={{marginLeft:"50px",marginBottom:"10px",color:"#BAE8E7"}}>
            <Grid container spacing={1} alignItems="center">
            <Grid style={{width:"250px"}}><h3 >Report</h3></Grid>
            <Grid></Grid>
            </Grid>
            </div>
            <Paper style={{marginLeft:"40px",width:"1000px",}}>
                {/** <div className={styles().div1}><h5>Title</h5></div>
                <div className={styles().div2}><h5>Project</h5></div>
                <div className={styles().div2}><h5>Client</h5></div>
                <div className={styles().div2}><h5>Cloaked Time</h5></div>
                <div className={styles().div2}><h5>Set at</h5></div>*/}
                <div style={{display: "inline-block",marginLeft: "50px",width:"200px",overflow: "hidden",
                marginTop:"10px",marginBottom:"10px"}}><h5>Project Title</h5> </div>
                <div style={{display: "inline-block",marginLeft: "550px",width:"200px",overflow: "hidden",
                marginTop:"10px",marginBottom:"10px"}}><h5>Cloaked Time</h5> </div>                
            </Paper>
            
            <div style={{width:"1040px"}}><ul>
                  {array.map(item => (<div key={item.id} ><NavLink to="/projectReport">
                    <Paper style={{display:"flex",marginTop:"1px", height:"40px",alignItems:"center"}} >
                    <List style={{width:"1000px"}}>
                        <ListItem button >
                            <div style={{marginLeft:"50px",width:"500px",color:"black"}}>{item.project}</div>
                            <div style={{marginLeft:"260px",width:"250px"}}>{converse(item.erTime)}</div>
                        </ListItem>
                    </List></Paper></NavLink>
                        </div>
                  ))}
                </ul></div>
    </div>
    </div>
    </div>
        )
    }
    
    return ( (authStatus === true) ? <UnAuthorized /> : ( (loading === true) ? ( <SpinnerElement /> ): <RenderElement />
         )
    )
    
}





