import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Truck } from 'lucide-react';
import './FunnelSplit.css';

export default function FunnelSplit() {
  return (
    <section className="funnel-section section-padding">
      <div className="container text-center">
        <h2 className="mb-8">Select Your Requirement</h2>
        <div className="funnel-grid">
          <Link to="/b2c-patio-blinds" className="funnel-card">
            <div className="funnel-icon">
              <Home size={40} color="var(--primary-amber)" />
            </div>
            <h3>Home & Lodge Patio Blinds</h3>
            <p>Premium outdoor shading, custom manufactured to withstand the severe Lowveld elements.</p>
            <span className="btn-secondary mt-8">Explore B2C Blinds</span>
          </Link>
          
          <Link to="/b2b-transport-tarpaulins" className="funnel-card">
            <div className="funnel-icon">
              <Truck size={40} color="var(--primary-amber)" />
            </div>
            <h3>Commercial & Transport</h3>
            <p>Heavy-duty PVC tarpaulins and transport covers built for long-haul endurance.</p>
            <span className="btn-secondary mt-8">Explore B2B Solutions</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
