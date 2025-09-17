'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'

// Daftarkan semua bahasa yang ingin didukung
const lowlight = createLowlight()
lowlight.register('javascript', javascript)
lowlight.register('css', css)
lowlight.register('html', html)
lowlight.register('python', python)
lowlight.register('java', java)

export default function CodeBlock({ initialContent, onUpdate }: { initialContent: any, onUpdate: (json: any) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
        // Aktifkan deteksi bahasa otomatis
        defaultLanguage: 'plaintext',
      }),
      Placeholder.configure({
        placeholder: '// Tulis atau tempel kode di sini...',
      }),
    ],
    content: initialContent || { type: 'codeBlock' },
    onUpdate: ({ editor }) => { onUpdate(editor.getJSON()) },
    editorProps: {
      attributes: { class: 'prose prose-invert prose-lg focus:outline-none max-w-full' },
    },
  })

  return (
    // Div pembungkus untuk styling seperti kode editor
    <div className="bg-[#1e1e1e] p-4 rounded-md font-mono text-sm">
      <EditorContent editor={editor} />
    </div>
  )
}