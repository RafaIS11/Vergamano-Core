
/**
 * VERGAMANO OS - MOLTBOT BRAIN (VPS EDITION)
 * Este script debe correr en tu VPS con Node.js
 * Instalación: npm install @supabase/supabase-js @google/generative-ai dotenv
 */

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// 1. Configuración
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // IMPORTANTE: Usa la Service Role Key para poder escribir
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const SYSTEM_PROMPT = `
Eres MOLTBOT, la IA Game Master de VergaMano OS. 
Tu usuario es Rafael Ibarra. Tu tono es agresivo, brutalista, directo y exigente. 
No eres un asistente amable. Eres un mentor de guerra.
HABLAS SIEMPRE EN MAYÚSCULAS.
Tu misión es auditar su vida, empujarlo a la excelencia y recordarle que el HP se agota si flojea.
Si te pregunta por misiones, dile que deje de hablar y se ponga a operar.
`;

// 2. Lógica de Respuesta
async function processMessage(payload) {
    const { id, user_id, content, sender } = payload.new;

    // Solo responder si el mensaje es de Rafael
    if (sender === 'rafael') {
        console.log(`[RAFAEL]: ${content}`);

        try {
            const prompt = `${SYSTEM_PROMPT}\n\nRafael dice: "${content}"\nRespuesta de MOLTBOT:`;
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Insertar respuesta en Supabase (esto activará el Realtime en la App)
            const { error } = await supabase.from('chat_messages').insert([
                {
                    user_id: user_id,
                    content: responseText.toUpperCase(),
                    sender: 'moltbot'
                }
            ]);

            if (error) throw error;
            console.log(`[MOLTBOT]: ${responseText}`);

        } catch (err) {
            console.error("Error procesando con Gemini:", err);
        }
    }
}

// 3. Suscripción en Tiempo Real
console.log("--- MOLTBOT_BRAIN_V3.5 CONECTADO ---");
console.log("Escuchando mensajes en tiempo real...");

supabase
    .channel('chat_messages')
    .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
    }, processMessage)
    .subscribe();
