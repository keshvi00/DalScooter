import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import BookingHistory from '../components/Dashboard/BookingHistory';
import CurrentRentals from '../components/Dashboard/CurrentRentals';
import VirtualAssistant from '../components/Dashboard/VirtualAssistant';
import FilterSection from '../components/Dashboard/FilterSection';
import FindRide from '../components/Dashboard/FindRide';
import Feedback from '../components/Feedback';
import AllFeedbacks from '../components/Dashboard/AllFeedbacks'; 
import axios from 'axios';
import { BIKE_API_URL } from '../api/config';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [allBikes, setAllBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.username) {
      alert('Please log in to access the dashboard');
      navigate('/login');
      return;
    }

    if (currentUser.userType !== 'customer') {
      alert(`Access denied. ${currentUser.username} (${currentUser.userType}) cannot access Customer Dashboard. Only customer users are allowed.`);
      navigate('/FranchiseDashboard');
      return;
    }
    
  }, [navigate]);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await axios.get(`${BIKE_API_URL}/bikes`);
        setAllBikes(response.data);
      } catch (error) {
        console.error('Error fetching bikes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  const filteredBikes = allBikes.filter((bike) => {
    const matchType = !selectedType || bike.type === selectedType;
    const matchSearch = !searchTerm || bike.model.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <DashboardHeader />
        <div className="d-flex justify-content-end my-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowFeedbackModal(true)}
          >
            Submit Feedback / Complaint
          </button>
        </div>

        {/* Filter Section */}
        <FilterSection
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <FindRide bikes={filteredBikes} loading={loading} />

        <div className="row g-4 mt-4">
         
          <div className="col-md-6">
            <CurrentRentals />
          </div>

          <div className="col-md-6">
            <BookingHistory />
          </div>
        </div>

 
        <div className="mt-5">
          <AllFeedbacks />
        </div>
      </div>

      <VirtualAssistant />
      <Feedback show={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
    </div>
  );
};

export default CustomerDashboard;
