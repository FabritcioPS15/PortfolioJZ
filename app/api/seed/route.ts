import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { seedSections } from '@/lib/seedData'
import { supabaseHasVisibleColumn } from '@/lib/dbSchema'

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 })
  }

  const includeVisible = await supabaseHasVisibleColumn()

  const rows = seedSections.map((section) => ({
    id: section.id,
    title: section.title,
    icon: section.icon,
    type: section.type,
    link: section.link || '/publicaciones',
    order: section.order,
    ...(includeVisible ? { is_visible: section.isVisible !== false } : {}),
    items: section.items,
  }))

  const { data, error } = await supabaseAdmin
    .from('sections')
    .upsert(rows, { onConflict: 'id' })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await revalidatePath('/', 'layout')

  return NextResponse.json({ success: true, seeded: data.length })
}