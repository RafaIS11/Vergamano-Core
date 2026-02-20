import React, { useState } from 'react';
import { MapPin, Compass, Scroll, Lock, CheckCircle2, ChevronRight, X, Save } from 'lucide-react';
import {
    ChaoticScribble,
    ChaoticUnderline,
    InkSplatterSVG,
    AggressiveArrow,
    CharcoalStroke
} from './ScribbleElements';
import { DistortedCard } from './DistortedCard';

interface City {
    id: string;
    name: string;
    status: 'locked' | 'active' | 'done';
    description: string;
    journal?: {
        reflection: string;
        learning: string;
        connection: string;
    };
}

const INITIAL_CITIES: City[] = [
    {
        id: 'madrid',
        name: 'MADRID',
        status: 'active',
        description: 'La base de operaciones inicial. El despertar del arquitecto.',
        journal: { reflection: '', learning: '', connection: '' }
    },
    {
        id: 'tokyo',
        name: 'TOKYO',
        status: 'locked',
        description: 'Inmersión en el caos organizado. El espectro se desvanece.',
        journal: { reflection: '', learning: '', connection: '' }
    },
    {
        id: 'medellin',
        name: 'MEDELLÍN',
        status: 'locked',
        description: 'La ciudad de la eterna primavera. El guerrero encuentra su ritmo.',
        journal: { reflection: '', learning: '', connection: '' }
    },
    {
        id: 'berlin',
        name: 'BERLÍN',
        status: 'locked',
        description: 'El muro de la creatividad. El nómada se asienta temporalmente.',
        journal: { reflection: '', learning: '', connection: '' }
    }
];

export const NomadView: React.FC = () => {
    const [cities, setCities] = useState<City[]>(INITIAL_CITIES);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [journalForm, setJournalForm] = useState({ reflection: '', learning: '', connection: '' });

    const totalConquered = cities.filter(c => c.status === 'done').length;
    const progressPercent = Math.round((totalConquered / cities.length) * 100);

    const handleCityClick = (city: City) => {
        if (city.status === 'locked') return;
        setSelectedCity(city);
        setJournalForm(city.journal || { reflection: '', learning: '', connection: '' });
    };

    const saveJournal = () => {
        if (!selectedCity) return;

        const updatedCities = cities.map(c => {
            if (c.id === selectedCity.id) {
                return {
                    ...c,
                    status: 'done' as const,
                    journal: { ...journalForm }
                };
            }
            return c;
        });

        // Unlock next city if current was active
        const currentIndex = cities.findIndex(c => c.id === selectedCity.id);
        if (currentIndex < cities.length - 1 && updatedCities[currentIndex].status === 'done') {
            if (updatedCities[currentIndex + 1].status === 'locked') {
                updatedCities[currentIndex + 1].status = 'active';
            }
        }

        setCities(updatedCities);
        setSelectedCity(null);
    };

    return (
        <div className="p-8 h-full bg-white relative overflow-y-auto">
            {/* BACKGROUND ELEMENTS */}
            <div className="absolute top-10 right-10 opacity-5 pointer-events-none w-96">
                <InkSplatterSVG variant={1} />
            </div>

            <div className="flex justify-between items-start mb-12">
                <div className="relative">
                    <h2 className="text-7xl font-black tracking-tighter uppercase leading-none">
                        NOMAD<br />
                        <span className="text-[#FFEA00] bg-black px-2">CONQUEST</span>
                    </h2>
                    <ChaoticUnderline width={300} className="mt-2" />
                </div>

                <div className="w-64">
                    <div className="flex justify-between font-courier text-xs font-bold mb-1">
                        <span>MUNDO_CONQUISTADO</span>
                        <span>{progressPercent}%</span>
                    </div>
                    <div className="h-8 border-4 border-black p-1 bg-white">
                        <div
                            className="h-full bg-black transition-all duration-1000"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-12">

                {/* WORLD MAP / SKILL TREE */}
                <div className="col-span-8 relative">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <ChaoticScribble className="w-full h-full" />
                    </div>

                    <div className="flex flex-col gap-16 relative z-10 pl-24 border-l-[12px] border-black py-12">
                        {cities.map((city, index) => (
                            <div key={city.id} className="relative group">
                                {/* Connector Arrow */}
                                {index < cities.length - 1 && (
                                    <div className="absolute -left-[54px] top-12 h-16 w-12 text-black">
                                        <AggressiveArrow direction="down" className="w-full h-full opacity-30" />
                                    </div>
                                )}

                                {/* Node Button */}
                                <button
                                    onClick={() => handleCityClick(city)}
                                    className={`
                    relative text-left p-6 border-[8pt] transition-all duration-200
                    ${city.status === 'done' ? 'bg-[#00FF00] border-black scale-105' : ''}
                    ${city.status === 'active' ? 'bg-[#FFEA00] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' : ''}
                    ${city.status === 'locked' ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
                  `}
                                >
                                    <div className="flex items-center gap-4">
                                        {city.status === 'done' && <CheckCircle2 className="w-8 h-8 text-black" />}
                                        {city.status === 'active' && <Compass className="w-8 h-8 text-black animate-spin-slow" />}
                                        {city.status === 'locked' && <Lock className="w-8 h-8 text-gray-400" />}

                                        <div>
                                            <span className="font-courier text-xs font-black opacity-50 uppercase tracking-widest">
                                                Nivel_{String(index + 1).padStart(2, '0')}
                                            </span>
                                            <h3 className="text-4xl font-black leading-none uppercase">{city.name}</h3>
                                        </div>
                                    </div>

                                    {city.status !== 'locked' && (
                                        <div className="mt-4 flex items-center justify-between">
                                            <p className="font-courier text-xs max-w-xs">{city.description}</p>
                                            <ChevronRight className="w-6 h-6" />
                                        </div>
                                    )}

                                    {/* Scribbles */}
                                    {city.status === 'active' && (
                                        <div className="absolute -top-6 -right-6 w-12 h-12">
                                            <InkSplatterSVG variant={2} />
                                        </div>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* STATS / INFO PANEL */}
                <div className="col-span-4 space-y-8">
                    <DistortedCard title="INVENTARIO_NÓMADA" scribbleIntensity="medium">
                        <div className="flex gap-4 mb-4">
                            <div className="p-2 border-2 border-black inline-block">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div className="p-2 border-2 border-black inline-block opacity-30">
                                <Compass className="w-6 h-6" />
                            </div>
                            <div className="p-2 border-2 border-black inline-block">
                                <Scroll className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="font-courier text-xs">
                            Los registros de ciudad (Journaling) son necesarios para desbloquear XP de sabiduría.
                        </p>
                    </DistortedCard>

                    <div className="relative border-[10pt] border-black p-6 bg-[#FFEEEE] rotate-[2deg]">
                        <div className="absolute top-2 right-2">
                            <InkSplatterSVG variant={1} className="w-8 h-8 opacity-20" />
                        </div>
                        <h4 className="text-2xl font-black uppercase mb-1 italic">PRÓXIMA MISIÓN</h4>
                        <div className="font-courier font-bold text-sm">
                            {cities.find(c => c.status === 'locked')?.name || 'ROADMAP COMPLETADO'}
                        </div>
                        <div className="mt-4 h-1 w-full bg-black opacity-20" />
                        <CharcoalStroke className="absolute -bottom-4 left-0 w-full" />
                    </div>
                </div>
            </div>

            {/* CITY DATA MODAL (Journaling) */}
            {selectedCity && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" onClick={() => setSelectedCity(null)} />

                    <div className="relative w-full max-w-2xl bg-white border-[12pt] border-black p-10 shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setSelectedCity(null)}
                            className="absolute top-4 right-4 p-2 hover:bg-black hover:text-white transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="mb-8">
                            <h3 className="text-6xl font-black tracking-tighter uppercase leading-none">
                                {selectedCity.name}
                            </h3>
                            <p className="text-xl font-bold italic text-[#FF1A1A] mt-2 font-courier">
                                CITY_LOG_SINC_{selectedCity.id.toUpperCase()}
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="block text-xl font-black uppercase">01. REFLEXIÓN</label>
                                <p className="font-courier text-sm opacity-60">¿Cómo te sientes en este entorno? Describe la energía de la ciudad.</p>
                                <textarea
                                    value={journalForm.reflection}
                                    onChange={e => setJournalForm({ ...journalForm, reflection: e.target.value })}
                                    className="w-full h-32 border-4 border-black p-4 font-courier text-sm focus:bg-gray-50 outline-none"
                                    placeholder="ESCRIBE O MUERE..."
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xl font-black uppercase">02. APRENDIZAJE</label>
                                <p className="font-courier text-sm opacity-60">¿Qué lección vital o técnica has extraído hoy?</p>
                                <textarea
                                    value={journalForm.learning}
                                    onChange={e => setJournalForm({ ...journalForm, learning: e.target.value })}
                                    className="w-full h-32 border-4 border-black p-4 font-courier text-sm focus:bg-gray-50 outline-none"
                                    placeholder="..."
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xl font-black uppercase">03. CONEXIÓN</label>
                                <p className="font-courier text-sm opacity-60">¿Cómo se alinea este punto del mapa con tu visión de Arquitecto?</p>
                                <textarea
                                    value={journalForm.connection}
                                    onChange={e => setJournalForm({ ...journalForm, connection: e.target.value })}
                                    className="w-full h-32 border-4 border-black p-4 font-courier text-sm focus:bg-gray-50 outline-none"
                                    placeholder="..."
                                />
                            </div>

                            <button
                                onClick={saveJournal}
                                className="w-full py-6 bg-[#00FF00] border-4 border-black font-black text-3xl uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center gap-4 group"
                            >
                                <Save className="w-8 h-8 group-hover:animate-bounce" />
                                CONQUISTAR CIUDAD
                            </button>
                        </div>

                        <div className="mt-8 flex justify-center opacity-10">
                            <InkSplatterSVG variant={1} className="w-32 h-32" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
