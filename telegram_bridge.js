// TELEGRAM BRIDGE V4.0
// GHOST PROTOCOL & AGENTIC LOOP

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import 'dotenv/config'; // Requires a .env file on the VPS

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("CRITICAL ERROR: Missing environment variables for Telegram Bridge.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Send message to Telegram
async function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        });
        const data = await response.json();
        if (!data.ok) {
            console.error("Telegram API Error:", data);
        } else {
            console.log("-> Telegram message sent successfully.");
        }
    } catch (error) {
        console.error("Failed to send to Telegram:", error);
    }
}

// ----------------------------------------------------------------------
// 1. CHAT SYNC (DB -> Telegram)
// Loop Prevention: Only sync messages where source_origin !== 'telegram'
// ----------------------------------------------------------------------
console.log("INITIALIZING VERGAMANO BRIDGE V4.0...");
console.log("Listening for Web App Chat Messages...");

supabase
    .channel('chat-outbound')
    .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages' 
    }, async (payload) => {
        const msg = payload.new;
        
        // Prevent Infinite Loop: Do not forward messages that came FROM Telegram
        if (msg.source_origin === 'telegram') return;
        
        // Only forward messages from the user (Web App) to Telegram
        if (msg.sender === 'rafael') {
            await sendToTelegram(`👽 *Rafa:* ${msg.content}`);
        }
    })
    .subscribe((status) => {
         console.log(`Chat Channel Status: ${status}`);
    });

// ----------------------------------------------------------------------
// 2. GHOST PROTOCOL (HP Monitor)
// Listen for real-time drops in HP. If HP < 30, intervene aggressively.
// ----------------------------------------------------------------------
console.log("Activating Ghost Protocol HP Monitor...");

let lastAlertTime = 0;
const ALERT_COOLDOWN_MS = 1000 * 60 * 30; // Max 1 alert per 30 mins to avoid spam

supabase
    .channel('profile-monitor')
    .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profile'
    }, async (payload) => {
        const newRecord = payload.new;
        const oldRecord = payload.old;
        
        // Only trigger if HP dropped and crossed the critical threshold
        if (newRecord.hp < 30 && oldRecord.hp >= 30) {
            const now = Date.now();
            if (now - lastAlertTime > ALERT_COOLDOWN_MS) {
                 lastAlertTime = now;
                 console.log("⚠️ GHOST PROTOCOL TRIGGERED: Critical HP");
                 await sendToTelegram(`🟥 *SISTEMA CRÍTICO (HP: ${newRecord.hp}%)*\nLa integridad estructural de tu vida operativa está colapsando. El Avatar FLO está en degradación inminente (\`M_BLEND_DIFF\` activado).\n\nMueve el culo. Ejecuta misiones. Deja de leer esto y actúa.`);
            }
        }
    })
    .subscribe((status) => {
        console.log(`Profile Channel Status: ${status}`);
    });

// Keep process running
setInterval(() => {
    // Heartbeat to prevent PM2/Docker from thinking it's dead
}, 60000);
