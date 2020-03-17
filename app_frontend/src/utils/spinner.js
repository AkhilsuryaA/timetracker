import React from "react";
import Spinner from 'react-bootstrap/Spinner';

export const SpinnerElement = () => {
    return(
    <div style={{top:"50%",left:"50%",position:"absolute"}}>
      <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
      </Spinner>
      </div> 
    )
  }


