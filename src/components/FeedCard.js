import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Snackbar,
  Alert,
  useTheme,
  alpha,
  Tooltip,
  Divider
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Twitter as TwitterIcon,
  Reddit as RedditIcon,
  LinkedIn as LinkedInIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { saveContent, reportContent } from '../services/feedService';
import { useAuth } from '../contexts/AuthContext';

const FeedCard = ({ item, onSave, onUnsave, isSaved }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSaveContent = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const contentData = {
        contentId: item.id,
        platform: item.platform,
        title: item.title || item.description.substring(0, 50),
        description: item.description,
        imageUrl: item.imageUrl,
        contentUrl: item.contentUrl,
        author: item.author?.name || 'Unknown'
      };
      
      await saveContent(contentData);
      onSave(item.id);
      setSnackbar({
        open: true,
        message: 'Content saved successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save content',
        severity: 'error'
      });
      console.error('Error saving content:', error);
    }
    
    handleMenuClose();
  };

  const handleUnsaveContent = () => {
    onUnsave(item.id);
    handleMenuClose();
  };

  const handleShareContent = () => {
    setShareDialogOpen(true);
    handleMenuClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(item.contentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    setSnackbar({
      open: true,
      message: 'Link copied to clipboard',
      severity: 'success'
    });
    
    // Don't close dialog to allow user to share via other methods
  };

  const handleOpenReport = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setReportDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseReport = () => {
    setReportDialogOpen(false);
    setReason('');
    setDetails('');
  };

  const handleSubmitReport = async () => {
    try {
      await reportContent({
        contentId: item.id,
        platform: item.platform,
        reason,
        details
      });
      
      setSnackbar({
        open: true,
        message: 'Content reported successfully',
        severity: 'success'
      });
      
      handleCloseReport();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to report content',
        severity: 'error'
      });
      console.error('Error reporting content:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter':
        return <TwitterIcon color="primary" />;
      case 'reddit':
        return <RedditIcon sx={{ color: '#FF4500' }} />;
      case 'linkedin':
        return <LinkedInIcon sx={{ color: '#0A66C2' }} />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'twitter':
        return '#1DA1F2';
      case 'reddit':
        return '#FF4500';
      case 'linkedin':
        return '#0A66C2';
      default:
        return '#cccccc';
    }
  };

  const formatDisplayTitle = () => {
    if (item.title) return item.title;
    // For platforms like Twitter that might not have titles
    return item.description.length > 60 
      ? `${item.description.substring(0, 60)}...` 
      : item.description;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const platformColor = getPlatformColor(item.platform);

  return (
    <>
      <Card sx={{ 
        maxWidth: '100%', 
        mb: 2,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 10px 20px ${alpha(platformColor, 0.2)}`
        },
        border: `1px solid ${alpha(platformColor, 0.1)}`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: platformColor,
        }
      }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={item.author?.imageUrl}
              alt={item.author?.name || 'User'}
              sx={{ 
                mr: 1.5,
                width: 45,
                height: 45,
                border: `2px solid ${platformColor}`,
                bgcolor: alpha(platformColor, 0.2)
              }}
            >
              {item.author?.name ? item.author.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
                {item.author?.name || 'Unknown User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(item.createdAt)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip 
              icon={getPlatformIcon(item.platform)}
              label={item.platform}
              size="small"
              sx={{ 
                mr: 1.5, 
                textTransform: 'capitalize',
                fontWeight: 500,
                backgroundColor: alpha(platformColor, 0.1),
                color: platformColor,
                borderRadius: '12px',
              }}
            />
            <Tooltip title="More options">
              <IconButton onClick={handleMenuOpen} size="small" sx={{ 
                backgroundColor: theme.palette.background.default,
                '&:hover': {
                  backgroundColor: alpha(platformColor, 0.1)
                }
              }}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {item.imageUrl ? (
          <CardMedia
            component="img"
            height="220"
            image={item.imageUrl}
            alt={formatDisplayTitle()}
            sx={{ 
              objectFit: 'cover',
              transition: 'all 0.5s ease',
              '&:hover': {
                transform: 'scale(1.03)'
              }
            }}
            onError={(e) => {
              console.error("Image failed to load:", item.imageUrl);
              e.target.onerror = null;
              // Generate a solid color image with platform color
              e.target.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='600' height='400' fill='${platformColor.replace('#', '%23')}' opacity='0.2'/><text x='50%' y='50%' font-family='Arial' font-size='24' fill='%23333333' text-anchor='middle'>${formatDisplayTitle().substring(0, 30)}</text></svg>`;
            }}
            onLoad={() => console.log("Image loaded successfully:", item.imageUrl)}
          />
        ) : (
          // If no image URL, generate default platform-colored card
          <Box 
            sx={{ 
              height: 150, 
              backgroundColor: alpha(platformColor, 0.1),
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              p: 3,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: `linear-gradient(45deg, ${alpha(platformColor, 0.05)} 25%, transparent 25%, transparent 50%, ${alpha(platformColor, 0.05)} 50%, ${alpha(platformColor, 0.05)} 75%, transparent 75%)`,
                backgroundSize: '20px 20px',
                zIndex: 0,
              }
            }}
          >
            <Typography variant="body1" sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 500,
              position: 'relative', 
              zIndex: 1,
              textShadow: `0 1px 2px ${alpha('#000', 0.1)}`
            }}>
              {formatDisplayTitle().substring(0, 100)}
            </Typography>
          </Box>
        )}
        
        <CardContent sx={{ pb: 1.5 }}>
          <Typography 
            variant="h6" 
            component="div" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              lineHeight: 1.3,
              color: theme.palette.text.primary,
              mb: 1
            }}
          >
            {formatDisplayTitle()}
          </Typography>
          
          {item.title && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                mb: 2,
                lineHeight: 1.6
              }}
            >
              {item.description}
            </Typography>
          )}
          
          <Divider sx={{ my: 1.5 }} />
          
          <Box sx={{ 
            mt: 1.5, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title={liked ? "Unlike" : "Like"}>
                <IconButton 
                  size="small" 
                  onClick={handleLike}
                  sx={{
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      color: liked ? 'inherit' : theme.palette.error.main
                    },
                    color: liked ? theme.palette.error.main : 'inherit'
                  }}
                >
                  {liked ? (
                    <FavoriteIcon 
                      color="inherit" 
                      fontSize="small"
                      sx={{ 
                        animation: liked ? 'heartBeat 0.3s ease-in-out' : 'none'
                      }} 
                    />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2, fontSize: '0.85rem' }}>
                {(item.metrics?.likes || 0) + (liked ? 1 : 0)}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                {item.metrics?.comments || item.metrics?.replies || 0} comments
              </Typography>
            </Box>
            
            <Box>
              <Tooltip title={isSaved ? "Unsave" : "Save"}>
                <IconButton 
                  size="small" 
                  onClick={isAuthenticated ? (isSaved ? handleUnsaveContent : handleSaveContent) : () => navigate('/login')}
                  sx={{
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      color: isSaved ? 'inherit' : theme.palette.primary.main
                    }
                  }}
                >
                  {isSaved ? (
                    <BookmarkIcon 
                      color="primary" 
                      fontSize="small"
                      sx={{ animation: 'popIn 0.3s ease-out' }}
                    />
                  ) : (
                    <BookmarkBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton 
                  size="small" 
                  onClick={handleShareContent}
                  sx={{
                    ml: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1) rotate(10deg)',
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <ShareIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        elevation={3}
        sx={{ 
          '& .MuiPaper-root': {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
            mt: 1.5
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {isSaved ? (
          <MenuItem onClick={handleUnsaveContent} sx={{ py: 1.5 }}>
            <BookmarkIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.primary.main }} />
            <Typography variant="body2">Unsave</Typography>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleSaveContent} sx={{ py: 1.5 }}>
            <BookmarkBorderIcon fontSize="small" sx={{ mr: 1.5 }} />
            <Typography variant="body2">Save</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={handleShareContent} sx={{ py: 1.5 }}>
          <ShareIcon fontSize="small" sx={{ mr: 1.5 }} />
          <Typography variant="body2">Share</Typography>
        </MenuItem>
        <MenuItem onClick={handleOpenReport} sx={{ py: 1.5 }}>
          <Typography variant="body2" color="error">Report</Typography>
        </MenuItem>
      </Menu>
      
      {/* Report Dialog */}
      <Dialog 
        open={reportDialogOpen} 
        onClose={handleCloseReport}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 500
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3 }}>Report Content</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please let us know why you're reporting this content. This helps us maintain a safe community.
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="report-reason-label">Reason</InputLabel>
            <Select
              labelId="report-reason-label"
              value={reason}
              label="Reason"
              onChange={(e) => setReason(e.target.value)}
              sx={{ borderRadius: 1 }}
            >
              <MenuItem value="spam">Spam</MenuItem>
              <MenuItem value="inappropriate">Inappropriate Content</MenuItem>
              <MenuItem value="offensive">Offensive Content</MenuItem>
              <MenuItem value="misinformation">Misinformation</MenuItem>
              <MenuItem value="copyright">Copyright Violation</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={4}
            label="Additional Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseReport}
            sx={{ borderRadius: 1, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitReport}
            variant="contained" 
            color="primary"
            disabled={!reason}
            sx={{ 
              borderRadius: 1, 
              px: 3,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog 
        open={shareDialogOpen} 
        onClose={() => setShareDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 450
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>Share Content</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
            Share this content via:
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3, 
            my: 3,
            '& .MuiIconButton-root': {
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-3px)'
              }
            }
          }}>
            <Tooltip title="Share on Twitter">
              <IconButton 
                color="primary" 
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(item.contentUrl)}`, '_blank')}
                sx={{ 
                  backgroundColor: alpha('#1DA1F2', 0.1),
                  '&:hover': {
                    backgroundColor: alpha('#1DA1F2', 0.2)
                  }
                }}
              >
                <TwitterIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share on LinkedIn">
              <IconButton 
                sx={{ 
                  color: '#0A66C2',
                  backgroundColor: alpha('#0A66C2', 0.1),
                  '&:hover': {
                    backgroundColor: alpha('#0A66C2', 0.2)
                  }
                }} 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(item.contentUrl)}`, '_blank')}
              >
                <LinkedInIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share on Reddit">
              <IconButton 
                sx={{ 
                  color: '#FF4500',
                  backgroundColor: alpha('#FF4500', 0.1),
                  '&:hover': {
                    backgroundColor: alpha('#FF4500', 0.2)
                  }
                }} 
                onClick={() => window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(item.contentUrl)}`, '_blank')}
              >
                <RedditIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
            Or copy the link:
          </Typography>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 2, 
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: 1,
            position: 'relative'
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                fontSize: '0.9rem'
              }}
            >
              {item.contentUrl}
            </Typography>
            <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
              <IconButton onClick={handleCopyLink} size="small" color={copied ? "success" : "default"}>
                {copied ? <CheckIcon /> : <ContentCopyIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
          <Button 
            onClick={() => setShareDialogOpen(false)} 
            variant="outlined"
            sx={{ borderRadius: 1, px: 3 }}
          >
            Close
          </Button>
          <Button 
            onClick={handleCopyLink} 
            variant="contained" 
            color="primary"
            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            sx={{ 
              borderRadius: 1, 
              px: 3,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          elevation={6}
          sx={{ 
            borderRadius: 2,
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Animations */}
      <style jsx global>{`
        @keyframes heartBeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.3); }
          30% { transform: scale(1); }
          45% { transform: scale(1.3); }
          60% { transform: scale(1); }
        }
        
        @keyframes popIn {
          0% { transform: scale(0); }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
};

export default FeedCard; 