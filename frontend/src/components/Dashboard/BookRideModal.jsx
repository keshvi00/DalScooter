import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BIKE_BOOK_API_URL } from '../../api/config';

const BookRideModal = ({ show, bike, onClose, onConfirm, customerUsername }) => {
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!startDate || !duration) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);

    const bookingDetails = {
      ...bike,
      startDate,
      duration: parseInt(duration),
      customerUsername: customerUsername,
    };

    try {
      const response = await fetch(`${BIKE_BOOK_API_URL}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      onConfirm(bike.id); 
    } catch (error) {
      alert("Booking failed: " + error.message);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleClose = () => {
    setStartDate('');
    setDuration('');
    onClose();
  };

  if (!bike) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book Ride - {bike.model}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="startDate" className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group controlId="duration" className="mb-3">
            <Form.Label>Duration (in hours)</Form.Label>
            <Form.Control
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              disabled={loading}
            />
          </Form.Group>

          <p className="text-muted">
            Rate: <strong>${bike.hourlyRate}/hr</strong> | Location: <strong>{bike.location}</strong>
          </p>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleConfirm} disabled={loading}>
          {loading ? "Booking..." : "Confirm Booking"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookRideModal;
