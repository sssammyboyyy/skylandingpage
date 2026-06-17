import React from 'react';

export const WhatsAppMockup = ({ scenario, contactName, messages }) => (
  <div className="rounded-[18px] overflow-hidden shadow-md bg-[#e5ddd5]">
    <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-agency-dark text-center py-2 px-3 bg-white/60 border-b border-black/10">
      {scenario}
    </div>
    <div className="bg-[#128c7e] py-2.5 px-3.5 flex items-center gap-2.5">
      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-[16px] shrink-0">🏭</div>
      <div>
        <div className="text-white font-bold text-[13px] leading-[1.2]">{contactName}</div>
        <div className="text-white/70 text-[10px]">online</div>
      </div>
    </div>
    <div className="p-2.5 flex flex-col gap-1.5 h-[280px] overflow-y-auto">
      {messages.map((msg, idx) => {
        if (msg.type === 'system') {
          return (
            <div key={idx} className="text-[10px] text-gray-500 text-center bg-black/5 px-2.5 py-1 rounded-full self-center italic my-0.5">
              {msg.text}
            </div>
          );
        }
        const isOut = msg.type === 'out';
        return (
          <div key={idx} className={`max-w-[82%] py-1.5 px-2.5 rounded-[7px] text-[11.5px] leading-[1.5] text-[#2d2d2d] ${isOut ? 'bg-[#dcf8c6] self-end rounded-tr-[1px]' : 'bg-white self-start rounded-tl-[1px]'}`}>
            {msg.text}
            <div className="text-[9px] text-gray-400 text-right mt-[1px]">{msg.time}</div>
          </div>
        );
      })}
    </div>
  </div>
);
