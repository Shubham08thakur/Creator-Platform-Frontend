import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContentCard from '../components/ContentCard';
import { getContents, deleteContent } from '../services/contentService';

// TabPanel component
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserContents();
  }, []);

  const fetchUserContents = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getContents(`?creator=${user._id}`);
      setContents(response.data);
    } catch (err) {
      setError('Failed to load your content. Please try again later.');
      console.error('Error fetching user contents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteContent = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(id);
        setContents(contents.filter(content => content._id !== id));
      } catch (error) {
        setError('Failed to delete content. Please try again.');
        console.error('Error deleting content:', error);
      }
    }
  };

  // Calculate statistics
  const totalViews = contents.reduce((sum, content) => sum + content.views, 0);
  const totalLikes = contents.reduce((sum, content) => sum + content.likes, 0);
  const totalContent = contents.length;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your content and track your performance
        </Typography>
      </Box>

      {/* Creator Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Stack 
              direction="column" 
              alignItems="center" 
              spacing={2}
              sx={{ height: '100%', justifyContent: 'center' }}
            >
              {user?.profileImage ? (
                <Avatar 
                  src={user.profileImage} 
                  alt={user.name}
                  sx={{ width: 80, height: 80 }}
                />
              ) : (
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                  <AccountCircleIcon fontSize="large" />
                </Avatar>
              )}
              <Typography variant="h6">{user?.name}</Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  bgcolor: 'secondary.light', 
                  px: 2, 
                  py: 0.5, 
                  borderRadius: 2 
                }}
              >
                <Typography variant="body2" fontWeight="bold">Credits:</Typography>
                <Typography variant="body1" fontWeight="bold">{user?.credits || 0}</Typography>
              </Box>
              <Button 
                component={RouterLink} 
                to="/profile" 
                variant="outlined" 
                fullWidth
              >
                Edit Profile
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Total Content</Typography>
                  <Typography variant="h3">{totalContent}</Typography>
                  <Button 
                    component={RouterLink} 
                    to="/content/create" 
                    startIcon={<AddIcon />} 
                    sx={{ mt: 2 }}
                    variant="contained"
                    color="secondary"
                  >
                    Create New
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Total Views</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VisibilityIcon fontSize="large" />
                    <Typography variant="h3">{totalViews}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Total Likes</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FavoriteIcon fontSize="large" />
                    <Typography variant="h3">{totalLikes}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Content Management */}
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Content Management
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
              <Tab label="All Content" id="dashboard-tab-0" />
              <Tab label="Most Viewed" id="dashboard-tab-1" />
              <Tab label="Most Liked" id="dashboard-tab-2" />
            </Tabs>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          ) : contents.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                You haven't created any content yet
              </Typography>
              <Button 
                component={RouterLink} 
                to="/content/create" 
                variant="contained" 
                startIcon={<AddIcon />}
                size="large"
                sx={{ mt: 2 }}
              >
                Create Your First Content
              </Button>
            </Box>
          ) : (
            <>
              <TabPanel value={tabValue} index={0}>
                <List sx={{ width: '100%' }}>
                  {contents.map((content) => (
                    <ListItem
                      key={content._id}
                      alignItems="flex-start"
                      secondaryAction={
                        <Box>
                          <IconButton
                            edge="end"
                            component={RouterLink}
                            to={`/content/edit/${content._id}`}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteContent(content._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                      sx={{ 
                        mb: 1, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        borderRadius: 1
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          variant="rounded"
                          src={content.thumbnail} 
                          alt={content.title} 
                          sx={{ width: 80, height: 60 }} 
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <RouterLink 
                            to={`/content/${content._id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              {content.title}
                            </Typography>
                          </RouterLink>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {content.contentType}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
                                <Typography variant="body2">{content.views}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <FavoriteIcon fontSize="small" sx={{ mr: 0.5 }} color="error" />
                                <Typography variant="body2">{content.likes}</Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(content.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={3}>
                  {[...contents]
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 4)
                    .map((content) => (
                      <Grid item key={content._id} xs={12} sm={6} md={3}>
                        <ContentCard content={content} />
                      </Grid>
                    ))}
                </Grid>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Grid container spacing={3}>
                  {[...contents]
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, 4)
                    .map((content) => (
                      <Grid item key={content._id} xs={12} sm={6} md={3}>
                        <ContentCard content={content} />
                      </Grid>
                    ))}
                </Grid>
              </TabPanel>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 