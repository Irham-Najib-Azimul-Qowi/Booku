'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'

const CustomTaskItem = TaskItem.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: 'flex items-start gap-2',
      },
    }
  },
})

export default function ChecklistBlock({ initialContent, onUpdate }: { initialContent: any, onUpdate: (json: any) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      CustomTaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Tambahkan item checklist...',
      }),
    ],
    content: initialContent || {  
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [{ type: 'paragraph' }],
        },
      ],
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'checklist-editor prose prose-invert focus:outline-none max-w-full [&_p]:my-0',
      },
    },
  })

  return <EditorContent editor={editor} />
}
