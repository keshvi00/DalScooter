import React from 'react';
import { Smile } from 'lucide-react';

const CustomerWelcomeCard = ({ customerName }) => {
  return (
    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '1rem' }}>
      <div className="card-body d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)' }}>
        <div className="bg-primary-subtle p-3 rounded-circle me-3 d-flex align-items-center justify-content-center">
          <Smile size={28} className="text-primary" />
        </div>
        <div>
          <h5 className="fw-bold text-primary mb-1">Welcome Back!</h5>
          <p className="mb-0 text-muted small">Glad to see you again, <strong>{customerName}</strong>. Explore your dashboard below.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerWelcomeCard;
