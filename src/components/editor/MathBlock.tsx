'use client'
import { useState, useEffect } from 'react'
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

// Komponen kecil untuk satu tombol simbol
const SymbolButton = ({ symbol, latex, onAdd }: { symbol: string, latex: string, onAdd: (latex: string) => void }) => (
  <button
    onClick={() => onAdd(latex)}
    className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-md text-sm"
    title={`Masukkan ${latex}`}
  >
    {symbol}
  </button>
);

export default function MathBlock({ initialContent, onUpdate }: { initialContent: any, onUpdate: (content: any) => void }) {
  const [latex, setLatex] = useState(initialContent || '');
  
  // Daftar simbol yang jauh lebih lengkap, dikelompokkan
  const symbolGroups = {
    'Operasi Dasar': [
      { symbol: '+', latex: '+' }, { symbol: '-', latex: '-' }, { symbol: '×', latex: '\\times ' },
      { symbol: '÷', latex: '\\div ' }, { symbol: '±', latex: '\\pm ' }, { symbol: '√x', latex: '\\sqrt{}' },
      { symbol: 'x/y', latex: '\\frac{}{}' }, { symbol: 'x^y', latex: '^{}' },
    ],
    'Perbandingan': [
      { symbol: '=', latex: '=' }, { symbol: '≠', latex: '\\neq ' }, { symbol: '<', latex: '<' },
      { symbol: '>', latex: '>' }, { symbol: '≤', latex: '\\leq ' }, { symbol: '≥', latex: '\\geq ' },
      { symbol: '≈', latex: '\\approx ' },
    ],
    'Huruf Yunani': [
      { symbol: 'α', latex: '\\alpha ' }, { symbol: 'β', latex: '\\beta ' }, { symbol: 'γ', latex: '\\gamma ' },
      { symbol: 'δ', latex: '\\delta ' }, { symbol: 'ε', latex: '\\epsilon ' }, { symbol: 'θ', latex: '\\theta ' },
      { symbol: 'π', latex: '\\pi ' }, { symbol: 'ω', latex: '\\omega ' },
    ],
    'Kalkulus & Himpunan': [
      { symbol: '∫', latex: '\\int ' }, { symbol: '∑', latex: '\\sum ' }, { symbol: '∂', latex: '\\partial ' },
      { symbol: '∞', latex: '\\infty ' }, { symbol: '∈', latex: '\\in ' }, { symbol: '∉', latex: '\\notin ' },
      { symbol: '⊂', latex: '\\subset ' }, { symbol: '∪', latex: '\\cup ' }, { symbol: '∩', latex: '\\cap ' },
    ]
  };

  useEffect(() => {
    setLatex(initialContent || '');
  }, [initialContent]);

  const addSymbol = (symbolLatex: string) => {
    const newLatex = latex + symbolLatex;
    setLatex(newLatex);
    onUpdate(newLatex);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatex(e.target.value);
    onUpdate(e.target.value);
  }

  return (
    <div className="space-y-4">
      <input 
        type="text"
        value={latex}
        onChange={handleChange}
        placeholder="Masukkan formula LaTeX..."
        className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      
      {/* Menampilkan tombol simbol dalam beberapa baris berdasarkan grup */}
      <div className="space-y-3">
        {Object.entries(symbolGroups).map(([groupName, symbols]) => (
          <div key={groupName} className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 mr-2 w-24 flex-shrink-0">{groupName}:</span>
            {symbols.map(s => (
              <SymbolButton key={s.symbol} symbol={s.symbol} latex={s.latex} onAdd={addSymbol} />
            ))}
          </div>
        ))}
      </div>

      {/* Tampilkan pratinjau hanya jika ada input */}
      {latex.trim() && (
        <div className="p-4 flex justify-center items-center bg-slate-900 mt-2 rounded-md min-h-[60px] overflow-x-auto">
          {/* Tambahkan penanganan error sederhana untuk KaTeX */}
          <BlockMath math={latex} errorColor={'#ef4444'} />
        </div>
      )}
    </div>
  );
}