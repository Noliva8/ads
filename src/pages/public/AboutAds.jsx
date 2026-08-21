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


