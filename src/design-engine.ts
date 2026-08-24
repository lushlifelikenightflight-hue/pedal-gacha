export type BrandArchetype = 'character' | 'industrial' | 'boutique' | 'retro' | 'diy' | 'psychedelic' | 'cute' | 'digital' | 'luxury';
export type DisplayFontCategory = 'modern_sans' | 'condensed_bold' | 'retro_serif' | 'psychedelic' | 'geometric_tech' | 'script' | 'handwritten' | 'stencil' | 'experimental';
export type UtilityFontCategory = 'sans' | 'condensed_sans' | 'monospace';
export type TypographyMode = 'standard' | 'type_dominant' | 'stacked' | 'diagonal' | 'vertical' | 'repeated' | 'oversized_crop';
export type NamingGrammar = 'poetic_pair' | 'technical_code' | 'single_word' | 'creature_story' | 'place_phenomenon';
export type MotifFamily = 'creature' | 'botanical' | 'celestial' | 'signal' | 'industrial' | 'geometric';
export type EditorialTemplate = 'full-bleed-hero' | 'editorial-split' | 'quiet-product-study' | 'photo-grid' | 'macro-detail' | 'cutout-object' | 'technical-annotation' | 'big-type-feature' | 'strip-layout' | 'poster-page';
export type HeadlineStyle = 'big-japanese-vertical' | 'big-japanese-horizontal' | 'big-english' | 'small-label-body' | 'background-type' | 'no-big-headline';
export type PhotoMode = 'framed' | 'full-bleed' | 'cutout' | 'macro' | 'cropped-strip' | 'layered' | 'annotation' | 'poster';
export type PromoLayout = 'hero' | 'typography' | 'editorial' | 'technical' | 'retro_ad' | 'luxury_minimal' | 'character' | 'pedalboard' | 'series_catalog' | 'experimental_split';
export type PromoDirection = {
  layout: PromoLayout;
  imagePlacement: 'center' | 'left' | 'right' | 'oversized' | 'small' | 'split';
  informationDensity: 'low' | 'medium' | 'high';
  composition: 'centered' | 'asymmetric' | 'split' | 'diagonal';
  pageTemplates?: EditorialTemplate[];
  headlineStyles?: HeadlineStyle[];
  photoModes?: PhotoMode[];
};

export type BrandProfile = {
  id: string;
  manufacturerName: string;
  seriesName: string;
  originStory: string;
  archetype: BrandArchetype;
  displayFontCategory: DisplayFontCategory;
  utilityFontCategory: UtilityFontCategory;
  signatureColor: string;
  secondaryColor: string;
  namingGrammar: NamingGrammar;
  motifFamily: MotifFamily;
  knobFamily: 'classic' | 'davies' | 'skirt' | 'metal' | 'cylinder' | 'dome';
  modelPrefix: string;
  wordmarkPlacement: 'top' | 'bottom' | 'vertical';
};

export type TypographyDesign = {
  mode: TypographyMode;
  displayFontCategory: DisplayFontCategory;
  utilityFontCategory: UtilityFontCategory;
  productNameScale: number;
  letterSpacing: number;
  rotation: number;
  outline: boolean;
  shadow: boolean;
};

const displayFonts: Record<DisplayFontCategory, string> = {
  modern_sans: 'Arial Black, Arial, sans-serif',
  condensed_bold: 'Impact, Arial Narrow, sans-serif',
  retro_serif: 'Georgia, Times New Roman, serif',
  psychedelic: 'Georgia, Cooper Black, serif',
  geometric_tech: 'Trebuchet MS, Arial, sans-serif',
  script: 'Segoe Script, Brush Script MT, cursive',
  handwritten: 'Segoe Print, Comic Sans MS, cursive',
  stencil: 'Impact, Arial Black, sans-serif',
  experimental: 'Impact, Georgia, sans-serif',
};

const utilityFonts: Record<UtilityFontCategory, string> = {
  sans: 'Arial, sans-serif',
  condensed_sans: 'Arial Narrow, Arial, sans-serif',
  monospace: 'Courier New, monospace',
};

export const displayFontStack = (category?: DisplayFontCategory) => displayFonts[category || 'modern_sans'];
export const utilityFontStack = (category?: UtilityFontCategory) => utilityFonts[category || 'sans'];

const seeded = (input: string) => { let h = 2166136261; for (let i = 0; i < input.length; i++) h = Math.imul(h ^ input.charCodeAt(i), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507)) >>> 0) / 4294967296; };
const pick = <T,>(random: () => number, values: T[]) => values[Math.floor(random() * values.length)];
const weighted = <T,>(random: () => number, values: Array<[T, number]>) => { const total = values.reduce((sum, [, weight]) => sum + weight, 0); let roll = random() * total; for (const [value, weight] of values) { roll -= weight; if (roll <= 0) return value; } return values[values.length - 1][0]; };

const archetypeFonts: Record<BrandArchetype, DisplayFontCategory[]> = {
  character: ['handwritten', 'retro_serif', 'modern_sans'], industrial: ['stencil', 'geometric_tech', 'condensed_bold'], boutique: ['script', 'retro_serif', 'modern_sans'],
  retro: ['retro_serif', 'condensed_bold'], diy: ['handwritten', 'stencil', 'condensed_bold'], psychedelic: ['psychedelic', 'experimental', 'retro_serif'],
  cute: ['handwritten', 'script', 'modern_sans'], digital: ['geometric_tech', 'modern_sans', 'condensed_bold'], luxury: ['retro_serif', 'modern_sans', 'script'],
};

const archetypeGrammar: Record<BrandArchetype, NamingGrammar[]> = {
  character: ['creature_story', 'place_phenomenon'], industrial: ['technical_code'], boutique: ['single_word', 'poetic_pair'], retro: ['poetic_pair', 'single_word'],
  diy: ['single_word', 'technical_code'], psychedelic: ['poetic_pair', 'place_phenomenon'], cute: ['creature_story', 'poetic_pair'], digital: ['technical_code', 'single_word'], luxury: ['single_word', 'place_phenomenon'],
};

const archetypeMotifs: Record<BrandArchetype, MotifFamily[]> = {
  character: ['creature'], industrial: ['industrial', 'signal'], boutique: ['botanical', 'celestial'], retro: ['signal', 'celestial'], diy: ['signal', 'geometric'],
  psychedelic: ['celestial', 'botanical', 'creature'], cute: ['creature', 'botanical'], digital: ['geometric', 'signal'], luxury: ['celestial', 'botanical'],
};

const promoWeights: Record<BrandArchetype, Array<[PromoLayout, number]>> = {
  character: [['character', 26], ['editorial', 20], ['hero', 16], ['typography', 12], ['series_catalog', 10], ['retro_ad', 8], ['experimental_split', 8]],
  industrial: [['technical', 28], ['luxury_minimal', 18], ['hero', 14], ['editorial', 12], ['experimental_split', 10], ['typography', 8], ['series_catalog', 6], ['pedalboard', 4]],
  boutique: [['hero', 25], ['luxury_minimal', 24], ['editorial', 15], ['typography', 12], ['retro_ad', 8], ['pedalboard', 6], ['experimental_split', 5], ['series_catalog', 5]],
  retro: [['retro_ad', 28], ['typography', 20], ['editorial', 16], ['hero', 12], ['character', 8], ['series_catalog', 6], ['technical', 5], ['experimental_split', 5]],
  diy: [['editorial', 24], ['experimental_split', 22], ['typography', 16], ['technical', 10], ['retro_ad', 10], ['pedalboard', 8], ['hero', 6], ['series_catalog', 4]],
  psychedelic: [['typography', 28], ['experimental_split', 24], ['hero', 14], ['character', 10], ['editorial', 10], ['retro_ad', 6], ['pedalboard', 5], ['series_catalog', 3]],
  cute: [['character', 28], ['series_catalog', 18], ['hero', 16], ['editorial', 14], ['typography', 10], ['retro_ad', 6], ['luxury_minimal', 5], ['experimental_split', 3]],
  digital: [['technical', 28], ['experimental_split', 22], ['typography', 14], ['hero', 12], ['pedalboard', 10], ['luxury_minimal', 7], ['editorial', 4], ['series_catalog', 3]],
  luxury: [['luxury_minimal', 30], ['hero', 22], ['editorial', 14], ['typography', 12], ['technical', 8], ['retro_ad', 6], ['series_catalog', 5], ['experimental_split', 3]],
};
const archetypeColors: Record<BrandArchetype, [string, string][]> = {
  character: [['#f2b544', '#243b55'], ['#e86b75', '#fff1cf']], industrial: [['#e65a35', '#d5d0bd'], ['#d7c442', '#202522']], boutique: [['#c9955c', '#2d2534'], ['#d7b6dc', '#29313b']],
  retro: [['#e45c3a', '#f1d8a8'], ['#5b9e8b', '#eee2c3']], diy: [['#ffda33', '#1d1d1d'], ['#ef5b48', '#e9e2d0']], psychedelic: [['#f06ac0', '#42d5c5'], ['#ff8a32', '#6848c9']],
  cute: [['#f49bb3', '#bce3da'], ['#f4cb62', '#8fc5e8']], digital: [['#68e3ff', '#15213b'], ['#9cff4a', '#242833']], luxury: [['#d6b06b', '#1e2328'], ['#d9d4c8', '#3b2737']],
};

export function createBrandProfile(seed: string): BrandProfile {
  const random = seeded(seed || 'foundry');
  const archetype = weighted<BrandArchetype>(random, [['industrial', 16], ['boutique', 14], ['retro', 13], ['psychedelic', 12], ['digital', 11], ['character', 10], ['cute', 9], ['diy', 8], ['luxury', 7]]);
  const first = pick(random, ['MOONLIT', 'QUIET', 'VELVET', 'NORTH', 'HOLLOW', 'ALLOY', 'LANTERN', 'MALLOW', 'STATIC', 'PALE', 'ORBITAL', 'RIVER']);
  const second = pick(random, ['CURRENT', 'SIGNAL', 'FIELD', 'CIRCUIT', 'GARDEN', 'MACHINE', 'ECHO', 'VOLTAGE', 'TONE', 'WORKSHOP']);
  const suffix = pick(random, ['DEVICES', 'AUDIO WORKS', 'ELECTRIC', 'SOUND LAB', 'INSTRUMENTS']);
  const manufacturerName = `${first} ${second} ${suffix}`;
  const displayFontCategory = pick(random, archetypeFonts[archetype]);
  const utilityFontCategory: UtilityFontCategory = ['industrial', 'digital', 'diy'].includes(archetype) ? 'monospace' : random() > .55 ? 'condensed_sans' : 'sans';
  const [signatureColor, secondaryColor] = pick(random, archetypeColors[archetype]);
  const seriesName = `${pick(random, ['FIELD', 'NIGHT', 'WORKSHOP', 'SIGNAL', 'SMALL HOURS', 'FOUND OBJECT', 'STUDIO'])} SERIES`;
  const modelPrefix = manufacturerName.split(' ').slice(0, 2).map(word => word[0]).join('') + pick(random, ['A', 'D', 'S', 'X']);
  const originStory = `${manufacturerName} is an independent ${archetype} instrument maker focused on coherent, playable objects rather than decorative gadgets.`;
  return { id: `maker-${Math.floor(random() * 0xffffff).toString(16).padStart(6, '0')}`, manufacturerName, seriesName, originStory, archetype, displayFontCategory, utilityFontCategory, signatureColor, secondaryColor, namingGrammar: pick(random, archetypeGrammar[archetype]), motifFamily: pick(random, archetypeMotifs[archetype]), knobFamily: pick(random, archetype === 'industrial' || archetype === 'digital' ? ['metal', 'cylinder'] : archetype === 'retro' ? ['davies', 'skirt'] : ['classic', 'davies', 'skirt']), modelPrefix, wordmarkPlacement: weighted(random, [['top', 72], ['bottom', 23], ['vertical', 5]]) };
}

export function createPromoDirection(brand: BrandProfile, random: () => number): PromoDirection {
  const layout = weighted(random, promoWeights[brand.archetype] || promoWeights.boutique);
  const placementByLayout: Record<PromoLayout, PromoDirection['imagePlacement'][]> = {
    hero: ['center', 'oversized', 'right'], typography: ['right', 'small', 'split'], editorial: ['left', 'right', 'split'], technical: ['right', 'split'], retro_ad: ['center', 'left'],
    luxury_minimal: ['small', 'right'], character: ['right', 'center'], pedalboard: ['oversized', 'left'], series_catalog: ['split', 'center'], experimental_split: ['split', 'oversized'],
  };
  const informationDensity: PromoDirection['informationDensity'] = layout === 'luxury_minimal' || layout === 'hero' ? 'low' : layout === 'technical' || layout === 'series_catalog' ? 'high' : 'medium';
  const composition: PromoDirection['composition'] = layout === 'experimental_split' ? 'diagonal' : layout === 'technical' || layout === 'series_catalog' ? 'split' : layout === 'editorial' || layout === 'typography' ? 'asymmetric' : 'centered';
  const templatePools: EditorialTemplate[][] = [
    ['full-bleed-hero', 'poster-page', 'cutout-object'], ['editorial-split', 'quiet-product-study', 'big-type-feature'], ['photo-grid', 'macro-detail', 'strip-layout'],
    ['big-type-feature', 'technical-annotation', 'editorial-split'], ['cutout-object', 'macro-detail', 'technical-annotation'], ['quiet-product-study', 'poster-page', 'editorial-split'],
    ['poster-page', 'big-type-feature', 'technical-annotation'], ['technical-annotation', 'quiet-product-study', 'photo-grid'],
  ];
  const headlinePools: HeadlineStyle[][] = [
    ['big-english', 'background-type'], ['big-japanese-horizontal', 'small-label-body'], ['small-label-body', 'no-big-headline'], ['big-english', 'background-type'],
    ['small-label-body', 'big-japanese-horizontal'], ['big-japanese-vertical', 'small-label-body'], ['background-type', 'no-big-headline'], ['small-label-body', 'big-english'],
  ];
  const photoPools: PhotoMode[][] = [
    ['full-bleed', 'poster', 'cutout'], ['framed', 'layered', 'cutout'], ['macro', 'layered', 'annotation'], ['poster', 'cropped-strip', 'framed'],
    ['cutout', 'macro', 'annotation'], ['framed', 'cutout', 'poster'], ['cropped-strip', 'layered', 'poster'], ['annotation', 'framed', 'cutout'],
  ];
  const choosePlan = <T extends string>(pools: T[][], maxUses = 2) => {
    const result: T[] = []; const uses = new Map<T, number>(); const universe = [...new Set(pools.flat())];
    pools.forEach(candidates => {
      const preferred = candidates.filter(candidate => candidate !== result[result.length - 1] && (uses.get(candidate) || 0) < maxUses);
      const fallback = universe.filter(candidate => candidate !== result[result.length - 1] && (uses.get(candidate) || 0) < maxUses);
      const selected = pick(random, preferred.length ? preferred : fallback);
      result.push(selected); uses.set(selected, (uses.get(selected) || 0) + 1);
    });
    return result;
  };
  const pageTemplates = choosePlan(templatePools, 1);
  const headlineStyles = choosePlan(headlinePools, 2);
  const photoModes = choosePlan(photoPools, 2);
  return { layout, imagePlacement: pick(random, placementByLayout[layout]), informationDensity, composition, pageTemplates, headlineStyles, photoModes };
}
export function createTypographyDesign(brand: BrandProfile, random: () => number, effectType: string, dominant: boolean, knobCount: number): TypographyDesign {
  const loud = /FUZZ|DISTORTION|DRIVE|CRUSH|RING/.test(effectType);
  const spatial = /DELAY|REVERB|CHORUS|PHASER|SHIMMER/.test(effectType);
  const effectFonts: DisplayFontCategory[] = loud ? ['condensed_bold', 'psychedelic', 'stencil'] : spatial ? ['script', 'psychedelic', 'geometric_tech'] : ['modern_sans', 'retro_serif', 'geometric_tech'];
  const displayFontCategory = random() < .62 ? brand.displayFontCategory : pick(random, effectFonts);
  const allowedModes: Array<[TypographyMode, number]> = dominant
    ? [['type_dominant', 34], ['stacked', 22], ['diagonal', 16], ['repeated', 12], ['vertical', 8], ['oversized_crop', 8]]
    : [['standard', 72], ['stacked', 14], ['diagonal', 8], ['repeated', 4], ['vertical', 2]];
  let mode = weighted(random, allowedModes);
  if (knobCount >= 5 && ['vertical', 'oversized_crop', 'repeated'].includes(mode)) mode = 'stacked';
  return { mode, displayFontCategory, utilityFontCategory: brand.utilityFontCategory, productNameScale: dominant ? .92 + random() * .16 : .68 + random() * .14, letterSpacing: displayFontCategory === 'geometric_tech' ? .08 : displayFontCategory === 'script' ? .01 : .035, rotation: mode === 'diagonal' ? (random() > .5 ? 1 : -1) * (.08 + random() * .08) : mode === 'vertical' ? Math.PI / 2 : 0, outline: ['condensed_bold', 'psychedelic', 'experimental'].includes(displayFontCategory), shadow: dominant && random() > .5 };
}

export type NamingFamily = 'english' | 'technical' | 'romanized-japanese' | 'kanji' | 'mixed-japanese-english' | 'invented' | 'numeric-industrial';

export function createBrandProductName(brand: BrandProfile, random: () => number, fallbackBase: string, effectSuffix: string, modelNumber: string, family?: NamingFamily, kanjiText?: string) {
  const adjective = pick(random, ['MIDNIGHT', 'PALE', 'SLEEPY', 'WILD', 'HOLLOW', 'BLUE', 'QUIET', 'LATE', 'VELVET']);
  const noun = pick(random, ['OTTER', 'PLATFORM', 'GARDEN', 'SIGNAL', 'MACHINE', 'MOTH', 'RIVER', 'TEMPLE', 'ORBIT']);
  const action = pick(random, ['WAITS', 'DRIFTS', 'BREAKS', 'SLEEPS', 'RETURNS']);
  const romanized = ['KASUMI', 'YOHAKU', 'YOIN', 'KAGE', 'HIBIKI', 'YURE', 'SHIZUKU', 'KODO', 'RIN', 'UTSURO', 'HAZAMA', 'KASANE', 'TOKI', 'KIRAMEKI', 'EN'];
  const invented = ['MALLOW', 'VELUNE', 'MERROW', 'OBRA', 'TESSEL', 'ORVAN', 'SENKA', 'NOMA', 'VARO', 'ELUNE', 'KIRN'];
  if (family === 'technical' || family === 'numeric-industrial') return `${modelNumber} ${effectSuffix}`;
  if (family === 'romanized-japanese') return pick(random, romanized);
  if (family === 'kanji') return kanjiText || fallbackBase;
  if (family === 'mixed-japanese-english') return `${kanjiText || pick(random, romanized)} ${effectSuffix}`;
  if (family === 'invented') return pick(random, invented);
  if (family === 'english') return random() < .35 ? `${adjective} ${noun}` : `${noun} ${pick(random, ['AFTERGLOW', 'ECHO', 'RAIN', 'DRIFT', 'BLOOM'])}`;
  if (brand.namingGrammar === 'technical_code') return `${modelNumber} ${effectSuffix}`;
  if (brand.namingGrammar === 'creature_story') return `${adjective} ${noun} ${action}`;
  if (brand.namingGrammar === 'place_phenomenon') return `${noun} ${pick(random, ['AFTERGLOW', 'ECHO', 'RAIN', 'DRIFT', 'BLOOM'])}`;
  if (brand.namingGrammar === 'single_word') return pick(random, [fallbackBase, noun, adjective, ...invented]);
  return `${adjective} ${effectSuffix}`;
}