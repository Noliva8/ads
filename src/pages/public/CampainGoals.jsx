import React from 'react';
import { Link } from 'react-router-dom';
import './CampaignGoals.css';

// Import any assets you might use (icons, images)
// import goalIcon1 from '../../assets/icons/goal-1.svg';

const CampaignGoals = () => {
  return (
    <div className="cg-container">
      {/* Hero Section */}
      <section className="cg-hero">
        <div className="cg-hero-content">
          <h1>Achieve Your Goals with <span>AfroFeel Ads</span></h1>
          <p className="cg-subtitle">
            From awareness to conversions — tailor your audio campaigns to drive real impact.
          </p>
          <div className="cg-cta-group">
            <Link to="/create-campaign" className="cg-primary-cta">
              Start Your Campaign
            </Link>
            <Link to="/case-studies" className="cg-secondary-cta">
              View Case Studies →
            </Link>
          </div>
        </div>
      </section>

      {/* Goal Categories Grid */}
      <section className="cg-value-prop">
        <div className="cg-section-header">
          <h2>What's Your Campaign Goal?</h2>
          <p>Select your primary objective to get started</p>
        </div>
        
        <div className="cg-goals-grid">
          {/* Brand Awareness */}
          <div className="cg-goal-card">
            <div className="cg-goal-icon" style={{ backgroundColor: '#FFEEB2' }}>✅</div>
            <h3>Brand Awareness</h3>
            <p>Get your name heard by millions of African music lovers with top-of-mind recall and immersive audio placements.</p>
          </div>
          
          {/* Engagement */}
          <div className="cg-goal-card">
            <div className="cg-goal-icon" style={{ backgroundColor: '#D4F1F9' }}>📈</div>
            <h3>Engagement</h3>
            <p>Drive interaction through skippable overlays and banners that prompt users to visit your site or explore your product.</p>
          </div>
          
          {/* Conversions */}
          <div className="cg-goal-card">
            <div className="cg-goal-icon" style={{ backgroundColor: '#E8D5FF' }}>🛒</div>
            <h3>Conversions</h3>
            <p>Direct traffic to your store, landing page, or booking form and track clicks and purchases in real time.</p>
          </div>
          
          {/* Event Promotion */}
          <div className="cg-goal-card">
            <div className="cg-goal-icon" style={{ backgroundColor: '#FFD6D6' }}>🎟️</div>
            <h3>Event Promotion</h3>
            <p>Promote your concert or launch with high-visibility placements across mobile and desktop.</p>
          </div>
          
          {/* Product Education */}
          <div className="cg-goal-card">
            <div className="cg-goal-icon" style={{ backgroundColor: '#C8F7DC' }}>📊</div>
            <h3>Product Education</h3>
            <p>Use storytelling audio ads or banners to teach users about your features and benefits in seconds.</p>
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="cg-process">
        <div className="cg-section-header">
          <h2>How We Help You Reach These Goals</h2>
          <p>Our platform delivers measurable results</p>
        </div>
        
        <div className="cg-steps">
          <div className="cg-step">
            <div className="cg-step-number">1</div>
            <h3>Smart Targeting</h3>
            <p>By genre, mood, location, and listening habits</p>
          </div>
          
          <div className="cg-step">
            <div className="cg-step-number">2</div>
            <h3>Real-time Reporting</h3>
            <p>Track impressions, clicks, and conversions live</p>
          </div>
          
          <div className="cg-step">
            <div className="cg-step-number">3</div>
            <h3>Creative Support</h3>
            <p>Our team helps optimize your audio & visuals</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="cg-social-proof">
        <h2>Success Stories</h2>
        <div className="cg-testimonial-card">
          <p>"AfroFeel Ads drove a 140% increase in app installs for our music streaming service."</p>
          <span>- MusicTech Lagos</span>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cg-final-cta">
        <h2>Let's build a campaign that aligns with your goals.</h2>
        <Link to="/create-campaign" className="cg-primary-cta cg-large">
          Create My Campaign
        </Link>
      </section>
    </div>
  );
};

export default CampaignGoals;