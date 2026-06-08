"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Mail, MapPin, Search, BarChart3, TrendingUp, Layers, Play, X, Activity } from 'lucide-react';

export default function DashboardClient({ enrichedProspects, formattedSpend, hitlistLength }: any) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pipelineState, setPipelineState] = useState<any>(null);
  const [activeProspect, setActiveProspect] = useState<any>(null);

  const runPipeline = async (prospect: any) => {
    setActiveProspect(prospect);
    setIsDrawerOpen(true);
    setPipelineState({ status: 'initializing', logs: [], currentPhase: 0 });

    try {
      const response = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: prospect.url })
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        
        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              
              setPipelineState((prev: any) => {
                const newState = { ...prev };
                if (data.type === 'log') {
                  newState.logs = [...newState.logs, data.message];
                  if (data.phase) newState.currentPhase = data.phase;
                } else if (data.type === 'complete') {
                  newState.status = 'complete';
                  newState.logs = [...newState.logs, `\n✅ Process Exited with code ${data.code}`];
                }
                return newState;
              });
            } catch (e) {}
          }
        });
      }
    } catch (e: any) {
      setPipelineState((prev: any) => ({ ...prev, status: 'error', logs: [...prev.logs, `ERROR: ${e.message}`] }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex overflow-hidden">
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 overflow-y-auto h-screen ${isDrawerOpen ? 'mr-96' : ''}`}>
        
        {/* HEADER */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white p-8 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Review<span className="text-blue-400">Tap</span></h1>
            <p className="text-sm text-slate-300 mt-1 opacity-80">100 Prospect Hitlist &bull; 5-Day Outreach Plan &bull; Generated June 2026</p>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-3 px-6 text-center backdrop-blur-md">
            <div className="text-xl font-bold">5 Days</div>
            <div className="text-xs opacity-80">20 contacts/day</div>
          </div>
        </div>

        {/* OVERVIEW STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-8 bg-slate-900">
          {[
            { label: 'Total Prospects', value: hitlistLength, icon: <Layers size={16} /> },
            { label: 'Prior Spend', value: formattedSpend, icon: <TrendingUp size={16} /> },
            { label: 'SCALE Targets', value: enrichedProspects.filter((p:any) => p.title && p.title.length > 15).length },
            { label: 'GROWTH Targets', value: enrichedProspects.filter((p:any) => p.title && p.title.length <= 15).length },
            { label: 'FOUNDATION Targets', value: '47' },
            { label: 'Max Monthly Retainer', value: 'R555,433' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 border border-white/5 rounded-xl p-4 text-center text-white backdrop-blur-sm">
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-wider opacity-70 mt-1 flex items-center justify-center gap-1">
                {stat.icon} {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* LEGEND */}
        <div className="bg-white px-8 py-4 border-b flex flex-wrap gap-6 text-xs text-slate-500 font-medium items-center">
          <span className="font-bold tracking-wider">PACKAGES:</span>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div> SCALE — R9,500/mo</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div> GROWTH — R5,999/mo</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-cyan-600"></div> FOUNDATION — R2,999/mo</div>
        </div>

        {/* PROSPECTS GRID */}
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="space-y-6">
            {enrichedProspects.slice(0, 20).map((prospect: any, index: number) => (
              <div key={prospect.id} className="bg-white rounded-xl border shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                
                {/* Card Header */}
                <div className="flex flex-col md:flex-row items-start gap-4 p-5 bg-slate-50 border-b relative">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-inner">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {prospect.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-green-100 text-green-700 px-3 py-0.5 rounded-full text-xs font-bold border border-green-200">
                        ICP 9.0/10
                      </span>
                      <span className="bg-purple-100 text-purple-700 px-3 py-0.5 rounded-full text-xs font-bold border border-purple-200">
                        SCALE — R9,500/mo
                      </span>
                      {prospect.audit ? (
                         <Link href={`/proposals/${prospect.id}`} className="bg-blue-600 text-white px-3 py-0.5 rounded-full text-xs font-bold shadow-sm hover:bg-blue-500 transition">
                           View Generated Proposal ⚡
                         </Link>
                      ) : (
                         <button onClick={() => runPipeline(prospect)} className="bg-slate-800 text-white flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold shadow-sm hover:bg-slate-700 transition">
                           <Play size={12} /> Run Deep Audit
                         </button>
                      )}
                    </div>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 font-bold px-4 py-1.5 rounded-lg border border-emerald-200 shadow-sm text-sm whitespace-nowrap md:mt-0 mt-2">
                    {prospect.spend}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Contact Info */}
                  <div className="overflow-hidden">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <Mail size={12} /> Contact Information
                    </h4>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-slate-50">
                        <tr><td className="py-2 text-slate-500 font-medium w-24">Name</td><td className="py-2 font-semibold truncate max-w-[150px] md:max-w-none">{prospect.name}</td></tr>
                        <tr><td className="py-2 text-slate-500 font-medium">Email</td><td className="py-2 text-blue-600 truncate max-w-[150px] md:max-w-[200px] block"><a href={`mailto:${prospect.email}`}>{prospect.email}</a></td></tr>
                        <tr><td className="py-2 text-slate-500 font-medium">Location</td><td className="py-2 truncate max-w-[150px] md:max-w-none block">{prospect.location}</td></tr>
                        <tr><td className="py-2 text-slate-500 font-medium">Orders</td><td className="py-2 text-xs">{prospect.orders}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Audit Info */}
                  <div className="overflow-hidden">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <Search size={12} /> Live Audit Data
                    </h4>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-slate-50">
                        <tr><td className="py-2 text-slate-500 font-medium w-24">URL</td><td className="py-2 text-blue-600 truncate max-w-[150px] md:max-w-[200px] block"><a href={prospect.url} target="_blank" rel="noreferrer">{prospect.url || 'N/A'}</a></td></tr>
                        {prospect.audit && (
                          <>
                            <tr><td className="py-2 text-slate-500 font-medium">Score</td><td className="py-2 font-bold text-red-600">{prospect.audit.score_out_of_100}/100</td></tr>
                            <tr><td className="py-2 text-slate-500 font-medium">COI (ZAR)</td><td className="py-2 text-emerald-600 font-bold">R{prospect.audit.cost_of_inaction_zar?.toLocaleString()}</td></tr>
                          </>
                        )}
                      </tbody>
                    </table>
                    
                    {prospect.note && (
                      <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-xs rounded-r-md leading-relaxed hidden md:block">
                        {prospect.note}
                      </div>
                    )}
                  </div>

                </div>
                
                {/* Email Draft */}
                <div className="px-5 pb-5">
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-mono text-slate-600 cursor-copy hover:bg-slate-100 transition-colors relative group/email overflow-x-auto">
                      <div className="absolute top-2 right-2 bg-white border px-2 py-1 text-[10px] rounded text-slate-400 opacity-0 group-hover/email:opacity-100 transition-opacity">Copy to clipboard</div>
                      {prospect.emailDraft}
                   </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide-out Pipeline Drawer */}
      <div className={`fixed top-0 right-0 h-screen w-96 bg-slate-900 text-white shadow-2xl border-l border-slate-700 transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-400" size={18} />
            <h2 className="font-bold text-sm tracking-widest uppercase">Pipeline Execution</h2>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          {activeProspect && (
            <div className="mb-6">
              <h3 className="text-xl font-bold">{activeProspect.title}</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono break-all">{activeProspect.url}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Steps Visualization */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
               <div className={`flex items-center gap-3 mb-3 ${pipelineState?.currentPhase >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                 <div className={`w-5 h-5 rounded-full border-2 ${pipelineState?.currentPhase === 1 ? 'border-blue-500 animate-pulse' : pipelineState?.currentPhase > 1 ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-600'}`}></div>
                 <div className="text-sm font-medium text-slate-300">Phase 1: Scraping DOM & API...</div>
               </div>
               <div className={`flex items-center gap-3 mb-3 ${pipelineState?.currentPhase >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                 <div className={`w-5 h-5 rounded-full border-2 ${pipelineState?.currentPhase === 3 ? 'border-blue-500 animate-pulse' : pipelineState?.currentPhase > 3 ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-600'}`}></div>
                 <div className="text-sm font-medium text-slate-300">Phase 2: OpenRouter Synthesis...</div>
               </div>
               <div className={`flex items-center gap-3 ${pipelineState?.currentPhase >= 5 ? 'opacity-100' : 'opacity-30'}`}>
                 <div className={`w-5 h-5 rounded-full border-2 ${pipelineState?.currentPhase === 5 ? 'border-blue-500 animate-pulse' : pipelineState?.status === 'complete' ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-600'}`}></div>
                 <div className="text-sm font-medium text-slate-300">Phase 3: Supabase Commit...</div>
               </div>
            </div>

            {/* Glowing Terminal Box */}
            <div className="bg-black rounded-lg border border-slate-800 p-4 font-mono text-[10px] text-green-400 h-64 overflow-y-auto mt-4 shadow-inner">
               {pipelineState ? (
                 <>
                   {pipelineState.logs.map((log: string, idx: number) => (
                     <div key={idx}>{log}</div>
                   ))}
                   {pipelineState.status !== 'complete' && <div className="animate-pulse mt-2">_</div>}
                 </>
               ) : (
                 <>
                   <div>[system] Connecting to SSE API...</div>
                   <div className="animate-pulse mt-2">_</div>
                 </>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
