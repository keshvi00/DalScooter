import React from "react";

export default function Footer() {


  return (
      <footer className="bg-dark text-light py-5">
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="d-flex align-items-center mb-4">
                <div className="me-3 d-flex align-items-center justify-content-center" 
                     style={{width: '40px', height: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px'}}>
                  <span className="text-white fw-bold">DS</span>
                </div>
                <span className="fs-4 fw-bold text-white">Dal Scooter Portal</span>
              </div>
              <p className="text-light opacity-75 mb-4" style={{maxWidth: '400px'}}>
                Halifax's premier scooter marketplace, connecting students and community members 
                with reliable, affordable transportation solutions.
              </p>
              <small className="text-light opacity-50">
                © {new Date().getFullYear()} Dal Scooter Portal. Built for CSCI 5410 Project.
              </small>
            </div>
            
            <div className="col-lg-3">
              <h5 className="text-white mb-4">Quick Links</h5>
              <div className="d-flex flex-column gap-2">
                <a href="#" className="text-light opacity-75 text-decoration-none">Browse Scooters</a>
                <a href="#" className="text-light opacity-75 text-decoration-none">Sell Your Scooter</a>
                <a href="#" className="text-light opacity-75 text-decoration-none">Safety Guidelines</a>
                <a href="#" className="text-light opacity-75 text-decoration-none">Support</a>
              </div>
            </div>
            
            <div className="col-lg-3">
              <h5 className="text-white mb-4">Contact</h5>
              <div className="d-flex flex-column gap-1 small text-light opacity-75">
                <p className="mb-1">Dalhousie University</p>
                <p className="mb-1">Halifax, NS</p>
                <p className="mb-0">support@dalscooter.ca</p>
              </div>
            </div>
          </div>
        </div>
      </footer>


  );
}
