import React from "react";

export default function Navbar() {
  return (
      <nav className="navbar navbar-expand-lg navbar-light fixed-top navbar-glass">
        <div className="container">
          <div className="navbar-brand d-flex align-items-center">
            <div className="me-2 d-flex align-items-center justify-content-center" 
                 style={{width: '40px', height: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px'}}>
              <span className="text-white fw-bold">DS</span>
            </div>
            <span className="fs-4 fw-bold gradient-text">Dal Scooter Portal</span>
          </div>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto d-flex align-items-center">
              <a className="nav-link me-4" href="#features">Features</a>
              <a className="nav-link me-4" href="/login">Login</a>
              <a href="/signup" className="btn btn-gradient text-white px-4 py-2 rounded-pill">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

  );
}
