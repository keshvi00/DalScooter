import React from 'react';
import { Bike, ClipboardList, Activity } from 'lucide-react';

const FranchiseSummary = ({ bikes = [], bookings = [] }) => {
  const totalBikes = bikes.length;
  const activeBikes = bikes.filter(b => b.available).length;
  const totalBookings = bookings.length;

  return (
    <div className="row g-4 mt-3">
      <div className="col-md-4">
        <div className="card shadow-sm border-0 text-white bg-primary">
          <div className="card-body d-flex align-items-center">
            <div className="me-3">
              <Bike size={28} />
            </div>
            <div>
              <h6 className="mb-1">Total Bikes</h6>
              <h4 className="fw-bold mb-0">{totalBikes}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card shadow-sm border-0 text-white bg-success">
          <div className="card-body d-flex align-items-center">
            <div className="me-3">
              <Activity size={28} />
            </div>
            <div>
              <h6 className="mb-1">Active Bikes</h6>
              <h4 className="fw-bold mb-0">{activeBikes}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card shadow-sm border-0 text-white bg-warning">
          <div className="card-body d-flex align-items-center">
            <div className="me-3">
              <ClipboardList size={28} />
            </div>
            <div>
              <h6 className="mb-1">Total Bookings</h6>
              <h4 className="fw-bold mb-0">{totalBookings}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchiseSummary;
