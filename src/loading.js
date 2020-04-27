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
      pack: {
        files: [
          { type: 'image', key: 'background_loading', url: 'src/assets/background-loading.png'},
          { type: 'image', key: 'game-title', url: './src/assets/title.png'}
        ]
      }
    });
  }

  preload(){
    //this.load.image('loading-background', "./src/assets/background-loading.jpg");
    //this.cameras.main.setBackgroundColor('#222E61');
    this.add.image(360, 640, 'background_loading').setScale(0.67);
    this.add.image(360, 350, 'game-title').setScale(.6);
    this.load.image('quit_button', "./src/assets/quit_button.png");
    this.load.image('play_button', "./src/assets/play_button.png");
    this.load.image('hint_button', "./src/assets/hint_button.png");
    this.load.image('error_panel', "./src/assets/error_panel.png");
    this.load.image('leaderboard_button', "./src/assets/leaderboard_button.png");
    this.load.image('music_button_on', "./src/assets/sound_button_on.png");
    this.load.image('music_button_off', "./src/assets/sound_button_off.png");
    this.load.image('menu-background', './src/assets/background-menu.png');
    this.load.image('leaderboard_panel', "./src/assets/leaderboard_panel.png");
    this.load.image('hint_panel', "./src/assets/instruction_panel.png");
    //this.load.image('game-title', "./src/assets/title.png");
    this.load.image('linipoin-banner', "./src/assets/linipoin_banner.png");
    this.load.image('close_button', "./src/assets/close_button.png");
    this.load.image('detail_button', "./src/assets/detail_button.png");
    this.load.image('detail_panel', "./src/assets/detail_panel.png");
    this.load.image('tnc_button', "./src/assets/tnc_button.png");
    this.load.image('tnc_panel', "./src/assets/tnc_panel.png");
    this.load.image('next_button', "./src/assets/next_button.png");
    this.load.image('prev_button', "./src/assets/prev_button.png");
    this.load.image('life', "./src/assets/life.png");
    // this.load.spritesheet('tap_sign', "./src/assets/tap_to_start.png", {
    //   frameWidth: 672,
    //   frameHeight: 228
    // });
    this.load.image('tap_sign', "./src/assets/tap_to_start.png");
    this.load.spritesheet('preloader_menu', "./src/assets/preload_menu.png", {
      frameWidth: 128,
      frameHeight: 60
    });
    this.load.spritesheet('preloader_leaderboard', "./src/assets/preload_leaderboard.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet('preloader_highscore', "./src/assets/preload_game.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.image('ad-confirm-panel', "./src/assets/ad_loading_panel.png");
    this.load.image('confirm-panel-10', "./src/assets/confirm_panel_10.png");
    this.load.image('confirm-panel-50', "./src/assets/confirm_panel_50.png");
    this.load.image('confirm-panel-100', "./src/assets/confirm_panel_100.png");
    this.load.image('confirm-panel-150', "./src/assets/confirm_panel_150.png");
    this.load.image('confirm-panel-200', "./src/assets/confirm_panel_200.png");
    this.load.image('pay-poin-10', "./src/assets/pay_10_button.png");
    this.load.image('pay-poin-50', "./src/assets/pay_50_button.png");
    this.load.image('pay-poin-100', "./src/assets/pay_100_button.png");
    this.load.image('pay-poin-150', "./src/assets/pay_150_button.png");
    this.load.image('pay-poin-200', "./src/assets/pay_200_button.png");
    this.load.image('watch-ad', "./src/assets/watch_ad_button.png");
    this.load.image('ok_button', "./src/assets/ok_button.png");
    this.load.image('no_button', "./src/assets/no_button.png");

    this.load.image('poin-warn-panel', "./src/assets/no_poin_panel.png");
    this.load.image('limit-warn-panel', "./src/assets/play_limit_panel.png");
    this.load.image('email_verify', './src/assets/email_verify.png');
    this.load.image('game_background', "./src/assets/background-game.png");
    this.load.image('ball', "./src/assets/ball.png");
    this.load.image('gameover_panel', "./src/assets/end_panel.png");
    this.load.image('exit_button', "./src/assets/exit_button.png");
    this.load.image('score', "./src/assets/score.png");

    this.load.audio('music_menu', [
      "./src/assets/audio/menu-music.ogg",
      "./src/assets/audio/menu-music.mp3"
    ]);
    this.load.audio('button_click', [
      "./src/assets/audio/button_click.ogg",
      "./src/assets/audio/button_click.mp3"
    ]);
    this.load.audio('close_section', [
      "./src/assets/audio/close_click.ogg",
      "./src/assets/audio/close_click.mp3"
    ]);
    this.load.audio('pop-ball', [
      "./src/assets/audio/ball_pop.ogg",
      "./src/assets/audio/ball_pop.mp3"
    ]);
    this.load.audio('lose-ball', [
      "./src/assets/audio/ball_fail.ogg",
      "./src/assets/audio/ball_fail.mp3"
    ]);

    progressBar = this.add.graphics();
    progressBox = this.add.graphics();
    progressBox.fillStyle(0x9EB6EA, 0.8);
    progressBox.fillRect(200, 640, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '36px monospace',
        fill: '#FFBC00'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
    x: width / 2,
    y: height / 2 + 80,
    text: '0%',
    style: {
        font: '36px monospace',
        fill: '#FFBC00'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
    x: width / 2,
    y: height / 2 + 100,
    text: '',
    style: {
        font: '30px monospace',
        fill: '#FFBC00'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      progressBar.clear();

      percentText.setText(parseInt(value * 100) + '%');
      progressBar.fillStyle(0xFFBC00, 1);
      progressBar.setDepth(1);
      progressBar.fillRect(210, 650, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {

    });

    this.load.on('complete', () => {

      loadingText.destroy();
      progressBox.setDepth(1);
      progressBar.fillStyle(0xFFBC00, 1)
      progressBar.fillRect(210, 650, 300, 30).setDepth(1);

      // title_loading = this.add.sprite(370, 350, 'game-title').setScale(.7);
      // title_loading.setOrigin(0.5, 0.5);

      this.sound.on('decoded',  ()=> {
        console.log('AUDIO BERHASIL DI LOAD CUX');
      });
    });
  }

  create(){


    tapSign = this.add.sprite(360, 900, 'tap_sign').setScale(.6);

    // this.anims.create({
    //   key: 'blink',
    //   frames: this.anims.generateFrameNumbers('tap_sign', {
    //     start: 0,
    //     end: 1
    //   }),
    //   frameRate: 10,
    //   repeat: -1
    // });

    //tapSign.anims.play('blink', true);

    this.input.on("pointerdown", () => {

      this.scene.start("Menu");
      
    })

  }

}
