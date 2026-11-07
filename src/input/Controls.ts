export type SteerDirection = -1 | 0 | 1;

export type ControlState = {
  steer: SteerDirection;
  smooth: boolean;
  shush: boolean;
  peek: boolean;
};

export type TouchScheme = 'drag-shush' | 'left-right';

export type ControlsOptions = {
  /** Horizontal boundary between the left and right thumb zones. */
  splitX?: number;
  /** `drag-shush` matches the phone design; `left-right` is an accessible alternative. */
  touchScheme?: TouchScheme;
  /** Optional pram target whose pointer presses invoke the peek command. */
  peekTarget?: EventTarget;
};

type PointerLikeEvent = Event & { pointerId: number; clientX: number };
type KeyLikeEvent = Event & { key: string };
type LeftPointer = { startX: number; direction: SteerDirection };

const INITIAL_STATE: ControlState = { steer: 0, smooth: false, shush: false, peek: false };

/**
 * Scene-agnostic keyboard and touch commands for the shared movement verbs.
 * A Phaser scene can pass `scene.input.manager.canvas` (or any EventTarget) and
 * read `state` during update without this class depending on Phaser itself.
 */
export class Controls {
  public state: ControlState = { ...INITIAL_STATE };

  private readonly splitX: number;
  private readonly touchScheme: TouchScheme;
  private readonly peekTarget?: EventTarget;
  private subscribed = false;
  private pointerInputActive = false;
  private readonly keys = new Set<string>();
  private readonly leftPointers = new Map<number, LeftPointer>();
  private readonly rightPointers = new Set<number>();
  private readonly peekPointers = new Set<number>();

  public constructor(
    private readonly target: EventTarget,
    options: ControlsOptions = {}
  ) {
    this.splitX = options.splitX ?? 195;
    this.touchScheme = options.touchScheme ?? 'drag-shush';
    this.peekTarget = options.peekTarget;
  }

  public subscribe(): this {
    if (this.subscribed) return this;
    this.subscribed = true;
    this.target.addEventListener('keydown', this.onKeyDown);
    this.target.addEventListener('keyup', this.onKeyUp);
    this.target.addEventListener('pointerdown', this.onPointerDown);
    this.target.addEventListener('pointermove', this.onPointerMove);
    this.target.addEventListener('pointerup', this.onPointerEnd);
    this.target.addEventListener('pointercancel', this.onPointerEnd);
    this.peekTarget?.addEventListener('pointerdown', this.onPeekDown);
    this.peekTarget?.addEventListener('pointerup', this.onPeekEnd);
    this.peekTarget?.addEventListener('pointercancel', this.onPeekEnd);
    return this;
  }

  public dispose(): void {
    if (this.subscribed) {
      this.target.removeEventListener('keydown', this.onKeyDown);
      this.target.removeEventListener('keyup', this.onKeyUp);
      this.target.removeEventListener('pointerdown', this.onPointerDown);
      this.target.removeEventListener('pointermove', this.onPointerMove);
      this.target.removeEventListener('pointerup', this.onPointerEnd);
      this.target.removeEventListener('pointercancel', this.onPointerEnd);
      this.peekTarget?.removeEventListener('pointerdown', this.onPeekDown);
      this.peekTarget?.removeEventListener('pointerup', this.onPeekEnd);
      this.peekTarget?.removeEventListener('pointercancel', this.onPeekEnd);
    }
    this.subscribed = false;
    this.pointerInputActive = false;
    this.keys.clear();
    this.leftPointers.clear();
    this.rightPointers.clear();
    this.peekPointers.clear();
    this.updateState();
  }

  private readonly onKeyDown = (event: Event): void => {
    const key = normaliseKey((event as KeyLikeEvent).key);
    if (key) this.keys.add(key);
    this.updateState();
  };

  private readonly onKeyUp = (event: Event): void => {
    const key = normaliseKey((event as KeyLikeEvent).key);
    if (key) this.keys.delete(key);
    this.updateState();
  };

  private readonly onPointerDown = (event: Event): void => {
    const pointer = event as PointerLikeEvent;
    this.pointerInputActive = true;
    if (this.touchScheme === 'left-right') {
      if (pointer.clientX < this.splitX)
        this.leftPointers.set(pointer.pointerId, { startX: pointer.clientX, direction: -1 });
      else this.rightPointers.add(pointer.pointerId);
    } else if (pointer.clientX < this.splitX) {
      this.leftPointers.set(pointer.pointerId, { startX: pointer.clientX, direction: 0 });
    } else {
      this.rightPointers.add(pointer.pointerId);
    }
    this.updateState();
  };

  private readonly onPointerMove = (event: Event): void => {
    if (this.touchScheme !== 'drag-shush') return;
    const pointer = event as PointerLikeEvent;
    const trackedPointer = this.leftPointers.get(pointer.pointerId);
    if (!trackedPointer) return;
    const delta = pointer.clientX - trackedPointer.startX;
    trackedPointer.direction = delta === 0 ? 0 : delta < 0 ? -1 : 1;
    this.updateState();
  };

  private readonly onPointerEnd = (event: Event): void => {
    const pointerId = (event as PointerLikeEvent).pointerId;
    this.leftPointers.delete(pointerId);
    this.rightPointers.delete(pointerId);
    this.pointerInputActive = this.leftPointers.size > 0 || this.rightPointers.size > 0;
    this.updateState();
  };

  private readonly onPeekDown = (event: Event): void => {
    this.peekPointers.add((event as PointerLikeEvent).pointerId);
    this.updateState();
  };

  private readonly onPeekEnd = (event: Event): void => {
    this.peekPointers.delete((event as PointerLikeEvent).pointerId);
    this.updateState();
  };

  private updateState(): void {
    const keyboardSteer = this.keys.has('a') ? -1 : this.keys.has('d') ? 1 : 0;
    const touchSteer = this.touchSteer();
    this.state = {
      steer: keyboardSteer || touchSteer,
      smooth:
        this.keys.has('s') ||
        (this.touchScheme === 'drag-shush' &&
          this.pointerInputActive &&
          this.leftPointers.size === 0),
      shush:
        this.keys.has('space') ||
        (this.touchScheme === 'drag-shush' && this.rightPointers.size > 0),
      peek: this.keys.has('w') || this.peekPointers.size > 0
    };
  }

  private touchSteer(): SteerDirection {
    const directions = [...this.leftPointers.values()].map((pointer) => pointer.direction);
    if (this.touchScheme === 'left-right' && this.rightPointers.size > 0) return 1;
    return directions.find((direction) => direction !== 0) ?? 0;
  }
}

function normaliseKey(key: string): 'a' | 'd' | 's' | 'space' | 'w' | undefined {
  const lower = key.toLowerCase();
  if (lower === ' ' || lower === 'spacebar' || lower === 'space') return 'space';
  return lower === 'a' || lower === 'd' || lower === 's' || lower === 'w' ? lower : undefined;
}
