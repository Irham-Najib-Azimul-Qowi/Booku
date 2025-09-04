import { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Share2, 
  Download, 
  Plus, 
  Type, 
  Code, 
  Calculator, 
  CheckSquare, 
  Image,
  MoreHorizontal,
  Trash2,
  GripVertical
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Route } from '../../hooks/useRouter';

interface NoteEditorProps {
  noteId?: string;
  onNavigate: (route: Route) => void;
}

type BlockType = 'text' | 'code' | 'math' | 'checklist' | 'image';

interface Block {
  id: string;
  type: BlockType;
  content: string;
  language?: string; // for code blocks
  checked?: boolean; // for checklist items
}

const mathFormulas = [
  { name: 'Integral', symbol: '∫', latex: '\\int' },
  { name: 'Summation', symbol: '∑', latex: '\\sum' },
  { name: 'Alpha', symbol: 'α', latex: '\\alpha' },
  { name: 'Beta', symbol: 'β', latex: '\\beta' },
  { name: 'Pi', symbol: 'π', latex: '\\pi' },
  { name: 'Infinity', symbol: '∞', latex: '\\infty' },
  { name: 'Square Root', symbol: '√', latex: '\\sqrt{}' },
  { name: 'Fraction', symbol: '½', latex: '\\frac{}{}' },
];

export function NoteEditor({ noteId, onNavigate }: NoteEditorProps) {
  const [title, setTitle] = useState(noteId ? 'Konsep Dasar React Hooks' : 'Untitled Note');
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: '1',
      type: 'text',
      content: noteId ? 'React Hooks adalah fitur baru di React 16.8 yang memungkinkan kita menggunakan state dan lifecycle methods di functional components.' : ''
    }
  ]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showMathMenu, setShowMathMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addBlock = (type: BlockType, afterId?: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: '',
      ...(type === 'code' && { language: 'javascript' }),
      ...(type === 'checklist' && { checked: false })
    };

    if (afterId) {
      const index = blocks.findIndex(block => block.id === afterId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setBlocks(newBlocks);
    } else {
      setBlocks([...blocks, newBlock]);
    }
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(block => block.id !== id));
    }
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id);
    if (
      (direction === 'up' && index > 0) || 
      (direction === 'down' && index < blocks.length - 1)
    ) {
      const newBlocks = [...blocks];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  const handleSave = () => {
    // Implementasi save
    console.log('Saving note:', { title, blocks });
  };

  const handleShare = () => {
    // Implementasi share - generate URL
    const shareUrl = `${window.location.origin}/shared/notes/${Date.now()}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link berbagi disalin ke clipboard!');
  };

  const handleExportPDF = () => {
    // Implementasi export PDF
    console.log('Exporting to PDF...');
  };

  const insertMathSymbol = (latex: string) => {
    if (activeBlockId) {
      const block = blocks.find(b => b.id === activeBlockId);
      if (block) {
        updateBlock(activeBlockId, { 
          content: block.content + latex 
        });
      }
    }
    setShowMathMenu(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulasi upload image
      const imageUrl = URL.createObjectURL(file);
      addBlock('image');
      // Update the last block with image URL
      setTimeout(() => {
        const lastBlock = blocks[blocks.length - 1];
        updateBlock(lastBlock.id, { content: imageUrl });
      }, 100);
    }
  };

  const renderBlock = (block: Block, index: number) => {
    const isActive = activeBlockId === block.id;

    return (
      <div 
        key={block.id} 
        className={`group relative border-l-4 pl-4 py-2 ${
          isActive ? 'border-l-[#7E47B8]' : 'border-l-transparent'
        }`}
        onClick={() => setActiveBlockId(block.id)}
      >
        {/* Block Controls */}
        <div className="absolute left-0 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -ml-8">
          <button
            className="p-1 hover:bg-[#2A2A3A] rounded text-[#A0A0A0] hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              // Handle drag
            }}
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-[#2A2A3A] rounded text-[#A0A0A0] hover:text-white">
                <Plus className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1E1E2E] border-[#3A3A4A]">
              <DropdownMenuItem onClick={() => addBlock('text', block.id)} className="text-white hover:bg-[#2A2A3A]">
                <Type className="mr-2 h-4 w-4" />
                Teks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock('code', block.id)} className="text-white hover:bg-[#2A2A3A]">
                <Code className="mr-2 h-4 w-4" />
                Kode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock('math', block.id)} className="text-white hover:bg-[#2A2A3A]">
                <Calculator className="mr-2 h-4 w-4" />
                Matematika
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock('checklist', block.id)} className="text-white hover:bg-[#2A2A3A]">
                <CheckSquare className="mr-2 h-4 w-4" />
                Checklist
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="text-white hover:bg-[#2A2A3A]">
                <Image className="mr-2 h-4 w-4" />
                Gambar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Block Content */}
        <div className="min-h-[40px]">
          {block.type === 'text' && (
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Mulai menulis..."
              className="w-full border-none p-0 resize-none focus-visible:ring-0 min-h-[40px] bg-transparent text-white placeholder-[#A0A0A0]"
              rows={1}
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          )}

          {block.type === 'code' && (
            <div className="bg-[#0F0F23] rounded-xl p-4 font-mono border border-[#3A3A4A]">
              <div className="flex items-center justify-between mb-3">
                <select
                  value={block.language || 'javascript'}
                  onChange={(e) => updateBlock(block.id, { language: e.target.value })}
                  className="text-sm bg-[#1E1E2E] text-[#A0A0A0] border border-[#3A3A4A] rounded-lg px-3 py-1"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                  <option value="typescript">TypeScript</option>
                  <option value="sql">SQL</option>
                </select>
              </div>
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="// Tulis kode di sini..."
                className="w-full bg-transparent text-[#9CDCFE] border-none p-0 resize-none focus-visible:ring-0 font-mono leading-relaxed"
                rows={3}
              />
            </div>
          )}

          {block.type === 'math' && (
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-[#A0A0A0]">Formula Matematika:</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowMathMenu(!showMathMenu)}
                  className="border-[#3A3A4A] text-[#A0A0A0] hover:bg-[#2A2A3A] hover:text-white rounded-lg"
                >
                  <Calculator className="w-4 h-4 mr-1" />
                  Simbol
                </Button>
              </div>
              {showMathMenu && (
                <div className="absolute z-10 bg-[#1E1E2E] border border-[#3A3A4A] rounded-xl shadow-lg p-3 grid grid-cols-4 gap-2 mb-2">
                  {mathFormulas.map((formula) => (
                    <button
                      key={formula.name}
                      className="p-2 hover:bg-[#2A2A3A] rounded text-center text-white"
                      onClick={() => insertMathSymbol(formula.latex)}
                      title={formula.name}
                    >
                      {formula.symbol}
                    </button>
                  ))}
                </div>
              )}
              <Input
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Masukkan formula LaTeX..."
                className="font-mono bg-[#2A2A3A] border-[#3A3A4A] text-white placeholder-[#A0A0A0] focus:border-[#7E47B8] rounded-xl"
              />
              {block.content && (
                <div className="mt-2 p-3 bg-[#7E47B8] bg-opacity-10 rounded-xl border border-[#7E47B8] border-opacity-30 text-lg text-white">
                  {block.content}
                </div>
              )}
            </div>
          )}

          {block.type === 'checklist' && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={block.checked || false}
                onChange={(e) => updateBlock(block.id, { checked: e.target.checked })}
                className="w-4 h-4 text-[#7E47B8] bg-[#2A2A3A] border-[#3A3A4A] rounded focus:ring-[#7E47B8]"
              />
              <Input
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Tambahkan item checklist..."
                className={`flex-1 border-none p-0 focus-visible:ring-0 bg-transparent placeholder-[#A0A0A0] ${
                  block.checked ? 'line-through text-[#A0A0A0]' : 'text-white'
                }`}
              />
            </div>
          )}

          {block.type === 'image' && (
            <div className="text-center">
              {block.content ? (
                <img 
                  src={block.content} 
                  alt="Uploaded" 
                  className="max-w-full h-auto rounded-xl mx-auto"
                />
              ) : (
                <div className="border-2 border-dashed border-[#3A3A4A] rounded-xl p-8">
                  <Image className="w-12 h-12 text-[#A0A0A0] mx-auto mb-2" />
                  <p className="text-[#A0A0A0]">Upload gambar</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Block Actions */}
        {isActive && blocks.length > 1 && (
          <div className="absolute right-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                deleteBlock(block.id);
              }}
              className="hover:bg-[#2A2A3A] rounded-lg"
            >
              <Trash2 className="w-4 h-4 text-[#E74C3C]" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#121212] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[#3A3A4A] bg-[#1E1E2E]">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate('category')}
            className="text-[#A0A0A0] hover:text-white hover:bg-[#2A2A3A] rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold border-none p-0 focus-visible:ring-0 bg-transparent text-white placeholder-[#A0A0A0]"
            placeholder="Untitled Note"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleSave}
            className="border-[#3A3A4A] text-[#A0A0A0] hover:bg-[#2A2A3A] hover:text-white rounded-xl"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="border-[#3A3A4A] text-[#A0A0A0] hover:bg-[#2A2A3A] hover:text-white rounded-xl"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Bagikan
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            className="border-[#3A3A4A] text-[#A0A0A0] hover:bg-[#2A2A3A] hover:text-white rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-4 border-b border-[#3A3A4A] bg-[#1E1E2E]">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addBlock('text')}
          className="border-[#3A3A4A] text-[#A0A0A0] hover:bg-[#2A2A3A] hover:text-white rounded-xl"
        >
          <Type className="w-4 h-4 mr-2" />
          Teks
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addBlock('code')}
          className="border-[#3A3A4A] text-[#A0A0A0] hover:bg-[#2A2A3A] hover:text-white rounded-xl"
        >
          <Code className="w-4 h-4 mr-2" />
          Kode
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addBlock('math')}
          className="border-[#3A3A4A] text-[#A0A0A0] hover:bg-[#2A2A3A] hover:text-white rounded-xl"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Matematika
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addBlock('checklist')}
          className="border-[#3A3A4A] text-[#A0A0A0] hover:bg-[#2A2A3A] hover:text-white rounded-xl"
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          Checklist
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="border-[#3A3A4A] text-[#A0A0A0] hover:bg-[#2A2A3A] hover:text-white rounded-xl"
        >
          <Image className="w-4 h-4 mr-2" />
          Gambar
        </Button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto bg-[#121212]">
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-4">
            {blocks.map((block, index) => renderBlock(block, index))}
          </div>
          
          {/* Add New Block */}
          <div className="mt-8 pt-4 border-t border-dashed border-[#3A3A4A]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-[#A0A0A0] hover:bg-[#2A2A3A] hover:text-white rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah blok baru
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1E1E2E] border-[#3A3A4A]">
                <DropdownMenuItem onClick={() => addBlock('text')} className="text-white hover:bg-[#2A2A3A]">
                  <Type className="mr-2 h-4 w-4" />
                  Teks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addBlock('code')} className="text-white hover:bg-[#2A2A3A]">
                  <Code className="mr-2 h-4 w-4" />
                  Kode
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addBlock('math')} className="text-white hover:bg-[#2A2A3A]">
                  <Calculator className="mr-2 h-4 w-4" />
                  Matematika
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addBlock('checklist')} className="text-white hover:bg-[#2A2A3A]">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Checklist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="text-white hover:bg-[#2A2A3A]">
                  <Image className="mr-2 h-4 w-4" />
                  Gambar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}