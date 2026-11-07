import { PALETTE } from './palette';

export interface FirstWalkArtStyle {
  ink: number;
  grass: number;
  footpath: number;
  sun: number;
  shade: number;
  hazard: number;
  detail: number;
  outlineWidth: number;
}

export const FIRST_WALK_ART_STYLE: FirstWalkArtStyle = {
  ink: PALETTE.ink,
  grass: PALETTE.grass,
  footpath: PALETTE.footpath,
  sun: PALETTE.hoodYellow,
  shade: PALETTE.pramTeal,
  hazard: PALETTE.capeRed,
  detail: PALETTE.dadBlue,
  outlineWidth: 3
};

export interface ArtBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const drawFirstWalkPath = (
  scene: Phaser.Scene,
  bounds: ArtBounds,
  style: FirstWalkArtStyle
): Phaser.GameObjects.Container => {
  const grass = scene.add
    .rectangle(bounds.x, bounds.y, bounds.width, bounds.height, style.grass)
    .setOrigin(0.5);
  const path = scene.add
    .rectangle(bounds.x, bounds.y, bounds.width * 0.72, bounds.height, style.footpath)
    .setStrokeStyle(style.outlineWidth, style.ink)
    .setOrigin(0.5);
  return scene.add.container(0, 0, [grass, path]);
};

export const drawShadePatch = (
  scene: Phaser.Scene,
  bounds: ArtBounds,
  style: FirstWalkArtStyle
): Phaser.GameObjects.Container => {
  const canopy = scene.add
    .ellipse(bounds.x, bounds.y, bounds.width, bounds.height, style.shade, 0.35)
    .setStrokeStyle(style.outlineWidth, style.ink, 0.5);
  const leaf = scene.add
    .circle(
      bounds.x - bounds.width / 4,
      bounds.y - bounds.height / 4,
      bounds.height / 5,
      style.detail
    )
    .setStrokeStyle(style.outlineWidth, style.ink);
  return scene.add.container(0, 0, [canopy, leaf]);
};

export type FirstWalkHazardKind = 'pothole' | 'kerb' | 'bin' | 'sprinkler' | 'sun';

export const drawFirstWalkHazard = (
  scene: Phaser.Scene,
  kind: FirstWalkHazardKind,
  bounds: ArtBounds,
  style: FirstWalkArtStyle
): Phaser.GameObjects.Container => {
  const items: Phaser.GameObjects.GameObject[] = [];
  if (kind === 'pothole')
    items.push(
      scene.add.ellipse(0, 0, bounds.width, bounds.height, style.ink),
      scene.add.ellipse(0, 0, bounds.width * 0.65, bounds.height * 0.45, style.hazard)
    );
  if (kind === 'kerb')
    items.push(
      scene.add
        .rectangle(0, 0, bounds.width, bounds.height, style.hazard)
        .setStrokeStyle(style.outlineWidth, style.ink)
    );
  if (kind === 'bin')
    items.push(
      scene.add
        .rectangle(0, 0, bounds.width, bounds.height, style.detail)
        .setStrokeStyle(style.outlineWidth, style.ink),
      scene.add.rectangle(0, -bounds.height / 2, bounds.width * 1.2, bounds.height / 5, style.ink)
    );
  if (kind === 'sprinkler')
    items.push(
      scene.add
        .circle(0, 0, bounds.height / 3, style.detail)
        .setStrokeStyle(style.outlineWidth, style.ink),
      scene.add
        .arc(0, 0, bounds.width / 2, 210, 330, false, style.sun)
        .setStrokeStyle(style.outlineWidth, style.sun)
    );
  if (kind === 'sun')
    items.push(
      scene.add
        .circle(0, 0, bounds.height / 2, style.sun)
        .setStrokeStyle(style.outlineWidth, style.ink)
    );
  return scene.add.container(bounds.x, bounds.y, items);
};
