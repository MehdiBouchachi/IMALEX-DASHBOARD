// src/features/articles/editor/AdminPreview.jsx
import React from "react";
import styled from "styled-components";
// install once: npm i @fontsource/josefin-sans
import "@fontsource/josefin-sans/400.css";
import "@fontsource/josefin-sans/600.css";
import "@fontsource/josefin-sans/700.css";

/* ---------- helpers ---------- */
const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

/* ---------- base ---------- */
const Root = styled.article`
  /* Restrict Josefin to the preview so admin chrome stays the same */
  font-family: "Josefin Sans", ui-sans-serif, system-ui, -apple-system,
    "Segoe UI", Roboto, Arial, "Helvetica Neue", "Noto Sans", sans-serif;
  color: var(--color-grey-900);
  line-height: 1.7;
`;

/* ---------- header (mirror public blog) ---------- */
const BlogLine = styled.div`
  font-size: 14px;
  color: var(--color-grey-600);
  margin: 2px 0 10px;
  b {
    color: var(--color-brand-700);
    font-weight: 700;
  }
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.15;
  font-size: clamp(32px, 6vw, 56px);
`;

const Sub = styled.p`
  margin: 0 0 10px;
  color: var(--color-grey-700);
  font-size: 18px;
`;

const CreditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin: 6px 0 16px;
  font-size: 14px;
  color: var(--color-grey-600);
`;

const CreditName = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const Tags = styled.div`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  font-size: 12px;
  border-radius: 999px;
  border: 1px solid var(--color-grey-200);
  background: var(--color-grey-100);
  color: var(--color-grey-800);
`;

const Dot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: var(--color-grey-400);
`;

/* hero */
const Hero = styled.figure`
  margin: 14px 0 22px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-grey-200);
  background: var(--color-grey-0);
  img {
    display: block;
    width: 100%;
    height: clamp(260px, 42vh, 520px);
    object-fit: cover;
  }
`;

/* ---------- body ---------- */
const HWrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;
const HAnchor = styled.a`
  font-size: 13px;
  color: var(--color-brand-700);
  opacity: 0;
  text-decoration: none;
  transition: opacity 120ms;
  ${HWrap}:hover & {
    opacity: 1;
  }
`;
const H2El = styled.h2`
  font-weight: 700;
  font-size: 28px;
  line-height: 1.3;
  margin: 22px 0 10px;
`;
const H3El = styled.h3`
  font-weight: 700;
  font-size: 20px;
  line-height: 1.35;
  margin: 18px 0 8px;
`;

const ParaLg = styled.p`
  margin: 8px 0 12px;
  font-size: 18px;
  color: var(--color-grey-800);
`;
const ParaSm = styled.p`
  margin: 6px 0 12px;
  font-size: 16px;
  color: var(--color-grey-800);
`;

const UL = styled.ul`
  list-style: disc;
  padding-left: 24px;
  margin: 6px 0 12px;
  color: var(--color-grey-800);
`;
const OL = styled.ol`
  list-style: decimal;
  padding-left: 24px;
  margin: 6px 0 12px;
  color: var(--color-grey-800);
`;

const Figure = styled.figure`
  margin: 24px 0;
  border: 1px solid var(--color-grey-200);
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-grey-0);
  img {
    display: block;
    width: 100%;
  }
`;
const Figcap = styled.figcaption`
  padding: 8px 12px;
  text-align: center;
  font-size: 12px;
  color: var(--color-grey-600);
`;

const CodePre = styled.pre`
  margin: 8px 0 12px;
  padding: 12px;
  border: 1px solid var(--color-grey-200);
  border-radius: 12px;
  background: var(--color-grey-50);
  overflow-x: auto;
  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 14px;
  }
`;

const Callout = styled.div`
  margin: 10px 0;
  padding: 12px;
  border: 1px dashed var(--color-grey-200);
  border-radius: 12px;
  color: var(--color-grey-800);
  background: var(--color-grey-50);
  border-left-width: 4px;
  &[data-variant="tip"] {
    border-left-color: var(--color-brand-700);
  }
  &[data-variant="note"] {
    border-left-color: var(--color-indigo-700);
  }
  &[data-variant="warn"] {
    border-left-color: var(--color-yellow-700);
  }
  &[data-variant="danger"] {
    border-left-color: var(--color-red-700);
  }
`;

const Quote = styled.figure`
  margin: 20px 0;
  padding: ${(p) => (p.$pull ? "24px 28px" : "16px 18px")};
  border: 1px solid var(--color-grey-200);
  border-radius: 14px;
  background: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  blockquote {
    margin: 0;
    color: var(--color-grey-900);
    font-size: ${(p) => (p.$pull ? "18px" : "16px")};
    line-height: 1.6;
  }
  figcaption {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--color-grey-600);
    font-size: 13px;
  }
  img {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: 1px solid var(--color-grey-200);
  }
`;

/* ---------- inline markdown ---------- */
function Inline({ text = "" }) {
  return <>{parseInline(String(text))}</>;
}
function parseInline(src) {
  const out = [];
  let i = 0;
  const re =
    /\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|_(.+?)_|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g;
  let m;
  while ((m = re.exec(src))) {
    if (m.index > i) out.push(src.slice(i, m.index));
    if (m[1] || m[2])
      out.push(<strong key={out.length}>{m[1] || m[2]}</strong>);
    else if (m[3] || m[4]) out.push(<em key={out.length}>{m[3] || m[4]}</em>);
    else if (m[5]) out.push(<code key={out.length}>{m[5]}</code>);
    else if (m[6] && m[7]) {
      const href = m[7];
      out.push(
        <a
          key={out.length}
          href={href}
          rel="nofollow"
          style={{ color: "var(--color-brand-700)" }}
        >
          {m[6]}
        </a>
      );
    }
    i = re.lastIndex;
  }
  if (i < src.length) out.push(src.slice(i));
  return out;
}

/* ---------- anchors ---------- */
const idFrom = (t = "") =>
  String(t)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 96);

function H2({ text }) {
  const id = idFrom(text);
  return (
    <H2El id={id}>
      <HWrap>
        <span>
          <Inline text={text} />
        </span>
        <HAnchor href={`#${id}`}>#</HAnchor>
      </HWrap>
    </H2El>
  );
}
function H3({ text }) {
  const id = idFrom(text);
  return (
    <H3El id={id}>
      <HWrap>
        <span>
          <Inline text={text} />
        </span>
        <HAnchor href={`#${id}`}>#</HAnchor>
      </HWrap>
    </H3El>
  );
}

/* ---------- public-like preview ---------- */
export default function AdminPreview({ blocks = [], meta }) {
  const {
    title,
    excerpt,
    tags = [],
    teamName,
    authorName,
    publishCredit, // "team" | "author"
    readTimeMin,
    heroUrl,
    heroAlt = "",
    dateISO,
    blogLabel = "IMALEX Blog",
  } = meta || {};

  // match public logic: show team OR author depending on credit
  let creditName = teamName || "";
  if (publishCredit === "author" && authorName) creditName = authorName;

  let firstPara = true;

  return (
    <Root>
      {/* order now mirrors public page */}
      <BlogLine>
        <b>{blogLabel}</b>
        {dateISO ? ` • ${fmtDate(dateISO)}` : ""}
        {readTimeMin ? ` • ${readTimeMin} min read` : ""}
      </BlogLine>

      <Title>{title || "Untitled"}</Title>

      {excerpt ? <Sub>{excerpt}</Sub> : null}

      {(creditName || tags.length) && (
        <CreditRow>
          {creditName && <CreditName>{creditName}</CreditName>}
          {creditName && tags.length ? <Dot /> : null}
          {tags.length ? (
            <Tags>
              {tags.map((t, i) => (
                <TagChip key={`${t}-${i}`}>{t}</TagChip>
              ))}
            </Tags>
          ) : null}
        </CreditRow>
      )}

      {heroUrl ? (
        <Hero>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img src={heroUrl} alt={heroAlt} loading="lazy" />
        </Hero>
      ) : null}

      {/* Body */}
      {blocks.map((block, i) => {
        const key = makeKey(block, i);

        if (block.t === "h2") return <H2 key={key} text={block.x} />;
        if (block.t === "h3") return <H3 key={key} text={block.x} />;

        if (block.t === "blockquote")
          return (
            <Quote key={key} $pull={!!block.pull}>
              <blockquote>
                <Inline text={block.x} />
              </blockquote>
              {(block.cite || block.role || block.avatar || block.href) && (
                <figcaption>
                  {block.avatar && <img src={block.avatar} alt="" />}
                  <div style={{ minWidth: 0 }}>
                    {block.href ? (
                      <a
                        href={block.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate"
                        style={{ color: "var(--color-brand-700)" }}
                      >
                        {block.cite || "—"}
                      </a>
                    ) : (
                      <span className="truncate">{block.cite || "—"}</span>
                    )}
                    {block.role && (
                      <div style={{ fontSize: 12, opacity: 0.85 }}>
                        {block.role}
                      </div>
                    )}
                  </div>
                </figcaption>
              )}
            </Quote>
          );

        if (block.t === "callout")
          return (
            <Callout key={key} data-variant={block.v || "tip"}>
              <Inline text={block.x} />
            </Callout>
          );

        if (block.t === "code")
          return (
            <CodePre key={key}>
              <code>{block.x}</code>
            </CodePre>
          );

        if (block.t === "img")
          return (
            <Figure key={key}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img src={block.src} alt={block.alt || ""} loading="lazy" />
              {block.cap && (
                <Figcap>
                  <Inline text={block.cap} />
                </Figcap>
              )}
            </Figure>
          );

        if (block.t === "ul")
          return (
            <UL key={key}>
              {block.x?.map((li, k) => (
                <li key={`li-${i}-${k}`}>
                  <Inline text={li} />
                </li>
              ))}
            </UL>
          );

        if (block.t === "ol")
          return (
            <OL key={key}>
              {block.x?.map((li, k) => (
                <li key={`li-${i}-${k}`}>
                  <Inline text={li} />
                </li>
              ))}
            </OL>
          );

        const el = firstPara ? (
          <ParaLg key={key}>
            <Inline text={block.x} />
          </ParaLg>
        ) : (
          <ParaSm key={key}>
            <Inline text={block.x} />
          </ParaSm>
        );
        firstPara = false;
        return el;
      })}
    </Root>
  );
}

function makeKey(block, i) {
  const sig = String(block.x || block.src || "").slice(0, 64);
  return `${block.t || "p"}:${sig}#${i}`;
}
