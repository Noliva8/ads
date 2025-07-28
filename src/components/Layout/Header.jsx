import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { isLoggedInVar } from '../../Apollo/cashe';
import './header.css';
import { SitemarkIcon } from '../ui/customIcon';






const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Responsive behavior for mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = (title) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  return (
  <header className={`af-header ${scrolled ? "scrolled" : ""}`} ref={headerRef}>
    <div className="af-header-container">
      {/* Logo - Left aligned */}
      <Link to="/" className="af-logo">
        <SitemarkIcon />
      </Link>

      {/* Desktop Navigation - Right aligned */}
      <div className="af-desktop-nav">
        <nav className="af-primary-nav">
          <DropdownMenu
            title="Products"
            isOpen={activeDropdown === "Products"}
            toggle={() => toggleDropdown("Products")}
          >
            <Link to="/about-ads">Ad Formats</Link>
            <Link to="/Ads-campain">Campaign Goals</Link>
            <Link to="/Creative-Studio">Creative Lab</Link>
            <Link to="/pricing">Pricing</Link>
          </DropdownMenu>
        </nav>

        <nav className="af-utility-nav">
          <DropdownMenu
            title="Resources"
            rightAlign
            isOpen={activeDropdown === "Resources"}
            toggle={() => toggleDropdown("Resources")}
          >
            <Link to="/case-studies">Case Studies</Link>
            <Link to="/api-docs">API Documentation</Link>
            <Link to="/help-center">Help Center</Link>
          </DropdownMenu>

          <Link to="/ad-account-signup" className="af-cta-button">
            Create Ad Account
          </Link>
        </nav>
      </div>

      {/* Mobile Hamburger */}
      <button
        className={`af-hamburger ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

      {/* Mobile Menu */}
      <div
        className={`af-mobile-menu ${mobileMenuOpen ? "open" : ""}`}
        ref={mobileMenuRef}
      >
        <div className="af-mobile-menu-inner">
          <DropdownMenu
            title="Products"
            mobile
            isOpen={activeDropdown === "MobileProducts"}
            toggle={() => toggleDropdown("MobileProducts")}
          >
            <Link to="/about-ads">Ad Formats</Link>
            <Link to="/Ads-campain">Campaign Goals</Link>
            <Link to="/Creative-Studio">Creative Lab</Link>
            <Link to="/pricing">Pricing</Link>
          </DropdownMenu>

          <DropdownMenu
            title="Resources"
            mobile
            isOpen={activeDropdown === "MobileResources"}
            toggle={() => toggleDropdown("MobileResources")}
          >
            <Link to="/case-studies">Case Studies</Link>
            <Link to="/api-docs">API Documentation</Link>
            <Link to="/help-center">Help Center</Link>
          </DropdownMenu>

          <Link to="/ad-account-signup" className="af-cta-button mobile">
            Create Ad Account
          </Link>
        </div>
      </div>
    </header>
  );
};



const DropdownMenu = ({ title, children, rightAlign = false, mobile = false, isOpen, toggle }) => {
  return (
    <div className={`af-dropdown ${rightAlign ? 'right-align' : ''} ${mobile ? 'mobile' : ''}`}>
      <button 
        className="af-dropdown-toggle"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        {title} 
        <span className={`arrow ${isOpen ? 'open' : ''}`}>
          {mobile ? (isOpen ? '−' : '+') : '▾'}
        </span>
      </button>
      
      <div className={`af-dropdown-menu ${isOpen ? 'open' : ''}`}>
        {React.Children.map(children, child => 
          React.cloneElement(child, { 
            className: `${child.props.className || ''} af-dropdown-item` 
          })
        )}
      </div>
    </div>
  );
};

export default Header;