import Phaser from "phaser";

var progressBar;
var progressBox;
var background_loading;
var title_loading;
var tapSign;

export class Loading extends Phaser.Scene{

  constructor(){
    super({
      key: 'LoadGame',
    });
  }

  preload(){
    this.cameras.main.setBackgroundColor('#222E61');
    this.load.audio('music_menu', "./src/assets/audio/menu-music.ogg");
    //this.load.image('loading-background', "./src/assets/background-loading.jpg");
    this.load.image('quit_button', "./src/assets/quit_button.png");
    this.load.image('play_button', "./src/assets/play_button.png");
    this.load.image('hint_button', "./src/assets/hint_button.png");
    this.load.image('leaderboard_button', "./src/assets/leaderboard_button.png");
    this.load.image('music_button on', "./src/assets/sound_button_on.png");
    this.load.image('music_button off', "./src/assets/sound_button_off.png");
    this.load.image('menu-background', './src/assets/background-menu.png');
    this.load.image('leaderboard_panel', "./src/assets/leaderboard_panel.png");
    this.load.image('hint_panel', "./src/assets/instruction_panel.png");
    this.load.image('game-title', "./src/assets/title.png");
    this.load.image('close_button', "./src/assets/close_button.png");
    this.load.image('detail_button', "./src/assets/detail_button.png");
    this.load.image('detail_panel', "./src/assets/detail_panel.png");
    this.load.image('tnc_button', "./src/assets/tnc_button.png");
    this.load.image('tnc_panel', "./src/assets/tnc_panel.png");
    this.load.image('life', "./src/assets/life.png");
    this.load.spritesheet('tap_sign', "./src/assets/tap_to_start.png", {
      frameWidth: 672,
      frameHeight: 228
    });

    this.load.image('confirm-panel', "./src/assets/confirm_panel.png");
    this.load.image('ok_button', "./src/assets/ok_button.png");
    this.load.image('no_button', "./src/assets/no_button.png");

    this.load.image('poin-warn-panel', "./src/assets/no_poin_panel.png");
    this.load.image('limit-warn-panel', "./src/assets/play_limit_panel.png");

    this.load.image('game_background', "./src/assets/background-game.jpg");
    this.load.image('ball', "./src/assets/ball.png");
    this.load.image('gameover_panel', "./src/assets/end_panel.png");
    this.load.image('exit_button', "./src/assets/exit_button.png");
    this.load.image('score', "./src/assets/score.png");

    this.load.audio('button_click', "./src/assets/audio/button_click.ogg");
    this.load.audio('close_section', "./src/assets/audio/close_click.ogg");
    this.load.audio('pop-ball', "./src/assets/audio/ball_pop.ogg");
    this.load.audio('lose-ball', "./src/assets/audio/ball_fail.ogg");

    progressBar = this.add.graphics();
    progressBox = this.add.graphics();
    progressBox.fillStyle(0xffffff, 0.8);
    progressBox.fillRect(200, 640, 320, 50);

    // background_loading = this.add.image(360, 640, 'loading-background');
    // background_loading.scaleX = 0.68;
    // background_loading.scaleY = 0.68;
    // background_loading.setOrigin(0.5, 0.5);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '36px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
    x: width / 2,
    y: height / 2 + 80,
    text: '0%',
    style: {
        font: '36px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
    x: width / 2,
    y: height / 2 + 100,
    text: '',
    style: {
        font: '30px monospace',
        fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      progressBar.clear();

      percentText.setText(parseInt(value * 100) + '%');
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(210, 650, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {

    });

    this.load.once('complete', () => {
      // this.sound.play('music_menu');
      loadingText.destroy();
      progressBox.setDepth(1);
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(210, 650, 300, 30).setDepth(1);

      title_loading = this.add.sprite(360, 350, 'game-title').setScale(.7);
      title_loading.setOrigin(0.5, 0.5);

      tapSign = this.add.sprite(360, 900, 'tap_sign').setScale(.6);

      this.anims.create({
        key: 'blink',
        frames: this.anims.generateFrameNames('tap_sign', {
          start: 0,
          end: 1
        }),
        frameRate: 10,
        repeat: -1
      });

      tapSign.anims.play('blink', true);


      // tapSign = this.add.text(360, 900, 'TAP TO START', {
      //   font: '42px monospace',
      //   fill: 'white',
      //   align: 'center'
      // }).setOrigin(0.5, 0.5);

      this.input.on("pointerdown", () => {

        this.scene.start("Menu");
      })

      this.sound.on('decoded',  ()=> {
        console.log('AUDIO BERHASIL DI LOAD CUX');
      });
    });
  }

  create(){


    // background_loading = this.add.image(360, 640, 'loading-background');
    // background_loading.scaleX = 0.8;
    // background_loading.scaleY = 0.8;
    // background_loading.setOrigin(0.5, 0.5);
  }

  loadComplete(){

    // background_loading = this.add.image(360, 640, 'loading-background');
    // background_loading.scaleX = 0.8;
    // background_loading.scaleY = 0.8;
    // background_loading.setOrigin(0.5, 0.5);

    // title_loading = this.add.sprite(360, 350, 'game-title').setScale(.7);
    // title_loading.setOrigin(0.5, 0.5);



  }

}
