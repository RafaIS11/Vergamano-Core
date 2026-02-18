
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { Terminal } from 'lucide-react';

const NeuralLinkView: React.FC = () => {
    const { chatMessages, sendMessage } = useGame();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-[#050505] text-[#00FF41] font-courier p-8 border-[12px] border-black m-4">
            {/* Terminal Header */}
            <div className="flex items-center gap-4 border-b-[4px] border-[#00FF41] pb-4 mb-6">
                <Terminal size={32} />
                <h2 className="text-3xl font-black tracking-widest uppercase">ENLACE_NEURAL_v3.5</h2>
                <div className="ml-auto flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00FF41] animate-pulse" />
                    <div className="w-3 h-3 rounded-full bg-[#00FF41] opacity-50" />
                    <div className="w-3 h-3 rounded-full bg-[#00FF41] opacity-20" />
                </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 mb-6 custom-scrollbar">
                {chatMessages.map((msg, i) => (
                    <div key={msg.id || i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className="flex gap-2 mb-1 opacity-50 text-xs">
                            <span className="uppercase tracking-widest">{msg.sender === 'user' ? 'OPERADOR_SIGMA' : 'MOLTBOT'}</span>
                            <span>[{new Date(msg.timestamp).toLocaleTimeString()}]</span>
                        </div>
                        <div className={`max-w-[80%] p-4 border-[2px] ${msg.sender === 'user' ? 'border-[#00FF41] bg-[#002200]' : 'border-white text-white'}`}>
                            {msg.sender === 'user' && <span className="mr-2">&gt;</span>}
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold">&gt;</div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="INGRESA COMANDO O MENSAJE PARA MOLTBOT..."
                    className="w-full bg-transparent border-[4px] border-[#00FF41] p-4 pl-10 focus:outline-none focus:ring-4 focus:ring-[#00FF41] focus:ring-opacity-20 transition-all placeholder:opacity-30 uppercase"
                    autoFocus
                />
            </form>
        </div>
    );
};

export default NeuralLinkView;
