import React from 'react';
import Hero from '../components/Hero';
import RiskGuarantee from '../components/RiskGuarantee';
import SocialProof from '../components/SocialProof';

export default function B2CBlinds() {
  return (
    <main>
      <Hero context="B2C" />
      <section className="section-padding container text-center">
        <h2>Premium Patio Blinds</h2>
        <p className="mt-8 mb-8" style={{ maxWidth: '800px', margin: '2rem auto' }}>
          Our custom-manufactured patio blinds are designed to withstand the harsh Mbombela sun and severe Highveld storms.
        </p>
      </section>
      <RiskGuarantee />
      <SocialProof />
    </main>
  );
}
