'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// Import Prism.js for syntax highlighting
import Prism from 'prismjs';
// Core languages
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-dart';
// Markup templating is required for PHP
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
  showLineNumbers?: boolean;
}

const languageMap: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  cs: 'csharp',
  rb: 'ruby',
  dart: 'dart',
};

export function CodeBlock({ 
  code, 
  language, 
  className,
  showLineNumbers = false 
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  
  // Normalize language name
  const normalizedLanguage = languageMap[language.toLowerCase()] || language.toLowerCase();
  
  useEffect(() => {
    if (codeRef.current) {
      // Apply proper syntax highlighting colors for white background
      const applySyntaxHighlighting = (element: HTMLElement) => {
        // Set default dark text color
        element.style.color = '#1a1a1a';
        
        // Apply syntax highlighting colors optimized for white background
        const tokens = element.querySelectorAll('.token');
        tokens.forEach((token) => {
          const classList = Array.from(token.classList);
          const tokenElement = token as HTMLElement;
          
          // Ensure transparent background for all tokens
          tokenElement.style.background = 'transparent';
          
          // Comments - Gray/Green
          if (classList.some(cls => ['comment', 'prolog', 'doctype', 'cdata'].includes(cls))) {
            tokenElement.style.color = '#6a737d !important';
            tokenElement.style.fontStyle = 'italic';
          }
          // Keywords - Blue
          else if (classList.some(cls => ['keyword', 'control', 'directive', 'return', 'import', 'from', 'as', 'export', 'default'].includes(cls))) {
            tokenElement.style.color = '#0366d6 !important';
            tokenElement.style.fontWeight = '600';
          }
          // Strings - Red/Orange
          else if (classList.some(cls => ['string', 'char', 'template-string', 'attr-value'].includes(cls))) {
            tokenElement.style.color = '#d73a49 !important';
          }
          // Numbers, booleans - Purple
          else if (classList.some(cls => ['number', 'boolean', 'constant'].includes(cls))) {
            tokenElement.style.color = '#005cc5 !important';
          }
          // Functions, class names - Purple
          else if (classList.some(cls => ['function', 'class-name', 'function-name', 'method'].includes(cls))) {
            tokenElement.style.color = '#6f42c1 !important';
            tokenElement.style.fontWeight = '600';
          }
          // Variables - Dark blue
          else if (classList.some(cls => ['variable', 'parameter'].includes(cls))) {
            tokenElement.style.color = '#24292e !important';
          }
          // Properties, attributes - Teal
          else if (classList.some(cls => ['property', 'attr-name', 'selector'].includes(cls))) {
            tokenElement.style.color = '#005cc5 !important';
          }
          // Tags - Green
          else if (classList.some(cls => ['tag', 'builtin'].includes(cls))) {
            tokenElement.style.color = '#22863a !important';
            tokenElement.style.fontWeight = '600';
          }
          // Operators, punctuation - Dark gray
          else if (classList.some(cls => ['operator', 'punctuation', 'bracket'].includes(cls))) {
            tokenElement.style.color = '#24292e !important';
          }
          // Types - Teal
          else if (classList.some(cls => ['type', 'class', 'interface'].includes(cls))) {
            tokenElement.style.color = '#032f62 !important';
          }
          // Regex, important - Red
          else if (classList.some(cls => ['regex', 'important', 'deleted'].includes(cls))) {
            tokenElement.style.color = '#d73a49 !important';
          }
          // Inserted/added - Green
          else if (classList.some(cls => ['inserted', 'symbol'].includes(cls))) {
            tokenElement.style.color = '#28a745 !important';
          }
          
          // Language-specific enhancements
          if (normalizedLanguage === 'json') {
            if (classList.includes('property')) {
              tokenElement.style.color = '#005cc5 !important';
              tokenElement.style.fontWeight = '400';
            }
            if (classList.includes('string')) {
              tokenElement.style.color = '#d73a49 !important';
            }
            if (classList.includes('number')) {
              tokenElement.style.color = '#005cc5 !important';
            }
            if (classList.includes('boolean') || classList.includes('null')) {
              tokenElement.style.color = '#0366d6 !important';
              tokenElement.style.fontWeight = '600';
            }
          }
          
          // JavaScript/TypeScript specific
          if (['javascript', 'typescript'].includes(normalizedLanguage)) {
            if (classList.includes('template-punctuation')) {
              tokenElement.style.color = '#d73a49 !important';
            }
            if (classList.includes('interpolation')) {
              tokenElement.style.color = '#24292e !important';
            }
          }
          
          // Python specific
          if (normalizedLanguage === 'python') {
            if (classList.includes('decorator')) {
              tokenElement.style.color = '#6f42c1 !important';
            }
            if (classList.includes('triple-quoted-string')) {
              tokenElement.style.color = '#6a737d !important';
              tokenElement.style.fontStyle = 'italic';
            }
          }
          
          // Bash/Shell specific
          if (['bash', 'shell'].includes(normalizedLanguage)) {
            if (classList.includes('shebang')) {
              tokenElement.style.color = '#6a737d !important';
            }
            if (classList.includes('command')) {
              tokenElement.style.color = '#0366d6 !important';
            }
          }
        });
      };

      // Check if the language is supported before highlighting
      if (Prism.languages[normalizedLanguage]) {
        Prism.highlightElement(codeRef.current);
        // Apply syntax highlighting after PrismJS highlighting
        setTimeout(() => {
          if (codeRef.current) {
            applySyntaxHighlighting(codeRef.current);
          }
        }, 10);
      } else {
        // Fallback to plain text if language is not supported
        console.warn(`Language "${normalizedLanguage}" not supported by Prism.js`);
        codeRef.current.style.color = '#1a1a1a';
      }
    }
  }, [code, normalizedLanguage]);

  return (
    <div className={cn('group relative', className)}>
      {/* Header with language badge */}
      <div className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-t-lg px-4 py-2">
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          {language}
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded"
        >
          Copy
        </button>
      </div>
      
      {/* Code container */}
      <div className="relative">
        <pre className={cn(
          'code-block',
          'bg-white border-l border-r border-b border-slate-200 rounded-b-lg',
          'font-mono text-sm leading-6',
          'overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent',
          showLineNumbers ? 'pl-16 pr-4 py-4' : 'p-4'
        )} style={{ color: '#1a1a1a !important' }}>
          <code
            ref={codeRef}
            className={`language-${normalizedLanguage}`}
            style={{ color: '#1a1a1a !important', background: 'transparent' }}
            dangerouslySetInnerHTML={{ __html: code }}
          />
        </pre>
        
        {showLineNumbers && (
          <div className="absolute left-0 top-0 p-4 pr-2 text-slate-400 text-sm font-mono select-none border-r border-slate-200">
            {code.split('\n').map((_, index) => (
              <div key={index} className="leading-6 text-right min-w-[2rem]">
                {index + 1}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 