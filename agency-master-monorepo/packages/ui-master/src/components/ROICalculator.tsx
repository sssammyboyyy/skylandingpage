import React from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../store';

export const ROICalculator: React.FC = () => {
  const { roiCalculator, setROICalculator } = useUIStore();
  const { avgCustomerValue, monthlyTraffic, conversionRate } = roiCalculator;

  const estimatedLeads = Math.floor(monthlyTraffic * conversionRate);
  const estimatedRevenue = estimatedLeads * avgCustomerValue;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-agency-dark text-white p-8 rounded-2xl shadow-xl mt-8"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold tracking-wider text-white/70 uppercase">Average Customer Value (ZAR)</label>
              <span className="font-bold text-agency-accent">R{avgCustomerValue.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="500" 
              max="10000" 
              step="100" 
              value={avgCustomerValue} 
              onChange={(e) => setROICalculator('avgCustomerValue', Number(e.target.value))}
              className="w-full accent-agency-accent"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold tracking-wider text-white/70 uppercase">Monthly Web Traffic</label>
              <span className="font-bold text-agency-accent">{monthlyTraffic} visitors</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="5000" 
              step="50" 
              value={monthlyTraffic} 
              onChange={(e) => setROICalculator('monthlyTraffic', Number(e.target.value))}
              className="w-full accent-agency-accent"
            />
          </div>
        </div>

        <div className="flex-1 bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col justify-center items-center text-center">
          <div className="text-[12px] font-bold tracking-[2px] text-white/50 uppercase mb-2">Projected Monthly Revenue</div>
          <motion.div 
            key={estimatedRevenue}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-[-2px] text-white mb-2"
          >
            R{estimatedRevenue.toLocaleString()}
          </motion.div>
          <div className="text-sm text-agency-accent font-medium">
            Based on {estimatedLeads} estimated leads at {conversionRate * 100}% conversion.
          </div>
        </div>
      </div>
    </motion.div>
  );
};
