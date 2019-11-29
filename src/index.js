import Phaser from "phaser";
import {GamePlay} from "./game-page.js";
import {Loading} from './loading.js';
import {Mainmenu} from './menu.js';


window.onload = function(){

  const config = {
    type: Phaser.AUTO,
    parent: 'game',
    scale:{
      mode: Phaser.Scale.ENVELOP,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    width: 720,
    height: 1280,
    scene: [Mainmenu, Loading, GamePlay],
    audio:{
      disableWebAudio:true,
    }
  };

  let game = new Phaser.Game(config);
  window.focus();
}
