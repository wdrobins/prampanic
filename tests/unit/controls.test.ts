import { describe, expect, it } from 'vitest';
import { Controls } from '../../src/input/Controls';

function keyboard(type: 'keydown' | 'keyup', key: string): KeyboardEvent {
  return Object.assign(new Event(type), { key }) as KeyboardEvent;
}

function pointer(
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
  pointerId: number,
  clientX: number,
  clientY = 100
): PointerEvent {
  return Object.assign(new Event(type), { pointerId, clientX, clientY }) as PointerEvent;
}

describe('Controls', () => {
  it('maps A/D/S/Space/W to the four scene-agnostic commands', () => {
    const target = new EventTarget();
    const controls = new Controls(target).subscribe();

    target.dispatchEvent(keyboard('keydown', 'a'));
    expect(controls.state).toMatchObject({ steer: -1, smooth: false, shush: false, peek: false });
    target.dispatchEvent(keyboard('keyup', 'a'));
    target.dispatchEvent(keyboard('keydown', 'd'));
    expect(controls.state.steer).toBe(1);
    target.dispatchEvent(keyboard('keydown', 's'));
    target.dispatchEvent(keyboard('keydown', ' '));
    target.dispatchEvent(keyboard('keydown', 'w'));
    expect(controls.state).toMatchObject({ steer: 1, smooth: true, shush: true, peek: true });

    target.dispatchEvent(keyboard('keyup', 'd'));
    target.dispatchEvent(keyboard('keyup', 's'));
    target.dispatchEvent(keyboard('keyup', ' '));
    target.dispatchEvent(keyboard('keyup', 'w'));
    expect(controls.state).toEqual({ steer: 0, smooth: false, shush: false, peek: false });
  });

  it('keeps left steering and right-hand shush independent by pointer id', () => {
    const target = new EventTarget();
    const controls = new Controls(target, { splitX: 195 }).subscribe();

    target.dispatchEvent(pointer('pointerdown', 4, 80));
    target.dispatchEvent(pointer('pointermove', 4, 20));
    expect(controls.state.steer).toBe(-1);
    target.dispatchEvent(pointer('pointermove', 4, 140));
    target.dispatchEvent(pointer('pointerdown', 7, 300));
    expect(controls.state).toMatchObject({ steer: 1, smooth: false, shush: true });

    target.dispatchEvent(pointer('pointerup', 7, 300));
    expect(controls.state).toMatchObject({ steer: 1, smooth: false, shush: false });
    target.dispatchEvent(pointer('pointerup', 4, 140));
    expect(controls.state).toMatchObject({ steer: 0, smooth: false, shush: false });
  });

  it('clears smooth mode when the final drag-shush pointer is released or cancelled', () => {
    const target = new EventTarget();
    const controls = new Controls(target, { splitX: 195 }).subscribe();

    target.dispatchEvent(pointer('pointerdown', 1, 80));
    target.dispatchEvent(pointer('pointerup', 1, 80));
    expect(controls.state.smooth).toBe(false);

    target.dispatchEvent(pointer('pointerdown', 2, 80));
    target.dispatchEvent(pointer('pointercancel', 2, 80));
    expect(controls.state).toMatchObject({ smooth: false, shush: false, steer: 0 });
  });

  it('supports left/right touch zones as an alternative steering scheme', () => {
    const target = new EventTarget();
    const controls = new Controls(target, { splitX: 195, touchScheme: 'left-right' }).subscribe();

    target.dispatchEvent(pointer('pointerdown', 1, 80));
    expect(controls.state).toMatchObject({ steer: -1, smooth: false });
    target.dispatchEvent(pointer('pointerdown', 2, 300));
    expect(controls.state).toMatchObject({ steer: 1, smooth: false });
    target.dispatchEvent(pointer('pointerup', 2, 300));
    expect(controls.state.steer).toBe(-1);
  });

  it('subscribes once and dispose removes every listener and clears state', () => {
    const target = new EventTarget();
    const controls = new Controls(target);
    expect(controls.state).toEqual({ steer: 0, smooth: false, shush: false, peek: false });

    controls.subscribe().subscribe();
    target.dispatchEvent(keyboard('keydown', 'a'));
    expect(controls.state.steer).toBe(-1);
    controls.dispose();
    expect(controls.state).toEqual({ steer: 0, smooth: false, shush: false, peek: false });
    target.dispatchEvent(keyboard('keydown', 'd'));
    expect(controls.state.steer).toBe(0);
  });
});
