import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: 'Hi Jacques! Do you have any questions about the proposal?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: 'I am a mockup AI agent! In production, I will route this to your CRM and answer objections.' }]);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-agency-dark dark:bg-agency-accent text-white dark:text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-transform ${isOpen ? 'hidden' : 'block'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-80 bg-white dark:bg-agency-dark rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col"
          >
            <div className="bg-agency-dark dark:bg-black p-4 flex justify-between items-center text-white">
              <div className="font-bold">AI Assistant</div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">✕</button>
            </div>
            
            <div className="flex-1 p-4 h-64 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-agency-accent text-black rounded-br-sm' : 'bg-gray-100 dark:bg-white/10 dark:text-white rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-white/10 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..." 
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/10 focus:border-agency-accent dark:text-white rounded-lg outline-none text-sm"
              />
              <button 
                onClick={handleSend}
                className="bg-agency-dark dark:bg-agency-accent text-white dark:text-black px-4 py-2 rounded-lg font-bold text-sm"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
