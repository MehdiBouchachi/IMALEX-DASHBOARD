// src/features/articles/editor/Inline.jsx
import React from "react";

/**
 * Tiny inline Markdown parser to match the customer app behavior:
 *  - **bold** or __bold__
 *  - *italic* or _italic_
 *  - `code`
 *  - [label](https://...) and [/relative]
 *
 * No external deps. Returns a React fragment of inline nodes.
 */
export default function Inline({ text = "" }) {
  return <>{parseInline(String(text))}</>;
}

function parseInline(src) {
  const out = [];
  let i = 0;

  // Order matters; this mirrors the customer regex
  const re =
    /\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|_(.+?)_|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g;

  let m;
  while ((m = re.exec(src))) {
    // push the literal text before the match
    if (m.index > i) out.push(src.slice(i, m.index));

    if (m[1] || m[2]) {
      // **bold** or __bold__
      out.push(<strong key={out.length}>{m[1] || m[2]}</strong>);
    } else if (m[3] || m[4]) {
      // *italic* or _italic_
      out.push(<em key={out.length}>{m[3] || m[4]}</em>);
    } else if (m[5]) {
      // `code`
      out.push(<code key={out.length}>{m[5]}</code>);
    } else if (m[6] && m[7]) {
      // [label](http://...) or (/relative)
      const href = m[7];
      out.push(
        <a key={out.length} href={href} rel="nofollow">
          {m[6]}
        </a>
      );
    }

    i = re.lastIndex;
  }

  // trailing text
  if (i < src.length) out.push(src.slice(i));
  return out;
}
