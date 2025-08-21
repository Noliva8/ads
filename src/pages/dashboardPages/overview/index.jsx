import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Button, 
  Divider, Chip, useTheme, IconButton 
} from '@mui/material';

import Grid from '@mui/material/Grid2';

import { 
  AttachMoney, Campaign, Visibility, 
  Person, TrendingUp, Add, Upload, 
  AccountBalance, AccessTime, Notifications, 
  ArrowDropUp, ArrowDropDown, MoreVert 
} from '@mui/icons-material';
import { tokens } from '../../../theme';


// project imports
import AdDisplay from './subOverview/AdDisplay';







// Mock data generators
const generateTrendData = (days = 30) => {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    impressions: Math.floor(Math.random() * 5000) + 1000,
    clicks: Math.floor(Math.random() * 500) + 50,
    conversions: Math.floor(Math.random() * 50) + 5,
  }));
};

const mockCampaigns = [
  { id: 1, name: 'Summer Sale', status: 'active', budget: 1200, spent: 845, ctr: 2.4, roas: 3.2 },
  { id: 2, name: 'New Product Launch', status: 'active', budget: 2000, spent: 1230, ctr: 1.8, roas: 2.7 },
  { id: 3, name: 'Brand Awareness', status: 'paused', budget: 1500, spent: 620, ctr: 1.2, roas: 1.5 },
];

const mockAudience = {
  age: { '18-24': 25, '25-34': 45, '35-44': 20, '45+': 10 },
  gender: { male: 60, female: 38, other: 2 },
  location: { Nigeria: 45, Kenya: 30, Ghana: 15, Other: 10 }
};

const mockNotifications = [
  { id: 1, message: 'Campaign "Summer Sale" reached 80% of budget', time: '2h ago', read: false },
  { id: 2, message: 'New feature: Audio ad analytics now available', time: '1d ago', read: true },
];


const Overview = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [timeRange, setTimeRange] = useState('30d');
  const trendData = generateTrendData();
  
  // Metric cards data
  const metrics = [
    { 
      title: "Total Spend", 
      value: "$2,450", 
      change: 12, 
      icon: <AttachMoney sx={{ color: colors.orange[500] }} />,
      tooltip: "Total ad spend this month"
    },
    { 
      title: "Active Campaigns", 
      value: "3", 
      status: "warning",
      icon: <Campaign sx={{ color: colors.orange[500] }} />,
      tooltip: "2 active, 1 paused"
    },
    { 
      title: "Impressions", 
      value: "124K", 
      change: 8.5,
      icon: <Visibility sx={{ color: colors.orange[500] }} />,
      tooltip: "Total ad views"
    },
    { 
      title: "Conversions", 
      value: "1,240", 
      change: -3.2,
      icon: <Person sx={{ color: colors.orange[500] }} />,
      tooltip: "Sign-ups/purchases"
    },
  ];

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold" color={colors.graySoft[200]}>
          Advertiser Dashboard
        </Typography>

        <Box display="flex" gap={1}>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            sx={{ 
              backgroundColor: colors.orange[500],
              '&:hover': { backgroundColor: colors.orange[600] }
            }}
          >
            New Campaign
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Upload />}
            sx={{ borderColor: colors.graySoft[300], color: colors.graySoft[100], display: {xs: 'none', md: 'flex'}}}
          >
            Upload Ad
          </Button>

        </Box>

      </Box>


      {/* Metric Cards */}
     <Grid container columnSpacing={3} rowSpacing={3} mb={4}>
        {metrics.map((metric, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ 
              backgroundColor: colors.blackNeutral[600],
              borderRadius: '8px',
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color={colors.graySoft[400]} gutterBottom>
                      {metric.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {metric.value}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    backgroundColor: colors.blackNeutral[500],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {metric.icon}
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center" mt={1}>
                  {metric.change ? (
                    <>
                      {metric.change > 0 ? (
                        <ArrowDropUp sx={{ color: colors.orangeAccent[500] }} />
                      ) : (
                        <ArrowDropDown sx={{ color: colors.redAccent[500] }} />
                      )}
                      <Typography 
                        variant="body2" 
                        color={metric.change > 0 ? colors.orangeAccent[500] : colors.redAccent[500]}
                      >
                        {Math.abs(metric.change)}%
                      </Typography>
                      <Typography variant="body2" color={colors.graySoft[400]} ml={1}>
                        vs last period
                      </Typography>
                    </>
                  ) : (
                    <Chip 
                      label={metric.status === 'warning' ? 'Needs review' : 'Active'} 
                      size="small"
                      sx={{ 
                        backgroundColor: metric.status === 'warning' ? colors.orange[800] : colors.greenAccent[800],
                        color: 'white'
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>






      {/* Performance Charts */}
      <Grid container columnSpacing={3} rowSpacing={3} mb={4}>

          <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ backgroundColor: colors.blackNeutral[600], borderRadius: '8px' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection='column' mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Ads Management
                </Typography >
                <AdDisplay embedded height={420} onCreateClick={() => {/* navigate */}} />
              </Box>
              






              {/* Chart Placeholder - Replace with actual chart library */}
              <Box 
                sx={{ 
                  height: 300, 
                  backgroundColor: colors.blackNeutral[500], 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.graySoft[400]
                }}
              >
                [Performance Chart - Connect to Chart.js/Recharts]
              </Box>
              
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="body2" color={colors.graySoft[400]}>
                  {timeRange === '7d' ? 'Last 7 days' : 
                   timeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
                </Typography>
                <Button size="small" endIcon={<MoreVert />} sx={{ color: colors.orange[500] }}>
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ backgroundColor: colors.blackNeutral[600], borderRadius: '8px', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Top Campaigns
              </Typography>
              
              {mockCampaigns.map((campaign, i) => (
                <Box key={i} mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="bold">{campaign.name}</Typography>
                    <Chip 
                      label={campaign.status} 
                      size="small"
                      sx={{ 
                        backgroundColor: campaign.status === 'active' ? colors.orangeAccent[800] : colors.graySoft[700],
                        color: 'white'
                      }}
                    />
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Box>
                      <Typography variant="body2" color={colors.graySoft[400]}>Spent</Typography>
                      <Typography>${campaign.spent} / ${campaign.budget}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color={colors.graySoft[400]}>ROAS</Typography>
                      <Typography>{campaign.roas}x</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color={colors.graySoft[400]}>CTR</Typography>
                      <Typography>{campaign.ctr}%</Typography>
                    </Box>
                  </Box>
                  
                  {i < mockCampaigns.length - 1 && <Divider sx={{ my: 2, borderColor: colors.blackNeutral[500] }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>



      {/* Quick Actions & Recent Activity */}
      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 4 }}>
         <Card sx={{ 
      backgroundColor: colors.blackNeutral[600], 
      borderRadius: '8px', 
      height: '100%', // make card fill Grid height
      display: 'flex',
      flexDirection: 'column',  // so CardContent behaves normally
    }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Quick Actions
              </Typography>
              
              <Button
                fullWidth
                variant="contained"
                startIcon={<AccountBalance />}
                sx={{ 
                  mb: 2,
                  backgroundColor: colors.orange[500],
                  '&:hover': { backgroundColor: colors.orange[600] }
                }}
              >
                Add Funds ($1,250 available)
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Upload />}
                sx={{ 
                  mb: 2,
                  borderColor: colors.graySoft[300], 
                  color: colors.graySoft[100],
                  '&:hover': { borderColor: colors.orange[500] }
                }}
              >
                Upload Audio Ad
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Upload />}
                sx={{ 
                  borderColor: colors.graySoft[300], 
                  color: colors.graySoft[100],
                  '&:hover': { borderColor: colors.orange[500] }
                }}
              >
                Upload Overlay Ad
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
             <Card sx={{ 
      backgroundColor: colors.blackNeutral[600], 
      borderRadius: '8px', 
      height: '100%', // make card fill Grid height
      display: 'flex',
      flexDirection: 'column',  // so CardContent behaves normally
    }}>
          <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Activity
                </Typography>
                <IconButton size="small" sx={{ color: colors.graySoft[400] }}>
                  <MoreVert />
                </IconButton>
              </Box>
              
              {mockNotifications.map((note, i) => (
                <Box key={i} mb={2}>
                  <Box display="flex" gap={2}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: !note.read ? colors.orange[500] : 'transparent',
                      mt: 1
                    }} />
                    <Box>
                      <Typography>{note.message}</Typography>
                      <Typography variant="body2" color={colors.graySoft[400]} display="flex" alignItems="center">
                        <AccessTime sx={{ fontSize: 14, mr: 0.5 }} /> {note.time}
                      </Typography>
                    </Box>
                  </Box>
                  {i < mockNotifications.length - 1 && <Divider sx={{ my: 2, borderColor: colors.blackNeutral[500] }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ backgroundColor: colors.blackNeutral[600], borderRadius: '8px' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Audience Insights
              </Typography>
              
              <Box mb={3}>
                <Typography variant="body2" color={colors.graySoft[400]} mb={1}>
                  Age Distribution
                </Typography>
                {/* Chart Placeholder */}
                <Box 
                  sx={{ 
                    height: 100, 
                    backgroundColor: colors.blackNeutral[500], 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.graySoft[400]
                  }}
                >
                  [Age Chart]
                </Box>
              </Box>
              
              <Box mb={3}>
                <Typography variant="body2" color={colors.graySoft[400]} mb={1}>
                  Top Locations
                </Typography>
                {Object.entries(mockAudience.location).map(([location, percent]) => (
                  <Box key={location} display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" sx={{ width: 80 }}>{location}</Typography>
                    <Box flex={1} ml={1}>
                      <Box 
                        sx={{ 
                          height: 8, 
                          width: `${percent}%`, 
                          backgroundColor: colors.orange[500],
                          borderRadius: '4px'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" ml={1}>{percent}%</Typography>
                  </Box>
                ))}
              </Box>
              
              <Box>
                <Typography variant="body2" color={colors.graySoft[400]} mb={1}>
                  Peak Engagement
                </Typography>
                <Box 
                  sx={{ 
                    height: 60, 
                    backgroundColor: colors.blackNeutral[500], 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.graySoft[400]
                  }}
                >
                  [Time Heatmap]
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Box>
  );
};

export default Overview;