import React, { useRef, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';

export interface SummaryStat {
  value: string;
  description: string;
}

export interface SummaryStatGridProps {
  stats: SummaryStat[];
}

const AnimatedNumber = ({ value }: { value: string }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!inView) return;
    const match = value.match(/([\D]*)([\d,.]+)([\D]*)/);
    if (!match) return;
    
    const [, prefix, numStr, suffix] = match;
    const num = parseFloat(numStr.replace(/,/g, ''));
    
    const controls = animate(0, num, {
      duration: 2,
      ease: "easeOut",
      onUpdate(v) {
        if (nodeRef.current) {
          const isInt = numStr.indexOf('.') === -1;
          const formatted = isInt ? Math.floor(v).toLocaleString() : v.toFixed(1);
          nodeRef.current.textContent = `${prefix}${formatted}${suffix}`;
        }
      }
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={nodeRef}>{value}</span>;
};

export const SummaryStatGrid: React.FC<SummaryStatGridProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden mb-10">
    {stats.map((stat, idx) => (
      <motion.div 
        key={idx}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.1 }}
        className="bg-white p-7 md:p-8"
      >
        <div className="text-[38px] md:text-[44px] font-extrabold text-agency-dark tracking-[-1px] leading-none mb-2">
          <AnimatedNumber value={stat.value} />
        </div>
        <div className="text-[14px] text-agency-subtext leading-[1.6]">
          {stat.description}
        </div>
      </motion.div>
    ))}
  </div>
);
