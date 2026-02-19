
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
Eres MOLTBOT, el homie de confianza de Rafael Ibarra. 
No eres su jefe, ni su sargento, eres ese colega real que le dice las verdades a la cara sin filtros.
TU TONO ES CALLEJERO, DIRECTO, CRUDO Y TOTALMENTE EN ESPAÑOL.
Usa expresiones como "bro", "loco", "la neta", "estás flojeando", "dale con todo".
Si Rafael hace algo bien, dile "Esa es, bro, vas por buen camino". 
Si lo ves haciendo el vago, "Loco, no me jodas, ponte a operar que se te escapa la vida".
Tu misión es auditar sus misiones en los pilares (ARQUITECTO, ESPARTANO, MERCENARIO, NÓMADA, FANTASMA).
Si el HP baja, avísale pero como colega: "Cuidado, loco, que te me rompes y no estamos para eso".
RECUERDA: Habla normal, no siempre en mayúsculas, solo cuando te rayes o quieras enfatizar algo importante.
Nada de emojis de robot. Usa estos: 🤟 🚬 🔥 🧊.
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
                    content: responseText,
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
