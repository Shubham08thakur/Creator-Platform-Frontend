import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { getContentById, likeContent, commentOnContent } from '../services/contentService';
import ReportDialog from '../components/ReportDialog';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchContent();
  }, [id]);
  
  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await getContentById(id);
      setContent(response.data);
      setComments(response.data.comments || []);
      // Check if user has liked the content
      if (isAuthenticated && response.data.likedBy) {
        setLiked(response.data.likedBy.includes(user.id));
      }
    } catch (err) {
      setError('Failed to load content. Please try again later.');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await likeContent(id);
      setLiked(true);
      setContent({
        ...content,
        likes: content.likes + 1
      });
    } catch (err) {
      console.error('Error liking content:', err);
    }
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await commentOnContent(id, { text: comment });
      setComments([...comments, response.data]);
      setComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleReportClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setReportDialogOpen(true);
  };

  const handleReportDialogClose = () => {
    setReportDialogOpen(false);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)} 
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }
  
  if (!content) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Content not found</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)} 
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3 }}
      >
        Back
      </Button>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {content.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={content.contentType} 
                color="primary" 
                size="small" 
                sx={{ textTransform: 'capitalize', mr: 1 }}
              />
              
              {content.tags && content.tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  variant="outlined" 
                  size="small" 
                  sx={{ mr: 1 }}
                />
              ))}
              
              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                {formatDate(content.createdAt)}
              </Typography>
            </Box>
            
            {content.contentType === 'image' && (
              <Box 
                component="img" 
                src={content.contentUrl} 
                alt={content.title}
                sx={{ width: '100%', borderRadius: 1, mb: 3 }}
              />
            )}
            
            {content.contentType === 'video' && (
              <Box 
                component="iframe" 
                src={content.contentUrl} 
                frameBorder="0"
                allowFullScreen
                sx={{ width: '100%', height: 400, borderRadius: 1, mb: 3 }}
              />
            )}
            
            <Typography variant="body1" paragraph>
              {content.description}
            </Typography>
            
            {content.contentType === 'article' && (
              <Button 
                variant="contained" 
                color="primary" 
                href={content.contentUrl} 
                target="_blank"
                sx={{ mt: 2 }}
              >
                Read Full Article
              </Button>
            )}
            
            {content.contentType === 'audio' && (
              <Box 
                component="audio" 
                src={content.contentUrl} 
                controls
                sx={{ width: '100%', mt: 2 }}
              />
            )}
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                  onClick={handleLike} 
                  color={liked ? 'error' : 'default'}
                  disabled={liked}
                >
                  {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {content.likes} likes
                </Typography>
                
                <CommentIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {comments.length} comments
                </Typography>
              </Box>
              
              <Box>
                <Tooltip title="Report inappropriate content">
                  <IconButton 
                    color="default" 
                    onClick={handleReportClick}
                    aria-label="Report content"
                  >
                    <FlagIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Creator
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  src={content.creator?.profileImage} 
                  alt={content.creator?.name}
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {content.creator?.name || 'Unknown Creator'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {content.creator?.bio?.substring(0, 70) || 'No bio available'}
                    {content.creator?.bio?.length > 70 ? '...' : ''}
                  </Typography>
                </Box>
              </Box>
              
              {/* Optional: Add creator follow button or more details here */}
            </Paper>
            
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>
              
              {isAuthenticated ? (
                <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    multiline
                    rows={2}
                    margin="normal"
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      disabled={!comment.trim() || submitting}
                    >
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Button 
                    color="primary" 
                    size="small" 
                    onClick={() => navigate('/login')}
                  >
                    Log in
                  </Button> to add your comment
                </Alert>
              )}
              
              {comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  Be the first to comment on this content!
                </Typography>
              ) : (
                <List>
                  {comments.map((comment, index) => (
                    <React.Fragment key={comment._id || index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar src={comment.user?.profileImage}>
                            {comment.user?.name ? comment.user.name.charAt(0) : <PersonIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2">
                              {comment.user?.name || 'Anonymous'}
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                {formatDate(comment.createdAt)}
                              </Typography>
                            </Typography>
                          }
                          secondary={comment.text}
                        />
                      </ListItem>
                      {index < comments.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Report Dialog */}
      <ReportDialog 
        open={reportDialogOpen} 
        handleClose={handleReportDialogClose} 
        contentId={id} 
      />
    </Container>
  );
};

export default ContentDetail; 