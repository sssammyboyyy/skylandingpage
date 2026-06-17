import React from 'react';
import { motion } from 'framer-motion';

export interface PricingTierFeature {
  text: string;
  off?: boolean;
}

export interface PricingTierProps {
  name: string;
  price: string;
  subtext: string;
  setup: string;
  features: PricingTierFeature[];
  isFeatured?: boolean;
  ctaLink: string;
}

export const PricingTier: React.FC<PricingTierProps> = ({ name, price, subtext, setup, features, isFeatured = false, ctaLink }) => {
  if (isFeatured) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-agency-dark border-2 border-agency-dark rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow mt-4 md:mt-0"
      >
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-agency-accent text-black text-[11px] font-extrabold tracking-[0.8px] px-3.5 py-1 rounded-full whitespace-nowrap">
          ★ Recommended
        </div>
        <div className="text-[11px] font-bold tracking-[2px] uppercase text-white/50 mb-3.5">{name}</div>
        <div className="text-[36px] font-extrabold tracking-[-1.5px] text-white leading-none mb-1">
          {price} <span className="text-[16px] font-medium tracking-normal text-white/50">{subtext}</span>
        </div>
        <div className="text-[12px] text-white/45 mb-5 pb-5 border-b border-white/10 leading-[1.5]">
          {setup}
        </div>
        
        <ul className="flex flex-col gap-2.5 mb-6">
          {features.map((feat, idx) => (
            <li key={idx} className={`text-[13px] relative pl-5 leading-[1.5] ${feat.off ? 'text-white/25' : 'text-white/70'}`}>
              <span className={`absolute left-0 font-bold ${feat.off ? 'text-white/25' : 'text-agency-accent'}`}>
                {feat.off ? '—' : '✓'}
              </span>
              {feat.text}
            </li>
          ))}
        </ul>

        <a href={ctaLink} className="block w-full text-center bg-red-600 text-white font-bold text-[14px] py-3.5 rounded-xl hover:bg-red-700 transition-colors">
          Select Package
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="text-[11px] font-bold tracking-[2px] uppercase text-agency-subtext mb-3.5">{name}</div>
      <div className="text-[36px] font-extrabold tracking-[-1.5px] text-agency-dark leading-none mb-1">
        {price} <span className="text-[16px] font-medium tracking-normal text-agency-subtext">{subtext}</span>
      </div>
      <div className="text-[12px] text-agency-subtext mb-5 pb-5 border-b border-gray-200 leading-[1.5]">
        {setup}
      </div>
      
      <ul className="flex flex-col gap-2.5 mb-6">
        {features.map((feat, idx) => (
          <li key={idx} className={`text-[13px] relative pl-5 leading-[1.5] ${feat.off ? 'text-gray-400' : 'text-agency-subtext'}`}>
            <span className={`absolute left-0 font-bold ${feat.off ? 'text-gray-400' : 'text-agency-dark'}`}>
              {feat.off ? '—' : '✓'}
            </span>
            {feat.text}
          </li>
        ))}
      </ul>

      <a href={ctaLink} className="block w-full text-center bg-transparent border-2 border-agency-dark text-agency-dark font-semibold text-[14px] py-3.5 rounded-xl hover:bg-agency-dark hover:text-white transition-colors">
        View Details
      </a>
    </motion.div>
  );
};
