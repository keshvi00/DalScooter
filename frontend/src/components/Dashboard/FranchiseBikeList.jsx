import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const FranchiseBikeList = ({ bikes }) => {
  return (
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-body">
        <h5 className="fw-bold text-primary mb-3">Your Fleet</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Model</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Hourly Rate</th>
              </tr>
            </thead>
            <tbody>
              {bikes.map((bike) => (
                <tr key={bike.id}>
                  <td className="fw-semibold">{bike.model}</td>
                  <td>{bike.type}</td>
                  <td>{bike.location}</td>
                  <td>
                    {bike.available ? (
                      <span className="text-success d-flex align-items-center">
                        <CheckCircle size={16} className="me-1" /> Available
                      </span>
                    ) : (
                      <span className="text-danger d-flex align-items-center">
                        <XCircle size={16} className="me-1" /> Unavailable
                      </span>
                    )}
                  </td>
                  <td>${bike.hourlyRate}/hr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FranchiseBikeList;
