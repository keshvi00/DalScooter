import React from 'react';
import { CalendarDays, MapPin, Clock, DollarSign } from 'lucide-react';

const FranchiseBooking = ({ bookings, onUpdateStatus }) => {
  return (
    <div className="mt-5">
      <h4 className="fw-bold mb-4 text-dark">
        <i className="me-2 bi bi-clock-history"></i>Booking History
      </h4>
      {bookings.length === 0 ? (
        <div className="alert alert-info shadow-sm rounded">
          No bookings found.
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded mb-4">
          <div className="card-body">
            <ul className="list-group list-group-flush">
              {bookings.map((booking, index) => (
                <li key={index} className="list-group-item px-0 py-3">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                    <div>
                      <h6 className="fw-semibold mb-1">
                        {booking.model}{' '}
                        <span className="badge bg-primary-subtle text-primary ms-2">{booking.type}</span>
                      </h6>
                      <div className="text-muted small d-flex flex-wrap gap-3">
                        <span><CalendarDays size={14} className="me-1" /> {booking.startDate}</span>
                        <span><Clock size={14} className="me-1" /> {booking.duration} hrs</span>
                        <span><MapPin size={14} className="me-1" /> {booking.location}</span>
                        <span className="text-capitalize">
                          <i className="bi bi-check-circle me-1" />Status: {booking.status || 'pending'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 mt-md-0 d-flex flex-column align-items-end gap-2">
                      <span className="fw-bold text-success">
                        <DollarSign size={14} className="me-1" /> {booking.hourlyRate * booking.duration}
                      </span>

                      {/* Approve/Reject buttons only if pending */}
                      {booking.status?.toLowerCase() === 'pending' && (
                        <div>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => onUpdateStatus(booking.bookingId, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => onUpdateStatus(booking.bookingId, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseBooking;
