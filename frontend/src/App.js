import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./screens/LandingPage";
import SignupPage from './screens/SignupPage';
import LoginPage from './screens/LoginPage';
import GuestDashboard from "./screens/GuestDashboard";
import CustomerDashboard from "./screens/CustomerDashboard";
import FranchiseDashboard from "./screens/FranchiseDashboard";
import LoginFormStep1 from './components/LoginForm1';
import OTPVerification from './screens/OTPverification';
import Feedback from './screens/FeedbackPage';
import FeedbackPage from './screens/AllFeedbacksPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<OTPVerification />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login-step1" element={<LoginFormStep1 />} />
        <Route path="/GuestDashboard" element={<GuestDashboard />} />
        <Route path="/CustomerDashboard" element={<CustomerDashboard />} />
        <Route path="/FranchiseDashboard" element={<FranchiseDashboard />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/feedbackAll" element={<FeedbackPage />} />
      </Routes>
    </Router>
  );
}