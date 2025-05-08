import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Stack,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Fade
} from '@mui/material';
import { 
  Twitter as TwitterIcon, 
  Reddit as RedditIcon,
  LinkedIn as LinkedInIcon,
  TrendingUp as TrendingUpIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const FeedAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalPosts: 0,
    postsBySource: {
      twitter: 0,
      reddit: 0,
      linkedin: 0
    },
    mostSaved: [],
    mostInteracted: []
  });
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // For demo purposes, we'll use mock data since we may not have a real API endpoint yet
        // In a real implementation, you would fetch from an endpoint like:
        // const response = await axios.get(`${API_URL}/admin/feed/analytics`);
        
        // Mock data
        const mockAnalytics = {
          totalPosts: 142,
          postsBySource: {
            twitter: 87,
            reddit: 35,
            linkedin: 20
          },
          mostSaved: [
            { id: 1, title: "New Tech Trends 2025", source: "twitter", saves: 45, interactions: 67, trend: '+12%' },
            { id: 2, title: "AI Development Updates", source: "linkedin", saves: 38, interactions: 52, trend: '+8%' },
            { id: 3, title: "Web Development Best Practices", source: "reddit", saves: 31, interactions: 49, trend: '+5%' },
            { id: 4, title: "Creator Economy Insights", source: "twitter", saves: 28, interactions: 41, trend: '+15%' },
            { id: 5, title: "Future of Content Creation", source: "linkedin", saves: 26, interactions: 39, trend: '+3%' },
            { id: 6, title: "Latest JavaScript Features", source: "reddit", saves: 24, interactions: 36, trend: '+7%' },
            { id: 7, title: "Mobile App Design Trends", source: "twitter", saves: 22, interactions: 34, trend: '+9%' },
          ],
          mostInteracted: [
            { id: 8, title: "React vs Angular Debate", source: "reddit", saves: 19, interactions: 78, trend: '+22%' },
            { id: 9, title: "Cloud Computing Explained", source: "linkedin", saves: 22, interactions: 73, trend: '+14%' },
            { id: 10, title: "Social Media Marketing Tips", source: "twitter", saves: 27, interactions: 71, trend: '+19%' },
            { id: 11, title: "UX Research Methods", source: "linkedin", saves: 18, interactions: 65, trend: '+10%' },
            { id: 12, title: "Database Optimization Guide", source: "reddit", saves: 15, interactions: 62, trend: '+6%' },
            { id: 13, title: "Content Creator Tools", source: "twitter", saves: 29, interactions: 59, trend: '+11%' },
            { id: 14, title: "Python vs JavaScript", source: "reddit", saves: 23, interactions: 57, trend: '+8%' },
          ]
        };
        
        // Simulate a delay for loading state demonstration
        setTimeout(() => {
          setAnalytics(mockAnalytics);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load analytics data');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        return null;
    }
  };

  const getSourceColor = (source) => {
    switch(source) {
      case 'twitter':
        return '#1DA1F2';
      case 'reddit':
        return '#FF4500';
      case 'linkedin':
        return '#0077B5';
      default:
        return 'primary';
    }
  };

  const getSourceBackgroundColor = (source) => {
    switch(source) {
      case 'twitter':
        return '#e3f2fd';
      case 'reddit':
        return '#ffebee';
      case 'linkedin':
        return '#e8eaf6';
      default:
        return '#f5f5f5';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 5, gap: 2 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading analytics data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: '#ffebee', borderRadius: 2 }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>Please try again later or contact support if the problem persists.</Typography>
      </Box>
    );
  }

  // Calculate percentages for the sources
  const totalSourcePosts = analytics.postsBySource.twitter + analytics.postsBySource.reddit + analytics.postsBySource.linkedin;
  const twitterPercentage = Math.round((analytics.postsBySource.twitter / totalSourcePosts) * 100);
  const redditPercentage = Math.round((analytics.postsBySource.reddit / totalSourcePosts) * 100);
  const linkedinPercentage = Math.round((analytics.postsBySource.linkedin / totalSourcePosts) * 100);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Feed Analytics Overview
          </Typography>
          <Chip 
            icon={<TrendingUpIcon />} 
            label="Real-time Data" 
            color="primary" 
            variant="outlined" 
            sx={{ fontWeight: 'medium' }}
          />
        </Stack>
        <Divider />
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Fade in={true} style={{ transitionDelay: '100ms' }}>
          <Grid item xs={12} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ px: 3, py: 2.5 }}>
                <Typography variant="overline" color="text.secondary" fontWeight="medium">
                  Total Posts
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                  {analytics.totalPosts}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 2, color: 'success.main' }}>
                  <ArrowUpwardIcon fontSize="small" />
                  <Typography variant="body2" fontWeight="medium">
                    12% increase
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Fade>
        
        <Fade in={true} style={{ transitionDelay: '150ms' }}>
          <Grid item xs={12} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                bgcolor: '#e3f2fd',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ px: 3, py: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="overline" color="text.secondary" fontWeight="medium">
                    Twitter
                  </Typography>
                  <TwitterIcon sx={{ color: '#1DA1F2', fontSize: 24 }} />
                </Stack>
                <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                  {analytics.postsBySource.twitter}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {twitterPercentage}% of total
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={twitterPercentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(29, 161, 242, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#1DA1F2'
                      }
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Fade>
        
        <Fade in={true} style={{ transitionDelay: '200ms' }}>
          <Grid item xs={12} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                bgcolor: '#ffebee',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ px: 3, py: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="overline" color="text.secondary" fontWeight="medium">
                    Reddit
                  </Typography>
                  <RedditIcon sx={{ color: '#FF4500', fontSize: 24 }} />
                </Stack>
                <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                  {analytics.postsBySource.reddit}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {redditPercentage}% of total
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={redditPercentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(255, 69, 0, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#FF4500'
                      }
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Fade>
        
        <Fade in={true} style={{ transitionDelay: '250ms' }}>
          <Grid item xs={12} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                bgcolor: '#e8eaf6',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ px: 3, py: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="overline" color="text.secondary" fontWeight="medium">
                    LinkedIn
                  </Typography>
                  <LinkedInIcon sx={{ color: '#0077B5', fontSize: 24 }} />
                </Stack>
                <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                  {analytics.postsBySource.linkedin}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {linkedinPercentage}% of total
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={linkedinPercentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(0, 119, 181, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#0077B5'
                      }
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Fade>
      </Grid>
      
      <Fade in={true} style={{ transitionDelay: '300ms' }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 5, mb: 2 }}>
            <BookmarkIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Most Saved Posts
            </Typography>
          </Stack>
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              mb: 4 
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="most saved posts table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Saves</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Interactions</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Trend</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.mostSaved
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((post) => (
                    <TableRow 
                      key={post.id} 
                      hover 
                      sx={{ 
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: `${getSourceBackgroundColor(post.source)}50`
                        }
                      }}
                    >
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                        {post.title}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={getSourceIcon(post.source)} 
                          label={post.source.charAt(0).toUpperCase() + post.source.slice(1)}
                          size="small"
                          sx={{ 
                            backgroundColor: `${getSourceColor(post.source)}20`,
                            color: getSourceColor(post.source),
                            fontWeight: 'medium',
                            px: 0.5
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{post.saves}</TableCell>
                      <TableCell align="right">{post.interactions}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={post.trend} 
                          size="small" 
                          color="success" 
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={analytics.mostSaved.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
      </Fade>
      
      <Fade in={true} style={{ transitionDelay: '350ms' }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 5, mb: 2 }}>
            <ShareIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Most Interacted Posts
            </Typography>
          </Stack>
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="most interacted posts table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Interactions</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Saves</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Trend</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.mostInteracted
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((post) => (
                    <TableRow 
                      key={post.id} 
                      hover
                      sx={{ 
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: `${getSourceBackgroundColor(post.source)}50`
                        }
                      }}
                    >
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                        {post.title}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={getSourceIcon(post.source)} 
                          label={post.source.charAt(0).toUpperCase() + post.source.slice(1)}
                          size="small"
                          sx={{ 
                            backgroundColor: `${getSourceColor(post.source)}20`,
                            color: getSourceColor(post.source),
                            fontWeight: 'medium',
                            px: 0.5
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{post.interactions}</TableCell>
                      <TableCell align="right">{post.saves}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={post.trend} 
                          size="small" 
                          color="success" 
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={analytics.mostInteracted.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
      </Fade>
    </Box>
  );
};

export default FeedAnalytics; 