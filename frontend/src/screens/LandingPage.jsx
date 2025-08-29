import { ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import ScooterImage from "../assets/images/scooter-frontend.jpg"
import Footer from '../components/Footer';
import Features from '../components/Features';

import  "../styles/main.css"
export default function LandingPage() {


  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 50%, #faf8ff 100%)' }}>
      <Navbar/>

      <section className="py-5" style={{marginTop: '80px', paddingTop: '5rem', paddingBottom: '5rem'}}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 ">
              
              <h1 className="display-3 fw-bold mb-4 lh-sm">
                Your Gateway to
                <span className="gradient-text d-block">Smart Mobility</span>
              </h1>
              
              <p className="lead text-muted mb-5">
                Discover, buy, and sell scooters in Halifax's most trusted student marketplace. 
                Safe transactions, verified sellers, unbeatable prices.
              </p>
              
              <div className="d-flex flex-column flex-sm-row gap-3">
                <a href="/signup" className="btn btn-gradient text-white btn-lg px-5 py-3 rounded-pill d-flex align-items-center justify-content-center">
                  Start Your Journey
                  <ArrowRight className="ms-2" size={20} />
                </a>
                <a href="/GuestDashboard" className="btn btn-outline-secondary btn-lg px-5 py-3 rounded-pill">
                  Browse Scooters
                </a>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="hero-image">
                  <img
                    src={ScooterImage}
                    alt="Modern Electric Scooter"
                    className="img-fluid w-100"
                    style={{height: '400px', objectFit: 'cover'}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Features/>


      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center" >
              <h2 className="display-4 fw-bold mb-4">Ready to Find Your Perfect Ride?</h2>
              <p className="lead text-muted mb-5">
                Join the Dal community marketplace for reliable scooter transactions
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <a href="/signup" className="btn btn-gradient text-white btn-lg px-5 py-3 rounded-pill d-flex align-items-center justify-content-center">
                  
                  <CheckCircle className="me-2" size={20} />
                  Create Free Account
                </a>
                <a href="/login" className="btn btn-outline-secondary btn-lg px-5 py-3 rounded-pill">
                  Start Selling Today
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}