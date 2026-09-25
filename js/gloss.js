// English text → ordered list of sign ids.
//
// PLACEHOLDER: this keeps English word order and only maps words/phrases that
// have a sign. Real English→ISL gloss reordering (ISL grammar) goes in
// toGloss() — the rest of the app only depends on its return shape:
//     { ids: ['summer', ...], missing: ['word', ...] }

// Function words skipped silently instead of being reported as "no clip yet".
const SKIP = new Set(['a', 'an', 'the', 'is', 'are', 'am', 'was', 'were', 'be', 'to', 'of']);

export function buildLexicon(signs) {
  const map = new Map();
  let maxWords = 1;
  for (const s of signs) {
    for (const phrase of [s.en, ...(s.aliases || [])]) {
      const key = normalize(phrase).join(' ');
      map.set(key, s.id);
      maxWords = Math.max(maxWords, key.split(' ').length);
    }
  }
  return { map, maxWords };
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
}
   // Fixed demo line, in ISL order (unconfirmed — verify with a signer).
   const FIXED_LINES = [
     { match: 'do your best in the competition', ids: ['competition', 'your', 'best', 'do'] },
   ];
// isAvailable(id) → true when a clip file exists for that sign.
export function toGloss(text, lexicon, isAvailable) {
       const normalized = normalize(text).join(' ');
     for (const line of FIXED_LINES) {
       if (normalized === line.match) {
         const ids = line.ids.filter(isAvailable);
         const missing = line.ids.filter((id) => !isAvailable(id));
         return { ids, missing };
       }
     }
  const tokens = normalize(text);
  const ids = [];
  const missing = [];
  let i = 0;
  while (i < tokens.length) {
    let matched = false;
    for (let n = Math.min(lexicon.maxWords, tokens.length - i); n >= 1; n--) {
      const phrase = tokens.slice(i, i + n).join(' ');
      const id = lexicon.map.get(phrase);
      if (id) {
        if (isAvailable(id)) ids.push(id); else missing.push(phrase);
        i += n; matched = true; break;
      }
    }
    if (!matched) {
      if (!SKIP.has(tokens[i])) missing.push(tokens[i]);
      i++;
    }
  }
  return { ids, missing };
}
