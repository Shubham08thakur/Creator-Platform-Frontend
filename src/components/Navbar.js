import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Link,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Creator Platform
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/">
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/feed">
                <Typography textAlign="center">Feed</Typography>
              </MenuItem>
              {isAuthenticated ? (
                <>
                  <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/dashboard">
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/content/create">
                    <Typography textAlign="center">Create Content</Typography>
                  </MenuItem>
                  {user && user.role === 'admin' && (
                    <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/admin">
                      <Typography textAlign="center">Admin</Typography>
                    </MenuItem>
                  )}
                </>
              ) : (
                <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/login">
                  <Typography textAlign="center">Login</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Creator Platform
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Home
            </Button>
            
            <Button
              component={RouterLink}
              to="/feed"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block', display: 'flex', alignItems: 'center' }}
              startIcon={<RssFeedIcon />}
            >
              Feed
            </Button>
            
            {isAuthenticated ? (
              <>
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Dashboard
                </Button>
                <Button
                  component={RouterLink}
                  to="/content/create"
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Create Content
                </Button>
                {user && user.role === 'admin' && (
                  <Button
                    component={RouterLink}
                    to="/admin"
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block', display: 'flex', alignItems: 'center' }}
                    startIcon={<AdminPanelSettingsIcon />}
                  >
                    Admin
                  </Button>
                )}
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Login
              </Button>
            )}
          </Box>

          {isAuthenticated ? (
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              <Badge 
                badgeContent={user?.credits || 0} 
                color="secondary"
                sx={{ mr: 2 }}
              >
                <CreditScoreIcon />
              </Badge>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {user?.profileImage ? (
                    <Avatar 
                      alt={user.name} 
                      src={user.profileImage}
                      sx={{ bgcolor: 'secondary.main' }}
                    />
                  ) : (
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      {user?.name?.charAt(0) || <AccountCircleIcon />}
                    </Avatar>
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/profile">
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="secondary"
              sx={{ ml: 1 }}
            >
              Register
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 