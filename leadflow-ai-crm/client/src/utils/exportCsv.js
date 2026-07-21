/**
 * Downloads a Blob response as a CSV file in browser
 */
export const downloadCsvBlob = (blobData, filename = 'leadflow_export.csv') => {
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};
