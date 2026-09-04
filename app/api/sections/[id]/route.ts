import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isAuthenticated } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { supabaseHasVisibleColumn } from '@/lib/dbSchema'
import { normalizeSection, type Section } from '@/lib/sections'

async function toRow(section: Section) {
  const includeVisible = await supabaseHasVisibleColumn()
  return {
    id: section.id,
    title: section.title,
    icon: section.icon,
    type: section.type,
    link: section.link || '/publicaciones',
    order: section.order,
    ...(includeVisible ? { isVisible: section.isVisible } : {}),
    items: section.items,
  }
}

type Params = { params: Promise<{ id: string }> }

// Upsert: crea o actualiza la sección con ese id (el editor siempre envía el id).
export async function PUT(request: Request, { params }: Params) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase no está configurado' }, { status: 500 })
  }

  const { id } = await params

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  const section = normalizeSection(body)
  if (!section || !section.title) {
    return NextResponse.json({ error: 'La sección debe tener un título' }, { status: 400 })
  }
  section.id = id

  const { data, error } = await supabaseAdmin
    .from('sections')
    .upsert(await toRow(section), { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await revalidatePath('/', 'layout')

  return NextResponse.json({ section: normalizeSection(data) })
}

export async function DELETE(request: Request, { params }: Params) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase no está configurado' }, { status: 500 })
  }

  const { id } = await params

  const { error } = await supabaseAdmin.from('sections').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await revalidatePath('/', 'layout')

  return NextResponse.json({ ok: true })
}
