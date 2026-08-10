import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { defaultSections, normalizeSection, newId, type Section } from '@/lib/sections'

function toRow(section: Section) {
  return {
    id: section.id,
    title: section.title,
    icon: section.icon,
    type: section.type,
    link: section.link || '/publicaciones',
    order: section.order,
    items: section.items,
  }
}

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ sections: defaultSections })
  }

  const { data, error } = await supabaseAdmin
    .from('sections')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const sections = (data ?? [])
    .map(normalizeSection)
    .filter((s): s is Section => s !== null)

  return NextResponse.json({ sections })
}

// Crea una sección nueva. Si viene sin id, se genera en el servidor.
export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase no está configurado' }, { status: 500 })
  }

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
  if (!body.id) section.id = newId()

  const { data, error } = await supabaseAdmin.from('sections').insert(toRow(section)).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ section: normalizeSection(data) }, { status: 201 })
}
