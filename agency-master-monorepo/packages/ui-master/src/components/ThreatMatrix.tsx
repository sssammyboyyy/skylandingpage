import React from 'react';

export const ThreatMatrix = ({ competitors }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-agency-subtext">
            <th className="p-4 font-medium">Competitor</th>
            <th className="p-4 font-medium">Threat Level</th>
            <th className="p-4 font-medium">Ads Strategy</th>
            <th className="p-4 font-medium">Key Differentiator</th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((comp, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-white">{comp.name}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  comp.threatLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                  comp.threatLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {comp.threatLevel}
                </span>
              </td>
              <td className="p-4 text-agency-subtext">{comp.adsStrategy}</td>
              <td className="p-4 text-agency-subtext">{comp.differentiator}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
