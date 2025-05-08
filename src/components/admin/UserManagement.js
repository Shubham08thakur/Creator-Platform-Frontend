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
  Alert,
  Stack,
  Divider,
  Avatar,
  InputAdornment,
  Fade,
  Card, 
  CardContent,
  Collapse,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Dialog state
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    credits: 0
  });

  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch from an admin endpoint
        // const response = await axios.get(`${API_URL}/admin/users`);
        
        // Mock data for demonstration
        const mockUsers = [
          { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', credits: 250, createdAt: '2023-01-15T10:30:00Z' },
          { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', credits: 120, createdAt: '2023-02-20T14:15:00Z' },
          { _id: '3', name: 'Robert Johnson', email: 'robert@example.com', role: 'user', credits: 85, createdAt: '2023-03-10T09:45:00Z' },
          { _id: '4', name: 'Emily Davis', email: 'emily@example.com', role: 'user', credits: 165, createdAt: '2023-04-05T16:20:00Z' },
          { _id: '5', name: 'Michael Wilson', email: 'michael@example.com', role: 'admin', credits: 310, createdAt: '2023-05-12T11:10:00Z' },
          { _id: '6', name: 'Sarah Brown', email: 'sarah@example.com', role: 'user', credits: 95, createdAt: '2023-06-25T13:40:00Z' },
          { _id: '7', name: 'David Miller', email: 'david@example.com', role: 'user', credits: 70, createdAt: '2023-07-18T15:55:00Z' },
          { _id: '8', name: 'Jennifer Taylor', email: 'jennifer@example.com', role: 'user', credits: 140, createdAt: '2023-08-30T10:15:00Z' },
          { _id: '9', name: 'Christopher Moore', email: 'chris@example.com', role: 'user', credits: 110, createdAt: '2023-09-22T08:30:00Z' },
          { _id: '10', name: 'Jessica Anderson', email: 'jessica@example.com', role: 'user', credits: 200, createdAt: '2023-10-15T12:45:00Z' },
          { _id: '11', name: 'Matthew Thomas', email: 'matthew@example.com', role: 'user', credits: 75, createdAt: '2023-11-08T14:20:00Z' },
          { _id: '12', name: 'Amanda White', email: 'amanda@example.com', role: 'user', credits: 125, createdAt: '2023-12-20T09:10:00Z' }
        ];
        
        // Simulate a delay for loading state demonstration
        setTimeout(() => {
          setUsers(mockUsers);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to load users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenEditDialog = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      credits: user.credits
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentUser(null);
  };

  const handleOpenDeleteDialog = (user) => {
    setCurrentUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'credits' ? parseInt(value, 10) : value });
  };

  const handleRoleToggle = () => {
    setFormData({ 
      ...formData, 
      role: formData.role === 'admin' ? 'user' : 'admin' 
    });
  };

  const handleEditUser = async () => {
    try {
      // In a real implementation:
      // await axios.put(`${API_URL}/admin/users/${currentUser._id}`, formData);
      
      // Update users list with edited user
      const updatedUsers = users.map(user => 
        user._id === currentUser._id ? { ...user, ...formData } : user
      );
      setUsers(updatedUsers);
      setActionSuccess('User updated successfully');
      setTimeout(() => setActionSuccess(null), 3000);
      handleCloseEditDialog();
    } catch (err) {
      setError('Failed to update user');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteUser = async () => {
    try {
      // In a real implementation:
      // await axios.delete(`${API_URL}/admin/users/${currentUser._id}`);
      
      // Remove user from the list
      const filteredUsers = users.filter(user => user._id !== currentUser._id);
      setUsers(filteredUsers);
      setActionSuccess('User deleted successfully');
      setTimeout(() => setActionSuccess(null), 3000);
      handleCloseDeleteDialog();
    } catch (err) {
      setError('Failed to delete user');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
    setPage(0);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const filteredUsers = users.filter(user => {
    // Apply role filter
    if (roleFilter !== 'all' && user.role !== roleFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 5, gap: 2 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading user data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            User Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon />}
            sx={{ 
              bgcolor: 'primary.main',
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            Add New User
          </Button>
        </Stack>
        <Divider />
      </Box>

      <Card 
        sx={{ 
          mb: 3, 
          p: 2, 
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}
      >
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ 
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
          />
          
          <Stack direction="row" spacing={1}>
            <Tooltip title="Filter users">
              <Button 
                variant={filterOpen ? "contained" : "outlined"}
                color="primary"
                onClick={handleFilterToggle}
                startIcon={<FilterIcon />}
                sx={{ borderRadius: 2 }}
              >
                Filter
              </Button>
            </Tooltip>
            
            <Tooltip title="Refresh data">
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        
        <Collapse in={filterOpen}>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Filter by role:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip 
                label="All Users" 
                onClick={() => handleRoleFilterChange('all')}
                variant={roleFilter === 'all' ? 'filled' : 'outlined'} 
                color={roleFilter === 'all' ? 'primary' : 'default'}
                sx={{ fontWeight: 'medium' }}
              />
              <Chip 
                label="Admins" 
                onClick={() => handleRoleFilterChange('admin')}
                variant={roleFilter === 'admin' ? 'filled' : 'outlined'} 
                color={roleFilter === 'admin' ? 'primary' : 'default'}
                sx={{ fontWeight: 'medium' }}
                icon={<AdminIcon />}
              />
              <Chip 
                label="Regular Users" 
                onClick={() => handleRoleFilterChange('user')}
                variant={roleFilter === 'user' ? 'filled' : 'outlined'} 
                color={roleFilter === 'user' ? 'primary' : 'default'}
                sx={{ fontWeight: 'medium' }}
                icon={<UserIcon />}
              />
            </Stack>
          </Box>
        </Collapse>
      </Card>

      {actionSuccess && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
          variant="filled"
        >
          {actionSuccess}
        </Alert>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
          variant="filled"
        >
          {error}
        </Alert>
      )}

      <Paper 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Credits</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Joined Date</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No users found matching your criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => (
                    <Fade 
                      in={true} 
                      style={{ transitionDelay: `${index * 30}ms` }}
                      key={user._id}
                    >
                      <TableRow 
                        hover
                        sx={{ 
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            backgroundColor: user.role === 'admin' ? 'rgba(25, 118, 210, 0.04)' : undefined
                          }
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar 
                              sx={{ 
                                bgcolor: user.role === 'admin' ? 'primary.main' : 'secondary.main',
                                width: 40,
                                height: 40
                              }}
                            >
                              {user.name.charAt(0)}
                            </Avatar>
                            <Typography variant="body1" fontWeight="medium">
                              {user.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">{user.email}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={user.role === 'admin' ? <AdminIcon /> : <UserIcon />} 
                            label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            color={user.role === 'admin' ? 'primary' : 'default'}
                            size="small"
                            variant={user.role === 'admin' ? 'filled' : 'outlined'}
                            sx={{ fontWeight: 'medium' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={user.credits}
                            size="small"
                            color={user.credits > 200 ? 'success' : 'default'}
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="Edit User">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleOpenEditDialog(user)}
                                sx={{ 
                                  transition: 'transform 0.2s',
                                  '&:hover': { transform: 'scale(1.1)' }
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleOpenDeleteDialog(user)}
                                sx={{ 
                                  ml: 1,
                                  transition: 'transform 0.2s',
                                  '&:hover': { transform: 'scale(1.1)' }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>

      {/* Edit User Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseEditDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <EditIcon color="primary" />
            <Typography variant="h6">Edit User</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {currentUser && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 80,
                    height: 80,
                    fontSize: '2rem',
                    bgcolor: currentUser.role === 'admin' ? 'primary.main' : 'secondary.main'
                  }}
                >
                  {currentUser.name.charAt(0)}
                </Avatar>
              </Box>
              
              <TextField
                margin="dense"
                name="name"
                label="Name"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={formData.email}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.role === 'admin'}
                      onChange={handleRoleToggle}
                      color="primary"
                    />
                  }
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      {formData.role === 'admin' ? <AdminIcon color="primary" /> : <UserIcon />}
                      <Typography>
                        {formData.role === 'admin' ? 'Admin' : 'Regular User'}
                      </Typography>
                    </Stack>
                  }
                />
              </Box>
              <TextField
                margin="dense"
                name="credits"
                label="Credits"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.credits}
                onChange={handleInputChange}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseEditDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditUser} 
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <DeleteIcon color="error" />
            <Typography variant="h6">Delete User</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {currentUser && (
            <Box sx={{ textAlign: 'center', my: 2 }}>
              <Avatar 
                sx={{ 
                  width: 80,
                  height: 80,
                  fontSize: '2rem',
                  bgcolor: currentUser.role === 'admin' ? 'primary.main' : 'secondary.main',
                  mx: 'auto',
                  mb: 2
                }}
              >
                {currentUser.name.charAt(0)}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {currentUser.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {currentUser.email}
              </Typography>
              <Alert severity="warning" sx={{ mt: 2, mb: 1 }}>
                Are you sure you want to delete this user? This action cannot be undone.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteUser} 
            color="error" 
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement; 