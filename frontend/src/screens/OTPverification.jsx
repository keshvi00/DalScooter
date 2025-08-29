import { useState } from 'react';
import axios from 'axios';
import { CONFIRM_EMAIL_API_URL } from '../api/config';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import '../styles/Signup.css';

function OTPVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username; 

  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      await axios.post(`${CONFIRM_EMAIL_API_URL}/confirm`, { username, code });
      setStatus('Account verified! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setStatus(err.response?.data?.error || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper gradient-bg">
      <div className="signup-form">
        <button type="button" onClick={() => navigate('/')} className="back-button">
          <FaArrowLeft />
        </button>

        <div className="signup-header">
          <div className="signup-logo">
            <span className="signup-logo-text">DS</span>
          </div>
          <span className="signup-title gradient-text">Dal Scooter Portal</span>
        </div>

        <form onSubmit={handleSubmit} className="form-transition">
          <div className="signup-field">
            <input
              className="signup-input"
              name="code"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>

          {status && (
            <p className="status-message" style={{ 
              marginTop: '15px', 
              textAlign: 'center',
              color: status.includes('verified') ? '#000000' : '#f44336',
              fontWeight: '500'
            }}>
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default OTPVerification;
