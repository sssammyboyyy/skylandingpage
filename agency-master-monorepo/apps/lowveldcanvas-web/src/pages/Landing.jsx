import React from 'react';
import Hero from '../components/Hero';
import FunnelSplit from '../components/FunnelSplit';
import RiskGuarantee from '../components/RiskGuarantee';
import SocialProof from '../components/SocialProof';

export default function Landing() {
  return (
    <main>
      <Hero context="B2C" />
      <FunnelSplit />
      <RiskGuarantee />
      <SocialProof />
    </main>
  );
}
