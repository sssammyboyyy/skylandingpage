import React from 'react';
import { motion } from 'framer-motion';

export interface HeroHeaderProps {
  label: string;
  title: string;
  subtitle: string;
  meta: Array<{ label: string; value: string }>;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ label, title, subtitle, meta }) => (
  <div className="bg-agency-dark px-6 py-20 md:py-24 text-white">
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-agency-accent/15 border border-agency-accent/30 text-agency-accent text-[11px] font-bold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-full mb-7"
      >
        {label}
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-6xl lg:text-[66px] font-extrabold leading-[1.08] tracking-[-1.5px] mb-6"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-[17px] text-white/70 max-w-2xl leading-[1.75] mb-12"
      >
        {subtitle}
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/10 border border-white/10 rounded-2xl overflow-hidden max-w-2xl"
      >
        {meta.map((item, idx) => (
          <div key={idx} className="bg-white/5 p-4 md:p-5">
            <div className="text-[10px] uppercase tracking-[1.2px] text-white/40 mb-1">{item.label}</div>
            <div className="text-[13px] font-semibold text-white/90">{item.value}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
);
