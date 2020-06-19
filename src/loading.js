import Phaser from "phaser";

var progressBar;
var progressBox;
var tapSign;

export class Loading extends Phaser.Scene{

  constructor(){
    super({
      key: 'LoadGame',
      pack: {
        files: [
          { type: 'image', key: 'MENU_BG', url: 'src/assets/MENU_BG.png'},
          { type: 'image', key: 'TITLE', url: './src/assets/TITLE.png'},
          { type: 'image', key: 'BANNER', url: './src/assets/BANNER.png'},
        ]
      }
    });
  }

  preload(){
    //this.cameras.main.setBackgroundColor('#222E61');
    //this.load.image('game-title', "./src/assets/title.png");
    this.add.image(360, 350, 'TITLE').setScale(.6).setDepth(1);
    this.add.image(360, 640, 'MENU_BG').setScale(0.67);
    this.add.sprite(360, 80, 'BANNER').setScale(0.4)
    this.load.image('GAME_BG', "./src/assets/GAME_BG.png");
    this.load.image('BANNER', "./src/assets/BANNER.png");
    this.load.image('BALL', "./src/assets/BALL.png");
    this.load.image('BM_1P', "./src/assets/BM_1P.png");
    this.load.image('BM_2I', "./src/assets/BM_2I.png");
    this.load.image('BM_3TC', "./src/assets/BM_3TC.png");
    this.load.image('BM_4LD', "./src/assets/BM_4LD.png");
    this.load.image('BM_5N', "./src/assets/BM_5N.png");
    this.load.image('BM_5F', "./src/assets/BM_5F.png");
    this.load.image('BM_GEXB', "./src/assets/BM_GEXB.png");
    this.load.image('BM_1AAD', "./src/assets/BM_1AAD.png");
    this.load.image('BM_1BPP10', "./src/assets/BM_1BPP10.png");
    this.load.image('BM_CPP', "./src/assets/BM_CPP.png");
    this.load.image('BM_DPP', "./src/assets/BM_DPP.png");
    this.load.image('BG_EX', "./src/assets/BG_EX.png");
    this.load.image('DM_ADL', "./src/assets/DM_ADL.png");
    this.load.image('PM_1I', "./src/assets/PM_1I.png");
    this.load.image('PM_2TC', "./src/assets/PM_2TC.png");
    this.load.image('PM_3LD', "./src/assets/PM_3LD.png");
    this.load.image('PM_PY', "./src/assets/PM_PY.png");
    this.load.image('PG_END', "./src/assets/PG_END.png");
    this.load.image('PG_SCORE', "./src/assets/PG_SCORE.png");
    this.load.image('LIFE', "./src/assets/LIFE.png");
    this.load.image('DM_PP10', "./src/assets/DM_PP10.png");
    this.load.image('DM_PW', "./src/assets/DM_PW.png");
    this.load.image('WM_SE', "./src/assets/WM_SE.png");
    this.load.image('WM_EVW', './src/assets/WM_EVW.png');
    this.load.image('next_button', "./src/assets/next_button.png");
    this.load.image('prev_button', "./src/assets/prev_button.png");
    this.load.spritesheet('L_ANIM', "./src/assets/L_ANIM.png", {
      frameWidth: 672,
      frameHeight: 228
    });
    this.load.spritesheet('PRE_ANIM1', "./src/assets/PRE_ANIM1.png", {
      frameWidth: 128,
      frameHeight: 60
    });
    this.load.spritesheet('PRE_ANIM2', "./src/assets/PRE_ANIM2.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('PRE_ANIM3', "./src/assets/PRE_ANIM3.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.image('data-required-warn', "./src/assets/data_required_warn.png");
    this.load.audio('MENU_SOUND', [
      "./src/assets/audio/MENU_SOUND.ogg",
      "./src/assets/audio/MENU_SOUND.mp3"
    ]);
    this.load.audio('CLICK_SOUND', [
      "./src/assets/audio/CLICK_SOUND.ogg",
      "./src/assets/audio/CLICK_SOUND.mp3"
    ]);
    this.load.audio('CLOSE_SOUND', [
      "./src/assets/audio/CLOSE_SOUND.ogg",
      "./src/assets/audio/CLOSE_SOUND.mp3"
    ]);
    this.load.audio('POP', [
      "./src/assets/audio/POP_SOUND.ogg",
      "./src/assets/audio/POP_SOUND.mp3"
    ]);
    this.load.audio('FAIL', [
      "./src/assets/audio/FAIL_SOUND.ogg",
      "./src/assets/audio/FAIL_SOUND.mp3"
    ]);

    progressBar = this.add.graphics();
    progressBox = this.add.graphics();
    progressBox.fillStyle(0xFFBC00, 0.8);
    progressBox.fillRect(200, 640, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: 'bold 36px Arial',
        fill: '#222E61'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
    x: width / 2,
    y: height / 2 + 80,
    text: '0%',
    style: {
        font: 'bold 36px Arial',
        fill: '#222E61'
      }
    });
    percentText.setOrigin(0.5, 0.5);
    var assetText = this.make.text({
    x: width / 2,
    y: height / 2 + 100,
    text: '',
    style: {
        font: 'bold 30px Arial',
        fill: '#222E61'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      progressBar.clear();

      percentText.setText(parseInt(value * 100) + '%');
      progressBar.fillStyle(0x222E61, 1);
      progressBar.setDepth(1);
      progressBar.fillRect(210, 650, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {

    });

    this.load.on('complete', () => {

      loadingText.destroy();
      progressBox.setDepth(1);
      progressBar.fillStyle(0x222E61, 1)
      progressBar.fillRect(210, 650, 300, 30).setDepth(1);

      // title_loading = this.add.sprite(370, 350, 'game-title').setScale(.7);
      // title_loading.setOrigin(0.5, 0.5);

      // this.sound.on('decoded',  ()=> {
      //   console.log('AUDIO BERHASIL DI LOAD CUX');
      // });
    });
  }

  create(){
    tapSign = this.add.sprite(360, 900, 'L_ANIM').setScale(0.6);

    this.anims.create({
      key: 'blink',
      frames: this.anims.generateFrameNumbers('L_ANIM', {
        start: 0,
        end: 1
      }),
      frameRate: 10,
      repeat: -1
    });

    tapSign.anims.play('blink', true);

    this.input.on("pointerdown", () => {

      this.scene.start("MainMenu");

    })
  }
}
