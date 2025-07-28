"use client"

import React from 'react';

// A simple regex-based markdown parser
const parseMarkdown = (markdown: string) => {
    const lines = markdown.split('\n');
    const elements = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Headers
        if (line.startsWith('## ')) {
            if (inList) { inList = false; elements.push(</ul>); }
            elements.push(<h2 key={i} className="text-2xl font-bold mt-6 mb-3 border-b pb-2">{line.substring(3)}</h2>);
            continue;
        }
        if (line.startsWith('### ')) {
            if (inList) { inList = false; elements.push(</ul>); }
            elements.push(<h3 key={i} className="text-xl font-semibold mt-4 mb-2">{line.substring(4)}</h3>);
            continue;
        }

        // Bold and Italic
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Unordered lists
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            if (!inList) {
                inList = true;
                elements.push(<ul key={`ul-${i}`} className="list-disc pl-5 space-y-2 mb-4"></ul>);
            }
            const listContent = line.trim().substring(2);
            const lastElement = elements[elements.length - 1];
            if (lastElement && lastElement.type === 'ul') {
                 lastElement.props.children.push(<li key={i} dangerouslySetInnerHTML={{ __html: listContent }} />);
            }
            continue;
        }
        
        if (inList) {
            inList = false;
        }

        // Paragraphs
        if (line.trim() === '') {
            elements.push(<br key={i} />);
        } else {
            elements.push(<p key={i} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: line }} />);
        }
    }
    
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
