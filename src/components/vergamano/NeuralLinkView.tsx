
import { useRef, useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Send, Zap, User, Coffee, Flame } from 'lucide-react';

const NeuralLinkView = () => {
    const { chatMessages, sendMessage, isLoading } = useGame();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        await sendMessage(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-[75vh] bg-[#0a0a0a] border-8 border-black text-white relative">
            <div className="absolute top-0 left-0 w-full bg-black text-white px-6 py-3 font-black flex justify-between items-center border-b-4 border-gray-800 z-10">
                <span className="flex items-center gap-3 text-red-600 animate-pulse"><Zap size={20} /> ENLACE_NEURAL_CON_MOLTBOT</span>
                <span className="text-xs opacity-40 font-mono uppercase">Canal_Privado_V4.0</span>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 pt-20 space-y-10 scrollbar-hide"
            >
                {chatMessages.length === 0 && !isLoading && (
                    <div className="text-center p-32 opacity-20 marker-font text-5xl">
                        CONEXIÓN_ESTABLECIDA...<br />HABLA_CON_EL_HOMIE
                    </div>
                )}

                {chatMessages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex flex-col max-w-[85%] ${msg.sender === 'moltbot' ? 'self-start' : 'self-end'}`}
                    >
                        <div className={`flex items-center gap-3 mb-2 ${msg.sender === 'moltbot' ? 'text-red-600' : 'text-blue-600 flex-row-reverse'}`}>
                            {msg.sender === 'moltbot' ? <Flame size={18} /> : <User size={18} />}
                            <span className="text-xs font-black uppercase">{msg.sender === 'moltbot' ? 'MOLTBOT' : 'RAFAEL'}</span>
                        </div>
                        <div className={`
                            p-8 font-bold text-xl leading-relaxed
                            ${msg.sender === 'moltbot'
                                ? 'bg-white text-black border-l-[12px] border-red-600 shadow-[10px_10px_0px_rgba(255,255,255,0.1)]'
                                : 'bg-blue-900 text-white border-2 border-dashed border-blue-400 opacity-90'}
                        `}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-10 bg-black border-t-8 border-gray-900">
                <div className="flex gap-6">
                    <input
                        className="flex-1 bg-gray-900 text-white p-8 font-black text-2xl border-4 border-gray-700 focus:outline-none focus:border-red-600 transition-all"
                        placeholder="Escribe aquí, loco..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="bg-red-600 text-white px-10 flex items-center justify-center hover:bg-white hover:text-black transition-all border-4 border-black group"
                    >
                        <Send size={40} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
                <div className="mt-6 flex gap-10 text-gray-500 font-bold text-xs uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Coffee size={14} /> Modo_Homie_Activo</span>
                    <span>ENTER: Transmitir_Señal</span>
                </div>
            </div>
        </div>
    );
};

export default NeuralLinkView;
