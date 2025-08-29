import { useState } from 'react';
import axios from 'axios';
import { SIGNUP_API_URL } from '../api/config';
import { FaUser, FaEnvelope, FaLock, FaQuestionCircle, FaKey, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

function SignupPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    userType: '',
    question: '',
    answer: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    try {
    await axios.post(`${SIGNUP_API_URL}/signup`, form);
    alert('Signup successful!');
    navigate('/verify', { state: { username: form.username } });
    } catch (err) {
    alert('Error: ' + (err.response?.data?.error || err.message));
   }
  };

  return (
    <div className="signup-wrapper gradient-bg">
      <form className="signup-form" onSubmit={handleSubmit}>
        <button type="button" onClick={() => navigate("/")} className="back-button">
          <FaArrowLeft /> 
        </button>

        <div className="signup-header">
           <div className="signup-logo">
              <span className="signup-logo-text">DS</span>
           </div>
              <span className="signup-title gradient-text">Dal Scooter Portal</span>
        </div>

        <div className="signup-field">
          <FaUser className="signup-icon" />
          <input className="signup-input" name="username" placeholder="Username" onChange={handleChange} required />
        </div>

        <div className="signup-field">
          <FaEnvelope className="signup-icon" />
          <input className="signup-input" type="email" name="email" placeholder="Email" onChange={handleChange} required />
        </div>

        <div className="signup-field">
          <FaLock className="signup-icon" />
          <input
            className="signup-input"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password (min 8 characters)"
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="signup-toggle">
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="signup-field">
          <FaShieldAlt className="signup-icon" />
          <select name="userType" className="signup-input" onChange={handleChange} required>
            <option value="">Select user type</option>
            <option value="customer">Customer</option>
            <option value="franchise">Franchise</option>
          </select>
        </div>

        <div className="signup-field">
          <FaQuestionCircle className="signup-icon" />
          <select name="question" className="signup-input" onChange={handleChange} required>
            <option value="">Select a security question</option>
            <option value="What is your pet's name?">What is your pet's name?</option>
            <option value="What is your favourite color?">What is your favourite color?</option>
            <option value="What is your favourite food?">What is your favourite food?</option>
          </select>
        </div>

        <div className="signup-field">
          <FaKey className="signup-icon" />
          <input className="signup-input" name="answer" placeholder="Security Answer" onChange={handleChange} required />
        </div>

        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupPage;
