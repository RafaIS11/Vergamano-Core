import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Send } from 'lucide-react';

const ChatView: React.FC = () => {
    const { chatMessages, sendMessage } = useGame();
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll al recibir mensajes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || sending) return;
        setInput('');
        setSending(true);
        await sendMessage(text);
        setSending(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const isAgent = (sender: string) => sender !== 'rafael';

    return (
        <div className="flex flex-col h-[75vh]">
            {/* Header */}
            <div className="border-b-[6px] border-black pb-4 mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-black text-4xl uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                            CHAT
                        </h2>
                        <p className="font-black text-xs opacity-40 uppercase tracking-widest mt-1">
                            AGENTE_VERGAMANO // Pide ayuda, crea tareas, consulta tu progreso
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-black text-xs uppercase tracking-widest">EN LÍNEA</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4"
                style={{ scrollbarWidth: 'none' }}
            >
                {chatMessages.length === 0 && (
                    <div className="flex items-center justify-center h-full opacity-20">
                        <p className="font-black uppercase text-center">
                            SIN MENSAJES AÚN<br />
                            <span className="text-xs">Empieza hablando con el agente</span>
                        </p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {chatMessages.map((msg) => {
                        const agent = isAgent(msg.sender);
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.15 }}
                                className={`flex ${agent ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[75%] border-[3px] border-black p-3 ${
                                        agent
                                            ? 'bg-black text-white'
                                            : 'bg-white text-black'
                                    }`}
                                    style={{ boxShadow: agent ? '3px 3px 0 rgba(0,0,0,0.3)' : '3px 3px 0 black' }}
                                >
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">
                                        {agent ? 'AGENTE_VERGAMANO' : 'TÚ'}
                                    </p>
                                    <p className="font-bold text-sm leading-relaxed whitespace-pre-wrap">
                                        {msg.content}
                                    </p>
                                    <p className="text-[8px] opacity-30 mt-1 font-black text-right">
                                        {new Date(msg.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Typing indicator cuando estamos esperando respuesta del agente */}
                {sending && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="border-[3px] border-black bg-black text-white px-4 py-3 flex gap-1 items-center">
                            {[0, 1, 2].map(i => (
                                <motion.div
                                    key={i}
                                    className="w-1.5 h-1.5 bg-white rounded-full"
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input */}
            <div className="border-t-[5px] border-black pt-4">
                <div className="flex gap-3">
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Habla con el agente... (Shift+Enter = nueva línea)"
                        rows={2}
                        className="flex-1 border-[4px] border-black p-3 font-bold text-sm bg-white resize-none focus:outline-none focus:border-black"
                        style={{ fontFamily: "'Space Mono', monospace", boxShadow: '3px 3px 0 black' }}
                        disabled={sending}
                    />
                    <button
                        onClick={handleSend}
                        disabled={sending || !input.trim()}
                        className="border-[4px] border-black px-5 font-black uppercase text-sm flex items-center gap-2 transition-all disabled:opacity-40"
                        style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="font-black text-[9px] uppercase opacity-30 mt-2 tracking-widest">
                    Enter para enviar · El agente puede crear y eliminar tareas
                </p>
            </div>
        </div>
    );
};

export default ChatView;
