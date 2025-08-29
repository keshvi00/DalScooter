import React from 'react';
import { Filter, Search } from 'lucide-react';

const FilterSection = ({ selectedType, onTypeChange, searchTerm, onSearchChange }) => (
  <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '1rem' }}>
    <div className="card-body p-4">
      <h3 className="card-title h5 fw-semibold mb-4 d-flex align-items-center text-primary">
        <div className="bg-primary-subtle rounded-circle p-2 me-2">
          <Filter size={20} className="text-primary" />
        </div>
        Filter & Search
      </h3>
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <label className="form-label fw-medium text-secondary small">Search by model</label>
          <div className="position-relative">
            <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
              <Search className="text-muted" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search bikes..."
              className="form-control ps-5 py-3 border-2"
              style={{ 
                borderRadius: '0.75rem',
                borderColor: '#e9ecef',
                transition: 'all 0.2s ease'
              }}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = '#0d6efd';
                e.target.style.boxShadow = '0 0 0 0.2rem rgba(13, 110, 253, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label fw-medium text-secondary small">Filter by type</label>
          <select
            className="form-select py-3 border-2"
            style={{ 
              borderRadius: '0.75rem',
              borderColor: '#e9ecef',
              transition: 'all 0.2s ease'
            }}
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = '#0d6efd';
              e.target.style.boxShadow = '0 0 0 0.2rem rgba(13, 110, 253, 0.25)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">All Types</option>
            <option value="eBike">eBike</option>
            <option value="Gyroscooter">Gyroscooter</option>
            <option value="Segway">Segway</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default FilterSection;