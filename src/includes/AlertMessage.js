import React from "react";
import { Snackbar, Alert } from "@mui/material";

const AlertMessage = ({ alertMessage, setAlertMessage }) => {
  return (
    <Snackbar
      open={alertMessage.open}
      autoHideDuration={3000}
      onClose={() => setAlertMessage({ ...alertMessage, open: false })}
    >
      <Alert severity={alertMessage.type} onClose={() => setAlertMessage({ ...alertMessage, open: false })}>
        {alertMessage.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;