import React, { useEffect, useState } from "react";

import { Snackbar as MaterialUiSnackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

const Snackbar = (props) => {
  const [text, setText] = useState(props.text);
  const [isSnackVisible, setIsSnackVisible] = useState(false);

  useEffect(() => {
    setText(props.text);
    setIsSnackVisible(true)
  }, [props.text])

  //call on error message close
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsSnackVisible(false);
    setText('');

    if (props.onHide) {
      props.onHide();
    }
  };

  return (
    isSnackVisible ? (
      <MaterialUiSnackbar
        open={Boolean(text)}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseAlert}
          severity="info"
        >
          {text}
        </MuiAlert>
      </MaterialUiSnackbar>
    ) : (<></>)
  );
};

export default Snackbar;
