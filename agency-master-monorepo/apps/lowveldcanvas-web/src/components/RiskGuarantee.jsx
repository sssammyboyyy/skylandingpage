import React from 'react';
import { ShieldCheck } from 'lucide-react';
import './RiskGuarantee.css';

export default function RiskGuarantee() {
  return (
    <section className="guarantee-section">
      <div className="container flex items-center justify-center gap-4 guarantee-content">
        <div className="guarantee-icon">
          <ShieldCheck size={48} color="white" />
        </div>
        <div className="guarantee-text">
          <h3>The Localized Custom Fit Guarantee</h3>
          <p>
            Unlike drop-shippers, we measure, manufacture, and install right here in Mbombela. 
            If it doesn't fit your space perfectly, we adjust it until it does—no questions asked.
          </p>
        </div>
      </div>
    </section>
  );
}
