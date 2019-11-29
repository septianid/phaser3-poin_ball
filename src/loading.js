import Phaser from "phaser";

var progress;
var progressFill;

export class Loading extends Phaser.Scene{

  constructor(){
    super("LoadGame");
  }

  preload(){

    this.graphics = this.add.graphics();
		this.newGraphics = this.add.graphics();
		var progress = new Phaser.Geom.Rectangle(160, 700, 400, 20);
		var progressFill = new Phaser.Geom.Rectangle(165, 705, 290, 10);

		this.graphics.fillStyle(0xffffff, 1);
		this.graphics.fillRectShape(progress);

		this.newGraphics.fillStyle(0x3587e2, 1);
		this.newGraphics.fillRectShape(progressFill);


    this.load.on('progress', this.progressBar, {newGraphics:this.newGraphics});
    this.load.on('complete', () => this.completeLoad(), {scene:this.scene});
  }

  create(){

  }


  progressBar(percentage){

    this.newGraphics.clear();
    this.newGraphics.fillStyle(0x3587e2, 1);
    this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(165, 705, percentage*390, 10));

    percentage = percentage * 100;
  }

  completeLoad(){

    this.scene.switch("PlayGame");
  }
}
