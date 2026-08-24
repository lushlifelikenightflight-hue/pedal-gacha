export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type LayoutElementKind = 'knob' | 'slider' | 'eq-panel' | 'footswitch' | 'large-paddle' | 'led' | 'label' | 'product-name' | 'brand-name' | 'frame' | 'motif';
export type HybridTemplate = 'H05' | 'H06' | 'H07' | 'H08' | 'H09' | 'H10' | 'H11' | 'H12' | 'H13' | 'H14';
export type ControlLabelPlacement = 'auto' | 'above' | 'below' | 'left' | 'right';

export interface LayoutElement {
  id: string;
  kind: LayoutElementKind;
  rect: Rect;
  safePadding: number;
  priority: number;
}

export interface LayoutCollision {
  aId: string;
  bId: string;
  severity: 'soft' | 'hard' | 'fatal';
}

export interface HybridLayoutPlan {
  template: HybridTemplate;
  knobCenters: Array<{ x: number; z: number; labelPlacement: ControlLabelPlacement }>;
  eqPanel: { x: number; z: number; width: number; slotLength: number };
  productName: { x: number; z: number; width: number };
  switchZ: number;
  indicatorZ: number;
  collisionCount: number;
  collisionPairs: string[];
}

export function inflateRect(rect: Rect, padding: number): Rect {
  return { x: rect.x - padding, y: rect.y - padding, width: rect.width + padding * 2, height: rect.height + padding * 2 };
}

export function intersects(a: Rect, b: Rect): boolean {
  return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
}

export function containsRect(outer: Rect, inner: Rect): boolean {
  return inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.width <= outer.x + outer.width && inner.y + inner.height <= outer.y + outer.height;
}

export class LayoutEngine {
  private readonly elements = new Map<string, LayoutElement>();

  constructor(private readonly safeArea: Rect) {}

  add(element: LayoutElement): void { this.elements.set(element.id, element); }
  getAll(): LayoutElement[] { return [...this.elements.values()]; }
  fitsInside(element: LayoutElement): boolean { return containsRect(this.safeArea, inflateRect(element.rect, element.safePadding)); }

  getCollisions(): LayoutCollision[] {
    const elements = this.getAll();
    const collisions: LayoutCollision[] = [];
    const hardware = new Set<LayoutElementKind>(['knob', 'slider', 'eq-panel', 'footswitch', 'large-paddle']);
    const text = new Set<LayoutElementKind>(['label', 'product-name', 'brand-name']);
    for (let aIndex = 0; aIndex < elements.length; aIndex += 1) {
      for (let bIndex = aIndex + 1; bIndex < elements.length; bIndex += 1) {
        const a = elements[aIndex]; const b = elements[bIndex];
        if (!intersects(inflateRect(a.rect, a.safePadding), inflateRect(b.rect, b.safePadding))) continue;
        const fatal = (hardware.has(a.kind) && hardware.has(b.kind)) || (hardware.has(a.kind) && text.has(b.kind)) || (hardware.has(b.kind) && text.has(a.kind));
        collisions.push({ aId: a.id, bId: b.id, severity: fatal ? 'fatal' : a.kind === 'frame' || b.kind === 'frame' ? 'hard' : 'soft' });
      }
    }
    return collisions;
  }
}

const seededIndex = (seed: string, length: number) => {
  let hash = 2166136261;
  for (const character of seed) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return Math.abs(hash) % Math.max(1, length);
};

const row = (count: number, width: number, z: number, span = .6): Array<{ x: number; z: number; labelPlacement: ControlLabelPlacement }> => {
  if (!count) return [];
  if (count === 1) return [{ x: 0, z, labelPlacement: 'below' }];
  return Array.from({ length: count }, (_, index) => ({ x: -width * span / 2 + width * span * index / (count - 1), z, labelPlacement: 'below' as const }));
};

export function createHybridLayoutPlan(input: { width: number; height: number; knobCount: number; sliderCount: number; hasLargePaddle: boolean; footswitchCount: 1 | 2; seed: string }): HybridLayoutPlan {
  const { width, height, knobCount, sliderCount, hasLargePaddle, footswitchCount, seed } = input;
  const wide = width / height > 1.02;
  const manyBands = sliderCount >= 5;
  const candidates: HybridTemplate[] = hasLargePaddle ? ['H06'] : manyBands ? (wide ? ['H10', 'H11', 'H14', 'H08'] : ['H10', 'H11', 'H08']) : wide ? ['H07', 'H14', 'H12', 'H08', 'H09'] : ['H05', 'H09', 'H08', 'H13'];
  const template = candidates[seededIndex(seed, candidates.length)];
  const slotLength = Math.min(height * (manyBands ? .16 : .18), manyBands ? .68 : .72);
  let eqPanel = { x: 0, z: -height * .015, width: Math.min(width * .76, Math.max(.9, sliderCount * .34 + .34)), slotLength };
  let knobCenters = row(knobCount, width, -height * .34, knobCount >= 3 ? .68 : .55);

  if (template === 'H07' || template === 'H14') {
    eqPanel = { ...eqPanel, x: width * .22, width: Math.min(width * .42, Math.max(.86, sliderCount * .28 + .26)), z: -height * .04 };
    knobCenters = Array.from({ length: knobCount }, (_, index) => ({ x: -width * .29, z: -height * .28 + index * Math.min(.68, height * .21), labelPlacement: 'left' as const }));
  } else if (template === 'H08') {
    eqPanel = { ...eqPanel, z: -height * .25 };
    knobCenters = row(knobCount, width, height * .08, knobCount >= 3 ? .66 : .55).map(point => ({ ...point, labelPlacement: 'below' as const }));
  } else if (template === 'H10') {
    knobCenters = row(Math.min(knobCount, 1), width, -height * .36, .45);
  } else if (template === 'H11' || template === 'H12') {
    knobCenters = row(Math.min(knobCount, 2), width, -height * .35, .52);
  } else if (template === 'H13') {
    knobCenters = row(Math.min(knobCount, 3), width, -height * .35, .64);
    eqPanel = { ...eqPanel, width: Math.min(width * .66, eqPanel.width) };
  }

  const switchZ = height * (hasLargePaddle ? .43 : .43);
  const indicatorZ = height * .23;
  const safeArea = { x: -width * .45, y: -height * .45, width: width * .9, height: height * .9 };
  const engine = new LayoutEngine(safeArea);
  const eqHeight = slotLength + .46;
  engine.add({ id: 'eq-panel', kind: 'eq-panel', rect: { x: eqPanel.x - eqPanel.width / 2, y: eqPanel.z - eqHeight / 2, width: eqPanel.width, height: eqHeight }, safePadding: .08, priority: 60 });
  knobCenters.forEach((point, index) => engine.add({ id: `knob-${index}`, kind: 'knob', rect: { x: point.x - .26, y: point.z - .26, width: .52, height: .52 }, safePadding: .06, priority: 90 }));
  engine.add({ id: 'footswitch', kind: hasLargePaddle ? 'large-paddle' : 'footswitch', rect: { x: -width * (footswitchCount === 2 ? .38 : .25), y: switchZ - height * .07, width: width * (footswitchCount === 2 ? .76 : .5), height: height * .14 }, safePadding: .06, priority: hasLargePaddle ? 100 : 95 });

  const titleCandidates = wide && (template === 'H07' || template === 'H14')
    ? [{ x: 0, z: height * .3, width: width * .34 }, { x: -width * .22, z: -height * .4, width: width * .4 }]
    : [{ x: 0, z: height * (template === 'H08' ? .27 : .24), width: width * .55 }, { x: 0, z: height * .29, width: width * .46 }, { x: 0, z: -height * .43, width: width * .48 }];
  let productName = titleCandidates[0];
  for (const candidate of titleCandidates) {
    const element: LayoutElement = { id: 'product-name', kind: 'product-name', rect: { x: candidate.x - candidate.width / 2, y: candidate.z - height * .0275, width: candidate.width, height: height * .055 }, safePadding: .04, priority: 70 };
    if (!engine.fitsInside(element)) continue;
    if (!engine.getAll().some(existing => intersects(inflateRect(existing.rect, existing.safePadding), inflateRect(element.rect, element.safePadding)))) { productName = candidate; break; }
  }
  engine.add({ id: 'product-name', kind: 'product-name', rect: { x: productName.x - productName.width / 2, y: productName.z - height * .0275, width: productName.width, height: height * .055 }, safePadding: .04, priority: 70 });

const fatalCollisions = engine.getCollisions().filter(collision => collision.severity === 'fatal');
  return {
    template,
    knobCenters,
    eqPanel,
    productName,
    switchZ,
    indicatorZ,
    collisionCount: fatalCollisions.length,
    collisionPairs: fatalCollisions.map(collision => `${collision.aId}:${collision.bId}`),
  };
}