'use client'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import Placeholder from '@tiptap/extension-placeholder' // Import Placeholder
import { Bold, Italic, Strikethrough } from 'lucide-react'

export default function TextBlock({ initialContent, onUpdate }: { initialContent: any, onUpdate: (json: any) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BubbleMenuExtension,
      Placeholder.configure({ // Konfigurasi Placeholder
        placeholder: 'Mulai menulis...',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => { onUpdate(editor.getJSON()) },
    editorProps: {
      attributes: { class: 'prose prose-invert prose-lg focus:outline-none max-w-full' },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <>
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex bg-slate-700 shadow-md rounded-md p-1 gap-1">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-slate-500 p-1 rounded' : 'p-1'}>
            <Bold size={16} />
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-slate-500 p-1 rounded' : 'p-1'}>
            <Italic size={16} />
          </button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-slate-500 p-1 rounded' : 'p-1'}>
            <Strikethrough size={16} />
          </button>
        </div>
      </BubbleMenu>
      <EditorContent editor={editor} />
    </>
  )
}