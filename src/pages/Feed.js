import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  Alert,
  Stack,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import TwitterIcon from '@mui/icons-material/Twitter';
import RedditIcon from '@mui/icons-material/Reddit';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ExploreIcon from '@mui/icons-material/Explore';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { getFeed, getSavedContent, deleteSavedContent } from '../services/feedService';
import FeedCard from '../components/FeedCard';
import { useAuth } from '../contexts/AuthContext';

const Feed = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedItems, setFeedItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSources, setSelectedSources] = useState(['twitter', 'reddit', 'linkedin']);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use useCallback to memoize the fetchFeed function
  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const sourcesParam = selectedSources.join(',');
      const response = await getFeed(`?page=${page}&sources=${sourcesParam}`);
      
      setFeedItems(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError('Failed to load feed. Please try again later.');
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [page, selectedSources]);

  // Also memoize fetchSavedContent for consistency
  const fetchSavedContent = useCallback(async () => {
    try {
      const response = await getSavedContent();
      setSavedItems(response.data);
      
      // Create a Set of saved content IDs for quick lookup
      const ids = new Set(response.data.map(item => item.contentId));
      setSavedIds(ids);
    } catch (err) {
      console.error('Error fetching saved content:', err);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    if (isAuthenticated) {
      fetchSavedContent();
    }
  }, [isAuthenticated, fetchFeed, fetchSavedContent]);

  const handleSaveContent = (contentId) => {
    setSavedIds(prev => new Set(prev).add(contentId));
  };

  const handleUnsaveContent = async (contentId) => {
    try {
      // Find the saved item document ID
      const savedItem = savedItems.find(item => item.contentId === contentId);
      if (savedItem) {
        await deleteSavedContent(savedItem._id);
        
        // Update local state
        setSavedIds(prev => {
          const updated = new Set(prev);
          updated.delete(contentId);
          return updated;
        });
        
        setSavedItems(savedItems.filter(item => item.contentId !== contentId));
      }
    } catch (error) {
      console.error('Error removing saved content:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handleSourceToggle = (source) => {
    setSelectedSources(prev => {
      if (prev.includes(source)) {
        return prev.filter(s => s !== source);
      } else {
        return [...prev, source];
      }
    });
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter content based on search term
    console.log('Search for:', searchTerm);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchFeed();
  };

  const filteredFeedItems = activeTab === 0
    ? feedItems
    : savedItems;
    
  // Get the color for each platform
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

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: { xs: 2, md: 4 },
        minHeight: 'calc(100vh - 140px)',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)' 
          : 'linear-gradient(to bottom, #f9f9f9, #ffffff)'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700, 
            color: theme.palette.primary.main,
            textAlign: { xs: 'center', sm: 'left' },
            mb: 3
          }}
        >
          Content Feed
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
      
        <Paper 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 'none',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            TabIndicatorProps={{ sx: { height: 3, borderRadius: '3px 3px 0 0' } }}
          >
            <Tab 
              label="Explore" 
              icon={<ExploreIcon />}
              iconPosition="start"
              sx={{ 
                fontWeight: 600,
                py: 2
              }}
            />
            <Tab 
              label="Saved" 
              icon={<BookmarkIcon />}
              iconPosition="start"
              disabled={!isAuthenticated}
              sx={{ 
                fontWeight: 600,
                py: 2
              }}
            />
          </Tabs>
        </Paper>
      
        {activeTab === 0 && (
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <form onSubmit={handleSearch}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: '0 0 8px rgba(0,0,0,0.1)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 12px rgba(0,0,0,0.15)'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton type="submit">
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </form>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 1, sm: 2 }} 
                  justifyContent={{ xs: 'center', md: 'flex-end' }}
                  alignItems="center"
                  sx={{ mt: { xs: 2, md: 0 } }}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      display: { xs: 'none', md: 'block' }, 
                      fontWeight: 500, 
                      color: theme.palette.text.secondary
                    }}
                  >
                    Filter by:
                  </Typography>
                  <Chip
                    icon={<TwitterIcon />}
                    label="Twitter"
                    color={selectedSources.includes('twitter') ? 'primary' : 'default'}
                    onClick={() => handleSourceToggle('twitter')}
                    sx={{ 
                      fontWeight: 500,
                      borderRadius: '16px',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      },
                      ...(selectedSources.includes('twitter') && {
                        backgroundColor: '#1DA1F2',
                        color: 'white'
                      })
                    }}
                  />
                  <Chip
                    icon={<RedditIcon />}
                    label="Reddit"
                    color={selectedSources.includes('reddit') ? 'primary' : 'default'}
                    onClick={() => handleSourceToggle('reddit')}
                    sx={{ 
                      fontWeight: 500,
                      borderRadius: '16px',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      },
                      ...(selectedSources.includes('reddit') && {
                        backgroundColor: '#FF4500',
                        color: 'white'
                      })
                    }}
                  />
                  <Chip
                    icon={<LinkedInIcon />}
                    label="LinkedIn"
                    color={selectedSources.includes('linkedin') ? 'primary' : 'default'}
                    onClick={() => handleSourceToggle('linkedin')}
                    sx={{ 
                      fontWeight: 500,
                      borderRadius: '16px',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      },
                      ...(selectedSources.includes('linkedin') && {
                        backgroundColor: '#0A66C2',
                        color: 'white'
                      })
                    }}
                  />
                  <IconButton 
                    color="primary" 
                    onClick={handleRefresh}
                    sx={{ 
                      backgroundColor: theme.palette.background.default,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'rotate(30deg)',
                        backgroundColor: theme.palette.primary.main,
                        color: 'white'
                      }
                    }}
                  >
                    <RefreshIcon sx={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          py: 8 
        }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading amazing content...
          </Typography>
        </Box>
      ) : error ? (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          {error}
        </Alert>
      ) : filteredFeedItems.length === 0 ? (
        <Box sx={{ 
          py: 8, 
          textAlign: 'center',
          backgroundColor: theme.palette.background.paper,
          borderRadius: 4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          p: 4
        }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {activeTab === 0 ? 'No content available for the selected sources.' : 'No saved content yet.'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {activeTab === 0 
              ? 'Try selecting different sources or try again later.' 
              : 'Explore the feed and save content you find interesting.'
            }
          </Typography>
          {activeTab === 1 && (
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              startIcon={<ExploreIcon />}
              onClick={() => setActiveTab(0)}
              sx={{ 
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                }
              }}
            >
              Browse content
            </Button>
          )}
        </Box>
      ) : (
        <>
          {/* Platform indicator bars */}
          {activeTab === 0 && (
            <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              {selectedSources.map(source => (
                <Box key={source} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    backgroundColor: getPlatformColor(source),
                    boxShadow: `0 0 8px ${getPlatformColor(source)}`
                  }} />
                  <Typography variant="caption" sx={{ 
                    textTransform: 'capitalize',
                    color: theme.palette.mode === 'dark' ? 'white' : 'text.secondary'
                  }}>
                    {source}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        
          <Grid container spacing={3}>
            {filteredFeedItems.map((item, index) => (
              <Grid 
                item 
                xs={12} 
                sm={activeTab === 0 ? 6 : 12} 
                md={activeTab === 0 ? 4 : 6} 
                key={activeTab === 0 ? `${item.platform}-${item.id}` : item._id}
              >
                <Fade in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                  <Box>
                    <FeedCard 
                      item={activeTab === 0 ? item : {
                        id: item.contentId,
                        platform: item.platform,
                        title: item.title,
                        description: item.description,
                        imageUrl: item.imageUrl,
                        contentUrl: item.contentUrl,
                        author: { name: item.author },
                        createdAt: item.savedAt,
                        metrics: { likes: 0, comments: 0 }
                      }}
                      onSave={handleSaveContent}
                      onUnsave={handleUnsaveContent}
                      isSaved={activeTab === 1 || savedIds.has(item.id)}
                    />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && activeTab === 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 6,
              mb: 2
            }}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 1,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "large"}
                  showFirstButton
                  showLastButton
                  siblingCount={isTablet ? 0 : 1}
                />
              </Paper>
            </Box>
          )}
        </>
      )}
      
      {/* Add a keyframe animation for the refresh icon */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};

export default Feed; 