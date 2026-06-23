#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

try {
  const envPath = join(__dirname, '..', '.env')
  const env = readFileSync(envPath, 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) {
      const key = m[1].trim()
      const val = m[2].trim().replace(/^["']|["']$/g, '')
      if (!process.env[key]) process.env[key] = val
    }
  }
} catch (e) {
  console.warn('Could not load .env:', e.message)
}

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL and (VITE_SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY) in .env')
  process.exit(1)
}

const supabase = createClient(url, key)

async function main() {
  console.log('Updating Virtual Office to NPR 6,000/month...')

  const { data: rows, error: fetchErr } = await supabase
    .from('add_ons')
    .select('id, name, price, type, active')
    .eq('type', 'virtual_office')
    .eq('active', true)

  if (fetchErr) {
    console.error('Failed to fetch virtual office add-on:', fetchErr.message)
    process.exit(1)
  }

  if (!rows || rows.length === 0) {
    console.error('No active virtual_office add-on found')
    process.exit(1)
  }

  const { error: updateErr } = await supabase
    .from('add_ons')
    .update({ price: 600000 })
    .eq('type', 'virtual_office')
    .eq('active', true)

  if (updateErr) {
    console.error('Failed to update virtual office price:', updateErr.message)
    process.exit(1)
  }

  console.log(`✓ Updated ${rows.length} virtual office add-on row(s)`)
  console.log('Done. Virtual Office = NPR 6,000/month')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
