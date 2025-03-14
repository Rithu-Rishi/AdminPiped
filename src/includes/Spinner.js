import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Spinner = ({ loading }) => {
  if (!loading) return null;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50px">
      <CircularProgress />
    </Box>
  );
};

export default Spinner;