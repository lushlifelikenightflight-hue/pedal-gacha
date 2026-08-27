import { enclosureDimensions, generate, packageTemplateFor } from '../src/App';
import { createBrandProfile } from '../src/design-engine';
import { createHybridLayoutPlan } from '../src/layout-engine';

const effectTypes = ['random', 'boost', 'drive', 'fuzz', 'compressor', 'eq-filter', 'modulation', 'phaser', 'tremolo', 'delay', 'reverb', 'pitch', 'synth', 'tuner', 'looper', 'glitch', 'experimental', 'multi'] as const;
const animalTypes = ['cat', 'moth', 'dog', 'rabbit', 'bird', 'fish', 'bear', 'fox'] as const;
const eqPresets = ['eq-2-band', 'eq-3-band', 'eq-5-band', 'eq-7-band'] as const;
const designSources = ['legacy', 'motif-sheet', 'illustration-sheet', 'procedural-pattern'] as const;
const patternStyles = ['stripe', 'checker', 'dot', 'herringbone', 'seigaiha'] as const;
const tunerEnclosures = ['mini', 'compact', 'standard125', 'digital'] as const;
const packageTemplates = new Map<string, number>();
const counts = { total: 0, animal: new Map<string, number>(), animalHidden: 0, paddle: 0, eqMode: new Map<string, number>(), eqPreset: new Map<string, number>(), hybridTemplate: new Map<string, number>(), designSource: new Map<string, number>(), patternStyle: new Map<string, number>(), tunerEnclosure: new Map<string, number>(), tunerShape: new Map<string, number>(), knobStyle: new Map<string, number>(), layoutCollisions: 0 };
const brand = createBrandProfile('generation-audit-brand');
const failures: string[] = [];

for (let index = 0; index < 5000; index += 1) {
  const input = { effectType: effectTypes[index % effectTypes.length], sound: 'random' as const, mood: 'random' as const, colorChoice: 'random' as const, seed: `generation-audit-${index}`, brand };
  const pedal = generate(input); counts.total += 1; const packageTemplate = packageTemplateFor(pedal); packageTemplates.set(packageTemplate, (packageTemplates.get(packageTemplate) || 0) + 1);
  const designSource = pedal.designSource || 'legacy'; counts.designSource.set(designSource, (counts.designSource.get(designSource) || 0) + 1); counts.knobStyle.set(pedal.knobStyle, (counts.knobStyle.get(pedal.knobStyle) || 0) + 1);
  if (pedal.patternStyle) counts.patternStyle.set(pedal.patternStyle, (counts.patternStyle.get(pedal.patternStyle) || 0) + 1);
  if (pedal.knobStyle === 'cup') failures.push('deprecated cup knob generated: ' + pedal.seed);
  if (designSource === 'motif-sheet' && ((pedal.designSourceIndex ?? -1) < 0 || (pedal.designSourceIndex ?? 25) > 24 || pedal.patternStyle)) failures.push('invalid motif sheet selection: ' + pedal.seed);
  if (designSource === 'illustration-sheet' && ((pedal.designSourceIndex ?? -1) < 0 || (pedal.designSourceIndex ?? 9) > 8 || pedal.patternStyle)) failures.push('invalid illustration sheet selection: ' + pedal.seed);
  if (designSource === 'procedural-pattern' && !pedal.patternStyle) failures.push('missing procedural pattern: ' + pedal.seed);
  if (input.effectType === 'tuner') {
    counts.tunerEnclosure.set(pedal.enclosure, (counts.tunerEnclosure.get(pedal.enclosure) || 0) + 1); counts.tunerShape.set(pedal.tunerDisplayShape || 'missing', (counts.tunerShape.get(pedal.tunerDisplayShape || 'missing') || 0) + 1);
    if (pedal.knobs.length !== 0 || pedal.footswitches !== 1 || pedal.display !== 'oled' || pedal.toggleCount !== 0 || pedal.footswitchStyle !== 'metal' || pedal.designSource !== 'legacy' || !tunerEnclosures.includes(pedal.enclosure as typeof tunerEnclosures[number]) || !['wide', 'square'].includes(pedal.tunerDisplayShape || '')) failures.push('invalid tuner hardware');
  }
  if (pedal.motifCategory === 'animal') { counts.animal.set(pedal.motifType, (counts.animal.get(pedal.motifType) || 0) + 1); if ((pedal.designSource || 'legacy') === 'legacy' && !['ONE POINT', 'PANEL', 'TYPOGRAPHY'].includes(pedal.graphicMode || '')) counts.animalHidden += 1; }
  if (pedal.footswitchStyle === 'large-lower-paddle') { counts.paddle += 1; if (!['compact', 'standard125', 'tall'].includes(pedal.enclosure) || pedal.footswitches !== 1 || pedal.controlLayoutMode !== 'knob-only') failures.push(`invalid paddle: ${pedal.seed}`); }
  if (pedal.controlLayoutMode && pedal.controlLayoutMode !== 'knob-only') {
    counts.eqMode.set(pedal.controlLayoutMode, (counts.eqMode.get(pedal.controlLayoutMode) || 0) + 1);
    if (!pedal.eqSliders?.length || !pedal.eqPreset) failures.push(`missing EQ data: ${pedal.seed}`);
    if (['nano', 'micro', 'mini'].includes(pedal.enclosure)) failures.push(`EQ on tiny enclosure: ${pedal.seed}`);
    if (pedal.eqSliders?.length) { const size = enclosureDimensions[pedal.enclosure]; const plan = createHybridLayoutPlan({ width: size.width, height: size.height, knobCount: pedal.knobs.length, sliderCount: pedal.eqSliders.length, hasLargePaddle: pedal.footswitchStyle === 'large-lower-paddle', footswitchCount: pedal.footswitches, seed: pedal.seed }); counts.hybridTemplate.set(plan.template, (counts.hybridTemplate.get(plan.template) || 0) + 1); counts.layoutCollisions += plan.collisionCount; }
  }
  if (pedal.eqPreset) counts.eqPreset.set(pedal.eqPreset, (counts.eqPreset.get(pedal.eqPreset) || 0) + 1);
}

const forcedTemplates = new Map<string, number>();
const forcedScenarios = [
  { width: 2.35, height: 3.65, knobCount: 3, sliderCount: 3, hasLargePaddle: false, footswitchCount: 1 as const },
  { width: 2.35, height: 3.65, knobCount: 2, sliderCount: 3, hasLargePaddle: true, footswitchCount: 1 as const },
  { width: 4.4, height: 3.2, knobCount: 3, sliderCount: 3, hasLargePaddle: false, footswitchCount: 2 as const },
  { width: 4.4, height: 3.2, knobCount: 2, sliderCount: 5, hasLargePaddle: false, footswitchCount: 2 as const },
];
for (const [scenarioIndex, scenario] of forcedScenarios.entries()) for (let index = 0; index < 160; index += 1) { const plan = createHybridLayoutPlan({ ...scenario, seed: `forced-${scenarioIndex}-${index}` }); forcedTemplates.set(plan.template, (forcedTemplates.get(plan.template) || 0) + 1); if (plan.collisionCount) failures.push(`forced layout collision: ${plan.template}/${scenarioIndex}/${index}`); }

for (const animal of animalTypes) if (!counts.animal.get(animal)) failures.push(`animal never generated: ${animal}`);
for (const preset of eqPresets) if (!counts.eqPreset.get(preset)) failures.push(`EQ preset never generated: ${preset}`);
for (const source of designSources) if (!counts.designSource.get(source)) failures.push('design source never generated: ' + source);
for (const style of patternStyles) if (!counts.patternStyle.get(style)) failures.push('pattern style never generated: ' + style);
for (const enclosure of tunerEnclosures) if (!counts.tunerEnclosure.get(enclosure)) failures.push('tuner enclosure never generated: ' + enclosure);
for (const shape of ['wide', 'square']) if (!counts.tunerShape.get(shape)) failures.push('tuner display shape never generated: ' + shape);
for (const style of ['pointer', 'ribbed', 'cylinder']) if (!counts.knobStyle.get(style)) failures.push('knob style never generated: ' + style);
for (const template of ['H05', 'H06', 'H07', 'H08', 'H09', 'H10', 'H11', 'H12', 'H13', 'H14']) if (!forcedTemplates.get(template)) failures.push(`hybrid template unreachable: ${template}`);
for (const template of ['open-box-standard', 'manual-on-top', 'pedal-lifted', 'full-contents']) if (!packageTemplates.get(template)) failures.push(`package template unreachable: ${template}`);
if (!counts.paddle) failures.push('large lower paddle never generated');
if (!counts.eqMode.get('knob-plus-slider-eq')) failures.push('hybrid knob/EQ mode never generated');
if (!counts.eqMode.get('slider-eq-main')) failures.push('slider-main EQ mode never generated');
if (counts.animalHidden) failures.push(`animal motif hidden by graphic mode: ${counts.animalHidden}`);
const eqTotal = [...counts.eqMode.values()].reduce((sum, count) => sum + count, 0);
if (eqTotal / counts.total > .16) failures.push(`EQ rate too high: ${(eqTotal / counts.total).toFixed(3)}`);
if (counts.layoutCollisions) failures.push(`generated hybrid collisions: ${counts.layoutCollisions}`);

const repeatInput = { effectType: 'random' as const, sound: 'random' as const, mood: 'random' as const, colorChoice: 'random' as const, seed: 'generation-audit-repeat', brand };
const first = generate(repeatInput); const second = generate(repeatInput);
if (JSON.stringify({ motifType: first.motifType, footswitchStyle: first.footswitchStyle, controlLayoutMode: first.controlLayoutMode, eqPreset: first.eqPreset, eqSliders: first.eqSliders, designSource: first.designSource, designSourceIndex: first.designSourceIndex, patternStyle: first.patternStyle, tunerDisplayShape: first.tunerDisplayShape }) !== JSON.stringify({ motifType: second.motifType, footswitchStyle: second.footswitchStyle, controlLayoutMode: second.controlLayoutMode, eqPreset: second.eqPreset, eqSliders: second.eqSliders, designSource: second.designSource, designSourceIndex: second.designSourceIndex, patternStyle: second.patternStyle, tunerDisplayShape: second.tunerDisplayShape })) failures.push('same seed is not deterministic');

const report = { total: counts.total, packageTemplates: Object.fromEntries(packageTemplates), animals: Object.fromEntries(counts.animal), animalHidden: counts.animalHidden, largeLowerPaddle: counts.paddle, eqRate: eqTotal / counts.total, eqModes: Object.fromEntries(counts.eqMode), eqPresets: Object.fromEntries(counts.eqPreset), designSources: Object.fromEntries(counts.designSource), patternStyles: Object.fromEntries(counts.patternStyle), tunerEnclosures: Object.fromEntries(counts.tunerEnclosure), tunerShapes: Object.fromEntries(counts.tunerShape), knobStyles: Object.fromEntries(counts.knobStyle), hybridTemplates: Object.fromEntries(counts.hybridTemplate), forcedTemplates: Object.fromEntries(forcedTemplates), layoutCollisions: counts.layoutCollisions, failures };
console.log(JSON.stringify(report, null, 2)); if (failures.length) process.exitCode = 1;
