import React from 'react';
import WhatsAppLink from './WhatsAppLink';
import './Hero.css';

export default function Hero({ context = "B2C" }) {
  // Using static, compressed background images to hit < 1.8s FCP (no sliders)
  // These would be WebP, but we'll use placeholder styles reflecting the fast load
  const bgImage = context === "B2C" 
    ? "linear-gradient(rgba(31, 41, 55, 0.7), rgba(31, 41, 55, 0.7)), url('/patio-blinds-optimized.webp')" 
    : "linear-gradient(rgba(31, 41, 55, 0.7), rgba(31, 41, 55, 0.7)), url('/tarpaulin-optimized.webp')";

  return (
    <section className="hero-section" style={{ backgroundImage: bgImage }}>
      <div className="container hero-content">
        <div className="badge">Proven For 50 Years</div>
        <h1>Mpumalanga's Toughest Canvas & PVC.</h1>
        <p className="hero-sub">
          {context === "B2C" 
            ? "Premium patio blinds custom-manufactured in Mbombela to withstand the severe Lowveld elements."
            : "Heavy-duty transport tarpaulins and safari lodge tents built for extreme endurance."}
        </p>
        <div className="hero-actions">
          <WhatsAppLink context={context} />
        </div>
      </div>
    </section>
  );
}
