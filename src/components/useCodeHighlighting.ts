import React from 'react';
import hljs from 'highlight.js/lib/common';
import type { FileContent, SearchOptions } from '../types';
import { buildSearchRegex } from '../services/searchRegex';

interface UseCodeHighlightingParams {
  activeMatchIndexInFile: number | null;
  file: FileContent;
  isEditing: boolean;
  isMarkdownPreview: boolean;
  searchOptions: SearchOptions;
  searchQuery: string;
}

export function useCodeHighlighting({
  activeMatchIndexInFile,
  file,
  isEditing,
  isMarkdownPreview,
  searchOptions,
  searchQuery,
}: UseCodeHighlightingParams) {
  const codeRef = React.useRef<HTMLElement>(null);
  const highlightTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHighlightKey = React.useRef('');

  React.useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (!codeRef.current || isEditing || isMarkdownPreview || file.excluded) return;

    const highlightKey = `${file.path}:${file.content}:${searchQuery}:${searchOptions.caseSensitive}:${searchOptions.useRegex}:${searchOptions.wholeWord}:${activeMatchIndexInFile}`;
    if (highlightKey === lastHighlightKey.current) return;
    lastHighlightKey.current = highlightKey;

    codeRef.current.textContent = file.content;
    hljs.highlightElement(codeRef.current);

    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    if (!searchQuery.trim()) return;

    const regex = buildSearchRegex(searchQuery, searchOptions);
    if (!regex) return;

    highlightTimerRef.current = setTimeout(() => {
      if (!codeRef.current) return;

      const walker = document.createTreeWalker(codeRef.current, NodeFilter.SHOW_TEXT, null);
      const textNodes: Text[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) {
        textNodes.push(node as Text);
      }

      let globalMatchIndex = 0;

      textNodes.forEach((textNode) => {
        const text = textNode.nodeValue;
        if (!text) return;

        const matches = [...text.matchAll(regex)];
        if (matches.length === 0) return;

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        matches.forEach((match) => {
          if (match.index! > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index!)));
          }

          const mark = document.createElement('mark');
          mark.className = 'search-highlight';
          if (globalMatchIndex === activeMatchIndexInFile) {
            mark.classList.add('search-highlight-active');
            setTimeout(() => mark.scrollIntoView({ behavior: 'auto', block: 'center' }), 0);
          }
          mark.textContent = match[0];
          fragment.appendChild(mark);

          globalMatchIndex++;
          lastIndex = match.index! + match[0].length;
        });

        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }

        textNode.parentNode?.replaceChild(fragment, textNode);
      });
    }, 150);
  }, [
    activeMatchIndexInFile,
    file.content,
    file.excluded,
    file.path,
    isEditing,
    isMarkdownPreview,
    searchOptions,
    searchQuery,
  ]);

  return codeRef;
}
