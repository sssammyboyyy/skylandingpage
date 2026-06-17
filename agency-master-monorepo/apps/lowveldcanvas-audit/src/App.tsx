import React from 'react';
import ReactMarkdown from 'react-markdown';
import auditData from './data/audit-context.json';

const ScoreCard = ({ label, value }: { label: string, value: number }) => {
  const getColor = (val: number) => {
    if (val < 30) return 'text-red-500';
    if (val < 60) return 'text-orange-500';
    return 'text-green-500';
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
      <div className={`text-4xl font-extrabold mb-2 ${getColor(value)}`}>{value}/100</div>
      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-agency-accent selection:text-white">
      {/* Header */}
      <header className="bg-agency-dark text-white py-16 px-6 sm:px-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Digital Marketing Audit</h1>
        <h2 className="text-2xl sm:text-3xl text-agency-accent font-bold mb-4">{auditData.clientName}</h2>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">{auditData.subtitle}</p>
      </header>

      {/* Scores Grid */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {auditData.scores.map((score, idx) => (
            <ScoreCard key={idx} label={score.label} value={score.value} />
          ))}
        </div>
      </section>

      {/* Audit Sections */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {auditData.sections.map((section, idx) => (
          <section key={idx} className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-200">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-agency-dark mb-6 border-b border-gray-100 pb-4">
              {section.title}
            </h3>
            <div className="prose prose-lg text-gray-600 prose-headings:text-agency-dark prose-a:text-agency-accent prose-strong:text-agency-dark">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-agency-dark text-white/50 text-center py-8 text-sm">
        <p>Audited by JCE Media X Review Tap Team</p>
      </footer>
    </div>
  );
}
