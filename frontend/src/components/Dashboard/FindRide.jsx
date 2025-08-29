import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign } from 'lucide-react';
import BookRideModal from './BookRideModal';
import { BIKE_BOOK_API_URL } from '../../api/config';

const FindRide = ({ bikes, loading }) => {
  const [selectedBike, setSelectedBike] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookedBikeIds, setBookedBikeIds] = useState(new Set());

  useEffect(() => {
    const fetchBookedBikes = async () => {
      try {
        const response = await fetch(`${BIKE_BOOK_API_URL}/getbook`);
        const data = await response.json();
        console.log("Booked Bikes", data);
        const bookings = data.bookings || [];

        const activeBookings = bookings.filter(b => b.status.toLowerCase() === 'pending' || b.status.toLowerCase() === 'approved');

        const ids = activeBookings.map(b => b.bikeId);
        setBookedBikeIds(new Set(ids));
      } catch (err) {
        console.error("Failed to fetch booked bikes:", err);
      }
    };

    fetchBookedBikes();
  }, []);

  const handleBookNow = (bike) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.username) {
      alert('Please log in to book a bike.');
      return;
    }

    if (bookedBikeIds.has(bike.bikeId)) {
      alert('Already booked, see status in Booked section.');
      return;
    }
    setSelectedBike(bike);
    setShowModal(true);
  };

  const handleConfirmBooking = (bikeId) => {
    alert(`You have booked the bike successfully, waiting for Franchise to approve it!`);
    setBookedBikeIds(prev => new Set(prev).add(bikeId));
    setShowModal(false);
  };

  return (
    <div className="mb-5">
      <h4 className="fw-bold mb-4 text-dark">
        <i className="me-2 bi bi-search"></i>Find Your Perfect Ride
      </h4>

      {loading ? (
        <div className="text-center py-5">Loading bikes...</div>
      ) : bikes.length === 0 ? (
        <div className="text-center text-muted py-5">No bikes match your criteria.</div>
      ) : (
        <div className="row g-4">
          {bikes.map((bike) => (
 
            <div key={bike.bikeId} className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '1rem' }}>
                <div className="card-body d-flex flex-column">
                  <div className="mb-3">
                    <h5 className="fw-semibold text-dark mb-1">{bike.model}</h5>
                    <span className="badge rounded-pill bg-light text-muted small me-2">{bike.type}</span>
                    {bike.available && (
                      <span className="badge bg-success-subtle text-success border border-success ms-1">
                        Available
                      </span>
                    )}
                  </div>

                  <div className="mb-3 text-muted small">
                    <p className="mb-1 d-flex align-items-center">
                      <MapPin size={14} className="me-2" /> {bike.location}
                    </p>
                    <p className="mb-1 d-flex align-items-center">
                      <DollarSign size={14} className="me-2 text-success" /> ${bike.hourlyRate}/hr
                    </p>
                  </div>

                  <ul className="list-unstyled small mb-3">
                    {bike.features?.slice(0, 3).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between gap-2 mt-auto w-100">
                    {bookedBikeIds.has(bike.bikeId) ? (
                      <button
                        className="btn btn-secondary w-50"
                        onClick={() => alert('Already booked, see status in Booked section.')}
                      >
                        Booked
                      </button>
                    ) : (
                      <button className="btn btn-primary w-50" onClick={() => handleBookNow(bike)}>
                        Book Now
                      </button>
                    )}
                    <button
                      className="btn btn-outline-secondary w-50"
                      onClick={() => alert('Feedback feature coming soon')}
                    >
                      Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

             <BookRideModal
         show={showModal}
         bike={selectedBike}
         onClose={() => setShowModal(false)}
         onConfirm={handleConfirmBooking}
         customerUsername={(() => {
           const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
           return currentUser.username || 'unknown_user';
         })()}
       />
    </div>
  );
};

export default FindRide;
