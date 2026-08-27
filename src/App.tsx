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
type EffectTypeChoice = 'random' | 'boost' | 'drive' | 'fuzz' | 'compressor' | 'eq-filter' | 'modulation' | 'phaser' | 'tremolo' | 'delay' | 'reverb' | 'pitch' | 'synth' | 'looper' | 'glitch' | 'experimental' | 'multi' | 'tuner';
type Mood = 'focused' | 'restless' | 'dreaming' | 'feral';
type ColorChoice = 'acid' | 'violet' | 'ice' | 'ember' | 'monochrome' | 'high-tone';
type ToneChoice = Choice | 'random';
type MoodChoice = Mood | 'random';
type FinishChoice = ColorChoice | 'random';
type GachaState = 'idle' | 'cranking' | 'revealing' | 'result';
type WorkflowPhase = 'select' | 'forging' | 'forged' | 'finishing' | 'shipping' | 'shipped';
type ViewMode = 'stage' | 'studio' | 'hero' | 'white' | 'dark';
type PaletteMode = 'mono' | 'duotone' | 'tritone' | 'multi-accent' | 'sticker-mix' | 'full-graphic';
type RuntimeMode = 'off' | 'on' | 'play';
type Enclosure = 'nano' | 'micro' | 'mini' | 'compact' | 'standard125' | 'tall' | 'wide' | 'bigbox' | 'wedge' | 'treadle' | 'digital' | 'utility';
type JackLayout = 'sides' | 'top' | 'hybrid';
type PowerPlacement = 'top' | 'right-near-input' | 'top-offset';
type ControlLayout = 'minimal2' | 'classic3' | 'dual4' | 'dense6' | 'dense8';
type MaterialStyle = 'powder' | 'matte' | 'semi-gloss' | 'high-gloss' | 'metallic-flake' | 'anodized' | 'brushed' | 'hammered' | 'aged' | 'pearl' | 'iridescent' | 'holographic';
type KnobStyle = 'classic' | 'davies' | 'skirt' | 'metal' | 'cylinder' | 'dome' | 'pointer' | 'ribbed' | 'cup';
type DesignSource = 'legacy' | 'motif-sheet' | 'illustration-sheet' | 'procedural-pattern';
type PatternStyle = 'stripe' | 'checker' | 'dot' | 'herringbone' | 'seigaiha';
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
type AlignmentMode = 'left' | 'center-x' | 'right' | 'top' | 'center-y' | 'bottom' | 'center';
type SignatureFontCategory = 'gothic-jp' | 'mincho-jp' | 'maru-gothic-jp' | 'gyosho-jp' | 'brush-jp' | 'handwritten-jp' | 'retro-jp' | 'seal-jp' | 'sans' | 'serif' | 'mono' | 'condensed' | 'signature-script' | 'elegant-script' | 'fashion-serif' | 'vintage-script' | 'typewriter' | 'stencil';
type UserGraphic = { id: string; fileName: string; mimeType: string; width: number; height: number; sourceUrl: string; textureUrl: string; usageMode: GraphicUsageMode; placementMode: GraphicPlacementMode; transformStyle: GraphicTransformStyle; transformStrength: 'low' | 'medium' | 'high'; colorBehavior: 'preserve' | 'pedal-match' | 'duotone' | 'monochrome'; variant: number; surface: MarkSurface; u: number; v: number; size: number; rotation: number; opacity: number; visible: boolean; clipping: 'none' | 'surface-mask' };
type MarkSurface = 'top' | 'left-side' | 'right-side' | 'back';
type PedalMark = { id: string; enabled: boolean; text: string; surface: MarkSurface; u: number; v: number; size: number; rotation: number; font: SignatureFontCategory; color: string; style: 'print' | 'stamp' | 'engraved' | 'etched' | 'paint-marker' | 'decal' | 'embossed' };
type PedalFinish = { signatures: PedalMark[]; stickers: UserGraphic[] };
type PedalBoardBackground = 'stage' | 'wood' | 'tile' | 'paper';
type PedalBoard = { id: string; name: string; pedalIds: string[]; background: PedalBoardBackground };
type ShotPresetId = 'hero' | 'three-quarter' | 'control' | 'editorial-cover-top' | 'social-x';
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
  designSource?: DesignSource; designSourceIndex?: number; patternStyle?: PatternStyle; tunerDisplayShape?: 'wide' | 'square';
};
const paletteFamilies: Record<ColorChoice, [string, string][]> = {
  acid: [['#c7ff1a', '#202d0f'], ['#f1e86a', '#36352d'], ['#8fe641', '#2b123f'], ['#ffb12b', '#3c2416'], ['#b7d760', '#3b4329']],
  violet: [['#b58aff', '#4b2266'], ['#d6b5ff', '#241735'], ['#ff9bc9', '#4a1f3a'], ['#aa94d9', '#293049'], ['#d2c7ff', '#43306c']],
  ice: [['#8ceaff', '#17485a'], ['#e7fbff', '#29414a'], ['#78c8d2', '#25363f'], ['#b8e3ef', '#1a2740'], ['#d8f2eb', '#37504d']],
  ember: [['#ff8056', '#5b2718'], ['#ffb36b', '#472b20'], ['#d85b39', '#311814'], ['#f1c27d', '#5a3324'], ['#ff7043', '#49302a']],
  monochrome: [['#202320', '#f4f4f0'], ['#444844', '#c8cac6'], ['#f1f2ee', '#8d908d'], ['#e4e6e1', '#454945'], ['#d7d9d5', '#0a0b0a']],
  'high-tone': [['#ff3f8e', '#fff06a'], ['#2f70ff', '#77e6ff'], ['#7138d8', '#c7a2ff'], ['#e94328', '#ff9a6f'], ['#16754e', '#86f0b3']],
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
  modulation: ['CHORUS', 'FLANGER', 'VIBRATO', 'ROTARY'], phaser: ['PHASER', 'MULTI-STAGE PHASER'], tremolo: ['TREMOLO', 'HARMONIC TREMOLO'], pitch: ['OCTAVE', 'PITCH SHIFTER', 'HARMONIZER'], synth: ['SYNTH FILTER', 'RING MODULATOR', 'PITCH SYNTH'], looper: ['LOOPER', 'FREEZE'], glitch: ['BIT CRUSHER', 'GLITCH', 'NOISE PROCESSOR'], experimental: ['RESONATOR', 'RING MODULATOR', 'EXPERIMENTAL PROCESSOR'], multi: ['MULTI EFFECT', 'DIGITAL MULTI PROCESSOR'], tuner: ['CHROMATIC TUNER', 'STROBE TUNER'],
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
  const colorChoice = values.colorChoice === 'random' ? pick<ColorChoice>(['acid', 'violet', 'ice', 'ember', 'monochrome', 'high-tone']) : values.colorChoice;
  const brokenSignalBrief = inputSources.length === 1 && inputSources[0] === 'bass' && values.effectType === 'drive' && sound === 'broken' && colorChoice === 'violet' && mood === 'restless';
  const freedom = ((values.inputSources?.length ? 0 : 1) + [values.effectType, values.sound, values.colorChoice, values.mood].filter(value => value === 'random').length) / 5;
  const rarity = Math.min(5, 1 + Math.floor(r() * r() * 5) + (variant ? 1 : 0));
  const base = pick(labels[sound]);
  const allEffects = Object.values(effectFamilies).flat();
  const type = brokenSignalBrief ? 'PARALLEL DRIVE PREAMP' : values.effectType === 'random' ? pick(freedom > .6 ? allEffects : effectFamilies[sound]) : pick(selectedEffectFamilies[values.effectType]);
  const isTuner = values.effectType === 'tuner';
  const category = categoryFor(type);
  const ending = pick(suffixByCategory[category]);

  // Product order: enclosure first, then only controls that physically fit it.
  const enclosureWeights = baseEnclosureDistribution.map(([candidate, weight]) => [candidate, weight * enclosureCategoryMultiplier[category][candidate]] as [EnclosureClass, number]);
  const enclosureClass = brokenSignalBrief ? 'wide' : weightedPick(r, enclosureWeights);
  const enclosure: Enclosure = isTuner ? weightedPick<Enclosure>(r, [['mini', 28], ['compact', 26], ['standard125', 28], ['digital', 18]]) : brokenSignalBrief ? 'wide' : enclosureClass === 'special' ? pick(specialEnclosures[category]) : enclosureClass === 'micro' ? pick<Enclosure>(['nano', 'micro']) : enclosureClass;
  const enclosureSize = enclosureDimensions[enclosure];
  const isTiny = ['nano', 'micro', 'mini'].includes(enclosure);
  const templates = controlTemplates[category];
  const bassTemplate = inputSources.includes('bass') ? templates.find(template => template.includes('BLEND')) : undefined;
  const baseControls = [...(bassTemplate && r() > .28 ? bassTemplate : pick(templates))];
  const targetKnobCount = isTuner ? 0 : brokenSignalBrief ? 8 : pick(knobCountsByEnclosure[enclosure]);
  const sourceControls = targetKnobCount >= 2 ? sourceControlPriority(inputSources) : [];
  const orderedControls = [...new Set([...sourceControls, ...baseControls, ...controlVocabulary[category]])];
  let knobs = brokenSignalBrief ? ['CLEAN', 'BLEND', 'GAIN', 'LEVEL', 'BASS', 'MID', 'TREBLE', 'PRESENCE'] : orderedControls.slice(0, targetKnobCount);
  const eqEligible = !isTuner && !brokenSignalBrief && !isTiny && !['treadle'].includes(enclosure);
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
  const hardwareCulture = isTuner ? 'CLASSIC STOMP' : brokenSignalBrief ? 'LAB UTILITY' : pick(culturesByEnclosure[enclosure]);
  const footswitches = (isTuner ? 1 : brokenSignalBrief ? 2 : enclosure === 'wide' ? (r() > .45 ? 2 : 1) : enclosure === 'bigbox' ? (r() > .82 ? 2 : 1) : ['wedge', 'digital', 'utility'].includes(enclosure) ? (r() > .55 ? 2 : 1) : 1) as 1 | 2;
  const jackLayout: JackLayout = brokenSignalBrief ? 'sides' : isTiny ? 'sides' : weightedPick(r, jackWeightsByEnclosure[enclosure]);
  const stereoEligible = !isTiny && ['modulation', 'phaser', 'delay', 'reverb', 'synth'].includes(category);
  const ioChannels: 'mono' | 'stereo' = signalProfile.stereoPreferred && stereoEligible && r() < .72 ? 'stereo' : 'mono';
  const requestedPowerPlacement = isTiny ? 'top' : weightedPick(r, powerPlacementWeights);
  const powerPlacement: PowerPlacement = requestedPowerPlacement === 'right-near-input' && jackLayout === 'top' ? 'top' : requestedPowerPlacement;
  const toggleCount = isTuner ? 0 : brokenSignalBrief ? 2 : controlLayoutMode !== 'knob-only' || isTiny ? 0 : enclosure === 'wide' && mood === 'restless' ? 2 : ['wide', 'bigbox', 'standard125', 'digital', 'utility'].includes(enclosure) && r() > .72 ? 1 : 0;

  const designArchetype = pick(values.sound === 'random' ? archetypes : archetypeByTone[sound]);
  const artDirection = pick(artByArchetype[designArchetype]);
  const directionOrder: ArtDirection[] = ['SWISS', 'INDUSTRIAL', 'BRUTALIST', 'SCIENTIFIC', 'RISOGRAPH', 'PSYCHEDELIC', 'MINIMAL SYMBOL', 'ILLUSTRATION'];
  const directionIndex = directionOrder.indexOf(artDirection); const artAtlas = (directionIndex < 4 ? 'a' : 'b') as 'a' | 'b'; const artIndex = directionIndex % 4;
  const visualIntensity: VisualIntensity = brokenSignalBrief ? 'expressive' : weightedPick(r, [['calm', 35], ['expressive', 35], ['bold', 20], ['maximal', 10]]);
  const materialStyle = visualIntensity === 'maximal'
    ? weightedPick<MaterialStyle>(r, [['metallic-flake', 28], ['pearl', 22], ['iridescent', 20], ['holographic', 12], ['high-gloss', 10], ['anodized', 8]])
    : weightedPick<MaterialStyle>(r, [['powder', 25], ['matte', 20], ['semi-gloss', 15], ['metallic-flake', 10], ['brushed', 10], ['hammered', 7], ['high-gloss', 5], ['anodized', 5], ['aged', 3]]);
  const knobFamilies: Record<DesignArchetype, KnobStyle[]> = {
    'MINIMAL LAB': ['classic', 'metal', 'cylinder'], 'VINTAGE STOMP': ['davies', 'skirt', 'pointer'], 'DARK BOUTIQUE': ['classic', 'skirt', 'metal', 'ribbed'], 'PSYCHE FUZZ': ['davies', 'skirt', 'pointer'],
    'SPACE SIGNAL': ['metal', 'classic', 'cylinder'], 'JAPANESE INDUSTRIAL': ['davies', 'metal', 'ribbed', 'cylinder'], 'SWISS MODERN': ['classic', 'metal', 'cylinder'], 'GARAGE DIY': ['davies', 'skirt', 'pointer'],
    SCIENTIFIC: ['metal', 'classic', 'ribbed'], 'POP OBJECT': ['davies', 'classic'], 'BARE METAL': ['metal', 'ribbed'], 'MYSTIC SYMBOL': ['skirt', 'davies', 'pointer'],
  };
  const knobStyle: KnobStyle = r() < .62 ? brand.knobFamily : pick(knobFamilies[designArchetype]);
  const paddleEligible = !isTuner && footswitches === 1 && ['compact', 'standard125', 'tall'].includes(enclosure) && controlLayoutMode === 'knob-only';
  const footswitchStyle: FootswitchStyle = isTuner ? 'metal' : hardwareCulture === 'TREADLE STOMP' ? 'pad' : paddleEligible ? weightedPick<FootswitchStyle>(r, [['metal', 48], ['soft-touch', 17], ['large-lower-paddle', 35]]) : weightedPick<FootswitchStyle>(r, [['metal', 74], ['soft-touch', 26]]);
  const display = (isTuner ? 'oled' : controlLayoutMode !== 'knob-only' || isTiny ? 'none' : hardwareCulture === 'DIGITAL MULTI' ? 'oled' : ((['SPACE SIGNAL', 'SCIENTIFIC'].includes(designArchetype) || sound === 'cosmic') && enclosure !== 'compact' && controlLayout !== 'dense6' && r() > .52 ? pick(['segment', 'oled'] as const) : 'none')) as Pedal['display'];
  const graphicWeights: Array<[GraphicMode, number]> = visualIntensity === 'maximal'
    ? [['FULL ILLUSTRATION', 34], ['TYPOGRAPHY', 28], ['PANEL', 22], ['ONE POINT', 16]]
    : [['ONE POINT', 40], ['PANEL', 20], ['TYPOGRAPHY', 15], ['FULL ILLUSTRATION', 10], ['MINIMAL', 10], ['TECHNICAL', 5]];
  let graphicMode: GraphicMode = isTuner ? 'MINIMAL' : brokenSignalBrief ? 'TECHNICAL' : weightedPick(r, graphicWeights);
  if (display !== 'none' && graphicMode === 'FULL ILLUSTRATION') graphicMode = 'PANEL';
  const coverageByGraphic: Record<GraphicMode, ArtCoverage> = { MINIMAL: 'none', TYPOGRAPHY: 'none', 'TYPOGRAPHY LED': 'none', 'ONE POINT': 'symbol', PANEL: 'partial', TECHNICAL: 'none', STICKER: 'mark', ABSTRACT: 'symbol', 'FULL ILLUSTRATION': 'full' };
  let artCoverage: ArtCoverage = brokenSignalBrief ? 'none' : coverageByGraphic[graphicMode];

  const ledCountWeights: Array<[number, number]> = enclosure === 'digital' ? [[1, 55], [0, 8], [2, 25], [3, 12]] : enclosure === 'wide' || enclosure === 'bigbox' ? [[1, 76], [0, 14], [2, 9], [3, 1]] : [[1, 86], [0, 14]];
  let ledCount = isTuner ? 0 : weightedPick(r, ledCountWeights); if (!['wide', 'bigbox', 'digital'].includes(enclosure)) ledCount = Math.min(1, ledCount); if (enclosure !== 'digital') ledCount = Math.min(ledCount, footswitches);
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
  const designSource: DesignSource = isTuner ? 'legacy' : weightedPick<DesignSource>(r, [['legacy', 70], ['motif-sheet', 12], ['illustration-sheet', 10], ['procedural-pattern', 8]]);
  const illustrationCandidates: Record<EffectCategory, number[]> = { drive: [5, 8], fuzz: [3], boost: [5, 8], compressor: [0, 4], modulation: [4, 6], phaser: [4, 6], tremolo: [7], delay: [1], reverb: [0, 2, 4], filter: [4, 8], synth: [2, 6, 7] };
  const designSourceIndex = designSource === 'motif-sheet' ? Math.floor(r() * 25) : designSource === 'illustration-sheet' ? pick(illustrationCandidates[category]) : 0;
  const patternStyle = designSource === 'procedural-pattern' ? pick<PatternStyle>(['stripe', 'checker', 'dot', 'herringbone', 'seigaiha']) : undefined;
  const tunerDisplayShape = isTuner ? pick(['wide', 'square'] as const) : undefined;
  if (designSource === 'motif-sheet') { graphicMode = 'ONE POINT'; artCoverage = 'symbol'; }
  if (designSource === 'illustration-sheet') { graphicMode = 'FULL ILLUSTRATION'; artCoverage = 'full'; }
  if (designSource === 'procedural-pattern') { graphicMode = 'ABSTRACT'; artCoverage = 'full'; }
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
  const choiceImpact = [`ART SOURCE ${designSource.toUpperCase()}`, `MAKER ${brand.manufacturerName}`, `INPUT SOURCE ${inputSourceSummary(inputSources)}`, `SIGNAL ${signalProfile.level.toUpperCase()} / ${signalProfile.headroom.toUpperCase()} HEADROOM / ${ioChannels.toUpperCase()}`, `EFFECT ${selection(values.effectType, type)}`, `TONE ${selection(values.sound, sound.toUpperCase())}`, `FINISH ${selection(values.colorChoice, colorChoice.toUpperCase())}`, `MOOD ${selection(values.mood, mood.toUpperCase())}`, `FORM ${enclosureDimensions[enclosure].label}`, `NAME ${namingFamily.toUpperCase()}${kanjiEntry ? ` / ${kanjiEntry.text}` : ''}`, `DESIGN ${graphicMode} / ${typography.mode.toUpperCase()}`, `CONTROL ${controlLayoutMode.toUpperCase()}${eqPreset ? ` / ${eqPreset.toUpperCase()}` : ''}`];
  const sourceArchitecture = signalProfile.level === 'piezo' ? 'HIGH-Z PIEZO FRONT END' : signalProfile.level === 'line-tolerant' ? 'HIGH-HEADROOM LINE PROCESSOR' : inputSources.includes('bass') ? 'LOW-END RETAINING SIGNAL PATH' : '';
  const effectArchitecture = isTuner ? 'CHROMATIC PITCH DETECTION' : brokenSignalBrief ? 'PARALLEL DRIVE PREAMP' : [sourceArchitecture, pick(architectureByCategory[category])].filter(Boolean).join(' / ');
  const rotaryControlGroups = brokenSignalBrief ? [{ name: 'INPUT / DRIVE', controls: knobs.slice(0, 4) }, { name: '3-BAND EQ', controls: knobs.slice(4) }] : controlGroupsFor(category, knobs);
  const controlGroups = eqSliders.length ? [...rotaryControlGroups, { name: `${eqSliders.length}-BAND GRAPHIC EQ`, controls: eqSliders.map(slider => slider.label) }] : rotaryControlGroups;
  const totalAdjusters = knobs.length + eqSliders.length;
  const controlGroupFrameStyle: GroupFrameStyle | undefined = totalAdjusters < 5 ? undefined : brokenSignalBrief ? 'thin-line' : weightedPick(r, [['thin-line', 18], ['open-frame', 24], ['underline', 20], ['panel', 25], ['bracket', 10], ['printed-box', 3]]);
  const primaryControl = brokenSignalBrief ? 'GAIN' : knobs.length ? primaryControlFor(category, knobs) : eqSliders[Math.floor(eqSliders.length / 2)]?.label || 'BYPASS';
  const footswitchLabels = isTuner ? ['ON / OFF'] : footswitches === 1 ? ['BYPASS'] : ['BYPASS', category === 'delay' ? 'TAP' : brokenSignalBrief ? 'ALT' : 'BOOST'];
  const toggleLabels = brokenSignalBrief ? ['CLIP', 'VOICE'] : Array.from({ length: toggleCount }, (_, i) => i === 0 ? (category === 'drive' || category === 'fuzz' ? 'CLIP' : 'MODE') : 'VOICE');
  const identityMotif: IdentityMotif = brokenSignalBrief ? 'broken-wave' : 'none';
  const knobCost = isTiny ? 1 : knobs.length >= 7 ? 1.15 : 1.5; const sliderCost = eqSliders.length * .8; const displayCost = display === 'none' ? 0 : 3; const footswitchCost = footswitchStyle === 'large-lower-paddle' ? 4.25 : footswitches * 3; const faceCost = knobs.length * knobCost + sliderCost + toggleCount * .75 + footswitchCost + displayCost;
  const layoutChecks = ['ALIGNED CONTROL GRID', 'CONTROL LABEL CLEARANCE', 'TEXT SAFE ZONES RESERVED', 'FRAME TITLE GAP', 'DEDICATED PRODUCT NAME ZONE', 'FOOTSWITCH TOE CLEARANCE', 'I/O INTERNAL VOLUME RESERVED', `CONTROL MODE ${controlLayoutMode.toUpperCase()}`, `SLIDERS ${eqSliders.length}`, `FACE COST ${faceCost.toFixed(1)} / ${faceBudgetByEnclosure[enclosure]}`];
  if (faceCost > faceBudgetByEnclosure[enclosure]) throw new Error(`Control budget exceeded for ${enclosure}`);
  const designScore = Math.min(98, 86 + (isTiny && knobs.length <= 4 ? 4 : 0) + (graphicMode === 'STICKER' ? 0 : 3) + Math.floor(r() * 5));
  const weight = `${Math.round(120 + enclosureSize.width * enclosureSize.height * 34)} g`;
  return { id: `${brand.id}-${values.seed}-${serial}${variant ? '-LTD' : ''}`, seed: values.seed, owner: '', instrument, inputSources, signalProfile, ioChannels, effectType: values.effectType, sound, mood, colorChoice, name, type, copy: isTuner ? '音程の中心を光の目盛りで静かに捉える' : pick(descriptions[sound]), knobs, special: isTuner ? '入力音を検出し、半音単位とセント偏差を表示' : pick(specialsByCategory[category]), rarity, serial, usage: isTuner ? `${instrumentLabel}のチューニング` : `${instrumentLabel}、${mood === 'dreaming' ? 'アンビエント' : mood === 'feral' ? 'ノイズロック' : 'シューゲイザー'}`, warning: isTuner ? 'ON時は出力をミュートし、画面で音程を確認します。' : knobs.length ? `${knobs[Math.min(2, knobs.length - 1)]}最大時は原音がほぼ観測不能になります。` : eqSliders.length ? `${eqSliders[Math.floor(eqSliders.length / 2)].label}帯域を最大にすると出力が急激に変化します。` : '固定回路のため、フットスイッチでのみ動作を切り替えます。', bypass: isTuner ? 'ミュートチューニング' : r() > .5 ? 'トゥルーバイパス' : 'バッファードバイパス', power: 'DC 9V センターマイナス / 85mA', dimensions: `${Math.round(enclosureSize.width * 34)} × ${Math.round(enclosureSize.height * 34)} × ${Math.round(enclosureSize.depth * 34)} mm`, weight, palette, paletteMode, graphicColor, hardwareColors, accentColors, variant, enclosure, jackLayout, powerPlacement, controlLayout, footswitches, toggleCount, artIndex, artAtlas, labelMode: 'full', ownerFont: 0, choiceImpact, materialStyle, knobStyle, footswitchStyle, artCoverage, ledStyle, ledCount, ledLocation, ledColors, display, extraPort, brandSeries, artDirection, designScore, designArchetype, controlVariant, titleFont: 0, brandLabel, ownerLabel, namingPattern, hardwareCulture, graphicMode, condition, effectArchitecture, controlGroups, controlGroupFrameStyle, visualIntensity, primaryControl, controlLayoutMode, eqPreset, eqSliders, footswitchLabels, toggleLabels, identityMotif, brand, typography, modelNumber, namingFamily, kanjiTerm: kanjiEntry?.text, kanjiStyle, kanjiUsage, layoutChecks, promoDirection, motifType, motifLabel, motifCategory, motifRenderStyle, motifPlacement, motifScale, designSource, designSourceIndex, patternStyle, tunerDisplayShape };
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
}

function roundedTopFaceGeometry(width: number, height: number) {
  const radius = Math.min(width, height) * .085; const shape = new THREE.Shape();
  shape.moveTo(-width / 2 + radius, -height / 2); shape.lineTo(width / 2 - radius, -height / 2);
  shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius); shape.lineTo(width / 2, height / 2 - radius);
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2); shape.lineTo(-width / 2 + radius, height / 2);
  shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius); shape.lineTo(-width / 2, -height / 2 + radius);
  shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
  const geometry = new THREE.ShapeGeometry(shape, 24); const positions = geometry.getAttribute('position'); const uvs = geometry.getAttribute('uv');
  for (let index = 0; index < positions.count; index += 1) uvs.setXY(index, positions.getX(index) / width + .5, positions.getY(index) / height + .5);
  uvs.needsUpdate = true; geometry.rotateX(-Math.PI / 2); return geometry;
}
function SheetDesignArtwork({ source, index, size, surfaceY, placement = 'center-small' }: { source: 'motif-sheet' | 'illustration-sheet'; index: number; size: { width: number; height: number }; surfaceY: number; placement?: MotifPlacement }) {
  const cellCount = source === 'motif-sheet' ? 25 : 9; const resolvedIndex = Math.abs(index) % cellCount;
  const texture = useMemo(() => {
    const prefix = source === 'motif-sheet' ? 'pedal-forge-motif-' : 'pedal-forge-illustration-';
    const assetName = `${prefix}${String(resolvedIndex).padStart(2, '0')}.webp`;
    const next = new THREE.TextureLoader().load(new URL(assetName, window.location.href).href);
    next.colorSpace = THREE.SRGBColorSpace; next.wrapS = THREE.ClampToEdgeWrapping; next.wrapT = THREE.ClampToEdgeWrapping;
    next.minFilter = THREE.LinearMipmapLinearFilter; next.magFilter = THREE.LinearFilter; return next;
  }, [resolvedIndex, source]);
  const faceGeometry = useMemo(() => source === 'illustration-sheet' ? roundedTopFaceGeometry(size.width * .94, size.height * .94) : null, [size.height, size.width, source]);
  useEffect(() => () => { texture.dispose(); faceGeometry?.dispose(); }, [faceGeometry, texture]);
  if (source === 'illustration-sheet') return <mesh geometry={faceGeometry!} position={[0, surfaceY - .018, 0]} receiveShadow><meshStandardMaterial map={texture} roughness={.62} metalness={.03} polygonOffset polygonOffsetFactor={-3} /></mesh>;
  const positions: Record<MotifPlacement, [number, number]> = { 'lower-right': [size.width * .27, size.height * .19], 'lower-left': [-size.width * .27, size.height * .19], 'upper-right': [size.width * .27, -size.height * .2], 'upper-left': [-size.width * .27, -size.height * .2], 'center-small': [0, size.height * .02], 'above-footswitch': [0, size.height * .2], 'between-knobs': [0, -size.height * .03], 'diagonal-corner': [size.width * .24, size.height * .16] };
  const [x, z] = positions[placement]; const side = Math.min(size.width * .34, size.height * .25, 1.08);
  return <mesh position={[x, surfaceY - .014, z]} rotation={[-Math.PI / 2, 0, placement === 'diagonal-corner' ? -.14 : 0]}><planeGeometry args={[side, side]} /><meshStandardMaterial map={texture} transparent alphaTest={.04} roughness={.58} metalness={.02} polygonOffset polygonOffsetFactor={-3} /></mesh>;
}
function ProceduralPatternArtwork({ style, size, surfaceY, colors }: { style: PatternStyle; size: { width: number; height: number }; surfaceY: number; colors: string[] }) {
  const ink = colors[0] || '#f4f1e6'; const secondary = colors[1] || '#33dcff';
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); const width = 768; const height = Math.max(768, Math.round(width * size.height / size.width)); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d')!; ctx.clearRect(0, 0, width, height); ctx.fillStyle = secondary; ctx.globalAlpha = .28; ctx.fillRect(0, 0, width, height); ctx.globalAlpha = .74;
    if (style === 'stripe') {
      ctx.save(); ctx.translate(width / 2, height / 2); ctx.rotate(-.28); const band = width * .085; for (let x = -width; x < width; x += band * 2) { ctx.fillStyle = ink; ctx.fillRect(x, -height, band, height * 2); } ctx.restore();
    } else if (style === 'checker') {
      const columns = 6; const cell = width / columns; const rows = Math.ceil(height / cell); for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) if ((row + column) % 2 === 0) { ctx.fillStyle = (row + column) % 4 ? ink : secondary; ctx.fillRect(column * cell, row * cell, cell, cell); }
    } else if (style === 'dot') {
      const columns = 6; const gapX = width / columns; const gapY = gapX * .92; for (let row = 0; row * gapY < height + gapY; row++) for (let column = 0; column < columns; column++) { const radius = gapX * ((row + column) % 3 === 0 ? .22 : .13); ctx.beginPath(); ctx.arc((column + .5) * gapX + (row % 2 ? gapX * .18 : 0), (row + .5) * gapY, radius, 0, Math.PI * 2); ctx.fillStyle = (row + column) % 2 ? ink : secondary; ctx.fill(); }
    } else if (style === 'herringbone') {
      const unit = width / 5; ctx.strokeStyle = ink; ctx.lineWidth = unit * .2; ctx.lineCap = 'square'; for (let row = -1; row * unit < height + unit; row++) for (let column = -1; column < 6; column++) { const x = column * unit; const y = row * unit; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + unit * .5, y + unit * .5); ctx.lineTo(x + unit, y); ctx.stroke(); }
    } else {
      const radius = width / 11; ctx.strokeStyle = ink; ctx.lineWidth = Math.max(8, radius * .16); for (let row = 0; row * radius < height + radius; row++) for (let column = -1; column < 12; column++) { const x = column * radius * 2 + (row % 2 ? radius : 0); const y = row * radius * .92; ctx.beginPath(); ctx.arc(x, y, radius, Math.PI, Math.PI * 2); ctx.stroke(); }
    }
    ctx.globalAlpha = 1; const next = new THREE.CanvasTexture(canvas); next.colorSpace = THREE.SRGBColorSpace; next.anisotropy = 4; next.minFilter = THREE.LinearMipmapLinearFilter; next.magFilter = THREE.LinearFilter; return next;
  }, [ink, secondary, size.height, size.width, style]);
  const geometry = useMemo(() => roundedTopFaceGeometry(size.width * .94, size.height * .94), [size.height, size.width]);
  useEffect(() => () => { texture.dispose(); geometry.dispose(); }, [geometry, texture]);
  return <mesh geometry={geometry} position={[0, surfaceY - .018, 0]} receiveShadow><meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} polygonOffset polygonOffsetFactor={-3} /></mesh>;
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
  const resolvedStyle: Exclude<KnobStyle, 'cup'> = style === 'cup' ? 'classic' : style;
  const isMetal = resolvedStyle === 'metal'; const isSkirt = resolvedStyle === 'skirt' || resolvedStyle === 'dome'; const isDavies = resolvedStyle === 'davies'; const isPointer = resolvedStyle === 'pointer'; const isRibbed = resolvedStyle === 'ribbed'; const isShortCylinder = resolvedStyle === 'cylinder';
  const bodyColor = isMetal || isRibbed ? '#aeb3ad' : color;
  if (isPointer) return <group>
    <mesh position={[0, -.14, 0]}><cylinderGeometry args={[radius * 1.14, radius * 1.14, .014, 32]} /><meshStandardMaterial color="#070807" roughness={.96} /></mesh>
    <mesh position={[0, -.105, 0]} castShadow><cylinderGeometry args={[radius * 1.04, radius * 1.08, .12, 32]} /><meshStandardMaterial color={color} metalness={.22} roughness={.5} /></mesh>
    <mesh position={[0, .09, 0]} castShadow><boxGeometry args={[radius * .76, .34, radius * 1.42]} /><meshStandardMaterial color={color} metalness={.18} roughness={.46} /></mesh>
    <mesh position={[0, .267, -radius * .3]}><boxGeometry args={[Math.max(.035, radius * .11), .018, radius * .66]} /><meshStandardMaterial color="#f4f0df" roughness={.46} /></mesh>
  </group>;
  const height = isShortCylinder ? .28 : isSkirt ? .36 : isDavies ? .38 : .4;
  return <group>
    <mesh position={[0, -height / 2 - .047, 0]}><cylinderGeometry args={[radius * 1.13, radius * 1.13, .014, 32]} /><meshStandardMaterial color="#070807" roughness={.96} /></mesh>
    <mesh position={[0, -height / 2 - .018, 0]} castShadow><cylinderGeometry args={[radius * 1.08, radius * 1.08, .035, 32]} /><meshStandardMaterial color="#aeb3ad" metalness={.92} roughness={.22} /></mesh>
    <mesh castShadow><cylinderGeometry args={[isSkirt ? radius * .72 : radius * .88, isSkirt ? radius * 1.08 : radius, height, isRibbed ? 12 : isMetal ? 36 : isDavies ? 18 : 24]} /><meshStandardMaterial color={bodyColor} metalness={isMetal || isRibbed ? .9 : .28} roughness={isRibbed ? .38 : isMetal ? .24 : .52} flatShading={isRibbed} /></mesh>
    <mesh position={[0, height / 2 + .027, 0]} castShadow><cylinderGeometry args={[radius * .72, radius * .78, .055, 28]} /><meshStandardMaterial color={isMetal || isRibbed ? '#c9ccc7' : color} metalness={isMetal || isRibbed ? .92 : .24} roughness={.34} /></mesh>
    <mesh position={[0, -height * .18, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius * .94, .02, 6, isDavies ? 18 : 30]} /><meshStandardMaterial color={isMetal || isRibbed ? '#666c67' : '#111411'} metalness={.72} roughness={.42} /></mesh>
    {!isShortCylinder && <mesh position={[0, height / 2 + .064, -radius * .27]}><boxGeometry args={[Math.max(.035, radius * .1), .022, radius * .72]} /><meshStandardMaterial color="#f4f0df" metalness={.08} roughness={.5} /></mesh>}
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
function TunerDisplay({ width, depth, color, runtimeMode }: { width: number; depth: number; color: string; runtimeMode: RuntimeMode }) {
  const needle = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (!needle.current) return; needle.current.position.x = runtimeMode === 'play' ? Math.sin(clock.elapsedTime * 2.2) * width * .18 : 0; });
  const active = runtimeMode !== 'off';
  return <group>
    <mesh castShadow><boxGeometry args={[width + .14, .095, depth + .12]} /><meshStandardMaterial color="#050605" metalness={.62} roughness={.2} /></mesh>
    <mesh position={[0, .058, 0]}><boxGeometry args={[width, .025, depth]} /><meshPhysicalMaterial color="#020403" roughness={.06} clearcoat={.86} emissive={color} emissiveIntensity={active ? .2 : 0} /></mesh>
    {active && <>
      <SurfaceText text="A  440" position={[-width * .31, .086, -depth * .39]} width={Math.min(width * .28, depth * .72)} color={color} outline={false} />
      <SurfaceText text="E" position={[0, .09, -depth * .1]} width={Math.min(width * 1.9, depth * 2.15)} color="#f4f1e6" />
      <group position={[0, .09, depth * .24]}>{Array.from({ length: 9 }, (_, index) => { const centered = index === 4; return <mesh key={index} position={[(index - 4) * width * .085, 0, 0]}><boxGeometry args={[width * .035, .016, centered ? depth * .18 : depth * .1]} /><meshBasicMaterial color={centered ? '#55ff7a' : color} toneMapped={false} /></mesh>; })}</group>
      <group ref={needle} position={[0, .1, depth * .16]}><mesh><boxGeometry args={[width * .055, .02, depth * .27]} /><meshBasicMaterial color="#f4f1e6" toneMapped={false} /></mesh></group>
      <SurfaceText text="-50     CENT     +50" position={[0, .086, depth * .4]} width={width * .72} color={color} outline={false} />
    </>}
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
  const image = await loadGraphicImage(graphic.sourceUrl || graphic.textureUrl); const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 768; const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
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
function createMaskedStickerTexture(surfaceWidth: number, surfaceHeight: number, cornerRadius: number) {
  const canvas = document.createElement('canvas'); canvas.width = 384; canvas.height = Math.max(48, Math.round(384 * surfaceHeight / surfaceWidth));
  const context = canvas.getContext('2d')!; const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 2;
  return { canvas, context, texture, radius: Math.min(canvas.width, canvas.height) * cornerRadius };
}
function StickerMark({ graphic, size, surfaceY, layer = 0 }: { graphic: UserGraphic; size: { width: number; height: number; depth: number }; surfaceY: number; layer?: number }) {
  const side = graphic.surface === 'left-side' || graphic.surface === 'right-side'; const surfaceWidth = side ? size.height : size.width; const surfaceHeight = side ? size.depth : size.height;
  const maskedResource = useMemo(() => graphic.clipping === 'surface-mask' ? createMaskedStickerTexture(surfaceWidth, surfaceHeight, side || graphic.surface === 'back' ? .025 : .055) : null, [graphic.clipping, graphic.surface, side, surfaceHeight, surfaceWidth]);
  const sourceImage = useMemo(() => { if (!maskedResource) return null; const image = new Image(); image.src = graphic.textureUrl; return image; }, [graphic.textureUrl, maskedResource]);
  const texture = useMemo(() => maskedResource?.texture || new THREE.TextureLoader().load(graphic.textureUrl), [graphic.textureUrl, maskedResource]);
  useEffect(() => {
    if (!maskedResource || !sourceImage) return;
    const { canvas, context, radius } = maskedResource;
    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height); context.save(); context.beginPath(); context.roundRect(0, 0, canvas.width, canvas.height, radius); context.clip();
      const ratio = Math.max(.35, Math.min(2.85, graphic.width / graphic.height)); const drawWidth = canvas.width * graphic.size; const drawHeight = drawWidth / ratio;
      context.translate(graphic.u * canvas.width, (1 - graphic.v) * canvas.height); context.rotate(-THREE.MathUtils.degToRad(graphic.rotation)); context.globalAlpha = graphic.opacity;
      context.drawImage(sourceImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight); context.restore(); texture.needsUpdate = true;
    };
    if (sourceImage.complete && sourceImage.naturalWidth) draw(); else sourceImage.addEventListener('load', draw);
    return () => sourceImage.removeEventListener('load', draw);
  }, [graphic.height, graphic.opacity, graphic.rotation, graphic.size, graphic.u, graphic.v, graphic.width, maskedResource, sourceImage, texture]);
  useEffect(() => { texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true; return () => texture.dispose(); }, [texture]);
  if (!graphic.visible) return null;
  const lift = .012 + layer * .0015; const material = <meshBasicMaterial map={texture} transparent opacity={graphic.opacity} depthWrite={false} toneMapped={false} polygonOffset polygonOffsetFactor={-2 - layer} />;
  if (graphic.clipping === 'surface-mask') {
    if (graphic.surface === 'back') return <mesh position={[0, -size.depth / 2 - lift, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={2 + layer}><planeGeometry args={[size.width, size.height]} />{material}</mesh>;
    if (side) { const right = graphic.surface === 'right-side'; return <mesh position={[right ? size.width / 2 + lift : -size.width / 2 - lift, 0, 0]} rotation={[0, right ? Math.PI / 2 : -Math.PI / 2, 0]} renderOrder={2 + layer}><planeGeometry args={[size.height, size.depth]} />{material}</mesh>; }
    return <mesh position={[0, surfaceY + lift, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2 + layer}><planeGeometry args={[size.width, size.height]} />{material}</mesh>;
  }
  const ratio = Math.max(.35, Math.min(2.85, graphic.width / graphic.height)); const width = surfaceWidth * graphic.size; const height = Math.min(surfaceHeight, width / ratio); const x = (graphic.u - .5) * size.width; const z = (graphic.v - .5) * size.height;
  if (graphic.surface === 'back') return <mesh position={[x, -size.depth / 2 - lift, z]} rotation={[Math.PI / 2, 0, THREE.MathUtils.degToRad(graphic.rotation)]} renderOrder={2 + layer}><planeGeometry args={[width, height]} />{material}</mesh>;
  if (side) { const right = graphic.surface === 'right-side'; return <mesh position={[right ? size.width / 2 + lift : -size.width / 2 - lift, (graphic.v - .5) * size.depth, (graphic.u - .5) * size.height]} rotation={[0, right ? Math.PI / 2 : -Math.PI / 2, THREE.MathUtils.degToRad(graphic.rotation)]} renderOrder={2 + layer}><planeGeometry args={[width, height]} />{material}</mesh>; }
  return <mesh position={[x, surfaceY + lift, z]} rotation={[-Math.PI / 2, 0, THREE.MathUtils.degToRad(graphic.rotation)]} renderOrder={2 + layer}><planeGeometry args={[width, height]} />{material}</mesh>;
}
const markFonts: Record<PedalMark['font'], string> = {
  'gothic-jp': '"Yu Gothic", "Hiragino Kaku Gothic ProN", sans-serif', 'mincho-jp': '"Yu Mincho", "Hiragino Mincho ProN", serif', 'maru-gothic-jp': '"Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif',
  'gyosho-jp': '"Yu Kyokasho", "HGP行書体", "Yu Mincho", serif', 'brush-jp': '"Yu Kyokasho", "HGP行書体", "Yu Mincho", serif', 'handwritten-jp': '"Yu Kyokasho", "Klee One", "Yu Gothic", cursive', 'retro-jp': '"Yu Mincho", "Hiragino Mincho ProN", serif', 'seal-jp': '"Yu Mincho", "Hiragino Mincho ProN", serif',
  sans: 'Arial, "Yu Gothic", sans-serif', serif: 'Georgia, "Yu Mincho", serif', mono: '"Courier New", "Yu Gothic", monospace', condensed: '"Arial Narrow", "Yu Gothic", sans-serif', 'signature-script': '"Segoe Script", "Yu Kyokasho", cursive', 'elegant-script': '"Snell Roundhand", "Segoe Script", "Yu Kyokasho", cursive', 'fashion-serif': 'Didot, Bodoni 72, "Yu Mincho", serif', 'vintage-script': '"Brush Script MT", "Yu Kyokasho", cursive', typewriter: '"Courier New", "Yu Gothic", monospace', stencil: 'Impact, "Yu Gothic", sans-serif',
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
  const topWidth = size.width * mark.size; const sideWidth = size.height * mark.size; const x = (mark.u - .5) * size.width; const z = (mark.v - .5) * size.height;
  const material = <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />;
  if (mark.surface === 'back') return <mesh position={[x, -size.depth / 2 - .018, z]} rotation={[Math.PI / 2, 0, THREE.MathUtils.degToRad(mark.rotation)]} renderOrder={4}><planeGeometry args={[topWidth, Math.max(.14, topWidth / 4.2)]} />{material}</mesh>;
  if (mark.surface === 'left-side' || mark.surface === 'right-side') {
    const right = mark.surface === 'right-side'; const sideZ = (mark.u - .5) * size.height; const sideY = (mark.v - .5) * size.depth;
    return <mesh position={[right ? size.width / 2 + .022 : -size.width / 2 - .022, sideY, sideZ]} rotation={[0, right ? Math.PI / 2 : -Math.PI / 2, THREE.MathUtils.degToRad(mark.rotation)]} renderOrder={4}><planeGeometry args={[sideWidth, Math.max(.11, sideWidth / 4.2)]} />{material}</mesh>;
  }
  return <mesh position={[x, surfaceY + .032, z]} rotation={[-Math.PI / 2, 0, THREE.MathUtils.degToRad(mark.rotation)]} renderOrder={4}><planeGeometry args={[topWidth, Math.max(.14, topWidth / 4.2)]} />{material}</mesh>;
}
function DirectMarkSurface({ mark, size, surfaceY, onChange }: { mark: PedalMark; size: { width: number; height: number; depth: number }; surfaceY: number; onChange: (mark: PedalMark) => void }) {
  const dragging = useRef<MarkSurface | null>(null);
  const update = (surface: MarkSurface, event: ThreeEvent<PointerEvent>, invertV = false) => {
    if (!event.uv) return;
    const rawU = THREE.MathUtils.clamp(event.uv.x, 0, 1); const rawV = THREE.MathUtils.clamp(invertV ? 1 - event.uv.y : event.uv.y, 0, 1);
    const u = Math.abs(rawU - .5) < .035 ? .5 : rawU; const v = Math.abs(rawV - .5) < .035 ? .5 : rawV;
    onChange({ ...mark, enabled: true, surface, u, v });
  };
  const handlers = (surface: MarkSurface, invertV = false) => ({
    onPointerDown: (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); dragging.current = surface; update(surface, event, invertV); },
    onPointerMove: (event: ThreeEvent<PointerEvent>) => { if (dragging.current !== surface) return; event.stopPropagation(); update(surface, event, invertV); },
    onPointerUp: (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); dragging.current = null; },
    onPointerLeave: () => { dragging.current = null; },
  });
  const hitMaterial = <meshBasicMaterial color="#b7ff19" transparent opacity={.003} depthWrite={false} toneMapped={false} />;
  if (mark.surface === 'back') return <mesh position={[0, -size.depth / 2 - .045, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={8} {...handlers('back')}><planeGeometry args={[size.width, size.height]} />{hitMaterial}</mesh>;
  if (mark.surface === 'left-side') return <mesh position={[-size.width / 2 - .045, 0, 0]} rotation={[0, -Math.PI / 2, 0]} renderOrder={8} {...handlers('left-side')}><planeGeometry args={[size.height, size.depth]} />{hitMaterial}</mesh>;
  if (mark.surface === 'right-side') return <mesh position={[size.width / 2 + .045, 0, 0]} rotation={[0, Math.PI / 2, 0]} renderOrder={8} {...handlers('right-side')}><planeGeometry args={[size.height, size.depth]} />{hitMaterial}</mesh>;
  return <mesh position={[0, surfaceY + .07, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={8} {...handlers('top', true)}><planeGeometry args={[size.width, size.height]} />{hitMaterial}</mesh>;
}
type DirectTransformPatch = { size?: number; rotation?: number };
function DirectTransformFrame({ surface, u, v, width, height, rotation, size, enclosure, surfaceY, maxSize = 1, onChange }: { surface: MarkSurface; u: number; v: number; width: number; height: number; rotation: number; size: number; enclosure: { width: number; height: number; depth: number }; surfaceY: number; maxSize?: number; onChange: (patch: DirectTransformPatch) => void }) {
  const groupRef = useRef<THREE.Group>(null); const operationRef = useRef<{ kind: 'resize' | 'rotate'; centerX: number; centerY: number; startDistance: number; startAngle: number; startSize: number; startRotation: number; orientation: number } | null>(null);
  const changeRef = useRef(onChange); const { camera, gl } = useThree();
  useEffect(() => { changeRef.current = onChange; }, [onChange]);
  useEffect(() => {
    const move = (event: PointerEvent) => {
      const operation = operationRef.current; if (!operation) return; event.preventDefault();
      if (operation.kind === 'resize') {
        const distance = Math.hypot(event.clientX - operation.centerX, event.clientY - operation.centerY);
        changeRef.current({ size: THREE.MathUtils.clamp(operation.startSize * distance / operation.startDistance, .12, maxSize) });
      } else {
        const angle = Math.atan2(event.clientY - operation.centerY, event.clientX - operation.centerX);
        const delta = THREE.MathUtils.radToDeg(Math.atan2(Math.sin(angle - operation.startAngle), Math.cos(angle - operation.startAngle)));
        changeRef.current({ rotation: Math.round(THREE.MathUtils.clamp(operation.startRotation + delta * operation.orientation, -180, 180)) });
      }
    };
    const end = () => { operationRef.current = null; gl.domElement.style.cursor = ''; };
    window.addEventListener('pointermove', move, { passive: false }); window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); window.removeEventListener('pointercancel', end); };
  }, [gl.domElement, maxSize]);
  const begin = (kind: 'resize' | 'rotate', event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation(); event.nativeEvent.preventDefault(); (event.target as EventTarget & { setPointerCapture(pointerId: number): void }).setPointerCapture(event.pointerId); const group = groupRef.current; if (!group) return;
    group.updateWorldMatrix(true, false); const rect = gl.domElement.getBoundingClientRect();
    const project = (point: THREE.Vector3) => { const projected = group.localToWorld(point).project(camera); return { x: rect.left + (projected.x + 1) * rect.width / 2, y: rect.top + (1 - projected.y) * rect.height / 2 }; };
    const center = project(new THREE.Vector3()); const axisX = project(new THREE.Vector3(1, 0, 0)); const axisY = project(new THREE.Vector3(0, 1, 0));
    const determinant = (axisX.x - center.x) * (axisY.y - center.y) - (axisX.y - center.y) * (axisY.x - center.x);
    operationRef.current = { kind, centerX: center.x, centerY: center.y, startDistance: Math.max(12, Math.hypot(event.clientX - center.x, event.clientY - center.y)), startAngle: Math.atan2(event.clientY - center.y, event.clientX - center.x), startSize: size, startRotation: rotation, orientation: determinant < 0 ? -1 : 1 };
    gl.domElement.style.cursor = kind === 'resize' ? 'nwse-resize' : 'grabbing';
  };
  const side = surface === 'left-side' || surface === 'right-side'; const x = (u - .5) * enclosure.width; const z = (v - .5) * enclosure.height;
  const position: [number, number, number] = surface === 'back' ? [x, -enclosure.depth / 2 - .06, z] : side ? [surface === 'right-side' ? enclosure.width / 2 + .06 : -enclosure.width / 2 - .06, (v - .5) * enclosure.depth, (u - .5) * enclosure.height] : [x, surfaceY + .085, z];
  const frameRotation: [number, number, number] = surface === 'back' ? [Math.PI / 2, 0, THREE.MathUtils.degToRad(rotation)] : side ? [0, surface === 'right-side' ? Math.PI / 2 : -Math.PI / 2, THREE.MathUtils.degToRad(rotation)] : [-Math.PI / 2, 0, THREE.MathUtils.degToRad(rotation)];
  const stroke = Math.max(.014, Math.min(width, height) * .045); const handleRadius = Math.max(.068, Math.min(.11, Math.min(width, height) * .26)); const rotateGap = handleRadius * 2.8;
  const handleEvents = (kind: 'resize' | 'rotate') => ({ onPointerDown: (event: ThreeEvent<PointerEvent>) => begin(kind, event), onPointerMove: (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); gl.domElement.style.cursor = kind === 'resize' ? 'nwse-resize' : operationRef.current ? 'grabbing' : 'grab'; }, onPointerOut: () => { if (!operationRef.current) gl.domElement.style.cursor = ''; } });
  const frameMaterial = <meshBasicMaterial color="#b7ff19" transparent opacity={.98} depthTest={false} depthWrite={false} toneMapped={false} />;
  return <group ref={groupRef} position={position} rotation={frameRotation} renderOrder={12}>
    <mesh position={[0, height / 2, .006]}><planeGeometry args={[width + stroke, stroke]} />{frameMaterial}</mesh><mesh position={[0, -height / 2, .006]}><planeGeometry args={[width + stroke, stroke]} />{frameMaterial}</mesh>
    <mesh position={[-width / 2, 0, .006]}><planeGeometry args={[stroke, height]} />{frameMaterial}</mesh><mesh position={[width / 2, 0, .006]}><planeGeometry args={[stroke, height]} />{frameMaterial}</mesh>
    <mesh position={[0, height / 2 + rotateGap / 2, .006]}><planeGeometry args={[stroke, rotateGap]} />{frameMaterial}</mesh>
    <group position={[0, height / 2 + rotateGap, .012]} {...handleEvents('rotate')}><mesh><circleGeometry args={[handleRadius * 1.65, 24]} /><meshBasicMaterial transparent opacity={.001} depthTest={false} depthWrite={false} /></mesh><mesh position={[0, 0, .002]}><circleGeometry args={[handleRadius, 24]} />{frameMaterial}</mesh></group>
    {([[-width / 2, -height / 2], [width / 2, -height / 2], [-width / 2, height / 2], [width / 2, height / 2]] as [number, number][]).map(([handleX, handleY], index) => <group key={index} position={[handleX, handleY, .012]} {...handleEvents('resize')}><mesh><circleGeometry args={[handleRadius * 1.65, 24]} /><meshBasicMaterial transparent opacity={.001} depthTest={false} depthWrite={false} /></mesh><mesh position={[0, 0, .002]}><circleGeometry args={[handleRadius, 24]} />{frameMaterial}</mesh></group>)}
    {Math.abs(u - .5) < .001 && <mesh position={[-(u - .5) * width, 0, -.002]}><planeGeometry args={[stroke * .55, Math.max(height * 2.5, .8)]} /><meshBasicMaterial color="#ffef63" transparent opacity={.82} depthTest={false} depthWrite={false} /></mesh>}
    {Math.abs(v - .5) < .001 && <mesh position={[0, -(v - .5) * height, -.002]}><planeGeometry args={[Math.max(width * 2.5, .8), stroke * .55]} /><meshBasicMaterial color="#ffef63" transparent opacity={.82} depthTest={false} depthWrite={false} /></mesh>}
  </group>;
}
function DirectStickerSurface({ graphic, size, surfaceY, onChange }: { graphic: UserGraphic; size: { width: number; height: number; depth: number }; surfaceY: number; onChange: (graphic: UserGraphic) => void }) {
  const mark: PedalMark = { ...defaultMark, enabled: true, surface: graphic.surface, u: graphic.u, v: graphic.v };
  return <DirectMarkSurface mark={mark} size={size} surfaceY={surfaceY} onChange={next => onChange({ ...graphic, surface: next.surface, u: next.u, v: next.v })} />;
}
function DirectSignatureEditor({ mark, size, surfaceY, onChange }: { mark: PedalMark; size: { width: number; height: number; depth: number }; surfaceY: number; onChange: (mark: PedalMark) => void }) {
  const side = mark.surface === 'left-side' || mark.surface === 'right-side'; const width = (side ? size.height : size.width) * mark.size; const height = Math.max(side ? .11 : .14, width / 4.2);
  return <><DirectMarkSurface mark={mark} size={size} surfaceY={surfaceY} onChange={onChange} />{mark.enabled && mark.text.trim() && <DirectTransformFrame surface={mark.surface} u={mark.u} v={mark.v} width={width} height={height} rotation={mark.rotation} size={mark.size} enclosure={size} surfaceY={surfaceY} onChange={patch => onChange({ ...mark, enabled: true, ...patch })} />}</>;
}
function DirectGraphicEditor({ graphic, size, surfaceY, onChange }: { graphic: UserGraphic; size: { width: number; height: number; depth: number }; surfaceY: number; onChange: (graphic: UserGraphic) => void }) {
  const side = graphic.surface === 'left-side' || graphic.surface === 'right-side'; const ratio = Math.max(.35, Math.min(2.85, graphic.width / graphic.height)); const width = (side ? size.height : size.width) * graphic.size; const height = width / ratio;
  return <><DirectStickerSurface graphic={graphic} size={size} surfaceY={surfaceY} onChange={onChange} /><DirectTransformFrame surface={graphic.surface} u={graphic.u} v={graphic.v} width={width} height={height} rotation={graphic.rotation} size={graphic.size} enclosure={size} surfaceY={surfaceY} maxSize={3} onChange={patch => onChange({ ...graphic, ...patch })} /></>;
}
function BackPanel({ size }: { size: { width: number; height: number; depth: number } }) {
  return <group position={[0, -size.depth / 2 - .025, 0]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[size.width * .86, size.height * .82]} /><meshStandardMaterial color="#20241f" metalness={.58} roughness={.58} /></mesh>
    {([[-.38, -.38], [.38, -.38], [-.38, .38], [.38, .38]] as [number, number][]).map(([x, z], i) => <mesh key={i} position={[x * size.width, -.028, z * size.height]}><cylinderGeometry args={[.09, .09, .075, 20]} /><meshStandardMaterial color="#111410" roughness={.86} /></mesh>)}
    <SurfaceText text="SERIAL / 9V DC / MADE IN THE FORGE" position={[0, -.052, 0]} width={Math.min(size.width * .66, 2.3)} color="#aeb6aa" />
  </group>;
}

function PedalModel({ pedal, runtimeMode = 'play', userGraphics = [], marks = [], activeMark, activeGraphic, directMarkEditing = false, finishTool = 'signature', shotPreset, onMarkChange, onGraphicChange }: { pedal: Pedal; runtimeMode?: RuntimeMode; userGraphics?: UserGraphic[]; marks?: PedalMark[]; activeMark?: PedalMark; activeGraphic?: UserGraphic | null; directMarkEditing?: boolean; finishTool?: 'signature' | 'sticker'; shotPreset?: ShotPresetId; onMarkChange?: (mark: PedalMark) => void; onGraphicChange?: (graphic: UserGraphic) => void }) {
  const isBrokenSignal = pedal.name.replace(' // LIMITED', '') === 'BROKEN SIGNAL';
  const controls = isBrokenSignal ? ['CLEAN', 'BLEND', 'GAIN', 'LEVEL', 'BASS', 'MID', 'TREBLE', 'PRESENCE'] : pedal.knobs;
  const eqSliders = isBrokenSignal ? [] : pedal.eqSliders || [];
  const resolvedEnclosure: Enclosure = isBrokenSignal ? 'wide' : pedal.enclosure;
  const size = enclosureDimensions[resolvedEnclosure];
  const hybridLayout = eqSliders.length ? createHybridLayoutPlan({ width: size.width, height: size.height, knobCount: controls.length, sliderCount: eqSliders.length, hasLargePaddle: pedal.footswitchStyle === 'large-lower-paddle', footswitchCount: pedal.footswitches, seed: pedal.seed }) : undefined;
  const geometry = useMemo(() => roundedEnclosureGeometry(size.width, size.height, size.depth), [size.width, size.height, size.depth]);
  const texture = useMemo(() => { const art = new THREE.TextureLoader().load(pedal.artAtlas === 'b' ? '/pedal-forge-atlas-b.webp' : '/pedal-forge-atlas-a.webp'); art.colorSpace = THREE.SRGBColorSpace; art.wrapS = THREE.ClampToEdgeWrapping; art.wrapT = THREE.ClampToEdgeWrapping; art.repeat.set(.25, .9); art.offset.set(pedal.artIndex * .25, .05); return art; }, [pedal.artIndex, pedal.artAtlas]);
  useEffect(() => () => { geometry.dispose(); texture.dispose(); }, [geometry, texture]);
  const isTunerPedal = pedal.effectType === 'tuner' || pedal.type.includes('TUNER');
  const designSource: DesignSource = isTunerPedal ? 'legacy' : pedal.designSource || 'legacy';
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
  const usesFullArtwork = designSource === 'legacy' && graphicMode === 'FULL ILLUSTRATION' && artCoverage === 'full'; const artSize: [number, number] = [size.width * .94, size.height * .94]; const tunerSquare = pedal.tunerDisplayShape === 'square'; const tunerDisplayWidth = tunerSquare ? Math.min(size.width * .7, size.height * .38, 1.8) : size.width * .72; const tunerDisplayDepth = tunerSquare ? tunerDisplayWidth : Math.min(size.height * .26, 1.06); const indicatorClearance = Math.max(ledLocation === 'upper' ? .5 : .44, size.height * .14); const indicatorZ = hybridLayout?.indicatorZ ?? (largePaddle ? -size.height * .02 : switchZ - indicatorClearance); const showTopScrews = hardwareCulture === 'LAB UTILITY' || condition === 'DIY MODIFIED';
  return <group rotation={shotPreset === 'editorial-cover-top' ? [0, 0, 0] : [0, -.08, 0]}><group>
    <mesh geometry={geometry} castShadow receiveShadow><meshPhysicalMaterial color={pedal.palette[1]} metalness={finishMaterial.metalness} roughness={finishMaterial.roughness} clearcoat={finishMaterial.clearcoat} clearcoatRoughness={finishMaterial.clearcoatRoughness} iridescence={finishMaterial.iridescence || 0} iridescenceIOR={1.5} iridescenceThicknessRange={[180, 620]} envMapIntensity={['brushed', 'anodized', 'iridescent', 'holographic'].includes(materialStyle) ? 1.15 : .58} /></mesh>
    <BackPanel size={size} />
    {showTopScrews && ([[-.43, -.43], [.43, .43]] as [number, number][]).map(([x, z], i) => <ChassisScrew key={i} position={[x * size.width, surfaceY + .018, z * size.height]} />)}
    {resolvedEnclosure === 'digital' && <mesh position={[0, surfaceY - .055, .18]} rotation={[-Math.PI / 2, 0, 0]}><boxGeometry args={[size.width * .94, size.height * .5, .11]} /><meshStandardMaterial color={pedal.palette[1]} metalness={finishMaterial.metalness} roughness={finishMaterial.roughness} /></mesh>}
    {usesFullArtwork && <mesh position={[0, surfaceY - .028, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={artSize} /><meshStandardMaterial map={texture} color={pedal.variant ? '#f2eadf' : '#ffffff'} metalness={finishMaterial.metalness * .55} roughness={Math.max(.48, finishMaterial.roughness)} polygonOffset polygonOffsetFactor={-2} /></mesh>}
    {designSource === 'motif-sheet' && <SheetDesignArtwork source="motif-sheet" index={pedal.designSourceIndex || 0} size={size} surfaceY={surfaceY} placement={pedal.motifPlacement} />}
    {designSource === 'illustration-sheet' && <SheetDesignArtwork source="illustration-sheet" index={pedal.designSourceIndex || 0} size={size} surfaceY={surfaceY} />}
    {designSource === 'procedural-pattern' && <ProceduralPatternArtwork style={pedal.patternStyle || 'stripe'} size={size} surfaceY={surfaceY} colors={accentColors} />}
    {userGraphics.map((graphic, index) => graphic.textureUrl && <StickerMark key={graphic.id} graphic={graphic} size={size} surfaceY={surfaceY} layer={index} />)}
    {designSource === 'legacy' && pedal.visualIntensity === 'maximal' && !userGraphics.some(graphic => graphic.textureUrl && graphic.visible) && <MaximalArtwork pedal={pedal} size={size} surfaceY={surfaceY} />}
    {hardwareCulture === 'LAB UTILITY' && <XlrPort position={[size.width / 2 + .05, 0, size.height * .18]} />}
    {controls.length >= 5 && groupRows.map(({ group, row }) => <ControlGroupFrame key={group.name} group={group} row={row} style={pedal.controlGroupFrameStyle || 'thin-line'} radius={knobRadius} surfaceY={labelSurfaceY - .018} color={graphicColor} backgroundColor={pedal.palette[1]} />)}
    {!!eqSliders.length && hybridLayout && <SliderEqGroup sliders={eqSliders} surfaceY={surfaceY} color={graphicColor} layout={hybridLayout.eqPanel} />}
    {hardwareCulture === 'TREADLE STOMP' && <group position={[0, surfaceY + .09, size.height * .2]}>
      <mesh castShadow><boxGeometry args={[size.width * .78, .18, size.height * .48]} /><meshStandardMaterial color="#171a17" roughness={.66} metalness={.22} /></mesh>
      {[-2, -1, 0, 1, 2].map(i => <mesh key={i} position={[i * size.width * .12, .105, 0]}><boxGeometry args={[.035, .025, size.height * .4]} /><meshStandardMaterial color="#4a4f48" roughness={.8} /></mesh>)}
    </group>}
    {hardwareCulture === 'DIGITAL MULTI' && !isTunerPedal && <group>
      <mesh position={[0, surfaceY + .08, -size.height * .29]}><boxGeometry args={[size.width * .65, .13, size.height * .24]} /><meshStandardMaterial color="#111714" emissive={pedal.palette[0]} emissiveIntensity={.12} metalness={.45} roughness={.24} /></mesh>
      <group position={[0, surfaceY + .16, -size.height * .29]}><RuntimeDisplay width={size.width * .65} label={pedal.type + ' / P01'} color={pedal.palette[0]} runtimeMode={runtimeMode} /></group>
      {([[-.72, .12], [.72, .12], [-.72, .82], [.72, .82]] as [number, number][]).map(([x, z], i) => <group key={i} position={[x, surfaceY + .1, z]}><mesh><boxGeometry args={[.58, .16, .48]} /><meshStandardMaterial color="#202420" roughness={.7} /></mesh><SurfaceText text={['MEM-', 'MEM+', 'BACK', 'NEXT'][i]} position={[0, .1, 0]} width={.42} color="#dce2d8" /></group>)}
    </group>}
    {isTunerPedal && <group position={[0, surfaceY + .09, -size.height * .19]}><TunerDisplay width={tunerDisplayWidth} depth={tunerDisplayDepth} color={pedal.palette[0]} runtimeMode={runtimeMode} /></group>}
    <WearMarks size={size} condition={condition} surfaceY={surfaceY} />
    {!hybridLayout && designSource === 'legacy' && <GraphicAccent mode={graphicMode} size={size} surfaceY={surfaceY} color={accentColors[pedal.artIndex % accentColors.length]} artIndex={pedal.artIndex} motifType={pedal.motifType || 'wave'} renderStyle={pedal.motifRenderStyle || 'line-art'} placement={pedal.motifPlacement || 'lower-right'} scale={pedal.motifScale || 'small'} />}
    {!hybridLayout && <KanjiDesignMark pedal={pedal} size={size} surfaceY={surfaceY} controlCount={controls.length + eqSliders.length} />}
    {positions.map((position, i) => { const isPrimary = controls[i] === primaryControl; return <RotaryControlUnit key={i} position={position} label={controls[i]} style={knobStyle} baseRadius={knobRadius} isPrimary={isPrimary} color={isPrimary ? accentColors[0] : hardwareColors[i % hardwareColors.length]} labelColor={graphicColor} labelWidth={Math.min(.68, size.width * .25)} labelSurfaceY={labelSurfaceY} enclosureHeight={size.height} showLabel={true} font={utilityFont} labelPlacement={hybridLayout?.knobCenters[i]?.labelPlacement} />; })}
    {Array.from({ length: pedal.toggleCount }, (_, i) => { const x = pedal.toggleCount === 1 ? -size.width * .22 : (i - (pedal.toggleCount - 1) / 2) * size.width * .2; return <ToggleSwitch key={i} position={[x, .64, indicatorZ]} label={toggleLabels[i] || (i ? 'VOICE' : 'MODE')} surfaceY={surfaceY} color="#f4f1e6" />; })}
    {largePaddle && hardwareCulture !== 'TREADLE STOMP' && <><group position={[0, surfaceY + .025, size.height * .29]}><LargePaddleFootswitch width={size.width * .82} length={size.height * .42} active={runtimeMode !== 'off'} /></group><SurfaceText text={'BYPASS'} position={[0, surfaceY, size.height * .045]} width={Math.min(.58, size.width * .36)} color={graphicColor} font={utilityFont} outline={false} /></>}
    {hardwareCulture !== 'TREADLE STOMP' && !largePaddle && Array.from({ length: pedal.footswitches }, (_, i) => { const x = pedal.footswitches === 1 ? 0 : (i === 0 ? -1 : 1) * size.width * .25; const soft = footswitchStyle === 'soft-touch' || footswitchStyle === 'pad'; return <group key={i}><group position={[x, size.depth / 2 + .19, switchZ]}><FootswitchHardware soft={soft} /></group><SurfaceText text={footswitchLabels[i] || (i ? 'ALT' : 'BYPASS')} position={[x, surfaceY, switchZ - .28]} width={Math.min(.52, size.width * .34)} color={graphicColor} font={utilityFont} outline={false} /></group>; })}
    {Array.from({ length: ledCount }, (_, i) => { const x = ledCount === 1 ? (pedal.toggleCount ? size.width * .22 : 0) : (i - (ledCount - 1) / 2) * size.width * .5; const active = runtimeMode !== 'off' && (i === 0 || runtimeMode === 'play'); const pulse = i > 0 && footswitchLabels.some(label => label.includes('TAP')); return <LedLens key={i} style={ledStyle} color={ledColors[i] || ledColors[0] || '#ff3028'} position={[x, surfaceY + .035, indicatorZ]} runtimeMode={active ? runtimeMode : 'off'} pulse={pulse} />; })}
    {display !== 'none' && hardwareCulture !== 'DIGITAL MULTI' && !isTunerPedal && <group position={[0, surfaceY + .02, size.height * .04]}><RuntimeDisplay width={Math.min(1.3, size.width * .5)} label={display === 'oled' ? pedal.type : 'PATCH 0' + pedal.rarity} color={pedal.palette[0]} runtimeMode={runtimeMode} /></group>}
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
    {directMarkEditing && finishTool === 'signature' && activeMark && onMarkChange && <DirectSignatureEditor mark={activeMark} size={size} surfaceY={surfaceY} onChange={onMarkChange} />}
    {directMarkEditing && finishTool === 'sticker' && activeGraphic && onGraphicChange && <DirectGraphicEditor graphic={activeGraphic} size={size} surfaceY={surfaceY} onChange={onGraphicChange} />}
    {marks.map(mark => <SignatureMark key={mark.id} mark={mark} size={size} surfaceY={surfaceY} />)}
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
function RevealSequence({ pedal, reduce }: { pedal: Pedal; reduce: boolean }) {
  const prize = useRef<THREE.Group>(null!); const particles = useRef<THREE.Group>(null!); const elapsed = useRef(0);
  useFrame((_, delta) => { elapsed.current += delta; const progress = reduce ? 1 : Math.min(1, elapsed.current / 1.55); const emerge = 1 - Math.pow(1 - progress, 3); prize.current.scale.setScalar(.12 + emerge * .88); prize.current.position.y = -.9 + emerge * 1.15; if (!reduce) particles.current.rotation.y += delta * .9; particles.current.scale.setScalar(.35 + emerge * 1.5); });
  return <group position={[0, .1, 0]}>
    <ForgeSigil color={pedal.palette[0]} reveal reduce={reduce} />
    <group ref={particles}>{Array.from({ length: 28 }, (_, i) => { const angle = i / 28 * Math.PI * 2; const radius = .56 + i % 5 * .25; return <mesh key={i} position={[Math.cos(angle) * radius, -.42 + i % 7 * .27, Math.sin(angle) * radius]}><sphereGeometry args={[.018 + i % 3 * .009, 7, 5]} /><meshBasicMaterial color={i % 4 ? pedal.palette[0] : '#ffffff'} transparent opacity={.76} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} /></mesh>; })}</group>
    <group ref={prize} scale={.12}><PedalModel pedal={pedal} runtimeMode="off" /></group>
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
type CameraFitFrame = { width: number; height: number; padding: number };
function CameraController({ enabled, home, resetToken, autoRotate, fitFrame }: { enabled: boolean; home: [number, number, number]; resetToken: number; autoRotate: boolean; fitFrame?: CameraFitFrame }) {
  const { camera, gl, size } = useThree(); const controls = useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl.domElement]);
  const fittedHome = useMemo<[number, number, number]>(() => {
    if (fitFrame && camera instanceof THREE.PerspectiveCamera) {
      const aspect = Math.max(.1, size.width / Math.max(1, size.height)); const halfFov = THREE.MathUtils.degToRad(camera.fov) / 2;
      const verticalDistance = fitFrame.height / 2 / Math.tan(halfFov); const horizontalDistance = fitFrame.width / 2 / (Math.tan(halfFov) * aspect);
      const fitDistance = Math.max(verticalDistance, horizontalDistance) * fitFrame.padding;
      const direction = new THREE.Vector3(...home).normalize().multiplyScalar(fitDistance);
      return direction.toArray() as [number, number, number];
    }
    const portraitScale = size.width < size.height ? 1.16 : 1;
    return home.map(value => value * portraitScale) as [number, number, number];
  }, [camera, fitFrame, home, size.height, size.width]);
  useEffect(() => { controls.enableDamping = true; controls.dampingFactor = .08; controls.enablePan = false; controls.minPolarAngle = .08; controls.maxPolarAngle = Math.PI - .08; controls.touches.ONE = THREE.TOUCH.ROTATE; controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE; return () => controls.dispose(); }, [controls]);
  useEffect(() => { controls.enabled = enabled; controls.autoRotate = enabled && autoRotate; controls.autoRotateSpeed = .75; controls.minDistance = Math.hypot(...fittedHome) * .5; controls.maxDistance = Math.hypot(...fittedHome) * 1.6; }, [controls, enabled, fittedHome, autoRotate]);
  useEffect(() => { camera.up.set(0, Math.abs(fittedHome[1]) > Math.abs(fittedHome[2]) ? 0 : 1, Math.abs(fittedHome[1]) > Math.abs(fittedHome[2]) ? -1 : 0); camera.position.set(...fittedHome); controls.target.set(0, 0, 0); controls.update(); }, [camera, controls, fittedHome, resetToken]);
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
function Stage({ pedal, phase, canvasRef, reduce, resetToken, viewMode, runtimeMode, userGraphics, marks, activeMark, activeGraphic, inspectSurface, autoRotate, directMarkEditing = false, finishTool = 'signature', onMarkChange, onGraphicChange }: { pedal: Pedal | null; phase: GachaState; canvasRef: React.MutableRefObject<HTMLCanvasElement | null>; reduce: boolean; resetToken: number; viewMode: ViewMode; runtimeMode: RuntimeMode; userGraphics: UserGraphic[]; marks: PedalMark[]; activeMark?: PedalMark; activeGraphic?: UserGraphic | null; inspectSurface: MarkSurface; autoRotate: boolean; directMarkEditing?: boolean; finishTool?: 'signature' | 'sticker'; onMarkChange?: (mark: PedalMark) => void; onGraphicChange?: (graphic: UserGraphic) => void }) {
  const topView = phase === 'revealing' || phase === 'result';
  const floorless = viewMode === 'white' || viewMode === 'dark';
  const extent = pedal ? Math.max(enclosureDimensions[pedal.enclosure].width, enclosureDimensions[pedal.enclosure].height) : 4; const distance = extent * 1.42;
  const editFitFrame = useMemo<CameraFitFrame | undefined>(() => {
    if (!directMarkEditing || !pedal) return undefined;
    const enclosure = enclosureDimensions[pedal.enclosure]; const side = inspectSurface === 'left-side' || inspectSurface === 'right-side';
    return side ? { width: enclosure.height, height: enclosure.depth * 1.85, padding: 1.18 } : { width: enclosure.width, height: enclosure.height, padding: 1.18 };
  }, [directMarkEditing, inspectSurface, pedal]);
  const home = useMemo<[number, number, number]>(() => {
    if (!topView) return [0, 0, 7];
    if (directMarkEditing) {
      if (inspectSurface === 'left-side') return [-distance, 0, 0];
      if (inspectSurface === 'right-side') return [distance, 0, 0];
      if (inspectSurface === 'back') return [0, -distance, 0];
      return [0, distance, 0];
    }
    return viewMode === 'studio' ? [distance * .42, distance * .88, distance * .72] : viewMode === 'hero' ? [distance * .76, distance * .48, distance * .82] : floorless ? [distance * .38, distance * .62, distance * .86] : [distance * .56, distance * .74, distance * .82];
  }, [directMarkEditing, distance, floorless, inspectSurface, topView, viewMode]);
  const background = viewMode === 'white' ? '#f7f7f4' : viewMode === 'dark' ? '#0d110e' : viewMode === 'studio' ? '#f4f4f1' : viewMode === 'hero' ? (pedal?.colorChoice === 'ice' ? '#dcebed' : pedal?.colorChoice === 'ember' ? '#321b16' : pedal?.colorChoice === 'violet' ? '#25172b' : pedal?.colorChoice === 'monochrome' ? '#d9dcd7' : pedal?.colorChoice === 'high-tone' ? '#f3e9c8' : '#18220f') : '#0b110d';
  const floorY = topView ? -.62 : -2.2;
  return <Canvas className="forge-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} shadows dpr={[1, 1.5]} gl={{ preserveDrawingBuffer: true, antialias: true }} onCreated={({ gl, camera }) => { canvasRef.current = gl.domElement; camera.lookAt(0, 0, 0); }} fallback={<div className="canvas-fallback">3D PREVIEW UNAVAILABLE</div>} camera={{ position: home, fov: directMarkEditing ? 26 : viewMode === 'hero' ? 34 : topView ? 36 : 38 }}>
    <RenderSettings viewMode={viewMode} />
    <CameraController enabled={phase === 'result' && !directMarkEditing} home={home} resetToken={resetToken} autoRotate={autoRotate} fitFrame={editFitFrame} />
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
    {phase === 'idle' ? <EmptyStage viewMode={viewMode} /> : phase === 'result' && pedal ? <PedalModel pedal={pedal} runtimeMode={runtimeMode} userGraphics={userGraphics} marks={marks} activeMark={activeMark} activeGraphic={activeGraphic} directMarkEditing={directMarkEditing} finishTool={finishTool} onMarkChange={onMarkChange} onGraphicChange={onGraphicChange} /> : phase === 'revealing' && pedal ? <RevealSequence pedal={pedal} reduce={reduce} /> : <ForgeMachine pedal={pedal} reduce={reduce} />}
  </Canvas>;
}

const createDefaultMark = (surface: MarkSurface = 'top'): PedalMark => ({ id: `signature-${surface}`, enabled: false, text: '', surface, u: .5, v: .5, size: .24, rotation: -5, font: 'gothic-jp', color: '#f4f1e8', style: 'print' });
const defaultMark: PedalMark = createDefaultMark();
const alignmentPosition = (mode: AlignmentMode, u: number, v: number) => ({ u: mode === 'left' ? .1 : mode === 'right' ? .9 : mode === 'center-x' || mode === 'center' ? .5 : u, v: mode === 'top' ? .1 : mode === 'bottom' ? .9 : mode === 'center-y' || mode === 'center' ? .5 : v });
function FinishEditor({ mark, graphic, stickers, error, tool, open, canUndo, canRedo, onTool, onClose, onMarkChange, onMarkRemove, onGraphicFile, onGraphicChange, onGraphicRemove, onGraphicSelect, onInspect, onUndo, onRedo, onReset }: { mark: PedalMark; graphic: UserGraphic | null; stickers: UserGraphic[]; error: string; tool: 'signature' | 'sticker'; open: boolean; canUndo: boolean; canRedo: boolean; onTool: (tool: 'signature' | 'sticker') => void; onClose: () => void; onMarkChange: (mark: PedalMark) => void; onMarkRemove: () => void; onGraphicFile: (file: File, replace: boolean) => void; onGraphicChange: (patch: Partial<UserGraphic>) => void; onGraphicRemove: () => void; onGraphicSelect: (id: string) => void; onInspect: (surface: MarkSurface) => void; onUndo: () => void; onRedo: () => void; onReset: () => void }) {
  if (!open) return null;
  const fontOptions: [PedalMark['font'], string][] = [['gothic-jp', 'ゴシック'], ['mincho-jp', '明朝'], ['maru-gothic-jp', '丸ゴシック'], ['gyosho-jp', '行書体'], ['brush-jp', '筆文字'], ['handwritten-jp', '手書き'], ['retro-jp', 'レトロ'], ['seal-jp', '古印風'], ['sans', 'SANS'], ['serif', 'SERIF'], ['mono', 'MONO'], ['condensed', 'CONDENSED'], ['signature-script', 'SIGNATURE SCRIPT'], ['elegant-script', 'ELEGANT SCRIPT'], ['fashion-serif', 'FASHION SERIF'], ['vintage-script', 'VINTAGE SCRIPT'], ['typewriter', 'TYPEWRITER'], ['stencil', 'STENCIL']];
  const styleOptions: [PedalMark['style'], string][] = [['print', '印刷'], ['stamp', 'スタンプ'], ['engraved', '刻印'], ['etched', 'エッチング'], ['paint-marker', 'マーカー'], ['decal', 'デカール'], ['embossed', 'エンボス']];
  const surfaceOptions: [MarkSurface, string][] = [['top', '上'], ['left-side', '左'], ['right-side', '右'], ['back', '裏']];
  const fileInput = (replace: boolean) => <input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => { const file = event.target.files?.[0]; if (file) onGraphicFile(file, replace); event.currentTarget.value = ''; }} />;
  const align = (mode: AlignmentMode) => { if (tool === 'signature') onMarkChange({ ...mark, enabled: true, ...alignmentPosition(mode, mark.u, mark.v) }); else if (graphic) onGraphicChange(alignmentPosition(mode, graphic.u, graphic.v)); };
  return <section className="signature-editor direct-3d-mark-controls">
    <header><div><p className="eyebrow">03 / FINISH</p><h2>署名・ステッカー</h2></div><button onClick={onClose} aria-label="最終加工を閉じる">×</button></header>
    <nav className="finish-tool-tabs" aria-label="編集する加工"><button type="button" className={tool === 'signature' ? 'active' : ''} onClick={() => { onTool('signature'); onInspect(mark.surface); }}>署名</button><button type="button" className={tool === 'sticker' ? 'active' : ''} onClick={() => { onTool('sticker'); onInspect(graphic?.surface || 'top'); }}>ステッカー</button></nav>
    {tool === 'signature' ? <>
      <label className="direct-mark-text">TEXT<input value={mark.text} maxLength={32} onChange={event => onMarkChange({ ...mark, enabled: true, text: event.target.value })} placeholder="文字を入力" /></label>
      <nav className="direct-mark-view-tabs" aria-label="署名を配置する面">{surfaceOptions.map(([surface, label]) => <button type="button" key={surface} className={mark.surface === surface ? 'active' : ''} onClick={() => { onMarkChange({ ...mark, surface }); onInspect(surface); }}>{label}</button>)}</nav>
      <div className="direct-mark-settings">
        <label>FONT<select value={mark.font} onChange={event => onMarkChange({ ...mark, font: event.target.value as PedalMark['font'] })}>{fontOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><span className="font-live-preview" style={{ fontFamily: markFonts[mark.font] }}>{mark.text || (mark.font.endsWith('-jp') ? '山田一郎' : 'Kazushige')}</span></label>
        <label>STYLE<select value={mark.style} onChange={event => onMarkChange({ ...mark, style: event.target.value as PedalMark['style'] })}>{styleOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
        <label>COLOR<input type="color" value={mark.color} onChange={event => onMarkChange({ ...mark, color: event.target.value })} /></label>
      </div>
      <div className="decoration-align" aria-label="署名の整列"><span>ALIGN</span>{(['left', 'center-x', 'right', 'top', 'center-y', 'bottom', 'center'] as AlignmentMode[]).map(mode => <button type="button" key={mode} onClick={() => align(mode)}>{mode}</button>)}</div>
      <p className="direct-mark-status">本体上の枠：4隅でサイズ / 上で角度 · 中央付近は自動スナップ</p>
      <div className="signature-actions"><button disabled={!mark.text.trim()} onClick={() => { onMarkChange({ ...mark, enabled: true }); onClose(); }}>確定</button><button className="outline" onClick={onMarkRemove}>署名しない</button></div>
    </> : <>
      <div className="sticker-library"><header><b>STICKERS</b><span>{stickers.length} / 5</span><label className="change-graphic">＋ 追加{fileInput(false)}</label></header>{stickers.length > 0 && <div>{stickers.map(item => <button type="button" key={item.id} className={graphic?.id === item.id ? 'active' : ''} onClick={() => { onGraphicSelect(item.id); onInspect(item.surface); }}><img src={item.textureUrl || item.sourceUrl} alt="" /><span>{item.fileName}</span><small>{item.surface.toUpperCase()}</small></button>)}</div>}</div>
      {!graphic ? <label className="graphic-drop sticker-drop">{fileInput(false)}<strong>＋ ステッカー画像を選択</strong><span>PNG / JPG / WEBP · 最大15MB · 512px以下へ自動圧縮</span></label> : <>
        <div className="sticker-file"><img src={graphic.textureUrl || graphic.sourceUrl} alt="選択したステッカー" /><div><b>{graphic.fileName}</b><span>{graphic.width} × {graphic.height}</span></div><label className="change-graphic">画像を変更{fileInput(true)}</label></div>
        <nav className="direct-mark-view-tabs" aria-label="ステッカーを配置する面">{surfaceOptions.map(([surface, label]) => <button type="button" key={surface} className={graphic.surface === surface ? 'active' : ''} onClick={() => { onGraphicChange({ surface }); onInspect(surface); }}>{label}</button>)}</nav>
        <div className="decoration-align" aria-label="ステッカーの整列"><span>ALIGN</span>{(['left', 'center-x', 'right', 'top', 'center-y', 'bottom', 'center'] as AlignmentMode[]).map(mode => <button type="button" key={mode} onClick={() => align(mode)}>{mode}</button>)}</div>
      </>}
      {error && <p className="graphic-error" role="alert">{error}</p>}
      <p className="direct-mark-status">本体上の枠：4隅でサイズ / 上で角度 · 面より大きくでき、はみ出しは選択面でクロップ</p>
      <div className="signature-actions"><button disabled={!graphic} onClick={onClose}>確定</button>{graphic && <button className="outline" onClick={onGraphicRemove}>ステッカーを外す</button>}</div>
      <p className="graphic-privacy">画像はこのブラウザ内だけで処理され、外部へ送信されません。</p>
    </>}
    <div className="finish-history-actions"><button type="button" onClick={onUndo} disabled={!canUndo}>↶ UNDO</button><button type="button" onClick={onRedo} disabled={!canRedo}>↷ REDO</button><button type="button" onClick={onReset}>錬成時に戻す</button></div>
  </section>;
}
function indicatorSummary(pedal: Pedal) {
  const count = Math.max(0, pedal.ledCount ?? 1); if (!count) return 'NO LED';
  const rawStyle = pedal.ledStyle as string | undefined; const style = rawStyle === 'flat' || rawStyle === 'lens' || rawStyle === 'dome' ? rawStyle : 'dome'; const location = pedal.ledLocation === 'center' ? 'CENTER' : 'UPPER'; const colors = (pedal.ledColors?.length ? pedal.ledColors : ['#ff3028']).slice(0, count).join(' / ');
  return `${count} × ${style.toUpperCase()} / ${location} / ${colors.toUpperCase()}`;
}
function EditorialCoverCaptureScene({ pedal, stickers, signatures, onCapture }: { pedal: Pedal; stickers: UserGraphic[]; signatures: PedalMark[]; onCapture: (image: string) => void }) {
  const root = useRef<THREE.Group>(null); const captured = useRef(false); const frames = useRef(0); const { camera, gl, scene, size } = useThree();
  useFrame(() => {
    if (captured.current || !root.current || ++frames.current < 12 || !(camera instanceof THREE.PerspectiveCamera)) return;
    root.current.updateWorldMatrix(true, true); const box = new THREE.Box3().setFromObject(root.current); const center = box.getCenter(new THREE.Vector3()); const bounds = box.getSize(new THREE.Vector3());
    const extent = Math.max(bounds.x, bounds.z); camera.aspect = size.width / size.height; camera.fov = 30; camera.near = .01; camera.far = 100;
    camera.up.set(0, 1, 0); camera.position.set(center.x + extent * .84, box.max.y + extent * .96, center.z + extent * 1.26); camera.lookAt(center.x, center.y + .12, center.z); camera.updateProjectionMatrix(); gl.render(scene, camera);
    captured.current = true; onCapture(gl.domElement.toDataURL('image/png'));
  });
  return <>
    <color attach="background" args={['#08100b']} /><ambientLight intensity={.52} /><hemisphereLight color="#eef5ef" groundColor="#101711" intensity={.9} /><directionalLight position={[-4, 9, 5]} intensity={4.2} color="#fff8eb" />
    <group ref={root}><PedalModel pedal={pedal} runtimeMode="play" userGraphics={stickers} marks={signatures} shotPreset="editorial-cover-top" /></group>
  </>;
}
function EditorialCoverCapture({ pedal, stickers, signatures, onCapture }: { pedal: Pedal; stickers: UserGraphic[]; signatures: PedalMark[]; onCapture: (image: string) => void }) {
  return <div className="editorial-cover-capture" aria-hidden="true"><Canvas dpr={1} gl={{ preserveDrawingBuffer: true, antialias: true }} camera={{ position: [6, 6, 6], fov: 30, near: .01, far: 100 }}><RenderSettings viewMode="studio" /><EditorialCoverCaptureScene pedal={pedal} stickers={stickers} signatures={signatures} onCapture={onCapture} /></Canvas></div>;
}
function EditorialTopCaptureScene({ pedal, stickers, signatures, onCapture }: { pedal: Pedal; stickers: UserGraphic[]; signatures: PedalMark[]; onCapture: (image: string) => void }) {
  const root = useRef<THREE.Group>(null); const captured = useRef(false); const frames = useRef(0); const { camera, gl, scene, size } = useThree();
  useFrame(() => {
    if (captured.current || !root.current || ++frames.current < 12 || !(camera instanceof THREE.OrthographicCamera)) return;
    root.current.updateWorldMatrix(true, true); const box = new THREE.Box3().setFromObject(root.current); const center = box.getCenter(new THREE.Vector3()); const bounds = box.getSize(new THREE.Vector3());
    const aspect = size.width / size.height; const paddedWidth = bounds.x * 1.08; const paddedHeight = bounds.z * 1.08; const viewHeight = Math.max(paddedHeight, paddedWidth / aspect);
    camera.left = -viewHeight * aspect / 2; camera.right = viewHeight * aspect / 2; camera.top = viewHeight / 2; camera.bottom = -viewHeight / 2; camera.near = .01; camera.far = 100;
    camera.up.set(0, 0, -1); camera.position.set(center.x, box.max.y + 10, center.z); camera.lookAt(center); camera.updateProjectionMatrix(); gl.render(scene, camera);
    captured.current = true; onCapture(gl.domElement.toDataURL('image/png'));
  });
  return <><color attach="background" args={['#f2f0e8']} /><ambientLight intensity={1.15} /><hemisphereLight color="#ffffff" groundColor="#d8d5ca" intensity={1.5} /><directionalLight position={[-4, 9, 5]} intensity={3.4} color="#fff8eb" /><group ref={root}><PedalModel pedal={pedal} runtimeMode="play" userGraphics={stickers} marks={signatures} shotPreset="editorial-cover-top" /></group></>;
}
function EditorialTopCapture({ pedal, stickers, signatures, onCapture }: { pedal: Pedal; stickers: UserGraphic[]; signatures: PedalMark[]; onCapture: (image: string) => void }) {
  return <div className="editorial-cover-capture editorial-top-capture" aria-hidden="true"><Canvas orthographic dpr={1} gl={{ preserveDrawingBuffer: true, antialias: true }} camera={{ position: [0, 10, 0], near: .01, far: 100 }}><RenderSettings viewMode="studio" /><EditorialTopCaptureScene pedal={pedal} stickers={stickers} signatures={signatures} onCapture={onCapture} /></Canvas></div>;
}
function ArchiveThumbnailCapture({ pedal, stickers, signatures, onCapture }: { pedal: Pedal; stickers: UserGraphic[]; signatures: PedalMark[]; onCapture: (image: string) => void }) {
  return <div className="editorial-cover-capture editorial-top-capture" aria-hidden="true"><Canvas orthographic dpr={1} gl={{ preserveDrawingBuffer: true, antialias: true }} camera={{ position: [0, 10, 0], near: .01, far: 100 }}><RenderSettings viewMode="studio" /><EditorialTopCaptureScene key={pedal.id} pedal={pedal} stickers={stickers} signatures={signatures} onCapture={onCapture} /></Canvas></div>;
}
function EditorialPageFrame({ page, pageNumber, hasOverflow, openingSpread = false, captureRef }: { page: React.ReactNode; pageNumber: number; hasOverflow: boolean; openingSpread?: boolean; captureRef?: React.RefObject<HTMLDivElement | null> }) {
  return <div ref={captureRef} className={'manual-page-shell' + (hasOverflow ? ' layout-overflow' : '') + (openingSpread ? ' opening-spread-shell' : '')} data-page-width={openingSpread ? '1440' : '720'} data-page-height="980" data-layout-status={hasOverflow ? 'autofit' : 'fit'} data-editorial-cover-capture={captureRef ? 'true' : undefined}>{page}<span className="manual-page-number">{openingSpread ? '01—02' : String(pageNumber).padStart(2, '0')}</span></div>;
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
function EditorialResult({ pedal, coverImage, editorialCoverImage, editorialTopImage, resultRef, resetKey, onPng, onPdf, onReforge }: { pedal: Pedal; coverImage: string; editorialCoverImage: string; editorialTopImage: string; resultRef: React.RefObject<HTMLElement | null>; resetKey: number; onPng: () => void; onPdf: () => void; onReforge: () => void }) {
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
  const coverPageRef = useRef<HTMLDivElement>(null);
  const [savingCoverPage, setSavingCoverPage] = useState(false);
  const [coverSaveStatus, setCoverSaveStatus] = useState('');
  const previousPedal = useRef(pedal.id);
  const totalPages = 4;
  const visibleStart = spread ? Math.floor(currentPage / 2) * 2 : currentPage;
  const step = spread ? 2 : 1;
  const goToPage = (page: number) => { const next = Math.max(0, Math.min(totalPages - 1, page)); setCurrentPage(next); setPageListOpen(false); if (typeof history !== 'undefined') history.replaceState(null, '', `${location.pathname}${location.search}#editorial-${next + 1}`); };
  useEffect(() => { const media = matchMedia('(min-width: 1100px)'); const change = (event: MediaQueryListEvent) => { setSpread(event.matches); setCurrentPage(page => event.matches ? Math.floor(page / 2) * 2 : page); }; media.addEventListener('change', change); return () => media.removeEventListener('change', change); }, []);
  useEffect(() => { if (previousPedal.current === pedal.id) return; previousPedal.current = pedal.id; setOverflowPages([]); goToPage(0); }, [pedal.id]);
  useEffect(() => { setOverflowPages([]); goToPage(0); }, [resetKey]);
  useEffect(() => { if (!spread) return; const frame = requestAnimationFrame(() => { const overflowing = Array.from(spreadRef.current?.querySelectorAll<HTMLElement>('.manual-page') || []).flatMap((page, index) => page.scrollWidth > page.clientWidth + 2 || page.scrollHeight > page.clientHeight + 2 ? [visibleStart + index] : []); if (overflowing.length) setOverflowPages(previous => [...new Set([...previous, ...overflowing])]); }); return () => cancelAnimationFrame(frame); }, [visibleStart, spread, pedal.id, coverImage, editorialCoverImage, editorialTopImage]);
  useEffect(() => { const keys = (event: KeyboardEvent) => { if ((event.target as HTMLElement)?.matches('input, textarea, select')) return; if (event.key === 'ArrowLeft') goToPage(visibleStart - step); if (event.key === 'ArrowRight') goToPage(visibleStart + step); }; window.addEventListener('keydown', keys); return () => window.removeEventListener('keydown', keys); }, [visibleStart, step]);
  const saveEditorialCover = async () => {
    const page = coverPageRef.current; if (!page || savingCoverPage) return;
    setSavingCoverPage(true); setCoverSaveStatus('1ページ目の画像を生成しています…');
    try {
      await document.fonts?.ready;
      await Promise.all(Array.from(page.querySelectorAll('img')).map(image => image.complete ? Promise.resolve() : image.decode().catch(() => undefined)));
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(page, { backgroundColor: '#08100b', logging: false, useCORS: true, imageTimeout: 15000, scale: 2, width: 720, height: 980, windowWidth: 720, windowHeight: 980, onclone: clonedDocument => { const shell = clonedDocument.querySelector<HTMLElement>('[data-editorial-cover-capture="true"]'); if (!shell) return; shell.style.width = '720px'; shell.style.height = '980px'; shell.style.minHeight = '980px'; shell.style.maxHeight = '980px'; shell.style.transform = 'none'; const editorialPage = shell.querySelector<HTMLElement>('.manual-page'); if (editorialPage) { editorialPage.style.width = '100%'; editorialPage.style.height = '100%'; editorialPage.style.minHeight = '0'; editorialPage.style.overflow = 'hidden'; } } });
      const file = new File([await canvasBlob(canvas)], `${pedal.serial}-editorial-page-1.png`, { type: 'image/png' });
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) { await navigator.share({ files: [file], title: `${pedal.name.replace(' // LIMITED', '')} / PEDAL FORGE` }); setCoverSaveStatus('スマホの保存・共有メニューへ画像を渡しました'); }
      else { downloadShareFile(file); setCoverSaveStatus('宣材1ページ目をPNGで保存しました'); }
    } catch (error) { if (error instanceof DOMException && error.name === 'AbortError') setCoverSaveStatus('保存をキャンセルしました'); else setCoverSaveStatus('画像を保存できませんでした。もう一度お試しください。'); }
    finally { setSavingCoverPage(false); }
  };
  const image = (className: string, caption: string, alt: string) => <figure className={'editorial-photo ' + className}>{coverImage ? <img src={coverImage} alt={alt} /> : <div className="cover-photo-loading">DEVELOPING PHOTOGRAPH</div>}<figcaption>{caption}</figcaption></figure>;
  const maker = pedal.brand?.manufacturerName || pedal.brandLabel || 'FURNACE AUDIO WORKS';
  const warrantyDate = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const productImage = editorialCoverImage || coverImage;
  const pages = [
    <article className={pageClass(0, 'editorial-magazine-cover')} key="cover" data-shot-preset="EDITORIAL_COVER_THREE_QUARTER">
      <figure>{productImage ? <img src={productImage} alt={pedal.name + ' の斜め上面写真'} /> : <div className="cover-photo-loading">DEVELOPING COVER PHOTOGRAPH…</div>}</figure>
      <div className="magazine-cover-title"><span>{maker}</span><h2>{pedal.name.replace(' // LIMITED', '')}</h2><p>{pedal.copy}。</p></div>
    </article>,
    <article className={pageClass(1, 'editorial-explainer-page editorial-spec-page')} key="guide">
      <header><p className="editorial-number">02 / FORM & CONTROL</p><h3>BUILT TO BE PLAYED</h3><p>{pedal.warning}</p></header>
      <div className="editorial-explainer-grid">
        <section><span>01 / BUILD</span><b>{enclosureLabel}</b><p>{pedal.effectArchitecture || pedal.type}の回路構成を、この筐体サイズへ収めています。</p></section>
        <section><span>02 / CONTROL</span><b>{controlLabel}</b><p>{controlCount ? controlNames.slice(0, 5).join(' / ') + 'を使って音を追い込みます。' : 'フットスイッチだけで直感的に操作できます。'}</p></section>
        <section><span>03 / I/O</span><b>{ioLabel}</b><p>{(pedal.ioChannels || 'mono').toUpperCase()} / {pedal.power}</p></section>
        <section><span>04 / PLAY</span><b>{pedal.type}</b><p>{pedal.usage}に向いたセッティングです。</p></section>
      </div>
    </article>,
    <article className={pageClass(2, 'editorial-warranty-page')} key="warranty">
      <div className="warranty-kicker">PEDAL FORGE / LIMITED WARRANTY</div>
      <div className="warranty-seal" aria-hidden="true"><span>ONE</span><b>YEAR</b><small>LIMITED</small></div>
      <header><p>CERTIFICATE OF</p><h3>WARRANTY</h3></header>
      <div className="warranty-copy"><p>This certificate confirms that the product identified below is covered by the manufacturer’s limited warranty.</p><p>MOONLIT CIRCUIT DEVICES warrants this product against defects in materials and workmanship for a period of one year from the original date of purchase. During the warranty period, any product found to be defective under normal use will be repaired or replaced at the manufacturer’s discretion.</p><p>This warranty is valid only for the original owner and applies to the product bearing the serial number recorded below.</p></div>
      <dl className="warranty-fields"><div><dt>EFFECT PEDAL</dt><dd>{pedal.name}</dd></div><div><dt>SERIAL NUMBER</dt><dd>{pedal.serial}</dd></div><div><dt>DATE OF ISSUE</dt><dd>{warrantyDate}</dd></div><div><dt>MANUFACTURER</dt><dd>{maker}</dd></div></dl>
      <footer><span>AUTHORIZED AND RECORDED</span><b>{maker}</b></footer>
    </article>,
    <article className={pageClass(3, 'editorial-share-page')} key="share">
      <EditorialShareArtwork pedal={pedal} sourceImage={editorialTopImage || coverImage} />
    </article>,
  ];
  const visiblePages = pages.slice(visibleStart, visibleStart + step);
  if (spread && visiblePages.length === 1) visiblePages.push(<article className="manual-page blank-page" key="blank" aria-hidden="true" />);
  const pageLabels = ['雑誌表紙', '仕様と操作', '保証書', '天面ポートレート'];
  return <section className={`result editorial-result manual-viewer promo-${promo.layout} placement-${promo.imagePlacement} density-${promo.informationDensity}`} ref={resultRef} aria-live="polite" style={{ '--accent': pedal.palette[0], '--cover-base': pedal.palette[1], '--brand-accent': pedal.brand?.signatureColor || pedal.palette[0] } as React.CSSProperties}>
    <header className="manual-header"><div><span>04 / SHIPPED — PEDAL FORGE EDITORIAL {issue}</span><b>{pedal.name}</b></div><small>{spread ? 'DESKTOP SPREAD' : 'SINGLE PAGE'} / 4 PAGES</small></header>
    <nav className="manual-chapter-rail" aria-label="宣材ページの章">{pageLabels.map((label, index) => <button type="button" key={label} className={index >= visibleStart && index < visibleStart + step ? 'active' : ''} onClick={() => goToPage(index)}><span>{String(index + 1).padStart(2, '0')}</span><b>{label}</b></button>)}</nav>
    <div ref={spreadRef} className={'manual-spread ' + (spread ? 'is-spread' : 'is-single')} onTouchStart={event => { swipeStart.current = event.touches[0].clientX; }} onTouchEnd={event => { if (swipeStart.current == null) return; const delta = event.changedTouches[0].clientX - swipeStart.current; if (Math.abs(delta) > 54) goToPage(visibleStart + (delta < 0 ? step : -step)); swipeStart.current = null; }}>{visiblePages.map((page, index) => <EditorialPageFrame key={visibleStart + index} page={page} pageNumber={visibleStart + index + 1} hasOverflow={overflowPages.includes(visibleStart + index)} captureRef={visibleStart + index === 0 ? coverPageRef : undefined} />)}</div>
    <nav className="manual-pagination" aria-label="宣材ページ送り"><button type="button" onClick={() => goToPage(visibleStart - step)} disabled={visibleStart === 0} aria-label="前のページ">←</button><button type="button" className="page-index-button" onClick={() => setPageListOpen(open => !open)} aria-expanded={pageListOpen}>{spread ? `${visibleStart + 1}–${Math.min(totalPages, visibleStart + 2)} / ${totalPages}` : `${visibleStart + 1} / ${totalPages}`}</button><button type="button" onClick={() => goToPage(visibleStart + step)} disabled={visibleStart + step >= totalPages} aria-label="次のページ">→</button>{pageListOpen && <div className="manual-page-list">{pageLabels.map((label, index) => <button type="button" key={label} className={index >= visibleStart && index < visibleStart + step ? 'active' : ''} onClick={() => goToPage(index)}><span>{String(index + 1).padStart(2, '0')}</span>{label}</button>)}</div>}</nav>
    <details className="technical-details-drawer"><summary>DETAILS / 製品情報を見る</summary><dl><div><dt>MODEL</dt><dd>{pedal.modelNumber || pedal.serial}</dd></div><div><dt>TYPE</dt><dd>{pedal.type}</dd></div><div><dt>CONTROLS</dt><dd>{controlNames.join(' / ') || 'FIXED CIRCUIT'}</dd></div><div><dt>I/O</dt><dd>{(pedal.ioChannels || 'mono').toUpperCase()} / {ioLabel}</dd></div><div><dt>POWER</dt><dd>{pedal.power}</dd></div><div><dt>SIZE</dt><dd>{pedal.dimensions} / {pedal.weight}</dd></div></dl></details>
    <div className="actions editorial-actions">{visibleStart === 0 && <div className="editorial-page-save"><button type="button" className="share-primary" onClick={saveEditorialCover} disabled={savingCoverPage}>{savingCoverPage ? '画像を生成中…' : '1ページ目を画像で保存'}</button>{coverSaveStatus && <output role="status">{coverSaveStatus}</output>}</div>}<button onClick={onPng}>完成品PNG</button><button onClick={onPdf}>製品情報PDF</button><button className="outline" onClick={onReforge}>同じ思想でもう一台</button></div>
  </section>;
}
const loadShareImage = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = url; });
const canvasBlob = (canvas: HTMLCanvasElement) => new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG_ENCODE_FAILED')), 'image/png'));
const drawCoverContain = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) => { const scale = Math.min(width / image.width, height / image.height); const drawWidth = image.width * scale; const drawHeight = image.height * scale; ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight); };
const drawFittedCanvasText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, maxSize: number, minSize: number, family = 'Arial') => { let size = maxSize; do { ctx.font = `900 ${size}px ${family}`; if (ctx.measureText(text).width <= maxWidth) break; size -= 2; } while (size > minSize); ctx.fillText(text, x, y); };
async function createSocialXShare(pedal: Pedal, sourceImage: string): Promise<Blob> {
  const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 675; const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('CANVAS_UNAVAILABLE');
  ctx.fillStyle = '#f2f0e8'; ctx.fillRect(0, 0, canvas.width, canvas.height); const image = sourceImage ? await loadShareImage(sourceImage).catch(() => null) : null;
  ctx.fillStyle = '#101510'; drawFittedCanvasText(ctx, pedal.name.replace(' // LIMITED', ''), 48, 72, 1104, 62, 34, 'Georgia');
  if (image) drawCoverContain(ctx, image, 40, 86, 1120, 480);
  const effectType = pedal.type.toUpperCase();
  const lines = /FUZZ|DISTORTION|DRIVE|BOOST|CRUSH/.test(effectType)
    ? [`${pedal.copy}。`, '密度を増した倍音が、弾いた輪郭の奥で静かに熱を帯びる。', '一音ごとの余白に、ざらついた光の残像を残していく。']
    : /DELAY|ECHO|REVERB|AMBIENT/.test(effectType)
      ? [`${pedal.copy}。`, 'ほどけた反射音が、弾いた輪郭の向こうへゆっくり広がる。', '消え際の余白に、淡い残像だけを長く浮かべていく。']
      : /CHORUS|FLANGER|PHASER|TREMOLO|VIBRATO|MOD/.test(effectType)
        ? [`${pedal.copy}。`, '揺れる倍音が、音の輪郭を水面のようにやわらかく曲げる。', '一音ごとの隙間に、呼吸するような光と影を残していく。']
        : /PITCH|SYNTH|RING|GLITCH|NOISE/.test(effectType)
          ? [`${pedal.copy}。`, '変形した倍音が、音の輪郭を見知らぬ色へ塗り替える。', '一音ごとの余白に、予測できない小さな亀裂を残していく。']
          : [`${pedal.copy}。`, '磨かれた倍音が、弾いた輪郭の奥に静かな立体感をつくる。', '一音ごとの余白に、長くほどける残像を残していく。'];
  ctx.fillStyle = '#242a23'; ctx.font = '600 18px Georgia, "Yu Mincho", serif'; lines.forEach((line, index) => ctx.fillText(line, 52, 594 + index * 26));
  return canvasBlob(canvas);
}
function EditorialShareArtwork({ pedal, sourceImage }: { pedal: Pedal; sourceImage: string }) {
  const [preview, setPreview] = useState('');
  useEffect(() => { let active = true; let url = ''; void createSocialXShare(pedal, sourceImage).then(blob => { if (!active) return; url = URL.createObjectURL(blob); setPreview(url); }); return () => { active = false; if (url) URL.revokeObjectURL(url); }; }, [pedal, sourceImage]);
  return <figure className="editorial-share-artwork">{preview ? <img src={preview} alt={pedal.name + ' の真正面天面画像と詩的な説明'} /> : <div className="cover-photo-loading">GENERATING TOP PORTRAIT…</div>}</figure>;
}
function downloadShareFile(file: File) { const url = URL.createObjectURL(file); const anchor = document.createElement('a'); anchor.href = url; anchor.download = file.name; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
function SharePanel({ pedal, sourceImage, editorialTopImage, onNotice }: { pedal: Pedal; sourceImage: string; editorialTopImage: string; onNotice: (message: string) => void }) {
  const effectTag = '#' + pedal.type.split(' ')[0].replace(/[^A-Za-z0-9一-龠々]/g, ''); const inputTags = (pedal.inputSources || ['guitar']).map(source => '#' + (source === 'synth-keys' ? 'Synth' : source[0].toUpperCase() + source.slice(1)).replace(/[^A-Za-z0-9]/g, ''));
  const candidates = ['#PEDALFORGE', '#エフェクター錬成', effectTag, ...inputTags].filter((tag, index, all) => tag.length > 1 && all.indexOf(tag) === index);
  const [hashtags, setHashtags] = useState(candidates.slice(0, 3)); const [customTag, setCustomTag] = useState('');
  const baseText = `PEDAL FORGEで「${pedal.name.replace(' // LIMITED', '')}」を錬成しました。\n\n${pedal.type}`; const [postText, setPostText] = useState(baseText); const [preview, setPreview] = useState(''); const [imageBlob, setImageBlob] = useState<Blob | null>(null); const [busy, setBusy] = useState(false);
  const completeText = `${postText.trim()}\n\n${hashtags.join(' ')}`.trim(); const createBlob = () => createSocialXShare(pedal, editorialTopImage || sourceImage);
  useEffect(() => { let active = true; let url = ''; setBusy(true); void createBlob().then(blob => { if (!active) return; url = URL.createObjectURL(blob); setImageBlob(blob); setPreview(url); }).catch(() => { setImageBlob(null); setPreview(''); }).finally(() => { if (active) setBusy(false); }); return () => { active = false; if (url) URL.revokeObjectURL(url); }; }, [pedal, sourceImage, editorialTopImage]);
  const makeFile = async () => new File([imageBlob || await createBlob()], `${pedal.serial}-editorial-page-4.png`, { type: 'image/png' });
  const copyText = async () => { await navigator.clipboard.writeText(completeText); onNotice('投稿文をコピーしました'); };
  const saveImage = async () => { downloadShareFile(await makeFile()); onNotice('共有画像を保存しました'); };
  const copyImage = async () => { try { if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) throw new Error('UNSUPPORTED'); const blob = imageBlob || await createBlob(); await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); onNotice('画像をクリップボードへコピーしました'); } catch { await saveImage(); onNotice('画像コピー非対応のためPNGを保存しました'); } };
  const openXFallback = async () => { const intentUrl = new URL('https://x.com/intent/post'); intentUrl.searchParams.set('text', completeText); window.open(intentUrl.toString(), '_blank', 'noopener,noreferrer'); setBusy(true); try { try { await navigator.clipboard.writeText(completeText); } catch { /* The editable post remains visible for manual copy. */ } try { await copyImage(); } catch { await saveImage(); } onNotice('Xの下書きを開きました。コピーまたは保存した画像を投稿へ添付してください。'); } finally { setBusy(false); } };
  const shareToX = async () => {
    const file = imageBlob ? new File([imageBlob], `${pedal.serial}-editorial-page-4.png`, { type: 'image/png' }) : null;
    if (!file || !navigator.share || !navigator.canShare?.({ files: [file] })) return openXFallback();
    setBusy(true);
    try {
      await navigator.share({ files: [file], text: completeText, title: `${pedal.name.replace(' // LIMITED', '')} / PEDAL FORGE` });
      onNotice('共有画面へ画像と投稿文を渡しました');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') onNotice('共有をキャンセルしました');
      else await openXFallback();
    } finally { setBusy(false); }
  };
  return <section className="share-panel share-final-workbench" aria-labelledby="share-title">
    <header className="share-hero-copy"><span>SHARE / FINAL</span><h2 id="share-title">このエフェクターをXでシェア</h2></header>
    <div className="share-workbench"><div><div className="share-preview">{preview ? <img src={preview} alt="宣材4ページ目と共通のX共有画像プレビュー" /> : <span>GENERATING PAGE 4 IMAGE…</span>}</div><p className="share-page-source">EDITORIAL PAGE 04 / X SHARE MASTER</p></div>
      <div className="share-compose"><label>POST<textarea value={postText} maxLength={240} onChange={event => setPostText(event.target.value)} /></label><output>{completeText.length} / 280</output><div className="hashtag-picker"><span>HASHTAGS</span>{candidates.map(tag => <button type="button" key={tag} className={hashtags.includes(tag) ? 'active' : ''} onClick={() => setHashtags(current => current.includes(tag) ? current.filter(item => item !== tag) : [...current, tag].slice(0, 5))}>{tag}</button>)}<form onSubmit={event => { event.preventDefault(); const tag = '#' + customTag.trim().replace(/^#/, '').replace(/\s+/g, ''); if (tag.length > 1 && !hashtags.includes(tag)) setHashtags(current => [...current, tag].slice(0, 5)); setCustomTag(''); }}><input value={customTag} onChange={event => setCustomTag(event.target.value)} placeholder="CUSTOM TAG" /><button type="submit">＋追加</button></form></div><button type="button" className="share-primary" onClick={shareToX} disabled={busy}>{busy ? 'シェア画像を準備中…' : 'このエフェクターをXでシェア'}</button><div className="share-secondary"><button type="button" onClick={saveImage}>画像を保存</button><button type="button" onClick={copyImage}>画像をコピー</button><button type="button" onClick={copyText}>投稿文をコピー</button></div></div></div>
  </section>;
}
function compressStickerFile(file: File): Promise<{ dataUrl: string; width: number; height: number; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const sourceUrl = URL.createObjectURL(file); const image = new Image();
    image.onerror = () => { URL.revokeObjectURL(sourceUrl); reject(new Error('IMAGE_DECODE_FAILED')); };
    image.onload = () => {
      URL.revokeObjectURL(sourceUrl);
      const limit = 384; const ratio = Math.min(1, limit / Math.max(image.naturalWidth, image.naturalHeight)); const width = Math.max(1, Math.round(image.naturalWidth * ratio)); const height = Math.max(1, Math.round(image.naturalHeight * ratio));
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; const context = canvas.getContext('2d');
      if (!context) return reject(new Error('CANVAS_UNAVAILABLE'));
      context.drawImage(image, 0, 0, width, height);
      canvas.toBlob(blob => {
        if (!blob) return reject(new Error('IMAGE_COMPRESS_FAILED'));
        const reader = new FileReader(); reader.onerror = () => reject(new Error('IMAGE_ENCODE_FAILED')); reader.onload = () => resolve({ dataUrl: String(reader.result || ''), width, height, mimeType: blob.type || 'image/webp' }); reader.readAsDataURL(blob);
      }, 'image/webp', .62);
    };
    image.src = sourceUrl;
  });
}
type PedalBoardLayoutItem = { pedal: Pedal; x: number; width: number; height: number; depth: number };
function pedalBoardEnclosure(pedal: Pedal) { return enclosureDimensions[pedal.name.replace(' // LIMITED', '') === 'BROKEN SIGNAL' ? 'wide' : pedal.enclosure]; }
function createPedalBoardLayout(pedals: Pedal[]) {
  const gap = .72; const sizes = pedals.map(pedalBoardEnclosure); const totalWidth = sizes.reduce((sum, size) => sum + size.width, 0) + Math.max(0, pedals.length - 1) * gap; let cursor = totalWidth / 2;
  const items: PedalBoardLayoutItem[] = pedals.map((pedal, index) => { const size = sizes[index]; const x = cursor - size.width / 2; cursor -= size.width + gap; return { pedal, x, width: size.width, height: size.height, depth: size.depth }; });
  return { items, width: Math.max(6.4, totalWidth + 1.5), depth: Math.max(5.2, ...sizes.map(size => size.height + 1.55)) };
}
function BoardPatchCable({ from, to, index }: { from: [number, number, number]; to: [number, number, number]; index: number }) {
  const curve = useMemo(() => { const routeZ = Math.min(from[2], to[2]) - .72 - index * .05; return new THREE.CatmullRomCurve3([new THREE.Vector3(...from), new THREE.Vector3(from[0] - .18, from[1] + .2, routeZ), new THREE.Vector3(to[0] + .18, to[1] + .2, routeZ), new THREE.Vector3(...to)]); }, [from, index, to]);
  return <group><mesh castShadow><tubeGeometry args={[curve, 36, .055, 8, false]} /><meshStandardMaterial color="#090a09" roughness={.78} /></mesh>
    <group position={from}><mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[.09, .09, .28, 16]} /><meshStandardMaterial color="#b9b9ae" metalness={.9} roughness={.2} /></mesh></group>
    <group position={to}><mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[.09, .09, .28, 16]} /><meshStandardMaterial color="#b9b9ae" metalness={.9} roughness={.2} /></mesh></group>
  </group>;
}
const boardBackgroundColors: Record<PedalBoardBackground, { scene: string; surface: string }> = {
  stage: { scene: '#08080d', surface: '#282126' }, wood: { scene: '#d9c9ad', surface: '#b9824d' }, tile: { scene: '#e1e0db', surface: '#c9c7c0' }, paper: { scene: '#f2f0e8', surface: '#e5e1d6' },
};const boardBackgroundLabels: Record<PedalBoardBackground, string> = { stage: 'LIVE STAGE', wood: 'WOOD', tile: 'TILE', paper: 'PAPER' };

function BoardSurface({ width, depth, background }: { width: number; depth: number; background: PedalBoardBackground }) {
  const plankCount = Math.max(6, Math.ceil(depth / .72)); const grainCount = Math.max(12, Math.ceil(width * 2.2)); const tileColumns = Math.max(8, Math.ceil(width / .82)); const tileRows = Math.max(6, Math.ceil(depth / .82));
  if (background === 'stage') return <group><mesh position={[0, -.24, 0]} receiveShadow><boxGeometry args={[width, .48, depth]} /><meshStandardMaterial color={boardBackgroundColors.stage.surface} roughness={.88} metalness={.08} /></mesh>
    {Array.from({ length: Math.min(7, plankCount - 1) }, (_, index) => { const z = -depth / 2 + depth * (index + 1) / Math.min(8, plankCount); return <mesh key={'stage-seam-' + index} position={[0, .012, z]}><boxGeometry args={[width * .99, .014, .022]} /><meshBasicMaterial color="#0b090b" /></mesh>; })}
    <mesh position={[0, -.02, depth / 2 + .035]}><boxGeometry args={[width, .12, .07]} /><meshStandardMaterial color="#070709" roughness={.8} metalness={.28} /></mesh>
  </group>;
  if (background === 'tile') return <group><mesh position={[0, -.2, 0]} receiveShadow><boxGeometry args={[width, .4, depth]} /><meshPhysicalMaterial color={boardBackgroundColors.tile.surface} roughness={.64} metalness={.03} clearcoat={.08} /></mesh>
    {Array.from({ length: tileColumns - 1 }, (_, index) => { const x = -width / 2 + width * (index + 1) / tileColumns; return <mesh key={'tile-x-' + index} position={[x, .012, 0]} receiveShadow><boxGeometry args={[.018, .02, depth * .99]} /><meshStandardMaterial color="#8f918d" roughness={.92} /></mesh>; })}
    {Array.from({ length: tileRows - 1 }, (_, index) => { const z = -depth / 2 + depth * (index + 1) / tileRows; return <mesh key={'tile-z-' + index} position={[0, .012, z]} receiveShadow><boxGeometry args={[width * .99, .02, .018]} /><meshStandardMaterial color="#8f918d" roughness={.92} /></mesh>; })}</group>;
  if (background === 'paper') return <mesh position={[0, -.2, 0]} receiveShadow><boxGeometry args={[width, .4, depth]} /><meshPhysicalMaterial color={boardBackgroundColors.paper.surface} roughness={.88} metalness={0} clearcoat={.03} /></mesh>;
  return <group><mesh position={[0, -.2, 0]} receiveShadow><boxGeometry args={[width, .4, depth]} /><meshPhysicalMaterial color={boardBackgroundColors.wood.surface} roughness={.72} metalness={.02} clearcoat={.12} clearcoatRoughness={.68} /></mesh>
    {Array.from({ length: plankCount - 1 }, (_, index) => { const z = -depth / 2 + depth * (index + 1) / plankCount; return <mesh key={'seam-' + index} position={[0, .012, z]} receiveShadow><boxGeometry args={[width * .99, .022, .026]} /><meshStandardMaterial color="#67432b" roughness={.92} /></mesh>; })}
    {Array.from({ length: grainCount }, (_, index) => { const z = -depth * .46 + depth * ((index * 37) % grainCount) / grainCount * .92; const x = -width * .42 + width * ((index * 19) % grainCount) / grainCount * .84; const grainWidth = width * (.12 + (index % 5) * .025); return <mesh key={'grain-' + index} position={[x, .024, z]} rotation={[0, (index % 3 - 1) * .025, 0]} receiveShadow><boxGeometry args={[grainWidth, .012, .012]} /><meshStandardMaterial color={index % 2 ? '#8f5d38' : '#d29a62'} roughness={.96} transparent opacity={.62} /></mesh>; })}</group>;
}
function FixedBoardCamera({ width, depth }: { width: number; depth: number }) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const aspect = Math.max(.1, size.width / Math.max(1, size.height)); const halfFov = THREE.MathUtils.degToRad(camera.fov) / 2;
    const distance = Math.max(depth / 2 / Math.tan(halfFov), width / 2 / (Math.tan(halfFov) * aspect)) * 1.2;
    const position = new THREE.Vector3(0, 1.35, 1).normalize().multiplyScalar(distance);
    camera.up.set(0, 0, -1); camera.position.copy(position); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); invalidate();
  }, [camera, depth, invalidate, size.height, size.width, width]);
  return null;
}
function BoardRenderSettler({ token }: { token: string }) {
  const frames = useRef(0); const { invalidate } = useThree();
  useEffect(() => { frames.current = 0; invalidate(); }, [invalidate, token]);
  useFrame(() => { if (frames.current++ < 16) invalidate(); });
  return null;
}
function PedalBoardScene({ pedals, finishes, background }: { pedals: Pedal[]; finishes: Record<string, PedalFinish>; background: PedalBoardBackground }) {
  const layout = useMemo(() => createPedalBoardLayout(pedals), [pedals]); const boardTop = 0; const colors = boardBackgroundColors[background];
  const settleToken = background + '|' + pedals.map(pedal => pedal.id).join('|') + '|' + pedals.map(pedal => (finishes[pedal.id]?.stickers || []).map(sticker => sticker.id + ':' + sticker.size + ':' + sticker.rotation).join(',')).join('|');
  return <><color attach="background" args={[colors.scene]} /><ambientLight intensity={background === 'stage' ? .4 : .72} /><hemisphereLight color={background === 'stage' ? '#ffd9bd' : '#fffaf0'} groundColor={background === 'stage' ? '#11101a' : background === 'wood' ? '#9b7654' : '#9b9b96'} intensity={background === 'stage' ? 1.05 : 1.55} /><directionalLight position={[-5, 11, 7]} intensity={background === 'stage' ? 3.4 : 4.2} color="#fff8e9" castShadow /><directionalLight position={[7, 5, -5]} intensity={background === 'stage' ? 1.15 : 1.5} color={background === 'stage' ? '#9dc8ff' : '#e8f0ff'} />
    {background === 'stage' && <><pointLight position={[-layout.width * .36, 3.2, -layout.depth * .4]} intensity={3.2} distance={8} color="#ff3e99" /><pointLight position={[layout.width * .36, 3, -layout.depth * .38]} intensity={3} distance={8} color="#3bd8ff" /><group position={[0, 1.25, -layout.depth / 2 - .9]}><mesh><boxGeometry args={[layout.width * 1.22, 2.5, .16]} /><meshStandardMaterial color="#111016" roughness={.9} /></mesh><mesh position={[0, 1.12, .1]}><boxGeometry args={[layout.width * 1.28, .11, .1]} /><meshStandardMaterial color="#292832" metalness={.5} roughness={.42} /></mesh></group></>}
    <FixedBoardCamera width={layout.width} depth={layout.depth} /><BoardRenderSettler token={settleToken} />
    <BoardSurface width={layout.width} depth={layout.depth} background={background} />
    {layout.items.map(item => { const finish = finishes[item.pedal.id] || emptyFinish(); return <group key={item.pedal.id} position={[item.x, boardTop + item.depth / 2 + .035, 0]}><PedalModel pedal={item.pedal} runtimeMode="on" userGraphics={finish.stickers} marks={finish.signatures} shotPreset="editorial-cover-top" /></group>; })}
    {layout.items.slice(0, -1).map((item, index) => { const next = layout.items[index + 1]; const y = boardTop + Math.max(item.depth, next.depth) * .5; return <BoardPatchCable key={item.pedal.id + '-' + next.pedal.id} index={index} from={[item.x - item.width / 2 - .05, y, -.08]} to={[next.x + next.width / 2 + .05, y, -.08]} />; })}
  </>;
}
function wideBoardBlob(source: HTMLCanvasElement, background: PedalBoardBackground, boardName: string, pedalCount: number) {
  const canvas = document.createElement('canvas'); canvas.width = 1600; canvas.height = 900; const context = canvas.getContext('2d'); if (!context) return Promise.reject(new Error('CANVAS_UNAVAILABLE')); const colors = boardBackgroundColors[background]; context.fillStyle = colors.scene; context.fillRect(0, 0, canvas.width, canvas.height);
  const coverScale = Math.max(canvas.width / source.width, canvas.height / source.height); const zoomScale = coverScale * 1.42; const width = source.width * zoomScale; const height = source.height * zoomScale; context.drawImage(source, (canvas.width - width) / 2, (canvas.height - height) / 2 - 18, width, height);
  context.fillStyle = 'rgba(242, 240, 232, .84)'; context.fillRect(54, 54, 420, 86); context.fillStyle = '#111611'; context.font = '900 42px Arial'; context.fillText('PEDAL FORGE', 78, 111); context.fillStyle = '#b7ff19'; context.fillRect(78, 124, 112, 7);
  context.fillStyle = 'rgba(242, 240, 232, .88)'; context.fillRect(54, 616, 560, 230); context.fillStyle = '#111611'; drawFittedCanvasText(context, boardName.trim() || 'UNTITLED BOARD', 78, 684, 500, 54, 30, 'Arial'); context.font = '800 20px "Courier New"'; context.fillStyle = '#3e473d'; context.fillText(`PEDALS / ${String(pedalCount).padStart(2, '0')}`, 80, 744); context.fillText('SIGNAL / RIGHT → LEFT', 80, 784); context.fillText(`BACKGROUND / ${boardBackgroundLabels[background]}`, 80, 824); return canvasBlob(canvas);
}
function BoardCaptureBridge({ captureRef, background, boardName, pedalCount }: { captureRef: React.MutableRefObject<(() => Promise<Blob>) | null>; background: PedalBoardBackground; boardName: string; pedalCount: number }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => { captureRef.current = () => { gl.render(scene, camera); return wideBoardBlob(gl.domElement, background, boardName, pedalCount); }; return () => { captureRef.current = null; }; }, [background, boardName, camera, captureRef, gl, pedalCount, scene]);
  return null;
}
function PedalBoardCanvas({ pedals, finishes, background, boardName, captureRef }: { pedals: Pedal[]; finishes: Record<string, PedalFinish>; background: PedalBoardBackground; boardName: string; captureRef: React.MutableRefObject<(() => Promise<Blob>) | null> }) {
  return <div className={'pedalboard-preview background-' + background}><Canvas frameloop="demand" shadows dpr={[1, 1.2]} gl={{ preserveDrawingBuffer: true, antialias: true }} camera={{ position: [0, 10, 7], fov: 34, near: .01, far: 120 }}><RenderSettings viewMode="stage" /><BoardCaptureBridge captureRef={captureRef} background={background} boardName={boardName} pedalCount={pedals.length} /><PedalBoardScene pedals={pedals} finishes={finishes} background={background} /></Canvas><span className="board-signal-flow">FIXED LIVE STAGE VIEW · INPUT / 01 — RIGHT → LEFT — OUTPUT</span></div>;
}async function compressArchiveThumbnail(source: string) {
  const image = await loadShareImage(source); const width = 360; const height = Math.max(180, Math.round(width * image.height / image.width)); const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; const context = canvas.getContext('2d'); if (!context) throw new Error('CANVAS_UNAVAILABLE'); context.fillStyle = '#f2f0e8'; context.fillRect(0, 0, width, height); drawCoverContain(context, image, 0, 0, width, height); return canvas.toDataURL('image/webp', .68);
}
type ArchiveDrawerProps = {
  collection: Pedal[]; boards: PedalBoard[]; finishes: Record<string, PedalFinish>; archiveImages: Record<string, string>; selectedBoardId: string; onSelectedBoard: (id: string) => void; onClose: () => void; onOpenPedal: (pedal: Pedal) => void; onDeletePedal: (pedal: Pedal) => void; onCreateBoard: () => void; onRenameBoard: (id: string, name: string) => void; onDeleteBoard: (board: PedalBoard) => void; onAddPedal: (boardId: string, pedalId: string) => void; onRemovePedal: (boardId: string, pedalId: string) => void; onMovePedal: (boardId: string, pedalId: string, direction: -1 | 1) => void; onBackground: (boardId: string, background: PedalBoardBackground) => void; onNotice: (message: string) => void;
};
function ArchiveDrawer({ collection, boards, finishes, archiveImages, selectedBoardId, onSelectedBoard, onClose, onOpenPedal, onDeletePedal, onCreateBoard, onRenameBoard, onDeleteBoard, onAddPedal, onRemovePedal, onMovePedal, onBackground, onNotice }: ArchiveDrawerProps) {
  const [tab, setTab] = useState<'pedals' | 'boards'>('pedals'); const [sharing, setSharing] = useState(false); const [shareTexts, setShareTexts] = useState<Record<string, string>>({}); const boardCaptureRef = useRef<(() => Promise<Blob>) | null>(null); const selected = boards.find(board => board.id === selectedBoardId) || boards[0] || null; const boardPedals = selected ? selected.pedalIds.map(id => collection.find(item => item.id === id)).filter((item): item is Pedal => Boolean(item)) : []; const defaultHashtags = '#PEDALFORGE #エフェクターボード #エフェクター'; const defaultBody = selected ? 'PEDAL FORGE / ' + (selected.name.trim() || 'MY EFFECTS BOARD') + (boardPedals.length ? '\n' + boardPedals.map(item => item.name.replace(' // LIMITED', '')).join(' → ') : '') : ''; const defaultShareText = selected ? defaultBody.slice(0, 278 - defaultHashtags.length).trimEnd() + '\n\n' + defaultHashtags : ''; const shareText = selected ? shareTexts[selected.id] ?? defaultShareText : '';
  const shareBoard = async () => {
    if (!selected || !boardPedals.length || !boardCaptureRef.current) return; setSharing(true);
    const capturePromise = boardCaptureRef.current(); const fileName = (selected.name.trim() || 'pedal-board').replace(/[\/:*?"<>|]+/g, '-') + '.png'; const mobileShare = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    try {
      if (!mobileShare) {
        const intentUrl = new URL('https://x.com/intent/post'); intentUrl.searchParams.set('text', shareText.trim()); window.open(intentUrl.toString(), '_blank', 'noopener,noreferrer');
        try { if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) throw new Error('UNSUPPORTED'); await navigator.clipboard.write([new ClipboardItem({ 'image/png': capturePromise })]); onNotice('Xの下書きを開き、ボード画像をコピーしました。投稿欄でCtrl+Vを押してください。'); }
        catch { const file = new File([await capturePromise], fileName, { type: 'image/png' }); downloadShareFile(file); onNotice('Xの下書きを開きました。保存したボード画像を投稿へ添付してください。'); }
        return;
      }
      const file = new File([await capturePromise], fileName, { type: 'image/png' });
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) { await navigator.share({ files: [file], title: selected.name || 'PEDAL FORGE BOARD', text: shareText.trim() }); onNotice('3Dボード全体の画像を共有画面へ渡しました'); }
      else { downloadShareFile(file); onNotice('3Dボード全体の画像を保存しました'); }
    }
    catch (error) { if (error instanceof DOMException && error.name === 'AbortError') onNotice('共有をキャンセルしました'); else onNotice('ボード画像を共有できませんでした'); } finally { setSharing(false); }
  };
  return <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}><aside className="drawer archive-drawer" role="dialog" aria-modal="true" aria-label="錬成済みペダル保管庫" onMouseDown={event => event.stopPropagation()}><button className="close" onClick={onClose} aria-label="保管庫を閉じる">×</button><p className="eyebrow">FORGED ARCHIVE</p><h2>ARCHIVE</h2>
    <nav className="archive-tabs" aria-label="アーカイブ表示"><button type="button" className={tab === 'pedals' ? 'active' : ''} onClick={() => setTab('pedals')}>保存済みペダル</button><button type="button" className={tab === 'boards' ? 'active' : ''} onClick={() => setTab('boards')}>ボードを組む</button></nav>
    {tab === 'pedals' ? <section className="archive-section"><header><b>FORGED PEDALS</b><span>{collection.length} UNITS</span></header>{collection.length ? <div className="archive-pedal-list">{collection.map(item => <article className="archive-pedal-card" key={item.id}><button type="button" className="archive-open" onClick={() => onOpenPedal(item)}>{archiveImages[item.id] ? <img className="archive-pedal-thumb" src={archiveImages[item.id]} alt={item.name + ' の天面画像'} /> : <span className="archive-pedal-thumb is-loading">TOP VIEW<br />GENERATING…</span>}<span><b>{item.name}</b><small>{item.brand?.manufacturerName || item.brandLabel || 'FURNACE AUDIO WORKS'} / {item.modelNumber || item.serial}</small></span></button><button type="button" className="archive-delete" onClick={() => onDeletePedal(item)}>削除</button></article>)}</div> : <p className="empty">保存済みの個体はありません。完成画面の最後にある「アーカイブへ保存」から追加できます。</p>}</section> :
    <section className="archive-section board-builder"><header><b>EFFECTS BOARDS / 3D</b><span>{boards.length} / 3 SETS</span></header><div className="board-tabs">{boards.map(board => <button type="button" key={board.id} className={selected?.id === board.id ? 'active' : ''} onClick={() => onSelectedBoard(board.id)}>{board.name || 'UNTITLED'}</button>)}<button type="button" onClick={onCreateBoard} disabled={boards.length >= 3}>＋ 新規セット</button></div>
      {selected ? <><div className="board-editor-head"><label>SET NAME<input value={selected.name} maxLength={32} onChange={event => onRenameBoard(selected.id, event.target.value)} /></label><button type="button" className="archive-delete" onClick={() => onDeleteBoard(selected)}>セットを削除</button></div><div className="board-background-picker"><span>BOARD BACKGROUND</span><nav>{(['stage', 'wood', 'tile', 'paper'] as PedalBoardBackground[]).map(background => <button type="button" key={background} className={selected.background === background ? 'active' : ''} onClick={() => onBackground(selected.id, background)}>{boardBackgroundLabels[background]}</button>)}</nav></div>{boardPedals.length ? <><PedalBoardCanvas pedals={boardPedals} finishes={finishes} background={selected.background} boardName={selected.name} captureRef={boardCaptureRef} /><div className="board-order-strip">{boardPedals.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, '0')} / {index === 0 ? 'INPUT / RIGHT' : index === boardPedals.length - 1 ? 'OUTPUT / LEFT' : 'SIGNAL'}</span><b>{item.name}</b><nav><button type="button" onClick={() => onMovePedal(selected.id, item.id, 1)} disabled={index === boardPedals.length - 1} aria-label="左へ移動">←</button><button type="button" onClick={() => onMovePedal(selected.id, item.id, -1)} disabled={index === 0} aria-label="右へ移動">→</button><button type="button" onClick={() => onRemovePedal(selected.id, item.id)}>外す</button></nav></article>)}</div></> : <div className="pedalboard-preview is-empty"><p>下の保存済みペダルから追加してください。</p></div>}<div className="board-actions"><span>{boardPedals.length} / 5 PEDALS · SIGNAL RIGHT → LEFT · SHARE 1600 × 900</span></div><div className="board-share-compose"><label><span>POST TEXT</span><textarea value={shareText} maxLength={280} rows={4} onChange={event => selected && setShareTexts(current => ({ ...current, [selected.id]: event.target.value }))} placeholder="投稿文を入力" /></label><footer><span>{shareText.length} / 280</span><button type="button" className="share-primary" onClick={shareBoard} disabled={!boardPedals.length || sharing}>{sharing ? '16:9画像を生成中…' : 'この3Dボードをシェア'}</button></footer></div><div className="board-pedal-picker"><b>保存済みペダルを追加</b>{collection.map(item => { const added = selected.pedalIds.includes(item.id); return <button type="button" key={item.id} disabled={added || selected.pedalIds.length >= 5} onClick={() => onAddPedal(selected.id, item.id)}>{archiveImages[item.id] ? <img className="board-picker-thumb" src={archiveImages[item.id]} alt={item.name + ' の天面画像'} /> : <span className="board-picker-thumb is-loading">TOP VIEW</span>}<span className="board-picker-name">{item.name}</span><small>{added ? '追加済み' : selected.pedalIds.length >= 5 ? '5台まで' : '＋ 追加'}</small></button>; })}</div></> : <p className="empty">「新規セット」からエフェクターボードを作成してください。</p>}</section>}
  </aside></div>;
}
const storedBoards = (): PedalBoard[] => { try { const value = JSON.parse(localStorage.getItem('pedal-gacha-boards-v1') || '[]'); if (!Array.isArray(value)) return []; return value.slice(0, 3).map((board, index) => ({ id: typeof board.id === 'string' ? board.id : 'board-' + index, name: typeof board.name === 'string' ? board.name.slice(0, 32) : 'BOARD ' + (index + 1), pedalIds: Array.isArray(board.pedalIds) ? board.pedalIds.filter((id: unknown): id is string => typeof id === 'string').slice(0, 5) : [], background: board.background === 'stage' || board.background === 'tile' || board.background === 'paper' ? board.background : 'wood' })); } catch { return []; } };
const storedArchiveImages = (): Record<string, string> => { try { const value = JSON.parse(localStorage.getItem('pedal-gacha-archive-images-v1') || '{}'); if (!value || typeof value !== 'object' || Array.isArray(value)) return {}; return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string')); } catch { return {}; } };
const stored = (): Pedal[] => { try { return JSON.parse(localStorage.getItem('pedal-gacha-v2') || '[]'); } catch { return []; } };
const normalizeSurface = (surface: unknown): MarkSurface => surface === 'left-side' || surface === 'right-side' || surface === 'back' ? surface : 'top';
const normalizeMark = (value: Partial<PedalMark>, surface = normalizeSurface(value.surface)): PedalMark => ({ ...createDefaultMark(surface), ...value, id: value.id || `signature-${surface}`, surface, font: value.font === ('maru-jp' as SignatureFontCategory) ? 'maru-gothic-jp' : value.font || 'gothic-jp' });
const normalizeGraphic = (value: Partial<UserGraphic>): UserGraphic => {
  const textureUrl = value.textureUrl || value.sourceUrl || '';
  return { id: value.id || 'sticker-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7), fileName: value.fileName || 'sticker', mimeType: value.mimeType || 'image/png', width: value.width || 512, height: value.height || 512, sourceUrl: '', textureUrl, usageMode: value.usageMode || 'preserve', placementMode: value.placementMode || 'sticker', transformStyle: value.transformStyle || 'sticker', transformStrength: value.transformStrength || 'medium', colorBehavior: value.colorBehavior || 'preserve', variant: value.variant || 0, surface: normalizeSurface(value.surface), u: value.u ?? .5, v: value.v ?? .5, size: value.size ?? .34, rotation: value.rotation || 0, opacity: value.opacity ?? 1, visible: value.visible ?? true, clipping: value.clipping || 'surface-mask' };
};
const emptyFinish = (): PedalFinish => ({ signatures: [], stickers: [] });
const storedFinishes = (): Record<string, PedalFinish> => { try { const current = JSON.parse(localStorage.getItem('pedal-gacha-finish-v3') || '{}') as Record<string, Partial<PedalFinish>>; if (Object.keys(current).length) return Object.fromEntries(Object.entries(current).map(([id, finish]) => [id, { signatures: (finish.signatures || []).map(mark => normalizeMark(mark)), stickers: (finish.stickers || []).map(graphic => normalizeGraphic(graphic)) }])); const legacy = JSON.parse(localStorage.getItem('pedal-gacha-marks-v1') || '{}') as Record<string, Partial<PedalMark>>; return Object.fromEntries(Object.entries(legacy).map(([id, mark]) => [id, { signatures: [normalizeMark(mark)], stickers: [] }])); } catch { return {}; } };
const storedBrand = (): BrandProfile => { try { const value = localStorage.getItem('pedal-gacha-brand-v1'); return value ? JSON.parse(value) : createBrandProfile('first-forge-maker'); } catch { return createBrandProfile('first-forge-maker'); } };
const similarityScore = (a: Pedal, b: Pedal) => [a.enclosure === b.enclosure, a.knobs.length === b.knobs.length, a.controlVariant === b.controlVariant, a.knobStyle === b.knobStyle, a.designArchetype === b.designArchetype, a.namingPattern === b.namingPattern, a.promoDirection?.layout === b.promoDirection?.layout, a.motifType === b.motifType, a.motifCategory === b.motifCategory, a.palette?.[1] === b.palette?.[1]].filter(Boolean).length;
export default function App() {
  const [brandProfile, setBrandProfile] = useState<BrandProfile>(storedBrand); const [inputSources, setInputSources] = useState<InputSource[]>([]); const [effectType, setEffectType] = useState<EffectTypeChoice>('random'); const [sound, setSound] = useState<ToneChoice>('random'); const [colorChoice, setColor] = useState<FinishChoice>('random'); const mood: MoodChoice = 'random'; const [phase, setPhase] = useState<GachaState>('idle'); const [workflow, setWorkflow] = useState<WorkflowPhase>('select'); const [forgeStep, setForgeStep] = useState('思想を選択してください'); const [pedal, setPedal] = useState<Pedal | null>(null); const [collection, setCollection] = useState<Pedal[]>(stored); const [boards, setBoards] = useState<PedalBoard[]>(storedBoards); const [archiveImages, setArchiveImages] = useState<Record<string, string>>(storedArchiveImages); const [selectedBoardId, setSelectedBoardId] = useState(''); const [drawer, setDrawer] = useState(false); const [notice, setNotice] = useState(''); const [reduce, setReduce] = useState(false); const [viewReset, setViewReset] = useState(0); const [manualReset, setManualReset] = useState(0); const [viewMode, setViewMode] = useState<ViewMode>('stage'); const [runtimeMode, setRuntimeMode] = useState<RuntimeMode>('off'); const [coverImage, setCoverImage] = useState(''); const [editorialCoverImage, setEditorialCoverImage] = useState(''); const [editorialTopImage, setEditorialTopImage] = useState(''); const [finishes, setFinishes] = useState<Record<string, PedalFinish>>(storedFinishes); const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null); const [graphicError, setGraphicError] = useState(''); const [finishTool, setFinishTool] = useState<'signature' | 'sticker'>('signature'); const [markEditorOpen, setMarkEditorOpen] = useState(false); const [inspectSurface, setInspectSurface] = useState<MarkSurface>('top'); const [historyVersion, setHistoryVersion] = useState(0); const historyRef = useRef<Record<string, { past: PedalFinish[]; future: PedalFinish[] }>>({}); const archiveThumbVersionRef = useRef<Record<string, number>>({}); const canvasRef = useRef<HTMLCanvasElement | null>(null); const resultRef = useRef<HTMLElement>(null); const stageRef = useRef<HTMLElement>(null);
  const soundEnabled = true; const [autoRotate, setAutoRotate] = useState(false); const [bgmPlaying, setBgmPlaying] = useState(false);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const forgeAudioRef = useRef<{ context: AudioContext; rumble?: { gain: GainNode; sources: AudioScheduledSourceNode[] } } | null>(null);
  const getForgeAudio = () => { if (!soundEnabled || typeof window === 'undefined') return null; let current = forgeAudioRef.current; if (!current) { current = { context: new AudioContext() }; forgeAudioRef.current = current; } if (current.context.state === 'suspended') void current.context.resume(); return current; };
  const stopForgeRumble = (release = .08) => { const current = forgeAudioRef.current; const rumble = current?.rumble; if (!current || !rumble) return; const now = current.context.currentTime; rumble.gain.gain.cancelScheduledValues(now); rumble.gain.gain.setTargetAtTime(.0001, now, Math.max(.015, release)); rumble.sources.forEach(source => { try { source.stop(now + release * 4 + .06); } catch { /* already stopped */ } }); current.rumble = undefined; };
  const startForgeRumble = () => { const audio = getForgeAudio(); if (!audio) return; stopForgeRumble(0); const { context } = audio; const now = context.currentTime; const gain = context.createGain(); const filter = context.createBiquadFilter(); const low = context.createOscillator(); const body = context.createOscillator(); const tremolo = context.createOscillator(); const tremoloDepth = context.createGain(); low.type = 'sawtooth'; low.frequency.setValueAtTime(43, now); low.frequency.linearRampToValueAtTime(58, now + 2.6); body.type = 'sine'; body.frequency.setValueAtTime(67, now); body.detune.value = -9; tremolo.frequency.value = 8.4; tremoloDepth.gain.value = .022; filter.type = 'lowpass'; filter.frequency.value = 210; filter.Q.value = 5; gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.085, now + .34); tremolo.connect(tremoloDepth).connect(gain.gain); low.connect(filter); body.connect(filter); filter.connect(gain).connect(context.destination); low.start(now); body.start(now); tremolo.start(now); audio.rumble = { gain, sources: [low, body, tremolo] }; };
  const playForgeFlash = () => { const audio = getForgeAudio(); if (!audio) return; const { context } = audio; const now = context.currentTime; const shimmer = context.createOscillator(); const shimmerGain = context.createGain(); shimmer.type = 'sine'; shimmer.frequency.setValueAtTime(720, now); shimmer.frequency.exponentialRampToValueAtTime(2800, now + .22); shimmerGain.gain.setValueAtTime(.0001, now); shimmerGain.gain.exponentialRampToValueAtTime(.12, now + .018); shimmerGain.gain.exponentialRampToValueAtTime(.0001, now + .55); shimmer.connect(shimmerGain).connect(context.destination); shimmer.start(now); shimmer.stop(now + .58); const buffer = context.createBuffer(1, Math.floor(context.sampleRate * .36), context.sampleRate); const data = buffer.getChannelData(0); for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2); const noise = context.createBufferSource(); const band = context.createBiquadFilter(); const noiseGain = context.createGain(); noise.buffer = buffer; band.type = 'bandpass'; band.frequency.value = 1750; band.Q.value = 1.8; noiseGain.gain.setValueAtTime(.08, now); noiseGain.gain.exponentialRampToValueAtTime(.0001, now + .34); noise.connect(band).connect(noiseGain).connect(context.destination); noise.start(now); };
  const playForgeComplete = () => { const audio = getForgeAudio(); if (!audio) return; const { context } = audio; const now = context.currentTime; const tone = context.createOscillator(); const gain = context.createGain(); tone.type = 'triangle'; tone.frequency.setValueAtTime(420, now); tone.frequency.exponentialRampToValueAtTime(180, now + .24); gain.gain.setValueAtTime(.07, now); gain.gain.exponentialRampToValueAtTime(.0001, now + .32); tone.connect(gain).connect(context.destination); tone.start(now); tone.stop(now + .34); };
  useEffect(() => () => { stopForgeRumble(.02); const context = forgeAudioRef.current?.context; if (context && context.state !== 'closed') void context.close(); }, []);
  useEffect(() => {
    const removeUnlock = () => { window.removeEventListener('pointerdown', unlockBgm); window.removeEventListener('keydown', unlockBgm); };
    const unlockBgm = (event: Event) => { if ((event.target as Element | null)?.closest?.('[data-bgm-toggle]')) return; const audio = bgmAudioRef.current; if (!audio) return; audio.volume = .18; void audio.play().then(removeUnlock).catch(() => undefined); };
    window.addEventListener('pointerdown', unlockBgm); window.addEventListener('keydown', unlockBgm);
    return () => { removeUnlock(); bgmAudioRef.current?.pause(); };
  }, []);
  const toggleBgm = () => { const audio = bgmAudioRef.current; if (!audio) return; if (audio.paused) { audio.volume = .18; void audio.play().catch(() => setNotice('BGMを再生できませんでした。ブラウザの音声設定をご確認ください。')); } else audio.pause(); };
  const activeFinish = pedal ? finishes[pedal.id] || emptyFinish() : emptyFinish(); const missingArchivePedal = drawer ? collection.find(item => !archiveImages[item.id]) : undefined; const missingArchiveFinish = missingArchivePedal ? finishes[missingArchivePedal.id] || emptyFinish() : emptyFinish(); const activeMark = activeFinish.signatures.find(mark => mark.surface === inspectSurface) || createDefaultMark(inspectSurface); const activeGraphic = activeFinish.stickers.find(graphic => graphic.id === selectedStickerId) || activeFinish.stickers.find(graphic => graphic.surface === inspectSurface) || null; const currentHistory = pedal ? historyRef.current[pedal.id] : undefined; void historyVersion;
  useEffect(() => { const q = matchMedia('(prefers-reduced-motion: reduce)'); setReduce(q.matches); const fn = () => setReduce(q.matches); q.addEventListener('change', fn); return () => q.removeEventListener('change', fn); }, []);
  useEffect(() => { localStorage.setItem('pedal-gacha-v2', JSON.stringify(collection)); }, [collection]);
  useEffect(() => { localStorage.setItem('pedal-gacha-boards-v1', JSON.stringify(boards)); if (!boards.length) setSelectedBoardId(''); else if (!boards.some(board => board.id === selectedBoardId)) setSelectedBoardId(boards[0].id); }, [boards, selectedBoardId]);
  useEffect(() => { try { localStorage.setItem('pedal-gacha-archive-images-v1', JSON.stringify(archiveImages)); } catch { setNotice('ARCHIVEの天面画像を保存できませんでした'); } }, [archiveImages]);
  useEffect(() => { const timer = window.setTimeout(() => { try { localStorage.setItem('pedal-gacha-finish-v3', JSON.stringify(finishes)); } catch { setNotice('仕上げデータを保存できません。画像を減らすか、別の画像を選択してください。'); } }, 250); return () => window.clearTimeout(timer); }, [finishes]);
  useEffect(() => { localStorage.setItem('pedal-gacha-brand-v1', JSON.stringify(brandProfile)); }, [brandProfile]);
  const commitFinish = (updater: (finish: PedalFinish) => PedalFinish) => { if (!pedal) return; setFinishes(current => { const previous = current[pedal.id] || emptyFinish(); const next = updater(previous); if (previous === next || (previous.signatures === next.signatures && previous.stickers === next.stickers)) return current; const history = historyRef.current[pedal.id] || { past: [], future: [] }; historyRef.current[pedal.id] = { past: [...history.past, previous].slice(-50), future: [] }; setHistoryVersion(value => value + 1); return { ...current, [pedal.id]: next }; }); setEditorialCoverImage(''); setEditorialTopImage(''); };
  const selectGraphic = (file: File, replace: boolean) => {
    setGraphicError(''); if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return setGraphicError('PNG / JPG / WEBPを選択してください。'); if (file.size > 15 * 1024 * 1024) return setGraphicError('画像は15MB以下にしてください。');
    if (!replace && activeFinish.stickers.length >= 5) return setGraphicError('ステッカーは最大5枚です。');
    void compressStickerFile(file).then(compressed => { const id = replace && activeGraphic ? activeGraphic.id : 'sticker-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7); const graphic = normalizeGraphic({ ...(replace && activeGraphic ? activeGraphic : {}), id, fileName: file.name, mimeType: compressed.mimeType, width: compressed.width, height: compressed.height, sourceUrl: '', textureUrl: compressed.dataUrl, surface: replace && activeGraphic ? activeGraphic.surface : inspectSurface, clipping: 'surface-mask' }); commitFinish(finish => ({ ...finish, stickers: [...finish.stickers.filter(item => item.id !== id), graphic] })); setSelectedStickerId(id); setNotice('画像を384px以下へ軽量化してステッカーに使用しました'); if (compressed.width < 256 || compressed.height < 256) setGraphicError('小さい画像のため、大きくすると粗く見える可能性があります。'); }).catch(() => setGraphicError('画像を圧縮できませんでした。別の画像を選択してください。'));
  };
  const changeGraphic = (patch: Partial<UserGraphic>) => { if (!activeGraphic) return; const next = normalizeGraphic({ ...activeGraphic, ...patch }); setGraphicError(''); commitFinish(finish => ({ ...finish, stickers: finish.stickers.map(item => item.id === next.id ? next : item) })); setSelectedStickerId(next.id); setInspectSurface(next.surface); };
  const changeMark = (nextValue: PedalMark) => { const next = normalizeMark(nextValue, nextValue.surface); commitFinish(finish => ({ ...finish, signatures: [...finish.signatures.filter(item => item.id !== next.id && item.surface !== next.surface), next] })); setInspectSurface(next.surface); };
  const removeMark = () => commitFinish(finish => ({ ...finish, signatures: finish.signatures.filter(item => item.id !== activeMark.id) }));
  const removeGraphic = () => { if (!activeGraphic) return; commitFinish(finish => ({ ...finish, stickers: finish.stickers.filter(item => item.id !== activeGraphic.id) })); setSelectedStickerId(null); setGraphicError(''); };
  const undoFinish = () => { if (!pedal) return; const history = historyRef.current[pedal.id]; if (!history?.past.length) return; const previous = history.past.at(-1)!; const present = finishes[pedal.id] || emptyFinish(); historyRef.current[pedal.id] = { past: history.past.slice(0, -1), future: [present, ...history.future].slice(0, 50) }; setFinishes(current => ({ ...current, [pedal.id]: previous })); setHistoryVersion(value => value + 1); setViewReset(value => value + 1); setEditorialCoverImage(''); setEditorialTopImage(''); };
  const redoFinish = () => { if (!pedal) return; const history = historyRef.current[pedal.id]; if (!history?.future.length) return; const next = history.future[0]; const present = finishes[pedal.id] || emptyFinish(); historyRef.current[pedal.id] = { past: [...history.past, present].slice(-50), future: history.future.slice(1) }; setFinishes(current => ({ ...current, [pedal.id]: next })); setHistoryVersion(value => value + 1); setViewReset(value => value + 1); setEditorialCoverImage(''); setEditorialTopImage(''); };
  const resetFinish = () => commitFinish(() => emptyFinish());
  const isArchived = Boolean(pedal && collection.some(item => item.id === pedal.id));
  const storeArchiveThumbnail = (pedalId: string, source: string) => { const version = (archiveThumbVersionRef.current[pedalId] || 0) + 1; archiveThumbVersionRef.current[pedalId] = version; void compressArchiveThumbnail(source).then(image => { if (archiveThumbVersionRef.current[pedalId] !== version) return; setArchiveImages(current => current[pedalId] === image ? current : { ...current, [pedalId]: image }); }).catch(() => setNotice('ARCHIVEの天面画像を生成できませんでした')); };
  useEffect(() => { if (pedal && isArchived && editorialTopImage) storeArchiveThumbnail(pedal.id, editorialTopImage); }, [editorialTopImage, isArchived, pedal?.id]);
  const saveToArchive = () => { if (!pedal) return; setCollection(current => [pedal, ...current.filter(item => item.id !== pedal.id)].slice(0, 24)); setNotice('このエフェクターをARCHIVEへ保存しました'); };
  const openArchivedPedal = (item: Pedal) => { setPedal(item); setForgeStep('錬成完了'); setPhase('result'); setWorkflow('forged'); setViewMode('stage'); setRuntimeMode('play'); setInspectSurface('top'); setMarkEditorOpen(false); setSelectedStickerId(null); setEditorialCoverImage(''); setEditorialTopImage(''); setDrawer(false); };
  const deleteArchivedPedal = (item: Pedal) => { if (!window.confirm('「' + item.name + '」をARCHIVEから削除しますか？')) return; setCollection(current => current.filter(candidate => candidate.id !== item.id)); setBoards(current => current.map(board => ({ ...board, pedalIds: board.pedalIds.filter(id => id !== item.id) }))); setFinishes(current => { const next = { ...current }; delete next[item.id]; return next; }); setArchiveImages(current => { const next = { ...current }; delete next[item.id]; return next; }); setNotice('ARCHIVEから削除しました'); };
  const createBoard = () => { if (boards.length >= 3) return setNotice('ボードは1ユーザーにつき3セットまでです'); const board: PedalBoard = { id: 'board-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), name: 'BOARD ' + (boards.length + 1), pedalIds: [], background: 'stage' }; setBoards(current => [...current, board].slice(0, 3)); setSelectedBoardId(board.id); };
  const renameBoard = (id: string, name: string) => setBoards(current => current.map(board => board.id === id ? { ...board, name: name.slice(0, 32) } : board));
  const changeBoardBackground = (id: string, background: PedalBoardBackground) => setBoards(current => current.map(board => board.id === id ? { ...board, background } : board));
  const deleteBoard = (board: PedalBoard) => { if (!window.confirm('「' + (board.name || 'UNTITLED BOARD') + '」を削除しますか？')) return; setBoards(current => current.filter(item => item.id !== board.id)); setNotice('ボードセットを削除しました'); };
  const addPedalToBoard = (boardId: string, pedalId: string) => setBoards(current => current.map(board => board.id !== boardId || board.pedalIds.includes(pedalId) || board.pedalIds.length >= 5 ? board : { ...board, pedalIds: [...board.pedalIds, pedalId] }));
  const removePedalFromBoard = (boardId: string, pedalId: string) => setBoards(current => current.map(board => board.id === boardId ? { ...board, pedalIds: board.pedalIds.filter(id => id !== pedalId) } : board));
  const moveBoardPedal = (boardId: string, pedalId: string, direction: -1 | 1) => setBoards(current => current.map(board => { if (board.id !== boardId) return board; const from = board.pedalIds.indexOf(pedalId); const to = from + direction; if (from < 0 || to < 0 || to >= board.pedalIds.length) return board; const pedalIds = [...board.pedalIds]; [pedalIds[from], pedalIds[to]] = [pedalIds[to], pedalIds[from]]; return { ...board, pedalIds }; }));
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
    const p = standard;
    setPedal(p); setSelectedStickerId(null); setGraphicError(''); setCoverImage(''); setEditorialCoverImage(''); setEditorialTopImage(''); setViewMode('stage'); setRuntimeMode('off'); setInspectSurface('top'); setMarkEditorOpen(false); setAutoRotate(false); setWorkflow('forging'); setForgeStep('音の性質を抽出中'); startForgeRumble(); setPhase('cranking');
    requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));
    const complete = () => { stopForgeRumble(.12); playForgeComplete(); setForgeStep('錬成完了'); setRuntimeMode('play'); setPhase('result'); setWorkflow('forged'); };
    if (reduce) return void window.setTimeout(complete, 160);
    window.setTimeout(() => setForgeStep('回路モデルを安定化中'), 560);
    window.setTimeout(() => setForgeStep('筐体を鋳造中'), 1120);
    window.setTimeout(() => { stopForgeRumble(.18); playForgeFlash(); setPhase('revealing'); }, 1450);
    window.setTimeout(() => setForgeStep('操作部品を配置中'), 1740);
    window.setTimeout(() => setForgeStep('意匠を定着中'), 2380);
    window.setTimeout(complete, 3150);
  };
  const beginFinishing = () => { setWorkflow('finishing'); setMarkEditorOpen(true); setFinishTool('signature'); setInspectSurface(activeMark.surface); setAutoRotate(false); setViewReset(value => value + 1); requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })); };
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
    activeFinish.stickers.forEach(graphic => lines.push(`STICKER  ${graphic.fileName} / ${graphic.surface.toUpperCase()} / ${Math.round(graphic.size * 100)}%`)); activeFinish.signatures.filter(mark => mark.enabled && mark.text.trim()).forEach(mark => lines.push(`OWNER MARK  ${mark.text} / ${mark.surface.toUpperCase()} / ${mark.style.toUpperCase()}`));
    let y = 325; ctx.font = '30px Arial, sans-serif'; for (const line of lines) { let row = ''; for (const char of line) { const next = row + char; if (ctx.measureText(next).width > 1030) { ctx.fillText(row, 92, y); row = char; y += 40; } else row = next; } ctx.fillText(row, 92, y); y += 64; } ctx.fillStyle = pedal.palette[0]; ctx.fillRect(92, 1600, 1056, 10); ctx.fillStyle = '#8f9a89'; ctx.font = '24px Arial, sans-serif'; ctx.fillText(`ONE OF ONE FORGED SOUND MACHINE${pedal.owner ? ` / ${pedal.owner}` : ''}`, 92, 1665); const doc = new jsPDF({ unit: 'mm', format: 'a4' }); doc.addImage(sheet.toDataURL('image/png'), 'PNG', 0, 0, 210, 297); doc.save(`${pedal.serial}.pdf`);
  };
  const toggleInputSource = (source: InputSource) => setInputSources(current => current.includes(source) ? current.filter(item => item !== source) : [...current, source]);
  return <main>
    <header><a className="brand" href="#top">PEDAL <i>FORGE</i></a><div className="site-header-actions"><button type="button" className={'bgm-toggle' + (bgmPlaying ? ' is-playing' : '')} data-bgm-toggle aria-pressed={bgmPlaying} aria-label={bgmPlaying ? 'BGMを停止' : 'BGMを再生'} onClick={toggleBgm}><span>BGM</span><b>{bgmPlaying ? 'ON' : 'OFF'}</b></button><button className="collection-button" onClick={() => setDrawer(true)}>ARCHIVE <b>{collection.length}</b></button></div><audio ref={bgmAudioRef} src="bgm-pedal-forge.mp3" loop preload="metadata" playsInline onPlay={() => setBgmPlaying(true)} onPause={() => setBgmPlaying(false)} /></header>
    <section className="hero" id="top">
      <div className="intro">
        <p className="eyebrow">ORIGINAL EFFECTS PEDAL GENERATOR</p><h1>CREATE YOUR<br /><em>OWN PEDAL.</em></h1>
        <p className="hero-declaration">まだ存在しない、<br />あなただけのエフェクターを。</p>
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
              <optgroup label="SPACE / DIGITAL / SPECIAL"><option value="delay">DELAY / ECHO</option><option value="reverb">REVERB</option><option value="pitch">OCTAVE / PITCH</option><option value="synth">SYNTH</option><option value="tuner">TUNER</option><option value="looper">LOOPER / FREEZE</option><option value="glitch">GLITCH / NOISE</option><option value="experimental">EXPERIMENTAL</option><option value="multi">MULTI EFFECT</option></optgroup>
            </select><small>回路系統</small></label>
            <label className="forge-select-field"><span>TONE ESSENCE</span><select value={sound} onChange={event => setSound(event.target.value as typeof sound)}><option value="random">おまかせ</option><option value="clarity">透明</option><option value="loud">轟音</option><option value="broken">壊れた音</option><option value="cosmic">宇宙的</option></select><small>音の核</small></label>
            <label className="forge-select-field"><span>FINISH AURA</span><select value={colorChoice} onChange={event => setColor(event.target.value as typeof colorChoice)}><option value="random">おまかせ</option><option value="acid">ACID</option><option value="violet">VIOLET</option><option value="ice">ICE</option><option value="ember">EMBER</option><option value="monochrome">MONOCHROME</option><option value="high-tone">HIGH TONE</option></select><small>外装の色調</small></label>
          </div>          <section className="maker-card" aria-label="現在のメーカー"><div><span>CURRENT MAKER</span><h3>{brandProfile.manufacturerName}</h3><p>{brandProfile.seriesName} / {brandProfile.archetype.toUpperCase()}</p></div><button type="button" onClick={() => setBrandProfile(createBrandProfile(`maker-${Date.now()}-${Math.random()}`))}>新しいメーカーを設立</button></section>
          <button className="generate forge-primary-cta" onClick={run} disabled={phase === 'cranking' || phase === 'revealing'}><span className="generate-copy"><b>{phase === 'idle' || phase === 'result' ? 'この思想から一台を錬成する' : 'FORGING...'}</b><small>{phase === 'idle' || phase === 'result' ? '02 / 錬成 — FORGE A NEW EFFECTS PEDAL' : forgeStep}</small></span><strong aria-hidden="true">→</strong></button>
        </div>
      </div>
    </section>
    <div className="forge-divider" aria-hidden="true"><span>DESCEND TO THE FORGING CHAMBER</span></div>
    <section id="forging-stage" ref={stageRef} className={'stage-wrap phase-' + phase + ' view-' + viewMode + (workflow === 'forged' || workflow === 'finishing' ? ' has-finish-rail' : '') + (workflow === 'finishing' ? ' is-editing' : '')}>
      <div className="workflow-location"><span>02 / FORGE</span><b>錬成</b></div><div className="stage-label">{phase === 'idle' ? 'NO PEDAL YET / SELECT PARAMETERS' : workflow === 'finishing' ? 'FINISH EDITOR / SELECTED SURFACE LOCKED' : phase === 'result' ? 'ALCHEMY COMPLETE / DRAG 360° / WHEEL TO ZOOM' : forgeStep}</div>
      <Stage pedal={pedal} phase={phase} canvasRef={canvasRef} reduce={reduce} resetToken={viewReset} viewMode={viewMode} runtimeMode={runtimeMode} userGraphics={activeFinish.stickers} marks={activeFinish.signatures} activeMark={activeMark} activeGraphic={activeGraphic} inspectSurface={inspectSurface} autoRotate={autoRotate} directMarkEditing={workflow === 'finishing'} finishTool={finishTool} onMarkChange={changeMark} onGraphicChange={changeGraphic} />
      {phase === 'result' && <div className="inspection-frame" aria-hidden="true">
        <div className="inspection-frame-head"><b>{workflow === 'finishing' ? 'SURFACE LOCK' : '360° VIEW'}</b><span>{workflow === 'finishing' ? 'SIGNATURE / STICKER ONLY' : '↔ DRAG TO ROTATE'}</span></div>
        <i className="corner corner-nw" /><i className="corner corner-ne" /><i className="corner corner-sw" /><i className="corner corner-se" />
        <small>このエリア内ではページスクロールできません</small>
      </div>}
      {phase === 'result' && workflow !== 'finishing' && <><div className="stage-control-panel">
        <div className="mode-switch" aria-label="背景"><span>BACKGROUND</span>{(['stage', 'white', 'dark'] as ViewMode[]).map(mode => <button key={mode} className={viewMode === mode ? 'active' : ''} onClick={() => { setViewMode(mode); setViewReset(v => v + 1); }}>{mode.toUpperCase()}</button>)}</div>
        <div className="mode-switch" aria-label="撮影背景"><span>PHOTO</span>{(['studio', 'hero'] as ViewMode[]).map(mode => <button key={mode} className={viewMode === mode ? 'active' : ''} onClick={() => { setViewMode(mode); setViewReset(v => v + 1); }}>{mode.toUpperCase()}</button>)}</div>
        <div className="mode-switch runtime-switch" aria-label="稼働状態"><span>POWER</span>{(['off', 'on', 'play'] as RuntimeMode[]).map(mode => <button key={mode} className={runtimeMode === mode ? 'active' : ''} onClick={() => setRuntimeMode(mode)}>{mode.toUpperCase()}</button>)}</div>
      </div><div className="view-control-panel" aria-label="3Dビュー操作"><span>VIEW CONTROL</span><button className={!autoRotate ? 'active' : ''} onClick={() => setAutoRotate(false)}>↔ DRAG</button><button className={autoRotate ? 'active' : ''} onClick={() => setAutoRotate(true)}>⟳ AUTO</button></div><button className="view-reset" onClick={() => setViewReset(v => v + 1)}>視点を戻す</button></>}
      <p className="stage-caption">{phase === 'result' && pedal ? `${pedal.brand?.manufacturerName || pedal.brandLabel || 'FURNACE AUDIO WORKS'} / ${enclosureDimensions[pedal.enclosure].label} / ${pedal.condition || 'FACTORY NEW'}` : 'FORGING CHAMBER / AWAITING MATERIALS'}</p>
      {phase === 'revealing' && <div className="reveal-flash" aria-hidden="true" />}
      {phase === 'result' && pedal && workflow === 'forged' && <aside className="stage-finish-card">
        <div className="workflow-location"><span>03 / FINISH</span><b>最終加工</b></div>
        <h2>デコってこ。</h2>
        <p>署名・ステッカーは任意です。</p>
        <button type="button" onClick={beginFinishing}>最終仕上げ</button>
      </aside>}
      {phase === 'result' && pedal && workflow === 'finishing' && (
        <aside className="stage-editor-drawer" aria-label="3D最終加工パネル">
          <FinishEditor mark={activeMark} graphic={activeGraphic} stickers={activeFinish.stickers} error={graphicError} tool={finishTool} open={markEditorOpen} canUndo={Boolean(currentHistory?.past.length)} canRedo={Boolean(currentHistory?.future.length)} onTool={setFinishTool} onClose={() => { setMarkEditorOpen(false); setWorkflow('forged'); }} onMarkChange={changeMark} onMarkRemove={removeMark} onGraphicFile={selectGraphic} onGraphicChange={changeGraphic} onGraphicRemove={removeGraphic} onGraphicSelect={setSelectedStickerId} onInspect={surface => { setInspectSurface(surface); setViewReset(value => value + 1); }} onUndo={undoFinish} onRedo={redoFinish} onReset={resetFinish} />
        </aside>
      )}
    </section>
    {phase === 'result' && pedal && <section className={'post-forge-flow workflow-' + workflow}>
      <div className="finish-shipping-grid shipping-only">
        <article className={workflow === 'shipping' || workflow === 'shipped' ? 'workflow-card active shipping-card' : 'workflow-card shipping-card'}><div className="workflow-location"><span>04 / SHIP</span><b>出荷</b></div><h2>パッケージングしていこう。</h2><p>出荷時点の3D、署名、ステッカー、ブランド情報から宣材4ページを作成し、4ページ目をXシェア画像に使用します。</p><button type="button" onClick={ship} disabled={workflow === 'shipping'}>{workflow === 'shipping' ? '出荷準備中…' : workflow === 'shipped' ? '現在の状態で再出荷' : 'この一台を出荷する'}</button></article>
      </div>
    </section>}
    {phase === 'result' && pedal && workflow !== 'finishing' && !editorialCoverImage && <EditorialCoverCapture key={`cover-${pedal.id}-${viewReset}`} pedal={pedal} stickers={activeFinish.stickers} signatures={activeFinish.signatures} onCapture={setEditorialCoverImage} />}
    {phase === 'result' && pedal && workflow !== 'finishing' && !editorialTopImage && <EditorialTopCapture key={`top-${pedal.id}-${viewReset}`} pedal={pedal} stickers={activeFinish.stickers} signatures={activeFinish.signatures} onCapture={setEditorialTopImage} />}
    {phase === 'result' && pedal && workflow === 'shipped' && <EditorialResult pedal={pedal} coverImage={coverImage} editorialCoverImage={editorialCoverImage} editorialTopImage={editorialTopImage} resultRef={resultRef} resetKey={manualReset} onPng={png} onPdf={pdf} onReforge={run} />}
    {phase === 'result' && pedal && workflow === 'shipped' && <SharePanel pedal={pedal} sourceImage={coverImage} editorialTopImage={editorialTopImage} onNotice={setNotice} />}
    {phase === 'result' && pedal && workflow === 'shipped' && <section className="archive-save-panel" aria-labelledby="archive-save-title"><span>ARCHIVE / FINAL STEP</span><h2 id="archive-save-title">この一台を保管する。</h2><p>このボタンを押した個体だけがARCHIVEへ保存されます。</p><button type="button" className="share-primary" onClick={saveToArchive} disabled={isArchived}>{isArchived ? 'アーカイブに保存済み' : 'アーカイブへ保存'}</button></section>}
    {drawer && missingArchivePedal && <ArchiveThumbnailCapture pedal={missingArchivePedal} stickers={missingArchiveFinish.stickers} signatures={missingArchiveFinish.signatures} onCapture={image => storeArchiveThumbnail(missingArchivePedal.id, image)} />}
    {drawer && <ArchiveDrawer collection={collection} boards={boards} finishes={finishes} archiveImages={archiveImages} selectedBoardId={selectedBoardId} onSelectedBoard={setSelectedBoardId} onClose={() => setDrawer(false)} onOpenPedal={openArchivedPedal} onDeletePedal={deleteArchivedPedal} onCreateBoard={createBoard} onRenameBoard={renameBoard} onDeleteBoard={deleteBoard} onAddPedal={addPedalToBoard} onRemovePedal={removePedalFromBoard} onMovePedal={moveBoardPedal} onBackground={changeBoardBackground} onNotice={setNotice} />}
    {notice && <button className="toast" onAnimationEnd={() => setNotice('')}>{notice}</button>}<footer>NO CLOUD. NO ACCOUNT. FORGED UNITS STAY IN THIS BROWSER.</footer>
  </main>;
}
