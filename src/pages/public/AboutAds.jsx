// import React from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Grid,
//   Paper,
//   useTheme,
//   useMediaQuery,
//   Avatar,
//   Divider,
//   Stack
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';

// // Icons
// import BarChartIcon from '@mui/icons-material/BarChart';
// import TargetIcon from '@mui/icons-material/Adjust';
// import GroupsIcon from '@mui/icons-material/Groups';
// import SpeedIcon from '@mui/icons-material/Speed';
// import ShieldIcon from '@mui/icons-material/Shield';
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

// // Team images (replace with your actual images)
// import Team1 from "../../assets/images/Team1.jpg"
// import Team2 from "../../assets/images/Team2.jpg"
// import Team3 from "../../assets/images/Team3.jpg"

// const GradientButton = styled(Button)(({ theme }) => ({
//   background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
//   color: 'white',
//   padding: '12px 32px',
//   borderRadius: '50px',
//   fontWeight: 700,
//   textTransform: 'none',
//   boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
//   '&:hover': {
//     transform: 'translateY(-2px)',
//     boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
//   },
//   transition: 'all 0.3s ease',
// }));

// const StatCard = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   borderRadius: '16px',
//   textAlign: 'center',
//   height: '100%',
//   background: theme.palette.mode === 'dark' 
//     ? 'rgba(26, 26, 26, 0.7)' 
//     : 'rgba(255, 255, 255, 0.9)',
//   backdropFilter: 'blur(10px)',
//   border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#eee'}`,
// }));

// const TeamMemberCard = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   borderRadius: '16px',
//   textAlign: 'center',
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     transform: 'translateY(-8px)',
//     boxShadow: theme.shadows[8],
//   },
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
// }));

// const AboutAds = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

//   const features = [
//     {
//       icon: <TargetIcon fontSize="large" color="primary" />,
//       title: "Precision Targeting",
//       description: "Reach exactly the right audience with our advanced targeting options."
//     },
//     {
//       icon: <BarChartIcon fontSize="large" color="primary" />,
//       title: "Data-Driven Results",
//       description: "Make decisions based on real-time analytics and performance metrics."
//     },
//     {
//       icon: <SpeedIcon fontSize="large" color="primary" />,
//       title: "Lightning Fast",
//       description: "Get your campaigns running in minutes, not days."
//     },
//     {
//       icon: <ShieldIcon fontSize="large" color="primary" />,
//       title: "Trusted & Secure",
//       description: "Enterprise-grade security protecting your data and campaigns."
//     },
//     {
//       icon: <MonetizationOnIcon fontSize="large" color="primary" />,
//       title: "Maximize ROI",
//       description: "Optimize your ad spend with our intelligent bidding system."
//     },
//     {
//       icon: <GroupsIcon fontSize="large" color="primary" />,
//       title: "Dedicated Support",
//       description: "Our team is here to help you succeed with your campaigns."
//     }
//   ];

//   const stats = [
//     { value: "10K+", label: "Active Advertisers" },
//     { value: "500M+", label: "Impressions Monthly" },
//     { value: "60+", label: "Countries Reached" },
//     { value: "24/7", label: "Support Available" }
//   ];

//   const team = [
//     { 
//       name: "Alex Johnson", 
//       role: "Founder & CEO", 
//       image: Team1,
//       bio: "Advertising technology expert with 15+ years experience."
//     },
//     { 
//       name: "Sarah Williams", 
//       role: "CTO", 
//       image: Team2,
//       bio: "Leads our technical innovation and platform development."
//     },
//     { 
//       name: "Michael Chen", 
//       role: "Head of Ad Operations", 
//       image: Team3,
//       bio: "Ensures your campaigns perform at their peak potential."
//     }
//   ];

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         background: theme.palette.mode === 'dark' 
//           ? 'radial-gradient(circle at top, #1a5d5d 0%, #0F0F0F 70%)' 
//           : 'radial-gradient(circle at top, #e0f7fa 0%, #FFFFFF 70%)',
//         pt: 12,
//         pb: 10,
//         px: 2
//       }}
//     >
//       <Container maxWidth="lg">
//         {/* Hero Section */}
//         <Box sx={{ 
//           textAlign: 'center', 
//           mb: 10,
//           mt: isMobile ? 4 : 8
//         }}>
//           <Typography 
//             variant={isMobile ? 'h4' : 'h2'} 
//             component="h1" 
//             gutterBottom
//             sx={{ 
//               fontWeight: 800,
//               lineHeight: 1.2,
//               mb: 3,
//               background: theme.palette.mode === 'dark'
//                 ? 'linear-gradient(90deg, #E4C421, #F8D347)'
//                 : 'linear-gradient(90deg, #1a5d5d, #441a49)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent'
//             }}
//           >
//             Powering the Future of Digital Advertising
//           </Typography>
          
//           <Typography 
//             variant={isMobile ? 'body1' : 'h6'} 
//             color="text.secondary" 
//             sx={{ 
//               maxWidth: '800px', 
//               mx: 'auto',
//               mb: 4
//             }}
//           >
//             AfroFeel Ads is a next-generation advertising platform designed to help businesses of all sizes reach their ideal customers and maximize their marketing ROI through innovative technology and data-driven strategies.
//           </Typography>
          
//           <GradientButton 
//             size={isMobile ? 'medium' : 'large'}
//             onClick={() => navigate('/get-started')}
//             sx={{ mx: 'auto' }}
//           >
//             Start Advertising Today
//           </GradientButton>
//         </Box>

//         {/* Mission Section */}
//         <Box sx={{ 
//           mb: 10,
//           p: 6,
//           borderRadius: '16px',
//           background: theme.palette.mode === 'dark'
//             ? 'linear-gradient(to right, rgba(26, 26, 26, 0.8), rgba(68, 26, 73, 0.5))'
//             : 'linear-gradient(to right, rgba(234, 245, 255, 0.8), rgba(240, 240, 255, 0.8))',
//           backdropFilter: 'blur(10px)',
//           border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#ddd'}`
//         }}>
//           <Typography 
//             variant="h4" 
//             gutterBottom
//             sx={{ 
//               fontWeight: 700,
//               mb: 3,
//               color: theme.palette.mode === 'dark' ? '#E4C421' : '#1a5d5d'
//             }}
//           >
//             Our Mission
//           </Typography>
//           <Typography 
//             variant="body1" 
//             sx={{ 
//               fontSize: isMobile ? '1rem' : '1.2rem',
//               lineHeight: 1.7,
//               mb: 4
//             }}
//           >
//             To democratize access to premium advertising technology, enabling businesses of all sizes to compete effectively in the digital marketplace. We believe in transparent, results-driven advertising that creates value for both advertisers and consumers.
//           </Typography>
//           <Divider sx={{ my: 4, borderColor: theme.palette.mode === 'dark' ? '#333' : '#eee' }} />
//           <Typography 
//             variant="h5" 
//             gutterBottom
//             sx={{ 
//               fontWeight: 700,
//               mb: 3,
//               color: theme.palette.mode === 'dark' ? '#E4C421' : '#441a49'
//             }}
//           >
//             Our Values
//           </Typography>
//           <Grid container spacing={4}>
//             <Grid item xs={12} md={4}>
//               <Typography variant="h6" color="primary" gutterBottom>
//                 Transparency
//               </Typography>
//               <Typography variant="body1">
//                 No hidden fees or black-box algorithms. We show you exactly how your campaigns perform.
//               </Typography>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Typography variant="h6" color="primary" gutterBottom>
//                 Innovation
//               </Typography>
//               <Typography variant="body1">
//                 Constantly evolving our platform to incorporate the latest advertising technologies.
//               </Typography>
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Typography variant="h6" color="primary" gutterBottom>
//                 Results
//               </Typography>
//               <Typography variant="body1">
//                 We measure our success by the success of your campaigns and your satisfaction.
//               </Typography>
//             </Grid>
//           </Grid>
//         </Box>

//         {/* Features Section */}
//         <Box sx={{ mb: 10 }}>
//           <Typography 
//             variant="h4" 
//             align="center" 
//             gutterBottom
//             sx={{ 
//               fontWeight: 700,
//               mb: 6,
//               color: theme.palette.mode === 'dark' ? '#E4C421' : '#441a49'
//             }}
//           >
//             Why Advertisers Choose Us
//           </Typography>
          
//           <Grid container spacing={4}>
//             {features.map((feature, index) => (
//               <Grid item xs={12} sm={6} md={4} key={index}>
//                 <Paper elevation={3} sx={{ 
//                   p: 4,
//                   height: '100%',
//                   borderRadius: '16px',
//                   backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#FFFFFF'
//                 }}>
//                   <Box sx={{ 
//                     mb: 3,
//                     p: 2,
//                     borderRadius: '50%',
//                     display: 'inline-flex',
//                     backgroundColor: theme.palette.mode === 'dark' 
//                       ? 'rgba(228, 196, 33, 0.1)' 
//                       : 'rgba(68, 26, 73, 0.1)'
//                   }}>
//                     {feature.icon}
//                   </Box>
//                   <Typography 
//                     variant="h6" 
//                     component="h3" 
//                     gutterBottom
//                     sx={{ fontWeight: 700 }}
//                   >
//                     {feature.title}
//                   </Typography>
//                   <Typography 
//                     variant="body1" 
//                     color="text.secondary"
//                   >
//                     {feature.description}
//                   </Typography>
//                 </Paper>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>

//         {/* Stats Section */}
//         <Box sx={{ mb: 10 }}>
//           <Grid container spacing={4}>
//             {stats.map((stat, index) => (
//               <Grid item xs={6} sm={3} key={index}>
//                 <StatCard elevation={0}>
//                   <Typography 
//                     variant="h3" 
//                     component="div"
//                     sx={{ 
//                       fontWeight: 800,
//                       mb: 1,
//                       color: theme.palette.mode === 'dark' ? '#E4C421' : '#1a5d5d'
//                     }}
//                   >
//                     {stat.value}
//                   </Typography>
//                   <Typography 
//                     variant="subtitle1" 
//                     color="text.secondary"
//                   >
//                     {stat.label}
//                   </Typography>
//                 </StatCard>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>

//         {/* Team Section */}
//         <Box sx={{ mb: 10 }}>
//           <Typography 
//             variant="h4" 
//             align="center" 
//             gutterBottom
//             sx={{ 
//               fontWeight: 700,
//               mb: 6,
//               color: theme.palette.mode === 'dark' ? '#E4C421' : '#441a49'
//             }}
//           >
//             Meet Our Leadership
//           </Typography>
          
//           <Grid container spacing={4} justifyContent="center">
//             {team.map((member, index) => (
//               <Grid item xs={12} sm={6} md={4} key={index}>
//                 <TeamMemberCard elevation={3}>
//                   <Avatar
//                     alt={member.name}
//                     src={member.image}
//                     sx={{ 
//                       width: 120, 
//                       height: 120,
//                       mx: 'auto',
//                       mb: 3,
//                       border: `3px solid ${theme.palette.mode === 'dark' ? '#E4C421' : '#1a5d5d'}` 
//                     }}
//                   />
//                   <Typography 
//                     variant="h6" 
//                     component="h3" 
//                     gutterBottom
//                     sx={{ fontWeight: 700 }}
//                   >
//                     {member.name}
//                   </Typography>
//                   <Typography 
//                     variant="subtitle1" 
//                     color="primary"
//                     gutterBottom
//                   >
//                     {member.role}
//                   </Typography>
//                   <Typography 
//                     variant="body1" 
//                     color="text.secondary"
//                   >
//                     {member.bio}
//                   </Typography>
//                 </TeamMemberCard>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>

//         {/* Final CTA */}
//         <Box sx={{ 
//           textAlign: 'center',
//           p: 6,
//           borderRadius: '16px',
//           backgroundColor: theme.palette.mode === 'dark' 
//             ? 'rgba(26, 93, 93, 0.3)' 
//             : 'rgba(26, 93, 93, 0.1)',
//           backdropFilter: 'blur(10px)',
//           border: `1px solid ${theme.palette.mode === 'dark' ? '#1a5d5d' : '#a3d5d5'}`
//         }}>
//           <Typography 
//             variant={isMobile ? 'h5' : 'h4'} 
//             component="h2" 
//             gutterBottom
//             sx={{ fontWeight: 700, mb: 3 }}
//           >
//             Ready to Transform Your Advertising?
//           </Typography>
//           <Typography 
//             variant={isMobile ? 'body1' : 'h6'} 
//             color="text.secondary" 
//             sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}
//           >
//             Join thousands of businesses growing with AfroFeel Ads today.
//           </Typography>
//           <Stack 
//             direction={isMobile ? 'column' : 'row'} 
//             spacing={2} 
//             justifyContent="center"
//           >
//             <GradientButton 
//               size={isMobile ? 'medium' : 'large'}
//               onClick={() => navigate('/get-started')}
//             >
//               Get Started Free
//             </GradientButton>
//             <Button 
//               variant="outlined" 
//               size={isMobile ? 'medium' : 'large'}
//               sx={{
//                 borderRadius: '50px',
//                 fontWeight: 700,
//                 textTransform: 'none',
//                 borderWidth: '2px',
//                 color: theme.palette.mode === 'dark' ? '#E4C421' : '#1a5d5d',
//                 borderColor: theme.palette.mode === 'dark' ? '#E4C421' : '#1a5d5d',
//                 '&:hover': {
//                   borderWidth: '2px',
//                   backgroundColor: theme.palette.mode === 'dark' ? 'rgba(228, 196, 33, 0.1)' : 'rgba(26, 93, 93, 0.1)'
//                 }
//               }}
//               onClick={() => navigate('/contact')}
//             >
//               Contact Sales
//             </Button>
//           </Stack>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default AboutAds;




import React from 'react';
import './aboutAds.css';

const AboutAds = () => {
  const formats = [
    {
      title: "Audio Ads",
      icon: "🎧",
      specs: [
        "🗣 Format: Audio (MP3/WAV)",
        "📍 Placement: Between songs every 15 minutes",
        "⏱ Duration: 0–30 seconds"
      ],
      benefits: [
        "Captures attention without screen dependency",
        "High retention due to immersive listening",
        "Brand-safe and user-friendly pacing"
      ],
      insight: "Non-skippable audio ads have ~24% higher recall than display ads (per Spotify benchmark)",
      bestFor: ["Music releases", "Brand awareness", "Local promotions"]
    },
    {
      title: "Overlay Ads (Skippable Banners)",
      icon: "🖼",
      specs: [
        "Format: 400x400px PNG/JPG",
        "Placement: On player UI during playback",
        "Visibility: Always visible unless skipped"
      ],
      benefits: [
        "Visually reinforces audio message",
        "Drives real-time interaction",
        "Ideal for product exposure"
      ],
      ctaExample: "🔘 CTA Examples: 'Shop Now' | 'Learn More' | 'Download'",
      bestFor: ["App installs", "Product launches", "Restaurant promotions"]
    },
    {
      title: "Desktop-Only Sidebar Ads",
      icon: "💻",
      specs: [
        "Format: 300x600px or 300x250px",
        "Placement: Right-side of desktop app",
        "Inventory: One ad per user at a time"
      ],
      benefits: [
        "Non-intrusive but always visible",
        "Premium visibility real estate",
        "High click-through rates"
      ],
      note: "Premium inventory with limited availability",
      bestFor: ["High-value conversions", "Service promotions", "Event tickets"]
    },
    {
      title: "Concert & Song Highlights",
      icon: "🎤",
      specs: [
        "Format: Poster-style or video trailer",
        "Placement: Homepage & trending sections",
        "Duration: 7–30 day campaigns"
      ],
      benefits: [
        "Editorial feel blends with content",
        "Builds artist credibility",
        "Drives pre-event engagement"
      ],
      example: "Example: Highlight Burna Boy's Lagos concert 2 weeks before event",
      bestFor: ["Concert promotions", "New singles", "Album releases"]
    }
  ];

  return (
    <div className="af-container">
      <section className="af-hero">
        <h1>Premium Ad Formats <span>Built for Music</span></h1>
        <p>Engage millions of African music lovers through formats designed for audio-first experiences</p>
      </section>

      <div className="af-formats-grid">
        {formats.map((format, index) => (
          <div key={index} className="af-format-card">
            <div className="af-format-header">
              <div className="af-format-icon">{format.icon}</div>
              <h2>{format.title}</h2>
            </div>
            
            <div className="af-specs">
              <h3>Specifications</h3>
              <ul>
                {format.specs.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </div>
            
            <div className="af-benefits">
              <h3>Key Benefits</h3>
              <ul>
                {format.benefits.map((benefit, i) => (
                  <li key={i}>✓ {benefit}</li>
                ))}
              </ul>
            </div>
            
            {format.insight && (
              <div className="af-insight">
                <h3>Industry Insight</h3>
                <p>{format.insight}</p>
              </div>
            )}
            
            {format.ctaExample && (
              <div className="af-cta-example">
                <p>{format.ctaExample}</p>
              </div>
            )}
            
            <div className="af-best-for">
              <h3>Best For</h3>
              <div className="af-tags">
                {format.bestFor.map((useCase, i) => (
                  <span key={i} className="af-tag">{useCase}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutAds;


