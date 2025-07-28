import React from 'react';
import { FiHeadphones, FiImage, FiMusic, FiStar } from 'react-icons/fi';
import './Pricing.css';

const Pricing = () => {
  return (
    <section className="pricing-section">
      <div className="pricing-header">
        <h2>Simple, Transparent Pricing</h2>
        <p>Start reaching African music lovers today – upgrade anytime</p>
      </div>

      <div className="pricing-grid">
        {/* Audio Ad Card */}
        <div className="pricing-card audio-card">
          <div className="card-header">
            <div className="card-icon">
              <FiHeadphones />
            </div>
            <h3>Audio Ads</h3>
            <p>Connect through sound</p>
          </div>
          <div className="card-price">
            <span className="price">$14.99</span>
            <span className="duration">/ week</span>
          </div>
          <ul className="card-features">
            <li>Up to 30-second audio</li>
            <li>5,000+ impressions</li>
            <li>Country-level targeting</li>
            <li>Basic analytics</li>
          </ul>
          <button className="card-cta">Start Audio Campaign</button>
        </div>

        {/* Visual Ad Card */}
        <div className="pricing-card visual-card">
          <div className="card-header">
            <div className="card-icon">
              <FiImage />
            </div>
            <h3>Visual Ads</h3>
            <p>Eyes on your brand</p>
          </div>
          <div className="card-price">
            <span className="price">$6.99</span>
            <span className="duration">/ week</span>
          </div>
          <ul className="card-features">
            <li>Banner or sidebar placement</li>
            <li>7-day duration</li>
            <li>Mobile + desktop</li>
            <li>Click tracking</li>
          </ul>
          <button className="card-cta">Launch Visual Ad</button>
        </div>

        {/* Spotlight Card */}
        <div className="pricing-card spotlight-card">
          <div className="card-header">
            <div className="card-icon">
              <FiStar />
            </div>
            <h3>Spotlight</h3>
            <p>Premium visibility</p>
          </div>
          <div className="card-price">
            <span className="price">$24.99</span>
            <span className="duration">/ weekend</span>
          </div>
          <ul className="card-features">
            <li>Homepage placement</li>
            <li>48-hour feature</li>
            <li>Push notification</li>
            <li>Performance report</li>
          </ul>
          <button className="card-cta">Get Spotlight</button>
        </div>

        {/* Bundle Card */}
        <div className="pricing-card bundle-card">
          <div className="card-header">
            <div className="card-icon">
              <FiMusic />
            </div>
            <h3>Combo Pack</h3>
            <p>Best value</p>
            <div className="popular-badge">Most Popular</div>
          </div>
          <div className="card-price">
            <span className="price">$29.99</span>
            <span className="duration">/ week</span>
          </div>
          <ul className="card-features">
            <li>30-sec audio + banner</li>
            <li>10,000+ impressions</li>
            <li>Genre targeting included</li>
            <li>Enhanced analytics</li>
          </ul>
          <button className="card-cta">Save 25%</button>
        </div>
      </div>

      <div className="pricing-footer">
        <p>Need custom solutions? <a href="#">Contact our ad team</a></p>
      </div>
    </section>
  );
};

export default Pricing;