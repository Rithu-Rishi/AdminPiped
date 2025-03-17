export const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle null or empty values
  
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };