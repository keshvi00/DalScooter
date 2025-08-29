import React from 'react';
import { Modal } from 'react-bootstrap';

const FeedbackModal = ({ bike, isOpen, onClose, feedback = [] }) => {
  if (!bike || !isOpen) return null;

  const avgRating =
    feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : 'N/A';

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Feedback for {bike.model}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted">
          Average Rating: <strong>{avgRating}</strong>
        </p>
        {feedback.length > 0 ? (
          <ul className="list-group">
            {feedback.map((item, index) => (
              <li key={index} className="list-group-item">
                <strong>{item.user}</strong>: {item.comment} <span className="text-warning">⭐ {item.rating}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No feedback available for this bike yet.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FeedbackModal;
