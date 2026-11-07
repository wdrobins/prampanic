import { describe, expect, it, vi } from 'vitest';
import { Lulu } from '../../src/entities/Lulu';

describe('Lulu', () => {
  it('does not recreate the face when asked for the current wake state', () => {
    const removeAll = vi.fn();
    const lulu = {
      current: 'Sleeping',
      face: { removeAll }
    } as unknown as Lulu;

    Lulu.prototype.setWakeState.call(lulu, 'Sleeping');

    expect(removeAll).not.toHaveBeenCalled();
  });
});
