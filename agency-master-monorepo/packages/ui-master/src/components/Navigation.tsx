import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export interface TopBarProps {
  clientName: string;
  whatsappLink: string;
}

export const TopBar: React.FC<TopBarProps> = ({ clientName, whatsappLink }) => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-agency-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-6 py-2.5 flex items-center justify-between">
    <div className="text-[13px] text-agency-subtext dark:text-white/60 hidden md:flex items-center gap-4">
      <span>Ready to dominate, <strong className="text-agency-dark dark:text-white">{clientName}?</strong> Let's chat.</span>
      <ThemeToggle />
    </div>
    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
      <div className="md:hidden mr-2">
        <ThemeToggle />
      </div>
      <a 
        href={whatsappLink} 
        target="_blank" 
        rel="noreferrer"
        className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold text-[13px] px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
      >
        WhatsApp Jacques
      </a>
      <a href="#pricing" className="inline-flex items-center gap-1.5 text-agency-dark dark:text-white font-semibold text-[13px] px-3.5 py-2 rounded-lg border-2 border-agency-dark dark:border-white hover:bg-agency-dark hover:text-white dark:hover:bg-white dark:hover:text-agency-dark transition-colors">
        View Packages ↓
      </a>
    </div>
  </div>
);

export interface NavBarProps {
  clientName: string;
  date: string;
}

export const NavBar: React.FC<NavBarProps> = ({ clientName, date }) => (
  <nav className="flex items-center justify-between px-6 md:px-10 py-5 mt-14 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-agency-dark">
    <div className="flex items-center gap-2.5 font-extrabold text-[15px] text-agency-dark dark:text-white">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-agency-dark to-agency-muted flex items-center justify-center text-white">J</div>
      JCE Media
    </div>
    <div className="text-right text-[12px] text-agency-subtext dark:text-white/60 leading-relaxed hidden sm:block">
      <strong className="text-agency-dark dark:text-white text-[13px] block">Confidential · Prepared for {clientName}</strong>
      Growth Proposal · {date}
    </div>
  </nav>
);
