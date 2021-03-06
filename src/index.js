import Phaser from "phaser";
import {GamePlay} from "./game-page.js";
import {Loading} from './loading.js';
import {Menu} from './main_menu.js';

window.onload = function(){

  //console.log(this.device.os)

  var config;
  var game;
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    //console.log("Windows Phone");

    config = {

      type: Phaser.CANVAS,
      parent: 'game',
      scale:{
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 1280,
      },
      scene:{
        sceneConfig: [Loading, Menu, GamePlay],
        pack:{
          files: {
            type: 'image',
            key: 'background_loading',
            url: './src/assets/background-menu.png'
          }
        }
      },
      audio:{
        disableWebAudio:true,
      }
    };

    game = new Phaser.Game(config);
  }

  if (/android/i.test(userAgent)) {
    //console.log("Android");

    config = {

      type: Phaser.CANVAS,
      parent: 'game',
      dom: {
        createContainer: true
      },
      scale:{
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 1280,
      },
      scene:[Loading, Menu, GamePlay],
      audio:{
        disableWebAudio:true,
      }
    };

    game = new Phaser.Game(config);
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    //console.log("iOS");

    config = {

      type: Phaser.CANVAS,
      parent: 'game',
      scale:{
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 1280,
      },
      scene: [Loading, Menu, GamePlay],
      audio:{
        disableWebAudio:true,
      }
    };

    game = new Phaser.Game(config);
  }

  return "unknown";


  window.focus();

}




//this.game.stage.disableVisibilityChange = true;
