import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { jsPDF } from 'jspdf';
import { createBrandProductName, createBrandProfile, createPromoDirection, createTypographyDesign, displayFontStack, utilityFontStack, type BrandProfile, type NamingFamily, type PromoDirection, type TypographyDesign } from './design-engine';
import { selectKanjiStyle, selectKanjiTerm, selectKanjiUsage, type KanjiTypographyStyle, type KanjiUsage } from './kanji-dictionary';
import { createHybridLayoutPlan, type ControlLabelPlacement } from './layout-engine';

type Choice = 'clarity' | 'loud' | 'broken' | 'cosmic';
type Instrument = 'guitar' | 'bass' | 'both';
type InstrumentChoice = Instrument | 'random';
type InputSource = 'guitar' | 'bass' | 'synth-keys' | 'drum-sampler' | 'acoustic-piezo' | 'electric-strings' | 'other';
type SignalProfile = { level: 'instrument' | 'line-tolerant' | 'piezo'; headroom: 'standard' | 'high'; frequencyRange: 'standard' | 'wide-low' | 'full-range'; inputImpedance: 'standard' | 'high'; stereoPreferred: boolean; designNotes: string[] };
type EffectTypeChoice = 'random' | 'boost' | 'drive' | 'fuzz' | 'compressor' | 'eq-filter' | 'modulation' | 'phaser' | 'tremolo' | 'delay' | 'reverb' | 'pitch' | 'synth' | 'looper' | 'glitch' | 'experimental' | 'multi';
type Mood = 'focused' | 'restless' | 'dreaming' | 'feral';
type ColorChoice = 'acid' | 'violet' | 'ice' | 'ember';
type ToneChoice = Choice | 'random';
type MoodChoice = Mood | 'random';
type FinishChoice = ColorChoice | 'random';
type GachaState = 'idle' | 'cranking' | 'revealing' | 'result';
type WorkflowPhase = 'select' | 'forging' | 'forged' | 'finishing' | 'shipping' | 'shipped';
type ViewMode = 'stage' | 'studio' | 'hero' | 'white' | 'dark';
type ShotPreset = 'hero' | 'stage' | 'studio' | 'editorial-cover' | 'open-box' | 'full-kit' | 'social-x';
type PaletteMode = 'mono' | 'duotone' | 'tritone' | 'multi-accent' | 'sticker-mix' | 'full-graphic';
type RuntimeMode = 'off' | 'on' | 'play';
type Enclosure = 'nano' | 'micro' | 'mini' | 'compact' | 'standard125' | 'tall' | 'wide' | 'bigbox' | 'wedge' | 'treadle' | 'digital' | 'utility';
type JackLayout = 'sides' | 'top' | 'hybrid';
type PowerPlacement = 'top' | 'right-near-input' | 'top-offset';
type ControlLayout = 'minimal2' | 'classic3' | 'dual4' | 'dense6' | 'dense8';
type MaterialStyle = 'powder' | 'matte' | 'semi-gloss' | 'high-gloss' | 'metallic-flake' | 'anodized' | 'brushed' | 'hammered' | 'aged' | 'pearl' | 'iridescent' | 'holographic';
type KnobStyle = 'classic' | 'davies' | 'skirt' | 'metal' | 'cylinder' | 'dome';
type FootswitchStyle = 'metal' | 'soft-touch' | 'pad' | 'large-lower-paddle';
type ControlVariant = 'row' | 'triangle' | 'grid' | 'hero' | 'asymmetric';
type DesignArchetype = 'MINIMAL LAB' | 'VINTAGE STOMP' | 'DARK BOUTIQUE' | 'PSYCHE FUZZ' | 'SPACE SIGNAL' | 'JAPANESE INDUSTRIAL' | 'SWISS MODERN' | 'GARAGE DIY' | 'SCIENTIFIC' | 'POP OBJECT' | 'BARE METAL' | 'MYSTIC SYMBOL';
type NamingPattern = 'SINGLE' | 'ADJECTIVE NOUN' | 'NOUN PAIR' | 'MODEL CODE' | 'TECHNICAL' | 'JAPANESE' | 'PROPER NAME';
type ArtCoverage = 'none' | 'mark' | 'symbol' | 'partial' | 'full';
type ArtDirection = 'SWISS' | 'INDUSTRIAL' | 'BRUTALIST' | 'SCIENTIFIC' | 'RISOGRAPH' | 'PSYCHEDELIC' | 'MINIMAL SYMBOL' | 'ILLUSTRATION';
type HardwareCulture = 'CLASSIC STOMP' | 'BIG BOX' | 'TREADLE STOMP' | 'DIGITAL MULTI' | 'MINI BOUTIQUE' | 'LAB UTILITY' | 'GRAPHIC BOX' | 'DIY CUSTOM';
type GraphicMode = 'MINIMAL' | 'TYPOGRAPHY' | 'TYPOGRAPHY LED' | 'ONE POINT' | 'PANEL' | 'TECHNICAL' | 'STICKER' | 'ABSTRACT' | 'FULL ILLUSTRATION';
type Condition = 'FACTORY NEW' | 'USED' | 'STUDIO WORN' | 'TOUR WORN' | 'DIY MODIFIED';
type GroupFrameStyle = 'thin-line' | 'open-frame' | 'underline' | 'panel' | 'bracket' | 'printed-box';
type VisualIntensity = 'calm' | 'expressive' | 'bold' | 'maximal';
type ControlLayoutMode = 'knob-only' | 'knob-plus-slider-eq' | 'slider-eq-main';
type EqLayoutPreset = 'eq-2-band' | 'eq-3-band' | 'eq-5-band' | 'eq-7-band';
type EqSliderSpec = { label: string; value: number };
type ControlGroup = { name: string; controls: string[] };
type IdentityMotif = 'none' | 'broken-wave';
type MotifCategory = 'animal' | 'plant' | 'object' | 'food' | 'body-human' | 'science-tech' | 'urban-industrial' | 'abstract' | 'cute-character' | 'symbol-emblem' | 'celestial' | 'music-audio' | 'weather-natural' | 'fantasy-occult';
type MotifType = 'cat' | 'moth' | 'dog' | 'rabbit' | 'bird' | 'fish' | 'bear' | 'fox' | 'bloom' | 'mushroom' | 'key' | 'radio' | 'lemon' | 'donut' | 'eye' | 'heart' | 'circuit' | 'meter' | 'tower' | 'manhole' | 'spiral' | 'drop' | 'ghost' | 'blob' | 'bolt' | 'crown' | 'moon' | 'star' | 'planet' | 'tape' | 'speaker' | 'wave' | 'grid' | 'mountain' | 'cloud' | 'flame' | 'candle' | 'mask';
type MotifRenderStyle = 'line-art' | 'silhouette' | 'stamp' | 'silkscreen' | 'engraved' | 'hand-drawn' | 'pictogram' | 'mascot' | 'woodcut' | 'abstract-mark';
type MotifPlacement = 'lower-right' | 'lower-left' | 'upper-right' | 'upper-left' | 'center-small' | 'above-footswitch' | 'between-knobs' | 'diagonal-corner';
type MotifScale = 'tiny' | 'small' | 'medium' | 'statement';
type LedStyle = 'dome' | 'flat' | 'lens';
type LedLocation = 'upper' | 'center' | 'none';
type GraphicUsageMode = 'preserve' | 'transform' | 'auto';
type GraphicPlacementMode = 'one-point' | 'sticker' | 'panel' | 'full' | 'auto';
type GraphicTransformStyle = 'auto' | 'silkscreen' | 'risograph' | 'halftone' | 'poster' | 'sticker' | 'abstract';
type UserGraphic = { fileName: string; mimeType: string; width: number; height: number; sourceUrl: string; textureUrl: string; usageMode: GraphicUsageMode; placementMode: GraphicPlacementMode; transformStyle: GraphicTransformStyle; transformStrength: 'low' | 'medium' | 'high'; colorBehavior: 'preserve' | 'pedal-match' | 'duotone' | 'monochrome'; variant: number };
type MarkSurface = 'front' | 'left-side' | 'right-side' | 'back';
type PedalMark = { enabled: boolean; text: string; surface: MarkSurface; u: number; v: number; size: number; rotation: number; font: 'gothic-jp' | 'mincho-jp' | 'maru-jp' | 'handwritten-jp' | 'mono' | 'stencil'; color: string; style: 'print' | 'stamp' | 'engraved' | 'etched' | 'paint-marker' | 'decal' | 'embossed' };
type CustomGraphicMeta = { sourceName: string; treatment: string; placement: string; preservation: string };
type Pedal = {
  id: string; seed: string; owner: string; instrument: Instrument; inputSources?: InputSource[]; signalProfile?: SignalProfile; ioChannels?: 'mono' | 'stereo'; effectType: EffectTypeChoice; sound: Choice; mood: Mood;
  colorChoice: ColorChoice; name: string; type: string; copy: string; knobs: string[];
  special: string; rarity: number; serial: string; usage: string; warning: string; bypass: string;
  power: string; dimensions: string; weight: string; palette: [string, string]; paletteMode?: PaletteMode; graphicColor?: string; hardwareColors?: string[]; accentColors?: string[]; variant?: boolean;
  enclosure: Enclosure; jackLayout: JackLayout; powerPlacement: PowerPlacement; controlLayout: ControlLayout;
  footswitches: 1 | 2; toggleCount: number; artIndex: number; artAtlas: 'a' | 'b';
  labelMode: 'full' | 'sparse'; ownerFont: number; choiceImpact: string[];
  materialStyle: MaterialStyle; knobStyle: KnobStyle; footswitchStyle: FootswitchStyle;
  artCoverage: ArtCoverage; ledStyle: LedStyle; ledCount?: number; ledLocation?: LedLocation; ledColors?: string[]; display: 'none' | 'segment' | 'oled';
  extraPort: 'none' | 'expression' | 'midi' | 'usb'; brandSeries: string;
  artDirection: ArtDirection; designScore: number; designArchetype: DesignArchetype;
  controlVariant: ControlVariant; titleFont: number; brandLabel: string; ownerLabel: string; namingPattern: NamingPattern;
  hardwareCulture: HardwareCulture; graphicMode: GraphicMode; condition: Condition;
  effectArchitecture: string; controlGroups: ControlGroup[]; controlGroupFrameStyle?: GroupFrameStyle; visualIntensity?: VisualIntensity; primaryControl: string; controlLayoutMode?: ControlLayoutMode; eqPreset?: EqLayoutPreset; eqSliders?: EqSliderSpec[];
  footswitchLabels: string[]; toggleLabels: string[]; identityMotif: IdentityMotif;
  brand?: BrandProfile; typography?: TypographyDesign; modelNumber?: string; namingFamily?: NamingFamily; kanjiTerm?: string; kanjiStyle?: KanjiTypographyStyle; kanjiUsage?: KanjiUsage; layoutChecks?: string[]; promoDirection?: PromoDirection; motifType?: MotifType; motifLabel?: string; motifCategory?: MotifCategory; motifRenderStyle?: MotifRenderStyle; motifPlacement?: MotifPlacement; motifScale?: MotifScale;
  customGraphic?: CustomGraphicMeta;
};
const paletteFamilies: Record<ColorChoice, [string, string][]> = {
  acid: [['#c7ff1a', '#202d0f'], ['#f1e86a', '#36352d'], ['#8fe641', '#2b123f'], ['#ffb12b', '#3c2416'], ['#b7d760', '#3b4329']],
  violet: [['#b58aff', '#4b2266'], ['#d6b5ff', '#241735'], ['#ff9bc9', '#4a1f3a'], ['#aa94d9', '#293049'], ['#d2c7ff', '#43306c']],
  ice: [['#8ceaff', '#17485a'], ['#e7fbff', '#29414a'], ['#78c8d2', '#25363f'], ['#b8e3ef', '#1a2740'], ['#d8f2eb', '#37504d']],
  ember: [['#ff8056', '#5b2718'], ['#ffb36b', '#472b20'], ['#d85b39', '#311814'], ['#f1c27d', '#5a3324'], ['#ff7043', '#49302a']],
};
const labels = {
  clarity: ['GLASS', 'LUCID', 'WHITE NOISE', 'MIRROR'], loud: ['RAMPAGE', 'IRON', 'FURNACE', 'VOLTAGE'],
  broken: ['MELT', 'WRECK', 'FRACTURE', 'DUST'], cosmic: ['MOONBATH', 'ORBIT', 'NEBULA', 'VOID'],
};
const descriptions: Record<Choice, string[]> = {
  clarity: ['音の縁をガラスのように磨き上げる', '原音の奥に静かな光を足す', 'ピッキングの輪郭だけを静かに前へ出す', '低域を崩さず、倍音の曇りだけを取り除く', '音量差を整えながら手元の強弱を残す'],
  loud: ['スピーカーの限界へ一直線に押し出す', '輪郭を保ったまま轟音だけを増幅する', '低域の塊を前段から押し出す', '弦の摩擦まで太い倍音へ変換する', 'アンプの余白を熱量で埋め尽くす'],
  broken: ['壊れかけの回路から歌声を掘り出す', '音程の裂け目にだけ残響を流し込む', '入力の端を不規則な粒へ分解する', '減衰音だけを歪んだ輪郭へ置き換える', '追従の遅れをリズムとして残す'],
  cosmic: ['音の輪郭を夜空の外側へ溶かす', '演奏を止めても衛星だけが回り続ける', '反復音を遠い軌道へ少しずつずらす', '残響の上層だけを淡く持ち上げる', '原音の周囲へゆっくり動く位相を作る'],
};
const specialsByCategory: Record<EffectCategory, string[]> = {
  drive: ['VOICE切替でクリッピングの対称性を変更', '入力レベルに応じて低域の飽和量を自動補正'], fuzz: ['BIASを絞ると減衰音だけがゲート状に途切れる', '強く弾いた瞬間だけ上側の倍音が開く'],
  boost: ['最大設定でも低域の位相を保つ', 'GAINを上げるほど中域の焦点が狭まる'], compressor: ['アタック成分を残したまま余韻だけを持ち上げる', '強い入力時だけレシオを段階的に切り替える'],
  modulation: ['演奏の強さに応じて揺れ幅がわずかに変化', '中央付近で原音と変調音の位相が最も揃う'], phaser: ['フィードバック最大付近で段数を自動切替', '低いRATEでは揺れの頂点だけを長く保持'],
  tremolo: ['入力が弱くなるほど波形が滑らかに変化', 'タップ間隔から揺れの周期を再構成'], delay: ['演奏を止めると最後の反復だけが逆再生', '強く弾いた音だけ反復回数を一段追加'],
  reverb: ['残響の減衰末尾だけをゆっくり変調', 'PRE-DELAY最大時に初期反射を左右へ分離'], filter: ['入力が小さいほどフィルターの開き方を反転', 'ピーク付近だけ原音を薄く混ぜて輪郭を保持'],
  synth: ['強く弾くほど二つ目の音程が現れる', '入力追従が外れた瞬間だけ別オクターブへ遷移'],
};
const effectFamilies: Record<Choice, string[]> = {
  clarity: ['COMPRESSOR', 'PARAMETRIC EQ', 'ENVELOPE FILTER', 'CLEAN BOOST'],
  loud: ['OVERDRIVE', 'DISTORTION', 'FUZZ', 'AMP PREAMP'],
  broken: ['GATED FUZZ', 'BIT CRUSHER', 'RING MODULATOR', 'OCTAVE FUZZ'],
  cosmic: ['TAPE DELAY', 'SHIMMER REVERB', 'CHORUS', 'PHASER'],
};
const selectedEffectFamilies: Record<Exclude<EffectTypeChoice, 'random'>, string[]> = {
  boost: ['CLEAN BOOST', 'TREBLE BOOST'], drive: ['OVERDRIVE', 'DISTORTION', 'AMP PREAMP'], fuzz: ['FUZZ', 'GATED FUZZ', 'OCTAVE FUZZ'], compressor: ['COMPRESSOR', 'LIMITER'], 'eq-filter': ['PARAMETRIC EQ', 'GRAPHIC EQ', 'ENVELOPE FILTER'],
  delay: ['TAPE DELAY', 'REVERSE DELAY', 'MULTI TAP DELAY'], reverb: ['PLATE REVERB', 'SHIMMER REVERB', 'SPRING REVERB'],
  modulation: ['CHORUS', 'FLANGER', 'VIBRATO', 'ROTARY'], phaser: ['PHASER', 'MULTI-STAGE PHASER'], tremolo: ['TREMOLO', 'HARMONIC TREMOLO'], pitch: ['OCTAVE', 'PITCH SHIFTER', 'HARMONIZER'], synth: ['SYNTH FILTER', 'RING MODULATOR', 'PITCH SYNTH'], looper: ['LOOPER', 'FREEZE'], glitch: ['BIT CRUSHER', 'GLITCH', 'NOISE PROCESSOR'], experimental: ['RESONATOR', 'RING MODULATOR', 'EXPERIMENTAL PROCESSOR'], multi: ['MULTI EFFECT', 'DIGITAL MULTI PROCESSOR'],
};
export const enclosureDimensions: Record<Enclosure, { width: number; height: number; depth: number; label: string }> = {
  nano: { width: 1.25, height: 2.05, depth: .86, label: 'NANO SHORT / MOSKY CLASS' },
  micro: { width: 1.42, height: 2.48, depth: .9, label: 'MICRO SHORT / HOTONE CLASS' },
  mini: { width: 1.48, height: 3.05, depth: .94, label: 'SLIM MINI / DONNER CLASS' },
  compact: { width: 2.15, height: 3.45, depth: 1.08, label: 'STANDARD STOMP' },
  standard125: { width: 2.55, height: 3.72, depth: 1.12, label: '125B STANDARD' },
  tall: { width: 1.98, height: 3.72, depth: 1.04, label: 'SLIM TALL' },
  wide: { width: 4.15, height: 3.2, depth: 1.12, label: 'WIDE CONTROL' },
  bigbox: { width: 3.65, height: 3.85, depth: 1.18, label: 'SQUARE BIG BOX' },
  wedge: { width: 3.15, height: 3.65, depth: 1.2, label: 'HEAVY WEDGE' },
  treadle: { width: 2.75, height: 4.75, depth: 1.3, label: 'TREADLE STOMP' },
  digital: { width: 3.2, height: 4.65, depth: 1.35, label: 'DIGITAL CONSOLE' },
  utility: { width: 4.65, height: 3.65, depth: 1.25, label: 'LAB UTILITY' },
};
type EffectCategory = 'drive' | 'fuzz' | 'boost' | 'compressor' | 'modulation' | 'phaser' | 'tremolo' | 'delay' | 'reverb' | 'filter' | 'synth';
const controlTemplates: Record<EffectCategory, string[][]> = {
  drive: [['GAIN', 'LEVEL'], ['GAIN', 'TONE', 'LEVEL'], ['GAIN', 'TONE', 'LEVEL', 'BLEND']],
  fuzz: [['FUZZ', 'VOLUME'], ['FUZZ', 'TONE', 'VOLUME'], ['FUZZ', 'TONE', 'VOLUME', 'BIAS']],
  boost: [['LEVEL'], ['LEVEL', 'GAIN']],
  compressor: [['SUSTAIN', 'LEVEL'], ['SUSTAIN', 'ATTACK', 'LEVEL'], ['SUSTAIN', 'ATTACK', 'BLEND', 'LEVEL']],
  modulation: [['RATE', 'DEPTH', 'MIX'], ['RATE', 'DEPTH', 'TONE', 'MIX']],
  phaser: [['RATE', 'DEPTH'], ['RATE', 'DEPTH', 'MIX'], ['RATE', 'DEPTH', 'FEEDBACK', 'MIX']],
  tremolo: [['RATE', 'DEPTH'], ['RATE', 'DEPTH', 'LEVEL'], ['RATE', 'DEPTH', 'WAVE', 'LEVEL']],
  delay: [['TIME', 'FEEDBACK', 'MIX'], ['TIME', 'FEEDBACK', 'MIX', 'TONE'], ['TIME', 'FEEDBACK', 'MIX', 'TONE', 'MOD']],
  reverb: [['DECAY', 'MIX', 'TONE'], ['DECAY', 'MIX', 'TONE', 'PRE-DELAY'], ['DECAY', 'MIX', 'TONE', 'DWELL', 'MOD']],
  filter: [['SENS', 'Q', 'RANGE'], ['SENS', 'Q', 'DECAY', 'LEVEL'], ['SENS', 'Q', 'RANGE', 'DECAY', 'LEVEL']],
  synth: [['MIX', 'FILTER', 'RESONANCE', 'TONE'], ['MIX', 'FILTER', 'RESONANCE', 'OCTAVE', 'ATTACK'], ['MIX', 'FILTER', 'RESONANCE', 'OCTAVE', 'TONE', 'ATTACK']],
};
const categoryFor = (type: string): EffectCategory => {
  if (type.includes('FUZZ')) return 'fuzz';
  if (type.includes('BOOST')) return 'boost';
  if (type.includes('COMPRESSOR')) return 'compressor';
  if (type.includes('DELAY')) return 'delay';
  if (type.includes('REVERB')) return 'reverb';
  if (type.includes('PHASER')) return 'phaser';
  if (type.includes('TREMOLO')) return 'tremolo';
  if (type.includes('CHORUS')) return 'modulation';
  if (type.includes('FILTER') || type.includes('EQ')) return 'filter';
  if (type.includes('SYNTH') || type.includes('RING') || type.includes('BIT') || type.includes('PITCH') || type.includes('OCTAVE') || type.includes('HARMON') || type.includes('LOOPER') || type.includes('FREEZE') || type.includes('GLITCH') || type.includes('NOISE') || type.includes('RESONATOR') || type.includes('EXPERIMENTAL') || type.includes('MULTI')) return 'synth';
  return 'drive';
};
type EnclosureClass = 'compact' | 'mini' | 'micro' | 'standard125' | 'wide' | 'bigbox' | 'special';
const baseEnclosureDistribution: Array<[EnclosureClass, number]> = [['compact', 30], ['mini', 22], ['micro', 14], ['standard125', 14], ['wide', 10], ['bigbox', 7], ['special', 3]];
const enclosureCategoryMultiplier: Record<EffectCategory, Record<EnclosureClass, number>> = {
  drive: { compact: 1.35, mini: 1.3, micro: 1.25, standard125: 1.1, wide: .55, bigbox: .7, special: .25 },
  fuzz: { compact: 1.15, mini: 1.05, micro: .75, standard125: 1.25, wide: .7, bigbox: 1.45, special: .55 },
  boost: { compact: 1.25, mini: 1.45, micro: 1.7, standard125: .8, wide: .3, bigbox: .4, special: .12 },
  compressor: { compact: 1.3, mini: 1.25, micro: .95, standard125: 1.05, wide: .5, bigbox: .65, special: .2 },
  modulation: { compact: 1.2, mini: 1.1, micro: .55, standard125: 1.15, wide: .75, bigbox: 1.05, special: .35 },
  phaser: { compact: 1.15, mini: 1, micro: .5, standard125: 1.15, wide: .7, bigbox: 1.2, special: .35 },
  tremolo: { compact: 1.25, mini: 1.15, micro: .75, standard125: 1.05, wide: .55, bigbox: .9, special: .25 },
  delay: { compact: .95, mini: .65, micro: .25, standard125: 1.2, wide: 1.45, bigbox: 1.55, special: 1.1 },
  reverb: { compact: .95, mini: .6, micro: .2, standard125: 1.25, wide: 1.4, bigbox: 1.55, special: 1.05 },
  filter: { compact: 1.05, mini: .9, micro: .5, standard125: 1.15, wide: .95, bigbox: 1.15, special: .55 },
  synth: { compact: .8, mini: .55, micro: .18, standard125: 1.1, wide: 1.5, bigbox: 1.45, special: 1.35 },
};
const specialEnclosures: Record<EffectCategory, Enclosure[]> = {
  drive: ['wedge', 'utility'], fuzz: ['wedge', 'utility'], boost: ['wedge'], compressor: ['utility'], modulation: ['digital', 'utility'],
  phaser: ['utility', 'digital'], tremolo: ['utility'], delay: ['digital', 'utility', 'wedge'], reverb: ['digital', 'utility'], filter: ['utility', 'wedge'], synth: ['digital', 'utility', 'treadle'],
};
const knobCountsByEnclosure: Record<Enclosure, number[]> = {
  nano: [0, 1, 1, 2, 3], micro: [1, 1, 2, 2, 3], mini: [1, 2, 2, 3, 4], compact: [1, 2, 3, 3, 4], standard125: [2, 3, 4, 5, 6], tall: [1, 2, 2, 3],
  wide: [4, 5, 6, 6, 7, 8], bigbox: [3, 4, 5, 6, 7], wedge: [4, 5, 6, 7], treadle: [4, 5, 6], digital: [5, 6, 7, 8], utility: [5, 6, 7, 8],
};
const faceBudgetByEnclosure: Record<Enclosure, number> = {
  nano: 7, micro: 8, mini: 10, compact: 12, standard125: 16, tall: 11, wide: 22, bigbox: 20, wedge: 20, treadle: 18, digital: 28, utility: 26,
};
const motifCatalog: Record<MotifCategory, MotifType[]> = {
  animal: ['cat', 'moth', 'dog', 'rabbit', 'bird', 'fish', 'bear', 'fox'], plant: ['bloom', 'mushroom'], object: ['key', 'radio'], food: ['lemon', 'donut'], 'body-human': ['eye', 'heart'],
  'science-tech': ['circuit', 'meter', 'wave'], 'urban-industrial': ['tower', 'manhole'], abstract: ['spiral', 'drop', 'grid'], 'cute-character': ['ghost', 'blob'],
  'symbol-emblem': ['bolt', 'crown'], celestial: ['moon', 'star', 'planet'], 'music-audio': ['tape', 'speaker'], 'weather-natural': ['cloud', 'flame', 'mountain'], 'fantasy-occult': ['candle', 'mask'],
};
const motifCategoryWeights: Array<[MotifCategory, number]> = [['animal', 24], ['object', 12], ['plant', 9], ['abstract', 9], ['science-tech', 9], ['cute-character', 11], ['urban-industrial', 7], ['music-audio', 7], ['food', 5], ['weather-natural', 5], ['body-human', 4], ['symbol-emblem', 4], ['fantasy-occult', 2], ['celestial', 2]];
const motifLabelByType: Record<MotifType, string> = {
  cat: 'ALLEY CAT', moth: 'NIGHT MOTH', dog: 'STUDIO DOG', rabbit: 'ECHO RABBIT', bird: 'SIGNAL BIRD', fish: 'CHORUS FISH', bear: 'HEAVY BEAR', fox: 'NIGHT FOX', bloom: 'BLOOM', mushroom: 'MUSHROOM', key: 'FOUND KEY', radio: 'POCKET RADIO', lemon: 'LEMON', donut: 'DONUT',
  eye: 'WATCHING EYE', heart: 'HEART', circuit: 'CIRCUIT TRACE', meter: 'LEVEL METER', tower: 'SIGNAL TOWER', manhole: 'CITY COVER', spiral: 'SPIRAL', drop: 'DROP', ghost: 'SMALL GHOST', blob: 'ODD CREATURE',
  bolt: 'BOLT', crown: 'CROWN', moon: 'CRESCENT', star: 'STAR', planet: 'PLANET', tape: 'TAPE LOOP', speaker: 'SPEAKER', wave: 'SIGNAL WAVE', grid: 'SIGNAL GRID', mountain: 'RIDGE',
  cloud: 'CLOUD', flame: 'FLAME', candle: 'CANDLE', mask: 'MASK',
};const controlVocabulary: Record<EffectCategory, string[]> = {
  drive: ['GAIN', 'TONE', 'LEVEL', 'BLEND', 'BASS', 'MID', 'TREBLE', 'PRESENCE', 'BIAS', 'VOICE'],
  fuzz: ['FUZZ', 'TONE', 'VOLUME', 'BIAS', 'GATE', 'BLEND', 'BASS', 'TREBLE', 'TEXTURE', 'LEVEL'],
  boost: ['LEVEL', 'GAIN', 'TONE', 'BASS', 'MID', 'TREBLE', 'FOCUS', 'DRIVE', 'BLEND', 'PRESENCE'],
  compressor: ['SUSTAIN', 'ATTACK', 'LEVEL', 'BLEND', 'RELEASE', 'TONE', 'RATIO', 'THRESHOLD', 'BASS', 'TREBLE'],
  modulation: ['RATE', 'DEPTH', 'MIX', 'TONE', 'WAVE', 'FEEDBACK', 'LEVEL', 'WIDTH', 'PHASE', 'VOICE'],
  phaser: ['RATE', 'DEPTH', 'FEEDBACK', 'MIX', 'STAGES', 'TONE', 'LEVEL', 'RESONANCE', 'WIDTH', 'VOICE'],
  tremolo: ['RATE', 'DEPTH', 'WAVE', 'LEVEL', 'BIAS', 'TONE', 'DUTY', 'RAMP', 'MIX', 'VOICE'],
  delay: ['TIME', 'FEEDBACK', 'MIX', 'TONE', 'MOD', 'REPEATS', 'AGE', 'WIDTH', 'LEVEL', 'FILTER'],
  reverb: ['DECAY', 'MIX', 'TONE', 'PRE-DELAY', 'DWELL', 'MOD', 'SIZE', 'DAMP', 'SHIMMER', 'LEVEL'],
  filter: ['SENS', 'Q', 'RANGE', 'DECAY', 'LEVEL', 'FREQ', 'ATTACK', 'BLEND', 'DRIVE', 'TONE'],
  synth: ['MIX', 'FILTER', 'RESONANCE', 'TONE', 'OCTAVE', 'ATTACK', 'DECAY', 'VOICE', 'LEVEL', 'GLIDE'],
};
const culturesByEnclosure: Record<Enclosure, HardwareCulture[]> = {
  nano: ['MINI BOUTIQUE', 'CLASSIC STOMP'], micro: ['MINI BOUTIQUE', 'CLASSIC STOMP'], mini: ['MINI BOUTIQUE', 'CLASSIC STOMP', 'DIY CUSTOM'], compact: ['CLASSIC STOMP', 'CLASSIC STOMP', 'GRAPHIC BOX'], standard125: ['CLASSIC STOMP', 'GRAPHIC BOX', 'DIY CUSTOM'], tall: ['MINI BOUTIQUE', 'CLASSIC STOMP'],
  wide: ['BIG BOX', 'GRAPHIC BOX', 'LAB UTILITY'], bigbox: ['BIG BOX', 'GRAPHIC BOX', 'CLASSIC STOMP'], wedge: ['DIY CUSTOM'], treadle: ['TREADLE STOMP'], digital: ['DIGITAL MULTI'], utility: ['LAB UTILITY'],
};
const jackWeightsByEnclosure: Record<Enclosure, Array<[JackLayout, number]>> = {
  nano: [['sides', 98], ['top', 2]], micro: [['sides', 96], ['top', 4]], mini: [['sides', 92], ['top', 7], ['hybrid', 1]], compact: [['sides', 90], ['top', 8], ['hybrid', 2]], standard125: [['sides', 88], ['top', 10], ['hybrid', 2]], tall: [['sides', 85], ['top', 13], ['hybrid', 2]],
  wide: [['sides', 65], ['top', 30], ['hybrid', 5]], bigbox: [['sides', 75], ['top', 20], ['hybrid', 5]], wedge: [['sides', 45], ['top', 40], ['hybrid', 15]], treadle: [['sides', 45], ['top', 40], ['hybrid', 15]], digital: [['sides', 45], ['top', 40], ['hybrid', 15]], utility: [['sides', 45], ['top', 40], ['hybrid', 15]],
};
const powerPlacementWeights: Array<[PowerPlacement, number]> = [['top', 82], ['right-near-input', 13], ['top-offset', 5]];
const suffixByCategory: Record<EffectCategory, string[]> = {
  drive: ['DRIVE', 'GAIN'], fuzz: ['FUZZ', 'SCOUR'], boost: ['BOOST', 'LIFT'], compressor: ['PRESS', 'COMP'],
  modulation: ['CHORUS', 'DRIFT'], phaser: ['PHASE', 'ORBIT'], tremolo: ['TREM', 'PULSE'], delay: ['ECHO', 'RELAY'],
  reverb: ['HALL', 'VERB'], filter: ['FILTER', 'SWEEP'], synth: ['SYNTH', 'VECTOR'],
};
const architectureByCategory: Record<EffectCategory, string[]> = {
  drive: ['OVERDRIVE', 'PARALLEL DRIVE', 'AMP PREAMP'], fuzz: ['FUZZ CIRCUIT', 'GATED FUZZ'], boost: ['CLEAN BOOST'], compressor: ['DYNAMIC COMPRESSOR'],
  modulation: ['MODULATION UNIT'], phaser: ['MULTI-STAGE PHASER'], tremolo: ['ANALOG TREMOLO'], delay: ['DIGITAL DELAY', 'TAPE ECHO'],
  reverb: ['AMBIENT REVERB', 'SPACE PROCESSOR'], filter: ['HYBRID FILTER', 'PARAMETRIC FILTER'], synth: ['ORGAN MACHINE', 'PITCH SYNTH'],
};
const groupNamesByCategory: Record<EffectCategory, [string, string]> = {
  drive: ['INPUT / DRIVE', 'EQ / OUTPUT'], fuzz: ['FUZZ ENGINE', 'TONE / OUTPUT'], boost: ['INPUT / GAIN', 'OUTPUT'], compressor: ['DYNAMICS', 'MIX / OUTPUT'],
  modulation: ['RATE / SHAPE', 'MIX / OUTPUT'], phaser: ['SWEEP', 'FEEDBACK / MIX'], tremolo: ['RATE / SHAPE', 'DEPTH / OUTPUT'], delay: ['TIME / REPEATS', 'COLOR / MIX'],
  reverb: ['SPACE / DECAY', 'COLOR / MIX'], filter: ['FILTER', 'RESPONSE / OUTPUT'], synth: ['OSC / PITCH', 'FILTER / OUTPUT'],
};
const controlGroupsFor = (category: EffectCategory, knobs: string[]): ControlGroup[] => {
  if (knobs.length <= 4) return [];
  const split = knobs.length >= 7 ? 4 : Math.ceil(knobs.length / 2);
  const names = groupNamesByCategory[category];
  return [{ name: names[0], controls: knobs.slice(0, split) }, { name: names[1], controls: knobs.slice(split) }];
};
const primaryControlFor = (category: EffectCategory, knobs: string[]) => {
  const preferred: Record<EffectCategory, string[]> = {
    drive: ['GAIN', 'DRIVE'], fuzz: ['FUZZ', 'GAIN'], boost: ['LEVEL', 'GAIN'], compressor: ['SUSTAIN', 'THRESHOLD'], modulation: ['RATE', 'DEPTH'],
    phaser: ['RATE', 'DEPTH'], tremolo: ['RATE', 'DEPTH'], delay: ['TIME', 'FEEDBACK'], reverb: ['DECAY', 'MIX'], filter: ['SENS', 'FILTER', 'Q'], synth: ['FILTER', 'MIX'],
  };
  return preferred[category].find(label => knobs.includes(label)) || knobs[0] || '';
};
const archetypes: DesignArchetype[] = ['MINIMAL LAB', 'VINTAGE STOMP', 'DARK BOUTIQUE', 'PSYCHE FUZZ', 'SPACE SIGNAL', 'JAPANESE INDUSTRIAL', 'SWISS MODERN', 'GARAGE DIY', 'SCIENTIFIC', 'POP OBJECT', 'BARE METAL', 'MYSTIC SYMBOL'];
const archetypeByTone: Record<Choice, DesignArchetype[]> = {
  clarity: ['MINIMAL LAB', 'SWISS MODERN', 'SCIENTIFIC', 'BARE METAL', 'JAPANESE INDUSTRIAL'],
  loud: ['VINTAGE STOMP', 'DARK BOUTIQUE', 'PSYCHE FUZZ', 'GARAGE DIY', 'BARE METAL'],
  broken: ['GARAGE DIY', 'JAPANESE INDUSTRIAL', 'SCIENTIFIC', 'DARK BOUTIQUE', 'MYSTIC SYMBOL'],
  cosmic: ['SPACE SIGNAL', 'MYSTIC SYMBOL', 'DARK BOUTIQUE', 'SWISS MODERN', 'POP OBJECT'],
};
const artByArchetype: Record<DesignArchetype, ArtDirection[]> = {
  'MINIMAL LAB': ['SWISS', 'SCIENTIFIC'], 'VINTAGE STOMP': ['RISOGRAPH', 'MINIMAL SYMBOL'], 'DARK BOUTIQUE': ['MINIMAL SYMBOL', 'INDUSTRIAL'],
  'PSYCHE FUZZ': ['PSYCHEDELIC', 'RISOGRAPH'], 'SPACE SIGNAL': ['SCIENTIFIC', 'ILLUSTRATION'], 'JAPANESE INDUSTRIAL': ['INDUSTRIAL', 'SCIENTIFIC'],
  'SWISS MODERN': ['SWISS'], 'GARAGE DIY': ['BRUTALIST', 'RISOGRAPH'], SCIENTIFIC: ['SCIENTIFIC'], 'POP OBJECT': ['MINIMAL SYMBOL', 'SWISS'],
  'BARE METAL': ['INDUSTRIAL', 'BRUTALIST'], 'MYSTIC SYMBOL': ['MINIMAL SYMBOL', 'ILLUSTRATION'],
};
const namingPatterns: NamingPattern[] = ['SINGLE', 'ADJECTIVE NOUN', 'NOUN PAIR', 'MODEL CODE', 'TECHNICAL', 'JAPANESE', 'PROPER NAME'];
const namingWords = {
  adjective: ['PALE', 'SILENT', 'BROKEN', 'LATE', 'WILD', 'HOLLOW', 'COLD'],
  noun: ['SIGNAL', 'ENGINE', 'HALO', 'GARDEN', 'TEMPLE', 'MACHINE', 'BLOOM'],
  japanese: ['KASUMI', 'YOHAKU', 'YOIN', 'KAGE', 'HIBIKI', 'YURE', 'SHIZUKU', 'KODO', 'UTSURO', 'HAZAMA', 'KASANE', 'TOKI'],
  proper: ['MERROW', 'VELUNE', 'OBRA', 'NOMA', 'TESSEL', 'ORVAN', 'SENKA'],
};
const inputSourceLabels: Record<InputSource, string> = {
  guitar: 'GUITAR', bass: 'BASS', 'synth-keys': 'SYNTH / KEYS', 'drum-sampler': 'DRUM / SAMPLER',
  'acoustic-piezo': 'ACOUSTIC / PIEZO', 'electric-strings': 'ELECTRIC STRINGS', other: 'OTHER',
};
const resolveInputSources = (values: ForgeInput, random: () => number): InputSource[] => {
  if (values.inputSources?.length) return [...new Set(values.inputSources)];
  if (values.instrument && values.instrument !== 'random') return values.instrument === 'both' ? ['guitar', 'bass'] : [values.instrument];
  const primary = weightedPick<InputSource>(random, [['guitar', 32], ['bass', 20], ['synth-keys', 14], ['drum-sampler', 9], ['acoustic-piezo', 10], ['electric-strings', 8], ['other', 7]]);
  if (random() > .18) return [primary];
  const companion = weightedPick<InputSource>(random, [['guitar', 24], ['bass', 18], ['synth-keys', 18], ['drum-sampler', 12], ['acoustic-piezo', 10], ['electric-strings', 10], ['other', 8]]);
  return [...new Set([primary, companion])];
};
const signalProfileFor = (sources: InputSource[]): SignalProfile => {
  const has = (source: InputSource) => sources.includes(source);
  const line = has('synth-keys') || has('drum-sampler'); const piezo = has('acoustic-piezo') || has('electric-strings'); const bass = has('bass');
  const notes = [bass ? 'LOW-END RETENTION' : '', line ? 'LINE-LEVEL HEADROOM' : '', piezo ? 'HIGH-IMPEDANCE INPUT' : '', sources.length > 1 ? 'MULTI-SOURCE BANDWIDTH' : ''].filter(Boolean);
  return { level: piezo ? 'piezo' : line ? 'line-tolerant' : 'instrument', headroom: line || sources.length > 1 ? 'high' : 'standard', frequencyRange: bass ? 'wide-low' : line || piezo ? 'full-range' : 'standard', inputImpedance: piezo ? 'high' : 'standard', stereoPreferred: line, designNotes: notes.length ? notes : ['INSTRUMENT-LEVEL RESPONSE'] };
};
const sourceControlPriority = (sources: InputSource[]) => {
  const priority: string[] = [];
  if (sources.includes('bass')) priority.push('BLEND', 'BASS');
  if (sources.includes('acoustic-piezo') || sources.includes('electric-strings')) priority.push('NOTCH', 'FREQ');
  if (sources.includes('synth-keys')) priority.push('MIX', 'LEVEL');
  if (sources.includes('drum-sampler')) priority.push('MIX', 'TONE');
  return priority;
};
const effectTagFor = (category: EffectCategory) => ({ drive: 'DRIVE', fuzz: 'FUZZ', boost: 'BOOST', compressor: 'COMP', modulation: 'MOD', phaser: 'MOD', tremolo: 'MOD', delay: 'DELAY', reverb: 'REVERB', filter: 'FILTER', synth: 'SYNTH' } as const)[category];
const inputSourceSummary = (sources: InputSource[]) => sources.map(source => inputSourceLabels[source]).join(' + ');
const legacyInstrumentFor = (sources: InputSource[]): Instrument => sources.length === 1 && sources[0] === 'guitar' ? 'guitar' : sources.length === 1 && sources[0] === 'bass' ? 'bass' : 'both';
const namingFamilyWeights: Array<[NamingFamily, number]> = [['english', 35], ['technical', 12], ['numeric-industrial', 8], ['romanized-japanese', 12], ['kanji', 15], ['mixed-japanese-english', 10], ['invented', 8]];
const kanjiFontStack = (style?: KanjiTypographyStyle) => style === 'mincho' ? '"Yu Mincho", "Hiragino Mincho ProN", serif' : style === 'brush' || style === 'handwritten' ? '"Yu Kyokasho", "Klee One", cursive' : style === 'seal' ? '"HGP行書体", "Yu Mincho", serif' : '"Yu Gothic", "Hiragino Kaku Gothic ProN", sans-serif';
const layoutForCount = (count: number): ControlLayout => count <= 2 ? 'minimal2' : count === 3 ? 'classic3' : count === 4 ? 'dual4' : count >= 7 ? 'dense8' : 'dense6';
const seeded = (input: string) => { let h = 2166136261; for (let i = 0; i < input.length; i++) h = Math.imul(h ^ input.charCodeAt(i), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507)) >>> 0) / 4294967296; };
const weightedPick = <T,>(random: () => number, entries: Array<[T, number]>) => { const total = entries.reduce((sum, [, weight]) => sum + weight, 0); let roll = random() * total; for (const [value, weight] of entries) { roll -= weight; if (roll <= 0) return value; } return entries[entries.length - 1][0]; };
const slug = (n: number) => Math.floor(n * 0xffffff).toString(16).toUpperCase().padStart(6, '0');
type ForgeInput = { instrument?: InstrumentChoice; inputSources?: InputSource[]; effectType: EffectTypeChoice; sound: ToneChoice; mood: MoodChoice; colorChoice: FinishChoice; seed: string; brand: BrandProfile };
export function generate(values: ForgeInput, variant = false): Pedal {
  const brand = values.brand;
  const sourceSeed = values.inputSources?.join('+') || values.instrument || 'auto';
  const r = seeded(`${brand.id}|${sourceSeed}|${values.effectType}|${values.sound}|${values.mood}|${values.colorChoice}|${values.seed}`);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const inputSources = resolveInputSources(values, r); const signalProfile = signalProfileFor(inputSources); const instrument = legacyInstrumentFor(inputSources);
  const sound = values.sound === 'random' ? pick<Choice>(['clarity', 'loud', 'broken', 'cosmic']) : values.sound;
  const mood = values.mood === 'random' ? pick<Mood>(['focused', 'restless', 'dreaming', 'feral']) : values.mood;
  const colorChoice = values.colorChoice === 'random' ? pick<ColorChoice>(['acid', 'violet', 'ice', 'ember']) : values.colorChoice;
  const brokenSignalBrief = inputSources.length === 1 && inputSources[0] === 'bass' && values.effectType === 'drive' && sound === 'broken' && colorChoice === 'violet' && mood === 'restless';
  const freedom = ((values.inputSources?.length ? 0 : 1) + [values.effectType, values.sound, values.colorChoice, values.mood].filter(value => value === 'random').length) / 5;
  const rarity = Math.min(5, 1 + Math.floor(r() * r() * 5) + (variant ? 1 : 0));
  const base = pick(labels[sound]);
  const allEffects = Object.values(effectFamilies).flat();
  const type = brokenSignalBrief ? 'PARALLEL DRIVE PREAMP' : values.effectType === 'random' ? pick(freedom > .6 ? allEffects : effectFamilies[sound]) : pick(selectedEffectFamilies[values.effectType]);
  const category = categoryFor(type);
  const ending = pick(suffixByCategory[category]);

  // Product order: enclosure first, then only controls that physically fit it.
  const enclosureWeights = baseEnclosureDistribution.map(([candidate, weight]) => [candidate, weight * enclosureCategoryMultiplier[category][candidate]] as [EnclosureClass, number]);
  const enclosureClass = brokenSignalBrief ? 'wide' : weightedPick(r, enclosureWeights);
  const enclosure: Enclosure = brokenSignalBrief ? 'wide' : enclosureClass === 'special' ? pick(specialEnclosures[category]) : enclosureClass === 'micro' ? pick<Enclosure>(['nano', 'micro']) : enclosureClass;
  const enclosureSize = enclosureDimensions[enclosure];
  const isTiny = ['nano', 'micro', 'mini'].includes(enclosure);
  const templates = controlTemplates[category];
  const bassTemplate = inputSources.includes('bass') ? templates.find(template => template.includes('BLEND')) : undefined;
  const baseControls = [...(bassTemplate && r() > .28 ? bassTemplate : pick(templates))];
  const targetKnobCount = brokenSignalBrief ? 8 : pick(knobCountsByEnclosure[enclosure]);
  const sourceControls = targetKnobCount >= 2 ? sourceControlPriority(inputSources) : [];
  const orderedControls = [...new Set([...sourceControls, ...baseControls, ...controlVocabulary[category]])];
  let knobs = brokenSignalBrief ? ['CLEAN', 'BLEND', 'GAIN', 'LEVEL', 'BASS', 'MID', 'TREBLE', 'PRESENCE'] : orderedControls.slice(0, targetKnobCount);
  const eqEligible = !brokenSignalBrief && !isTiny && !['treadle'].includes(enclosure);
  const eqAffinity = type.includes('BASS PREAMP') ? 3.5 : type.includes('PREAMP') ? 3 : type.includes('EQ') ? 5 : type.includes('UTILITY') ? 2.5 : type.includes('MULTI') ? 2 : category === 'filter' ? 2.5 : category === 'compressor' ? 1.4 : category === 'drive' ? .7 : category === 'fuzz' ? .4 : category === 'synth' ? .8 : category === 'modulation' || category === 'phaser' || category === 'tremolo' ? .5 : category === 'delay' ? .25 : category === 'reverb' ? .15 : category === 'boost' ? .1 : .35;
  const controlLayoutMode: ControlLayoutMode = !eqEligible ? 'knob-only' : weightedPick<ControlLayoutMode>(r, [['knob-only', 90], ['knob-plus-slider-eq', 8 * eqAffinity], ['slider-eq-main', 2 * eqAffinity]]);
  const allowedEqPresets: EqLayoutPreset[] = ['compact', 'standard125', 'tall'].includes(enclosure) ? ['eq-2-band', 'eq-3-band'] : ['wide', 'bigbox', 'wedge'].includes(enclosure) ? ['eq-3-band', 'eq-5-band'] : ['digital', 'utility'].includes(enclosure) ? ['eq-3-band', 'eq-5-band', 'eq-7-band'] : [];
  const eqPresetWeights: Record<EqLayoutPreset, number> = { 'eq-2-band': 12, 'eq-3-band': 58, 'eq-5-band': 24, 'eq-7-band': 4 };
  const eqPreset = controlLayoutMode === 'knob-only' || !allowedEqPresets.length ? undefined : weightedPick<EqLayoutPreset>(r, allowedEqPresets.map(preset => [preset, eqPresetWeights[preset]]));
  const eqLabels: Record<EqLayoutPreset, string[]> = { 'eq-2-band': ['LOW', 'HIGH'], 'eq-3-band': ['BASS', 'MID', 'TREBLE'], 'eq-5-band': inputSources.includes('bass') ? ['50', '120', '400', '1K', '4K'] : ['100', '250', '800', '2K', '4K'], 'eq-7-band': ['63', '125', '250', '500', '1K', '2K', '4K'] };
  const eqSliders: EqSliderSpec[] = eqPreset ? eqLabels[eqPreset].map(label => ({ label, value: Math.round((r() * 1.4 - .7) * 100) / 100 })) : [];
  if (controlLayoutMode === 'knob-plus-slider-eq') knobs = knobs.slice(0, eqPreset === 'eq-3-band' ? 3 : 2);
  if (controlLayoutMode === 'slider-eq-main') knobs = ['wide', 'bigbox', 'digital', 'utility'].includes(enclosure) ? knobs.slice(0, 1) : [];
  const controlLayout = layoutForCount(knobs.length);
  const controlVariants: Record<number, ControlVariant[]> = { 0: ['row'], 1: ['hero'], 2: ['row'], 3: ['row', 'triangle'], 4: ['grid'], 5: ['grid'], 6: ['grid'], 7: ['grid'], 8: ['grid'], 9: ['grid'], 10: ['grid'] };
  const controlVariant = pick(controlVariants[knobs.length] || ['grid']);
  const hardwareCulture = brokenSignalBrief ? 'LAB UTILITY' : pick(culturesByEnclosure[enclosure]);
  const footswitches = (brokenSignalBrief ? 2 : enclosure === 'wide' ? (r() > .45 ? 2 : 1) : enclosure === 'bigbox' ? (r() > .82 ? 2 : 1) : ['wedge', 'digital', 'utility'].includes(enclosure) ? (r() > .55 ? 2 : 1) : 1) as 1 | 2;
  const jackLayout: JackLayout = brokenSignalBrief ? 'sides' : isTiny ? 'sides' : weightedPick(r, jackWeightsByEnclosure[enclosure]);
  const stereoEligible = !isTiny && ['modulation', 'phaser', 'delay', 'reverb', 'synth'].includes(category);
  const ioChannels: 'mono' | 'stereo' = signalProfile.stereoPreferred && stereoEligible && r() < .72 ? 'stereo' : 'mono';
  const requestedPowerPlacement = isTiny ? 'top' : weightedPick(r, powerPlacementWeights);
  const powerPlacement: PowerPlacement = requestedPowerPlacement === 'right-near-input' && jackLayout === 'top' ? 'top' : requestedPowerPlacement;
  const toggleCount = brokenSignalBrief ? 2 : controlLayoutMode !== 'knob-only' || isTiny ? 0 : enclosure === 'wide' && mood === 'restless' ? 2 : ['wide', 'bigbox', 'standard125', 'digital', 'utility'].includes(enclosure) && r() > .72 ? 1 : 0;

  const designArchetype = pick(values.sound === 'random' ? archetypes : archetypeByTone[sound]);
  const artDirection = pick(artByArchetype[designArchetype]);
  const directionOrder: ArtDirection[] = ['SWISS', 'INDUSTRIAL', 'BRUTALIST', 'SCIENTIFIC', 'RISOGRAPH', 'PSYCHEDELIC', 'MINIMAL SYMBOL', 'ILLUSTRATION'];
  const directionIndex = directionOrder.indexOf(artDirection); const artAtlas = (directionIndex < 4 ? 'a' : 'b') as 'a' | 'b'; const artIndex = directionIndex % 4;
  const visualIntensity: VisualIntensity = brokenSignalBrief ? 'expressive' : weightedPick(r, [['calm', 35], ['expressive', 35], ['bold', 20], ['maximal', 10]]);
  const materialStyle = visualIntensity === 'maximal'
    ? weightedPick<MaterialStyle>(r, [['metallic-flake', 28], ['pearl', 22], ['iridescent', 20], ['holographic', 12], ['high-gloss', 10], ['anodized', 8]])
    : weightedPick<MaterialStyle>(r, [['powder', 25], ['matte', 20], ['semi-gloss', 15], ['metallic-flake', 10], ['brushed', 10], ['hammered', 7], ['high-gloss', 5], ['anodized', 5], ['aged', 3]]);
  const knobFamilies: Record<DesignArchetype, KnobStyle[]> = {
    'MINIMAL LAB': ['classic', 'metal'], 'VINTAGE STOMP': ['davies', 'skirt'], 'DARK BOUTIQUE': ['classic', 'skirt', 'metal'], 'PSYCHE FUZZ': ['davies', 'skirt'],
    'SPACE SIGNAL': ['metal', 'classic'], 'JAPANESE INDUSTRIAL': ['davies', 'metal'], 'SWISS MODERN': ['classic', 'metal'], 'GARAGE DIY': ['davies', 'skirt'],
    SCIENTIFIC: ['metal', 'classic'], 'POP OBJECT': ['davies', 'classic'], 'BARE METAL': ['metal'], 'MYSTIC SYMBOL': ['skirt', 'davies'],
  };
  const knobStyle: KnobStyle = r() < .62 ? brand.knobFamily : pick(knobFamilies[designArchetype]);
  const paddleEligible = footswitches === 1 && ['compact', 'standard125', 'tall'].includes(enclosure) && controlLayoutMode === 'knob-only';
  const footswitchStyle: FootswitchStyle = hardwareCulture === 'TREADLE STOMP' ? 'pad' : paddleEligible ? weightedPick<FootswitchStyle>(r, [['metal', 48], ['soft-touch', 17], ['large-lower-paddle', 35]]) : weightedPick<FootswitchStyle>(r, [['metal', 74], ['soft-touch', 26]]);
  const display = (controlLayoutMode !== 'knob-only' || isTiny ? 'none' : hardwareCulture === 'DIGITAL MULTI' ? 'oled' : ((['SPACE SIGNAL', 'SCIENTIFIC'].includes(designArchetype) || sound === 'cosmic') && enclosure !== 'compact' && controlLayout !== 'dense6' && r() > .52 ? pick(['segment', 'oled'] as const) : 'none')) as Pedal['display'];
  const graphicWeights: Array<[GraphicMode, number]> = visualIntensity === 'maximal'
    ? [['FULL ILLUSTRATION', 34], ['TYPOGRAPHY', 28], ['PANEL', 22], ['ONE POINT', 16]]
    : [['ONE POINT', 40], ['PANEL', 20], ['TYPOGRAPHY', 15], ['FULL ILLUSTRATION', 10], ['MINIMAL', 10], ['TECHNICAL', 5]];
  let graphicMode: GraphicMode = brokenSignalBrief ? 'TECHNICAL' : weightedPick(r, graphicWeights);
  if (display !== 'none' && graphicMode === 'FULL ILLUSTRATION') graphicMode = 'PANEL';
  const coverageByGraphic: Record<GraphicMode, ArtCoverage> = { MINIMAL: 'none', TYPOGRAPHY: 'none', 'TYPOGRAPHY LED': 'none', 'ONE POINT': 'symbol', PANEL: 'partial', TECHNICAL: 'none', STICKER: 'mark', ABSTRACT: 'symbol', 'FULL ILLUSTRATION': 'full' };
  let artCoverage: ArtCoverage = brokenSignalBrief ? 'none' : coverageByGraphic[graphicMode];

  const ledCountWeights: Array<[number, number]> = enclosure === 'digital' ? [[1, 55], [0, 8], [2, 25], [3, 12]] : enclosure === 'wide' || enclosure === 'bigbox' ? [[1, 76], [0, 14], [2, 9], [3, 1]] : [[1, 86], [0, 14]];
  let ledCount = weightedPick(r, ledCountWeights); if (!['wide', 'bigbox', 'digital'].includes(enclosure)) ledCount = Math.min(1, ledCount); if (enclosure !== 'digital') ledCount = Math.min(ledCount, footswitches);
  const ledLocation: LedLocation = ledCount === 0 ? 'none' : weightedPick(r, enclosure === 'digital' ? [['upper', 60], ['center', 40]] : [['upper', 72], ['center', 28]]);
  const ledStyle = weightedPick<LedStyle>(r, [['dome', 72], ['lens', 20], ['flat', 8]]);
  const ledColorWeights: Array<[string, number]> = [['#ff3028', 56], ['#f4f4ec', 18], ['#3f7dff', 14], ['#35c96b', 6], ['#ffb229', 4], ['#b467ff', 2]];
  const ledColors = Array.from({ length: ledCount }, () => weightedPick(r, ledColorWeights));
  const extraPort: Pedal['extraPort'] = isTiny ? 'none' : pick<Pedal['extraPort']>(hardwareCulture === 'DIGITAL MULTI' ? ['midi', 'usb'] : hardwareCulture === 'LAB UTILITY' ? ['expression', 'midi', 'none'] : enclosure === 'wide' || enclosure === 'bigbox' ? ['expression', 'midi', 'usb', 'none'] : ['none', 'none', 'none', 'expression']);
  const condition = brokenSignalBrief ? 'FACTORY NEW' : pick<Condition>(hardwareCulture === 'DIY CUSTOM' ? ['DIY MODIFIED', 'STUDIO WORN', 'USED'] : ['FACTORY NEW', 'FACTORY NEW', 'USED', 'STUDIO WORN', 'TOUR WORN']);

  const modelNumber = `${brand.modelPrefix}-${String(1 + Math.floor(r() * 98)).padStart(2, '0')}`;
  const serial = `${modelNumber}-${slug(r()).slice(0, 4)}`;
  const namingFamily = brokenSignalBrief ? 'english' : weightedPick<NamingFamily>(r, namingFamilyWeights);
  const kanjiEntry = namingFamily === 'kanji' || namingFamily === 'mixed-japanese-english' ? selectKanjiTerm(r, effectTagFor(category)) : undefined;
  const kanjiUsage = kanjiEntry ? selectKanjiUsage(r) : undefined; const kanjiStyle = kanjiEntry ? selectKanjiStyle(r) : undefined;
  const productNamingFamily = namingFamily === 'kanji' && kanjiUsage !== 'product-name' ? 'english' : namingFamily;
  const productName = brokenSignalBrief ? 'BROKEN SIGNAL' : createBrandProductName(brand, r, base, ending, modelNumber, productNamingFamily, kanjiEntry?.text);
  const name = `${productName}${variant ? ' // LIMITED' : ''}`;
  const motifCategory = weightedPick(r, motifCategoryWeights);
  const motifType = pick(motifCatalog[motifCategory]); const motifLabel = motifLabelByType[motifType];
  const motifRenderStyle = weightedPick<MotifRenderStyle>(r, motifCategory === 'animal' ? [['line-art', 22], ['silkscreen', 18], ['stamp', 10], ['pictogram', 10], ['hand-drawn', 12], ['silhouette', 10], ['engraved', 4], ['mascot', 10], ['woodcut', 3], ['abstract-mark', 1]] : [['line-art', 20], ['silkscreen', 18], ['stamp', 13], ['pictogram', 12], ['hand-drawn', 10], ['silhouette', 9], ['engraved', 7], ['mascot', 5], ['woodcut', 4], ['abstract-mark', 2]]);
  const motifPlacement = weightedPick<MotifPlacement>(r, [['lower-right', 22], ['lower-left', 18], ['upper-right', 12], ['upper-left', 10], ['above-footswitch', 14], ['between-knobs', 10], ['center-small', 8], ['diagonal-corner', 6]]);
  const motifScale = motifCategory === 'animal' ? weightedPick<MotifScale>(r, [['small', 22], ['medium', 58], ['statement', 20]]) : weightedPick<MotifScale>(r, [['tiny', 12], ['small', 46], ['medium', 35], ['statement', 7]]);
  if ((motifCategory === 'animal' || motifCategory === 'cute-character') && !['ONE POINT', 'PANEL', 'TYPOGRAPHY'].includes(graphicMode)) { graphicMode = visualIntensity === 'maximal' ? 'PANEL' : 'ONE POINT'; artCoverage = graphicMode === 'PANEL' ? 'partial' : 'symbol'; }
  const typography = createTypographyDesign(brand, r, type, graphicMode === 'TYPOGRAPHY' || visualIntensity === 'maximal', knobs.length + eqSliders.length);
  const promoDirection = createPromoDirection(brand, r);
  const brandLabel = brand.manufacturerName; const brandSeries = brand.seriesName; const ownerLabel = '';
  const namingPattern: NamingPattern = namingFamily === 'kanji' || namingFamily === 'romanized-japanese' || namingFamily === 'mixed-japanese-english' ? 'JAPANESE' : namingFamily === 'technical' || namingFamily === 'numeric-industrial' ? 'MODEL CODE' : namingFamily === 'invented' ? 'PROPER NAME' : brand.namingGrammar === 'single_word' ? 'SINGLE' : 'ADJECTIVE NOUN';

  const paletteMode = visualIntensity === 'maximal'
    ? weightedPick<PaletteMode>(r, [['multi-accent', 40], ['full-graphic', 30], ['tritone', 20], ['sticker-mix', 10]])
    : weightedPick<PaletteMode>(r, [['mono', 10], ['duotone', 31], ['tritone', 25], ['multi-accent', 17], ['sticker-mix', 10], ['full-graphic', 7]]);
  const family = paletteFamilies[colorChoice]; const basePalette = pick(family); const secondaryPalette = pick(family.filter(candidate => candidate !== basePalette));
  const lightInk = '#f4f1e6'; const darkInk = '#171a17'; const metal = '#aeb4ad'; const bodyColor = basePalette[1]; const accentColor = basePalette[0];
  const maximalInk = ['#ff2e93', '#c7ff1a', '#33dcff', '#ff8a18', '#a970ff', '#ffe64a'];
  const bodyLightness = new THREE.Color(bodyColor).getHSL({ h: 0, s: 0, l: 0 }).l;
  const graphicColor = paletteMode === 'mono' ? (bodyLightness > .48 ? darkInk : lightInk) : paletteMode === 'duotone' ? accentColor : paletteMode === 'tritone' ? secondaryPalette[0] : paletteMode === 'full-graphic' ? lightInk : accentColor;
  const hardwareColors = visualIntensity === 'maximal' ? [darkInk, ...maximalInk.slice(0, 4), lightInk] : paletteMode === 'mono' ? [darkInk, metal] : paletteMode === 'duotone' ? [darkInk, brand.signatureColor] : paletteMode === 'tritone' ? [darkInk, brand.signatureColor, metal] : [darkInk, brand.signatureColor, secondaryPalette[0], lightInk];
  const accentColors = visualIntensity === 'maximal' ? [accentColor, brand.signatureColor, ...maximalInk] : paletteMode === 'mono' ? [accentColor, brand.signatureColor] : paletteMode === 'duotone' ? [accentColor, brand.signatureColor] : [accentColor, brand.signatureColor, secondaryPalette[0], secondaryPalette[1]];
  const palette: [string, string] = variant ? ['#eef4e8', accentColor] : [accentColor, bodyColor];

  const instrumentLabel = inputSourceSummary(inputSources);
  const selection = (requested: string, resolved: string) => requested === 'random' ? `おまかせ → ${resolved}` : resolved;
  const choiceImpact = [`MAKER ${brand.manufacturerName}`, `INPUT SOURCE ${inputSourceSummary(inputSources)}`, `SIGNAL ${signalProfile.level.toUpperCase()} / ${signalProfile.headroom.toUpperCase()} HEADROOM / ${ioChannels.toUpperCase()}`, `EFFECT ${selection(values.effectType, type)}`, `TONE ${selection(values.sound, sound.toUpperCase())}`, `FINISH ${selection(values.colorChoice, colorChoice.toUpperCase())}`, `MOOD ${selection(values.mood, mood.toUpperCase())}`, `FORM ${enclosureDimensions[enclosure].label}`, `NAME ${namingFamily.toUpperCase()}${kanjiEntry ? ` / ${kanjiEntry.text}` : ''}`, `DESIGN ${graphicMode} / ${typography.mode.toUpperCase()}`, `CONTROL ${controlLayoutMode.toUpperCase()}${eqPreset ? ` / ${eqPreset.toUpperCase()}` : ''}`];
  const sourceArchitecture = signalProfile.level === 'piezo' ? 'HIGH-Z PIEZO FRONT END' : signalProfile.level === 'line-tolerant' ? 'HIGH-HEADROOM LINE PROCESSOR' : inputSources.includes('bass') ? 'LOW-END RETAINING SIGNAL PATH' : '';
  const effectArchitecture = brokenSignalBrief ? 'PARALLEL DRIVE PREAMP' : [sourceArchitecture, pick(architectureByCategory[category])].filter(Boolean).join(' / ');
  const rotaryControlGroups = brokenSignalBrief ? [{ name: 'INPUT / DRIVE', controls: knobs.slice(0, 4) }, { name: '3-BAND EQ', controls: knobs.slice(4) }] : controlGroupsFor(category, knobs);
  const controlGroups = eqSliders.length ? [...rotaryControlGroups, { name: `${eqSliders.length}-BAND GRAPHIC EQ`, controls: eqSliders.map(slider => slider.label) }] : rotaryControlGroups;
  const totalAdjusters = knobs.length + eqSliders.length;
  const controlGroupFrameStyle: GroupFrameStyle | undefined = totalAdjusters < 5 ? undefined : brokenSignalBrief ? 'thin-line' : weightedPick(r, [['thin-line', 18], ['open-frame', 24], ['underline', 20], ['panel', 25], ['bracket', 10], ['printed-box', 3]]);
  const primaryControl = brokenSignalBrief ? 'GAIN' : knobs.length ? primaryControlFor(category, knobs) : eqSliders[Math.floor(eqSliders.length / 2)]?.label || 'BYPASS';
  const footswitchLabels = footswitches === 1 ? ['BYPASS'] : ['BYPASS', category === 'delay' ? 'TAP' : brokenSignalBrief ? 'ALT' : 'BOOST'];
  const toggleLabels = brokenSignalBrief ? ['CLIP', 'VOICE'] : Array.from({ length: toggleCount }, (_, i) => i === 0 ? (category === 'drive' || category === 'fuzz' ? 'CLIP' : 'MODE') : 'VOICE');
  const identityMotif: IdentityMotif = brokenSignalBrief ? 'broken-wave' : 'none';
  const knobCost = isTiny ? 1 : knobs.length >= 7 ? 1.15 : 1.5; const sliderCost = eqSliders.length * .8; const displayCost = display === 'none' ? 0 : 3; const footswitchCost = footswitchStyle === 'large-lower-paddle' ? 4.25 : footswitches * 3; const faceCost = knobs.length * knobCost + sliderCost + toggleCount * .75 + footswitchCost + displayCost;
  const layoutChecks = ['ALIGNED CONTROL GRID', 'CONTROL LABEL CLEARANCE', 'TEXT SAFE ZONES RESERVED', 'FRAME TITLE GAP', 'DEDICATED PRODUCT NAME ZONE', 'FOOTSWITCH TOE CLEARANCE', 'I/O INTERNAL VOLUME RESERVED', `CONTROL MODE ${controlLayoutMode.toUpperCase()}`, `SLIDERS ${eqSliders.length}`, `FACE COST ${faceCost.toFixed(1)} / ${faceBudgetByEnclosure[enclosure]}`];
  if (faceCost > faceBudgetByEnclosure[enclosure]) throw new Error(`Control budget exceeded for ${enclosure}`);
  const designScore = Math.min(98, 86 + (isTiny && knobs.length <= 4 ? 4 : 0) + (graphicMode === 'STICKER' ? 0 : 3) + Math.floor(r() * 5));
  const weight = `${Math.round(120 + enclosureSize.width * enclosureSize.height * 34)} g`;
  return { id: `${brand.id}-${values.seed}-${serial}${variant ? '-LTD' : ''}`, seed: values.seed, owner: '', instrument, inputSources, signalProfile, ioChannels, effectType: values.effectType, sound, mood, colorChoice, name, type, copy: pick(descriptions[sound]), knobs, special: pick(specialsByCategory[category]), rarity, serial, usage: `${instrumentLabel}、${mood === 'dreaming' ? 'アンビエント' : mood === 'feral' ? 'ノイズロック' : 'シューゲイザー'}`, warning: knobs.length ? `${knobs[Math.min(2, knobs.length - 1)]}最大時は原音がほぼ観測不能になります。` : eqSliders.length ? `${eqSliders[Math.floor(eqSliders.length / 2)].label}帯域を最大にすると出力が急激に変化します。` : '固定回路のため、フットスイッチでのみ動作を切り替えます。', bypass: r() > .5 ? 'トゥルーバイパス' : 'バッファードバイパス', power: 'DC 9V センターマイナス / 85mA', dimensions: `${Math.round(enclosureSize.width * 34)} × ${Math.round(enclosureSize.height * 34)} × ${Math.round(enclosureSize.depth * 34)} mm`, weight, palette, paletteMode, graphicColor, hardwareColors, accentColors, variant, enclosure, jackLayout, powerPlacement, controlLayout, footswitches, toggleCount, artIndex, artAtlas, labelMode: 'full', ownerFont: 0, choiceImpact, materialStyle, knobStyle, footswitchStyle, artCoverage, ledStyle, ledCount, ledLocation, ledColors, display, extraPort, brandSeries, artDirection, designScore, designArchetype, controlVariant, titleFont: 0, brandLabel, ownerLabel, namingPattern, hardwareCulture, graphicMode, condition, effectArchitecture, controlGroups, controlGroupFrameStyle, visualIntensity, primaryControl, controlLayoutMode, eqPreset, eqSliders, footswitchLabels, toggleLabels, identityMotif, brand, typography, modelNumber, namingFamily, kanjiTerm: kanjiEntry?.text, kanjiStyle, kanjiUsage, layoutChecks, promoDirection, motifType, motifLabel, motifCategory, motifRenderStyle, motifPlacement, motifScale };
}function roundedEnclosureGeometry(width: number, height: number, depth: number) {
  const radius = Math.min(width, height) * .09; const shape = new THREE.Shape();
  shape.moveTo(-width / 2 + radius, -height / 2); shape.lineTo(width / 2 - radius, -height / 2);
  shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius); shape.lineTo(width / 2, height / 2 - radius);
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2); shape.lineTo(-width / 2 + radius, height / 2);
  shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius); shape.lineTo(-width / 2, -height / 2 + radius);
  shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: .07, bevelSize: .07, bevelSegments: 3 });
  geometry.center(); geometry.rotateX(Math.PI / 2); return geometry;
}
export function knobPositions(count: number, width: number, height: number, variant: ControlVariant = 'grid'): [number, number, number][] {
  const top = -height * .23;
  const rowGap = Math.min(.68, height * .19);
  if (count === 0) return [];
  if (count === 1) return [[0, .62, top]];
  if (count === 2) return [[-width * .25, .62, top], [width * .25, .62, top]];
  if (count === 3 && (variant === 'triangle' || width < 1.75)) return [[-width * .25, .62, top - rowGap * .18], [width * .25, .62, top - rowGap * .18], [0, .62, top + rowGap * .72]];
  if (count === 3) return [[-width * .29, .62, top], [0, .62, top], [width * .29, .62, top]];
  if (count === 4 && width > 3.35 && variant === 'row') return [-.36, -.12, .12, .36].map(x => [width * x, .62, top] as [number, number, number]);
  if (count === 4) return [[-width * .25, .62, top - rowGap * .2], [width * .25, .62, top - rowGap * .2], [-width * .25, .62, top + rowGap * .72], [width * .25, .62, top + rowGap * .72]];
  if (count === 5) return [[-width * .29, .62, top - rowGap * .2], [0, .62, top - rowGap * .2], [width * .29, .62, top - rowGap * .2], [-width * .17, .62, top + rowGap * .72], [width * .17, .62, top + rowGap * .72]];
  if (count === 6) return [0, 1].flatMap(row => [-1, 0, 1].map(column => [column * width * .28, .62, top - rowGap * .2 + row * rowGap] as [number, number, number]));
  const columns = count > 8 ? [-2, -1, 0, 1, 2] : [-1.5, -.5, .5, 1.5]; const spacing = count > 8 ? width * .155 : width * .17; return [0, 1].flatMap(row => columns.map(column => [column * spacing, .62, top - rowGap * .2 + row * rowGap] as [number, number, number])).slice(0, count);
}
function Jack({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return <group position={position} rotation={rotation}>
    <mesh position={[0, -.07, 0]} castShadow><cylinderGeometry args={[.18, .18, .16, 24]} /><meshStandardMaterial color="#171a18" metalness={.28} roughness={.58} /></mesh>
    <mesh position={[0, .018, 0]} castShadow><cylinderGeometry args={[.205, .205, .035, 32]} /><meshStandardMaterial color="#bcc0bb" metalness={.94} roughness={.2} /></mesh>
    <mesh position={[0, .058, 0]} castShadow><cylinderGeometry args={[.174, .174, .075, 6]} /><meshStandardMaterial color="#d4d6d0" metalness={.96} roughness={.16} /></mesh>
    <mesh position={[0, .112, 0]}><cylinderGeometry args={[.142, .142, .105, 32]} /><meshStandardMaterial color="#aeb2ad" metalness={.94} roughness={.2} /></mesh>
    <mesh position={[0, .164, 0]}><cylinderGeometry args={[.119, .124, .052, 32]} /><meshStandardMaterial color="#030403" metalness={.02} roughness={.96} /></mesh>
    <mesh position={[0, .191, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.121, .015, 8, 32]} /><meshStandardMaterial color="#8d938d" metalness={.92} roughness={.24} /></mesh>
  </group>;
}
function DcJack({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return <group position={position} rotation={rotation}>
    <mesh position={[0, -.025, 0]}><cylinderGeometry args={[.155, .155, .09, 28]} /><meshStandardMaterial color="#0b0d0b" metalness={.2} roughness={.7} /></mesh>
    <mesh position={[0, .035, 0]}><cylinderGeometry args={[.135, .135, .055, 28]} /><meshStandardMaterial color="#252925" metalness={.38} roughness={.48} /></mesh>
    <mesh position={[0, .07, 0]}><cylinderGeometry args={[.066, .071, .025, 24]} /><meshStandardMaterial color="#020302" roughness={.9} /></mesh>
    <mesh position={[0, .084, 0]}><cylinderGeometry args={[.016, .016, .026, 12]} /><meshStandardMaterial color="#aeb3ad" metalness={.9} roughness={.2} /></mesh>
  </group>;
}
const ownerFonts = ['Arial Black', 'Georgia', 'Courier New', 'Trebuchet MS', 'Impact', 'Arial Narrow', 'Times New Roman', 'Verdana'];
function textTexture(text: string, font = 'Arial Black', color = '#f4f1e6', outline = true) {
  const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 160; const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; let fontSize = 78;
  do { ctx.font = `900 ${fontSize}px ${font}`; fontSize -= 2; } while (ctx.measureText(text).width > 650 && fontSize > 28);
  if (outline) { ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(0,0,0,.74)'; ctx.strokeText(text, 384, 80); }
  ctx.fillStyle = color; ctx.fillText(text, 384, 80);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4; return texture;
}
function SurfaceText({ text, position, width, font, color = '#f4f1e6', rotation = 0, opacity = 1, outline = true }: { text: string; position: [number, number, number]; width: number; font?: string; color?: string; rotation?: number; opacity?: number; outline?: boolean }) {
  const texture = useMemo(() => textTexture(text, font, color, outline), [text, font, color, outline]); useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]}><planeGeometry args={[width, width / 4.8]} /><meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={false} toneMapped={false} /></mesh>;
}
function ControlGroupFrame({ group, row, style, radius, surfaceY, color, backgroundColor }: { group: ControlGroup; row: [number, number, number][]; style: GroupFrameStyle; radius: number; surfaceY: number; color: string; backgroundColor: string }) {
  if (!row.length) return null;
  const minX = Math.min(...row.map(position => position[0])); const maxX = Math.max(...row.map(position => position[0])); const centerX = (minX + maxX) / 2; const centerZ = row.reduce((sum, position) => sum + position[2], 0) / row.length;
  const width = Math.max(.78, maxX - minX + radius * 2.75); const height = Math.max(.64, radius * 2.7); const edge = style === 'printed-box' ? .036 : .021; const top = centerZ - height / 2; const bottom = centerZ + height / 2; const left = centerX - width / 2; const right = centerX + width / 2;
  const titleWidth = Math.min(width * .42, .78); const titleX = left + Math.min(width * .24, .56); const titleGap = Math.min(width * .58, titleWidth + .14);
  const horizontalAt = (key: string, x: number, z: number, lineWidth: number) => lineWidth > .035 ? <mesh key={key} position={[x, surfaceY, z]}><boxGeometry args={[lineWidth, .009, edge]} /><meshBasicMaterial color={color} transparent opacity={style === 'panel' ? .72 : .92} toneMapped={false} /></mesh> : null;
  const horizontal = (key: string, z: number, lineWidth = width) => horizontalAt(key, centerX, z, lineWidth);
  const vertical = (key: string, x: number, lineHeight = height) => <mesh key={key} position={[x, surfaceY, centerZ]}><boxGeometry args={[edge, .009, lineHeight]} /><meshBasicMaterial color={color} transparent opacity={.9} toneMapped={false} /></mesh>;
  const gapLeft = titleX - titleGap / 2; const gapRight = titleX + titleGap / 2;
  const topWithTitleGap = [horizontalAt('top-left', (left + gapLeft) / 2, top, gapLeft - left), horizontalAt('top-right', (gapRight + right) / 2, top, right - gapRight)];
  const lines = style === 'underline' ? [horizontal('bottom', bottom)] : style === 'open-frame' ? [...topWithTitleGap, vertical('left', left, height * .42), vertical('right', right, height * .42)] : style === 'bracket' ? [vertical('left', left), horizontalAt('top-bracket', left + width * .14, top, width * .28), horizontalAt('bottom-bracket', left + width * .14, bottom, width * .28)] : [...topWithTitleGap, horizontal('bottom', bottom), vertical('left', left), vertical('right', right)];
  return <group>
    {style === 'panel' && <mesh position={[centerX, surfaceY - .008, centerZ]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[width, height]} /><meshBasicMaterial color={color} transparent opacity={.1} depthWrite={false} toneMapped={false} /></mesh>}
    {lines}
    {style === 'printed-box' && horizontal('inner-bottom', bottom - .045, width - .09)}
    <mesh position={[titleX, surfaceY + .004, top]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[titleGap, Math.max(.12, titleWidth / 4.2)]} /><meshBasicMaterial color={backgroundColor} transparent opacity={style === 'panel' ? .84 : .96} depthWrite={false} toneMapped={false} /></mesh>
    <SurfaceText text={group.name} position={[titleX, surfaceY + .018, top]} width={titleWidth} color={color} outline={false} />
  </group>;
}
function MaximalArtwork({ pedal, size, surfaceY }: { pedal: Pedal; size: { width: number; height: number }; surfaceY: number }) {
  const colors = pedal.accentColors?.length ? pedal.accentColors : [pedal.palette[0], '#ff2e93', '#33dcff', '#ffe64a']; const count = Math.min(6, Math.max(4, colors.length)); const stripHeight = size.height * .9 / count; const start = -size.height * .45 + stripHeight / 2;
  return <group>{Array.from({ length: count }, (_, index) => <mesh key={index} position={[0, surfaceY - .026, start + stripHeight * index]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={0}><planeGeometry args={[size.width * .92, stripHeight * 1.025]} /><meshBasicMaterial color={colors[index % colors.length]} transparent opacity={index % 2 ? .72 : .88} depthWrite={false} toneMapped={false} /></mesh>)}

  </group>;
}function TypographyTitle({ pedal, size, surfaceY, controlCount, displayActive, placement }: { pedal: Pedal; size: { width: number; height: number }; surfaceY: number; controlCount: number; displayActive: boolean; placement?: { x: number; z: number; width: number } }) {
  const name = pedal.name.replace(' // LIMITED', '');
  const typography = pedal.typography || { mode: 'standard', displayFontCategory: 'modern_sans', utilityFontCategory: 'sans', productNameScale: .75, letterSpacing: .03, rotation: 0, outline: true, shadow: false } as TypographyDesign;
  const font = pedal.kanjiUsage === 'product-name' ? kanjiFontStack(pedal.kanjiStyle) : displayFontStack(typography.displayFontCategory);
  const dominant = ['type_dominant', 'stacked', 'diagonal', 'vertical', 'repeated', 'oversized_crop'].includes(typography.mode);
  const width = Math.min(size.width * (dominant ? .9 : .72) * typography.productNameScale, dominant ? 3.45 : 2.65);
  const titleZ = displayActive ? size.height * .09 : controlCount <= 2 ? -size.height * .015 : controlCount <= 4 ? size.height * .02 : size.height * .075;
  const common = { font, color: pedal.graphicColor || pedal.palette[0], outline: typography.outline };
  if (placement) return <SurfaceText text={name} position={[placement.x, surfaceY, placement.z]} width={Math.min(placement.width, width)} rotation={0} {...common} />;
  if (typography.mode === 'stacked') {
    const words = name.split(' '); const split = Math.max(1, Math.ceil(words.length / 2)); const rows = words.length > 1 ? [words.slice(0, split).join(' '), words.slice(split).join(' ')] : [name.slice(0, Math.ceil(name.length / 2)), name.slice(Math.ceil(name.length / 2))];
    return <group>{rows.filter(Boolean).map((row, i) => <SurfaceText key={row} text={row} position={[0, surfaceY, titleZ + (i - .5) * Math.min(.24, size.height * .075)]} width={width * .9} {...common} />)}</group>;
  }
  if (typography.mode === 'repeated') return <group>{[-1, 0, 1].map((row, i) => <SurfaceText key={row} text={name} position={[0, surfaceY, titleZ + row * Math.min(.22, size.height * .07)]} width={width} opacity={i === 1 ? .92 : .24} outline={i === 1 && typography.outline} font={font} color={i === 1 ? common.color : pedal.accentColors?.[1] || common.color} />)}</group>;
  return <SurfaceText text={name} position={[0, surfaceY, titleZ]} width={width} rotation={typography.rotation} {...common} />;
}
function KanjiDesignMark({ pedal, size, surfaceY, controlCount }: { pedal: Pedal; size: { width: number; height: number }; surfaceY: number; controlCount: number }) {
  if (!pedal.kanjiTerm || !pedal.kanjiUsage || pedal.kanjiUsage === 'product-name') return null;
  const stampMode = pedal.kanjiUsage === 'stamp' || controlCount >= 5;
  if (stampMode) {
    const side = Math.min(.46, size.width * .2); const x = size.width * .34; const z = size.height * .18;
    return <group><mesh position={[x, surfaceY - .005, z]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[side, side]} /><meshBasicMaterial color="#a72a22" transparent opacity={.9} depthWrite={false} toneMapped={false} /></mesh><SurfaceText text={pedal.kanjiTerm} position={[x, surfaceY + .018, z]} width={side * .78} font={kanjiFontStack(pedal.kanjiStyle)} color="#f8eadc" outline={false} /></group>;
  }
  const width = Math.min(size.width * .38, 1.35); return <SurfaceText text={pedal.kanjiTerm} position={[size.width * .27, surfaceY - .012, size.height * .13]} width={width} font={kanjiFontStack(pedal.kanjiStyle)} color={pedal.accentColors?.[1] || pedal.graphicColor || pedal.palette[0]} opacity={.42} outline={false} />;
}
function KnobControl({ style, radius, color }: { style: KnobStyle; radius: number; color: string }) {
  const isMetal = style === 'metal'; const isSkirt = style === 'skirt' || style === 'dome'; const isDavies = style === 'davies';
  const bodyColor = isMetal ? '#aeb3ad' : color; const height = isSkirt ? .38 : isDavies ? .42 : .46;
  return <group>
    <mesh position={[0, -height / 2 - .047, 0]}><cylinderGeometry args={[radius * 1.13, radius * 1.13, .014, 32]} /><meshStandardMaterial color="#070807" roughness={.96} /></mesh>
    <mesh position={[0, -height / 2 - .018, 0]} castShadow><cylinderGeometry args={[radius * 1.08, radius * 1.08, .035, 32]} /><meshStandardMaterial color="#aeb3ad" metalness={.92} roughness={.22} /></mesh>
    <mesh castShadow><cylinderGeometry args={[isSkirt ? radius * .72 : radius * .88, isSkirt ? radius * 1.08 : radius, height, isMetal ? 36 : isDavies ? 18 : 24]} /><meshStandardMaterial color={bodyColor} metalness={isMetal ? .9 : .28} roughness={isMetal ? .24 : .52} /></mesh>
    <mesh position={[0, height / 2 + .027, 0]} castShadow><cylinderGeometry args={[radius * .72, radius * .78, .055, 28]} /><meshStandardMaterial color={isMetal ? '#c9ccc7' : color} metalness={isMetal ? .92 : .24} roughness={.34} /></mesh>
    <mesh position={[0, -height * .18, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius * .94, .02, 6, isDavies ? 18 : 30]} /><meshStandardMaterial color={isMetal ? '#666c67' : '#111411'} metalness={.72} roughness={.42} /></mesh>
    <mesh position={[0, height / 2 + .064, -radius * .27]}><boxGeometry args={[Math.max(.035, radius * .1), .022, radius * .72]} /><meshStandardMaterial color="#f4f0df" metalness={.08} roughness={.5} /></mesh>
  </group>;
}
function RotaryControlUnit({ position, label, style, baseRadius, isPrimary, color, labelColor, labelWidth, labelSurfaceY, enclosureHeight, showLabel, font, labelPlacement = 'auto' }: { position: [number, number, number]; label: string; style: KnobStyle; baseRadius: number; isPrimary: boolean; color: string; labelColor: string; labelWidth: number; labelSurfaceY: number; enclosureHeight: number; showLabel: boolean; font?: string; labelPlacement?: ControlLabelPlacement }) {
  const radius = baseRadius * (isPrimary ? 1.12 : 1);
  const safeRadius = radius * 1.16;
  const width = Math.min(labelWidth, Math.max(.42, .22 + label.length * .072));
  const labelHeight = width / 4.8;
  const gap = Math.max(.1, radius * .32);
  const below = position[2] + safeRadius + gap + labelHeight / 2;
  const above = position[2] - safeRadius - gap - labelHeight / 2;
  const frontSafeLimit = enclosureHeight / 2 - .2;
  const resolvedPlacement = labelPlacement === 'auto' ? (below + labelHeight / 2 <= frontSafeLimit ? 'below' : 'above') : labelPlacement;
  const labelX = resolvedPlacement === 'left' ? position[0] - safeRadius - gap - width / 2 : resolvedPlacement === 'right' ? position[0] + safeRadius + gap + width / 2 : position[0];
  const labelZ = resolvedPlacement === 'above' ? above : resolvedPlacement === 'below' ? below : position[2];
  return <group>
    <group position={position}><KnobControl style={style} radius={radius} color={color} /></group>
    {showLabel && <SurfaceText text={label} position={[labelX, labelSurfaceY, labelZ]} width={width} color={labelColor} font={font} outline={false} />}
  </group>;
}
function ChassisScrew({ position }: { position: [number, number, number] }) {
  return <group position={position}><mesh castShadow><cylinderGeometry args={[.065, .065, .028, 20]} /><meshStandardMaterial color="#aeb3ad" metalness={.94} roughness={.22} /></mesh><mesh position={[0, .016, 0]}><boxGeometry args={[.085, .012, .012]} /><meshStandardMaterial color="#3b403c" metalness={.72} roughness={.35} /></mesh></group>;
}
function LedLens({ style, color, position, runtimeMode, pulse = false }: { style: LedStyle; color: string; position: [number, number, number]; runtimeMode: RuntimeMode; pulse?: boolean }) {
  const lens = useRef<THREE.MeshPhysicalMaterial>(null!);
  useFrame(({ clock }) => { if (!lens.current) return; const powered = runtimeMode !== 'off'; const beat = runtimeMode === 'play' && pulse ? (Math.sin(clock.elapsedTime * Math.PI * 4) > 0 ? 1 : .08) : 1; lens.current.emissiveIntensity = powered ? .28 + beat * 1.75 : .025; lens.current.opacity = powered ? .94 : .68; });
  return <group position={position}>
    <mesh position={[0, -.012, 0]}><cylinderGeometry args={[.083, .083, .018, 24]} /><meshStandardMaterial color="#090b09" roughness={.94} /></mesh>
    <mesh><cylinderGeometry args={[.071, .071, .032, 24]} /><meshStandardMaterial color={style === 'lens' ? '#888d87' : '#30342f'} metalness={style === 'lens' ? .82 : .28} roughness={.32} /></mesh>
    <mesh position={[0, style === 'flat' ? .025 : .04, 0]}>{style === 'flat' ? <cylinderGeometry args={[.052, .052, .022, 20]} /> : <sphereGeometry args={[style === 'lens' ? .049 : .057, 20, 12]} />}<meshPhysicalMaterial ref={lens} color={color} emissive={color} emissiveIntensity={.025} roughness={.16} transmission={.14} transparent opacity={.68} clearcoat={.3} /></mesh>
  </group>;
}
function FootswitchHardware({ soft }: { soft: boolean }) {
  return <group>
    <mesh position={[0, -.095, 0]}><cylinderGeometry args={[.19, .19, .022, 28]} /><meshStandardMaterial color="#070907" roughness={.94} /></mesh>
    <mesh position={[0, -.066, 0]} castShadow><cylinderGeometry args={[.27, .27, .032, 32]} /><meshStandardMaterial color="#8f948e" metalness={.94} roughness={.24} /></mesh>
    <mesh position={[0, -.025, 0]} castShadow><cylinderGeometry args={[.225, .225, .115, 6]} /><meshStandardMaterial color="#bec2bc" metalness={.96} roughness={.18} /></mesh>
    <mesh position={[0, .055, 0]}><cylinderGeometry args={[.075, .075, .12, 24]} /><meshStandardMaterial color="#aaafaa" metalness={.92} roughness={.22} /></mesh>
    <mesh position={[0, .145, 0]} castShadow><cylinderGeometry args={[soft ? .155 : .135, soft ? .165 : .145, .105, 28]} /><meshStandardMaterial color={soft ? '#d8dad5' : '#c7cac4'} metalness={.9} roughness={.18} /></mesh>
  </group>;
}
function LargePaddleFootswitch({ width, length, active }: { width: number; length: number; active: boolean }) {
  const plate = useRef<THREE.Group>(null!);
  useFrame(() => { if (!plate.current) return; plate.current.position.y = THREE.MathUtils.lerp(plate.current.position.y, active ? .055 : .085, .12); plate.current.rotation.x = THREE.MathUtils.lerp(plate.current.rotation.x, active ? -.025 : .025, .12); });
  return <group>
    <mesh position={[0, .018, 0]} castShadow><boxGeometry args={[width + .08, .07, length + .08]} /><meshStandardMaterial color="#111411" metalness={.66} roughness={.36} /></mesh>
    <mesh position={[0, .052, -length * .43]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.075, .075, width * .86, 24]} /><meshStandardMaterial color="#8e938d" metalness={.92} roughness={.2} /></mesh>
    <group ref={plate} position={[0, .085, 0]} rotation={[.025, 0, 0]}>
      <mesh castShadow><boxGeometry args={[width, .105, length]} /><meshPhysicalMaterial color="#c7cac4" metalness={.9} roughness={.22} clearcoat={.38} clearcoatRoughness={.18} /></mesh>
      <mesh position={[0, .058, length * .04]}><boxGeometry args={[width * .86, .022, length * .72]} /><meshStandardMaterial color="#252a25" roughness={.78} metalness={.12} /></mesh>
      {Array.from({ length: 7 }, (_, index) => <mesh key={index} position={[0, .074, (index - 3) * length * .085]}><boxGeometry args={[width * .72, .014, .026]} /><meshStandardMaterial color="#596059" roughness={.58} metalness={.4} /></mesh>)}
    </group>
  </group>;
}
function SliderEqGroup({ sliders, surfaceY, color, layout }: { sliders: EqSliderSpec[]; surfaceY: number; color: string; layout: { x: number; z: number; width: number; slotLength: number } }) {
  if (!sliders.length) return null;
  const { x: centerX, z: centerZ, width: panelWidth, slotLength } = layout;
  const usableSpan = Math.max(.38, panelWidth - .38);
  const step = sliders.length === 1 ? 0 : usableSpan / (sliders.length - 1);
  const panelHeight = slotLength + .46;
  return <group>
    <mesh position={[centerX, surfaceY + .006, centerZ]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[panelWidth, panelHeight]} /><meshStandardMaterial color="#101410" transparent opacity={.34} roughness={.82} metalness={.08} polygonOffset polygonOffsetFactor={-3} /></mesh>
    <mesh position={[centerX, surfaceY + .018, centerZ - panelHeight / 2 + .035]}><boxGeometry args={[panelWidth * .9, .012, .018]} /><meshBasicMaterial color={color} /></mesh>
    <SurfaceText text={`${sliders.length}-BAND GRAPHIC EQ`} position={[centerX, surfaceY + .028, centerZ - panelHeight / 2 + .105]} width={Math.min(.9, panelWidth * .68)} color={color} outline={false} />
    {sliders.map((slider, index) => { const sliderX = sliders.length === 1 ? centerX : centerX - usableSpan / 2 + index * step; const capZ = centerZ - slider.value * slotLength * .34; return <group key={`${slider.label}-${index}`}>
      <mesh position={[sliderX, surfaceY + .035, centerZ]}><boxGeometry args={[.085, .04, slotLength]} /><meshStandardMaterial color="#070907" metalness={.32} roughness={.72} /></mesh>
      {[-2, -1, 0, 1, 2].map(tick => <group key={tick}><mesh position={[sliderX - .09, surfaceY + .052, centerZ + tick * slotLength * .19]}><boxGeometry args={[tick ? .065 : .1, .012, .012]} /><meshBasicMaterial color={tick === 0 ? color : '#aeb4ad'} /></mesh><mesh position={[sliderX + .09, surfaceY + .052, centerZ + tick * slotLength * .19]}><boxGeometry args={[tick ? .065 : .1, .012, .012]} /><meshBasicMaterial color={tick === 0 ? color : '#aeb4ad'} /></mesh></group>)}
      <mesh position={[sliderX, surfaceY + .105, capZ]} castShadow><boxGeometry args={[.2, .105, .14]} /><meshPhysicalMaterial color="#d1d4ce" metalness={.86} roughness={.2} clearcoat={.42} /></mesh>
      <mesh position={[sliderX, surfaceY + .164, capZ]}><boxGeometry args={[.14, .018, .068]} /><meshStandardMaterial color="#303530" roughness={.62} /></mesh>
      <SurfaceText text={slider.label} position={[sliderX, surfaceY + .028, centerZ + panelHeight / 2 - .095]} width={Math.min(.28, Math.max(.17, step * .68 || .26))} color={color} outline={false} />
    </group>; })}
  </group>;
}
function ToggleSwitch({ position, label, surfaceY, color }: { position: [number, number, number]; label: string; surfaceY: number; color: string }) {
  return <group>
    <group position={position}>
      <mesh position={[0, -.075, 0]}><cylinderGeometry args={[.13, .13, .018, 24]} /><meshStandardMaterial color="#080a08" roughness={.94} /></mesh>
      <mesh position={[0, -.046, 0]}><cylinderGeometry args={[.145, .145, .025, 28]} /><meshStandardMaterial color="#9da19b" metalness={.9} roughness={.28} /></mesh>
      <mesh><cylinderGeometry args={[.112, .118, .075, 6]} /><meshStandardMaterial color="#c2c5be" metalness={.94} roughness={.22} /></mesh>
      <mesh position={[0, .18, 0]} rotation={[0, 0, .34]}><cylinderGeometry args={[.035, .042, .29, 12]} /><meshStandardMaterial color="#d8d8d0" metalness={.88} roughness={.18} /></mesh>
    </group>
    <SurfaceText text={label} position={[position[0], surfaceY, position[2] + .25]} width={.42} color={color} />
  </group>;
}
function RuntimeDisplay({ width, label, color, runtimeMode }: { width: number; label: string; color: string; runtimeMode: RuntimeMode }) {
  const bars = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (!bars.current || runtimeMode !== 'play') return; bars.current.children.forEach((child, i) => { child.scale.y = .28 + Math.abs(Math.sin(clock.elapsedTime * 3.4 + i * .8)) * .72; }); });
  const active = runtimeMode !== 'off';
  return <group>
    <mesh><boxGeometry args={[width + .1, .075, .48]} /><meshStandardMaterial color="#060806" metalness={.55} roughness={.22} /></mesh>
    <mesh position={[0, .048, 0]}><boxGeometry args={[width, .025, .39]} /><meshPhysicalMaterial color="#101a18" roughness={.08} clearcoat={.7} emissive={color} emissiveIntensity={active ? .3 : .01} /></mesh>
    {active && <SurfaceText text={label} position={[0, .072, -.06]} width={width * .78} color={color} />}
    {runtimeMode === 'play' && <group ref={bars} position={[0, .078, .105]}>{Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[(i - 3) * width * .09, 0, 0]}><boxGeometry args={[width * .045, .012, .11]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>)}</group>}
  </group>;
}
function BrokenWaveMark({ position, color }: { position: [number, number, number]; color: string }) {
  const points: [number, number][] = [[-.34, 0], [-.2, 0], [-.1, -.09], [0, .11], [.1, -.06], [.2, 0], [.34, 0]];
  return <group position={position}>{points.slice(0, -1).map(([x, z], i) => { const [x2, z2] = points[i + 1]; const dx = x2 - x; const dz = z2 - z; const length = Math.hypot(dx, dz); return <mesh key={i} position={[(x + x2) / 2, 0, (z + z2) / 2]} rotation={[0, -Math.atan2(dz, dx), 0]}><boxGeometry args={[length, .018, .018]} /><meshBasicMaterial color={color} /></mesh>; })}<mesh position={[0, .008, 0]} rotation={[0, Math.PI / 4, 0]}><boxGeometry args={[.16, .02, .018]} /><meshBasicMaterial color={color} /></mesh></group>;
}
function ExtraPort({ kind, position }: { kind: Pedal['extraPort']; position: [number, number, number] }) {
  if (kind === 'none') return null;
  return <group position={position}>{kind === 'usb' ? <mesh rotation={[-Math.PI / 2, 0, 0]}><boxGeometry args={[.3, .16, .12]} /><meshStandardMaterial color="#252925" metalness={.65} /></mesh> : kind === 'midi' ? <mesh rotation={[-Math.PI / 2, 0, 0]}><cylinderGeometry args={[.16, .16, .12, 18]} /><meshStandardMaterial color="#171917" metalness={.45} /></mesh> : <Jack position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} />} </group>;
}
function XlrPort({ position }: { position: [number, number, number] }) {
  return <group position={position} rotation={[0, 0, -Math.PI / 2]}>
    <mesh><cylinderGeometry args={[.29, .29, .08, 32]} /><meshStandardMaterial color="#111411" metalness={.42} roughness={.58} /></mesh>
    <mesh position={[0, .045, 0]}><cylinderGeometry args={[.22, .22, .035, 32]} /><meshStandardMaterial color="#2c302c" metalness={.66} roughness={.34} /></mesh>
    {([[-.08, .03], [.08, .03], [0, -.09]] as [number, number][]).map(([x, z], i) => <mesh key={i} position={[x, .07, z]}><cylinderGeometry args={[.025, .025, .025, 12]} /><meshStandardMaterial color="#c8cbc4" metalness={.94} roughness={.18} /></mesh>)}
  </group>;
}
function WearMarks({ size, condition, surfaceY }: { size: { width: number; height: number }; condition: Condition; surfaceY: number }) {
  if (condition === 'FACTORY NEW') return null;
  const count = condition === 'USED' ? 3 : condition === 'STUDIO WORN' ? 5 : 8;
  return <group>{Array.from({ length: count }, (_, i) => {
    const x = ((i * 37) % 100 / 100 - .5) * size.width * .82; const z = ((i * 61 + 13) % 100 / 100 - .5) * size.height * .8;
    return <mesh key={i} position={[x, surfaceY + .018, z]} rotation={[-Math.PI / 2, 0, i * .43]}><planeGeometry args={[.1 + i % 3 * .055, .018 + i % 2 * .012]} /><meshBasicMaterial color={i % 2 ? '#c4b494' : '#22251f'} transparent opacity={.48} /></mesh>;
  })}</group>;
}
function motifTexture(type: MotifType, color: string, style: MotifRenderStyle) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512; const ctx = canvas.getContext('2d')!; ctx.clearRect(0, 0, 512, 512);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = style === 'engraved' ? 9 : style === 'woodcut' ? 25 : style === 'hand-drawn' ? 14 : 18; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (style === 'stamp') ctx.setLineDash([38, 13]); if (style === 'silhouette') ctx.lineWidth = 30; if (style === 'mascot') ctx.lineWidth = 24;
  const circle = (x: number, y: number, radius: number, fill = false) => { ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); fill ? ctx.fill() : ctx.stroke(); };
  const poly = (points: number[][], close = false, fill = false) => { ctx.beginPath(); points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); if (close) ctx.closePath(); fill ? ctx.fill() : ctx.stroke(); };
  switch (type) {
    case 'cat': circle(256, 270, 116); poly([[162, 198], [172, 92], [226, 166]], true); poly([[286, 166], [340, 92], [350, 198]], true); circle(218, 262, 12, true); circle(294, 262, 12, true); poly([[256, 278], [240, 298], [272, 298]], true); break;
    case 'moth': ctx.beginPath(); ctx.moveTo(250, 140); ctx.bezierCurveTo(114, 92, 70, 246, 212, 286); ctx.bezierCurveTo(105, 306, 126, 418, 250, 326); ctx.moveTo(262, 140); ctx.bezierCurveTo(398, 92, 442, 246, 300, 286); ctx.bezierCurveTo(407, 306, 386, 418, 262, 326); ctx.stroke(); ctx.fillRect(246, 142, 20, 188); break;
    case 'dog': circle(256, 272, 112); ctx.beginPath(); ctx.ellipse(150, 218, 54, 94, -.28, 0, Math.PI * 2); ctx.ellipse(362, 218, 54, 94, .28, 0, Math.PI * 2); ctx.stroke(); circle(220, 258, 11, true); circle(292, 258, 11, true); circle(256, 304, 18, true); poly([[224, 334], [256, 354], [288, 334]]); break;
    case 'rabbit': circle(256, 286, 104); ctx.beginPath(); ctx.ellipse(206, 118, 42, 116, -.12, 0, Math.PI * 2); ctx.ellipse(306, 118, 42, 116, .12, 0, Math.PI * 2); ctx.stroke(); circle(220, 278, 10, true); circle(292, 278, 10, true); poly([[256, 296], [244, 312], [268, 312]], true); break;
    case 'bird': ctx.beginPath(); ctx.ellipse(246, 276, 132, 94, -.12, 0, Math.PI * 2); ctx.stroke(); poly([[362, 242], [438, 278], [356, 302]], true); ctx.beginPath(); ctx.ellipse(228, 278, 70, 42, -.35, 0, Math.PI * 2); ctx.stroke(); circle(294, 244, 10, true); poly([[126, 310], [78, 372], [166, 334]]); break;
    case 'fish': ctx.beginPath(); ctx.ellipse(238, 266, 142, 84, 0, 0, Math.PI * 2); ctx.stroke(); poly([[370, 266], [452, 186], [452, 346]], true); circle(172, 244, 11, true); ctx.beginPath(); ctx.arc(238, 266, 52, -.8, .8); ctx.stroke(); break;
    case 'bear': circle(256, 280, 120); circle(164, 174, 48); circle(348, 174, 48); circle(218, 270, 11, true); circle(294, 270, 11, true); ctx.beginPath(); ctx.ellipse(256, 324, 48, 36, 0, 0, Math.PI * 2); ctx.stroke(); circle(256, 312, 15, true); break;
    case 'fox': poly([[256, 402], [116, 208], [160, 84], [242, 176], [270, 176], [352, 84], [396, 208]], true); circle(212, 248, 11, true); circle(300, 248, 11, true); poly([[256, 286], [240, 306], [272, 306]], true); poly([[162, 338], [246, 352]]); poly([[350, 338], [266, 352]]); break;
    case 'bloom': for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; ctx.beginPath(); ctx.ellipse(256 + Math.cos(a) * 82, 256 + Math.sin(a) * 82, 62, 34, a, 0, Math.PI * 2); ctx.stroke(); } circle(256, 256, 38, true); break;
    case 'mushroom': ctx.beginPath(); ctx.arc(256, 244, 134, Math.PI, 0); ctx.lineTo(390, 258); ctx.lineTo(122, 258); ctx.closePath(); ctx.stroke(); poly([[220, 258], [202, 400], [310, 400], [292, 258]], true); break;
    case 'key': circle(176, 214, 72); poly([[228, 264], [386, 422], [430, 378], [390, 338], [356, 370], [324, 338]], false); break;
    case 'radio': ctx.strokeRect(96, 168, 320, 226); poly([[126, 152], [376, 82]], false); circle(190, 286, 72); circle(346, 236, 18); circle(346, 306, 18); break;
    case 'lemon': ctx.beginPath(); ctx.ellipse(252, 274, 136, 92, -.35, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(362, 150, 68, 30, -.58, 0, Math.PI * 2); ctx.stroke(); break;
    case 'donut': circle(256, 256, 142); circle(256, 256, 54); for (let i = 0; i < 7; i++) poly([[170 + i * 28, 184 + (i % 2) * 120], [192 + i * 26, 202 + (i % 2) * 118]]); break;
    case 'eye': ctx.beginPath(); ctx.moveTo(78, 258); ctx.quadraticCurveTo(256, 82, 434, 258); ctx.quadraticCurveTo(256, 430, 78, 258); ctx.stroke(); circle(256, 258, 68); circle(256, 258, 26, true); break;
    case 'heart': ctx.beginPath(); ctx.moveTo(256, 420); ctx.bezierCurveTo(214, 354, 92, 286, 120, 172); ctx.bezierCurveTo(146, 72, 240, 124, 256, 190); ctx.bezierCurveTo(276, 124, 366, 72, 394, 172); ctx.bezierCurveTo(420, 286, 298, 354, 256, 420); ctx.stroke(); break;
    case 'circuit': poly([[82, 126], [190, 126], [190, 230], [320, 230], [320, 128], [430, 128]]); poly([[82, 384], [210, 384], [210, 286], [340, 286], [340, 384], [430, 384]]); [82, 190, 320, 430].forEach((x, i) => circle(x, i % 2 ? 230 : 126, 18, true)); break;
    case 'meter': ctx.beginPath(); ctx.arc(256, 320, 156, Math.PI, 0); ctx.stroke(); poly([[256, 320], [346, 190]]); for (let i = 0; i < 7; i++) { const a = Math.PI + i * Math.PI / 6; poly([[256 + Math.cos(a) * 130, 320 + Math.sin(a) * 130], [256 + Math.cos(a) * 156, 320 + Math.sin(a) * 156]]); } break;
    case 'tower': poly([[256, 72], [170, 426], [342, 426], [256, 72]]); [160, 238, 316].forEach(y => poly([[198, y], [314, y]])); poly([[256, 104], [132, 180], [380, 180]], false); break;
    case 'manhole': circle(256, 256, 154); circle(256, 256, 122); for (let i = -2; i <= 2; i++) { poly([[150, 256 + i * 34], [362, 256 + i * 34]]); poly([[256 + i * 34, 150], [256 + i * 34, 362]]); } break;
    case 'spiral': ctx.beginPath(); for (let i = 0; i < 180; i++) { const a = i * .16; const radius = i * .72; const x = 256 + Math.cos(a) * radius; const y = 256 + Math.sin(a) * radius; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); break;
    case 'drop': ctx.beginPath(); ctx.moveTo(256, 76); ctx.bezierCurveTo(210, 168, 134, 244, 140, 328); ctx.bezierCurveTo(148, 438, 364, 438, 372, 328); ctx.bezierCurveTo(378, 244, 302, 168, 256, 76); ctx.stroke(); break;
    case 'ghost': ctx.beginPath(); ctx.moveTo(142, 404); ctx.lineTo(142, 236); ctx.bezierCurveTo(142, 92, 370, 92, 370, 236); ctx.lineTo(370, 404); ctx.lineTo(322, 360); ctx.lineTo(274, 404); ctx.lineTo(226, 360); ctx.lineTo(178, 404); ctx.closePath(); ctx.stroke(); circle(216, 240, 15, true); circle(296, 240, 15, true); break;
    case 'blob': ctx.beginPath(); ctx.bezierCurveTo(118, 154, 220, 76, 310, 122); ctx.bezierCurveTo(430, 184, 402, 348, 316, 402); ctx.bezierCurveTo(206, 456, 90, 372, 112, 260); ctx.closePath(); ctx.stroke(); circle(222, 254, 14, true); circle(304, 236, 14, true); break;
    case 'bolt': poly([[292, 72], [150, 278], [248, 278], [212, 440], [370, 220], [270, 220]], true, true); break;
    case 'crown': poly([[104, 360], [82, 148], [192, 248], [256, 98], [320, 248], [430, 148], [408, 360]], true); poly([[112, 398], [400, 398]]); break;
    case 'moon': ctx.beginPath(); ctx.arc(252, 256, 132, .62, Math.PI * 1.62); ctx.arc(294, 256, 102, Math.PI * 1.58, .66, true); ctx.stroke(); break;
    case 'star': ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const radius = i % 2 ? 58 : 146; const x = 256 + Math.cos(a) * radius; const y = 256 + Math.sin(a) * radius; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.stroke(); break;
    case 'planet': circle(256, 256, 94); ctx.beginPath(); ctx.ellipse(256, 256, 194, 58, -.22, 0, Math.PI * 2); ctx.stroke(); break;
    case 'tape': circle(166, 244, 70); circle(346, 244, 70); poly([[166, 174], [346, 174]]); poly([[166, 314], [346, 314]]); break;
    case 'speaker': ctx.strokeRect(142, 82, 228, 348); circle(256, 300, 94); circle(256, 156, 36); break;
    case 'wave': ctx.beginPath(); ctx.moveTo(72, 278); ctx.bezierCurveTo(132, 120, 190, 410, 256, 252); ctx.bezierCurveTo(322, 92, 380, 385, 440, 228); ctx.stroke(); break;
    case 'grid': for (let i = 0; i < 5; i++) { poly([[106 + i * 74, 106], [106 + i * 74, 406]]); poly([[106, 106 + i * 74], [406, 106 + i * 74]]); } break;
    case 'mountain': poly([[72, 372], [196, 172], [258, 266], [326, 132], [444, 372]], true); break;
    case 'cloud': ctx.beginPath(); ctx.moveTo(112, 330); ctx.bezierCurveTo(62, 260, 124, 190, 198, 214); ctx.bezierCurveTo(214, 112, 356, 126, 366, 224); ctx.bezierCurveTo(456, 230, 464, 340, 376, 348); ctx.lineTo(138, 348); ctx.stroke(); break;
    case 'flame': ctx.beginPath(); ctx.moveTo(262, 70); ctx.bezierCurveTo(316, 166, 420, 222, 370, 338); ctx.bezierCurveTo(320, 454, 154, 426, 138, 318); ctx.bezierCurveTo(126, 230, 220, 198, 218, 112); ctx.bezierCurveTo(258, 156, 278, 210, 252, 260); ctx.bezierCurveTo(330, 214, 304, 126, 262, 70); ctx.stroke(); break;
    case 'candle': ctx.strokeRect(188, 214, 136, 218); poly([[256, 214], [256, 176]]); ctx.beginPath(); ctx.moveTo(256, 170); ctx.bezierCurveTo(212, 128, 252, 78, 274, 112); ctx.bezierCurveTo(302, 150, 278, 176, 256, 170); ctx.stroke(); break;
    case 'mask': ctx.beginPath(); ctx.moveTo(112, 146); ctx.quadraticCurveTo(256, 92, 400, 146); ctx.lineTo(372, 340); ctx.quadraticCurveTo(256, 438, 140, 340); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(202, 244, 46, 22, -.16, 0, Math.PI * 2); ctx.ellipse(310, 244, 46, 22, .16, 0, Math.PI * 2); ctx.stroke(); break;
  }
  if (style === 'hand-drawn') { ctx.globalAlpha = .32; ctx.translate(5, -3); ctx.stroke(); }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4; return texture;
}
function MotifMark({ type, position, width, color, style, rotation = 0 }: { type: MotifType; position: [number, number, number]; width: number; color: string; style: MotifRenderStyle; rotation?: number }) {
  const texture = useMemo(() => motifTexture(type, color, style), [type, color, style]); useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]} renderOrder={2}><planeGeometry args={[width, width]} /><meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} /></mesh>;
}
function GraphicAccent({ mode, size, surfaceY, color, artIndex, motifType, renderStyle, placement, scale }: { mode: GraphicMode; size: { width: number; height: number }; surfaceY: number; color: string; artIndex: number; motifType: MotifType; renderStyle: MotifRenderStyle; placement: MotifPlacement; scale: MotifScale }) {
  const positions: Record<MotifPlacement, [number, number]> = {
    'lower-right': [size.width * .29, size.height * .16], 'lower-left': [-size.width * .29, size.height * .16], 'upper-right': [size.width * .3, -size.height * .14], 'upper-left': [-size.width * .3, -size.height * .14],
    'center-small': [0, size.height * .08], 'above-footswitch': [0, size.height * .2], 'between-knobs': [0, -size.height * .02], 'diagonal-corner': [size.width * (artIndex % 2 ? .3 : -.3), size.height * .17],
  };
  const scaleFactor: Record<MotifScale, number> = { tiny: .65, small: .86, medium: 1.08, statement: 1.34 }; const [motifX, motifZ] = positions[placement]; const motifWidth = Math.min(size.width * .28, size.height * .2) * scaleFactor[scale]; const motifRotation = placement === 'diagonal-corner' ? (artIndex % 2 ? .18 : -.18) : 0;
  if (mode === 'ONE POINT') return <MotifMark type={motifType} position={[motifX, surfaceY + .022, motifZ]} width={motifWidth} color={color} style={renderStyle} rotation={motifRotation} />;
  if (mode === 'PANEL') return <group position={[0, surfaceY + .012, 0]}>
    <mesh position={[-size.width * .31, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[size.width * .22, size.height * .9]} /><meshStandardMaterial color={color} roughness={.74} metalness={.03} polygonOffset polygonOffsetFactor={-2} /></mesh>
    <mesh position={[-size.width * .19, .002, 0]}><boxGeometry args={[.018, .012, size.height * .84]} /><meshBasicMaterial color="#f1eee3" /></mesh>
    <MotifMark type={motifType} position={[-size.width * .31, .014, size.height * .08]} width={Math.min(size.width * .16, size.height * .14) * scaleFactor[scale]} color="#f1eee3" style={renderStyle} />
  </group>;
  if (mode === 'TYPOGRAPHY') return <MotifMark type={motifType} position={[motifX, surfaceY + .022, motifZ]} width={motifWidth * .82} color={color} style={renderStyle} rotation={motifRotation} />;
  if (mode === 'STICKER') return <group position={[-size.width * .24, surfaceY + .02, size.height * .15]} rotation={[0, -.28, 0]}><mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[Math.min(.72, size.width * .55), .3]} /><meshPhysicalMaterial color="#ece7d7" roughness={.5} clearcoat={.18} /></mesh><SurfaceText text={'QC / 0' + (artIndex + 1)} position={[0, .018, 0]} width={Math.min(.58, size.width * .44)} color="#20231f" outline={false} /></group>;
  if (mode === 'TECHNICAL') return <group position={[0, surfaceY + .018, size.height * .16]}>{[-1, 0, 1].map(i => <mesh key={i} position={[0, 0, i * .08]}><boxGeometry args={[size.width * (.34 + i * .04), .012, .012]} /><meshBasicMaterial color={color} /></mesh>)}</group>;
  if (mode === 'ABSTRACT') return <BrokenWaveMark position={[size.width * .22, surfaceY + .02, size.height * .16]} color={color} />;
  return null;
}

function loadGraphicImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error('IMAGE_DECODE_FAILED')); image.src = url; });
}
function drawImageCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight); const dw = image.naturalWidth * scale; const dh = image.naturalHeight * scale;
  ctx.drawImage(image, (width - dw) / 2, (height - dh) / 2, dw, dh);
}
function resolvedGraphicStyle(graphic: UserGraphic) {
  if (graphic.usageMode === 'preserve') return 'preserve';
  if (graphic.transformStyle !== 'auto') return graphic.transformStyle;
  const choices: Exclude<GraphicTransformStyle, 'auto'>[] = ['silkscreen', 'risograph', 'halftone', 'poster', 'sticker', 'abstract'];
  const random = seeded(graphic.fileName + '|' + graphic.width + 'x' + graphic.height + '|' + graphic.variant);
  return choices[Math.floor(random() * choices.length)];
}
async function renderGraphicTexture(graphic: UserGraphic, palette: [string, string]) {
  const image = await loadGraphicImage(graphic.sourceUrl); const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 768; const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const style = graphic.usageMode === 'auto' ? resolvedGraphicStyle({ ...graphic, usageMode: 'transform' }) : resolvedGraphicStyle(graphic); const strength = graphic.transformStrength === 'low' ? .7 : graphic.transformStrength === 'high' ? 1.35 : 1;
  ctx.clearRect(0, 0, 768, 768);
  if (style === 'sticker') {
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.34)'; ctx.shadowBlur = 22; ctx.fillStyle = '#f4f1e8'; ctx.beginPath(); ctx.roundRect(44, 44, 680, 680, 72); ctx.fill(); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.roundRect(64, 64, 640, 640, 54); ctx.clip(); drawImageCover(ctx, image, 768, 768); ctx.restore();
  } else {
    ctx.save();
    if (style === 'risograph') ctx.filter = `contrast(${1.3 * strength}) saturate(${1.55 * strength})`;
    else if (style === 'halftone') ctx.filter = `grayscale(1) contrast(${1.55 * strength})`;
    else if (style === 'poster') ctx.filter = `contrast(${1.45 * strength}) saturate(${1.35 * strength})`;
    else if (style === 'abstract') ctx.filter = `blur(${8 * strength}px) saturate(${1.8 * strength}) contrast(1.2)`;
    else ctx.filter = graphic.usageMode === 'preserve' ? 'contrast(1.03)' : `contrast(${1.65 * strength}) grayscale(.25)`;
    drawImageCover(ctx, image, 768, 768); ctx.restore();
  }
  if (style === 'silkscreen') {
    const data = ctx.getImageData(0, 0, 768, 768); const accent = new THREE.Color(palette[0]);
    for (let i = 0; i < data.data.length; i += 4) { const light = (data.data[i] * .299 + data.data[i + 1] * .587 + data.data[i + 2] * .114) / 255; data.data[i] = accent.r * 255; data.data[i + 1] = accent.g * 255; data.data[i + 2] = accent.b * 255; data.data[i + 3] = light > .5 ? Math.min(255, (light - .35) * 510) : 0; } ctx.putImageData(data, 0, 0);
  }
  if (style === 'poster' || graphic.colorBehavior === 'duotone' || graphic.colorBehavior === 'monochrome' || graphic.colorBehavior === 'pedal-match') {
    const data = ctx.getImageData(0, 0, 768, 768); const accent = new THREE.Color(palette[0]); const body = new THREE.Color(palette[1]);
    for (let i = 0; i < data.data.length; i += 4) { const light = (data.data[i] * .299 + data.data[i + 1] * .587 + data.data[i + 2] * .114) / 255; if (graphic.colorBehavior === 'monochrome') data.data[i] = data.data[i + 1] = data.data[i + 2] = light * 255; else if (graphic.colorBehavior !== 'preserve') { const mix = light > .52 ? accent : body; data.data[i] = mix.r * 255; data.data[i + 1] = mix.g * 255; data.data[i + 2] = mix.b * 255; } else if (style === 'poster') { data.data[i] = Math.round(data.data[i] / 64) * 64; data.data[i + 1] = Math.round(data.data[i + 1] / 64) * 64; data.data[i + 2] = Math.round(data.data[i + 2] / 64) * 64; } } ctx.putImageData(data, 0, 0);
  }
  if (style === 'risograph') { ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .22; ctx.fillStyle = palette[0]; ctx.fillRect(8, 0, 760, 768); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
  if (style === 'halftone') { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = palette[0]; for (let y = 6; y < 768; y += 13) for (let x = 6; x < 768; x += 13) { ctx.beginPath(); ctx.arc(x, y, 2.3 * strength, 0, Math.PI * 2); ctx.fill(); } ctx.globalCompositeOperation = 'source-over'; }
  if (style === 'abstract') { ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .36; for (let i = 0; i < 9; i++) { ctx.fillStyle = i % 2 ? palette[0] : '#f2efe5'; ctx.fillRect((i * 137) % 768, (i * 223) % 768, 120 + i * 9, 42 + i * 7); } ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
  return canvas.toDataURL('image/png');
}
function resolvedGraphicPlacement(graphic: UserGraphic, knobCount: number): Exclude<GraphicPlacementMode, 'auto'> {
  if (graphic.placementMode !== 'auto') return graphic.placementMode;
  if (knobCount >= 5) return graphic.usageMode === 'preserve' ? 'sticker' : 'one-point';
  if (knobCount <= 2) return graphic.usageMode === 'preserve' ? 'panel' : 'full';
  return graphic.usageMode === 'transform' ? 'panel' : 'one-point';
}
function UserGraphicPlane({ graphic, size, surfaceY, knobCount }: { graphic: UserGraphic; size: { width: number; height: number }; surfaceY: number; knobCount: number }) {
  const texture = useMemo(() => { const result = new THREE.TextureLoader().load(graphic.textureUrl); result.colorSpace = THREE.SRGBColorSpace; result.anisotropy = 4; return result; }, [graphic.textureUrl]);
  useEffect(() => () => texture.dispose(), [texture]);
  const placement = resolvedGraphicPlacement(graphic, knobCount); const ratio = Math.max(.5, Math.min(2, graphic.width / graphic.height)); let width = size.width * .34; let height = width / ratio; let x = size.width * .25; let z = size.height * .08; let rotation = -.12;
  if (placement === 'sticker') { width = size.width * .32; height = Math.min(size.height * .3, width / ratio); x = -size.width * .25; z = size.height * .13; rotation = .16; }
  if (placement === 'panel') { width = size.width * .72; height = Math.min(size.height * .48, width / ratio); x = 0; z = -size.height * .02; rotation = 0; }
  if (placement === 'full') { width = size.width * .92; height = size.height * .9; x = 0; z = 0; rotation = 0; }
  return <mesh position={[x, surfaceY + .012, z]} rotation={[-Math.PI / 2, 0, rotation]} renderOrder={1}><planeGeometry args={[width, height]} /><meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} polygonOffset polygonOffsetFactor={-1} /></mesh>;
}
const markFonts: Record<PedalMark['font'], string> = {
  'gothic-jp': '"Yu Gothic", "Hiragino Kaku Gothic ProN", sans-serif', 'mincho-jp': '"Yu Mincho", "Hiragino Mincho ProN", serif', 'maru-jp': '"Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif',
  'handwritten-jp': '"Yu Kyokasho", "Klee One", cursive', mono: '"Courier New", "Yu Gothic", monospace', stencil: 'Impact, "Yu Gothic", sans-serif',
};
function markTexture(mark: PedalMark) {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 260; const ctx = canvas.getContext('2d')!; ctx.clearRect(0, 0, 1024, 260); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 132px ${markFonts[mark.font]}`;
  if (mark.style === 'decal') { ctx.lineWidth = 24; ctx.strokeStyle = '#f4f1e8'; ctx.strokeText(mark.text, 512, 130); }
  if (mark.style === 'engraved' || mark.style === 'etched') { ctx.lineWidth = mark.style === 'etched' ? 5 : 10; ctx.strokeStyle = 'rgba(245,245,235,.32)'; ctx.strokeText(mark.text, 512, 126); ctx.fillStyle = '#171a17'; ctx.fillText(mark.text, 512, 135); }
  else { ctx.fillStyle = mark.color; ctx.globalAlpha = mark.style === 'stamp' ? .82 : 1; ctx.fillText(mark.text, 512, 130); }
  if (mark.style === 'stamp') { ctx.globalCompositeOperation = 'destination-out'; const random = seeded(mark.text); for (let i = 0; i < 38; i++) ctx.fillRect(random() * 900 + 60, random() * 180 + 40, 8 + random() * 24, 2 + random() * 7); }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4; return texture;
}
function SignatureMark({ mark, size, surfaceY }: { mark: PedalMark; size: { width: number; height: number; depth: number }; surfaceY: number }) {
  const texture = useMemo(() => markTexture(mark), [mark]); useEffect(() => () => texture.dispose(), [texture]); if (!mark.enabled || !mark.text.trim()) return null;
  const topWidth = size.width * mark.size; const sideWidth = size.height * mark.size; const x = (mark.u - .5) * size.width * .82; const z = (mark.v - .5) * size.height * .82;
  const material = <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />;
  if (mark.surface === 'back') return <mesh position={[x, -size.depth / 2 - .018, z]} rotation={[Math.PI / 2, 0, THREE.MathUtils.degToRad(mark.rotation)]} renderOrder={4}><planeGeometry args={[topWidth, Math.max(.14, topWidth / 4.2)]} />{material}</mesh>;
  if (mark.surface === 'left-side' || mark.surface === 'right-side') {
    const right = mark.surface === 'right-side'; const sideZ = (mark.u - .5) * size.height * .78; const sideY = (mark.v - .5) * size.depth * .62;
    return <mesh position={[right ? size.width / 2 + .022 : -size.width / 2 - .022, sideY, sideZ]} rotation={[0, right ? Math.PI / 2 : -Math.PI / 2, THREE.MathUtils.degToRad(mark.rotation)]} renderOrder={4}><planeGeometry args={[sideWidth, Math.max(.11, sideWidth / 4.2)]} />{material}</mesh>;
  }
  return <mesh position={[x, surfaceY + .032, z]} rotation={[-Math.PI / 2, 0, THREE.MathUtils.degToRad(mark.rotation)]} renderOrder={4}><planeGeometry args={[topWidth, Math.max(.14, topWidth / 4.2)]} />{material}</mesh>;
}
function DirectMarkSurface({ mark, size, surfaceY, onChange }: { mark: PedalMark; size: { width: number; height: number; depth: number }; surfaceY: number; onChange: (mark: PedalMark) => void }) {
  const dragging = useRef<MarkSurface | null>(null);
  const update = (surface: MarkSurface, event: ThreeEvent<PointerEvent>, invertV = false) => {
    if (!event.uv) return;
    const u = THREE.MathUtils.clamp(event.uv.x, .06, .94);
    const v = THREE.MathUtils.clamp(invertV ? 1 - event.uv.y : event.uv.y, .08, .92);
    onChange({ ...mark, enabled: true, surface, u, v });
  };
  const handlers = (surface: MarkSurface, invertV = false) => ({
    onPointerDown: (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); dragging.current = surface; update(surface, event, invertV); },
    onPointerMove: (event: ThreeEvent<PointerEvent>) => { if (dragging.current !== surface) return; event.stopPropagation(); update(surface, event, invertV); },
    onPointerUp: (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); dragging.current = null; },
    onPointerLeave: () => { dragging.current = null; },
  });
  const hitMaterial = <meshBasicMaterial color="#b7ff19" transparent opacity={.003} depthWrite={false} toneMapped={false} />;
  return <>
    <mesh position={[0, surfaceY + .07, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={8} {...handlers('front', true)}><planeGeometry args={[size.width * .9, size.height * .9]} />{hitMaterial}</mesh>
    <mesh position={[0, -size.depth / 2 - .045, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={8} {...handlers('back')}><planeGeometry args={[size.width * .9, size.height * .9]} />{hitMaterial}</mesh>
    <mesh position={[-size.width / 2 - .045, 0, 0]} rotation={[0, -Math.PI / 2, 0]} renderOrder={8} {...handlers('left-side')}><planeGeometry args={[size.height * .82, size.depth * .74]} />{hitMaterial}</mesh>
    <mesh position={[size.width / 2 + .045, 0, 0]} rotation={[0, Math.PI / 2, 0]} renderOrder={8} {...handlers('right-side')}><planeGeometry args={[size.height * .82, size.depth * .74]} />{hitMaterial}</mesh>
  </>;
}
function BackPanel({ size }: { size: { width: number; height: number; depth: number } }) {
  return <group position={[0, -size.depth / 2 - .025, 0]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[size.width * .86, size.height * .82]} /><meshStandardMaterial color="#20241f" metalness={.58} roughness={.58} /></mesh>
    {([[-.38, -.38], [.38, -.38], [-.38, .38], [.38, .38]] as [number, number][]).map(([x, z], i) => <mesh key={i} position={[x * size.width, -.028, z * size.height]}><cylinderGeometry args={[.09, .09, .075, 20]} /><meshStandardMaterial color="#111410" roughness={.86} /></mesh>)}
    <SurfaceText text="SERIAL / 9V DC / MADE IN THE FORGE" position={[0, -.052, 0]} width={Math.min(size.width * .66, 2.3)} color="#aeb6aa" />
  </group>;
}

function PedalModel({ pedal, runtimeMode = 'play', userGraphic, mark, inspectSurface = 'front', directMarkEditing = false, onMarkChange }: { pedal: Pedal; runtimeMode?: RuntimeMode; userGraphic?: UserGraphic | null; mark?: PedalMark; inspectSurface?: MarkSurface; directMarkEditing?: boolean; onMarkChange?: (mark: PedalMark) => void }) {
  const isBrokenSignal = pedal.name.replace(' // LIMITED', '') === 'BROKEN SIGNAL';
  const controls = isBrokenSignal ? ['CLEAN', 'BLEND', 'GAIN', 'LEVEL', 'BASS', 'MID', 'TREBLE', 'PRESENCE'] : pedal.knobs;
  const eqSliders = isBrokenSignal ? [] : pedal.eqSliders || [];
  const resolvedEnclosure: Enclosure = isBrokenSignal ? 'wide' : pedal.enclosure;
  const size = enclosureDimensions[resolvedEnclosure];
  const hybridLayout = eqSliders.length ? createHybridLayoutPlan({ width: size.width, height: size.height, knobCount: controls.length, sliderCount: eqSliders.length, hasLargePaddle: pedal.footswitchStyle === 'large-lower-paddle', footswitchCount: pedal.footswitches, seed: pedal.seed }) : undefined;
  const geometry = useMemo(() => roundedEnclosureGeometry(size.width, size.height, size.depth), [size.width, size.height, size.depth]);
  const texture = useMemo(() => { const art = new THREE.TextureLoader().load(pedal.artAtlas === 'b' ? '/pedal-forge-atlas-b.png' : '/pedal-forge-atlas-a.png'); art.colorSpace = THREE.SRGBColorSpace; art.wrapS = THREE.ClampToEdgeWrapping; art.wrapT = THREE.ClampToEdgeWrapping; art.repeat.set(.25, .9); art.offset.set(pedal.artIndex * .25, .05); return art; }, [pedal.artIndex, pedal.artAtlas]);
  useEffect(() => () => { geometry.dispose(); texture.dispose(); }, [geometry, texture]);
  const hardwareCulture: HardwareCulture = isBrokenSignal ? 'LAB UTILITY' : pedal.hardwareCulture || (resolvedEnclosure === 'wide' ? 'BIG BOX' : 'CLASSIC STOMP'); const condition = isBrokenSignal ? 'FACTORY NEW' : pedal.condition || 'FACTORY NEW';
  const controlGroups = isBrokenSignal ? [{ name: 'INPUT / DRIVE', controls: controls.slice(0, 4) }, { name: '3-BAND EQ', controls: controls.slice(4) }] : pedal.controlGroups || controlGroupsFor(categoryFor(pedal.type), controls);
  const primaryControl = isBrokenSignal ? 'GAIN' : pedal.primaryControl || primaryControlFor(categoryFor(pedal.type), controls);
  const effectArchitecture = isBrokenSignal ? 'PARALLEL DRIVE PREAMP' : pedal.effectArchitecture || pedal.type;
  const footswitchLabels = isBrokenSignal ? ['BYPASS', 'ALT'] : pedal.footswitchLabels || (pedal.footswitches === 1 ? ['BYPASS'] : ['BYPASS', categoryFor(pedal.type) === 'delay' ? 'TAP' : 'BOOST']);
  const toggleLabels = isBrokenSignal ? ['CLIP', 'VOICE'] : pedal.toggleLabels || Array.from({ length: pedal.toggleCount }, (_, i) => i ? 'VOICE' : 'MODE');
  const identityMotif: IdentityMotif = isBrokenSignal ? 'broken-wave' : pedal.identityMotif || 'none';
  let positions = hybridLayout ? hybridLayout.knobCenters.map(({ x, z }) => [x, size.depth / 2 + .25, z] as [number, number, number]) : knobPositions(controls.length, size.width, size.height, pedal.controlVariant || 'grid').map(([x, , z]) => [x, size.depth / 2 + .25, z] as [number, number, number]);
  if (!hybridLayout && hardwareCulture === 'DIGITAL MULTI') positions = knobPositions(controls.length, size.width, size.height, 'grid').map(([x, , z]) => [x, size.depth / 2 + .25, z - size.height * .035]);
  const rotaryGroups = controlGroups.map(group => ({ ...group, controls: group.controls.filter(control => controls.includes(control)) })).filter(group => group.controls.length);
  let groupCursor = 0; const groupRows = rotaryGroups.map(group => { const row = positions.slice(groupCursor, groupCursor + group.controls.length); groupCursor += group.controls.length; return { group, row }; });
  const switchZ = hybridLayout?.switchZ ?? size.height * (controls.length >= 7 ? .38 : .34); const sideX = size.width / 2 + .045; const topZ = -size.height / 2 - .045; const surfaceY = size.depth / 2 + .13; const labelSurfaceY = surfaceY + .025; const tinyEnclosure = ['nano', 'micro', 'mini'].includes(resolvedEnclosure); const knobRadius = resolvedEnclosure === 'nano' ? .145 : resolvedEnclosure === 'micro' ? .17 : resolvedEnclosure === 'mini' ? .19 : controls.length >= 7 ? .21 : controls.length >= 5 ? .24 : controls.length === 4 ? .26 : .29;
  const materialStyle = pedal.materialStyle || 'powder'; const knobStyle = pedal.knobStyle || 'cylinder'; const artCoverage = isBrokenSignal ? 'none' : pedal.artCoverage || 'symbol'; const footswitchStyle = pedal.footswitchStyle || 'metal'; const largePaddle = footswitchStyle === 'large-lower-paddle'; const rawLedStyle = pedal.ledStyle as string | undefined; const ledStyle: LedStyle = rawLedStyle === 'flat' || rawLedStyle === 'lens' || rawLedStyle === 'dome' ? rawLedStyle : 'dome'; const ledCount = Math.max(0, Math.min(pedal.ledCount ?? 1, resolvedEnclosure === 'digital' ? 3 : ['wide', 'bigbox'].includes(resolvedEnclosure) ? 2 : 1)); const ledLocation: LedLocation = ledCount === 0 ? 'none' : pedal.ledLocation === 'center' ? 'center' : 'upper'; const ledColors = pedal.ledColors?.length ? pedal.ledColors : ['#ff3028']; const display = isBrokenSignal ? 'none' : pedal.display || 'none'; const extraPort = pedal.extraPort || 'none'; const graphicMode = isBrokenSignal ? 'TECHNICAL' : pedal.graphicMode || 'MINIMAL';
  const jackLayout: JackLayout = pedal.jackLayout || 'sides'; const powerPlacement: PowerPlacement = pedal.powerPlacement || 'top'; const ioChannels = pedal.ioChannels || 'mono';
  const graphicColor = pedal.graphicColor || pedal.palette[0]; const hardwareColors = pedal.hardwareColors?.length ? pedal.hardwareColors : ['#292d29', '#4a4f4a']; const accentColors = pedal.accentColors?.length ? pedal.accentColors : [pedal.palette[0]]; const utilityFont = utilityFontStack(pedal.typography?.utilityFontCategory || pedal.brand?.utilityFontCategory);
  const brandText = isBrokenSignal ? 'UNIT 17' : pedal.brand?.manufacturerName || pedal.brandLabel || 'FURNACE AUDIO WORKS'; const ownerText = isBrokenSignal ? (pedal.owner ? `CUSTOM / ${pedal.owner}` : '') : pedal.ownerLabel ?? (pedal.owner && pedal.owner !== 'ANON' ? `FOR ${pedal.owner}` : '');
  const finish: Record<MaterialStyle, { metalness: number; roughness: number; clearcoat: number; clearcoatRoughness: number; iridescence?: number }> = {
    powder: { metalness: .03, roughness: .72, clearcoat: .08, clearcoatRoughness: .6 }, matte: { metalness: .02, roughness: .86, clearcoat: .02, clearcoatRoughness: .8 },
    'semi-gloss': { metalness: .04, roughness: .44, clearcoat: .48, clearcoatRoughness: .28 }, 'high-gloss': { metalness: .02, roughness: .25, clearcoat: .82, clearcoatRoughness: .18 },
    'metallic-flake': { metalness: .38, roughness: .34, clearcoat: .72, clearcoatRoughness: .2 }, anodized: { metalness: .78, roughness: .27, clearcoat: .22, clearcoatRoughness: .3 },
    brushed: { metalness: .88, roughness: .34, clearcoat: .08, clearcoatRoughness: .5 }, hammered: { metalness: .18, roughness: .7, clearcoat: .12, clearcoatRoughness: .62 },
    aged: { metalness: .22, roughness: .82, clearcoat: .02, clearcoatRoughness: .9 }, pearl: { metalness: .14, roughness: .2, clearcoat: .9, clearcoatRoughness: .12, iridescence: .45 },
    iridescent: { metalness: .3, roughness: .18, clearcoat: 1, clearcoatRoughness: .1, iridescence: 1 }, holographic: { metalness: .62, roughness: .16, clearcoat: 1, clearcoatRoughness: .08, iridescence: 1 },
  };
  const finishMaterial = finish[materialStyle];
  const usesFullArtwork = graphicMode === 'FULL ILLUSTRATION' && artCoverage === 'full'; const artSize: [number, number] = [size.width * .94, size.height * .94]; const indicatorClearance = Math.max(ledLocation === 'upper' ? .5 : .44, size.height * .14); const indicatorZ = hybridLayout?.indicatorZ ?? (largePaddle ? -size.height * .02 : switchZ - indicatorClearance); const showTopScrews = hardwareCulture === 'LAB UTILITY' || condition === 'DIY MODIFIED';
  const inspectionRotation: [number, number, number] = inspectSurface === 'back' ? [Math.PI, 0, 0] : inspectSurface === 'left-side' ? [0, 0, -Math.PI / 2] : inspectSurface === 'right-side' ? [0, 0, Math.PI / 2] : [0, 0, 0];
  return <group rotation={[0, -.08, 0]}><group rotation={inspectionRotation}>
    <mesh geometry={geometry} castShadow receiveShadow><meshPhysicalMaterial color={pedal.palette[1]} metalness={finishMaterial.metalness} roughness={finishMaterial.roughness} clearcoat={finishMaterial.clearcoat} clearcoatRoughness={finishMaterial.clearcoatRoughness} iridescence={finishMaterial.iridescence || 0} iridescenceIOR={1.5} iridescenceThicknessRange={[180, 620]} envMapIntensity={['brushed', 'anodized', 'iridescent', 'holographic'].includes(materialStyle) ? 1.15 : .58} /></mesh>
    <BackPanel size={size} />
    {showTopScrews && ([[-.43, -.43], [.43, .43]] as [number, number][]).map(([x, z], i) => <ChassisScrew key={i} position={[x * size.width, surfaceY + .018, z * size.height]} />)}
    {resolvedEnclosure === 'digital' && <mesh position={[0, surfaceY - .055, .18]} rotation={[-Math.PI / 2, 0, 0]}><boxGeometry args={[size.width * .94, size.height * .5, .11]} /><meshStandardMaterial color={pedal.palette[1]} metalness={finishMaterial.metalness} roughness={finishMaterial.roughness} /></mesh>}
    {usesFullArtwork && <mesh position={[0, surfaceY - .028, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={artSize} /><meshStandardMaterial map={texture} color={pedal.variant ? '#f2eadf' : '#ffffff'} metalness={finishMaterial.metalness * .55} roughness={Math.max(.48, finishMaterial.roughness)} polygonOffset polygonOffsetFactor={-2} /></mesh>}
    {userGraphic?.textureUrl && <UserGraphicPlane graphic={userGraphic} size={size} surfaceY={surfaceY} knobCount={controls.length + eqSliders.length} />}
    {pedal.visualIntensity === 'maximal' && !userGraphic?.textureUrl && <MaximalArtwork pedal={pedal} size={size} surfaceY={surfaceY} />}
    {hardwareCulture === 'LAB UTILITY' && <XlrPort position={[size.width / 2 + .05, 0, size.height * .18]} />}
    {controls.length >= 5 && groupRows.map(({ group, row }) => <ControlGroupFrame key={group.name} group={group} row={row} style={pedal.controlGroupFrameStyle || 'thin-line'} radius={knobRadius} surfaceY={labelSurfaceY - .018} color={graphicColor} backgroundColor={pedal.palette[1]} />)}
    {!!eqSliders.length && hybridLayout && <SliderEqGroup sliders={eqSliders} surfaceY={surfaceY} color={graphicColor} layout={hybridLayout.eqPanel} />}
    {hardwareCulture === 'TREADLE STOMP' && <group position={[0, surfaceY + .09, size.height * .2]}>
      <mesh castShadow><boxGeometry args={[size.width * .78, .18, size.height * .48]} /><meshStandardMaterial color="#171a17" roughness={.66} metalness={.22} /></mesh>
      {[-2, -1, 0, 1, 2].map(i => <mesh key={i} position={[i * size.width * .12, .105, 0]}><boxGeometry args={[.035, .025, size.height * .4]} /><meshStandardMaterial color="#4a4f48" roughness={.8} /></mesh>)}
    </group>}
    {hardwareCulture === 'DIGITAL MULTI' && <group>
      <mesh position={[0, surfaceY + .08, -size.height * .29]}><boxGeometry args={[size.width * .65, .13, size.height * .24]} /><meshStandardMaterial color="#111714" emissive={pedal.palette[0]} emissiveIntensity={.12} metalness={.45} roughness={.24} /></mesh>
      <group position={[0, surfaceY + .16, -size.height * .29]}><RuntimeDisplay width={size.width * .65} label={pedal.type + ' / P01'} color={pedal.palette[0]} runtimeMode={runtimeMode} /></group>
      {([[-.72, .12], [.72, .12], [-.72, .82], [.72, .82]] as [number, number][]).map(([x, z], i) => <group key={i} position={[x, surfaceY + .1, z]}><mesh><boxGeometry args={[.58, .16, .48]} /><meshStandardMaterial color="#202420" roughness={.7} /></mesh><SurfaceText text={['MEM-', 'MEM+', 'BACK', 'NEXT'][i]} position={[0, .1, 0]} width={.42} color="#dce2d8" /></group>)}
    </group>}
    <WearMarks size={size} condition={condition} surfaceY={surfaceY} />
    {!hybridLayout && <GraphicAccent mode={graphicMode} size={size} surfaceY={surfaceY} color={accentColors[pedal.artIndex % accentColors.length]} artIndex={pedal.artIndex} motifType={pedal.motifType || 'wave'} renderStyle={pedal.motifRenderStyle || 'line-art'} placement={pedal.motifPlacement || 'lower-right'} scale={pedal.motifScale || 'small'} />}
    {!hybridLayout && <KanjiDesignMark pedal={pedal} size={size} surfaceY={surfaceY} controlCount={controls.length + eqSliders.length} />}
    {positions.map((position, i) => { const isPrimary = controls[i] === primaryControl; return <RotaryControlUnit key={i} position={position} label={controls[i]} style={knobStyle} baseRadius={knobRadius} isPrimary={isPrimary} color={isPrimary ? accentColors[0] : hardwareColors[i % hardwareColors.length]} labelColor={graphicColor} labelWidth={Math.min(.68, size.width * .25)} labelSurfaceY={labelSurfaceY} enclosureHeight={size.height} showLabel={true} font={utilityFont} labelPlacement={hybridLayout?.knobCenters[i]?.labelPlacement} />; })}
    {Array.from({ length: pedal.toggleCount }, (_, i) => { const x = pedal.toggleCount === 1 ? -size.width * .22 : (i - (pedal.toggleCount - 1) / 2) * size.width * .2; return <ToggleSwitch key={i} position={[x, .64, indicatorZ]} label={toggleLabels[i] || (i ? 'VOICE' : 'MODE')} surfaceY={surfaceY} color="#f4f1e6" />; })}
    {largePaddle && hardwareCulture !== 'TREADLE STOMP' && <><group position={[0, surfaceY + .025, size.height * .29]}><LargePaddleFootswitch width={size.width * .82} length={size.height * .42} active={runtimeMode !== 'off'} /></group><SurfaceText text={'BYPASS'} position={[0, surfaceY, size.height * .045]} width={Math.min(.58, size.width * .36)} color={graphicColor} font={utilityFont} outline={false} /></>}
    {hardwareCulture !== 'TREADLE STOMP' && !largePaddle && Array.from({ length: pedal.footswitches }, (_, i) => { const x = pedal.footswitches === 1 ? 0 : (i === 0 ? -1 : 1) * size.width * .25; const soft = footswitchStyle === 'soft-touch' || footswitchStyle === 'pad'; return <group key={i}><group position={[x, size.depth / 2 + .19, switchZ]}><FootswitchHardware soft={soft} /></group><SurfaceText text={footswitchLabels[i] || (i ? 'ALT' : 'BYPASS')} position={[x, surfaceY, switchZ - .28]} width={Math.min(.52, size.width * .34)} color={graphicColor} font={utilityFont} outline={false} /></group>; })}
    {Array.from({ length: ledCount }, (_, i) => { const x = ledCount === 1 ? (pedal.toggleCount ? size.width * .22 : 0) : (i - (ledCount - 1) / 2) * size.width * .5; const active = runtimeMode !== 'off' && (i === 0 || runtimeMode === 'play'); const pulse = i > 0 && footswitchLabels.some(label => label.includes('TAP')); return <LedLens key={i} style={ledStyle} color={ledColors[i] || ledColors[0] || '#ff3028'} position={[x, surfaceY + .035, indicatorZ]} runtimeMode={active ? runtimeMode : 'off'} pulse={pulse} />; })}
    {display !== 'none' && hardwareCulture !== 'DIGITAL MULTI' && <group position={[0, surfaceY + .02, size.height * .04]}><RuntimeDisplay width={Math.min(1.3, size.width * .5)} label={display === 'oled' ? pedal.type : 'PATCH 0' + pedal.rarity} color={pedal.palette[0]} runtimeMode={runtimeMode} /></group>}
    <TypographyTitle pedal={pedal} size={size} surfaceY={surfaceY} controlCount={controls.length + eqSliders.length} displayActive={display !== 'none'} placement={hybridLayout?.productName} />
    {!hybridLayout && !tinyEnclosure && graphicMode !== 'TYPOGRAPHY' && ledCount === 0 && pedal.toggleCount === 0 && <SurfaceText text={effectArchitecture} position={[0, surfaceY, display === 'none' ? size.height * .16 : size.height * .24]} width={Math.min(size.width * .42, controls.length + eqSliders.length >= 7 ? 1.25 : 1.45)} color={graphicColor} font={utilityFont} outline={false} />}
    {identityMotif === 'broken-wave' && <BrokenWaveMark position={[size.width * .34, surfaceY + .02, size.height * .145]} color={accentColors[0]} />}
    {ownerText && <SurfaceText text={ownerText} position={[size.width * .21, surfaceY, -size.height * .43]} width={Math.min(1.05, size.width * .34)} font={ownerFonts[pedal.ownerFont]} color={graphicColor} />}
    {brandText && <SurfaceText text={brandText} position={[0, surfaceY, -size.height * .465]} width={Math.min(1.5, size.width * .58)} color={graphicColor} font={utilityFont} outline={false} />}
    {ioChannels === 'stereo' && jackLayout === 'sides' && <>{[-.3, .12].map(z => <Jack key={'out-' + z} position={[-sideX, 0, z]} rotation={[0, 0, Math.PI / 2]} />)}{[-.3, .12].map(z => <Jack key={'in-' + z} position={[sideX, 0, z]} rotation={[0, 0, -Math.PI / 2]} />)}</>}
    {ioChannels === 'mono' && jackLayout === 'sides' && <><Jack position={[-sideX, 0, -.12]} rotation={[0, 0, Math.PI / 2]} /><Jack position={[sideX, 0, -.12]} rotation={[0, 0, -Math.PI / 2]} /></>}
    {ioChannels === 'stereo' && jackLayout !== 'sides' && <>{[-.36, -.12, .12, .36].map((factor, i) => <Jack key={'stereo-' + i} position={[size.width * factor, 0, topZ]} rotation={[-Math.PI / 2, 0, 0]} />)}</>}
    {ioChannels === 'mono' && jackLayout === 'top' && <><Jack position={[-size.width * .27, 0, topZ]} rotation={[-Math.PI / 2, 0, 0]} /><Jack position={[size.width * .27, 0, topZ]} rotation={[-Math.PI / 2, 0, 0]} /></>}
    {ioChannels === 'mono' && jackLayout === 'hybrid' && <><Jack position={[-sideX, 0, -.12]} rotation={[0, 0, Math.PI / 2]} /><Jack position={[size.width * .27, 0, topZ]} rotation={[-Math.PI / 2, 0, 0]} /></>}
    {powerPlacement === 'right-near-input' ? <DcJack position={[sideX, 0, .42]} rotation={[0, 0, -Math.PI / 2]} /> : <DcJack position={[powerPlacement === 'top-offset' ? size.width * .14 : 0, 0, topZ]} rotation={[-Math.PI / 2, 0, 0]} />}
    <ExtraPort kind={extraPort} position={[-size.width * .4, 0, topZ]} />
    {jackLayout === 'top' && <><SurfaceText text="OUTPUT" position={[-size.width * .27, surfaceY, -size.height * .37]} width={.56} /><SurfaceText text="INPUT" position={[size.width * .27, surfaceY, -size.height * .37]} width={.5} /></>}
    {jackLayout === 'sides' && !tinyEnclosure && <><SurfaceText text="OUTPUT" position={[-size.width * .37, surfaceY, -.16]} width={.56} font={utilityFont} outline={false} /><SurfaceText text="INPUT" position={[size.width * .37, surfaceY, -.16]} width={.5} font={utilityFont} outline={false} /></>}
    {ioChannels === 'mono' && jackLayout === 'hybrid' && <><SurfaceText text="OUTPUT" position={[-size.width * .37, surfaceY, -.16]} width={.56} /><SurfaceText text="INPUT" position={[size.width * .27, surfaceY, -size.height * .37]} width={.5} /></>}
    {!tinyEnclosure && <SurfaceText text="DC IN" position={[powerPlacement === 'right-near-input' ? size.width * .37 : powerPlacement === 'top-offset' ? size.width * .14 : 0, surfaceY, powerPlacement === 'right-near-input' ? .4 : -size.height * .41]} width={.42} color={graphicColor} font={utilityFont} outline={false} />}
    {directMarkEditing && mark && onMarkChange && <DirectMarkSurface mark={mark} size={size} surfaceY={surfaceY} onChange={onMarkChange} />}
    {mark && <SignatureMark mark={mark} size={size} surfaceY={surfaceY} />}
  </group></group>;
}
function ForgeSigil({ color, reveal, reduce }: { color: string; reveal: boolean; reduce: boolean }) {
  const outer = useRef<THREE.Group>(null!); const inner = useRef<THREE.Group>(null!); const pulse = useRef<THREE.Group>(null!); const elapsed = useRef(0);
  useFrame((_, delta) => { elapsed.current += delta; if (!reduce) { outer.current.rotation.y += delta * (reveal ? .8 : 1.7); inner.current.rotation.y -= delta * (reveal ? 1.25 : 2.4); } const beat = 1 + Math.sin(elapsed.current * (reveal ? 9 : 5)) * (reduce ? .01 : .055); pulse.current.scale.setScalar(beat); });
  return <group position={[0, -.57, 0]}>
    <group ref={outer}>{[1.08, 1.55, 2.02].map((radius, index) => <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]} position={[0, index * .012, 0]}><torusGeometry args={[radius, index === 1 ? .028 : .018, 8, 88]} /><meshBasicMaterial color={index === 1 ? '#f4ffe8' : color} transparent opacity={reveal ? .92 - index * .14 : .62 - index * .1} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} /></mesh>)}</group>
    <group ref={inner}>{Array.from({ length: 16 }, (_, index) => { const angle = index / 16 * Math.PI * 2; const radius = index % 2 ? 1.78 : 1.28; return <mesh key={index} position={[Math.cos(angle) * radius, .035, Math.sin(angle) * radius]} rotation={[0, -angle, 0]}><boxGeometry args={[index % 2 ? .34 : .22, .018, .045]} /><meshBasicMaterial color={index % 3 ? color : '#ffffff'} transparent opacity={.72} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} /></mesh>; })}</group>
    <group ref={pulse}><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .025, 0]}><ringGeometry args={[.34, .78, 6]} /><meshBasicMaterial color={color} transparent opacity={reveal ? .52 : .3} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} /></mesh><mesh position={[0, 1.5, 0]}><cylinderGeometry args={[reveal ? .74 : .34, .22, 3.8, 32, 1, true]} /><meshBasicMaterial color={color} transparent opacity={reveal ? .18 : .08} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} /></mesh></group>
  </group>;
}
function RevealSequence({ pedal, reduce, userGraphic }: { pedal: Pedal; reduce: boolean; userGraphic?: UserGraphic | null }) {
  const prize = useRef<THREE.Group>(null!); const particles = useRef<THREE.Group>(null!); const elapsed = useRef(0);
  useFrame((_, delta) => { elapsed.current += delta; const progress = reduce ? 1 : Math.min(1, elapsed.current / 1.55); const emerge = 1 - Math.pow(1 - progress, 3); prize.current.scale.setScalar(.12 + emerge * .88); prize.current.position.y = -.9 + emerge * 1.15; if (!reduce) particles.current.rotation.y += delta * .9; particles.current.scale.setScalar(.35 + emerge * 1.5); });
  return <group position={[0, .1, 0]}>
    <ForgeSigil color={pedal.palette[0]} reveal reduce={reduce} />
    <group ref={particles}>{Array.from({ length: 28 }, (_, i) => { const angle = i / 28 * Math.PI * 2; const radius = .56 + i % 5 * .25; return <mesh key={i} position={[Math.cos(angle) * radius, -.42 + i % 7 * .27, Math.sin(angle) * radius]}><sphereGeometry args={[.018 + i % 3 * .009, 7, 5]} /><meshBasicMaterial color={i % 4 ? pedal.palette[0] : '#ffffff'} transparent opacity={.76} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} /></mesh>; })}</group>
    <group ref={prize} scale={.12}><PedalModel pedal={pedal} runtimeMode="off" userGraphic={userGraphic} /></group>
  </group>;
}
function ForgeMachine({ pedal, reduce }: { pedal: Pedal | null; reduce: boolean }) {
  const core = useRef<THREE.Mesh>(null!); const elapsed = useRef(0); const color = pedal?.palette[0] || '#c7ff1a';
  useFrame((_, delta) => { elapsed.current += delta; const pulse = 1 + Math.sin(elapsed.current * 7) * (reduce ? .01 : .12); core.current.scale.setScalar(pulse); });
  return <group position={[0, .05, 0]}>
    <ForgeSigil color={color} reveal={false} reduce={reduce} />
    <mesh ref={core} position={[0, -.15, 0]}><sphereGeometry args={[.24, 24, 16]} /><meshBasicMaterial color="#ffffff" transparent opacity={.9} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} /></mesh>
    <pointLight position={[0, .4, 0]} color={color} intensity={3.2} distance={6} decay={1.8} />
  </group>;
}
function CameraController({ enabled, home, resetToken, autoRotate }: { enabled: boolean; home: [number, number, number]; resetToken: number; autoRotate: boolean }) {
  const { camera, gl } = useThree(); const controls = useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl.domElement]);
  useEffect(() => { controls.enableDamping = true; controls.dampingFactor = .08; controls.enablePan = false; controls.minPolarAngle = .08; controls.maxPolarAngle = Math.PI - .08; controls.touches.ONE = THREE.TOUCH.ROTATE; controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE; return () => controls.dispose(); }, [controls]);
  useEffect(() => { controls.enabled = enabled; controls.autoRotate = enabled && autoRotate; controls.autoRotateSpeed = .75; controls.minDistance = Math.hypot(...home) * .5; controls.maxDistance = Math.hypot(...home) * 1.6; }, [controls, enabled, home, autoRotate]);
  useEffect(() => { camera.position.set(...home); controls.target.set(0, 0, 0); controls.update(); }, [camera, controls, home, resetToken]);
  useFrame(() => controls.update()); return null;
}
function RenderSettings({ viewMode }: { viewMode: ViewMode }) {
  const { gl } = useThree();
  useEffect(() => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.outputColorSpace = THREE.SRGBColorSpace; gl.toneMappingExposure = viewMode === 'stage' ? 1.04 : viewMode === 'studio' || viewMode === 'white' ? 1.12 : 1.08; gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFSoftShadowMap; }, [gl, viewMode]);
  return null;
}
function ContactDisc({ viewMode }: { viewMode: ViewMode }) {
  const texture = useMemo(() => { const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256; const ctx = canvas.getContext('2d')!; const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120); gradient.addColorStop(0, 'rgba(0,0,0,.62)'); gradient.addColorStop(.45, 'rgba(0,0,0,.28)'); gradient.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(canvas); }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={[0, -.605, .12]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[5.2, 4.2]} /><meshBasicMaterial map={texture} transparent opacity={viewMode === 'studio' ? .24 : .44} depthWrite={false} /></mesh>;
}
function EmptyStage({ viewMode }: { viewMode: ViewMode }) {
  return <group position={[0, -.45, 0]}>
    <mesh receiveShadow><cylinderGeometry args={[2.15, 2.4, .2, 48]} /><meshPhysicalMaterial color={viewMode === 'studio' ? '#e8e8e4' : '#151b15'} metalness={viewMode === 'studio' ? .04 : .62} roughness={.42} clearcoat={.35} /></mesh>
    <mesh position={[0, .12, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.35, .018, 8, 64]} /><meshBasicMaterial color={viewMode === 'studio' ? '#808780' : '#6f845d'} transparent opacity={.4} /></mesh>
  </group>;
}
function Stage({ pedal, phase, canvasRef, reduce, resetToken, viewMode, runtimeMode, userGraphic, mark, inspectSurface, autoRotate, directMarkEditing = false, onMarkChange }: { pedal: Pedal | null; phase: GachaState; canvasRef: React.MutableRefObject<HTMLCanvasElement | null>; reduce: boolean; resetToken: number; viewMode: ViewMode; runtimeMode: RuntimeMode; userGraphic?: UserGraphic | null; mark?: PedalMark; inspectSurface: MarkSurface; autoRotate: boolean; directMarkEditing?: boolean; onMarkChange?: (mark: PedalMark) => void }) {
  const topView = phase === 'revealing' || phase === 'result';
  const floorless = viewMode === 'white' || viewMode === 'dark';
  const extent = pedal ? Math.max(enclosureDimensions[pedal.enclosure].width, enclosureDimensions[pedal.enclosure].height) : 4; const distance = extent * 1.42;
  const home = useMemo<[number, number, number]>(() => !topView ? [0, 0, 7] : viewMode === 'studio' ? [distance * .42, distance * .88, distance * .72] : viewMode === 'hero' ? [distance * .76, distance * .48, distance * .82] : floorless ? [distance * .38, distance * .62, distance * .86] : [distance * .56, distance * .74, distance * .82], [distance, floorless, topView, viewMode]);
  const background = viewMode === 'white' ? '#f7f7f4' : viewMode === 'dark' ? '#0d110e' : viewMode === 'studio' ? '#f4f4f1' : viewMode === 'hero' ? (pedal?.colorChoice === 'ice' ? '#dcebed' : pedal?.colorChoice === 'ember' ? '#321b16' : pedal?.colorChoice === 'violet' ? '#25172b' : '#18220f') : '#0b110d';
  const floorY = topView ? -.62 : -2.2;
  return <Canvas className="forge-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} shadows dpr={[1, 1.5]} gl={{ preserveDrawingBuffer: true, antialias: true }} onCreated={({ gl, camera }) => { canvasRef.current = gl.domElement; camera.lookAt(0, 0, 0); }} fallback={<div className="canvas-fallback">3D PREVIEW UNAVAILABLE</div>} camera={{ position: home, fov: viewMode === 'hero' ? 34 : topView ? 36 : 38 }}>
    <RenderSettings viewMode={viewMode} />
    <CameraController enabled={phase === 'result' && !directMarkEditing} home={home} resetToken={resetToken} autoRotate={autoRotate} />
    <color attach="background" args={[background]} />
    <hemisphereLight color={viewMode === 'white' ? '#ffffff' : viewMode === 'studio' ? '#ffffff' : '#dce7df'} groundColor={viewMode === 'white' ? '#e4e5df' : viewMode === 'studio' ? '#d8d8d3' : '#171c18'} intensity={viewMode === 'white' ? 1.65 : viewMode === 'studio' ? 1.5 : .72} />
    <ambientLight intensity={viewMode === 'white' ? .52 : viewMode === 'dark' ? .12 : viewMode === 'studio' ? .42 : .18} />
    <directionalLight position={viewMode === 'hero' ? [-5, 7, 5] : [-4, 8, 6]} intensity={viewMode === 'white' ? 3.8 : viewMode === 'studio' ? 3.6 : viewMode === 'hero' ? 4.8 : 4.2} color="#fff4e8" castShadow />
    <directionalLight position={[5, 4, -4]} intensity={viewMode === 'white' ? 1.8 : viewMode === 'dark' ? 1.35 : viewMode === 'studio' ? 1.45 : .82} color="#dce8ff" />
    <directionalLight position={[0, 4, -7]} intensity={viewMode === 'dark' ? 2.8 : viewMode === 'hero' ? 2.4 : 1.25} color={viewMode === 'hero' && pedal ? pedal.palette[0] : '#eef5ef'} />
    {topView && viewMode !== 'studio' && <spotLight position={[-3.5, 9, 5]} intensity={viewMode === 'hero' ? 4.2 : 1.8} angle={.32} penumbra={.95} distance={24} decay={1.5} castShadow color="#fff4df" />}
    {pedal && runtimeMode !== 'off' && <pointLight position={[0, 2.4, 1.4]} color={pedal.palette[0]} intensity={runtimeMode === 'play' ? .62 : .35} distance={5} />}
    {!floorless && <mesh position={[0, floorY, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[20, 20]} />{viewMode === 'studio' ? <meshStandardMaterial color="#f4f4f1" roughness={.82} metalness={0} /> : <meshPhysicalMaterial color={viewMode === 'hero' ? background : '#151b18'} roughness={viewMode === 'hero' ? .4 : .3} metalness={.04} clearcoat={.68} clearcoatRoughness={.22} />}</mesh>}
    {!floorless && topView && phase === 'result' && <ContactDisc viewMode={viewMode} />}
    {phase === 'idle' ? <EmptyStage viewMode={viewMode} /> : phase === 'result' && pedal ? <PedalModel pedal={pedal} runtimeMode={runtimeMode} userGraphic={userGraphic} mark={mark} inspectSurface={inspectSurface} directMarkEditing={directMarkEditing} onMarkChange={onMarkChange} /> : phase === 'revealing' && pedal ? <RevealSequence pedal={pedal} reduce={reduce} userGraphic={userGraphic} /> : <ForgeMachine pedal={pedal} reduce={reduce} />}
  </Canvas>;
}

function CustomGraphicEditor({ graphic, error, onFile, onChange, onRemove }: { graphic: UserGraphic | null; error: string; onFile: (file: File) => void; onChange: (patch: Partial<UserGraphic>) => void; onRemove: () => void }) {
  const buttons = <T extends string,>(value: T, options: [T, string][], change: (value: T) => void) => <div className="graphic-options">{options.map(([key, label]) => <button type="button" key={key} className={value === key ? 'active' : ''} onClick={() => change(key)}>{label}</button>)}</div>;
  return <section className="custom-graphic">
    <div className="custom-graphic-heading"><div><b>CUSTOM GRAPHIC</b><span>自分の画像を錬成素材として使用</span></div>{graphic && <button type="button" className="text-button" onClick={onRemove}>使用しない</button>}</div>
    {!graphic ? <label className="graphic-drop"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => { const file = e.target.files?.[0]; if (file) onFile(file); e.currentTarget.value = ''; }} /><strong>＋ 画像を選択</strong><span>PNG / JPG / WEBP · 最大15MB</span></label> : <>
      <div className="graphic-preview-pair"><figure><img src={graphic.sourceUrl} alt="選択した元画像" /><figcaption>ORIGINAL</figcaption></figure><i>→</i><figure><img src={graphic.textureUrl || graphic.sourceUrl} alt="加工プレビュー" /><figcaption>FORGED PREVIEW</figcaption></figure></div>
      <p className="graphic-file">{graphic.fileName}<span>{graphic.width} × {graphic.height}</span></p>
      <div className="graphic-setting"><b>HOW TO USE</b>{buttons(graphic.usageMode, [['preserve', 'そのまま'], ['transform', '加工する'], ['auto', 'おまかせ']], value => onChange({ usageMode: value }))}</div>
      {graphic.usageMode !== 'auto' && <div className="graphic-setting"><b>PLACEMENT</b>{buttons(graphic.placementMode, [['one-point', 'ワンポイント'], ['sticker', 'ステッカー'], ['panel', 'パネル'], ['full', '全面'], ['auto', 'おまかせ']], value => onChange({ placementMode: value }))}</div>}
      {graphic.usageMode === 'transform' && <>
        <div className="graphic-setting"><b>ART STYLE</b>{buttons(graphic.transformStyle, [['auto', 'おまかせ'], ['silkscreen', 'SILK'], ['risograph', 'RISO'], ['halftone', 'HALFTONE'], ['poster', 'POSTER'], ['sticker', 'STICKER'], ['abstract', 'ABSTRACT']], value => onChange({ transformStyle: value }))}</div>
        <div className="graphic-setting"><b>TRANSFORM</b>{buttons(graphic.transformStrength, [['low', '弱'], ['medium', '中'], ['high', '強']], value => onChange({ transformStrength: value }))}</div>
      </>}
      {graphic.usageMode !== 'auto' && <div className="graphic-setting"><b>COLOR</b>{buttons(graphic.colorBehavior, [['preserve', '元色'], ['pedal-match', '本体色'], ['duotone', '2色'], ['monochrome', '白黒']], value => onChange({ colorBehavior: value }))}</div>}
      {graphic.usageMode !== 'preserve' && <button type="button" className="remix-graphic" onClick={() => onChange({ variant: graphic.variant + 1 })}>加工を再抽選 ↻</button>}
      <label className="change-graphic">画像を変更<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => { const file = e.target.files?.[0]; if (file) onFile(file); e.currentTarget.value = ''; }} /></label>
    </>}
    {error && <p className="graphic-error" role="alert">{error}</p>}
    <p className="graphic-privacy">画像はこのブラウザ内だけで処理され、外部へ送信されません。</p>
  </section>;
}
const defaultMark: PedalMark = { enabled: false, text: '', surface: 'front', u: .76, v: .52, size: .24, rotation: -5, font: 'gothic-jp', color: '#f4f1e8', style: 'print' };
function markCollision(mark: PedalMark, pedal: Pedal) {
  if (mark.surface === 'left-side' || mark.surface === 'right-side') return mark.u > .32 && mark.u < .68 && mark.v > .32 && mark.v < .7;
  if (mark.surface === 'back') { const nearFoot = (mark.u < .2 || mark.u > .8) && (mark.v < .22 || mark.v > .78); const serialPlate = Math.abs(mark.u - .5) < .3 && Math.abs(mark.v - .5) < .12; return nearFoot || serialPlate; }
  const centralName = Math.abs(mark.u - .5) < .27 && mark.v > .42 && mark.v < .64;
  const controlBand = pedal.knobs.length > 0 && mark.v < .38;
  const switchBand = mark.v > .72;
  return centralName || controlBand || switchBand;
}
function SignatureEditor({ pedal, mark, open, onClose, onChange, onRemove, onInspect }: { pedal: Pedal; mark: PedalMark; open: boolean; onClose: () => void; onChange: (mark: PedalMark) => void; onRemove: () => void; onInspect: (surface: MarkSurface) => void }) {
  if (!open) return null;
  const unsafe = markCollision(mark, pedal);
  const fontOptions: [PedalMark['font'], string][] = [['gothic-jp', 'ゴシック'], ['mincho-jp', '明朝'], ['maru-jp', '丸ゴ'], ['handwritten-jp', '手書き'], ['mono', 'MONO'], ['stencil', 'STENCIL']];
  const styleOptions: [PedalMark['style'], string][] = [['print', '印刷'], ['stamp', 'スタンプ'], ['engraved', '刻印'], ['etched', 'エッチング'], ['paint-marker', 'マーカー'], ['decal', 'デカール'], ['embossed', 'エンボス']];
  const surfaceOptions: [MarkSurface, string][] = [['front', '上'], ['left-side', '左'], ['right-side', '右'], ['back', '裏']];
  return <section className="signature-editor direct-3d-mark-controls">
    <header><div><p className="eyebrow">03 / FINISH</p><h2>3Dへ直接配置</h2></div><button onClick={onClose} aria-label="最終加工を閉じる">×</button></header>
    <label className="direct-mark-text">TEXT<input value={mark.text} maxLength={32} onChange={event => onChange({ ...mark, enabled: true, text: event.target.value })} placeholder="文字を入力" /></label>
    <nav className="direct-mark-view-tabs" aria-label="表示する面">{surfaceOptions.map(([surface, label]) => <button type="button" key={surface} className={mark.surface === surface ? 'active' : ''} onClick={() => { onChange({ ...mark, surface }); onInspect(surface); }}>{label}</button>)}</nav>
    <div className="direct-mark-settings">
      <label>FONT<select value={mark.font} onChange={event => onChange({ ...mark, font: event.target.value as PedalMark['font'] })}>{fontOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label>STYLE<select value={mark.style} onChange={event => onChange({ ...mark, style: event.target.value as PedalMark['style'] })}>{styleOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label>COLOR<input type="color" value={mark.color} onChange={event => onChange({ ...mark, color: event.target.value })} /></label>
      <label>SIZE <output>{Math.round(mark.size * 100)}%</output><input type="range" min=".12" max=".5" step=".01" value={mark.size} onChange={event => onChange({ ...mark, size: Number(event.target.value) })} /></label>
      <label>ROTATE <output>{mark.rotation}°</output><input type="range" min="-180" max="180" step="1" value={mark.rotation} onChange={event => onChange({ ...mark, rotation: Number(event.target.value) })} /></label>
    </div>
    <p className={unsafe ? 'direct-mark-status unsafe' : 'direct-mark-status'}>{unsafe ? '部品と重なっています' : '3D本体をクリック / ドラッグ'}</p>
    <div className="signature-actions"><button disabled={unsafe || !mark.text.trim()} onClick={() => { onChange({ ...mark, enabled: true }); onClose(); }}>確定</button><button className="outline" onClick={onRemove}>署名しない</button></div>
  </section>;
}
function indicatorSummary(pedal: Pedal) {
  const count = Math.max(0, pedal.ledCount ?? 1); if (!count) return 'NO LED';
  const rawStyle = pedal.ledStyle as string | undefined; const style = rawStyle === 'flat' || rawStyle === 'lens' || rawStyle === 'dome' ? rawStyle : 'dome'; const location = pedal.ledLocation === 'center' ? 'CENTER' : 'UPPER'; const colors = (pedal.ledColors?.length ? pedal.ledColors : ['#ff3028']).slice(0, count).join(' / ');
  return `${count} × ${style.toUpperCase()} / ${location} / ${colors.toUpperCase()}`;
}
function EditorialPageFrame({ page, pageNumber, hasOverflow, openingSpread = false }: { page: React.ReactNode; pageNumber: number; hasOverflow: boolean; openingSpread?: boolean }) {
  return <div className={'manual-page-shell' + (hasOverflow ? ' layout-overflow' : '') + (openingSpread ? ' opening-spread-shell' : '')} data-page-width={openingSpread ? '1440' : '720'} data-page-height="980" data-layout-status={hasOverflow ? 'autofit' : 'fit'}>{page}<span className="manual-page-number">{openingSpread ? '01—02' : String(pageNumber).padStart(2, '0')}</span></div>;
}type PackageShotTemplate = 'open-box-standard' | 'manual-on-top' | 'pedal-lifted' | 'full-contents';
const packageTemplateLabels: Record<PackageShotTemplate, string> = { 'open-box-standard': 'OPEN BOX / STANDARD', 'manual-on-top': 'MANUAL ON TOP', 'pedal-lifted': 'PEDAL LIFTED', 'full-contents': 'FULL CONTENTS' };
export function packageTemplateFor(pedal: Pedal): PackageShotTemplate {
  const templates = Object.keys(packageTemplateLabels) as PackageShotTemplate[]; let hash = 0; for (const character of pedal.seed) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  if (['wide', 'bigbox', 'digital'].includes(pedal.enclosure)) return hash % 2 ? 'pedal-lifted' : 'full-contents';
  return templates[hash % templates.length];
}
function PackageSetVisual({ pedal, coverImage }: { pedal: Pedal; coverImage: string }) {
  const maker = pedal.brand?.manufacturerName || pedal.brandLabel || 'FURNACE AUDIO WORKS'; const template = packageTemplateFor(pedal);
  return <figure className={`editorial-photo package-set-visual package-shot-${template}`} aria-label={`${packageTemplateLabels[template]}構図の本体、箱、説明書、シリアルカード`}>
    <div className="package-fixed-stage">
      <div className="package-shot-id"><span>PACKAGE STUDY</span><b>{packageTemplateLabels[template]}</b></div>
      <div className="package-mock-box"><div className="package-mock-lid"><span>{maker}</span><b>{pedal.name}</b><i /></div><div className="package-mock-base"><span>FORM-FIT INSERT</span></div></div>
      <div className="package-mock-pedal">{coverImage ? <img src={coverImage} alt={`${pedal.name} の完成品`} /> : <div className="cover-photo-loading">DEVELOPING PRODUCT IMAGE</div>}</div>
      <div className="package-mock-manual"><i /><span>OWNER'S MANUAL</span><b>{pedal.name}</b><small>{pedal.type}</small><em>01—08</em></div>
      <div className="package-mock-card"><span>ONE OF ONE / SERIAL</span><b>{pedal.serial}</b><small>{maker}</small></div>
      <div className="package-contents-key"><b>IN THE BOX</b><span>01 PEDAL</span><span>02 OWNER'S MANUAL</span><span>03 SERIAL CARD</span></div>
    </div>
    <figcaption>{packageTemplateLabels[template]} / FIXED COMPOSITION</figcaption>
  </figure>;
}
function EditorialResult({ pedal, coverImage, resultRef, resetKey, onPng, onPdf, onReforge }: { pedal: Pedal; coverImage: string; resultRef: React.RefObject<HTMLElement | null>; resetKey: number; onPng: () => void; onPdf: () => void; onReforge: () => void }) {
  const enclosureLabel = enclosureDimensions[pedal.enclosure].label;
  const ioLabel = pedal.jackLayout === 'top' ? 'TOP-MOUNTED I/O' : pedal.jackLayout === 'hybrid' ? 'SIDE OUT / TOP IN' : 'SIDE-MOUNTED I/O';
  const controlNames = [...pedal.knobs, ...(pedal.eqSliders?.map(slider => slider.label) || [])];
  const controlCount = controlNames.length;
  const controlLabel = controlCount === 1 ? '1 CONTROL' : `${controlCount} CONTROLS`;
  const issue = pedal.serial.replace(/[^A-Z0-9]/g, '').slice(-3).padStart(3, '0');
  const promo = pedal.promoDirection || { layout: 'hero', imagePlacement: 'center', informationDensity: 'medium', composition: 'centered' } as PromoDirection;
  const editorialFamily = promo.layout.replace(/_/g, '-');
  const pageClass = (index: number, base: string) => 'manual-page ' + base + ' editorial-page-' + (index + 1) + ' family-' + editorialFamily;
  const [currentPage, setCurrentPage] = useState(0);
  const [spread, setSpread] = useState(() => typeof window !== 'undefined' && matchMedia('(min-width: 1100px)').matches);
  const [pageListOpen, setPageListOpen] = useState(false);
  const [overflowPages, setOverflowPages] = useState<number[]>([]);
  const swipeStart = useRef<number | null>(null);
  const spreadRef = useRef<HTMLDivElement>(null);
  const previousPedal = useRef(pedal.id);
  const totalPages = 4;
  const visibleStart = spread ? Math.floor(currentPage / 2) * 2 : currentPage;
  const step = spread ? 2 : 1;
  const goToPage = (page: number) => { const next = Math.max(0, Math.min(totalPages - 1, page)); setCurrentPage(next); setPageListOpen(false); if (typeof history !== 'undefined') history.replaceState(null, '', `${location.pathname}${location.search}#editorial-${next + 1}`); };
  useEffect(() => { const media = matchMedia('(min-width: 1100px)'); const change = (event: MediaQueryListEvent) => { setSpread(event.matches); setCurrentPage(page => event.matches ? Math.floor(page / 2) * 2 : page); }; media.addEventListener('change', change); return () => media.removeEventListener('change', change); }, []);
  useEffect(() => { if (previousPedal.current === pedal.id) return; previousPedal.current = pedal.id; setOverflowPages([]); goToPage(0); }, [pedal.id]);
  useEffect(() => { setOverflowPages([]); goToPage(0); }, [resetKey]);
  useEffect(() => { if (!spread) return; const frame = requestAnimationFrame(() => { const overflowing = Array.from(spreadRef.current?.querySelectorAll<HTMLElement>('.manual-page') || []).flatMap((page, index) => page.scrollWidth > page.clientWidth + 2 || page.scrollHeight > page.clientHeight + 2 ? [visibleStart + index] : []); if (overflowing.length) setOverflowPages(previous => [...new Set([...previous, ...overflowing])]); }); return () => cancelAnimationFrame(frame); }, [visibleStart, spread, pedal.id, coverImage]);
  useEffect(() => { const keys = (event: KeyboardEvent) => { if ((event.target as HTMLElement)?.matches('input, textarea, select')) return; if (event.key === 'ArrowLeft') goToPage(visibleStart - step); if (event.key === 'ArrowRight') goToPage(visibleStart + step); }; window.addEventListener('keydown', keys); return () => window.removeEventListener('keydown', keys); }, [visibleStart, step]);
  const image = (className: string, caption: string, alt: string) => <figure className={'editorial-photo ' + className}>{coverImage ? <img src={coverImage} alt={alt} /> : <div className="cover-photo-loading">DEVELOPING PHOTOGRAPH</div>}<figcaption>{caption}</figcaption></figure>;
  const soundKeyword = pedal.type.split(' ').slice(0, 2).join(' ');
  const openingSpread = <article className={pageClass(0, 'editorial-opening-spread')} key="opening-spread">
    <div className="opening-spread-photo">{coverImage ? <img src={coverImage} alt={pedal.name + ' の見開き宣材写真'} /> : <div className="cover-photo-loading">DEVELOPING HERO PHOTOGRAPH</div>}</div>
    <header className="opening-spread-masthead"><span>{pedal.brand?.manufacturerName || pedal.brandLabel}</span><b>{pedal.name}</b><small>ONE OF ONE / VOL. {issue}</small></header>
    <section className="opening-info-card info-sound"><span>01 / SOUND</span><b>{soundKeyword}</b><p>{pedal.copy}。</p></section>
    <section className="opening-info-card info-build"><span>02 / BUILD</span><b>{enclosureLabel}</b><p>{pedal.effectArchitecture || pedal.type}</p></section>
    <section className="opening-info-card info-control"><span>03 / CONTROL</span><b>{controlLabel}</b><p>{controlCount ? controlNames.slice(0, 5).join(' / ') : 'ONE SWITCH'}</p></section>
    <section className="opening-info-card info-use"><span>04 / PLAY</span><b>{pedal.type}</b><p>{pedal.usage}</p></section>
  </article>;
  const pages = [
    <article className={pageClass(0, 'editorial-mobile-hero')} key="cover">
      <div className="mobile-hero-photo">{coverImage ? <img src={coverImage} alt={pedal.name + ' の宣材写真'} /> : <div className="cover-photo-loading">DEVELOPING HERO PHOTOGRAPH</div>}</div>
      <div className="mobile-hero-copy"><span>{pedal.brand?.manufacturerName || pedal.brandLabel}</span><h2>{pedal.name}</h2><p>{pedal.copy}。</p></div>
    </article>,
    <article className={pageClass(1, 'editorial-mobile-facts')} key="sound">
      <div className="mobile-facts-photo">{coverImage ? <img src={coverImage} alt={pedal.name + ' の製品写真'} /> : <div className="cover-photo-loading">DEVELOPING PRODUCT PHOTOGRAPH</div>}</div>
      <div className="mobile-facts-grid"><section><span>SOUND</span><b>{soundKeyword}</b></section><section><span>BUILD</span><b>{enclosureLabel}</b></section><section><span>CONTROL</span><b>{controlLabel}</b></section><section><span>PLAY</span><b>{pedal.type}</b></section></div>
    </article>,
    <article className={pageClass(2, 'editorial-square-page')} key="design">
      <header><p className="editorial-number">03 / PRODUCT PORTRAIT</p><h3>{pedal.name}</h3><p>{controlCount ? controlNames.slice(0, 6).join(' / ') : pedal.type}</p></header>
      <figure className="editorial-square-image">{coverImage ? <img src={coverImage} alt={pedal.name + ' の正方形製品写真'} /> : <div className="cover-photo-loading">DEVELOPING SQUARE PHOTOGRAPH</div>}<figcaption>{ioLabel} / {enclosureLabel}</figcaption></figure>
    </article>,
    <article className={pageClass(3, 'editorial-package-page')} key="package">
      <PackageSetVisual pedal={pedal} coverImage={coverImage} />
      <div className="package-overlay-copy"><p className="editorial-number">04 / PACKAGE</p><h3>READY<br />TO SHIP.</h3><p>本体、箱、説明書、シリアルカード。</p></div>
    </article>,
  ];  const openingSpreadMode = spread && visibleStart === 0;
  const visiblePages = openingSpreadMode ? [openingSpread] : pages.slice(visibleStart, visibleStart + step);
  if (spread && !openingSpreadMode && visiblePages.length === 1) visiblePages.push(<article className="manual-page blank-page" key="blank" aria-hidden="true" />);  const pageLabels = ['表紙', '音のキャラクター', '操作とデザイン', 'パッケージ'];
  return <section className={`result editorial-result manual-viewer promo-${promo.layout} placement-${promo.imagePlacement} density-${promo.informationDensity}`} ref={resultRef} aria-live="polite" style={{ '--accent': pedal.palette[0], '--cover-base': pedal.palette[1], '--brand-accent': pedal.brand?.signatureColor || pedal.palette[0] } as React.CSSProperties}>
    <header className="manual-header"><div><span>04 / SHIPPED — PEDAL FORGE EDITORIAL {issue}</span><b>{pedal.name}</b></div><small>{spread ? 'DESKTOP SPREAD' : 'SINGLE PAGE'} / 4 PAGES</small></header>
    <nav className="manual-chapter-rail" aria-label="宣材ページの章">{pageLabels.map((label, index) => <button type="button" key={label} className={index >= visibleStart && index < visibleStart + step ? 'active' : ''} onClick={() => goToPage(index)}><span>{String(index + 1).padStart(2, '0')}</span><b>{label}</b></button>)}</nav>
    <div ref={spreadRef} className={'manual-spread ' + (spread ? 'is-spread' : 'is-single') + (openingSpreadMode ? ' has-opening-spread' : '')} onTouchStart={event => { swipeStart.current = event.touches[0].clientX; }} onTouchEnd={event => { if (swipeStart.current == null) return; const delta = event.changedTouches[0].clientX - swipeStart.current; if (Math.abs(delta) > 54) goToPage(visibleStart + (delta < 0 ? step : -step)); swipeStart.current = null; }}>{visiblePages.map((page, index) => <EditorialPageFrame key={openingSpreadMode ? 'opening-spread' : visibleStart + index} page={page} pageNumber={visibleStart + index + 1} hasOverflow={overflowPages.includes(visibleStart + index)} openingSpread={openingSpreadMode} />)}</div>
    <nav className="manual-pagination" aria-label="宣材ページ送り"><button type="button" onClick={() => goToPage(visibleStart - step)} disabled={visibleStart === 0} aria-label="前のページ">←</button><button type="button" className="page-index-button" onClick={() => setPageListOpen(open => !open)} aria-expanded={pageListOpen}>{spread ? `${visibleStart + 1}–${Math.min(totalPages, visibleStart + 2)} / ${totalPages}` : `${visibleStart + 1} / ${totalPages}`}</button><button type="button" onClick={() => goToPage(visibleStart + step)} disabled={visibleStart + step >= totalPages} aria-label="次のページ">→</button>{pageListOpen && <div className="manual-page-list">{pageLabels.map((label, index) => <button type="button" key={label} className={index >= visibleStart && index < visibleStart + step ? 'active' : ''} onClick={() => goToPage(index)}><span>{String(index + 1).padStart(2, '0')}</span>{label}</button>)}</div>}</nav>
    <details className="technical-details-drawer"><summary>DETAILS / 製品情報を見る</summary><dl><div><dt>MODEL</dt><dd>{pedal.modelNumber || pedal.serial}</dd></div><div><dt>TYPE</dt><dd>{pedal.type}</dd></div><div><dt>CONTROLS</dt><dd>{controlNames.join(' / ') || 'FIXED CIRCUIT'}</dd></div><div><dt>I/O</dt><dd>{(pedal.ioChannels || 'mono').toUpperCase()} / {ioLabel}</dd></div><div><dt>POWER</dt><dd>{pedal.power}</dd></div><div><dt>SIZE</dt><dd>{pedal.dimensions} / {pedal.weight}</dd></div></dl></details>
    <div className="actions editorial-actions"><button onClick={onPng}>完成品PNG</button><button onClick={onPdf}>製品情報PDF</button><button className="outline" onClick={onReforge}>同じ思想でもう一台</button></div>
  </section>;
}
const sharePresetLabels: Record<ShotPreset, string> = { hero: 'HERO', stage: 'STAGE', studio: 'STUDIO', 'editorial-cover': 'EDITORIAL', 'open-box': 'OPEN BOX', 'full-kit': 'FULL KIT', 'social-x': 'SOCIAL X' };
const sharePresets = Object.keys(sharePresetLabels) as ShotPreset[];
const normalizeHashtag = (value: string) => { const cleaned = value.trim().replace(/^#+/, '').replace(/[\s#]+/g, ''); return cleaned ? `#${cleaned}` : ''; };
const shareSuggestionsFor = (pedal: Pedal) => {
  const effectTag: Partial<Record<EffectCategory, string>> = { fuzz: '#Fuzz', delay: '#Delay', reverb: '#Reverb', drive: '#Overdrive', modulation: '#Modulation', synth: '#Synth', compressor: '#Compressor', filter: '#Filter' };
  const sourceTags: Partial<Record<InputSource, string>> = { guitar: '#ギター', bass: '#ベース', 'synth-keys': '#シンセ', 'drum-sampler': '#ドラムマシン', 'acoustic-piezo': '#アコースティック', 'electric-strings': '#弦楽器' };
  return [...new Set([effectTag[categoryFor(pedal.type)], ...(pedal.inputSources || []).map(source => sourceTags[source])].filter((tag): tag is string => Boolean(tag)))];
};
const loadShareImage = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = url; });
const canvasBlob = (canvas: HTMLCanvasElement) => new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG_ENCODE_FAILED')), 'image/png'));
const drawCoverImage = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) => { const scale = Math.min(width / image.width, height / image.height); const drawWidth = image.width * scale; const drawHeight = image.height * scale; ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight); };
const drawFittedCanvasText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, maxSize: number, minSize: number, family = 'Arial') => { let size = maxSize; do { ctx.font = `900 ${size}px ${family}`; if (ctx.measureText(text).width <= maxWidth) break; size -= 2; } while (size > minSize); ctx.fillText(text, x, y); };
async function createShareShot(pedal: Pedal, sourceImage: string, preset: ShotPreset): Promise<Blob> {
  const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = preset === 'social-x' || preset === 'open-box' || preset === 'full-kit' ? 675 : 1200;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('CANVAS_UNAVAILABLE');
  const accent = pedal.palette[0]; const base = pedal.palette[1];
  const image = sourceImage ? await loadShareImage(sourceImage).catch(() => null) : null;
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); gradient.addColorStop(0, preset === 'studio' ? '#f4f3ee' : base); gradient.addColorStop(1, preset === 'studio' ? '#d9ddd6' : '#090d0a'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (preset === 'open-box' || preset === 'full-kit') {
    ctx.save(); ctx.translate(80, 28); ctx.fillStyle = '#6f5942'; ctx.beginPath(); ctx.moveTo(65, 185); ctx.lineTo(725, 96); ctx.lineTo(915, 230); ctx.lineTo(248, 335); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#bda98b'; ctx.beginPath(); ctx.moveTo(90, 205); ctx.lineTo(720, 126); ctx.lineTo(865, 226); ctx.lineTo(245, 310); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#342c23'; ctx.beginPath(); ctx.moveTo(180, 310); ctx.lineTo(905, 240); ctx.lineTo(1010, 515); ctx.lineTo(265, 585); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#151914'; ctx.beginPath(); ctx.moveTo(225, 338); ctx.lineTo(850, 280); ctx.lineTo(928, 485); ctx.lineTo(302, 545); ctx.closePath(); ctx.fill();
    if (image) { ctx.save(); ctx.beginPath(); ctx.moveTo(285, 350); ctx.lineTo(765, 305); ctx.lineTo(820, 465); ctx.lineTo(340, 510); ctx.closePath(); ctx.clip(); drawCoverImage(ctx, image, 270, 285, 570, 250); ctx.restore(); }
    ctx.restore(); ctx.save(); ctx.translate(870, 360); ctx.rotate(-.055); ctx.fillStyle = '#f0ede4'; ctx.shadowColor = 'rgba(0,0,0,.28)'; ctx.shadowBlur = 18; ctx.fillRect(0, 0, 220, 255); ctx.fillStyle = '#171b17'; ctx.font = '700 22px Arial'; ctx.fillText("OWNER'S MANUAL", 22, 38); ctx.font = '700 30px Arial'; ctx.fillText(pedal.name.slice(0, 13), 22, 86); ctx.fillStyle = accent; ctx.fillRect(22, 112, 130, 8); ctx.restore(); ctx.save(); ctx.translate(900, 560); ctx.rotate(.035); ctx.fillStyle = '#171b17'; ctx.fillRect(0, 0, 230, 75); ctx.fillStyle = '#f4f1e8'; ctx.font = '700 18px monospace'; ctx.fillText('SERIAL / ONE OF ONE', 16, 26); ctx.fillText(pedal.serial.slice(0, 20), 16, 54); ctx.restore();
  } else if (image) {
    const imageArea = preset === 'editorial-cover' ? { x: 390, y: 70, width: 740, height: canvas.height - 140 } : preset === 'social-x' ? { x: 470, y: 40, width: 690, height: 595 } : { x: 90, y: 110, width: 1020, height: 870 };
    drawCoverImage(ctx, image, imageArea.x, imageArea.y, imageArea.width, imageArea.height);
  }
  ctx.fillStyle = preset === 'studio' ? '#151915' : '#f3f5ed'; drawFittedCanvasText(ctx, pedal.brand?.manufacturerName || pedal.brandLabel || 'FURNACE AUDIO WORKS', 64, 64, canvas.width - 128, 26, 16); ctx.fillStyle = accent; ctx.fillRect(64, 82, 145, 9);
  if (preset === 'social-x' || preset === 'editorial-cover') { ctx.fillStyle = '#f3f5ed'; const words = pedal.name.replace(' // LIMITED', '').split(' '); words.slice(0, 3).forEach((word, index) => drawFittedCanvasText(ctx, word, 64, 200 + index * 78, 350, 72, 38)); ctx.font = '700 25px monospace'; ctx.fillStyle = accent; drawFittedCanvasText(ctx, pedal.type.toUpperCase(), 66, 475, 350, 25, 16, 'monospace'); }
  ctx.fillStyle = preset === 'studio' ? '#151915' : '#f3f5ed'; ctx.font = '900 34px Arial'; ctx.fillText('PEDAL FORGE', 64, canvas.height - 48); ctx.font = '700 19px monospace'; ctx.fillStyle = accent; ctx.fillText(sharePresetLabels[preset], canvas.width - 210, canvas.height - 50);
  return canvasBlob(canvas);
}
function downloadShareFile(file: File) { const url = URL.createObjectURL(file); const anchor = document.createElement('a'); anchor.href = url; anchor.download = file.name; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
function SharePanel({ pedal, sourceImage, onNotice }: { pedal: Pedal; sourceImage: string; onNotice: (message: string) => void }) {
  const fixedTags = ['#PEDALFORGE', '#エフェクター錬成']; const suggestions = useMemo(() => shareSuggestionsFor(pedal), [pedal]);
  const [body, setBody] = useState(`PEDAL FORGEで「${pedal.name.replace(' // LIMITED', '')}」を錬成しました。\n${pedal.type} / ${inputSourceSummary(pedal.inputSources?.length ? pedal.inputSources : ['guitar'])}`);
  const [selectedTags, setSelectedTags] = useState<string[]>(suggestions); const [customTags, setCustomTags] = useState(''); const [preset, setPreset] = useState<ShotPreset>('social-x'); const [preview, setPreview] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { setBody(`PEDAL FORGEで「${pedal.name.replace(' // LIMITED', '')}」を錬成しました。\n${pedal.type} / ${inputSourceSummary(pedal.inputSources?.length ? pedal.inputSources : ['guitar'])}`); setSelectedTags(shareSuggestionsFor(pedal)); setCustomTags(''); setPreset('social-x'); }, [pedal.id]);
  useEffect(() => { let active = true; let url = ''; void createShareShot(pedal, sourceImage, preset).then(blob => { if (!active) return; url = URL.createObjectURL(blob); setPreview(url); }).catch(() => setPreview('')); return () => { active = false; if (url) URL.revokeObjectURL(url); }; }, [pedal, sourceImage, preset]);
  const tags = [...fixedTags, ...selectedTags, ...customTags.split(/[\s,、]+/).map(normalizeHashtag).filter(Boolean)]; const text = [body.trim(), [...new Set(tags)].join(' ')].filter(Boolean).join('\n\n');
  const makeFile = async () => { const blob = await createShareShot(pedal, sourceImage, preset); return new File([blob], `${pedal.serial}-${preset}.png`, { type: 'image/png' }); };
  const savePng = async () => { setBusy(true); try { downloadShareFile(await makeFile()); onNotice('SHARE PNG SAVED'); } catch { onNotice('PNG EXPORT FAILED'); } finally { setBusy(false); } };
  const copyText = async () => { try { await navigator.clipboard?.writeText(text); onNotice('POST TEXT COPIED'); } catch { onNotice('COPY FAILED'); } };
  const share = async () => { setBusy(true); try { const file = await makeFile(); const shareData: ShareData = { files: [file], text, title: `${pedal.name} / PEDAL FORGE` }; if (navigator.share && navigator.canShare?.({ files: [file] })) { await navigator.share(shareData); onNotice('SHARE SHEET OPENED'); } else { downloadShareFile(file); try { await navigator.clipboard?.writeText(text); } catch { /* clipboard may be unavailable */ } const anchor = document.createElement('a'); anchor.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; anchor.click(); onNotice('PNG SAVED / POST TEXT COPIED / X OPENED'); } } catch (error) { if ((error as DOMException)?.name !== 'AbortError') onNotice('SHARE FAILED'); } finally { setBusy(false); } };
  return <section className="share-panel share-quiet-editorial" aria-labelledby="share-title">
    <header className="share-hero-copy"><span>FINAL STEP / 09</span><h2 id="share-title">THIS PEDAL<br />IS READY TO LEAVE.</h2><p>完成した一台を、画像と投稿文に整えてXへ送り出します。</p></header>
    <div className="share-grid"><div className="share-visual-column"><div className="share-preview">{preview ? <img src={preview} alt={`${sharePresetLabels[preset]}共有画像プレビュー`} /> : <span>DEVELOPING SOCIAL PHOTOGRAPH…</span>}</div><div className="share-presets" aria-label="共有画像の構図">{sharePresets.map(option => <button type="button" key={option} className={preset === option ? 'active' : ''} onClick={() => setPreset(option)}><span>{String(sharePresets.indexOf(option) + 1).padStart(2, '0')}</span>{sharePresetLabels[option]}</button>)}</div></div>
      <div className="share-editor"><div className="share-editor-section"><div className="share-editor-label"><b>POST TEXT</b><span>{text.length} / 280</span></div><textarea value={body} onChange={event => setBody(event.target.value)} rows={7} aria-label="X投稿文" /></div>
        <div className="share-tags share-editor-section"><div className="share-editor-label"><b>HASHTAGS</b><span>クリックで追加・解除</span></div><div>{fixedTags.map(tag => <button type="button" key={tag} className="locked" aria-pressed="true" title="固定ハッシュタグ">{tag}</button>)}{suggestions.map(tag => <button type="button" key={tag} className={selectedTags.includes(tag) ? 'active' : ''} aria-pressed={selectedTags.includes(tag)} onClick={() => setSelectedTags(current => current.includes(tag) ? current.filter(item => item !== tag) : [...current, tag])}>{tag}</button>)}</div><input value={customTags} onChange={event => setCustomTags(event.target.value)} placeholder="#追加タグ" aria-label="追加ハッシュタグ" /></div>
        <button type="button" className="share-primary" onClick={share} disabled={busy}>{busy ? 'SHARE IMAGEを生成中…' : 'この一台をXへ送る →'}</button><div className="share-secondary-actions"><button type="button" onClick={savePng} disabled={busy}>PNGを保存</button><button type="button" onClick={copyText}>投稿文をコピー</button></div><p className="share-fallback-note">画像共有非対応の環境では、PNG保存 → 投稿文コピー → X投稿画面の順に開きます。</p>
      </div></div>
  </section>;
}
const stored = (): Pedal[] => { try { return JSON.parse(localStorage.getItem('pedal-gacha-v2') || '[]'); } catch { return []; } };
const storedMarks = (): Record<string, PedalMark> => { try { return JSON.parse(localStorage.getItem('pedal-gacha-marks-v1') || '{}'); } catch { return {}; } };
const storedBrand = (): BrandProfile => { try { const value = localStorage.getItem('pedal-gacha-brand-v1'); return value ? JSON.parse(value) : createBrandProfile('first-forge-maker'); } catch { return createBrandProfile('first-forge-maker'); } };
const similarityScore = (a: Pedal, b: Pedal) => [a.enclosure === b.enclosure, a.knobs.length === b.knobs.length, a.controlVariant === b.controlVariant, a.knobStyle === b.knobStyle, a.designArchetype === b.designArchetype, a.namingPattern === b.namingPattern, a.promoDirection?.layout === b.promoDirection?.layout, a.motifType === b.motifType, a.motifCategory === b.motifCategory, a.palette?.[1] === b.palette?.[1]].filter(Boolean).length;
export default function App() {
  const [brandProfile, setBrandProfile] = useState<BrandProfile>(storedBrand); const [inputSources, setInputSources] = useState<InputSource[]>([]); const [effectType, setEffectType] = useState<EffectTypeChoice>('random'); const [sound, setSound] = useState<ToneChoice>('random'); const [colorChoice, setColor] = useState<FinishChoice>('random'); const mood: MoodChoice = 'random'; const [phase, setPhase] = useState<GachaState>('idle'); const [workflow, setWorkflow] = useState<WorkflowPhase>('select'); const [forgeStep, setForgeStep] = useState('思想を選択してください'); const [pedal, setPedal] = useState<Pedal | null>(null); const [collection, setCollection] = useState<Pedal[]>(stored); const [drawer, setDrawer] = useState(false); const [notice, setNotice] = useState(''); const [reduce, setReduce] = useState(false); const [viewReset, setViewReset] = useState(0); const [manualReset, setManualReset] = useState(0); const [viewMode, setViewMode] = useState<ViewMode>('stage'); const [runtimeMode, setRuntimeMode] = useState<RuntimeMode>('off'); const [coverImage, setCoverImage] = useState(''); const [userGraphic, setUserGraphic] = useState<UserGraphic | null>(null); const [graphicError, setGraphicError] = useState(''); const [marks, setMarks] = useState<Record<string, PedalMark>>(storedMarks); const [markEditorOpen, setMarkEditorOpen] = useState(false); const [inspectSurface, setInspectSurface] = useState<MarkSurface>('front'); const canvasRef = useRef<HTMLCanvasElement | null>(null); const resultRef = useRef<HTMLElement>(null); const stageRef = useRef<HTMLElement>(null);
  const soundEnabled = true; const [autoRotate, setAutoRotate] = useState(false);
  const forgeAudioRef = useRef<{ context: AudioContext; rumble?: { gain: GainNode; sources: AudioScheduledSourceNode[] } } | null>(null);
  const getForgeAudio = () => { if (!soundEnabled || typeof window === 'undefined') return null; let current = forgeAudioRef.current; if (!current) { current = { context: new AudioContext() }; forgeAudioRef.current = current; } if (current.context.state === 'suspended') void current.context.resume(); return current; };
  const stopForgeRumble = (release = .08) => { const current = forgeAudioRef.current; const rumble = current?.rumble; if (!current || !rumble) return; const now = current.context.currentTime; rumble.gain.gain.cancelScheduledValues(now); rumble.gain.gain.setTargetAtTime(.0001, now, Math.max(.015, release)); rumble.sources.forEach(source => { try { source.stop(now + release * 4 + .06); } catch { /* already stopped */ } }); current.rumble = undefined; };
  const startForgeRumble = () => { const audio = getForgeAudio(); if (!audio) return; stopForgeRumble(0); const { context } = audio; const now = context.currentTime; const gain = context.createGain(); const filter = context.createBiquadFilter(); const low = context.createOscillator(); const body = context.createOscillator(); const tremolo = context.createOscillator(); const tremoloDepth = context.createGain(); low.type = 'sawtooth'; low.frequency.setValueAtTime(43, now); low.frequency.linearRampToValueAtTime(58, now + 2.6); body.type = 'sine'; body.frequency.setValueAtTime(67, now); body.detune.value = -9; tremolo.frequency.value = 8.4; tremoloDepth.gain.value = .022; filter.type = 'lowpass'; filter.frequency.value = 210; filter.Q.value = 5; gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.085, now + .34); tremolo.connect(tremoloDepth).connect(gain.gain); low.connect(filter); body.connect(filter); filter.connect(gain).connect(context.destination); low.start(now); body.start(now); tremolo.start(now); audio.rumble = { gain, sources: [low, body, tremolo] }; };
  const playForgeFlash = () => { const audio = getForgeAudio(); if (!audio) return; const { context } = audio; const now = context.currentTime; const shimmer = context.createOscillator(); const shimmerGain = context.createGain(); shimmer.type = 'sine'; shimmer.frequency.setValueAtTime(720, now); shimmer.frequency.exponentialRampToValueAtTime(2800, now + .22); shimmerGain.gain.setValueAtTime(.0001, now); shimmerGain.gain.exponentialRampToValueAtTime(.12, now + .018); shimmerGain.gain.exponentialRampToValueAtTime(.0001, now + .55); shimmer.connect(shimmerGain).connect(context.destination); shimmer.start(now); shimmer.stop(now + .58); const buffer = context.createBuffer(1, Math.floor(context.sampleRate * .36), context.sampleRate); const data = buffer.getChannelData(0); for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2); const noise = context.createBufferSource(); const band = context.createBiquadFilter(); const noiseGain = context.createGain(); noise.buffer = buffer; band.type = 'bandpass'; band.frequency.value = 1750; band.Q.value = 1.8; noiseGain.gain.setValueAtTime(.08, now); noiseGain.gain.exponentialRampToValueAtTime(.0001, now + .34); noise.connect(band).connect(noiseGain).connect(context.destination); noise.start(now); };
  const playForgeComplete = () => { const audio = getForgeAudio(); if (!audio) return; const { context } = audio; const now = context.currentTime; const tone = context.createOscillator(); const gain = context.createGain(); tone.type = 'triangle'; tone.frequency.setValueAtTime(420, now); tone.frequency.exponentialRampToValueAtTime(180, now + .24); gain.gain.setValueAtTime(.07, now); gain.gain.exponentialRampToValueAtTime(.0001, now + .32); tone.connect(gain).connect(context.destination); tone.start(now); tone.stop(now + .34); };
  useEffect(() => () => { stopForgeRumble(.02); const context = forgeAudioRef.current?.context; if (context && context.state !== 'closed') void context.close(); }, []);  const activeMark = pedal ? marks[pedal.id] ?? defaultMark : defaultMark;
  useEffect(() => { const q = matchMedia('(prefers-reduced-motion: reduce)'); setReduce(q.matches); const fn = () => setReduce(q.matches); q.addEventListener('change', fn); return () => q.removeEventListener('change', fn); }, []);
  useEffect(() => { localStorage.setItem('pedal-gacha-v2', JSON.stringify(collection)); }, [collection]);
  useEffect(() => { localStorage.setItem('pedal-gacha-marks-v1', JSON.stringify(marks)); }, [marks]);
  useEffect(() => { localStorage.setItem('pedal-gacha-brand-v1', JSON.stringify(brandProfile)); }, [brandProfile]);
  useEffect(() => {
    if (!userGraphic) return; let cancelled = false; const palette = colorChoice === 'random' ? paletteFamilies.acid[0] : paletteFamilies[colorChoice][0];
    renderGraphicTexture(userGraphic, palette).then(textureUrl => { if (!cancelled) setUserGraphic(current => current?.sourceUrl === userGraphic.sourceUrl ? { ...current, textureUrl } : current); }).catch(() => { if (!cancelled) setGraphicError('画像の加工プレビューを作成できませんでした。'); });
    return () => { cancelled = true; };
  }, [userGraphic?.sourceUrl, userGraphic?.usageMode, userGraphic?.placementMode, userGraphic?.transformStyle, userGraphic?.transformStrength, userGraphic?.colorBehavior, userGraphic?.variant, colorChoice]);
  const selectGraphic = (file: File) => {
    setGraphicError(''); if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return setGraphicError('PNG / JPG / WEBPを選択してください。'); if (file.size > 15 * 1024 * 1024) return setGraphicError('画像は15MB以下にしてください。');
    const reader = new FileReader(); reader.onerror = () => setGraphicError('画像ファイルを読み込めませんでした。'); reader.onload = () => { const sourceUrl = String(reader.result || ''); const image = new Image(); image.onerror = () => setGraphicError('画像ファイルが破損している可能性があります。'); image.onload = () => { setUserGraphic({ fileName: file.name, mimeType: file.type, width: image.naturalWidth, height: image.naturalHeight, sourceUrl, textureUrl: sourceUrl, usageMode: 'auto', placementMode: 'auto', transformStyle: 'auto', transformStrength: 'medium', colorBehavior: 'preserve', variant: 0 }); if (image.naturalWidth < 320 || image.naturalHeight < 320) setGraphicError('小さい画像のため、全面配置では粗く見える可能性があります。'); }; image.src = sourceUrl; }; reader.readAsDataURL(file);
  };
  const changeGraphic = (patch: Partial<UserGraphic>) => setUserGraphic(current => current ? { ...current, ...patch } : current);
  const changeMark = (next: PedalMark) => { if (!pedal) return; setMarks(current => ({ ...current, [pedal.id]: next })); setViewReset(value => value + 1); };
  useEffect(() => { if (phase === 'result' && resultRef.current && !reduce) gsap.fromTo(resultRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .65, ease: 'power3.out' }); }, [phase, reduce]);
  useEffect(() => { if (phase !== 'result' || !pedal) return; const timer = window.setTimeout(() => { try { const image = canvasRef.current?.toDataURL('image/jpeg', .9); if (image) setCoverImage(image); } catch { setCoverImage(''); } }, reduce ? 220 : 620); return () => window.clearTimeout(timer); }, [phase, pedal, viewMode, runtimeMode, viewReset, reduce]);
  const run = () => {
    const baseSeed = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
    let input: ForgeInput = { inputSources, effectType, sound, mood, colorChoice, seed: baseSeed, brand: brandProfile };
    let standard = generate(input);
    const recentPromoLayouts = new Set(collection.slice(0, 5).map(previous => previous.promoDirection?.layout).filter(Boolean));
    const recentMotifKeys = new Set(collection.slice(0, 8).map(previous => previous.motifType).filter(Boolean));
    const recentMotifCategories = new Set(collection.slice(0, 3).map(previous => previous.motifCategory).filter(Boolean));
    const normalizeProductName = (value: string) => value.toUpperCase().replace('NOGORI', 'NAGORI').replace(/\s*\/\/\s*LIMITED$/, '').replace(/[^A-Z0-9一-龠々]/g, '');
    const recentNames = new Set(collection.slice(0, 20).map(previous => normalizeProductName(previous.name)));
    const recentSingleKanji = new Set(collection.slice(0, 12).map(previous => previous.kanjiTerm).filter(term => term?.length === 1));
    const recentDoubleKanji = new Set(collection.slice(0, 20).map(previous => previous.kanjiTerm).filter(term => term?.length === 2));
    const recentKanjiCharacters = new Set(collection.slice(0, 5).flatMap(previous => [...(previous.kanjiTerm || '')]));
    const repeatsKanji = (candidate: Pedal) => Boolean(candidate.kanjiTerm && ((candidate.kanjiTerm.length === 1 ? recentSingleKanji : recentDoubleKanji).has(candidate.kanjiTerm) || [...candidate.kanjiTerm].some(character => recentKanjiCharacters.has(character))));
    for (let attempt = 1; attempt <= 96 && (collection.slice(0, 8).some(previous => similarityScore(standard, previous) >= 4) || recentPromoLayouts.has(standard.promoDirection?.layout) || recentMotifKeys.has(standard.motifType) || recentMotifCategories.has(standard.motifCategory) || recentNames.has(normalizeProductName(standard.name)) || repeatsKanji(standard) || collection[0]?.namingFamily === standard.namingFamily); attempt++) {
      input = { ...input, seed: `${baseSeed}-${attempt}` };
      standard = generate(input);
    }
    let p = standard;
    if (userGraphic) p = { ...p, customGraphic: { sourceName: userGraphic.fileName, treatment: resolvedGraphicStyle(userGraphic).toUpperCase(), placement: resolvedGraphicPlacement(userGraphic, p.knobs.length).toUpperCase(), preservation: userGraphic.usageMode.toUpperCase() } };
    setPedal(p); setCoverImage(''); setViewMode('stage'); setRuntimeMode('off'); setInspectSurface('front'); setMarkEditorOpen(false); setAutoRotate(false); setWorkflow('forging'); setForgeStep('音の性質を抽出中'); startForgeRumble(); setPhase('cranking');
    requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));
    const complete = () => { stopForgeRumble(.12); playForgeComplete(); setForgeStep('錬成完了'); setRuntimeMode('play'); setPhase('result'); setWorkflow('forged'); setCollection(current => current.some(item => item.id === p.id) ? current : [p, ...current].slice(0, 24)); };
    if (reduce) return void window.setTimeout(complete, 160);
    window.setTimeout(() => setForgeStep('回路モデルを安定化中'), 560);
    window.setTimeout(() => setForgeStep('筐体を鋳造中'), 1120);
    window.setTimeout(() => { stopForgeRumble(.18); playForgeFlash(); setPhase('revealing'); }, 1450);
    window.setTimeout(() => setForgeStep('操作部品を配置中'), 1740);
    window.setTimeout(() => setForgeStep(userGraphic ? '画像素材を定着中' : '意匠を定着中'), 2380);
    window.setTimeout(complete, 3150);
  };
  const beginFinishing = () => { setWorkflow('finishing'); setMarkEditorOpen(true); setAutoRotate(false); requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })); };
  const ship = () => {
    if (!pedal || workflow === 'shipping') return;
    setMarkEditorOpen(false); setWorkflow('shipping'); setManualReset(value => value + 1);
    const complete = () => { setWorkflow('shipped'); requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })); };
    window.setTimeout(complete, reduce ? 80 : 720);
  };
  const png = () => { const url = canvasRef.current?.toDataURL('image/png'); if (!url) return setNotice('PNG EXPORT IS UNAVAILABLE'); const a = document.createElement('a'); a.href = url; a.download = `${pedal?.serial || 'pedal'}.png`; a.click(); };
  const pdf = async () => {
    if (!pedal) return; await document.fonts?.ready; const sheet = document.createElement('canvas'); sheet.width = 1240; sheet.height = 1754; const ctx = sheet.getContext('2d'); if (!ctx) return setNotice('PDF EXPORT IS UNAVAILABLE');
    ctx.fillStyle = '#0c0f0c'; ctx.fillRect(0, 0, sheet.width, sheet.height); ctx.fillStyle = '#c7ff1a'; ctx.font = '700 45px Arial, sans-serif'; ctx.fillText('PEDAL FORGE / ALCHEMY SPECIFICATION', 92, 115); ctx.fillStyle = '#edf2e8'; ctx.font = '700 68px Arial, sans-serif'; ctx.fillText(pedal.name, 92, 215); ctx.strokeStyle = '#47513f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(92, 260); ctx.lineTo(1148, 260); ctx.stroke();
    const lines = [`MAKER  ${pedal.brand?.manufacturerName || pedal.brandLabel || 'FURNACE AUDIO WORKS'}`, `MODEL  ${pedal.modelNumber || pedal.serial}`, `TYPE  ${pedal.type}`, `INPUT SOURCE  ${inputSourceSummary(pedal.inputSources?.length ? pedal.inputSources : pedal.instrument === 'both' ? ['guitar', 'bass'] : [pedal.instrument])}`, `SIGNAL  ${pedal.signalProfile ? `${pedal.signalProfile.level} / ${pedal.signalProfile.headroom} headroom / ${pedal.ioChannels || 'mono'}` : 'instrument / standard headroom / mono'}`, `NAMING  ${(pedal.namingFamily || pedal.namingPattern || 'english').toUpperCase()}${pedal.kanjiTerm ? ` / ${pedal.kanjiTerm} / ${pedal.kanjiUsage}` : ''}`, `ARCHITECTURE  ${pedal.effectArchitecture || pedal.type}`, `GROUPS  ${pedal.controlGroups?.map(group => `${group.name}: ${group.controls.join(' / ')}`).join(' | ') || 'SINGLE CONTROL GROUP'}`, `SERIAL  ${pedal.serial}`, `CONCEPT  ${pedal.copy}`, `HARDWARE CULTURE  ${pedal.hardwareCulture || 'CLASSIC STOMP'}`, `ENCLOSURE  ${enclosureDimensions[pedal.enclosure].label}`, `CONDITION  ${pedal.condition || 'FACTORY NEW'}`, `MATERIAL  ${(pedal.materialStyle || 'powder').toUpperCase()}`, `GRAPHICS  ${pedal.graphicMode || 'MINIMAL'} / ${pedal.artDirection || 'MINIMAL SYMBOL'}`, `TYPOGRAPHY  ${(pedal.typography?.mode || 'standard').toUpperCase()} / ${(pedal.typography?.displayFontCategory || 'modern_sans').toUpperCase()}`, `LAYOUT  ${pedal.layoutChecks?.join(' / ') || 'CONTROL CLEARANCE / LABEL CLEARANCE / FOOT AREA'}`, `DESIGN CHECK  ${pedal.designScore || 82} / 100`, `CONTROLS  ${(pedal.controlLayoutMode || 'knob-only').toUpperCase()} / ${[...pedal.knobs, ...(pedal.eqSliders?.map(slider => slider.label) || [])].join(' / ') || 'FIXED CIRCUIT'}`, `FOOT / LED  ${(pedal.footswitchStyle || 'metal').toUpperCase()} / ${indicatorSummary(pedal)}`, `I/O  ${pedal.jackLayout === 'top' ? 'TOP PAIR' : pedal.jackLayout === 'hybrid' ? 'SIDE OUTPUT / TOP INPUT' : 'SIDE L/R'} / ${(pedal.extraPort || 'none').toUpperCase()}`, `SPECIAL  ${pedal.special}`, `BYPASS  ${pedal.bypass}`, `POWER  ${pedal.power} / ${(pedal.powerPlacement || 'top').toUpperCase()}`, `SIZE  ${pedal.dimensions}   WEIGHT  ${pedal.weight}`, `RECOMMENDED  ${pedal.usage}`, `CAUTION  ${pedal.warning}`];
    if (pedal.customGraphic) lines.push(`CUSTOM GRAPHIC  ${pedal.customGraphic.sourceName} / ${pedal.customGraphic.treatment} / ${pedal.customGraphic.placement}`); if (activeMark.enabled && activeMark.text.trim()) lines.push(`OWNER MARK  ${activeMark.text} / ${activeMark.surface.toUpperCase()} / ${activeMark.style.toUpperCase()}`);
    let y = 325; ctx.font = '30px Arial, sans-serif'; for (const line of lines) { let row = ''; for (const char of line) { const next = row + char; if (ctx.measureText(next).width > 1030) { ctx.fillText(row, 92, y); row = char; y += 40; } else row = next; } ctx.fillText(row, 92, y); y += 64; } ctx.fillStyle = pedal.palette[0]; ctx.fillRect(92, 1600, 1056, 10); ctx.fillStyle = '#8f9a89'; ctx.font = '24px Arial, sans-serif'; ctx.fillText(`ONE OF ONE FORGED SOUND MACHINE${pedal.owner ? ` / ${pedal.owner}` : ''}`, 92, 1665); const doc = new jsPDF({ unit: 'mm', format: 'a4' }); doc.addImage(sheet.toDataURL('image/png'), 'PNG', 0, 0, 210, 297); doc.save(`${pedal.serial}.pdf`);
  };
  const toggleInputSource = (source: InputSource) => setInputSources(current => current.includes(source) ? current.filter(item => item !== source) : [...current, source]);
  return <main>
    <header><a className="brand" href="#top">PEDAL <i>FORGE</i></a><button className="collection-button" onClick={() => setDrawer(true)}>ARCHIVE <b>{collection.length}</b></button></header>
    <section className="hero" id="top">
      <div className="intro">
        <p className="eyebrow">ORIGINAL EFFECTS PEDAL GENERATOR</p><h1>CREATE YOUR<br /><em>OWN PEDAL.</em></h1>
        <p className="hero-declaration">まだ存在しない、あなただけのエフェクターを。</p>
        <p className="lede">筐体・ノブ・接続端子・グラフィック・回路仕様まで組み合わせ、実在しそうなオリジナルエフェクターを一台ずつ生成します。</p>
        <div className="form">
          <div className="workflow-location selection-location"><span>01 / SELECT</span><b>選択</b><small>音と外観の思想を決める</small></div>
          <div className="forge-select-grid">
            <details className="forge-dropdown input-source-dropdown">
              <summary><span>INPUT SOURCE</span><b>{inputSources.length ? inputSourceSummary(inputSources) : 'おまかせ'}</b><i aria-hidden="true">⌄</i></summary>
              <div className="forge-dropdown-panel">
                <button type="button" className={inputSources.length === 0 ? 'active' : ''} onClick={() => setInputSources([])} aria-pressed={inputSources.length === 0}>おまかせ</button>
                {(Object.entries(inputSourceLabels) as [InputSource, string][]).map(([source, label]) => <button key={source} type="button" className={inputSources.includes(source) ? 'active' : ''} onClick={() => toggleInputSource(source)} aria-pressed={inputSources.includes(source)}>{label}</button>)}
              </div>
            </details>
            <label className="forge-select-field"><span>EFFECT TYPE</span><select value={effectType} onChange={event => setEffectType(event.target.value as EffectTypeChoice)}>
              <option value="random">おまかせ</option>
              <optgroup label="GAIN / DYNAMICS"><option value="boost">BOOST</option><option value="drive">DRIVE</option><option value="fuzz">FUZZ</option><option value="compressor">COMP / LIMITER</option></optgroup>
              <optgroup label="FILTER / MODULATION"><option value="eq-filter">EQ / FILTER</option><option value="modulation">CHORUS / FLANGER</option><option value="phaser">PHASER</option><option value="tremolo">TREMOLO / VIBRATO</option></optgroup>
              <optgroup label="SPACE / DIGITAL / SPECIAL"><option value="delay">DELAY / ECHO</option><option value="reverb">REVERB</option><option value="pitch">OCTAVE / PITCH</option><option value="synth">SYNTH</option><option value="looper">LOOPER / FREEZE</option><option value="glitch">GLITCH / NOISE</option><option value="experimental">EXPERIMENTAL</option><option value="multi">MULTI EFFECT</option></optgroup>
            </select><small>回路系統</small></label>
            <label className="forge-select-field"><span>TONE ESSENCE</span><select value={sound} onChange={event => setSound(event.target.value as typeof sound)}><option value="random">おまかせ</option><option value="clarity">透明</option><option value="loud">轟音</option><option value="broken">壊れた音</option><option value="cosmic">宇宙的</option></select><small>音の核</small></label>
            <label className="forge-select-field"><span>FINISH AURA</span><select value={colorChoice} onChange={event => setColor(event.target.value as typeof colorChoice)}><option value="random">おまかせ</option><option value="acid">ACID</option><option value="violet">VIOLET</option><option value="ice">ICE</option><option value="ember">EMBER</option></select><small>外装の色調</small></label>
          </div>          <section className="maker-card" aria-label="現在のメーカー"><div><span>CURRENT MAKER</span><h3>{brandProfile.manufacturerName}</h3><p>{brandProfile.seriesName} / {brandProfile.archetype.toUpperCase()}</p></div><button type="button" onClick={() => setBrandProfile(createBrandProfile(`maker-${Date.now()}-${Math.random()}`))}>新しいメーカーを設立</button></section>
          <CustomGraphicEditor graphic={userGraphic} error={graphicError} onFile={selectGraphic} onChange={changeGraphic} onRemove={() => { setUserGraphic(null); setGraphicError(''); }} />
          <button className="generate forge-primary-cta" onClick={run} disabled={phase === 'cranking' || phase === 'revealing'}><span className="generate-copy"><b>{phase === 'idle' || phase === 'result' ? 'この思想から一台を錬成する' : 'FORGING...'}</b><small>{phase === 'idle' || phase === 'result' ? '02 / 錬成 — FORGE A NEW EFFECTS PEDAL' : forgeStep}</small></span><strong aria-hidden="true">→</strong></button>
        </div>
      </div>
    </section>
    <div className="forge-divider" aria-hidden="true"><span>DESCEND TO THE FORGING CHAMBER</span></div>
    <section id="forging-stage" ref={stageRef} className={'stage-wrap phase-' + phase + ' view-' + viewMode + (workflow === 'forged' || workflow === 'finishing' ? ' has-finish-rail' : '') + (workflow === 'finishing' ? ' is-editing' : '')}>
      <div className="workflow-location"><span>02 / FORGE</span><b>錬成</b></div><div className="stage-label">{phase === 'idle' ? 'NO PEDAL YET / SELECT PARAMETERS' : phase === 'result' ? 'ALCHEMY COMPLETE / DRAG 360° / WHEEL TO ZOOM' : forgeStep}</div>
      <Stage pedal={pedal} phase={phase} canvasRef={canvasRef} reduce={reduce} resetToken={viewReset} viewMode={viewMode} runtimeMode={runtimeMode} userGraphic={userGraphic} mark={activeMark} inspectSurface={inspectSurface} autoRotate={autoRotate} directMarkEditing={workflow === 'finishing'} onMarkChange={changeMark} />
      {phase === 'result' && <><div className="stage-control-panel">
        <div className="mode-switch" aria-label="背景"><span>BACKGROUND</span>{(['stage', 'white', 'dark'] as ViewMode[]).map(mode => <button key={mode} className={viewMode === mode ? 'active' : ''} onClick={() => { setViewMode(mode); setViewReset(v => v + 1); }}>{mode.toUpperCase()}</button>)}</div>
        <div className="mode-switch" aria-label="撮影背景"><span>PHOTO</span>{(['studio', 'hero'] as ViewMode[]).map(mode => <button key={mode} className={viewMode === mode ? 'active' : ''} onClick={() => { setViewMode(mode); setViewReset(v => v + 1); }}>{mode.toUpperCase()}</button>)}</div>
        <div className="mode-switch" aria-label="360度ビュー"><span>360° VIEW</span><button className={!autoRotate ? 'active' : ''} onClick={() => setAutoRotate(false)}>DRAG</button><button className={autoRotate ? 'active' : ''} onClick={() => setAutoRotate(true)}>AUTO</button></div>
        <div className="mode-switch runtime-switch" aria-label="稼働状態"><span>POWER</span>{(['off', 'on', 'play'] as RuntimeMode[]).map(mode => <button key={mode} className={runtimeMode === mode ? 'active' : ''} onClick={() => setRuntimeMode(mode)}>{mode.toUpperCase()}</button>)}</div>
      </div><button className="view-reset" onClick={() => setViewReset(v => v + 1)}>視点を戻す</button></>}
      <p className="stage-caption">{phase === 'result' && pedal ? `${pedal.brand?.manufacturerName || pedal.brandLabel || 'FURNACE AUDIO WORKS'} / ${enclosureDimensions[pedal.enclosure].label} / ${pedal.condition || 'FACTORY NEW'}` : 'FORGING CHAMBER / AWAITING MATERIALS'}</p>
      {phase === 'revealing' && <div className="reveal-flash" aria-hidden="true" />}
      {phase === 'result' && pedal && workflow === 'forged' && <aside className="stage-finish-card">
        <div className="workflow-location"><span>03 / FINISH</span><b>最終加工</b></div>
        <h2>完成した3Dを見ながら、最後の印を。</h2>
        <p>署名・刻印は任意です。</p>
        <button type="button" onClick={beginFinishing}>最終仕上げ</button>
      </aside>}
      {phase === 'result' && pedal && workflow === 'finishing' && (
        <aside className="stage-editor-drawer" aria-label="3D最終加工パネル">
          <SignatureEditor pedal={pedal} mark={activeMark} open={markEditorOpen} onClose={() => { setMarkEditorOpen(false); setWorkflow('forged'); }} onChange={changeMark} onRemove={() => { changeMark({ ...defaultMark }); setInspectSurface('front'); setMarkEditorOpen(false); setWorkflow('forged'); }} onInspect={surface => { setInspectSurface(surface); setViewReset(value => value + 1); }} />
        </aside>
      )}
    </section>
    {phase === 'result' && pedal && <section className={'post-forge-flow workflow-' + workflow}>
      <div className="finish-shipping-grid shipping-only">
        <article className={workflow === 'shipping' || workflow === 'shipped' ? 'workflow-card active shipping-card' : 'workflow-card shipping-card'}><div className="workflow-location"><span>04 / SHIP</span><b>出荷</b></div><h2>この姿で、世に送り出す。</h2><p>出荷時点の3D、署名、ブランド情報から宣材4ページとシェア画像を作成します。</p><button type="button" onClick={ship} disabled={workflow === 'shipping'}>{workflow === 'shipping' ? '出荷準備中…' : workflow === 'shipped' ? '現在の状態で再出荷' : 'この一台を出荷する'}</button></article>
      </div>
    </section>}
    {phase === 'result' && pedal && workflow === 'shipped' && <EditorialResult pedal={pedal} coverImage={coverImage} resultRef={resultRef} resetKey={manualReset} onPng={png} onPdf={pdf} onReforge={run} />}
    {phase === 'result' && pedal && workflow === 'shipped' && <SharePanel pedal={pedal} sourceImage={coverImage} onNotice={setNotice} />}
    {drawer && <div className="drawer-backdrop" role="presentation" onMouseDown={() => setDrawer(false)}><aside className="drawer" role="dialog" aria-modal="true" aria-label="錬成済みペダル保管庫" onMouseDown={e => e.stopPropagation()}><button className="close" onClick={() => setDrawer(false)} aria-label="保管庫を閉じる">×</button><p className="eyebrow">FORGED ARCHIVE</p><h2>FORGED PEDALS</h2>{collection.length ? <div className="cards">{collection.map(p => <button key={p.id} onClick={() => { setPedal(p); setForgeStep('錬成完了'); setPhase('result'); setWorkflow('forged'); setViewMode('stage'); setRuntimeMode('play'); setInspectSurface('front'); setMarkEditorOpen(false); setUserGraphic(null); setDrawer(false); }}><span style={{ background: p.palette[0] }} /><b>{p.name}</b><small>{p.brand?.manufacturerName || p.brandLabel || 'FURNACE AUDIO WORKS'} / {p.modelNumber || p.serial}</small></button>)}</div> : <p className="empty">まだ錬成された個体はありません。</p>}</aside></div>}
    {notice && <button className="toast" onAnimationEnd={() => setNotice('')}>{notice}</button>}<footer>NO CLOUD. NO ACCOUNT. FORGED UNITS STAY IN THIS BROWSER.</footer>
  </main>;
}
