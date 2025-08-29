// screens/FeedbackPage.jsx
import React, { useState, useEffect } from 'react';
import Feedback from '../components/Feedback';

const FeedbackPage = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Automatically show feedback modal when page loads
    setShowFeedback(true);
  }, []);

  const handleClose = () => {
    setShowFeedback(false);
    // Optional: Navigate away or show a thank-you page
  };

  return (
    <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
      {showFeedback && <Feedback show={showFeedback} onClose={handleClose} />}
    </div>
  );
};

export default FeedbackPage;
