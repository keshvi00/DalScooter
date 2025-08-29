import React from 'react';
import { DollarSign, Star, MapPin } from 'lucide-react';

const FranchiseStats = ({ stats }) => {
  return (
    <div className="row g-4">
      {/* Earnings */}
      <div className="col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body d-flex align-items-center">
            <div className="me-3 bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
              <DollarSign size={24} />
            </div>
            <div>
              <h6 className="mb-0 fw-semibold text-muted">Total Earnings</h6>
              <h5 className="fw-bold text-dark">${stats.totalEarnings.toFixed(2)}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body d-flex align-items-center">
            <div className="me-3 bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
              <Star size={24} />
            </div>
            <div>
              <h6 className="mb-0 fw-semibold text-muted">Avg. Rating</h6>
              <h5 className="fw-bold text-dark">{stats.averageRating.toFixed(1)} / 5</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Top Location */}
      <div className="col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body d-flex align-items-center">
            <div className="me-3 bg-info-subtle text-info rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
              <MapPin size={24} />
            </div>
            <div>
              <h6 className="mb-0 fw-semibold text-muted">Top Location</h6>
              <h5 className="fw-bold text-dark">{stats.topLocation}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchiseStats;
