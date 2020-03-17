import React from "react";




class Logout extends React.Component {

    onLogout() {
       
        localStorage.removeItem("em");
        localStorage.removeItem("myToken");
        window.location.href = '/';
      }

      render() {
         return( this.onLogout());
      }
}
export default Logout;



