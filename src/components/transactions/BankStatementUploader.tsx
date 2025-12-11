import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Stack,
  Paper,
  Chip,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import apiClient from '../../services/apiClient';
import { useSnackbar } from 'notistack';
import { formatCurrency } from '../../utils/format';
import BankStatementAnalysisResults from './BankStatementAnalysisResults';
import { useAuth } from '../../context/AuthContext';

interface AnalysisResult {
  summary: {
    totalImported: number;
    dateRange: { start: string; end: string };
    totalIncome: number;
    totalExpenses: number;
    avgMonthlyIncome: number;
    avgMonthlyExpense: number;
  };
  categories: Array<{ name: string; total: number; count: number }>;
  subscriptions: Array<{ merchant: string; amount: number; frequency: string }>;
  salaryDetected: number | null;
  monthlyAverages: Array<{ month: string; income: number; expense: number; surplus: number }>;
  spendingSpikes: Array<{ month: string; amount: number; category: string }>;
  updatedSurplus: number;
  updatedSavingsRate: number;
  goalImpact: Array<{ goalId: string; goalName: string; newSip: number; oldSip: number }>;
}

interface BankStatementUploaderProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onDataRefresh?: () => void;
}

const BankStatementUploader: React.FC<BankStatementUploaderProps> = ({ open, onClose, onSuccess, onDataRefresh }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { user, refreshUser } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const pdfFiles = Array.from(e.target.files).filter((f) => f.type === 'application/pdf');
      setFiles(pdfFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      enqueueSnackbar('Please select at least one PDF file', { variant: 'warning' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('pdfs', file));

    try {
      const response = await apiClient.post<{
        success: boolean;
        data: { import: { imported: number; duplicates: number; errors: number }; analysis: AnalysisResult };
      }>('/bank-statement/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAnalysis(response.data.data.analysis);
      enqueueSnackbar(`Successfully imported ${response.data.data.import.imported} transactions`, {
        variant: 'success',
      });

      // Refresh user data to update token balance
      await refreshUser();

      if (onSuccess) onSuccess();
      if (onDataRefresh) onDataRefresh(); // Trigger data refresh in parent component
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Upload failed', { variant: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFiles([]);
    setAnalysis(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>📄 Upload Bank Statement PDF</DialogTitle>
      <DialogContent>
        {!analysis ? (
          <Stack spacing={3}>
            <Box>
              <input
                accept="application/pdf"
                style={{ display: 'none' }}
                id="pdf-upload"
                type="file"
                multiple
                onChange={handleFileSelect}
              />
              <label htmlFor="pdf-upload">
                <Button variant="outlined" component="span" startIcon={<UploadFileIcon />} fullWidth>
                  Select PDF Files (Multiple allowed)
                </Button>
              </label>
            </Box>

            {files.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Selected files:
                </Typography>
                <Stack spacing={1}>
                  {files.map((file, idx) => (
                    <Chip key={idx} label={file.name} onDelete={() => setFiles(files.filter((_, i) => i !== idx))} />
                  ))}
                </Stack>
              </Box>
            )}

            {uploading && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  Processing PDF files...
                </Typography>
                <LinearProgress />
              </Box>
            )}

            {/* Available Uploads Display */}
            {user && (
              <Alert severity="info" icon={<span>📄</span>}>
                <Typography variant="body2" fontWeight={600}>
                  You have {(() => {
                    let available = user.tokenBalance;
                    if (user.isPremium) {
                      const monthlyUsed = user.monthlyPdfUploads?.count || 0;
                      available += Math.max(0, 5 - monthlyUsed);
                    }
                    return available;
                  })()} PDF upload{(() => {
                    let available = user.tokenBalance;
                    if (user.isPremium) {
                      const monthlyUsed = user.monthlyPdfUploads?.count || 0;
                      available += Math.max(0, 5 - monthlyUsed);
                    }
                    return available !== 1 ? 's' : '';
                  })()} left
                </Typography>
              </Alert>
            )}

            <Alert severity="info">
              Supported: Bank statement PDFs (1 month to 5 years). The system will extract transactions, categorize
              them, and update your financial insights automatically.
            </Alert>
          </Stack>
        ) : (
          <Stack spacing={3}>
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                ✅ Successfully Imported!
              </Typography>
              <Typography variant="body2">
                We have processed {analysis.summary.totalImported} transactions from your statement.
              </Typography>
            </Alert>

            <Box sx={{ bgcolor: '#f0f9ff', p: 3, borderRadius: 2, border: '1px solid #bae6fd' }}>
              <Typography variant="h6" gutterBottom color="#0369a1" fontWeight={600}>
                💡 Tips for Better Insights
              </Typography>
              <Stack spacing={2}>
                <Box display="flex" gap={1.5} alignItems="flex-start">
                  <span style={{ fontSize: '1.2rem' }}>💰</span>
                  <Typography variant="body2" color="#0c4a6e">
                    <strong>Update Monthly Income:</strong> For the most accurate financial advice, please verify and update your monthly income in the AI Insights panel.
                  </Typography>
                </Box>
                <Box display="flex" gap={1.5} alignItems="flex-start">
                  <span style={{ fontSize: '1.2rem' }}>➕</span>
                  <Typography variant="body2" color="#0c4a6e">
                    <strong>Add Missing Transactions:</strong> If you notice any cash transactions or missing entries, you can add them manually to complete your financial picture.
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        )}

        {analysis && <BankStatementAnalysisResults analysis={analysis} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{analysis ? 'Close' : 'Cancel'}</Button>
        {!analysis && (
          <Button onClick={handleUpload} variant="contained" disabled={files.length === 0 || uploading}>
            Upload & Analyze
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BankStatementUploader;
