import React from 'react';
import { motion } from 'framer-motion';

export interface AuditItemCardProps {
  priority: 'critical' | 'high' | 'opportunity' | string;
  priorityTag: string;
  number: string;
  title: string;
  description: string;
  fix: React.ReactNode;
}

export const AuditItemCard: React.FC<AuditItemCardProps> = ({ priority, priorityTag, number, title, description, fix }) => {
  const getBarColor = () => {
    switch (priority) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-amber-500';
      case 'opportunity': return 'bg-agency-accent';
      default: return 'bg-gray-400';
    }
  };

  const getTagStyle = () => {
    switch (priority) {
      case 'critical': return 'bg-red-600/10 text-red-600 border border-red-600/20';
      case 'high': return 'bg-amber-500/10 text-amber-600 border border-amber-500/30';
      case 'opportunity': return 'bg-agency-accent/10 text-agency-accent border border-agency-accent/30';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid grid-cols-[6px_1fr] bg-white border border-gray-200 rounded-2xl overflow-hidden mb-3.5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={getBarColor()}></div>
      <div className="p-6 md:p-7">
        <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1px] px-2.5 py-1 rounded-full mb-2.5 ${getTagStyle()}`}>
          {priorityTag}
        </div>
        <div className="text-[10px] font-bold tracking-[1px] text-gray-400 mb-1.5 uppercase">
          {number}
        </div>
        <h3 className="text-[17px] font-bold text-agency-dark mb-2.5">{title}</h3>
        <p className="text-[14px] text-agency-subtext leading-[1.75] mb-3.5">{description}</p>
        <div className="bg-agency-accent/10 border border-agency-accent/20 rounded-lg p-3 md:p-4 text-[13px] text-agency-dark leading-[1.65]">
          {fix}
        </div>
      </div>
    </motion.div>
  );
};
