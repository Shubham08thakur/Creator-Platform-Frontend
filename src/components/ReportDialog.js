import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { reportContent } from '../services/reportService';

const ReportDialog = ({ open, handleClose, contentId }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const reasonOptions = [
    { value: 'spam', label: 'Spam' },
    { value: 'inappropriate', label: 'Inappropriate Content' },
    { value: 'offensive', label: 'Offensive Language' },
    { value: 'misinformation', label: 'Misinformation' },
    { value: 'copyright', label: 'Copyright Violation' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async () => {
    if (!reason) {
      setError('Please select a reason for reporting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await reportContent(contentId, { reason, details });
      setSuccess(true);
      // Reset form after success
      setReason('');
      setDetails('');
      // Close dialog after a delay
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Report Content</DialogTitle>
      <DialogContent>
        {success ? (
          <Alert severity="success" sx={{ my: 2 }}>
            Thank you for your report. We will review it shortly.
          </Alert>
        ) : (
          <>
            <DialogContentText sx={{ mb: 2 }}>
              Please tell us why you're reporting this content. Your report will be sent to our moderation team for review.
            </DialogContentText>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <FormControl fullWidth margin="normal" required>
              <InputLabel id="report-reason-label">Reason</InputLabel>
              <Select
                labelId="report-reason-label"
                id="report-reason"
                value={reason}
                label="Reason"
                onChange={(e) => setReason(e.target.value)}
              >
                {reasonOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              id="report-details"
              label="Additional Details"
              placeholder="Please provide any additional information that might help in our review"
              multiline
              rows={4}
              fullWidth
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      {!success && (
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Report'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ReportDialog; 