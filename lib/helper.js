function formatDate(dateStr) {
  if (dateStr) {
    return new Date(dateStr).toISOString().split('T')[0];}
  }
  export { formatDate };