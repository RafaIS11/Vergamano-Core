
import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { Send, Zap, Skull, ShieldAlert } from 'lucide-react';

const NeuralLinkView = () => {
    const { chatMessages, sendMessage, isLoading } = useGame();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
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
        <div className="flex flex-col h-[75vh] bg-black border-4 border-black text-white relative">
            {/* HEADER OVERLAY */}
            <div className="absolute top-0 left-0 w-full bg-red-600 text-black px-4 py-1 font-black flex justify-between items-center z-10">
                <span className="flex items-center gap-2"><ShieldAlert size={16} /> MOLTBOT_V4_CORE_ACTIVE</span>
                <span className="animate-pulse">LIVE_CONNECTION_ESTABLISHED</span>
            </div>

            {/* MESSAGES AREA */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-10 mt-8 space-y-8 scrollbar-hide chat-scroll-fix"
            >
                {chatMessages.length === 0 && !isLoading && (
                    <div className="text-center p-20 opacity-30 marker-font text-4xl">
                        WAITING_FOR_COMMANDS...<br />MOLTBOT_IS_WATCHING
                    </div>
                )}

                {chatMessages.map((msg, i) => (
                    <div
                        key={i}
                        className={`
                            flex flex-col max-w-[85%] 
                            ${msg.sender === 'moltbot' ? 'self-start' : 'self-end'}
                        `}
                    >
                        <div className={`
                            ${msg.sender === 'moltbot'
                                ? 'bg-white text-black border-l-8 border-red-600 p-6 font-black text-xl italic'
                                : 'bg-gray-800 text-white p-6 border-2 border-dashed border-gray-400 font-mono'}
                            transition-all hover:scale-[1.01]
                        `}>
                            {msg.sender === 'moltbot' && (
                                <div className="flex items-center gap-2 mb-2 text-red-600">
                                    <Skull size={18} /> <span>GM_MOLTBOT:</span>
                                </div>
                            )}
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content.toUpperCase()}</p>
                        </div>
                        <span className="text-[10px] mt-2 opacity-40 font-mono">
                            {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
            </div>

            {/* INPUT AREA */}
            <div className="p-8 border-t-8 border-white bg-white">
                <div className="flex gap-4">
                    <input
                        className="flex-1 bg-gray-100 text-black p-6 font-black text-xl border-4 border-black focus:outline-none focus:bg-white focus:border-red-600"
                        placeholder="ENTER_YOUR_REPORTS_NOW..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="bg-red-600 text-white p-6 aspect-square flex items-center justify-center hover:bg-black transition-all border-4 border-black"
                    >
                        <Send size={32} />
                    </button>
                </div>
                <div className="mt-4 flex gap-4 text-black font-bold text-xs opacity-50">
                    <span>ESC: CANCEL</span>
                    <span>ENTER: BROADCAST</span>
                    <span className="ml-auto flex items-center gap-1"><Zap size={12} /> HIGH_PRIORITY_CHANNEL</span>
                </div>
            </div>
        </div>
    );
};

export default NeuralLinkView;
