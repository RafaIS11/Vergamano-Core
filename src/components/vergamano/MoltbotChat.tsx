import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';

export const MoltbotChat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true }).limit(50);
      if (data) setMessages(data);
    };
    fetchMessages();

    const channel = supabase.channel('chat_sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, 
      (payload) => {
        setMessages(prev => [...prev, payload.new]);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="border-8 border-black bg-white flex flex-col h-[400px]">
      <div className="bg-black text-white p-2 text-xs font-black uppercase tracking-widest">
        Canal_Moltbot_v3.5
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm bg-gray-100">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 ${m.sender === 'Moltbot' ? 'border-l-4 border-red-600 bg-white' : 'border-l-4 border-black bg-gray-200'}`}>
            <p className="text-[10px] font-black uppercase mb-1">{m.sender}</p>
            <p className="leading-tight">{m.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
