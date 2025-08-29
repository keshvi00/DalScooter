import { useState, useEffect } from 'react';
import axios from 'axios';
import { LOGIN_API_URL } from '../api/config';
import { FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function LoginFormStep3({ username }) {
  const [encryptedClue, setEncryptedClue] = useState('');
  const [shift, setShift] = useState(3); 
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClue = async () => {
    try {
     const res = await axios.get(`${LOGIN_API_URL}/verify-caesar`);
        setEncryptedClue(res.data.clue);
        setShift(res.data.shift || 3);
      } catch (err) {
      alert("Error fetching clue: " + (err.response?.data?.error || err.message));
    }
   };
   fetchClue();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Submitting answer:', userAnswer);
      const res = await axios.post(`${LOGIN_API_URL}/login-step3`, {
        username,
        answer: userAnswer,
      });

      console.log('API Response:', res.data);
      const userType = res.data.userType;
      console.log('User Type:', userType);

      alert('Login successful!');
      
      localStorage.setItem('currentUser', JSON.stringify({
        username: username,
        userType: userType
      }));

      setTimeout(() => {
        console.log('Redirecting to dashboard for userType:', userType);
        if (userType === 'customer') {
          console.log('Navigating to CustomerDashboard');
          navigate('/CustomerDashboard');
        } else if (userType === 'franchise') {
          console.log('Navigating to FranchiseDashboard');
          navigate('/FranchiseDashboard');
        } else {
          console.log('Navigating to home (default)');
          navigate('/');
        }
      }, 1000); 

    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      alert('Incorrect answer to the clue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <form onSubmit={handleSubmit} className="form-transition">
  <div className="signup-field vertical">
    <div className="caesar-info">
      <p><span className="caesar-label">Encrypted Clue:</span> {encryptedClue}</p>
      <p><span className="caesar-label">Shift:</span> {shift}</p>
    </div>

    <div className="hint-text">
      <FaInfoCircle /> Hint: Each letter is shifted forward by {shift} position{shift > 1 ? 's' : ''} in the alphabet.
    </div>

    <input
      type="text"
      className="signup-input"
      placeholder="Enter decrypted word"
      value={userAnswer}
      onChange={(e) => setUserAnswer(e.target.value)}
      required
      disabled={isLoading}
    />
  </div>

  <button type="submit" className="signup-button" disabled={isLoading}>
    {isLoading ? 'Verifying...' : 'Submit'}
  </button>
</form>
  );
}

export default LoginFormStep3;
