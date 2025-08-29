import React from 'react';
import { CalendarCheck, Clock, DollarSign } from 'lucide-react';

const BookingOverview = ({ overview }) => {
  const { totalBookings=0, upcomingRentals=0, totalRevenue=0 } = overview;

  const cards = [
    {
      label: 'Total Bookings',
      value: totalBookings,
      icon: <CalendarCheck size={20} />,
      bg: 'bg-primary-subtle',
      text: 'text-primary',
      border: 'border-primary'
    },
    {
      label: 'Upcoming Rentals',
      value: upcomingRentals,
      icon: <Clock size={20} />,
      bg: 'bg-warning-subtle',
      text: 'text-warning',
      border: 'border-warning'
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: <DollarSign size={20} />,
      bg: 'bg-success-subtle',
      text: 'text-success',
      border: 'border-success'
    }
  ];

  return (
    <div className="row g-4">
      {cards.map((card, index) => (
        <div className="col-md-4" key={index}>
          <div className={`card h-100 shadow-sm border-0`}>
            <div className="card-body d-flex align-items-center">
              <div className={`rounded-circle d-flex align-items-center justify-content-center ${card.bg} ${card.text} me-3`} style={{ width: 48, height: 48 }}>
                {card.icon}
              </div>
              <div>
                <h6 className="fw-semibold mb-1 text-dark">{card.label}</h6>
                <p className="mb-0 fs-5 fw-bold text-dark">{card.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingOverview;
