// src/hooks/useQueryFilter.js
// Generic, lightweight query filter for any list.
// - Case-insensitive
// - Splits query on spaces into tokens (all tokens must match)
// - Works with field paths ("team.name") or extractor functions
// - Handles arrays (e.g., tags) gracefully

function getByPath(obj, path) {
  if (!obj || !path) return undefined;
  return path
    .split(".")
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function normalize(v) {
  if (v == null) return "";
  if (Array.isArray(v)) return v.map(normalize).join(" ");
  return String(v).toLowerCase();
}

/**
 * @param {Array<any>} items
 * @param {string} query
 * @param {Array<string|function(any):any>} fields  field paths or extractor fns
 * @returns {Array<any>} filtered items
 */
export default function useQueryFilter(items, query, fields) {
  if (!query) return items;
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

  return items.filter((it) => {
    const haystack = fields
      .map((f) => (typeof f === "function" ? f(it) : getByPath(it, f)))
      .map(normalize)
      .join(" ");

    return tokens.every((tk) => haystack.includes(tk));
  });
}
