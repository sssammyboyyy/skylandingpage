import React from 'react';

export const BrowserCompare = ({ oldUrl, newUrl, oldFeatures, newFeatures }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-9">
    {/* OLD BROWSER */}
    <div className="rounded-2xl overflow-hidden shadow-md">
      <div className="flex items-center gap-2 bg-[#e8eaed] py-2 px-3.5">
        <div className="flex gap-1">
          <div className="w-[9px] h-[9px] rounded-full bg-[#ff5f57]"></div>
          <div className="w-[9px] h-[9px] rounded-full bg-[#febc2e]"></div>
          <div className="w-[9px] h-[9px] rounded-full bg-[#28c840]"></div>
        </div>
        <div className="flex-1 bg-white text-gray-500 rounded px-2 py-0.5 text-[10px] font-mono">
          {oldUrl}
        </div>
      </div>
      <div className="bg-gray-50 p-5 md:p-6 h-full">
        <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-gray-400 mb-2.5">
          The Current Reality
        </div>
        <ul className="flex flex-col gap-2">
          {oldFeatures.map((feat, idx) => (
            <li key={idx} className="text-[13px] text-gray-500 relative pl-4">
              <span className="absolute left-0 text-gray-300">✗</span>
              {feat}
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* NEW BROWSER */}
    <div className="rounded-2xl overflow-hidden shadow-md">
      <div className="flex items-center gap-2 bg-agency-dark py-2 px-3.5">
        <div className="flex gap-1">
          <div className="w-[9px] h-[9px] rounded-full bg-[#ff5f57]"></div>
          <div className="w-[9px] h-[9px] rounded-full bg-[#febc2e]"></div>
          <div className="w-[9px] h-[9px] rounded-full bg-[#28c840]"></div>
        </div>
        <div className="flex-1 bg-white/15 text-white/80 rounded px-2 py-0.5 text-[10px] font-mono">
          {newUrl}
        </div>
      </div>
      <div className="bg-agency-dark p-5 md:p-6 h-full">
        <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-agency-accent mb-2.5">
          The New Standard
        </div>
        <ul className="flex flex-col gap-2">
          {newFeatures.map((feat, idx) => (
            <li key={idx} className="text-[13px] text-white/75 relative pl-4">
              <span className="absolute left-0 text-agency-accent font-bold">✓</span>
              {feat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
