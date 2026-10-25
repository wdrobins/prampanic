/// <reference types="vite/client" />

import type Phaser from 'phaser';

declare global {
  interface Window {
    __pramPanicGame?: Phaser.Game;
  }
}

export {};
