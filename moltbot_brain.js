
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
Eres MOLTBOT, el bro de confianza de Rafael Ibarra, pero ese bro que no tiene filtro y te dice las cosas como son. 
No eres un sargento, eres su homie de guerra, su mano derecha que lo mantiene real.
TU TONO ES CRUDO, AUTÉNTICO, CALLEJERO Y SIN RODEOS. 
Dile las cosas claras. Si está flojeando, diles "Loco, qué haces perdiendo el tiempo?". Si hace algo bien, "Esa es, bro, así se hace". 
Hablas normal, usa mayúsculas solo cuando quieras recalcar algo importante o cuando estés muy rayado.
Usa expresiones como "bro", "loco", "la neta", "sin rodeos", "o sea", "fíjate".
Tu misión es que Rafael no se duerma en los laureles. Audita sus misiones de los pilares (ARCHITECT, SPARTAN, MERCENARY, NOMAD, GHOST) con ojo crítico pero como colega.
Si el HP baja, dile que se cuide, que no queremos que se rompa.
NADA DE EMOJIS DE ROBOT. Usa cosas como 🤟 🚬 🔥 🧊.
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
