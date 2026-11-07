import { describe, expect, it, vi } from 'vitest';
import { drawFirstWalkHazard, FIRST_WALK_ART_STYLE } from '../../src/art/firstWalkArt';

function fakeScene() {
  const item = () => ({
    setStrokeStyle: vi.fn().mockReturnThis(),
    setOrigin: vi.fn().mockReturnThis()
  });
  const container = vi.fn((x: number, y: number, children: unknown[]) => ({ x, y, children }));
  return {
    add: {
      arc: vi.fn(item),
      circle: vi.fn(item),
      container,
      ellipse: vi.fn(item),
      rectangle: vi.fn(item)
    },
    container
  };
}

describe('First Walk hazard art', () => {
  it('returns a container at the configured world coordinates', () => {
    const scene = fakeScene();
    const bounds = { x: 247, y: 5200, width: 58, height: 42 };

    const view = drawFirstWalkHazard(
      scene as unknown as Phaser.Scene,
      'pothole',
      bounds,
      FIRST_WALK_ART_STYLE
    );

    expect(view).toMatchObject({ x: bounds.x, y: bounds.y });
  });
});
