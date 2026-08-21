import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLock, FiMail } from 'react-icons/fi';
import './AuthForms.css';
import { useMutation } from '@apollo/client';
import { ADVERTIZER_LOGIN } from '../../utils/mutation';
import advertizerAuth from '../../utils/advertizerAuth';
import { isLoggedInVar, userDataVar } from '../../Apollo/cashe';

const AdAccountLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [loginAdvertizer] = useMutation(ADVERTIZER_LOGIN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await loginAdvertizer({
        variables: {
          businessEmail: email,
          password: password,
        },
      });

      const advertizerPayload = data?.loginAdvertizer;

      if (!advertizerPayload?.advertizer) {
        setError('Something went wrong. Please try again.');
        return;
      }

      const { advertizerToken, advertizer } = advertizerPayload;

      if (!advertizer.isConfirmed) {
        setError('Your email is not verified. A new verification email has been sent.');
        return;
      }

      // ✅ Store tokens
      await advertizerAuth.login({
        idToken: advertizerToken,
        refreshToken: null,
      });

      // ✅ Update Apollo reactive state manually
      isLoggedInVar(true);
      userDataVar({
        id: advertizer._id,
        name: advertizer.fullName,
        email: advertizer.businessEmail,
        role: advertizer.role,
        avatar: ''
      });

      // ✅ No need for navigate, handled in advertizerAuth.login()
    } catch (err) {
      const msg = err?.graphQLErrors?.[0]?.message || 'Login failed. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card--login">
        <div className="auth-header">
          <h2>Business Account Login</h2>
          <p>Access your advertising dashboard</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-field">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@business.com"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-field">
              <FiLock className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="auth-options">
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to="/ad-account-signup" className="auth-link">
            Create business account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdAccountLogin;
