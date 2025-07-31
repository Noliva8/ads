import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Campaign as CampaignIcon,
  Payment as PaymentIcon,
  CloudUpload as UploadIcon,
  Settings as SettingsIcon,
  BarChart as AnalyticsIcon,
  Group as AudienceIcon,
  HelpOutline as HelpIcon,
  Receipt as ReceiptIcon,
  Flag as FlagIcon
} from '@mui/icons-material';

const StyledIcon = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'inherit',
  '& .MuiSvgIcon-root': {
    fontSize: '1.25rem',
  },
  '&.active': {
    color: 'var(--primary-accent)',
  }
});

export const SidebarIcons = {
  Dashboard: (props) => <StyledIcon {...props}><DashboardIcon /></StyledIcon>,
  Campaigns: (props) => <StyledIcon {...props}><CampaignIcon /></StyledIcon>,
  Analytics: (props) => <StyledIcon {...props}><AnalyticsIcon /></StyledIcon>,
  Audience: (props) => <StyledIcon {...props}><AudienceIcon /></StyledIcon>,
  Upload: (props) => <StyledIcon {...props}><UploadIcon /></StyledIcon>,
  Billing: (props) => <StyledIcon {...props}><PaymentIcon /></StyledIcon>,
  Invoices: (props) => <StyledIcon {...props}><ReceiptIcon /></StyledIcon>,
  Reports: (props) => <StyledIcon {...props}><FlagIcon /></StyledIcon>,
  Settings: (props) => <StyledIcon {...props}><SettingsIcon /></StyledIcon>,
  Help: (props) => <StyledIcon {...props}><HelpIcon /></StyledIcon>
};