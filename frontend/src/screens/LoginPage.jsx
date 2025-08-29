import { useState } from 'react';
import LoginFormStep1 from '../components/LoginForm1';
import LoginFormStep2 from '../components/LoginForm2';
import LoginFormStep3 from '../components/LoginForm3';
import '../styles/Signup.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

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

        {step === 1 && <LoginFormStep1 nextStep={() => setStep(2)} setUsername={setUsername} />}
        {step === 2 && <LoginFormStep2 nextStep={() => setStep(3)} username={username} />}
        {step === 3 && <LoginFormStep3 username={username} />}
      </div>
    </div>
  );
}

export default LoginPage;