import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import BookingOverview from '../components/Dashboard/BookingOverview';
import VirtualAssistant from '../components/Dashboard/VirtualAssistant';
import AddBikeModal from '../components/Dashboard/AddBikeModal';
import BikeCard from '../components/Dashboard/BikeCard';
import BookingHistory from '../components/Dashboard/FranchiseBooking.jsx';
import { BIKE_API_URL } from '../api/config.js';
import { BIKE_BOOK_API_URL } from '../api/config.js';
import FranchiseAnalytics from "../components/Dashboard/FranchiseAnalytics";
import CurrentRentals from '../components/Dashboard/CurrentRentals';
import SentimentChart from '../components/SentimentChart';

const FranchiseDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [bikes, setBikes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingBike, setEditingBike] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (!currentUser.username) {
      alert('Please log in to access the dashboard');
      navigate('/login');
      return;
    }

    if (currentUser.userType !== 'franchise') {
      alert(`Access denied. ${currentUser.username} (${currentUser.userType}) cannot access Franchise Dashboard. Only franchise users are allowed.`);
      navigate('/CustomerDashboard');
      return;
    }
    
  }, [navigate]);

  const fetchBikes = async () => {
    try {
      const response = await fetch(`${BIKE_API_URL}/bikes`);
      if (!response.ok) throw new Error('Failed to fetch bikes');
      const data = await response.json();
      setBikes(data);
    } catch (error) {
      console.error("Error fetching bikes:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${BIKE_BOOK_API_URL}/getbook`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      if (Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        console.error('Bookings array not found in response:', data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await fetch(`${BIKE_BOOK_API_URL}/updatebook/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update booking status');

      setBookings(prevBookings =>
        prevBookings.map(b =>
          b.bookingId === bookingId ? { ...b, status } : b
        )
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  useEffect(() => {
    fetchBikes();
    fetchBookings();
  }, []);

  const handleEdit = (bike) => {
    setEditingBike(bike);
    setShowAddModal(true);
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'bi-speedometer2',
      badge: null
    },
    {
      id: 'bikes',
      label: 'Bike Fleet',
      icon: 'bi-bicycle',
      badge: bikes.length > 0 ? bikes.length : null
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: 'bi-calendar-check',
      badge: bookings.length > 0 ? bookings.length : null
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'bi-graph-up',
      badge: null
    },
    {
      id: 'insights',
      label: 'Customer Insights',
      icon: 'bi-emoji-smile',
      badge: null
    }
  ];

  const tabStyle = {
    border: 'none',
    borderRadius: '8px 8px 0 0',
    padding: '12px 20px',
    margin: '0 2px',
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#ffffff',
    color: '#007bff',
    borderBottom: '3px solid #007bff',
    fontWeight: '600'
  };

  const contentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '0 8px 8px 8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    minHeight: '500px'
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <div className="mb-4">
              <h4 className="fw-bold text-dark mb-3">
                <i className="me-2 bi bi-speedometer2"></i>Dashboard Overview
              </h4>
              <BookingOverview overview={{}} />
            </div>
            
            <div className="mt-4">
              <h5 className="fw-bold text-dark mb-3">Quick Actions</h5>
              <div className="d-flex gap-3 flex-wrap">
                <button
                  className="btn btn-primary btn-lg px-4"
                  onClick={() => setShowAddModal(true)}
                  style={{ borderRadius: '8px' }}
                >
                  <i className="bi bi-plus-circle me-2"></i>Add New Bike
                </button>
                <button
                  className="btn btn-outline-primary btn-lg px-4"
                  onClick={() => setActiveTab('bikes')}
                  style={{ borderRadius: '8px' }}
                >
                  <i className="bi bi-bicycle me-2"></i>Manage Bikes
                </button>
                <button
                  className="btn btn-outline-success btn-lg px-4"
                  onClick={() => setActiveTab('bookings')}
                  style={{ borderRadius: '8px' }}
                >
                  <i className="bi bi-calendar-check me-2"></i>View Bookings
                </button>
              </div>
            </div>
          </div>
        );

      case 'bikes':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-dark mb-0">
                <i className="me-2 bi bi-bicycle"></i>Bike Fleet Management
              </h4>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
                style={{ borderRadius: '8px' }}
              >
                <i className="bi bi-plus-circle me-2"></i>Add New Bike
              </button>
            </div>
            
            <div className="row g-3">
              {bikes.length === 0 ? (
                <div className="col-12">
                  <div className="text-center py-5">
                    <i className="bi bi-bicycle display-1 text-muted mb-3"></i>
                    <h5 className="text-muted mb-3">No bikes available</h5>
                    <p className="text-muted mb-4">Add your first bike to get started!</p>
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => setShowAddModal(true)}
                      style={{ borderRadius: '8px' }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>Add Your First Bike
                    </button>
                  </div>
                </div>
              ) : (
                bikes.map((bike) => (
                  <div className="col-xl-4 col-lg-6 col-md-6" key={bike.bikeId}>
                    <BikeCard
                      bike={bike}
                      showActions={true}
                      onEdit={handleEdit}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div>
            <h4 className="fw-bold text-dark mb-4">
              <i className="me-2 bi bi-calendar-check"></i>Booking Management
            </h4>
            <BookingHistory bookings={bookings} onUpdateStatus={updateBookingStatus} />
          </div>
        );

      case 'analytics':
        return (
          <div>
            <h4 className="fw-bold text-dark mb-4">
              <i className="me-2 bi bi-graph-up"></i>Dashboard Analytics
            </h4>
            <FranchiseAnalytics />
          </div>
        );

      case 'insights':
        return (
          <div>
            <h4 className="fw-bold text-dark mb-4">
              <i className="me-2 bi bi-emoji-smile"></i>Feedback Analysis
            </h4>
            <SentimentChart />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f5f7fa' }}>
      <div className="container-fluid px-4 py-4">
        {/* Header Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem',
          padding: '1rem'
        }}>
          <DashboardHeader role="Franchise" />
        </div>

        {/* Tab Navigation */}
        <div className="mb-0">
          <div className="d-flex flex-wrap" style={{ borderBottom: '1px solid #e9ecef' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={activeTab === tab.id ? activeTabStyle : tabStyle}
                className="position-relative"
              >
                <i className={`${tab.icon} me-2`}></i>
                {tab.label}
                {tab.badge && (
                  <span className="badge bg-primary rounded-pill ms-2" style={{ fontSize: '0.7rem' }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={contentStyle}>
          {renderTabContent()}
        </div>

        {/* Modals and Floating Elements */}
        <AddBikeModal
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingBike(null);
          }}
          onAddBike={(newBike) => {
            if (editingBike) {
              setBikes((prev) =>
                prev.map((b) => (b.bikeId === newBike.bikeId ? newBike : b))
              );
            } else {
              setBikes((prev) => [...prev, newBike]);
            }
            setShowAddModal(false);
            setEditingBike(null);
          }}
          editingBike={editingBike}
        />

        <VirtualAssistant />
      </div>
    </div>
  );
};

export default FranchiseDashboard;