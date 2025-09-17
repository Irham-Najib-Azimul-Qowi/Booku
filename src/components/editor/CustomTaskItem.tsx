import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import TaskItem from '@tiptap/extension-task-item'

// 1. Buat ekstensi kustom dengan menimpa TaskItem bawaan
export const CustomTaskItem = TaskItem.extend({
  // 2. Tentukan bagaimana kontennya harus dirender
  content: 'inline*', // Hanya mengizinkan konten inline (teks), bukan paragraf

  // 3. Tambahkan kelas CSS kustom ke wrapper
  addAttributes() {
    return {
      ...this.parent?.(),
      class: 'flex items-start gap-2 my-2', // Menggunakan Flexbox
    }
  },
})

// Komponen React kustom untuk Node View (opsional, tapi bagus untuk kontrol lebih)
export const CustomTaskItemView = ({ node, updateAttributes }: any) => {
  return (
    <NodeViewWrapper as="li" className="flex items-start gap-2 my-2">
      <input
        type="checkbox"
        className="mt-1"
        checked={node.attrs.checked}
        onChange={event => updateAttributes({ checked: event.target.checked })}
      />
      <NodeViewContent className="flex-grow" />
    </NodeViewWrapper>
  )
}