import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  Pagination,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Fade,
  Grow,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ContentCard from '../components/ContentCard';
import { getContents } from '../services/contentService';

const contentTypes = ['All', 'Article', 'Video', 'Image', 'Audio'];

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [contentVisible, setContentVisible] = useState(false);
  
  const limit = 8; // Items per page

  useEffect(() => {
    fetchContents();
  }, [page, selectedType, sortBy]);

  useEffect(() => {
    // Show content with animation after loading
    if (!loading) {
      setContentVisible(true);
    }
  }, [loading]);

  const fetchContents = async () => {
    setLoading(true);
    setContentVisible(false);
    setError('');
    
    try {
      let query = `?page=${page}&limit=${limit}&sort=${sortBy}`;
      
      if (search.trim()) {
        query += `&title[$regex]=${search.trim()}&title[$options]=i`;
      }
      
      if (selectedType !== 'All') {
        query += `&contentType=${selectedType.toLowerCase()}`;
      }
      
      const response = await getContents(query);
      
      setContents(response.data);
      setTotalPages(Math.ceil(response.count / limit));
    } catch (err) {
      setError('Failed to load content. Please try again later.');
      console.error('Error fetching contents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchContents();
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handlePageChange = (e, value) => {
    setPage(value);
    // Scroll to top when changing pages
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLike = (contentId) => {
    // Update local state after liking
    setContents(
      contents.map((content) => 
        content._id === contentId 
          ? { ...content, likes: content.likes + 1 } 
          : content
      )
    );
  };

  const getTypeIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'video': return '🎬';
      case 'article': return '📝';
      case 'image': return '🖼️';
      case 'audio': return '🎵';
      default: return '🌟';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 5, md: 8 },
          px: { xs: 2, md: 4 },
          mb: 6,
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'url("https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />
        
        <Grid container spacing={3} position="relative" zIndex={1}>
          <Grid item xs={12} md={8}>
            <Fade in={true} timeout={1000}>
              <Box>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  color="white"
                  fontWeight="bold"
                  sx={{ 
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    fontSize: { xs: '2.5rem', md: '3.5rem' }
                  }}
                >
                  Discover Amazing Content
                </Typography>
                
                <Typography 
                  variant="h5" 
                  component="h2"
                  color="white"
                  sx={{ 
                    mb: 4, 
                    opacity: 0.9,
                    maxWidth: 600,
                    textShadow: '0 1px 5px rgba(0,0,0,0.1)'
                  }}
                >
                  Explore a world of creativity from talented creators across the globe
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ 
                      py: 1.5,
                      px: 4,
                      fontWeight: 'bold',
                      borderRadius: 2,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                      fontSize: '1rem',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                      }
                    }}
                  >
                    Join as Creator
                  </Button>
                  
                  <Button
                    component={RouterLink}
                    to="/feed"
                    variant="outlined"
                    size="large"
                    sx={{ 
                      py: 1.5,
                      px: 4,
                      fontWeight: 'bold',
                      borderRadius: 2,
                      borderColor: 'white',
                      color: 'white',
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderWidth: 2,
                      }
                    }}
                    startIcon={<ExploreIcon />}
                  >
                    Explore Feed
                  </Button>
                </Stack>
              </Box>
            </Fade>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ 
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            alignItems: 'center' 
          }}>
            <Fade in={true} timeout={1500}>
              <Box 
                component="img" 
                src="https://illustrations.popsy.co/amber/digital-nomad.svg" 
                alt="Content Creator"
                sx={{ 
                  width: '100%',
                  maxWidth: 400,
                  filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))'
                }}
              />
            </Fade>
          </Grid>
        </Grid>
      </Box>
      
      {/* Trending Topics */}
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 5 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <LocalFireDepartmentIcon color="error" />
            <Typography variant="h5" component="h2" fontWeight="bold">
              Trending Topics
            </Typography>
          </Stack>
          
          <Paper 
            elevation={0} 
            variant="outlined" 
            sx={{ 
              p: 2, 
              borderRadius: 3,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5
            }}
          >
            {['Web Development', 'AI', 'Design', 'Marketing', 'Productivity', 'Tech News', 'Business', 'Photography'].map((topic) => (
              <Chip
                key={topic}
                label={topic}
                onClick={() => {
                  setSearch(topic);
                  setPage(1);
                  fetchContents();
                }}
                color="primary"
                variant="outlined"
                sx={{ 
                  borderRadius: 3,
                  py: 2.5,
                  px: 1,
                  fontWeight: 'medium',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.08)'
                  }
                }}
                icon={<WhatshotIcon fontSize="small" />}
              />
            ))}
          </Paper>
        </Box>
      </Fade>

      {/* Filters and search */}
      <Fade in={true} timeout={900}>
        <Paper 
          elevation={2} 
          sx={{ 
            mb: 5, 
            p: 3, 
            borderRadius: 3,
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <form onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search content..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      transition: 'box-shadow 0.3s',
                      '&:hover': {
                        boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button 
                          type="submit" 
                          variant="contained"
                          sx={{ 
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            textTransform: 'none'
                          }}
                        >
                          Search
                        </Button>
                      </InputAdornment>
                    )
                  }}
                />
              </form>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TuneIcon color="action" fontSize="small" />
                <Typography variant="body2" fontWeight="medium" sx={{ mr: 1 }}>
                  Sort:
                </Typography>
              </Stack>
              <TextField
                select
                fullWidth
                value={sortBy}
                onChange={handleSortChange}
                variant="outlined"
                size="small"
                sx={{
                  mt: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              >
                <MenuItem value="-createdAt">Newest First</MenuItem>
                <MenuItem value="createdAt">Oldest First</MenuItem>
                <MenuItem value="-likes">Most Liked</MenuItem>
                <MenuItem value="-views">Most Viewed</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <FilterListIcon color="action" fontSize="small" />
                <Typography variant="body2" fontWeight="medium">
                  Filter by Type:
                </Typography>
              </Stack>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {contentTypes.map((type) => (
                  <Chip
                    key={type}
                    label={`${type !== 'All' ? getTypeIcon(type) + ' ' : ''}${type}`}
                    onClick={() => handleTypeChange(type)}
                    color={selectedType === type ? 'primary' : 'default'}
                    variant={selectedType === type ? 'filled' : 'outlined'}
                    sx={{ 
                      cursor: 'pointer',
                      fontWeight: selectedType === type ? 'bold' : 'medium',
                      borderRadius: 2
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* Content Results Title */}
      <Fade in={true} timeout={1000}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            {search ? `Results for "${search}"` : selectedType !== 'All' ? `${selectedType} Content` : 'Latest Content'}
          </Typography>
          
          {!loading && contents.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Showing {contents.length} of {totalPages * limit} results
            </Typography>
          )}
        </Box>
      </Fade>

      {/* Content display */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Paper sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
                <Skeleton variant="rectangular" height={140} animation="wave" />
                <Box sx={{ p: 2 }}>
                  <Skeleton animation="wave" height={32} width="80%" sx={{ mb: 1 }} />
                  <Skeleton animation="wave" height={20} />
                  <Skeleton animation="wave" height={20} />
                  <Skeleton animation="wave" height={20} width="60%" />
                  
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Skeleton animation="wave" variant="circular" width={32} height={32} sx={{ mr: 1 }} />
                    <Skeleton animation="wave" height={20} width={100} />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 3,
            py: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
          variant="filled"
        >
          {error}
        </Alert>
      ) : contents.length === 0 ? (
        <Paper 
          sx={{ 
            py: 8, 
            px: 3,
            textAlign: 'center',
            borderRadius: 3,
            bgcolor: 'rgba(0,0,0,0.02)'
          }}
        >
          <img 
            src="https://illustrations.popsy.co/gray/falling.svg" 
            alt="No results"
            style={{ 
              width: '100%', 
              maxWidth: '300px', 
              marginBottom: '20px' 
            }}
          />
          <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="medium">
            No content found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            Try a different search term or adjust your filters to see more results.
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => {
              setSearch('');
              setSelectedType('All');
              setSortBy('-createdAt');
              setPage(1);
              fetchContents();
            }}
            sx={{ 
              borderRadius: 2,
              fontWeight: 'medium',
              px: 3
            }}
          >
            Reset Filters
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {contents.map((content, index) => (
              <Grid item key={content._id} xs={12} sm={6} md={4} lg={3}>
                <Grow
                  in={contentVisible}
                  style={{ transformOrigin: '0 0 0' }}
                  timeout={(index % 8) * 100 + 400}
                >
                  <Box>
                    <ContentCard content={content} onLike={handleLike} />
                  </Box>
                </Grow>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 1.5, 
                  borderRadius: 3,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "medium" : "large"}
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2,
                      fontWeight: 'medium'
                    }
                  }}
                />
              </Paper>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Home; 