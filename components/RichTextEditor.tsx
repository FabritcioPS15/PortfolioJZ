'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Heading2,
  Heading3,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react'
import { useCallback } from 'react'

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: { HTMLAttributes: { class: 'my-3' } },
      }),
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-gold underline underline-offset-2',
        },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none max-w-none min-h-[150px] px-3 py-2 text-brand-navy',
      },
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL del enlace:', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return

    const url = window.prompt('URL de la imagen:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const setHighlight = useCallback(() => {
    if (!editor) return
    if (editor.isActive('highlight')) {
      editor.chain().focus().unsetHighlight().run()
    } else {
      const color = window.prompt('Color del resaltado (hex, ej: #fde68a):', '#B08D2E')
      if (color) {
        editor.chain().focus().setHighlight({ color }).run()
      }
    }
  }, [editor])

  if (!editor) {
    return null
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run()
  const toggleItalic = () => editor.chain().focus().toggleItalic().run()
  const toggleStrike = () => editor.chain().focus().toggleStrike().run()
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run()
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run()
  const toggleTaskList = () => editor.chain().focus().toggleTaskList().run()
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run()
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run()
  const toggleH2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run()
  const toggleH3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run()
  const setAlignLeft = () => editor.chain().focus().setTextAlign('left').run()
  const setAlignCenter = () => editor.chain().focus().setTextAlign('center').run()
  const setAlignRight = () => editor.chain().focus().setTextAlign('right').run()

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    title?: string
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors ${
        isActive ? 'bg-gray-200 text-brand-navy' : 'text-gray-500'
      } disabled:opacity-50`}
    >
      {children}
    </button>
  )

  const Divider = () => <div className="w-px h-4 bg-gray-300 mx-1" />

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 p-1 bg-gray-50 border-b border-gray-200">
        <ToolbarButton onClick={toggleBold} isActive={editor.isActive('bold')} title="Negrita (Ctrl+B)">
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleItalic} isActive={editor.isActive('italic')} title="Cursiva (Ctrl+I)">
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleUnderline} isActive={editor.isActive('underline')} title="Subrayado (Ctrl+U)">
          <UnderlineIcon size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleStrike} isActive={editor.isActive('strike')} title="Tachado">
          <Strikethrough size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={toggleH2} isActive={editor.isActive('heading', { level: 2 })} title="Título 2">
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleH3} isActive={editor.isActive('heading', { level: 3 })} title="Título 3">
          <Heading3 size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={toggleBulletList} isActive={editor.isActive('bulletList')} title="Lista con viñetas">
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleOrderedList} isActive={editor.isActive('orderedList')} title="Lista numerada">
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleTaskList} isActive={editor.isActive('taskList')} title="Lista de tareas">
          <ListTodo size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleBlockquote} isActive={editor.isActive('blockquote')} title="Cita">
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={toggleCodeBlock} isActive={editor.isActive('codeBlock')} title="Bloque de código">
          <Code2 size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={setAlignLeft} isActive={editor.isActive({ textAlign: 'left' })} title="Alinear a la izquierda">
          <AlignLeft size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={setAlignCenter} isActive={editor.isActive({ textAlign: 'center' })} title="Centrar">
          <AlignCenter size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={setAlignRight} isActive={editor.isActive({ textAlign: 'right' })} title="Alinear a la derecha">
          <AlignRight size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={setHighlight} isActive={editor.isActive('highlight')} title="Resaltar">
          <Highlighter size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Insertar enlace">
          <LinkIcon size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Insertar imagen">
          <ImageIcon size={15} />
        </ToolbarButton>

        <div className="flex-1" />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Deshacer">
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Rehacer">
          <Redo size={15} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}