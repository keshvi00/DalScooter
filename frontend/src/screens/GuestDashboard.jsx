import React, { useState, useEffect } from 'react';
import FilterSection from '../components/Dashboard/FilterSection';
import FeedbackModal from '../components/Dashboard/FeedbackModal';
import AllFeedbacks from '../components/Dashboard/AllFeedbacks'; 
import axios from 'axios';
import { BIKE_API_URL } from '../api/config';
import { useNavigate } from 'react-router-dom';

const FEEDBACK_API_URL = 'https://mg8okbp7ld.execute-api.us-east-1.amazonaws.com/feedback';

const GuestDashboard = () => {
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [selectedBike, setSelectedBike] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleBook = () => {
    navigate('/signup');
  };

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await axios.get(`${BIKE_API_URL}/bikes`);
        setBikes(res.data);
        setFilteredBikes(res.data);
      } catch (err) {
        console.error('Failed to fetch bikes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  useEffect(() => {
    const results = bikes.filter((bike) => {
      const matchesType = !selectedType || bike.type === selectedType;
      const matchesSearch = !searchTerm || bike.model.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
    setFilteredBikes(results);
  }, [bikes, selectedType, searchTerm]);

  const handleViewFeedback = async (bike) => {
    setSelectedBike(bike);
    setIsFeedbackModalOpen(true);

    try {
      const res = await axios.get(`${FEEDBACK_API_URL}?bikeId=${bike.id}`);
      setFeedbackList(res.data);
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
      setFeedbackList([]);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <h2 className="mb-4 fw-bold">Browse Available Rides</h2>

        <FilterSection
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {loading ? (
          <div className="text-center py-5">Loading bikes...</div>
        ) : filteredBikes.length === 0 ? (
          <div className="text-center text-muted py-5">No bikes found.</div>
        ) : (
          <div className="row g-4">
            {filteredBikes.map((bike) => (
              <div key={bike.id} className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '1rem' }}>
                  <div className="card-body d-flex flex-column">
                    <h5 className="fw-semibold text-dark mb-2">{bike.model}</h5>
                    <span className="badge bg-light text-muted mb-2">{bike.type}</span>
                    {bike.available && (
                      <span className="badge bg-success-subtle text-success border border-success mb-2">
                        Available
                      </span>
                    )}
                    <p className="text-muted small mb-1">Location: {bike.location}</p>
                    <p className="text-muted small mb-1">Rate: ${bike.hourlyRate}/hr</p>
                    <p className="text-muted small mb-2">Rating: {bike.rating} ({bike.totalReviews} reviews)</p>

                    <ul className="list-unstyled small mb-3">
                      {bike.features?.slice(0, 3).map((feature, i) => (
                        <li key={i}>• {feature}</li>
                      ))}
                    </ul>

                    <div className="d-flex gap-2 mt-auto">
                      
                      <button
                        className="btn btn-outline-primary flex-fill"
                        onClick={() => handleBook()}
                      >
                        Want to Book?
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      
        <div className="mt-5">
          <AllFeedbacks />
        </div>
      </div>

      <FeedbackModal
        bike={selectedBike}
        isOpen={isFeedbackModalOpen}
        feedback={feedbackList}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setSelectedBike(null);
          setFeedbackList([]);
        }}
      />
    </div>
  );
};

export default GuestDashboard;
