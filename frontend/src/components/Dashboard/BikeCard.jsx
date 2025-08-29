import React from 'react';
import { MapPin, Banknote, Pencil, Trash2 } from 'lucide-react';

const BikeCard = ({ bike, onViewFeedback, showActions = false, onEdit }) => {
  const features = Array.isArray(bike.features) ? bike.features : [];

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="fw-semibold text-dark mb-1">{bike.model}</h5>
            <span className="badge text-bg-light text-muted small me-2">{bike.type}</span>
            {bike.available && (
              <span className="badge bg-success-subtle text-success border border-success ms-1">
                Available
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mb-3 text-muted small">
          <p className="mb-1 d-flex align-items-center">
            <MapPin size={14} className="me-2" /> {bike.location}
          </p>
          <p className="mb-0 d-flex align-items-center">
            <Banknote size={14} className="me-2 text-success" /> ${bike.hourlyRate}/hr
          </p>
        </div>

        {/* Features */}
        <ul className="list-unstyled small mb-3">
          <h7 className="fw-semibold text-dark mb-1">Features:</h7>
          {features.slice(0, 3).map((feature, index) => (
            <li key={index}>• {feature}</li>
          ))}
        </ul>

        {/* Action buttons */}
        <div className="mt-auto">
          {onViewFeedback && (
            <button
              className="btn btn-outline-primary w-100 mb-2"
              onClick={() => onViewFeedback(bike)}
            >
              View Feedback
            </button>
          )}

          {showActions && (
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-sm btn-outline-secondary w-100 me-2"
                onClick={() => onEdit(bike)}
              >
                <Pencil size={14} className="me-1" /> Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BikeCard;
