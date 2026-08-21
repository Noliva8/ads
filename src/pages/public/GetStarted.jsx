import React from 'react';
import { Link } from 'react-router-dom';
import './GetStarted.css';
import gettingStarted from '../../assets/images/gettingStarted.jpg'
import { brand } from '../../brand';

const GetStarted = () => {


  return (
    <div className="gs-container">

      {/* Hero Section */}

      
      <section className="gs-hero">


        <div className="gs-hero-content">
          <h1>Amplify Your Music with <span>Targeted Audio Ads</span></h1>
          <p className="gs-subtitle">
            Reach millions of African music lovers through {brand.productName}' premium audio ad network.
            <br />Performance-driven campaigns with real-time analytics.
          </p>
          <div className="gs-cta-group">
            <Link to="/get-started" className="gs-primary-cta">
              Launch Your Campaign
            </Link>
            <Link to="/case-studies" className="gs-secondary-cta">
              See Case Studies →
            </Link>
          </div>
        </div>
        <div className="gs-hero-visual">
          <img src={gettingStarted} alt="Woman enjoying music" />
        </div>
      </section>

      {/* Value Proposition */}
      <section className="gs-value-prop">
        <div className="gs-section-header">
          <h2>Why Advertise on {brand.companyName}?</h2>
          <p>We combine cultural relevance with cutting-edge targeting</p>
        </div>
        
        <div className="gs-features-grid">
          <div className="gs-feature-card">
            <div className="gs-feature-icon" style={{ backgroundColor: '#FFEEB2' }}>🎯</div>
            <h3>Hyper-Targeted</h3>
            <p>Reach listeners by genre, location, device, and listening habits with our AI-powered targeting</p>
          </div>
          
          <div className="gs-feature-card">
            <div className="gs-feature-icon" style={{ backgroundColor: '#D4F1F9' }}>📊</div>
            <h3>Real Results</h3>
            <p>Average 3.2x higher conversion rates compared to social media ads for music products</p>
          </div>
          
          <div className="gs-feature-card">
            <div className="gs-feature-icon" style={{ backgroundColor: '#E8D5FF' }}>🎧</div>
            <h3>Captive Audience</h3>
            <p>Users spend 47 minutes per session immersed in our music platform - your ads get real attention</p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="gs-social-proof">
        <h2>Trusted by Africa's Top Music Brands</h2>
        <div className="gs-logos-grid">
          {['Universal', 'Sony', 'MTN', 'Guinness', 'Spotify', 'Boomplay'].map(brand => (
            <div key={brand} className="gs-logo-item">
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="gs-process">
        <div className="gs-section-header">
          <h2>Simple Campaign Setup</h2>
          <p>Get your audio ads running in minutes</p>
        </div>
        
        <div className="gs-steps">
          <div className="gs-step">
            <div className="gs-step-number">1</div>
            <h3>Upload Your Audio</h3>
            <p>Record a custom ad or use our AI voiceover tool</p>
          </div>
          
          <div className="gs-step">
            <div className="gs-step-number">2</div>
            <h3>Set Your Audience</h3>
            <p>Define who hears your message with precise targeting</p>
          </div>
          
          <div className="gs-step">
            <div className="gs-step-number">3</div>
            <h3>Launch & Optimize</h3>
            <p>Track performance and adjust in real-time</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="gs-final-cta">
        <h2>Ready to Amplify Your Reach?</h2>
        <p>Join hundreds of brands growing with {brand.productName}</p>
        <Link to="/get-started" className="gs-primary-cta gs-large">
          Get Started - First $50 Free
        </Link>
      </section>
    </div>
  );
};

export default GetStarted;
