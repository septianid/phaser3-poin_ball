import Phaser from "phaser";

export class Boot extends Phaser.Scene{

  constructor(){
    super("BootGame");
  }

  preload(){

    this.load.image('loading-background', "./src/assets/background-loading.jpg");

    this.load.on('progress', function (value) {
      console.log(value);
    });

    this.load.on('fileprogress', function (file) {

    });

    this.load.on('complete', () => this.bootComplete());
  }

  bootComplete(){

    this.scene.start("LoadGame");
  }
}
