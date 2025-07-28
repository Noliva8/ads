import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CreativeLab.css';
import audioAdvert from "../../assets/images/audioAdvert.jpg";

const CreativeLab = () => {
  const [activeTab, setActiveTab] = useState('formats');
  const [scriptInput, setScriptInput] = useState('');
  const [musicGenre, setMusicGenre] = useState('Afrobeat');
  const [soundEffect, setSoundEffect] = useState('Cash register');

  // Sample data
  const winningFormats = [
    {
      id: 1,
      title: "The Hook Opening",
      description: "Start with a 3-second musical sting matching your target genre",
      stat: "40% higher recall",
      icon: "🎶",
      example: "🔥 Used by MTN to boost engagement"
    },
    {
      id: 2,
      title: "Pidgin Punchline",
      description: "Close with local slang for memorability",
      stat: "2.3x more shares",
      icon: "🗣️",
      example: "🚀 Increased shares for Guinness campaign"
    },
    {
      id: 3,
      title: "Celebrity Voiceover",
      description: "Feature popular artists for credibility",
      stat: "3.1x conversion lift",
      icon: "🌟",
      example: "💫 Burna Boy boosted conversions"
    }
  ];

  const culturalInsights = [
    {
      region: "West Africa",
      tip: "Use high-energy Afrobeat for youth campaigns",
      example: "Burna Boy campaign analysis"
    },
    {
      region: "East Africa",
      tip: "Swahili phrases increase trust in financial ads",
      example: "M-Pesa case study"
    },
    {
      region: "Southern Africa",
      tip: "Local language hooks improve retention",
      example: "Vodacom success story"
    }
  ];

  const generateScript = () => {
    return `🎵 [5-sec ${musicGenre} intro]\n🗣️ "${scriptInput}"\n🔊 [${soundEffect} sound effect]`;
  };

  return (
    <div className="creative-lab">
      {/* Hero Section */}
      <section className="cl-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${audioAdvert})` }}>
        <div className="cl-hero-content">
          <h1>Creative <span className="highlight">Lab</span></h1>
          <p className="hero-subtitle">
            Africa's premier audio ad toolkit - proven templates, cultural insights, and real performance data
          </p>
          <div className="cta-group">
            <Link to="/template-library" className="btn btn-primary">
              Explore Templates
            </Link>
            <Link to="/trends" className="btn btn-secondary">
              View Trends Report
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="content-container">
        {/* Interactive Tabs */}
        <section className="section-tabs">
          <div className="tabs-container">
            <button 
              className={`tab-button ${activeTab === 'formats' ? 'active' : ''}`}
              onClick={() => setActiveTab('formats')}
            >
              Winning Formats
            </button>
            <button 
              className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              Cultural Insights
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'formats' && (
              <div className="formats-grid">
                {winningFormats.map(item => (
                  <div key={item.id} className="format-card">
                    <div className="card-header">
                      <span className="format-icon">{item.icon}</span>
                      <h3>{item.title}</h3>
                    </div>
                    <p className="card-description">{item.description}</p>
                    <div className="performance-badge">
                      <span>{item.stat}</span>
                    </div>
                    <div className="example-text">
                      {item.example}
                    </div>
                    <button className="btn btn-small">View Case Study</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="insights-grid">
                {culturalInsights.map((insight, index) => (
                  <div key={index} className="insight-card">
                    <h3>{insight.region}</h3>
                    <p className="insight-tip">{insight.tip}</p>
                    <Link to="#" className="insight-link">
                      {insight.example} →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Script Builder */}
        <section className="script-builder-section">
          <div className="section-header">
            <h2>Audio Script Generator</h2>
            <p className="section-subtitle">Create high-converting scripts in minutes</p>
          </div>
          
          <div className="script-builder">
            <div className="builder-controls">
              <div className="form-group">
                <label>Music Genre</label>
                <select 
                  className="form-input"
                  value={musicGenre}
                  onChange={(e) => setMusicGenre(e.target.value)}
                >
                  <option>Afrobeat</option>
                  <option>Amapiano</option>
                  <option>Highlife</option>
                  <option>Afropop</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Main Message</label>
                <textarea 
                  className="form-input" 
                  rows="4"
                  value={scriptInput}
                  onChange={(e) => setScriptInput(e.target.value)}
                  placeholder="e.g. 'Get 20% off this weekend only!'"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Sound Effect</label>
                <select 
                  className="form-input"
                  value={soundEffect}
                  onChange={(e) => setSoundEffect(e.target.value)}
                >
                  <option>Cash register</option>
                  <option>App notification</option>
                  <option>Crowd cheer</option>
                  <option>Phone ringing</option>
                </select>
              </div>
              
              <button 
                className="btn btn-primary"
                onClick={() => alert(generateScript())}
              >
                Generate Script
              </button>
            </div>
            
            <div className="script-preview">
              <h3>Your Script Preview</h3>
              <div className="preview-output">
                {scriptInput ? (
                  <pre>{generateScript()}</pre>
                ) : (
                  <p className="placeholder-text">Your generated script will appear here</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Resource Library */}
        <section className="resources-section">
          <div className="section-header">
            <h2>Resource Library</h2>
            <p className="section-subtitle">Download our latest guides and assets</p>
          </div>
          
          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon">📄</div>
              <h3>Audio Ad Production Guide</h3>
              <p className="resource-meta">PDF • 2.4MB</p>
              <p className="resource-description">Complete guide to recording professional audio ads</p>
              <button className="btn btn-small">Download</button>
            </div>
            
            <div className="resource-card">
              <div className="resource-icon">🎧</div>
              <h3>Top Performing Ads (2023)</h3>
              <p className="resource-meta">ZIP • 45MB</p>
              <p className="resource-description">20 highest-converting ads with analysis</p>
              <button className="btn btn-small">Download</button>
            </div>
            
            <div className="resource-card">
              <div className="resource-icon">📊</div>
              <h3>2024 Trends Report</h3>
              <p className="resource-meta">PDF • 5.1MB</p>
              <p className="resource-description">Emerging audio ad trends across Africa</p>
              <button className="btn btn-small">Download</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CreativeLab;