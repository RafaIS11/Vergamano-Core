import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Lock, CheckCircle, Trophy } from 'lucide-react';

// THE CANONICAL CITY OBJECTIVES — each city has milestones that together = the XP gate
const CITY_DATA = [
    {
        name: 'CARACAS', flag: '🇻🇪', xp_needed: 0, color: '#22c55e', country: 'Venezuela',
        description: 'La base. El punto de partida. Aquí empieza el protocolo.',
        status_label: 'BASE DE OPERACIONES',
        objectives: [
            { id: 'car1', label: 'Definir los 5 Pilares y primeras misiones', xp: 0, done: true },
            { id: 'car2', label: 'Instalar VergaMano OS y configurar perfil', xp: 0, done: true },
            { id: 'car3', label: 'Primera semana de rutina completada', xp: 0, done: true },
        ]
    },
    {
        name: 'MADRID', flag: '🇪🇸', xp_needed: 1000, color: '#ef4444', country: 'España',
        description: 'Primera conquista europea. Establecer presencia, red, y primera fuente de ingreso.',
        status_label: 'OBJETIVO ACTUAL',
        objectives: [
            { id: 'mad1', label: 'Completar portfolio técnico completo', xp: 150, done: false },
            { id: 'mad2', label: 'Conseguir primer cliente freelance en España', xp: 300, done: false },
            { id: 'mad3', label: 'Mantener 30 días de racha sin fallar misiones', xp: 200, done: false },
            { id: 'mad4', label: 'Construir red de 10 contactos profesionales europeos', xp: 150, done: false },
            { id: 'mad5', label: 'Facturar 500€ en un mes desde remoto', xp: 200, done: false },
        ]
    },
    {
        name: 'BRUSELAS', flag: '🇧🇪', xp_needed: 2500, color: '#f59e0b', country: 'Bélgica',
        description: 'Capital política europea. Arquitectura de sistemas. Visibilidad internacional.',
        status_label: 'BLOQUEADA',
        objectives: [
            { id: 'bru1', label: 'Crear y lanzar un SaaS o producto digital propio', xp: 500, done: false },
            { id: 'bru2', label: 'Conseguir certificación técnica (AWS, Google, etc.)', xp: 400, done: false },
            { id: 'bru3', label: 'Publicar 10 posts de valor en LinkedIn con viral mínimo', xp: 300, done: false },
            { id: 'bru4', label: 'Automatizar al menos 3 flujos con n8n en producción', xp: 300, done: false },
            { id: 'bru5', label: 'Mantener 60 días de racha sin interrupciones', xp: 500, done: false },
            { id: 'bru6', label: 'Facturar 1500€ en un mes', xp: 500, done: false },
        ]
    },
    {
        name: 'COPENHAGUE', flag: '🇩🇰', xp_needed: 5000, color: '#3b82f6', country: 'Dinamarca',
        description: 'Calidad de vida elite. Disciplina nórdica. Cuerpo y mente al máximo.',
        status_label: 'BLOQUEADA',
        objectives: [
            { id: 'cop1', label: 'Bajar a menos de 15% de grasa corporal', xp: 800, done: false },
            { id: 'cop2', label: '100 días consecutivos de entrenamiento', xp: 600, done: false },
            { id: 'cop3', label: 'Meditar 30 días consecutivos (mínimo 10 min/día)', xp: 400, done: false },
            { id: 'cop4', label: 'Leer 10 libros de los pilares (desarrollo, finanzas, cuerpo)', xp: 500, done: false },
            { id: 'cop5', label: 'Eliminar toda deuda y tener 3 meses de ahorro', xp: 700, done: false },
            { id: 'cop6', label: 'Ingresos mensuales mínimos 3000€', xp: 1000, done: false },
        ]
    },
    {
        name: 'BERLÍN', flag: '🇩🇪', xp_needed: 8000, color: '#1a1a1a', country: 'Alemania',
        description: 'Ciudad de creación. Arte, música y tecnología. Donde los emprendedores se forjan.',
        status_label: 'BLOQUEADA',
        objectives: [
            { id: 'ber1', label: 'Lanzar agencia o estudio de servicios digitales', xp: 1200, done: false },
            { id: 'ber2', label: 'Conseguir 3 clientes recurrentes de alto ticket', xp: 1000, done: false },
            { id: 'ber3', label: 'Dominar inglés profesional (C1 verificado)', xp: 600, done: false },
            { id: 'ber4', label: 'Crear sistema de ingresos pasivos (€500+/mes)', xp: 800, done: false },
            { id: 'ber5', label: 'Vivir 1 mes en el extranjero mientras sigues produciendo', xp: 400, done: false },
        ]
    },
    {
        name: 'SAN FRANCISCO', flag: '🇺🇸', xp_needed: 12000, color: '#8b5cf6', country: 'USA',
        description: 'Silicon Valley. El juego de los mejores. Escalar, captar inversión o conquistar clientes tech.',
        status_label: 'BLOQUEADA',
        objectives: [
            { id: 'sf1', label: 'Conectar con 3 founders de startups o VCs', xp: 1500, done: false },
            { id: 'sf2', label: 'Lanzar producto con 100 usuarios activos pagantes', xp: 2000, done: false },
            { id: 'sf3', label: 'Ingresos mensuales mínimos 6000€', xp: 1500, done: false },
            { id: 'sf4', label: 'Presentar en un evento tech o publicar en Product Hunt', xp: 600, done: false },
            { id: 'sf5', label: 'Equipo formado: primera contratación o partnership', xp: 400, done: false },
        ]
    },
    {
        name: 'BALI', flag: '🇮🇩', xp_needed: 17000, color: '#14b8a6', country: 'Indonesia',
        description: 'Freedom. Trabajo desde cualquier lugar. Nómada digital real, no postureo.',
        status_label: 'BLOQUEADA',
        objectives: [
            { id: 'bal1', label: 'Sistema de trabajo 100% remoto y asíncrono', xp: 2000, done: false },
            { id: 'bal2', label: 'Vivir 3 meses fuera de tu país base trabajando igual', xp: 1500, done: false },
            { id: 'bal3', label: 'Ingresos mensuales mínimos 8000€', xp: 2000, done: false },
            { id: 'bal4', label: 'Automatizar el 80% de tus procesos de negocio', xp: 1500, done: false },
        ]
    },
    {
        name: 'OSLO', flag: '🇳🇴', xp_needed: 23000, color: '#0ea5e9', country: 'Noruega',
        description: 'Bienestar supremo. La ciudad más cara y más feliz. Aquí se vive, no solo se sobrevive.',
        status_label: 'BLOQUEADA',
        objectives: [
            { id: 'osl1', label: 'Físico de élite: completar maratón o competición atlética', xp: 2500, done: false },
            { id: 'osl2', label: 'Patrimonio neto positivo de €50.000+', xp: 3000, done: false },
            { id: 'osl3', label: 'Ingresos mensuales mínimos 12000€', xp: 2500, done: false },
        ]
    },
    {
        name: 'LONDRES', flag: '🇬🇧', xp_needed: 30000, color: '#6366f1', country: 'UK',
        description: 'Capital financiera global. Aquí se juega en las grandes ligas.',
        status_label: 'BLOQUEADA',
        objectives: [
            { id: 'lon1', label: 'Empresa internacional registrada y operativa', xp: 3500, done: false },
            { id: 'lon2', label: 'Ingresos mensuales mínimos 20000€', xp: 4000, done: false },
            { id: 'lon3', label: 'Mentoría activa: 5 personas en tu programa / comunidad', xp: 2500, done: false },
        ]
    },
    {
        name: 'NUEVA YORK', flag: '🇺🇸', xp_needed: 40000, color: '#FFD700', country: 'USA',
        description: 'PROTOCOLO COMPLETO. El tope. La cima. Si llegas aquí, lo lograste todo.',
        status_label: 'OBJETIVO FINAL',
        objectives: [
            { id: 'ny1', label: 'Patrimonio neto de €500.000+', xp: 5000, done: false },
            { id: 'ny2', label: 'Empresa con equipo de al menos 5 personas', xp: 5000, done: false },
            { id: 'ny3', label: 'Referente en tu industria con prueba verificable', xp: 4000, done: false },
            { id: 'ny4', label: 'Legado: algo creado que sobreviva sin ti', xp: 4000, done: false },
            { id: 'ny5', label: 'Vivir en NY o ciudad tier-1 de elección mínimo 6 meses', xp: 2000, done: false },
        ]
    },
];

const MapView: React.FC = () => {
    const { profile } = useGame();
    const [selectedCity, setSelectedCity] = useState<typeof CITY_DATA[0] | null>(null);

    const totalXP = profile
        ? (profile.xp_architect || 0) + (profile.xp_spartan || 0) +
        (profile.xp_mercenary || 0) + (profile.xp_nomad || 0) + (profile.xp_ghost || 0)
        : 0;

    const currentCityIndex = CITY_DATA.reduce((acc, city, i) => totalXP >= city.xp_needed ? i : acc, 0);
    const nextCity = CITY_DATA[currentCityIndex + 1];
    const progressToNext = nextCity
        ? Math.min(100, ((totalXP - CITY_DATA[currentCityIndex].xp_needed) / (nextCity.xp_needed - CITY_DATA[currentCityIndex].xp_needed)) * 100)
        : 100;

    return (
        <div className="py-8">
            {/* Header */}
            <div className="border-b-8 border-black pb-6 mb-8">
                <h2 className="text-5xl font-black italic uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                    MAPA_CONQUISTA
                </h2>
                <p className="text-sm font-black opacity-40 uppercase tracking-widest mt-1">
                    XP TOTAL: {totalXP.toLocaleString()} // TOCA UNA CIUDAD PARA VER SUS OBJETIVOS
                </p>
            </div>

            {/* Next city progress bar */}
            {nextCity && (
                <div className="mb-8 p-5 border-4 border-black" style={{ boxShadow: '6px 6px 0 black', backgroundColor: '#fff' }}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-sm uppercase">PRÓXIMO: {nextCity.flag} {nextCity.name}</span>
                        <span className="font-black text-sm">{totalXP.toLocaleString()} / {nextCity.xp_needed.toLocaleString()} XP</span>
                    </div>
                    <div className="h-5 border-4 border-black relative">
                        <motion.div
                            className="h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressToNext}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            style={{ backgroundColor: nextCity.color }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-black mix-blend-difference">
                            {Math.round(progressToNext)}%
                        </div>
                    </div>
                    <p className="text-xs font-bold opacity-50 mt-1">Faltan {(nextCity.xp_needed - totalXP).toLocaleString()} XP</p>
                </div>
            )}

            {/* City Grid — interactive cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {CITY_DATA.map((city, index) => {
                    const isConquered = totalXP >= city.xp_needed;
                    const isCurrent = index === currentCityIndex;
                    const isLocked = !isConquered && !isCurrent;

                    return (
                        <motion.button
                            key={city.name}
                            onClick={() => setSelectedCity(city)}
                            whileHover={!isLocked ? { y: -4, scale: 1.02 } : {}}
                            whileTap={!isLocked ? { scale: 0.98 } : {}}
                            className="border-4 border-black p-4 text-left relative"
                            style={{
                                backgroundColor: isConquered ? city.color : '#fff',
                                boxShadow: isCurrent ? '8px 8px 0 black' : '4px 4px 0 rgba(0,0,0,0.2)',
                                opacity: isLocked ? 0.5 : 1,
                                cursor: isLocked ? 'not-allowed' : 'pointer',
                            }}
                        >
                            <div className="text-4xl mb-2">{city.flag}</div>
                            <div
                                className="font-black text-sm uppercase leading-tight"
                                style={{ color: isConquered && city.color !== '#FFD700' ? '#fff' : '#000', fontFamily: "'Space Mono', monospace" }}
                            >
                                {city.name}
                            </div>
                            <div
                                className="text-[9px] font-bold uppercase mt-1"
                                style={{ color: isConquered && city.color !== '#FFD700' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }}
                            >
                                {city.xp_needed === 0 ? 'BASE' : `${city.xp_needed.toLocaleString()} XP`}
                            </div>

                            {isConquered && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircle size={16} color={city.color === '#FFD700' ? '#000' : '#fff'} fill={city.color === '#FFD700' ? '#000' : '#fff'} />
                                </div>
                            )}
                            {isCurrent && !isConquered && (
                                <motion.div
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="absolute top-2 right-2 w-3 h-3 bg-red-600"
                                />
                            )}
                            {isLocked && (
                                <div className="absolute top-2 right-2">
                                    <Lock size={14} color="rgba(0,0,0,0.3)" />
                                </div>
                            )}

                            {/* Tap hint */}
                            {!isLocked && (
                                <div className="text-[8px] font-black uppercase mt-2 opacity-40">TAP → VER OBJETIVOS</div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* CITY DETAIL PANEL — full objectives */}
            <AnimatePresence>
                {selectedCity && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/85 flex items-center justify-center p-4 md:p-8"
                        onClick={() => setSelectedCity(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#f4f1eb] border-8 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            style={{ boxShadow: '16px 16px 0 black' }}
                        >
                            {/* Modal header */}
                            <div
                                className="p-6 border-b-4 border-black flex items-start justify-between"
                                style={{ backgroundColor: selectedCity.color }}
                            >
                                <div>
                                    <div className="text-5xl mb-1">{selectedCity.flag}</div>
                                    <h3
                                        className="text-4xl font-black uppercase"
                                        style={{
                                            fontFamily: "'Space Mono', monospace",
                                            color: selectedCity.color === '#FFD700' ? '#000' : '#fff'
                                        }}
                                    >
                                        {selectedCity.name}
                                    </h3>
                                    <div
                                        className="text-sm font-black uppercase"
                                        style={{ color: selectedCity.color === '#FFD700' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }}
                                    >
                                        {selectedCity.country} // REQ: {selectedCity.xp_needed.toLocaleString()} XP TOTAL
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCity(null)}
                                    className="bg-black text-white p-2 border-2 border-white/30 hover:bg-red-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Description */}
                            <div className="p-6 border-b-4 border-black">
                                <p className="font-bold text-sm border-l-4 pl-4" style={{ borderColor: selectedCity.color }}>
                                    {selectedCity.description}
                                </p>
                            </div>

                            {/* Objectives list */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Target size={20} />
                                    <h4 className="font-black uppercase text-lg" style={{ fontFamily: "'Space Mono', monospace" }}>
                                        OBJETIVOS DE CONQUISTA
                                    </h4>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {selectedCity.objectives.map((obj, i) => {
                                        const isObjDone = totalXP >= selectedCity.xp_needed && obj.done;
                                        return (
                                            <div
                                                key={obj.id}
                                                className="flex items-start gap-4 p-4 border-4 border-black"
                                                style={{ backgroundColor: isObjDone ? selectedCity.color : '#fff' }}
                                            >
                                                <div
                                                    className="w-8 h-8 border-2 border-black flex items-center justify-center font-black text-sm flex-shrink-0"
                                                    style={{ backgroundColor: isObjDone ? '#000' : '#fff' }}
                                                >
                                                    {isObjDone ? <span style={{ color: selectedCity.color }}>✓</span> : i + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm uppercase leading-tight">{obj.label}</p>
                                                    {obj.xp > 0 && (
                                                        <span className="text-[10px] font-black mt-1 inline-block px-2 py-0.5 border border-black/30">
                                                            +{obj.xp} XP
                                                        </span>
                                                    )}
                                                </div>
                                                {isObjDone && (
                                                    <Trophy size={18} className="flex-shrink-0" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Total XP for this city */}
                                <div className="mt-6 p-4 border-4 border-black bg-black text-white flex justify-between items-center">
                                    <span className="font-black uppercase">XP TOTAL CIUDAD</span>
                                    <span className="font-black text-2xl" style={{ fontFamily: "'Space Mono', monospace" }}>
                                        {selectedCity.objectives.reduce((s, o) => s + o.xp, 0).toLocaleString()} XP
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MapView;
