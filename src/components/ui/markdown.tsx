"use client"

import React from 'react';

// A simple regex-based markdown parser
const parseMarkdown = (markdown: string) => {
    const elements = [];
    const lines = markdown.split('\n');
    let listItems: React.ReactElement[] = [];

    const closeList = (key: string | number) => {
        if (listItems.length > 0) {
            elements.push(<ul key={`ul-${key}`} className="list-disc pl-5 space-y-2 mb-4">{...listItems}</ul>);
            listItems = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Headers
        if (line.startsWith('## ')) {
            closeList(i);
            elements.push(<h2 key={i} className="text-2xl font-bold mt-6 mb-3 border-b pb-2">{line.substring(3)}</h2>);
            continue;
        }
        if (line.startsWith('### ')) {
            closeList(i);
            elements.push(<h3 key={i} className="text-xl font-semibold mt-4 mb-2">{line.substring(4)}</h3>);
            continue;
        }

        // Bold and Italic
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Unordered lists
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const listContent = line.trim().substring(2);
            listItems.push(<li key={i} dangerouslySetInnerHTML={{ __html: listContent }} />);
            continue;
        }
        
        closeList(i);

        // Paragraphs
        if (line.trim() === '') {
            if(elements.length > 0 && elements[elements.length-1].type !== 'br') {
               elements.push(<br key={i} />);
            }
        } else {
            elements.push(<p key={i} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: line }} />);
        }
    }
    
    closeList('last');

    return elements;
};


interface MarkdownProps {
    content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
    const parsedContent = parseMarkdown(content);
    return <div className="prose prose-blue max-w-none dark:prose-invert">{parsedContent}</div>;
};

export default Markdown;
