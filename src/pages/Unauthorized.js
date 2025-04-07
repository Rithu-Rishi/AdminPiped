import React from 'react';
import { Typography } from '@mui/material';

const Unauthorized = () => {
  return (
    <div className="text-center mt-5">
      <Typography variant="h4" color="error">Access Denied</Typography>
      <Typography variant="body1">You do not have permission to view this page.</Typography>
    </div>
  );
};

export default Unauthorized;