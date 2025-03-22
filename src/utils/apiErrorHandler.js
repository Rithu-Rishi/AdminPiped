export const handleApiError = (error, setAlertMessage) => {
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      const firstMessage = Object.values(validationErrors);
      setAlertMessage({ open: true, type: "error", message: firstMessage });
    } else if (error.response?.status === 500) {
      setAlertMessage({ open: true, type: "error", message: "Server error. Try again later." });
    } else {
      setAlertMessage({ open: true, type: "error", message: error.message || "Unexpected error occurred." });
    }
  };
  