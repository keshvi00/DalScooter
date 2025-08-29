import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BIKE_API_URL } from '../../api/config.js';

const AddBikeModal = ({ show, onClose, onAddBike, editingBike }) => {
  const [bikeData, setBikeData] = useState({
    bikeId: '',
    model: '',
    type: 'eBike',
    hourlyRate: '',
    location: '',
    features: '',
    status: 'available',
  });

  useEffect(() => {
    if (editingBike) {
      setBikeData(editingBike);
    } else {
      setBikeData({
        bikeId: '',
        model: '',
        type: 'eBike',
        hourlyRate: '',
        location: '',
        features:'',
        status: 'available',
      });
    }
  }, [editingBike]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBikeData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const newBike = {
    ...bikeData,
    features: Array.isArray(bikeData.features)
      ? bikeData.features
      : bikeData.features.split(',').map(f => f.trim()),
  };

  try {
    const method = editingBike ? 'PUT' : 'POST';
    const url = editingBike
      ? `${BIKE_API_URL}/add-bike/${bikeData.bikeId}`
      : `${BIKE_API_URL}/add-bike`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBike),
    });

    if (!response.ok) {
      throw new Error('Failed to save bike');
    }

    const result = await response.json();

    onAddBike({
      ...newBike,
      bikeId: editingBike ? bikeData.bikeId : result.bike.bikeId,
    });
    onClose();
  } catch (err) {
    console.error('Error saving bike:', err);
    alert('Something went wrong while saving the bike.');
  }
};


  return (
    <Modal show={show} onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{editingBike ? 'Edit Bike' : 'Add New Bike'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!editingBike && (
            <Form.Group className="mb-3">
              <Form.Label>Bike ID</Form.Label>
              <Form.Control
                type="text"
                name="bikeId"
                value={bikeData.bikeId}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Model</Form.Label>
            <Form.Control
              type="text"
              name="model"
              value={bikeData.model}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select name="type" value={bikeData.type} onChange={handleChange}>
              <option value="eBike">eBike</option>
              <option value="Gyroscooter">Gyroscooter</option>
              <option value="Segway">Segway</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rent Per Hour ($)</Form.Label>
            <Form.Control
              type="number"
              name="hourlyRate"
              value={bikeData.hourlyRate}
              onChange={handleChange}
              required
              min={1}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={bikeData.location}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Features (comma separated)</Form.Label>
            <Form.Control name="features" value={bikeData.features} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={bikeData.status}
              onChange={handleChange}
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">
            {editingBike ? 'Update Bike' : 'Add Bike'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddBikeModal;
