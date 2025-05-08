import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200]
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} Creator Platform
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          A platform for creators to share content and earn credits
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 