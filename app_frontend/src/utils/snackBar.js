
import React from 'react';
import { Slide,Snackbar, Typography } from '@material-ui/core';

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

export default function PositionedSnackbar() {


  const [state, setState] = React.useState({
    open: true,
    vertical: 'top',
    horizontal: 'center',
    Transition:SlideTransition
  });

  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id"><Typography>Deleted Item.</Typography></span>}
      />
    </div>
  );
}


