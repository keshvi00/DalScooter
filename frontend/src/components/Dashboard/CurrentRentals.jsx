import React from 'react';
import { Clock } from 'lucide-react';

const CurrentRentals = ({ rentals = [] }) => {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h5 className="card-title mb-4 fw-semibold text-primary">Current Rentals</h5>

        {rentals.length === 0 ? (
          <div className="text-muted">No active rentals at the moment.</div>
        ) : (
          <div className="list-group">
            {rentals.map(rental => (
              <div key={rental.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
                <div className="me-3">
                  <Clock className="text-primary" size={24} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-semibold mb-1 text-dark">{rental.model}</h6>
                  <p className="mb-1 small text-muted">Pickup: {rental.pickupLocation}</p>
                  <p className="mb-0 small text-muted">Time: {rental.startTime} → {rental.expectedReturn}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentRentals;
