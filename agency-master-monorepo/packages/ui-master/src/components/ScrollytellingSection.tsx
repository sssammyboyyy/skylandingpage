import React from 'react';
import { motion } from 'framer-motion';

export const ScrollytellingSection = ({ title, children, isDark = true }) => {
  return (
    <section className={`min-h-screen flex items-center justify-center p-8 lg:p-24 snap-center ${isDark ? 'bg-agency-dark text-agency-text' : 'bg-white text-agency-dark'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true, margin: "-10%" }}
        className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        <div className="space-y-6">
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
            {title}
          </h2>
          <div className="text-lg lg:text-xl text-agency-subtext leading-relaxed">
            {children}
          </div>
        </div>
        <div className="relative">
          {/* Right side is reserved for visual metrics, charts, or images injected by the skill */}
          <div className="absolute inset-0 bg-gradient-to-tr from-agency-accent/20 to-transparent blur-3xl -z-10" />
        </div>
      </motion.div>
    </section>
  );
};
