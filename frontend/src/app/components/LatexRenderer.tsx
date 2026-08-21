"use client";

import React from "react";
import katex from "katex";

interface LatexRendererProps {
  text: string;
}

const LatexMathPart: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  // Split by double dollar signs first (display math)
  const parts = text.split(/(\$\$[\s\S]*?\$\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          let formula = part.slice(2, -2);
          formula = formula.replace(/\\text\{([_]+)\}/g, (_, underscores) => `\\text{${'\\_'.repeat(underscores.length)}}`);
          try {
            const html = katex.renderToString(formula, {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <div
                key={index}
                className="my-2 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return <span key={index} className="whitespace-pre-wrap">{part}</span>;
          }
        } else {
          // Split by single dollar signs (inline math)
          const subParts = part.split(/(\$[\s\S]*?\$)/g);
          return (
            <span key={index} className="whitespace-pre-wrap">
              {subParts.map((subPart, subIndex) => {
                if (subPart.startsWith("$") && subPart.endsWith("$")) {
                  let formula = subPart.slice(1, -1);
                  // Sanitize unescaped underscores inside \text{___} to prevent KaTeX red error fallback
                  formula = formula.replace(/\\text\{([_]+)\}/g, (_, underscores) => `\\text{${'\\_'.repeat(underscores.length)}}`);

                  try {
                    const html = katex.renderToString(formula, {
                      displayMode: false,
                      throwOnError: false,
                    });
                    return (
                      <span
                        key={`${index}-${subIndex}`}
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    );
                  } catch (e) {
                    return <span key={`${index}-${subIndex}`}>{subPart}</span>;
                  }
                }
                return (
                  <React.Fragment key={`${index}-${subIndex}`}>
                    {subPart}
                  </React.Fragment>
                );
              })}
            </span>
          );
        }
      })}
    </>
  );
};

export const LatexRenderer: React.FC<LatexRendererProps> = ({ text }) => {
  if (!text) return null;

  // Normalize any escaped string literal "\\n" to actual newlines
  const normalizedText = text.replace(/\\n/g, "\n");

  // Check for Markdown code blocks: ```lang ... ```
  const codeBlockRegex = /(```[\s\S]*?```)/g;
  const blocks = normalizedText.split(codeBlockRegex);

  return (
    <>
      {blocks.map((block, idx) => {
        if (block.startsWith("```") && block.endsWith("```")) {
          const content = block.slice(3, -3);
          const firstLineEnd = content.indexOf("\n");
          let lang = "";
          let code = content;

          if (firstLineEnd !== -1) {
            const possibleLang = content.slice(0, firstLineEnd).trim();
            if (possibleLang && !possibleLang.includes(" ") && possibleLang.length < 15) {
              lang = possibleLang;
              code = content.slice(firstLineEnd + 1);
            }
          }

          return (
            <div
              key={idx}
              className="my-3 rounded-xl overflow-hidden border border-slate-700 bg-[#0d1117] text-slate-100 font-mono text-xs shadow-md"
            >
              {lang && (
                <div className="bg-[#161b22] px-3.5 py-1.5 border-b border-slate-700 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{lang}</span>
                  <span className="text-[10px] text-slate-500 font-sans">Code Snippet</span>
                </div>
              )}
              <pre className="p-4 overflow-x-auto leading-relaxed whitespace-pre font-mono text-xs text-slate-200">
                <code>{code.replace(/^\n+|\n+$/g, '')}</code>
              </pre>
            </div>
          );
        }

        return <LatexMathPart key={idx} text={block} />;
      })}
    </>
  );
};

export default LatexRenderer;
