import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppLink({ context, buttonText = "Get an Instant Quote on WhatsApp", className = "btn-primary" }) {
  const baseNumber = "27137522000"; // Fallback, would be actual number
  
  // Context-aware routing
  let message = "Hi, I'd like a quote for my project.";
  if (context === "B2C") {
    message = "Hi, I'd like a quote for premium patio blinds.";
  } else if (context === "B2B") {
    message = "Hi, I need a custom quote for transport tarpaulins.";
  }
  
  const encodedMessage = encodeURIComponent(message);
  const href = `https://wa.me/${baseNumber}?text=${encodedMessage}`;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      <MessageCircle size={20} />
      {buttonText}
    </a>
  );
}
