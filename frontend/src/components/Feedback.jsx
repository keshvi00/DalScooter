import React, { useState } from 'react';
import { FEEDBACK_API_URL } from '../api/config.js';

const Feedback = ({ show, onClose }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [bookingRef, setBookingRef] = useState('');

  const resetForm = () => {
    setBookingRef('');
    setFeedbackText('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
  if (!bookingRef.trim() || !feedbackText.trim()) {
    alert('Please fill in both the booking reference and your feedback.');
    return;
  }

  try {
    await fetch(`${FEEDBACK_API_URL}/submit-feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingReference: bookingRef,
        feedback: feedbackText,
      }),
    });

    alert('Thank you for your feedback!');
    resetForm();
    onClose();
  } catch (error) {
    console.error('Error submitting feedback:', error);
    alert('Failed to submit feedback. Try again later.');
  }
};

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Submit Feedback / Complaint</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="bookingRef" className="form-label">Booking Reference</label>
              <input
                type="text"
                id="bookingRef"
                className="form-control"
                placeholder="Enter your booking reference"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="feedbackText" className="form-label">Feedback</label>
              <textarea
                id="feedbackText"
                className="form-control"
                rows="5"
                placeholder="Describe your issue or feedback..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
