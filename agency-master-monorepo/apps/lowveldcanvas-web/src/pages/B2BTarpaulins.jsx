import React from 'react';
import Hero from '../components/Hero';
import RiskGuarantee from '../components/RiskGuarantee';
import SocialProof from '../components/SocialProof';

export default function B2BTarpaulins() {
  return (
    <main>
      <Hero context="B2B" />
      <section className="section-padding container text-center">
        <h2>Heavy-Duty Transport Covers</h2>
        <p className="mt-8 mb-8" style={{ maxWidth: '800px', margin: '2rem auto' }}>
          Custom PVC tarpaulins engineered for the transport industry and safari lodge applications. Built for ultimate endurance.
        </p>
      </section>
      <RiskGuarantee />
      <SocialProof />
    </main>
  );
}
