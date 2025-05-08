import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  CreditScore as CreditScoreIcon,
  Today as TodayIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { updateUserProfile, getUserProfile } from '../services/userService';

const Profile = () => {
  const { user, isAuthenticated, loadUser } = useContext(AuthContext);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    profileImage: ''
  });
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);
  
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const userData = await getUserProfile();
      
      setProfile({
        name: userData.data.name || '',
        email: userData.data.email || '',
        bio: userData.data.bio || '',
        profileImage: userData.data.profileImage || ''
      });
      
      setTransactions(userData.data.creditHistory || []);
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditToggle = () => {
    setEditing(!editing);
    // Reset form when canceling edit
    if (editing) {
      fetchUserProfile();
    }
  };
  
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateUserProfile(profile);
      await loadUser(); // Reload user data in auth context
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  
  if (loading && !profile.name) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h4" component="h1">
                Profile
              </Typography>
              <Button
                startIcon={editing ? <CancelIcon /> : <EditIcon />}
                variant={editing ? 'outlined' : 'contained'}
                color={editing ? 'secondary' : 'primary'}
                onClick={handleEditToggle}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>
            
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="flex-start">
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={profile.profileImage || ''}
                      alt={profile.name}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        border: '4px solid',
                        borderColor: 'primary.main'
                      }}
                    >
                      {profile.name.charAt(0)}
                    </Avatar>
                    {editing && (
                      <TextField
                        fullWidth
                        label="Profile Image URL"
                        name="profileImage"
                        value={profile.profileImage || ''}
                        onChange={handleChange}
                        margin="normal"
                        size="small"
                        helperText="Enter URL for profile image"
                      />
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        disabled={!editing}
                        required
                        InputProps={{
                          startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={profile.email}
                        disabled
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        value={profile.bio || ''}
                        onChange={handleChange}
                        disabled={!editing}
                        multiline
                        rows={4}
                        placeholder={editing ? 'Tell us about yourself...' : 'No bio added yet.'}
                      />
                    </Grid>
                    
                    {editing && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            disabled={loading}
                          >
                            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                          </Button>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Paper>
          
          {/* Credit History Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Credit History
            </Typography>
            
            {transactions.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                No credit transactions yet.
              </Typography>
            ) : (
              <List>
                {transactions.map((transaction, index) => (
                  <React.Fragment key={transaction._id || index}>
                    <ListItem>
                      <ListItemIcon>
                        <CreditScoreIcon color={transaction.amount > 0 ? 'success' : 'error'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {transaction.description}
                            <Chip
                              label={`${transaction.amount > 0 ? '+' : ''}${transaction.amount} credits`}
                              color={transaction.amount > 0 ? 'success' : 'error'}
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(transaction.timestamp)} • {transaction.transactionType.replace('_', ' ')}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < transactions.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Stats Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Account Stats
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <CreditScoreIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Credit Balance"
                  secondary={
                    <Typography variant="h6" color="primary.main">
                      {user?.credits || 0} credits
                    </Typography>
                  }
                />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem>
                <ListItemIcon>
                  <TodayIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Member Since"
                  secondary={formatDate(user?.createdAt || new Date())}
                />
              </ListItem>
              
              <Divider variant="inset" component="li" />
              
              <ListItem>
                <ListItemIcon>
                  <TimelineIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Profile Status"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <CheckCircleIcon color={user?.profileCompleted ? 'success' : 'disabled'} sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">
                        {user?.profileCompleted ? 'Completed' : 'Incomplete'}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 