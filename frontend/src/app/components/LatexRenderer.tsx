"use client";

import React from "react";
import katex from "katex";

interface LatexRendererProps {
  text: string;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ text }) => {
  if (!text) return null;

  // Split by double dollar signs first (display math)
  const parts = text.split(/(\$\$[\s\S]*?\$\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const formula = part.slice(2, -2);
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
            return <span key={index}>{part}</span>;
          }
        } else {
          // Split by single dollar signs (inline math)
          const subParts = part.split(/(\$[\s\S]*?\$)/g);
          return (
            <span key={index}>
              {subParts.map((subPart, subIndex) => {
                if (subPart.startsWith("$") && subPart.endsWith("$")) {
                  const formula = subPart.slice(1, -1);
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

export default LatexRenderer;
