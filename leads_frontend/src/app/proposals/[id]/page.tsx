import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import hitlist from '../../../data/hitlist.json';
import { ArrowLeft, CheckCircle2, AlertTriangle, TrendingUp, Target, DollarSign, BarChart } from 'lucide-react';

export default async function ProposalPage({ params }: { params: { id: string } }) {
  const prospect = hitlist.find(p => p.id.toString() === params.id);
  if (!prospect) return notFound();

  // fuzzy match URL
  const cleanPUrl = prospect.url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];
  const { data: audits } = await supabase.from('audit_reports').select('*');
  const audit = audits?.find(a => {
     if (!a.target_url) return false;
     const cleanAUrl = a.target_url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];
     return cleanPUrl && cleanAUrl && cleanPUrl.includes(cleanAUrl);
  });

  if (!audit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800">
        <AlertTriangle size={48} className="text-amber-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Deep Audit Found</h1>
        <p className="text-slate-500 mb-6">We could not find a processed Supabase audit for {prospect.title}.</p>
        <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Return to Hitlist</Link>
      </div>
    );
  }

  const { audit_data, score_out_of_100 } = audit;
  const isDanger = score_out_of_100 < 50;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition font-medium text-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="font-extrabold text-xl tracking-tight">Review<span className="text-blue-600">Tap</span> <span className="font-light text-slate-300 mx-2">|</span> Proposal</div>
      </nav>

      {/* Hero Header */}
      <header className="bg-slate-900 text-white pt-20 pb-24 px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
              Digital Audit & Growth Strategy
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">{prospect.title}</h1>
            <p className="text-lg text-slate-400">Custom analysis generated for {prospect.name || 'Executive Team'}. Identifying critical conversion leaks and proposing a high-CRO execution plan.</p>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-center shadow-2xl">
              <div className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-1">Health Score</div>
              <div className={`text-6xl font-black ${isDanger ? 'text-red-400' : 'text-emerald-400'}`}>
                {score_out_of_100}<span className="text-3xl opacity-50">/100</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 -mt-12 relative z-20 pb-24 space-y-8">
        
        {/* Cost of Inaction */}
        <section className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
          <div className="bg-red-50 text-red-600 p-6 rounded-full">
            <TrendingUp size={48} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">The Cost of Inaction</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">Based on your current search visibility gaps, lack of conversion tracking, and missing SEO fundamentals, we estimate the following annualized revenue loss simply by maintaining the status quo.</p>
            <div className="text-4xl font-black text-red-600 tracking-tight">
              R{audit_data.cost_of_inaction_zar?.toLocaleString() || 'Unknown'} <span className="text-lg font-medium text-slate-400">/ year</span>
            </div>
          </div>
        </section>

        {/* Audit Findings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800">
              <Target className="text-blue-600" /> SEO & Technical Gaps
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
              {audit_data.seo_audit}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {audit_data.website_audit}
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800">
              <BarChart className="text-purple-600" /> Market Positioning
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Competitor Landscape</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{audit_data.competitor_landscape}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Marketable Differentiators</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{audit_data.marketable_differentiators}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Strategy Execution */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-500" size={28} /> Execution Plan & Strategy
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h4 className="text-lg font-bold text-slate-800 mb-2">Immediate Action Plan</h4>
              <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{audit_data.action_plan}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2">Google Ads Strategy</h4>
                <p className="text-sm text-blue-800/80 leading-relaxed">{audit_data.google_ads_strategy}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-2">Landing Page Strategy</h4>
                <p className="text-sm text-purple-800/80 leading-relaxed">{audit_data.landing_page_strategy}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 text-center text-white shadow-xl">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Capture Lost Revenue?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">We build highly optimized landing pages and execute localized growth campaigns to plug the leaks in your funnel.</p>
          <a href="mailto:giorgio@reviewtap.co.za" className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Book Discovery Call
          </a>
        </section>
      </main>
    </div>
  );
}
