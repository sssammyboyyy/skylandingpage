import React from 'react';
import { Star } from 'lucide-react';
import './SocialProof.css';

export default function SocialProof() {
  return (
    <section className="social-proof section-padding">
      <div className="container text-center">
        <div className="stars flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} fill="#D97706" color="#D97706" size={24} />
          ))}
        </div>
        <h2 className="mb-8">Trusted by the Lowveld for 50 Years</h2>
        <p className="rating-summary">Based on 107 verified 5-star Google reviews</p>
        
        <div className="testimonial-card">
          <blockquote className="testimonial-text">
            "Excellent service from an experienced team that delivered the quality that they promised. Lowveld Canvas are now my go-to company for roll up Blinds."
          </blockquote>
          <div className="testimonial-author">
            <strong>Ewan le Roux</strong>
            <span>Nelspruit</span>
          </div>
        </div>
      </div>
    </section>
  );
}
