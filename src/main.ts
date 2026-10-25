import { PALETTE } from './art/palette';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { FirstWalkScene } from './scenes/FirstWalkScene';
import './style.css';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 390,
  height: 844,
  backgroundColor: PALETTE.cream,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 390,
    height: 844
  },
  scene: [BootScene, TitleScene, FirstWalkScene]
});

window.__pramPanicGame = game;
