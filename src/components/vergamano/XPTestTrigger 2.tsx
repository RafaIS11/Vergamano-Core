import React, { useState } from 'react';

const XP_WEBHOOK_URL = 'https://primary-production-1110.up.railway.app/webhook/ea5df992-9366-4c88-a12c-2f019c1de025';

export const XPTestTrigger: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [pillar, setPillar] = useState('architect');
    const [xp, setXp] = useState(10);

    const triggerXP = async () => {
        setLoading(true);
        try {
            const response = await fetch(XP_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: '6e4caca8-b3b6-4142-ad98-f26a84949049', // Default user from n8n context
                    pillar,
                    xp_gained: xp
                })
            });
            console.log('XP Trigger Response:', await response.json());
        } catch (err) {
            console.error('Failed to trigger XP:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-32 right-8 z-[100] bg-black text-white p-4 border-4 border-[#FF1A1A] font-courier max-w-xs shadow-[10px_10px_0px_0px_rgba(255,26,26,0.3)]">
            <h4 className="text-sm font-black mb-2 uppercase tracking-tighter">NYX_INTERFACE: TEST_XP</h4>
            <div className="flex flex-col gap-2">
                <select
                    value={pillar}
                    onChange={(e) => setPillar(e.target.value)}
                    className="bg-white text-black p-1 text-xs uppercase font-bold"
                >
                    <option value="architect">Arquitecto</option>
                    <option value="spartan">Espartano</option>
                    <option value="mercenary">Mercenario</option>
                    <option value="nomad">Nómada</option>
                    <option value="ghost">Espectro</option>
                </select>
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={xp}
                        onChange={(e) => setXp(Number(e.target.value))}
                        className="bg-white text-black p-1 text-xs font-bold w-16"
                    />
                    <button
                        onClick={triggerXP}
                        disabled={loading}
                        className={`flex-1 p-1 text-xs font-black uppercase transition-colors ${loading ? 'bg-gray-500' : 'bg-[#FF1A1A] hover:bg-white hover:text-black'}`}
                    >
                        {loading ? 'SINCRONIZANDO...' : 'INYECTAR_XP'}
                    </button>
                </div>
            </div>
        </div>
    );
};
