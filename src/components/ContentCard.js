import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Avatar,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Badge,
  Divider
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { likeContent } from '../services/contentService';

const ContentCard = ({ content, onLike }) => {
  const { _id, title, description, thumbnail, contentType, creator, likes, views, tags } = content;

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await likeContent(_id);
      if (onLike) onLike(_id);
    } catch (error) {
      console.error('Error liking content:', error);
    }
  };

  const getContentTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'video': return '#e53935'; // red
      case 'article': return '#1976d2'; // blue
      case 'image': return '#43a047'; // green
      case 'audio': return '#6d4c41'; // brown
      default: return '#9c27b0'; // purple
    }
  };

  const getContentTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'video': return '🎬';
      case 'article': return '📝';
      case 'image': return '🖼️';
      case 'audio': return '🎵';
      default: return '✨';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardActionArea component={RouterLink} to={`/content/${_id}`}>
          <CardMedia
            component="img"
            height="180"
            image={thumbnail || 'https://source.unsplash.com/random/345x180/?digital'}
            alt={title}
            sx={{ 
              objectFit: 'cover',
              transition: 'transform 0.5s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0,
              p: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <Tooltip title={contentType}>
              <Chip 
                label={getContentTypeIcon(contentType)}
                size="small" 
                sx={{ 
                  bgcolor: getContentTypeColor(contentType),
                  color: 'white',
                  fontWeight: 'bold',
                  height: 28,
                  width: 28,
                  borderRadius: '50%',
                  '& .MuiChip-label': {
                    px: 0,
                    fontSize: '1rem'
                  },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              />
            </Tooltip>
            
            <Stack direction="row" spacing={0.5}>
              {/* Placeholder for future badges/features */}
            </Stack>
          </Box>
          
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
              p: 1.5,
              pt: 3
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar 
                src={creator?.profileImage} 
                alt={creator?.name}
                sx={{ 
                  width: 30, 
                  height: 30,
                  border: '2px solid white'
                }}
              />
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'medium' }}>
                {creator?.name || 'Unknown Creator'}
              </Typography>
            </Stack>
          </Box>
        </CardActionArea>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <CardActionArea component={RouterLink} to={`/content/${_id}`}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
              minHeight: '2.6em'
            }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 2,
              minHeight: '2.5em'
            }}
          >
            {description}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {tags && tags.map((tag, index) => index < 3 && (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                variant="outlined" 
                sx={{ 
                  borderRadius: 1.5,
                  height: 22,
                  '& .MuiChip-label': {
                    px: 1,
                    fontWeight: 'medium',
                    fontSize: '0.7rem'
                  }
                }}
              />
            ))}
            {tags && tags.length > 3 && (
              <Chip 
                label={`+${tags.length - 3}`} 
                size="small" 
                sx={{ 
                  borderRadius: 1.5,
                  height: 22,
                  bgcolor: 'rgba(0,0,0,0.05)',
                  '& .MuiChip-label': {
                    px: 1,
                    fontWeight: 'medium',
                    fontSize: '0.7rem'
                  }
                }}
              />
            )}
          </Box>
        </CardActionArea>
      </CardContent>
      
      <Divider />
      
      <CardActions sx={{ justifyContent: 'space-between', p: 1.5 }}>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Like">
            <IconButton 
              size="small" 
              color="error" 
              onClick={handleLike}
              aria-label="like"
              sx={{ 
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.2)'
                }
              }}
            >
              <Badge 
                badgeContent={likes || 0} 
                color="error"
                max={999}
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    minWidth: 16,
                    height: 16
                  }
                }}
              >
                <FavoriteIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Views">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VisibilityIcon fontSize="small" color="action" sx={{ mr: 0.5, opacity: 0.7 }} />
              <Typography variant="caption" color="text.secondary" fontWeight="medium">
                {views}
              </Typography>
            </Box>
          </Tooltip>
        </Stack>
        
        <Stack direction="row" spacing={1}>
          <Tooltip title="Save">
            <IconButton 
              size="small" 
              color="primary"
              aria-label="save"
              sx={{ 
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.2)'
                }
              }}
            >
              <BookmarkBorderIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Share">
            <IconButton 
              size="small" 
              color="primary"
              aria-label="share"
              sx={{ 
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.2)'
                }
              }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default ContentCard; 