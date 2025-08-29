import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  return (
    <div className="text-white p-4 rounded-3 mb-4 shadow"
         style={{
           background: 'linear-gradient(45deg, #1976d2 0%, #7b1fa2 100%)'
         }}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h1 className="display-5 fw-bold mb-2">Welcome to DALScooter</h1>
          <p className="mb-0 opacity-75">Explore available bikes and scooters in Halifax</p>
          {currentUser.username && (
            <p className="mb-0 opacity-75 mt-2">
              Logged in as: <strong>{currentUser.username}</strong> ({currentUser.userType})
            </p>
          )}
          
        </div>
        <button 
          onClick={handleLogout}
          className="btn btn-outline-light btn-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;