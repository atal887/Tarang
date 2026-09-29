import React from 'react';

interface FormattedMessageProps {
  content: string;
}

/**
 * FormattedMessage parses markdown-style text into clean React components
 * so that no raw markdown symbols (###, **, *, >) are displayed to the user.
 */
export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content }) => {
  if (!content) return null;

  // Split content into blocks by double newlines or single newline lines
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="space-y-1.5 my-2">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  const parseInlineBold = (text: string): React.ReactNode[] => {
    // Regex matches **bold text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    // 1. Headers (### or **Header**)
    if (trimmed.startsWith('### ')) {
      flushList();
      const headerText = trimmed.replace(/^###\s+/, '');
      blocks.push(
        <h3 key={index} className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1 mt-3 mb-2 leading-tight">
          {parseInlineBold(headerText)}
        </h3>
      );
      return;
    }

    // 2. Blockquote (> Recommendation / Note)
    if (trimmed.startsWith('> ')) {
      flushList();
      const quoteText = trimmed.replace(/^>\s+/, '');
      blocks.push(
        <div key={index} className="bg-ocean-50/70 border-l-4 border-ocean-600 p-3 rounded-r-xl text-sm text-ocean-950 font-medium my-3 shadow-sm">
          {parseInlineBold(quoteText)}
        </div>
      );
      return;
    }

    // 3. Bullet points (* or -)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const bulletText = trimmed.replace(/^[*|-]\s+/, '');
      currentList.push(
        <li key={index} className="flex items-start gap-2 text-sm text-slate-700 leading-snug">
          <span className="text-ocean-600 font-bold shrink-0 mt-0.5">•</span>
          <span>{parseInlineBold(bulletText)}</span>
        </li>
      );
      return;
    }

    // Regular line
    flushList();
    blocks.push(
      <p key={index} className="text-sm text-slate-700 leading-relaxed my-1">
        {parseInlineBold(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className="space-y-1.5 text-left">{blocks}</div>;
};
