
import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';

const NeuralLinkView = () => {
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
        <div className="flex flex-col h-[calc(100vh-280px)] p-6 bg-white basquiat-border">
            {/* Header Artístico */}
            <div className="flex items-center gap-6 border-b-8 border-black pb-6 mb-8">
                <div className="w-12 h-12 bg-red-600 rotate-3 shadow-xl" />
                <h2 className="basquiat-font text-5xl tracking-tighter uppercase italic">ENLACE_NEURAL_v4.0</h2>
                <div className="ml-auto flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="typewriter text-[10px] font-black uppercase">FRECUENCIA_ESTABLE_MOLTBOT</span>
                </div>
            </div>

            {/* Area de Mensajes estilo Sketchbook */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-10 mb-8 pr-4 custom-scrollbar">
                {chatMessages.length === 0 && (
                    <div className="text-center py-20 opacity-10 basquiat-font text-4xl">
                        SILENCIO_EN_EL_SISTEMA
                    </div>
                )}
                {chatMessages.map((msg, i) => (
                    <div key={msg.id || i} className={`flex flex-col ${msg.sender === 'rafael' ? 'items-end' : 'items-start'}`}>
                        <div className="flex gap-4 mb-2 opacity-40 text-[10px] uppercase font-black">
                            <span>{msg.sender === 'rafael' ? 'RAFAEL_IBARRA' : 'MOLTBOT_GM'}</span>
                            <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div className={`max-w-[85%] p-6 relative transition-all hover:scale-[1.01]
                            ${msg.sender === 'rafael'
                                ? 'basquiat-border bg-black text-white rotate-1 shadow-2xl'
                                : 'basquiat-border bg-white text-black -rotate-1 shadow-2xl before:content-["M"] before:absolute before:-top-4 before:-left-4 before:bg-red-600 before:text-white before:px-2'} `}>

                            <p className={`${msg.sender === 'rafael' ? 'font-mono' : 'basquiat-font'} text-2xl leading-tight uppercase`}>
                                {msg.content}
                            </p>

                            {/* Garabatos decorativos dinámicos */}
                            <div className="absolute -bottom-4 -right-4 w-10 h-10 opacity-10">
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray="10 5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Estilo Comandos Crudos */}
            <form onSubmit={handleSubmit} className="relative mt-auto">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="TRANSMITE_AL_GM..."
                    className="w-full bg-white basquiat-border p-8 pl-10 focus:outline-none focus:ring-12 focus:ring-red-600 focus:ring-opacity-20 transition-all placeholder:opacity-30 uppercase font-black text-3xl basquiat-font"
                    autoFocus
                />
                <button
                    type="submit"
                    className="absolute right-6 top-1/2 -translate-y-1/2 banksy-card px-8 py-2 text-xl hover:bg-red-600"
                >
                    ENVIAR
                </button>
            </form>
        </div>
    );
};

export default NeuralLinkView;
