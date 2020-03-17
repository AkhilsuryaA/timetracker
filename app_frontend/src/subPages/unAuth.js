
import React from  "react";


const img = process.env.PUBLIC_URL +"sysImg/unauthlock.png";
const loader = () => {
    console.log("called");
    localStorage.removeItem("em");
        localStorage.removeItem("myToken");
        window.location.href = '/';
}
const UnAuthorized = () => {

    return (
        <div style={ {height:"100%",width:"100%", backgroundImage: `url(${img})`,
                    backgroundPosition:"center",position:"fixed" }}>
            <div style={{marginLeft:"650px",marginTop:"150px", fontFamily:"Fixed, monospace", color:"primary",
                        fontSize:"large", fontWeight:"bold",display:"flex"}}>
                <h3 style={{marginRight:"10px",color:"DODGERBLUE", fontWeight:"bold"}}> Login again ?  </h3>
                <button className="btn btn-md btn-primary"  onClick={loader}> Yes  !!!    </button>  
            </div>
        </div>
    )           
}

export default UnAuthorized;


