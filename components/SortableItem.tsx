'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export default function SortableItem({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-stretch gap-2 ${
        isDragging ? 'shadow-xl rounded-xl ring-2 ring-brand-gold' : ''
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center pl-2 pr-1 cursor-grab active:cursor-grabbing text-gray-300 hover:text-brand-gold transition-colors"
      >
        <GripVertical size={16} />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
