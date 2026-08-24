import { generate } from '../src/App';
import { createBrandProfile } from '../src/design-engine';
import { kanjiDictionary } from '../src/kanji-dictionary';

const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
const brand = createBrandProfile('qa-kanji-input-source');
const base = { effectType: 'random' as const, sound: 'random' as const, mood: 'random' as const, colorChoice: 'random' as const, brand };

assert(kanjiDictionary.length === 100, `Kanji dictionary must contain 100 terms, got ${kanjiDictionary.length}`);
assert(kanjiDictionary.filter(term => term.text.length === 1).length === 50, 'Single-kanji dictionary must contain 50 terms');
assert(kanjiDictionary.filter(term => term.text.length === 2).length === 50, 'Two-kanji dictionary must contain 50 terms');

const samples = Array.from({ length: 5000 }, (_, index) => generate({ ...base, seed: `qa-${index}`, inputSources: [] }));
const families = new Map<string, number>(); const kanji = new Set<string>();
for (const pedal of samples) {
  families.set(pedal.namingFamily || 'missing', (families.get(pedal.namingFamily || 'missing') || 0) + 1);
  if (pedal.kanjiTerm) kanji.add(pedal.kanjiTerm);
  assert(!/N[AO]GORI/i.test(pedal.name), `Deprecated NAGORI/NOGORI appeared: ${pedal.name}`);
}
for (const family of ['english', 'technical', 'numeric-industrial', 'romanized-japanese', 'kanji', 'mixed-japanese-english', 'invented']) assert((families.get(family) || 0) > 0, `Naming family missing: ${family}`);
assert(kanji.size >= 70, `Kanji variety too low across 5,000 seeds: ${kanji.size}`);

const sourceSamples = (source: 'bass' | 'synth-keys' | 'drum-sampler' | 'acoustic-piezo' | 'electric-strings') => Array.from({ length: 600 }, (_, index) => generate({ ...base, seed: `${source}-${index}`, inputSources: [source] }));
const bass = sourceSamples('bass'); const piezo = sourceSamples('acoustic-piezo'); const strings = sourceSamples('electric-strings'); const synth = sourceSamples('synth-keys'); const drum = sourceSamples('drum-sampler');
assert(bass.every(pedal => pedal.signalProfile?.frequencyRange === 'wide-low'), 'Bass must produce a wide-low signal profile');
assert(bass.filter(pedal => pedal.knobs.includes('BLEND') || pedal.knobs.includes('BASS')).length / bass.length >= .6, 'Bass control priority is too weak');
assert([...piezo, ...strings].every(pedal => pedal.signalProfile?.inputImpedance === 'high'), 'Piezo/electric strings must use high input impedance');
assert([...piezo, ...strings].filter(pedal => pedal.knobs.length < 2 || pedal.knobs.includes('NOTCH') || pedal.knobs.includes('FREQ')).length / (piezo.length + strings.length) >= .9, 'Piezo controls are not consistently prioritized');
assert([...synth, ...drum].every(pedal => pedal.signalProfile?.headroom === 'high'), 'Synth/drum must use high headroom');
assert([...synth, ...drum].some(pedal => pedal.ioChannels === 'stereo'), 'Synth/drum never generated a stereo-capable pedal');

console.log(JSON.stringify({ dictionary: kanjiDictionary.length, uniqueKanji: kanji.size, namingFamilies: Object.fromEntries(families), bassControlPriority: bass.filter(pedal => pedal.knobs.includes('BLEND') || pedal.knobs.includes('BASS')).length / bass.length, stereoSynthDrum: [...synth, ...drum].filter(pedal => pedal.ioChannels === 'stereo').length }, null, 2));
