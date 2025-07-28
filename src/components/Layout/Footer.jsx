import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Link } from 'react-router-dom';

const FooterContainer = styled('footer')({
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--primary-font-color)',
  padding: '24px 0',
  marginTop: 'auto',
});

const FooterLink = styled(Link)({
  color: 'var(--gold)',
  margin: '0 16px',
  textDecoration: 'none',
  '&:hover': {
    color: 'var(--gold-hover)',
    textDecoration: 'underline',
  }
});

const Footer = () => {
  return (
    <FooterContainer>
      <Box display="flex" justifyContent="center" mb={2}>
        <FooterLink to="/about">About Us</FooterLink>
        <FooterLink to="/privacy">Privacy Policy</FooterLink>
        <FooterLink to="/terms">Terms of Service</FooterLink>
        <FooterLink to="/contact">Contact</FooterLink>
      </Box>
      <Typography variant="body2" align="center" color="var(--p-color)">
        © {new Date().getFullYear()} AfroFeel Ads. All rights reserved.
      </Typography>
    </FooterContainer>
  );
};

export default Footer;