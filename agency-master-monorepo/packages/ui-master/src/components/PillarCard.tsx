import React from 'react';
import { motion } from 'framer-motion';

export interface PillarCardProps {
  icon: React.ReactNode;
  step: string;
  title: string;
  description: string;
  features: string[];
  isFullWidth?: boolean;
}

export const PillarCard: React.FC<PillarCardProps> = ({ icon, step, title, description, features, isFullWidth = false }) => {
  if (isFullWidth) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="col-span-1 md:col-span-2 bg-agency-dark rounded-2xl p-7 md:p-8 text-white mt-4"
      >
        <span className="text-3xl block mb-3.5">{icon}</span>
        <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-agency-accent mb-1.5">{step}</div>
        <h3 className="text-[18px] font-bold mb-2.5">{title}</h3>
        <p className="text-[14px] text-white/65 leading-[1.75] mb-4">{description}</p>
        
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
          {features.map((feature, idx) => (
            <li key={idx} className="text-[13px] text-white/70 relative pl-5 leading-[1.5]">
              <span className="absolute left-0 text-agency-accent font-bold">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow"
    >
      <span className="text-3xl block mb-3.5">{icon}</span>
      <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-agency-dark mb-1.5">{step}</div>
      <h3 className="text-[18px] font-bold text-agency-dark mb-2.5">{title}</h3>
      <p className="text-[14px] text-agency-subtext leading-[1.75] mb-4">{description}</p>
      
      <ul className="flex flex-col gap-2">
        {features.map((feature, idx) => (
          <li key={idx} className="text-[13px] text-agency-subtext relative pl-5 leading-[1.5]">
            <span className="absolute left-0 text-agency-dark font-bold">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
