
import { useRef, useEffect, useState, type FormEvent } from 'react';
import { useGame } from '../../context/GameContext';
import { Send, Loader2 } from 'lucide-react';
import { BasquiatCrown } from './ScribbleElements';

const NeuralLinkView = () => {
    const { chatMessages, sendMessage } = useGame();
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [waitingForMoltbot, setWaitingForMoltbot] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const lastSender = chatMessages.length > 0 ? chatMessages[chatMessages.length - 1].sender : null;

    // When last message is from Rafael, show Moltbot typing indicator
    useEffect(() => {
        if (lastSender === 'rafael') {
            setWaitingForMoltbot(true);
        } else {
            setWaitingForMoltbot(false);
        }
    }, [lastSender]);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, waitingForMoltbot]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || sending) return;
        const msg = input.trim();
        setInput('');
        setSending(true);
        await sendMessage(msg);
        setSending(false);
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-[65vh] bg-black">
            {/* Header */}
            <div className="border-b-4 border-red-600 p-4 flex items-center gap-4">
                <div className="w-10 h-6 text-red-600">
                    <BasquiatCrown className="w-full h-full" />
                </div>
                <div>
                    <h2 className="font-black text-red-600 uppercase tracking-widest"
                        style={{ fontFamily: "'Space Mono', monospace" }}>
                        ENLACE_NEURAL // MOLTBOT_V5.0
                    </h2>
                    <p className="text-xs text-green-500 font-bold font-mono">
                        ● CANAL ABIERTO // RESPUESTA EN ~5 SEG
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {chatMessages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <p className="font-black text-gray-600 text-center text-sm">
                            Dile a Moltbot qué necesitas.<br />
                            <span className="text-gray-500 font-mono">
                                "ponme misiones para hoy" / "¿cómo voy?" / "qué debería hacer"
                            </span>
                        </p>
                    </div>
                )}

                {chatMessages.map((msg) => {
                    const isRafael = msg.sender === 'rafael';
                    return (
                        <div key={msg.id} className={`flex ${isRafael ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] relative ${isRafael
                                ? 'bg-blue-600 text-white border-[3px] border-blue-400'
                                : 'bg-black text-white border-[3px] border-red-600'
                                }`}>
                                {/* Sender badge */}
                                <div className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border-b-2 ${isRafael
                                    ? 'border-blue-400 text-blue-200'
                                    : 'border-red-600 text-red-500'
                                    }`}>
                                    {isRafael ? '> RAFAEL_IBARRA' : '> MOLTBOT_GM V5.0'}
                                </div>
                                <p className="px-4 py-3 font-bold text-sm leading-relaxed whitespace-pre-wrap">
                                    {msg.content}
                                </p>
                                <div className="px-3 pb-1 text-[9px] opacity-30 font-mono">
                                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Moltbot typing indicator */}
                {waitingForMoltbot && (
                    <div className="flex justify-start">
                        <div className="bg-black text-white border-[3px] border-red-600 px-4 py-3 flex items-center gap-3">
                            <Loader2 size={16} className="animate-spin text-red-600" />
                            <span className="text-xs font-black text-red-500 uppercase tracking-wider">
                                MOLTBOT procesando...
                            </span>
                            <span className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <span key={i} className="w-2 h-2 bg-red-600 rounded-full animate-pulse"
                                        style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </span>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit}
                className="border-t-4 border-red-600 p-4 flex gap-3">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Habla con Moltbot... pídele misiones, consejo, contexto"
                    disabled={sending}
                    className="flex-1 bg-gray-900 border-2 border-gray-700 text-white px-4 py-3 font-bold text-sm
                        focus:outline-none focus:border-red-600 disabled:opacity-50 font-mono placeholder:text-gray-600"
                />
                <button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className="bg-red-600 text-white border-2 border-red-600 px-6 py-3 font-black uppercase
                        hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
                        active:translate-y-1 transition-all"
                >
                    {sending
                        ? <Loader2 size={16} className="animate-spin" />
                        : <Send size={16} />
                    }
                    <span className="hidden sm:inline">ENVIAR</span>
                </button>
            </form>
        </div>
    );
};

export default NeuralLinkView;
