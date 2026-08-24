import * as THREE from 'three';
import { normalizeGraphic, normalizeMark, surfacePose, surfaceQuaternion, upsertSurfaceItem } from '../src/App';

const size = { width: 2.6, height: 3.8, depth: 1.1 };
const surfaces = ['front', 'left-side', 'right-side', 'back'] as const;
const expectedNormals: Record<(typeof surfaces)[number], THREE.Vector3> = {
  front: new THREE.Vector3(0, 1, 0),
  'left-side': new THREE.Vector3(-1, 0, 0),
  'right-side': new THREE.Vector3(1, 0, 0),
  back: new THREE.Vector3(0, -1, 0),
};
const expectedRight: Record<(typeof surfaces)[number], THREE.Vector3> = {
  front: new THREE.Vector3(1, 0, 0),
  'left-side': new THREE.Vector3(0, 0, 1),
  'right-side': new THREE.Vector3(0, 0, -1),
  back: new THREE.Vector3(1, 0, 0),
};
const close = (a: THREE.Vector3, b: THREE.Vector3) => a.distanceTo(b) < 1e-6;

for (const surface of surfaces) {
  const pose = surfacePose(surface, { x: .7, y: .3 }, size, .02);
  const quaternion = surfaceQuaternion(pose.base, 0);
  const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion);
  if (!close(normal, expectedNormals[surface])) throw new Error(`${surface}: outward normal mismatch ${normal.toArray()}`);
  if (!close(right, expectedRight[surface])) throw new Error(`${surface}: mirrored local X axis ${right.toArray()}`);
}

const left = surfacePose('left-side', { x: .75, y: .5 }, size, .02);
const right = surfacePose('right-side', { x: .75, y: .5 }, size, .02);
if (!(left.position[2] > 0 && right.position[2] < 0)) throw new Error('Side UV orientation mismatch');
if (Math.abs(left.position[0] + size.width / 2 + .02) > 1e-6) throw new Error('Left surface offset mismatch');
if (Math.abs(right.position[0] - size.width / 2 - .02) > 1e-6) throw new Error('Right surface offset mismatch');

const signature = normalizeMark({ text: 'LEFT SIGN', enabled: true, surface: 'left-side', localPosition: { x: .2, y: .4 }, rotation: 12, scale: .8 }, 'left-side');
const sticker = normalizeGraphic({
  id: 'sticker-right', type: 'sticker', asset: 'data:image/webp;base64,qa', fileName: 'qa.webp', mimeType: 'image/webp', width: 64, height: 64, sourceUrl: 'data:image/webp;base64,qa', textureUrl: 'data:image/webp;base64,qa',
  usageMode: 'preserve', placementMode: 'sticker', transformStyle: 'sticker', transformStrength: 'medium', colorBehavior: 'preserve', variant: 0,
  surface: 'right-side', localPosition: { x: .8, y: .25 }, rotation: -18, scale: .6,
});
const restored = JSON.parse(JSON.stringify({ signatures: [signature], stickers: [sticker] }));
if (restored.signatures[0].type !== 'signature' || restored.signatures[0].surface !== 'left-side' || restored.signatures[0].localPosition.x !== .2 || restored.signatures[0].rotation !== 12 || restored.signatures[0].scale !== .8) throw new Error('Signature save/restore mismatch');
if (restored.stickers[0].type !== 'sticker' || restored.stickers[0].surface !== 'right-side' || restored.stickers[0].asset !== sticker.asset || restored.stickers[0].localPosition.y !== .25 || restored.stickers[0].rotation !== -18 || restored.stickers[0].scale !== .6) throw new Error('Sticker save/restore mismatch');

const fourSurfaceSignatures = surfaces.reduce((items, surface, index) => upsertSurfaceItem(items, normalizeMark({ id: `signature-${surface}`, text: surface, enabled: true, surface, localPosition: { x: .2 + index * .1, y: .4 }, rotation: index * 9, scale: .3 + index * .1 }, surface)), [] as ReturnType<typeof normalizeMark>[]);
if (fourSurfaceSignatures.length !== 4 || surfaces.some(surface => !fourSurfaceSignatures.some(item => item.surface === surface))) throw new Error('Four-surface simultaneous placement mismatch');
const replacedLeft = upsertSurfaceItem(fourSurfaceSignatures, normalizeMark({ id: 'signature-left-replacement', text: 'replacement', enabled: true, surface: 'left-side' }, 'left-side'));
if (replacedLeft.length !== 4 || replacedLeft.filter(item => item.surface === 'left-side').length !== 1 || replacedLeft.find(item => item.surface === 'front')?.text !== 'front') throw new Error('Surface upsert removed another face');

console.log('finish placement QA passed: 4 surfaces, simultaneous items, outward normals, non-mirrored axes, offsets, serialization');
