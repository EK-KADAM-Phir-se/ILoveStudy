const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

async function fixPermissions() {
  console.log('🔌 Connecting to PostgreSQL database...');
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log('🛠️ Ensuring public.feedback table exists with correct permissions...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.feedback (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NULL,
        name TEXT NULL,
        email TEXT NULL,
        category TEXT NOT NULL,
        message TEXT NOT NULL,
        rating INT NULL,
        page_url TEXT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log('🔑 Granting INSERT permissions on public.feedback to anon and authenticated roles...');
    await client.query(`
      GRANT ALL ON public.feedback TO anon, authenticated, service_role, postgres;
    `);

    console.log('🔒 Enabling RLS on public.feedback...');
    await client.query(`
      ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
    `);

    console.log('🛡️ Creating RLS INSERT policy on public.feedback...');
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'feedback' AND policyname = 'Allow public insert feedback'
        ) THEN
          CREATE POLICY "Allow public insert feedback" ON public.feedback
          FOR INSERT TO anon, authenticated
          WITH CHECK (true);
        END IF;
      END $$;
    `);

    console.log('✅ Successfully granted permissions and configured RLS on public.feedback!');
  } catch (err) {
    console.error('❌ Error configuring feedback permissions:', err);
  } finally {
    await client.end();
  }
}

fixPermissions();
