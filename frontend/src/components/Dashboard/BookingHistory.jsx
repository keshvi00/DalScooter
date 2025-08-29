import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Clock, DollarSign, Info } from 'lucide-react';
import {BIKE_BOOK_API_URL} from "../../api/config.js";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${BIKE_BOOK_API_URL}/getbook`);
        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch booking history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading booking history...</div>;
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="alert alert-info shadow-sm rounded">
        You haven't made any bookings yet.
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded mb-4">
      <div className="card-header bg-white border-0 pb-0">
        <h5 className="mb-0 text-primary fw-bold">Booking History</h5>
      </div>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          {bookings.map((booking, index) => (
            <li key={index} className="list-group-item px-0 py-3">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div>
                  <h6 className="fw-semibold mb-1">
                    {booking.model}
                    {booking.type && (
                      <span className="badge bg-primary-subtle text-primary ms-2">{booking.type}</span>
                    )}
                  </h6>
                  <div className="text-muted small d-flex flex-wrap gap-3">
                    <span><Info size={14} className="me-1" /> Booking Code: {booking.bookingId}</span>
                  </div>
                  <div className="text-muted small d-flex flex-wrap gap-3">
                    <span><CalendarDays size={14} className="me-1" /> {booking.startDate}</span>
                    <span><Clock size={14} className="me-1" /> {booking.duration} hour(s)</span>
                    <span><MapPin size={14} className="me-1" /> {booking.location}</span>
                    <span><Info size={14} className="me-1" /> Status: {booking.status}</span>
                  </div>
                </div>
                <div className="mt-2 mt-md-0">
                  <span className="fw-bold text-success">
                    <DollarSign size={14} className="me-1" />
                    {booking.hourlyRate * booking.duration}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookingHistory;
