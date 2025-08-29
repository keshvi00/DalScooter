import { useState } from 'react';
import axios from 'axios';
import { LOGIN_API_URL } from '../api/config';
import { FaUser, FaLock } from 'react-icons/fa';

function LoginFormStep1({ nextStep, setUsername }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${LOGIN_API_URL}/login`, form);
      setUsername(form.username);
      nextStep();
    } catch (err) {
      alert('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-transition">
      <div className="signup-field">
        <FaUser className="signup-icon" />
        <input className="signup-input" name="username" placeholder="Enter your username" onChange={handleChange} required />
      </div>

      <div className="signup-field">
        <FaLock className="signup-icon" />
        <input
          className="signup-input"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
          required
        />
        <button type="button" className="signup-toggle" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <button type="submit" className="signup-button">Next</button>
    </form>
  );
}

export default LoginFormStep1;