import React, { useState, useEffect } from 'react';
import './verify.css';
import advertizerAuth from '../../utils/advertizerAuth';
import { RESEND_ADVERTIZER_EMAIL_TOKEN } from '../../utils/mutation';
import { useMutation } from '@apollo/client';
import { useSearchParams, useNavigate } from 'react-router-dom';


const VerifyEmail = () => {
  const [resendAdvertizerVerificationEmail, { data, loading, error }] = useMutation(RESEND_ADVERTIZER_EMAIL_TOKEN);
  const [countdown, setCountdown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [businessEmail, setBusinessEmail] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status');

  // Get business email from auth
  useEffect(() => {
    const profile = advertizerAuth.getProfile();
    const email = profile?.data?.businessEmail;
    if (email) {
      setBusinessEmail(email);
    }
  }, []);

  // Countdown timer logic
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle resend button click
  const handleResend = () => {
    if (isResendDisabled || !businessEmail) return;

    resendAdvertizerVerificationEmail({ variables: { businessEmail } });
    setCountdown(30);
    setIsResendDisabled(true);
  };

  // Debugging or toast purposes
  useEffect(() => {
    if (data?.resendAdvertizerVerificationEmail?.success) {
      console.log('✅', data.resendAdvertizerVerificationEmail.message);
    }
    if (error) {
      console.error('❌', error.message);
    }
  }, [data, error]);

  return (
    <div className="email-verification-wrapper">
      <div className="email-verification-card">

        {/* ✅ Just Verified */}
        {status === 'verified' && (
          <>
            <h2>Email Verified ✅</h2>
            <p>Your email has been verified. You can now log in to your advertiser account.</p>
            <button className="auth-button" onClick={() => navigate('/ad-account-login')}>
              Go to Login
            </button>
          </>
        )}

        {/* ⚠️ Already Verified */}
        {status === 'already' && (
          <>
            <h2>Email Already Verified</h2>
            <p>This email is already verified. Please login to continue.</p>
            <button className="auth-button" onClick={() => navigate('/ad-account-login')}>
              Go to Login
            </button>
          </>
        )}

        {/* ⏳ Normal flow (no status param) */}
        {!status && (
          <>
            <h2>Verify Your Email</h2>
            <p>
              We've sent a verification link to <span className="highlight">{businessEmail}</span>. <br />
              Please check your inbox and click the link to verify your email address.
            </p>
            <p>If you don't see the email, check your spam folder or resend it below.</p>

            <div className="actions">
              <button
                className="resend-button"
                onClick={handleResend}
                disabled={isResendDisabled || loading}
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>
              {isResendDisabled && (
                <span className="timer">Resend available in {countdown} seconds</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
