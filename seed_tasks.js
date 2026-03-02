#!/usr/bin/env node
// seed_tasks.js — Limpiar y resembrar tareas CORRECTAS con su pilar real
const https = require('https');

const PROJECT_ID = 'yrdkrjmpkpniznwvrzum';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZGtyam1wa3BuaXpud3ZyenVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg5NTUyNSwiZXhwIjoyMDg2NDcxNTI1fQ.tEEQ_Qdjx9EAM52EI1sYNh_-hh26YE7JAdTlrYWtzE0';
const BASE_URL = `https://${PROJECT_ID}.supabase.co`;
const USER_ID = '3a95d701-18d8-4104-aea2-f9a068c7f413';

function req(method, path, body) {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE_URL + path);
        const opts = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            method,
            headers: {
                'Authorization': `Bearer ${SERVICE_KEY}`,
                'apikey': SERVICE_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
            }
        };
        const r = https.request(opts, res => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve(data); } });
        });
        r.on('error', reject);
        if (body) r.write(JSON.stringify(body));
        r.end();
    });
}

// CANONICAL TASK SEED — balanced across all 5 pillars
const TASKS = [
    // ARCHITECT (BUILD — sistemas, software, procesos)
    { title: 'Optimizar workflows de Moltbot en n8n', description: 'Revisar y mejorar los 3 flujos principales de automatización', pilar: 'architect', power: 'architect', xp_reward: 150, difficulty: 'medio' },
    { title: 'Auditoría de código VergaMano OS', description: 'Revisar arquitectura, limpiar deuda técnica y documentar', pilar: 'architect', power: 'architect', xp_reward: 120, difficulty: 'medio' },
    { title: 'Documentar un sistema o proceso propio', description: 'Crear un SOP (Standard Operating Procedure) para un área de tu vida', pilar: 'architect', power: 'architect', xp_reward: 100, difficulty: 'fácil' },
    { title: 'Aprender una feature nueva de Supabase', description: 'Edge Functions, RLS policies, o Realtime subscriptions', pilar: 'architect', power: 'architect', xp_reward: 130, difficulty: 'medio' },
    { title: 'Construir un mini-proyecto en 2 horas', description: 'Idea → MVP funcional en una sesión. Sin excusas.', pilar: 'architect', power: 'architect', xp_reward: 200, difficulty: 'difícil' },

    // SPARTAN (BODY — físico, salud, disciplina)
    { title: 'Protocolo de hidratación: 2L de agua hoy', description: 'Beber 2L mínimo. Trackear con marcas en la botella.', pilar: 'spartan', power: 'spartan', xp_reward: 60, difficulty: 'fácil' },
    { title: 'Sesión de calistenia 30min', description: 'Pull-ups, dips, push-ups, core. Sin excusas.', pilar: 'spartan', power: 'spartan', xp_reward: 120, difficulty: 'medio' },
    { title: 'No junk food en todo el día', description: '24 horas sin procesados, azúcar añadida ni ultraprocesados', pilar: 'spartan', power: 'spartan', xp_reward: 80, difficulty: 'medio' },
    { title: 'Dormir 7-8 horas y registrar calidad del sueño', description: 'Cama antes de las 23:30. Registro en notas al despertar.', pilar: 'spartan', power: 'spartan', xp_reward: 80, difficulty: 'fácil' },
    { title: 'Ducha fría completa (mínimo 2 min)', description: 'Agua fría al final de la ducha. Aguantar sin salir.', pilar: 'spartan', power: 'spartan', xp_reward: 70, difficulty: 'fácil' },

    // MERCENARY (MONEY — ingresos, clientes, finanzas)
    { title: 'Prospección: contactar 3 clientes potenciales', description: 'LinkedIn, email directo o WhatsApp. Mensaje personalizado, no spam.', pilar: 'mercenary', power: 'mercenary', xp_reward: 150, difficulty: 'medio' },
    { title: 'Crear o actualizar propuesta de servicio', description: 'Pitch deck, presupuesto o propuesta comercial lista para enviar', pilar: 'mercenary', power: 'mercenary', xp_reward: 130, difficulty: 'medio' },
    { title: 'Revisar y optimizar gastos del mes', description: 'Categorizar todos los gastos y eliminar al menos uno innecesario', pilar: 'mercenary', power: 'mercenary', xp_reward: 100, difficulty: 'fácil' },
    { title: 'Aprender sobre fiscalidad / ahorro fiscal', description: '30 minutos de estudio sobre impuestos, deducciones o inversión', pilar: 'mercenary', power: 'mercenary', xp_reward: 110, difficulty: 'fácil' },
    { title: 'Facturar o registrar ingreso del día', description: 'Si entraron ingresos hoy, registrarlos y categorizarlos', pilar: 'mercenary', power: 'mercenary', xp_reward: 80, difficulty: 'fácil' },

    // NOMAD (MOVE — idiomas, movilidad, conexiones)
    { title: 'Sesión de inglés de negocios (30min)', description: 'Duolingo, podcast en inglés, o llamada/video en inglés', pilar: 'nomad', power: 'nomad', xp_reward: 100, difficulty: 'fácil' },
    { title: 'Conectar con alguien nuevo de Europa', description: 'LinkedIn, evento virtual, o comunidad online. +1 contacto real.', pilar: 'nomad', power: 'nomad', xp_reward: 120, difficulty: 'medio' },
    { title: 'Investigar requisitos de visado/residencia', description: 'Próximo destino objetivo: qué necesito, cuánto cuesta, plazos', pilar: 'nomad', power: 'nomad', xp_reward: 100, difficulty: 'fácil' },
    { title: 'Planificar viaje o salida estratégica', description: 'Definir fechas, presupuesto y objetivo de un viaje próximo', pilar: 'nomad', power: 'nomad', xp_reward: 130, difficulty: 'medio' },

    // GHOST (MIND — mentalidad, espiritualidad, estrategia)
    { title: 'Meditación o journaling 15 minutos', description: 'Silencio total, 15 minutos. Sin teléfono. Escribir 1 insight.', pilar: 'ghost', power: 'ghost', xp_reward: 90, difficulty: 'fácil' },
    { title: 'Leer 20 páginas de un libro de tu stack', description: 'Desarrollo personal, negocios, filosofía, o sistema de tu pilar más débil', pilar: 'ghost', power: 'ghost', xp_reward: 100, difficulty: 'fácil' },
    { title: 'Definir los 3 objetivos críticos de la semana', description: 'Los 3 que mueven la aguja. No tareas, OBJETIVOS. Con métricas.', pilar: 'ghost', power: 'ghost', xp_reward: 110, difficulty: 'fácil' },
    { title: 'Análisis post-mortem de un error reciente', description: 'Qué falló, por qué, qué cambia. 1 página máximo.', pilar: 'ghost', power: 'ghost', xp_reward: 130, difficulty: 'medio' },
];

async function seed() {
    console.log('1. Eliminando todas las tareas existentes...');
    const del = await req('DELETE', `/rest/v1/tasks?user_id=eq.${USER_ID}`, null);
    console.log('   Borrado:', typeof del === 'string' ? del.slice(0, 100) : JSON.stringify(del).slice(0, 100));

    console.log('2. Insertando', TASKS.length, 'tareas canónicas...');
    const tasksWithUser = TASKS.map(t => ({
        ...t,
        user_id: USER_ID,
        status: 'pending',
        created_at: new Date().toISOString(),
    }));

    const insert = await req('POST', '/rest/v1/tasks', tasksWithUser);
    if (Array.isArray(insert)) {
        console.log('   ✅ Insertadas:', insert.length, 'tareas');
    } else {
        console.log('   Result:', JSON.stringify(insert).slice(0, 200));
    }

    console.log('3. Verificando...');
    const verify = await req('GET', `/rest/v1/tasks?user_id=eq.${USER_ID}&select=title,pilar,xp_reward`);
    const byPillar = {};
    verify.forEach(t => { byPillar[t.pilar] = (byPillar[t.pilar] || 0) + 1; });
    console.log('   Por pilar:', JSON.stringify(byPillar));
    console.log('   Total:', verify.length, 'tareas activas');
}

seed().catch(console.error);
