#!/usr/bin/env node
/**
 * Update Explorer (hot desk daily) to NPR 500/day in Supabase.
 * Requires: VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY in .env
 *
 * Run: node scripts/update-explorer-pricing.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env manually
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
  console.log('Updating Explorer daily pricing to NPR 500...')

  // 1. Update plans table
  const { data: plan, error: planErr } = await supabase
    .from('plans')
    .select('id, pricing')
    .eq('name', 'Explorer')
    .single()

  if (planErr || !plan) {
    console.error('Explorer plan not found:', planErr?.message)
    process.exit(1)
  }

  const planPricing = (plan.pricing || {})
  planPricing.daily = 50000

  const { error: updatePlanErr } = await supabase
    .from('plans')
    .update({ pricing: planPricing })
    .eq('id', plan.id)

  if (updatePlanErr) {
    console.error('Failed to update plan:', updatePlanErr.message)
    process.exit(1)
  }
  console.log('✓ Updated plans table')

  // 2. Update location_plan_pricing
  const { data: rows, error: fetchErr } = await supabase
    .from('location_plan_pricing')
    .select('id, location_id, plan_id, pricing')
    .eq('plan_id', plan.id)

  if (fetchErr) {
    console.error('Failed to fetch location pricing:', fetchErr.message)
    process.exit(1)
  }

  let updated = 0
  for (const row of rows || []) {
    const pricing = { ...(row.pricing || {}), daily: 50000 }
    const { error } = await supabase
      .from('location_plan_pricing')
      .update({ pricing })
      .eq('id', row.id)
    if (!error) updated++
  }
  console.log(`✓ Updated ${updated} location_plan_pricing row(s)`)
  console.log('Done. Explorer daily = NPR 500')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
