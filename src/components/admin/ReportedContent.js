import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Grid,
  Alert,
  Stack,
  Divider,
  Avatar,
  Fade,
  Badge
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Twitter as TwitterIcon,
  Reddit as RedditIcon,
  LinkedIn as LinkedInIcon,
  Flag as FlagIcon,
  FilterAlt as FilterAltIcon,
  Warning as WarningIcon,
  ThumbDown as ThumbDownIcon,
  Report as ReportIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { getReportedContent, updateReportStatus } from '../../services/reportService';
import { getContentById } from '../../services/contentService';

const ReportedContent = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [reasonFilter, setReasonFilter] = useState('all');

  // Dialog states
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState(null);
  const [reportedContent, setReportedContent] = useState(null);

  useEffect(() => {
    fetchReportedContent();
  }, []);

  const fetchReportedContent = async () => {
    try {
      setLoading(true);
      
      // Call actual API
      const response = await getReportedContent();
      setReports(response.data);
    } catch (err) {
      setError('Failed to load reported content');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenViewDialog = async (report) => {
    setCurrentReport(report);
    setOpenViewDialog(true);
    
    // Fetch the reported content details
    try {
      const contentResponse = await getContentById(report.contentId);
      setReportedContent(contentResponse.data);
    } catch (err) {
      console.error('Error fetching reported content:', err);
      setReportedContent(null);
    }
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setCurrentReport(null);
    setReportedContent(null);
  };

  const handleOpenRejectDialog = (report) => {
    setCurrentReport(report);
    setOpenRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setCurrentReport(null);
    setRejectionReason('');
  };

  const handleApproveContent = async (reportId) => {
    try {
      await updateReportStatus(reportId, 'approved');
      
      // Update the reports list
      const updatedReports = reports.filter(report => report._id !== reportId);
      setReports(updatedReports);
      setActionSuccess('Content approved and report dismissed');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setError('Failed to approve content');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRejectContent = async () => {
    try {
      if (!rejectionReason.trim()) {
        setError('Please provide a rejection reason');
        return;
      }
      
      await updateReportStatus(currentReport._id, 'rejected');
      
      // Update the reports list
      const updatedReports = reports.filter(report => report._id !== currentReport._id);
      setReports(updatedReports);
      setActionSuccess('Content rejected successfully');
      setTimeout(() => setActionSuccess(null), 3000);
      handleCloseRejectDialog();
    } catch (err) {
      setError('Failed to reject content');
      setTimeout(() => setError(null), 3000);
    }
  };

  const getSourceIcon = (source) => {
    switch(source) {
      case 'twitter':
        return <TwitterIcon sx={{ color: '#1DA1F2' }} />;
      case 'reddit':
        return <RedditIcon sx={{ color: '#FF4500' }} />;
      case 'linkedin':
        return <LinkedInIcon sx={{ color: '#0077B5' }} />;
      default:
        return <FlagIcon sx={{ color: '#555' }} />;
    }
  };

  const getReasonColor = (reason) => {
    switch(reason.toLowerCase()) {
      case 'spam':
        return 'warning';
      case 'inappropriate':
        return 'error';
      case 'offensive':
        return 'error';
      case 'misinformation':
        return 'info';
      case 'copyright':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getReasonIcon = (reason) => {
    switch(reason.toLowerCase()) {
      case 'spam':
        return <ThumbDownIcon fontSize="small" />;
      case 'inappropriate':
        return <WarningIcon fontSize="small" />;
      case 'offensive':
        return <WarningIcon fontSize="small" />;
      case 'misinformation':
        return <ReportIcon fontSize="small" />;
      case 'copyright':
        return <SecurityIcon fontSize="small" />;
      default:
        return <FlagIcon fontSize="small" />;
    }
  };

  // Filter reports based on reason
  const filteredReports = reasonFilter === 'all' 
    ? reports 
    : reports.filter(report => report.reason.toLowerCase() === reasonFilter.toLowerCase());

  // Get paginated reports
  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && reports.length === 0) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <FlagIcon sx={{ mr: 1, color: 'error.main' }} />
        Reported Content
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      {actionSuccess && (
        <Fade in={!!actionSuccess}>
          <Alert severity="success" sx={{ mb: 3 }}>
            {actionSuccess}
          </Alert>
        </Fade>
      )}
      
      {reports.length === 0 ? (
        <Alert severity="info" sx={{ my: 3 }}>
          No reported content found.
        </Alert>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Source</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Reporter</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getSourceIcon(report.platform)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {report.platform === 'internal' ? 'Platform Content' : report.platform}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={getReasonIcon(report.reason)} 
                        label={report.reason} 
                        size="small"
                        color={getReasonColor(report.reason)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}
                        >
                          {report.user?.name?.charAt(0) || 'U'}
                        </Avatar>
                        {report.user?.name || 'Anonymous'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(report.reportedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton onClick={() => handleOpenViewDialog(report)} size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Approve">
                        <IconButton 
                          onClick={() => handleApproveContent(report._id)} 
                          color="success"
                          size="small"
                        >
                          <ApproveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton 
                          onClick={() => handleOpenRejectDialog(report)}
                          color="error"
                          size="small"
                        >
                          <RejectIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={filteredReports.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
      
      {/* View Details Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Report Details
        </DialogTitle>
        <DialogContent>
          {currentReport && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Report Information</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Reason:</Typography>
                      <Chip 
                        icon={getReasonIcon(currentReport.reason)} 
                        label={currentReport.reason} 
                        color={getReasonColor(currentReport.reason)}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                    
                    {currentReport.details && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Details:</Typography>
                        <Typography variant="body2" paragraph sx={{ mt: 0.5 }}>
                          {currentReport.details}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Reported By:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                          {currentReport.user?.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Typography variant="body2">
                          {currentReport.user?.name || 'Anonymous'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Reported On:</Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {new Date(currentReport.reportedAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Reported Content</Typography>
                    
                    {reportedContent ? (
                      <>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Title:</Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {reportedContent.title}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Type:</Typography>
                          <Chip 
                            label={reportedContent.contentType} 
                            size="small" 
                            sx={{ mt: 0.5, textTransform: 'capitalize' }}
                          />
                        </Box>
                        
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Description:</Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {reportedContent.description.length > 200 
                              ? `${reportedContent.description.substring(0, 200)}...` 
                              : reportedContent.description}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Created By:</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                              {reportedContent.creator?.name?.charAt(0) || 'C'}
                            </Avatar>
                            <Typography variant="body2">
                              {reportedContent.creator?.name || 'Unknown'}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={24} />
                      </Box>
                    )}
                  </CardContent>
                  
                  {reportedContent && (
                    <CardActions>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        href={`/content/${reportedContent._id}`}
                        target="_blank"
                      >
                        View Full Content
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={() => {
              handleApproveContent(currentReport._id);
              handleCloseViewDialog();
            }}
            startIcon={<ApproveIcon />}
          >
            Approve
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={() => {
              handleCloseViewDialog();
              handleOpenRejectDialog(currentReport);
            }}
            startIcon={<RejectIcon />}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={handleCloseRejectDialog}
      >
        <DialogTitle>Reject Reported Content</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting this content. This information will be used for moderation purposes.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="rejection-reason"
            label="Rejection Reason"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Cancel</Button>
          <Button onClick={handleRejectContent} color="error" variant="contained">
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ReportedContent; 