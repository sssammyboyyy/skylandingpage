import React from 'react';
import hitlist from '../data/hitlist.json';
import { supabase } from '../lib/supabase';
import DashboardClient from '../components/DashboardClient';

export default async function Dashboard() {
  // Fetch audits from Supabase to enrich the hitlist
  const { data: audits } = await supabase.from('audit_reports').select('target_url, company_name, score_out_of_100, cost_of_inaction_zar');

  // We map over the hitlist and attach any matching audit
  const enrichedProspects = hitlist.map(p => {
    // fuzzy match URL
    const cleanPUrl = p.url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];
    const audit = audits?.find(a => {
       if (!a.target_url) return false;
       const cleanAUrl = a.target_url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];
       return cleanPUrl && cleanAUrl && cleanPUrl.includes(cleanAUrl);
    });
    return { ...p, audit };
  });

  // Calculate stats
  const totalSpendStr = hitlist.reduce((acc, p) => acc + (parseFloat(p.spend.replace(/[R,]/g, '')) || 0), 0);
  const formattedSpend = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(totalSpendStr);

  return (
    <DashboardClient 
      enrichedProspects={enrichedProspects} 
      formattedSpend={formattedSpend} 
      hitlistLength={hitlist.length} 
    />
  );
}
