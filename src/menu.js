import Phaser from "phaser";

var background_menu;
var title;

var playButton;
var hintButton;
var leaderButton;
var closeButton;
var musicButton;

var clickSFX;
var closeSFX;
var backsound

var leaderboardPanel;
var hintPanel;

var idTextArr = [];
var scoreTextArr = [];
var idCumTextArr = [];
var scoreCumTextArr = [];
var playLimitText;
var tempLimit;
var playerStatus;

var urlParams = new URLSearchParams(window.location.search);
var myParam = urlParams.get('session');

export class Mainmenu extends Phaser.Scene {

  constructor() {

    super("Menu");
  }

  preload(){

    this.load.image('play_button', "./src/assets/play_button.png");
    this.load.image('hint_button', "./src/assets/hint_button.png");
    this.load.image('leaderboard_button', "./src/assets/leaderboard_button.png");
    this.load.image('music_button', "./src/assets/sound_button_on.png");
    this.load.image('close_button', "./src/assets/close_button.png");
    this.load.image('menu-background', './src/assets/background-menu.png');
    this.load.image('leaderboard_panel', "./src/assets/leaderboard_panel.png");
    this.load.image('hint_panel', "./src/assets/instruction_panel.png");
    this.load.image('game-title', "./src/assets/title.png");

    this.load.audio('music_menu', "./src/assets/audio/menu-music.mp3");
    this.load.audio('button_click', "./src/assets/audio/button_click.mp3");
    this.load.audio('close_section', "./src/assets/audio/close_click.mp3");
  }

  create(){

    console.log(myParam);
    clickSFX = this.sound.add('button_click');
    closeSFX = this.sound.add('close_section');
    backsound = this.sound.add('music_menu');

    background_menu = this.add.sprite(360, 640, 'menu-background');
    background_menu.scaleX = 0.68;
    background_menu.scaleY = 0.68;
    background_menu.setOrigin(0.5, 0.5);

    title = this.add.sprite(360, 350, 'game-title').setScale(.7);
    title.setOrigin(0.5, 0.5);

    this.getUserData();

    playButton = this.add.sprite(357, 650, 'play_button').setScale(.6);
    playButton.setOrigin(0.5, 0.5);
    //playButton.setInteractive();
    playButton.on('pointerdown', () => this.startGame());

    hintButton = this.add.sprite(360, 830, 'hint_button').setScale(.7);
    hintButton.setOrigin(0.5, 0.5);
    hintButton.setInteractive();
    hintButton.on('pointerdown', () => this.showHint());

    leaderButton = this.add.sprite(360, 930, 'leaderboard_button').setScale(.7);
    leaderButton.setOrigin(0.5, 0.5);
    leaderButton.setInteractive();
    leaderButton.on('pointerdown', () => this.showLeaderboard());

    musicButton = this.add.sprite(364, 1030, 'music_button').setScale(.7);
    musicButton.setOrigin(0.5, 0.5);

    backsound.play();
    backsound.loop = true;

  }

  update(){


  }

  startGame(){

    clickSFX.play();

    if(tempLimit == 0){

      console.log("Bayar 10 Poin");
    }
    else {

      this.scene.start("PlayGame", {session: myParam});
    }
  }

  showHint(){

    clickSFX.play();
    hintPanel = this.add.sprite(360, 600, 'hint_panel').setScale(.7);
    hintPanel.setOrigin(0.5, 0.5);

    closeButton = this.add.sprite(620, 140, 'close_button').setScale(.6);
    closeButton.setOrigin(0.5, 0.5);
    closeButton.setInteractive();
    closeButton.on('pointerdown', () => this.destroyHintPanel());
    playButton.disableInteractive();
    hintButton.disableInteractive();
    leaderButton.disableInteractive();
  }

  showLeaderboard(){

    var startPosId1 = 460;
    var startPosScore1 = 448;
    var startPosId2 = 710;
    var startPosScore2 = 700;

    clickSFX.play();
    leaderboardPanel = this.add.sprite(360, 600, 'leaderboard_panel').setScale(.7);
    leaderboardPanel.setOrigin(0.5, 0.5);

    closeButton = this.add.sprite(620, 140, 'close_button').setScale(.6);
    closeButton.setOrigin(0.5, 0.5);
    closeButton.setInteractive();
    closeButton.on('pointerdown', () => this.destroyLeaderBoardPanel());

    this.getLeaderboardData(startPosId1, startPosScore1);
    this.getCumulativeLeaderboardData(startPosId2, startPosScore2);
    playButton.disableInteractive();
    leaderButton.disableInteractive();
    hintButton.disableInteractive();
  }


  getUserData(){

    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/check_user_limit/?lang=en&session="+myParam+"&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43", {

      method:"GET",
    }).then(response => {

      return response.json();
    }).then(data => {

      this.playLimitText = this.add.text(357, 645, data.result.lifePlay+'x', {
        font: 'bold 45px Arial',
        fill: 'white'
      });
      this.playLimitText.setOrigin(0.5, 0.5);
      tempLimit = data.result.lifePlay;
      playerStatus = data.result.isLimit;
      playButton.setInteractive();
    });
  }

  getLeaderboardData(posId, posScore){

    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard?lang=en&pagination=false&order_by=user_highscore&order_type=desc&show_cumulative_score=true&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43&page=5&row=1&include_user=true", {
    //fetch("http://192.168.0.107:7646/api/v1.0/leaderboard?pagination=false&order_by=score&user_id=11&order_type=desc&lang=en&limit=10&include_user=true", {

      method: "GET",
    }).then(response => {

      return response.json();

    }).then(data => {

      console.log(data.result);
      for(let i=0; i<5; i++){

        if (i == 0){

          posId += 0;
          posScore += 0
        }
        else{

          posId += 50;
          posScore += 50;
        }

        idTextArr[i] = this.add.text(190, posId, ''+data.result.rows[i].user.name, {
          font: 'bold 26px Arial',
          fill: '#8f4426'
        });

        scoreTextArr[i] = this.add.text(510, posScore, ''+data.result.rows[i].user_highscore, {
          font: 'bold 40px Arial',
          fill: '#8f4426',
          align: 'right'
        });
      }
    }).catch(error => {

      console.log(error);
    });

  }

  getCumulativeLeaderboardData(posId2, posScore2){

     fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard?lang=en&pagination=false&order_by=total_score&order_type=desc&show_cumulative_score=true&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43&page=5&row=1&include_user=true", {

       method:"GET"
     }).then(response => {

      return response.json();
    }).then(data => {

      for(let i=0; i < 5; i++){

        if(i == 0){

          posId2 += 0;
          posScore2 += 0;
        }
        else {

          posId2 += 50;
          posScore2 += 50;
        }

        idCumTextArr[i] = this.add.text(190, posId2, ''+data.result.rows[i].user.name, {
          font: 'bold 26px Arial',
          fill: '#8f4426'
        });

        scoreCumTextArr[i] = this.add.text(510, posScore2, ''+data.result.rows[i].total_score, {
          font: 'bold 40px Arial',
          fill: '#8f4426',
          align: 'right'
        });
      }
    }).catch(error => {

      console.log(error);
    });
  }

  destroyHintPanel(){

    closeSFX.play();
    hintPanel.destroy();
    closeButton.destroy();
    playButton.setInteractive()
    hintButton.setInteractive();
    leaderButton.setInteractive();
  }

  destroyLeaderBoardPanel(){

    closeSFX.play();
    for(let i = 0; i < 5; i++){

      if(idTextArr[i] === undefined || scoreTextArr[i] === undefined){

      }

      if(idCumTextArr[i] === undefined || scoreCumTextArr[i] === undefined){


      }
      else {

        idTextArr[i].destroy();
        scoreTextArr[i].destroy();
        idCumTextArr[i].destroy();
        scoreCumTextArr[i].destroy();
      }
    }

    leaderboardPanel.destroy();
    closeButton.destroy();
    playButton.setInteractive();
    leaderButton.setInteractive();
    hintButton.setInteractive();
  }
}
