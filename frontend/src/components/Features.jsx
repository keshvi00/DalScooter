import React from "react";

import { ShoppingCart, Shield, Users } from 'lucide-react';

export default function Features() {


  return (
      <section id="features" className="py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5 fade-in">
            <h2 className="display-4 fw-bold mb-4">Why Choose Dal Scooter Portal?</h2>
            <p className="lead text-muted col-lg-8 mx-auto">
              We've built the most comprehensive platform for scooter enthusiasts in Halifax
            </p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-4 fade-in">
              <div className="card h-100 border-0 shadow-sm card-hover">
                <div className="card-body text-center p-5">
                  <div className="feature-icon bg-blue-gradient">
                    <ShoppingCart className="text-white" size={32} />
                  </div>
                  <h4 className="card-title fw-bold mb-3">Seamless Shopping</h4>
                  <p className="card-text text-muted">
                    Browse hundreds of verified scooters with detailed specs, photos, and honest reviews from real buyers.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 fade-in" style={{transitionDelay: '0.2s'}}>
              <div className="card h-100 border-0 shadow-sm card-hover">
                <div className="card-body text-center p-5">
                  <div className="feature-icon bg-purple-gradient">
                    <Users className="text-white" size={32} />
                  </div>
                  <h4 className="card-title fw-bold mb-3">Trusted Community</h4>
                  <p className="card-text text-muted">
                    Connect with verified sellers in the Dal community. Every transaction is protected by our buyer guarantee.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 fade-in" style={{transitionDelay: '0.4s'}}>
              <div className="card h-100 border-0 shadow-sm card-hover">
                <div className="card-body text-center p-5">
                  <div className="feature-icon bg-green-gradient">
                    <Shield className="text-white" size={32} />
                  </div>
                  <h4 className="card-title fw-bold mb-3">Secure Transactions</h4>
                  <p className="card-text text-muted">
                    Advanced encryption and multi-factor authentication keep your personal information and payments safe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


  );
}
