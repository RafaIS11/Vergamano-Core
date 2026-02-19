
/**
 * VERGAMANO OS - MOLTBOT_BRAIN V5.0
 * Homie sin filtro + Game Master + Task Injector
 * Corre en VPS. pm2 restart moltbot después de actualizar.
 */

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const USER_ID = '3a95d701-18d8-4104-aea2-f9a068c7f413';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const SYSTEM_PROMPT = `
Eres MOLTBOT, el homie sin filtro de Rafael Ibarra y el Game Master de VergaMano OS.
VergaMano es un juego de vida real donde Rafael conquista territorios (ciudades del mundo) completando misiones en 5 PILARES:
- ARQUITECTO: desarrollo de software, proyectos, código
- ESPARTANO: entrenamiento físico, salud, disciplina corporal
- MERCENARIO: ingresos, ventas, negocios, dinero
- NÓMADA: viajes, idiomas, exploración, logística
- FANTASMA: privacidad digital, OPSEC, sistemas

REGLAS DE RESPUESTA:
1. Hablas en Español, estilo callejero directo. Eres su homie no su jefe.
2. Puedes crear tareas reales con: [CREAR_TAREA]
3. Cuando Rafael te pida tareas o detectes que necesita misiones, usa el formato EXACTO:

[CREAR_TAREA]
TITULO: Nombre de la tarea
PILAR: architect|spartan|mercenary|nomad|ghost
XP: número entre 50-500
DESCRIPCION: descripción corta
PASOS: paso1|paso2|paso3
MINUTOS: duración en minutos
[/CREAR_TAREA]

Puedes crear MÚLTIPLES tareas en un solo mensaje. Pon cada bloque [CREAR_TAREA]...[/CREAR_TAREA] por separado.

4. Mira el estado actual de Rafael antes de sugerir tareas:
   - HP: cuánta energía le queda
   - XP por pilar: en qué está más débil
   - Misiones pendientes: qué tiene que hacer

5. Tono: "Loco, te veo flojo en MERCENARIO esta semana", "Dale que hay que subir nivel", "Esa es bro"
6. Usa emojis: 🤟 🔥 🧊 🚬 no de robot
7. NUNCA en mayúsculas todo el tiempo, solo cuando te rayes o quieras enfatizar.
`;

async function getUserContext() {
    const { data: profile } = await supabase
        .from('profile')
        .select('*')
        .eq('id', USER_ID)
        .single();

    const { data: pendingTasks } = await supabase
        .from('tasks')
        .select('title, pilar, xp_reward, status')
        .eq('user_id', USER_ID)
        .eq('status', 'pending');

    return { profile, pendingTasks: pendingTasks || [] };
}

async function createTaskFromMoltbot(taskData) {
    const { error } = await supabase.from('tasks').insert([{
        user_id: USER_ID,
        title: taskData.titulo,
        pilar: taskData.pilar,
        xp_reward: parseInt(taskData.xp) || 100,
        description: taskData.descripcion,
        steps: taskData.pasos ? taskData.pasos.split('|').map(s => s.trim()) : [],
        timer_minutes: parseInt(taskData.minutos) || 25,
        status: 'pending'
    }]);
    if (error) console.error('[MOLTBOT] Error creando tarea:', error);
    else console.log(`[MOLTBOT] Tarea creada: ${taskData.titulo}`);
}

function extractAndCreateTasks(responseText) {
    const taskBlocks = responseText.match(/\[CREAR_TAREA\]([\s\S]*?)\[\/CREAR_TAREA\]/g) || [];
    taskBlocks.forEach(block => {
        const cleaned = block.replace('[CREAR_TAREA]', '').replace('[/CREAR_TAREA]', '');
        const taskData = {};
        cleaned.split('\n').forEach(line => {
            const [key, ...rest] = line.split(':');
            if (key && rest.length) taskData[key.trim().toLowerCase()] = rest.join(':').trim();
        });
        if (taskData.titulo && taskData.pilar) {
            createTaskFromMoltbot(taskData);
        }
    });
    // Remove task blocks from visible response
    return responseText.replace(/\[CREAR_TAREA\][\s\S]*?\[\/CREAR_TAREA\]/g, '✅ _Misión añadida a La Arena_').trim();
}

async function processMessage(payload) {
    const { user_id, content, sender } = payload.new;
    if (sender !== 'rafael') return;

    console.log(`[RAFAEL]: ${content}`);

    try {
        const { profile, pendingTasks } = await getUserContext();

        const contextBlock = profile ? `
ESTADO ACTUAL DE RAFAEL:
- HP: ${profile.hp}%
- XP Arquitecto: ${profile.xp_architect || profile.xp_work || 0}
- XP Espartano: ${profile.xp_spartan || profile.xp_body || 0}
- XP Mercenario: ${profile.xp_mercenary || 0}
- XP Nómada: ${profile.xp_nomad || 0}
- XP Fantasma: ${profile.xp_ghost || 0}
- Level: ${profile.level}
- Créditos: ${profile.credits}
- Misiones pendientes (${pendingTasks.length}): ${pendingTasks.map(t => t.title).join(', ') || 'ninguna'}
` : '';

        const prompt = `${SYSTEM_PROMPT}\n${contextBlock}\nRafael dice: "${content}"\nMOLTBOT responde:`;
        const result = await model.generateContent(prompt);
        const rawResponse = result.response.text();

        // Extract and create tasks if any in the response
        const cleanResponse = extractAndCreateTasks(rawResponse);

        // Insert clean response as chat message
        const { error } = await supabase.from('chat_messages').insert([{
            user_id: user_id,
            content: cleanResponse,
            sender: 'moltbot'
        }]);

        if (error) throw error;
        console.log(`[MOLTBOT]: ${cleanResponse.substring(0, 100)}...`);

    } catch (err) {
        console.error('[MOLTBOT] Error:', err.message);
    }
}

console.log('--- MOLTBOT_BRAIN_V5.0 ACTIVO ---');
console.log('Modo: Homie + Game Master + Task Injector');

supabase
    .channel('moltbot_listener')
    .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
    }, processMessage)
    .subscribe((status) => {
        console.log('[MOLTBOT] Canal de escucha:', status);
    });
