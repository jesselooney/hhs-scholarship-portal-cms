import * as jsonexport from "jsonexport/dist";

/**
 * Download a list of records as a CSV file.
 * @param records A list of string-keyed records.
*/
export async function downloadCSV(records: Record<string, any>[]) {
  const csv = await jsonexport(records);
  
  // Taken from https://stackoverflow.com/a/24643992
  const downloadLink = document.createElement("a");
  const blob = new Blob(["\ufeff", csv]);
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "applications.csv";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}