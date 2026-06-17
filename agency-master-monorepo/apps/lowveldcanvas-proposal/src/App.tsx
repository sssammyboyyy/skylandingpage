import React from 'react';
import clientData from './data/client-context.json';
import './App.css'; // Assume custom CSS will be added or Tailwind classes used.

export default function App() {
  return (
    <div className="proposal-body font-sans text-gray-900 selection:bg-blue-600 selection:text-white pb-20">
      
      {/* Topbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="text-sm text-gray-500 hidden sm:block">
          Ready to grow, <strong className="text-gray-900">{clientData.clientName}?</strong> Let's chat.
        </div>
        <div className="flex items-center gap-2">
          <a href={clientData.whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-transform hover:-translate-y-px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.537 5.875L0 24l6.312-1.516C8.04 23.456 9.982 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.664-.513-5.197-1.407l-.371-.22-3.747.9.935-3.646-.241-.376C2.511 15.677 2 13.896 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            WhatsApp Jacques
          </a>
          <a href="#packages" className="inline-flex items-center gap-2 border-[1.5px] border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            View Packages ↓
          </a>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-[60px] flex items-center justify-between px-10 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3 font-extrabold text-base">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#112240] to-blue-800 text-white flex items-center justify-center">J</div>
          JCE Media
        </div>
        <div className="text-right text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-900 block text-sm">Confidential · Prepared for {clientData.clientName}</strong>
          Growth Proposal · {clientData.date}
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-[#112240] pt-20 pb-24 px-10">
        <div className="max-w-[860px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#f0a500]/15 border border-[#f0a500]/30 text-[#f0a500] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-7">
            {clientData.hero.label}
          </div>
          <h1 className="text-white text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6" dangerouslySetInnerHTML={{__html: clientData.hero.title}} />
          <p className="text-white/70 text-lg max-w-[560px] leading-relaxed mb-12">{clientData.hero.subtitle}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden max-w-[600px]">
            {clientData.hero.meta.map((item, i) => (
              <div key={i} className="bg-white/5 p-5">
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{item.label}</div>
                <div className="text-sm font-semibold text-white/90">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="py-20 px-10 bg-white">
        <div className="max-w-[880px] mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-800 mb-3">The Short Version</div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight" dangerouslySetInnerHTML={{__html: clientData.summary.title}} />
          <p className="text-gray-500 text-base max-w-[580px] mb-12">{clientData.summary.subtitle}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
            {clientData.summary.stats.map((stat, i) => (
              <div key={i} className="bg-white p-8">
                <div className="text-[40px] font-extrabold text-blue-800 tracking-tight mb-2 leading-none">{stat.value}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit */}
      <div className="py-20 px-10 bg-[#f0f4ff]">
        <div className="max-w-[880px] mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-800 mb-3">What We Found</div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight">What's holding<br/>{clientData.clientName} back</h2>
          <p className="text-gray-500 text-base max-w-[580px] mb-12">Three key gaps between your incredible legacy and your modern digital footprint.</p>

          {clientData.audit.map((item, i) => (
            <div key={i} className="flex bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all mb-4 border border-gray-200">
              <div className={`w-1.5 shrink-0 ${item.priority === 'critical' ? 'bg-red-600' : item.priority === 'high' ? 'bg-orange-500' : 'bg-blue-600'}`}></div>
              <div className="p-8 w-full">
                <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${
                  item.priority === 'critical' ? 'bg-red-100 text-red-700 border border-red-200' : 
                  item.priority === 'high' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 
                  'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {item.priorityTag}
                </span>
                <span className="block text-[10px] font-bold tracking-widest text-gray-400 mb-2">{item.number}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-sm text-blue-900" dangerouslySetInnerHTML={{__html: item.fix}} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pillars */}
      <div className="py-20 px-10 bg-white">
        <div className="max-w-[880px] mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-800 mb-3">What's on the Table</div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight">Three things.<br/>One joined-up system.</h2>
          <p className="text-gray-500 text-base max-w-[580px] mb-12">Each piece solves a specific problem. Put them together and you have a steady flow of high-margin jobs coming in.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientData.pillars.map((pillar, i) => (
              <div key={i} className={`p-8 rounded-2xl shadow-sm border ${pillar.isFullWidth ? 'md:col-span-2 bg-[#112240] border-transparent' : 'bg-white border-gray-200'}`}>
                <div className="text-3xl mb-4">{pillar.icon}</div>
                <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${pillar.isFullWidth ? 'text-[#f0a500]' : 'text-blue-800'}`}>{pillar.step}</div>
                <h3 className={`text-xl font-bold mb-3 ${pillar.isFullWidth ? 'text-white' : 'text-gray-900'}`}>{pillar.title}</h3>
                <p className={`text-sm mb-5 ${pillar.isFullWidth ? 'text-white/60' : 'text-gray-500'}`}>{pillar.description}</p>
                <ul className="flex flex-col gap-2">
                  {pillar.features.map((feat, fi) => (
                    <li key={fi} className={`text-[13px] relative pl-5 ${pillar.isFullWidth ? 'text-white/70' : 'text-gray-500'}`}>
                      <span className={`absolute left-0 top-0 font-bold ${pillar.isFullWidth ? 'text-[#f0a500]' : 'text-blue-800'}`}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-6 flex gap-4 items-start">
            <span className="text-2xl leading-none">⚡</span>
            <p className="text-sm text-gray-500 leading-relaxed">
              <strong className="text-gray-900">How it all connects:</strong> The website provides the frictionless foundation → Google Ads capture high-intent buyers ready to purchase patio blinds → AI WhatsApp automates B2B scale and instant responses.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="py-20 px-10 bg-[#112240]">
        <div className="max-w-[880px] mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#f0a500] mb-3">Already Done For You</div>
          <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight leading-tight">Before you even said yes,<br/>we built the new standard.</h2>
          <p className="text-white/60 text-base max-w-[580px] mb-12">We audited your current online presence and built the architecture required to dominate Nelspruit.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Old Browser */}
            <div className="rounded-2xl overflow-hidden shadow-xl bg-[#f8f9fa] border border-white/10">
              <div className="bg-[#e8eaed] px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
                </div>
                <div className="bg-white rounded px-2 py-1 text-[10px] font-mono text-gray-500 flex-1">{clientData.demo.oldUrl}</div>
              </div>
              <div className="p-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Current Experience</div>
                <ul className="flex flex-col gap-2">
                  {clientData.demo.oldFeatures.map((f, i) => (
                    <li key={i} className="text-[13px] text-gray-500 relative pl-5"><span className="absolute left-0 text-gray-300">✗</span> {f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* New Browser */}
            <div className="rounded-2xl overflow-hidden shadow-xl bg-[#0d1b2a] border border-blue-900/50">
              <div className="bg-[#1b3c8a] px-4 py-3 flex items-center gap-2 border-b border-blue-800">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
                </div>
                <div className="bg-white/10 rounded px-2 py-1 text-[10px] font-mono text-white/80 flex-1">{clientData.demo.newUrl}</div>
              </div>
              <div className="p-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#f0a500] mb-3">Proposed Standard</div>
                <ul className="flex flex-col gap-2">
                  {clientData.demo.newFeatures.map((f, i) => (
                    <li key={i} className="text-[13px] text-white/70 relative pl-5"><span className="absolute left-0 font-bold text-[#f0a500]">✓</span> {f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-white">
            <h3 className="text-xl font-bold mb-2">{clientData.demo.strategyTitle}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{clientData.demo.strategyDesc}</p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="packages" className="py-20 px-10 bg-[#f0f4ff]">
        <div className="max-w-[880px] mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-800 mb-3">Investment</div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12 tracking-tight leading-tight">Clear packages.<br/>No hidden surprises.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientData.pricing.tiers.map((tier, i) => (
              <div key={i} className={`relative p-8 rounded-3xl border shadow-sm ${tier.isFeatured ? 'bg-[#112240] border-[#112240] shadow-xl' : 'bg-white border-gray-200'}`}>
                {tier.isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f0a500] text-black text-[11px] font-bold tracking-widest px-4 py-1 rounded-full uppercase">
                    ★ Recommended
                  </div>
                )}
                <div className={`text-[11px] font-bold uppercase tracking-widest mb-4 ${tier.isFeatured ? 'text-white/50' : 'text-gray-400'}`}>{tier.name}</div>
                <div className={`text-4xl font-extrabold tracking-tight mb-1 ${tier.isFeatured ? 'text-white' : 'text-gray-900'}`}>
                  {tier.price} <span className={`text-lg font-medium tracking-normal ${tier.isFeatured ? 'text-white/50' : 'text-gray-500'}`}>{tier.subtext}</span>
                </div>
                <div className={`text-xs pb-5 border-b mb-6 ${tier.isFeatured ? 'text-white/50 border-white/10' : 'text-gray-500 border-gray-100'}`}>
                  {tier.setup}
                </div>
                <ul className="flex flex-col gap-3 mb-8">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className={`text-[13px] relative pl-6 ${f.off ? (tier.isFeatured ? 'text-white/30' : 'text-gray-300') : (tier.isFeatured ? 'text-white/80' : 'text-gray-600')}`}>
                      <span className={`absolute left-0 top-0 font-bold ${f.off ? (tier.isFeatured ? 'text-white/30' : 'text-gray-300') : (tier.isFeatured ? 'text-[#f0a500]' : 'text-blue-800')}`}>
                        {f.off ? '—' : '✓'}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <a href={clientData.whatsappLink} className={`block text-center font-bold text-sm px-5 py-3.5 rounded-xl transition-transform hover:-translate-y-px ${tier.isFeatured ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-transparent text-blue-900 border-[1.5px] border-blue-900 hover:bg-blue-900 hover:text-white'}`}>
                  Select {tier.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-[#0d1b2a] py-24 px-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4" dangerouslySetInnerHTML={{__html: clientData.contact.headingHtml}} />
        <p className="text-white/60 max-w-[480px] mx-auto mb-10">{clientData.contact.paragraph}</p>
        <a href={clientData.whatsappLink} className="inline-flex bg-green-600 hover:bg-green-500 text-white font-bold text-sm px-8 py-4 rounded-xl transition-transform hover:-translate-y-px">
          {clientData.contact.ctaText}
        </a>
      </div>

    </div>
  );
}
