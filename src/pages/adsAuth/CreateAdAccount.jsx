import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock,FiGlobe, FiBriefcase } from 'react-icons/fi';
import './AuthForms.css';
import { CREATE_ADVERTIZER } from '../../utils/mutation';
import AdvertizerAuth from "../../utils/advertizerAuth.js";
import wallPaperImage from "../../assets/images/createAccountWallPaper.jpg"




const BRAND_TYPES = {
  creator: 'Creator',
  business: 'Business',
  nonprofit: 'Nonprofit',
  other: 'Other'
};

const supportedCountries = ["USA", "Rwanda", "Uganda", "Other"];
const TERMS_VERSION = "v1.0";


const CreateAdAccount = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    phoneNumber: '',
    businessEmail: '',
    password: '',
    confirmPassword: '',
    brandType: '',
    country: '',
    companyWebsite: '',
    acceptedTerms: false
  });

  const [registerAdvertizer] = useMutation(CREATE_ADVERTIZER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.acceptedTerms) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await registerAdvertizer({
        variables: {
          fullName: formData.fullName,
          companyName: formData.companyName,
          businessEmail: formData.businessEmail,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          brandType: formData.brandType,
          country: formData.country,
          companyWebsite: formData.companyWebsite || '',
          acceptedTerms: true,
          termsVersion: TERMS_VERSION
        }
      });

      if (!data?.registerAdvertizer?.advertizerToken) {
        setError("No token received from server");
        return;
      }

      await AdvertizerAuth.login({
        idToken: data.registerAdvertizer.advertizerToken,
        refreshToken: ''
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate('/verify-email');
    } 
    
    catch (err) {
  console.error(err);

  if (err.graphQLErrors?.length > 0) {
    const gqlError = err.graphQLErrors[0];
    const code = gqlError.extensions?.code;

    if (code === 'EMAIL_ALREADY_EXISTS') {
      setError(gqlError.message);
    } else {
      setError('Something went wrong: ' + gqlError.message);
    }
  } else if (err.networkError) {
    setError('Network error: Please check your connection or try again later.');
  } else {
    setError('Registration failed. Please try again.');
  }
}




    
    finally {
      setLoading(false);
    }
  };





  return (
<div className="auth-container">
  <div className="auth-card auth-signup-card">
    
    {/* Header */}
    <div className="auth-header">
      <h2>Create Business Account</h2>
      <p>Start advertising to millions of music lovers</p>
    </div>

    {/* Error */}
    {error && <div className="auth-error">{error}</div>}

    {/* Form */}
    <div className="auth-form-wrapper">
      <form onSubmit={handleSubmit}>

        {/* Full Name */}
        <div className="input-group">
          <label htmlFor="fullName">Full Name</label>
          <div className="input-field">
            <FiUser className="input-icon" />
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        {/* Company Name */}
        <div className="input-group">
          <label htmlFor="companyName">Company Name</label>
          <div className="input-field">
            <FiBriefcase className="input-icon" />
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="AfroBiz Ltd"
              required
            />
          </div>
        </div>

        {/* Business Email */}
        <div className="input-group">
          <label htmlFor="businessEmail">Business Email</label>
          <div className="input-field">
            <FiMail className="input-icon" />
            <input
              type="email"
              id="businessEmail"
              value={formData.businessEmail}
              onChange={handleChange}
              placeholder="contact@yourbiz.com"
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="input-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <div className="input-field">
            <FiPhone className="input-icon" />
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1 555 123 4567"
              required
            />
          </div>
        </div>

        {/* Country - Fixed Select */}
        <div className="input-group">
          <label htmlFor="country">
            Country
            <br />
            <small className="input-hint">
              We currently support: {supportedCountries.slice(0, -1).join(', ')}. If your country is not listed, select "Other" and email <a href="mailto:support@afrofeel.com">support@afrofeel.com</a>
            </small>
          </label>
          <div className="input-field select-wrapper">
            <FiGlobe className="input-icon" />
            <select
              id="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="custom-select"
            >
              <option value="" disabled>Select your country</option>
              {supportedCountries.map((c) => (
                <option key={c} value={c}>
                  {c === "Other" ? "Other / Not listed" : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Company Website */}
        <div className="input-group">
          <label htmlFor="companyWebsite">
            Company Website <span className="input-hint">(optional)</span>
            <br />
            <small className="input-hint">
              Helps us learn more about your business.
            </small>
          </label>
          <div className="input-field">
            <input
              type="url"
              id="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              placeholder="https://yourcompany.com"
            />
          </div>
        </div>

        {/* Brand Type - Fixed Select */}
        <div className="input-group">
          <label htmlFor="brandType">Brand Type</label>
          <div className="input-field select-wrapper">
            <FiBriefcase className="input-icon" />
            <select
              id="brandType"
              value={formData.brandType}
              onChange={handleChange}
              required
              className="custom-select"
            >
              <option value="" disabled>Select Brand Type</option>
              {Object.entries(BRAND_TYPES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="input-field">
            <FiLock className="input-icon" />
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              minLength="8"
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-field">
            <FiLock className="input-icon" />
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Terms */}
        <div className="input-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              id="acceptedTerms"
              checked={formData.acceptedTerms}
              onChange={handleChange}
              required
            />
            I agree to the platform's Terms & Conditions.
          </label>
        </div>

      </form>
    </div>

    {/* Footer */}
    <div className="auth-footer">
      <button type="submit" className="auth-button" disabled={loading} onClick={handleSubmit}>
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
      <div style={{ marginTop: '1rem' }}>
        <span>Already have an account? </span>
        <Link to="/ad-account-login" className="auth-link">Login instead</Link>
      </div>
    </div>

  </div>
</div>

  );
};

export default CreateAdAccount;
