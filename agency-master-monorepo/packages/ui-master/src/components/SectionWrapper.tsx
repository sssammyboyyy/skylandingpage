import React from 'react';

export const SectionWrapper = ({ id, label, title, subtitle, children, bg = 'white', isDarkText = false }) => {
  const bgClass = {
    white: 'bg-white',
    light: 'bg-gray-50',
    navy: 'bg-agency-dark',
    muted: 'bg-agency-muted'
  }[bg] || 'bg-white';

  const labelColor = isDarkText ? 'text-agency-accent' : 'text-agency-dark';
  const titleColor = isDarkText ? 'text-white' : 'text-agency-dark';
  const subColor = isDarkText ? 'text-white/60' : 'text-agency-subtext';

  return (
    <div id={id} className={`py-16 md:py-20 px-6 ${bgClass}`}>
      <div className="max-w-[880px] mx-auto">
        <div className={`text-[11px] font-bold tracking-[2px] uppercase mb-3 ${labelColor}`}>
          {label}
        </div>
        <h2 
          className={`text-[26px] md:text-[40px] font-extrabold tracking-[-0.8px] leading-[1.15] mb-3 ${titleColor}`}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {subtitle && (
          <p className={`text-[16px] max-w-[580px] leading-[1.75] mb-11 ${subColor}`}>
            {subtitle}
          </p>
        )}
        
        {children}
      </div>
    </div>
  );
};
