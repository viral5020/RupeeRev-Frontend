import apiClient from './apiClient';

const download = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const exportCsv = async () => {
  const response = await apiClient.get('/export/csv', { responseType: 'blob' });
  download(response.data, 'transactions.csv');
};

export const exportExcel = async () => {
  const response = await apiClient.get('/export/excel', { responseType: 'blob' });
  download(response.data, 'transactions.xlsx');
};

export const exportPdf = async () => {
  const response = await apiClient.get('/export/pdf', { responseType: 'blob' });
  download(response.data, 'transactions.pdf');
};

