import React from 'react';
import { motion } from 'framer-motion';

export const MetricReveal = ({ label, value, description, prefix = '', suffix = '' }) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      className="p-8 rounded-2xl bg-agency-muted border border-white/5"
    >
      <p className="text-agency-accent font-medium tracking-wide uppercase text-sm mb-2">{label}</p>
      <h3 className="text-5xl lg:text-7xl font-bold text-white mb-4">
        {prefix}{value}{suffix}
      </h3>
      {description && <p className="text-agency-subtext text-lg">{description}</p>}
    </motion.div>
  );
};
