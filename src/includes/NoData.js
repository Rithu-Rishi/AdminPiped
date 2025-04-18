import React from "react";
import { Box, Typography } from "@mui/material";
import noDataImg from "../assets/images/no-data.png"; // adjust path if needed

const NoData = ({ message = "No Data Available", height = "300px" }) => {
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height={height}>
      <img src={noDataImg} alt="No Data" style={{ maxHeight: "180px", marginBottom: "10px" }} />
      <Typography variant="body2" color="textSecondary">{message}</Typography>
    </Box>
  );
};

export default NoData;