// Tiny localStorage wrapper. Everything is wrapped in try/catch because
// storage can be blocked (private mode) or full.
const KEY = 'signspeak:v1';
const defaults = () => ({ direction: 'en-isl', speed: 1, seen: [], days: [] });
let data = defaults();
try { Object.assign(data, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { /* ignore */ }

const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ } };
const dayKey = (d) => d.toLocaleDateString('en-CA'); // yyyy-mm-dd, local time

export const store = {
  get: (k) => data[k],
  set(k, v) { data[k] = v; save(); },

  markSeen(id) {
    if (!data.seen.includes(id)) { data.seen.push(id); save(); }
  },
  touchToday() {
    const today = dayKey(new Date());
    if (!data.days.includes(today)) {
      data.days.push(today);
      data.days = data.days.slice(-90);
      save();
    }
  },
  streak() {
    const have = new Set(data.days);
    const d = new Date();
    let n = 0;
    while (have.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  },
  reset() { data = defaults(); save(); },
};
