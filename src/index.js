import Phaser from "phaser";
import {GamePlay} from "./game-page.js";
import {Boot} from "./boot.js";
import {Loading} from './loading.js';
import {Mainmenu} from './menu.js';

window.onload = function(){

  //console.log(this.device.os)

  const config = {
    // width: "100%",
    // height: "100%",
    type: Phaser.CANVAS,
    parent: 'game',
    scale:{
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 720,
      height: 1280,
    },
    // files: {
    //   type: 'image',
    //   key:'loading-background',
    //   url: 'src/assets/background-loading.jpg'
    // },
    scene: [Loading, Mainmenu, GamePlay],
    audio:{
      disableWebAudio:true,
    }
  };

  let game = new Phaser.Game(config);
  window.focus();
}


//this.game.stage.disableVisibilityChange = true;
