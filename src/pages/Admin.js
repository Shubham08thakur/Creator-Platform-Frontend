import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tab, 
  Tabs, 
  Paper,
  Grid,
  Stack,
  Avatar,
  Divider
} from '@mui/material';
import FeedAnalytics from '../components/admin/FeedAnalytics';
import UserManagement from '../components/admin/UserManagement';
import ReportedContent from '../components/admin/ReportedContent';
import { useAuth } from '../contexts/AuthContext';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ReportIcon from '@mui/icons-material/Report';
import BarChartIcon from '@mui/icons-material/BarChart';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const Admin = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          mb: 4,
          gap: 3
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            bgcolor: 'primary.main', 
            color: 'white',
            borderRadius: 2,
            width: { xs: '100%', md: '300px' },
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute', 
              top: -20, 
              right: -20, 
              fontSize: '180px', 
              opacity: 0.1 
            }}
          >
            <AdminPanelSettingsIcon fontSize="inherit" />
          </Box>
          
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                width: 56,
                height: 56 
              }}
            >
              <AdminPanelSettingsIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Admin
              </Typography>
              <Typography variant="subtitle2">
                Dashboard
              </Typography>
            </Box>
          </Stack>
          
          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', my: 2 }} />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Welcome back,
            </Typography>
            <Typography variant="h6">
              {user?.name || 'Administrator'}
            </Typography>
          </Box>
        </Paper>
        
        <Grid container spacing={2} flex={1}>
          <Grid item xs={12} sm={6} lg={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                bgcolor: '#e3f2fd', 
                color: 'primary.dark',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: -15, 
                  right: -15, 
                  opacity: 0.2 
                }}
              >
                <DashboardIcon sx={{ fontSize: 100 }} />
              </Box>
              <Typography variant="overline" fontWeight="medium">
                Main Dashboard
              </Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                Platform Overview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View complete platform statistics and performance
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} lg={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                bgcolor: '#fff8e1', 
                color: 'warning.dark',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: -15, 
                  right: -15, 
                  opacity: 0.2 
                }}
              >
                <BarChartIcon sx={{ fontSize: 100 }} />
              </Box>
              <Typography variant="overline" fontWeight="medium">
                Feed Management
              </Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                Content Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track engagement across social platforms
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} lg={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%', 
                bgcolor: '#ffebee', 
                color: 'error.dark',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: -15, 
                  right: -15, 
                  opacity: 0.2 
                }}
              >
                <ReportIcon sx={{ fontSize: 100 }} />
              </Box>
              <Typography variant="overline" fontWeight="medium">
                Content Moderation
              </Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                Reported Items
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Review and manage reported content
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Box 
          sx={{ 
            bgcolor: '#f5f5f5',
            borderBottom: 1, 
            borderColor: 'divider',
            px: 2
          }}
        >
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="admin dashboard tabs"
            sx={{ 
              '& .MuiTab-root': { 
                fontWeight: 'medium',
                fontSize: '1rem',
                py: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.03)'
                }
              },
              '& .Mui-selected': {
                color: 'primary.main',
                fontWeight: 'bold'
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3
              }
            }}
          >
            <Tab 
              label="Feed Analytics" 
              {...a11yProps(0)}
              icon={<BarChartIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="User Management" 
              {...a11yProps(1)}
              icon={<PersonIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Reported Content" 
              {...a11yProps(2)}
              icon={<ReportIcon />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <FeedAnalytics />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <UserManagement />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <ReportedContent />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Admin; 