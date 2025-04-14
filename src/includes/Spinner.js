import React from "react";
import Backdrop from "@mui/material/Backdrop";
import TPPLoadingSign from "../assets/TPPLoadingSign-ezgif.com-video-to-gif-converter.gif";
const Spinner = ({ loading }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.modal + 10, background: '#ffffff82' // appear above modals
      }}
      open={loading}
    >
      <img
        src={TPPLoadingSign}
        alt="Loading..."
        style={{ width: '200px', height: '200px' }}
      />
    </Backdrop>
  );
};

export default Spinner;