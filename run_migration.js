const { Client } = require('pg');
require('dotenv').config();

// Supabase direct DB connection
// Format: postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
// We derive it from SUPABASE_URL
const ref = process.env.SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

const client = new Client({
    connectionString: `postgresql://postgres.${ref}:${process.env.DB_PASSWORD || ''}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`,
    ssl: { rejectUnauthorized: false }
});

const migrations = [
    `ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS xp_architect INTEGER DEFAULT 0`,
    `ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS xp_spartan INTEGER DEFAULT 0`,
    `ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS xp_mercenary INTEGER DEFAULT 0`,
    `ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS xp_ghost INTEGER DEFAULT 0`,
    `ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_pilar_check`,
    `ALTER TABLE public.tasks ADD CONSTRAINT tasks_pilar_check CHECK (pilar IN ('architect','spartan','mercenary','nomad','ghost','work','body'))`,
    `ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS steps TEXT[] DEFAULT ARRAY[]::TEXT[]`,
    `ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS timer_minutes INTEGER DEFAULT 25`,
];

(async () => {
    await client.connect();
    console.log('Conectado a Supabase DB');
    for (const sql of migrations) {
        try {
            await client.query(sql);
            console.log('✅', sql.substring(0, 70));
        } catch (e) {
            console.log('⚠️  (ya existe o error):', sql.substring(0, 60), '->', e.message.substring(0, 60));
        }
    }
    await client.end();
    console.log('\n🎯 MIGRACIÓN COMPLETADA');
})();
