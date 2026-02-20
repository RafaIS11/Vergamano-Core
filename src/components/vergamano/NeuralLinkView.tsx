
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';

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
        <div className="flex flex-col h-[calc(100vh-280px)] bg-white text-black font-courier p-8 vergamano-border-thick m-8 vergamano-shadow-large">
            {/* Terminal Header */}
            <div className="flex items-center gap-4 border-b-4 border-black pb-4 mb-6">
                <div className="w-8 h-8 bg-black" />
                <h2 className="text-3xl font-black tracking-widest uppercase italic">ENLACE_NEURAL_v3.5</h2>
                <div className="ml-auto flex gap-2">
                    <span className="text-xs font-bold animate-pulse">ESCUCHANDO_FRECUENCIA_MOLTBOT...</span>
                </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-8 mb-6 pr-4">
                {chatMessages.length === 0 && (
                    <div className="text-center py-20 opacity-20 italic">
                        --- NO HAY REGISTROS EN LA SESIÓN ACTUAL ---
                    </div>
                )}
                {chatMessages.map((msg, i) => (
                    <div key={msg.id || i} className={`flex flex-col ${msg.sender === 'rafael' ? 'items-end' : 'items-start'}`}>
                        <div className="flex gap-4 mb-1 opacity-40 text-[10px] font-black uppercase">
                            <span>{msg.sender === 'rafael' ? 'RAFAEL_IBARRA' : 'MOLTBOT'}</span>
                            <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div className={`max-w-[75%] p-6 vergamano-border relative
                            ${msg.sender === 'rafael' ? 'bg-black text-white vergamano-shadow' : 'bg-white vergamano-shadow'}`}>

                            {/* Decoración Táctica */}
                            <div className={`absolute -top-2 -left-2 w-4 h-4 vergamano-border ${msg.sender === 'rafael' ? 'bg-white' : 'bg-black'}`} />

                            <p className="text-xl font-bold leading-tight uppercase">
                                {msg.sender === 'rafael' && <span className="mr-2">&gt;</span>}
                                {msg.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="relative mt-auto">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black">&gt;</div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="INTRODUCE COMANDO O TRANSMITE A MOLTBOT..."
                    className="w-full bg-white vergamano-border-thick p-6 pl-12 focus:outline-none focus:ring-8 focus:ring-black focus:ring-opacity-5 transition-all placeholder:opacity-40 uppercase font-black text-xl"
                    autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-2 h-2 bg-black animate-ping" />
                </div>
            </form>
        </div>
    );
};

export default NeuralLinkView;
