import React from "react";
import { Button } from "@mui/material";

const ExportCSVButton = ({
  fetchAllData,   // async function to fetch all data
  headers,        // array of header strings
  rowMapper,      // function: (row) => array of cell values
  fileName = "export.csv",
  buttonProps = {},
  onError,
}) => {
  const handleExport = async () => {
    let allData = [];
    try {
      allData = await fetchAllData();
    } catch (err) {
      if (onError) onError(err);
      return;
    }
    if (!allData || !allData.length) return;

    const csvRows = [
      headers.join(","),
      ...allData.map(row => rowMapper(row).map(cell => `"${cell}"`).join(",")),
    ];
    const csvContent = csvRows.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outlined" color="primary" size="small" onClick={handleExport} {...buttonProps}>
      Export CSV
    </Button>
  );
};

export default ExportCSVButton;