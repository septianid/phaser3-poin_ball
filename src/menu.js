import Phaser from "phaser";

var background_menu;
var title;

var playButton;
var hintButton;
var leaderButton;
var tncButton;
var closeButton;
var musicButton;
var musicButtonOff;
var quitButton;
var agreeButton;
var disagreeButton;
var okButton;
var detail_button;

var clickSFX;
var closeSFX;
var bgSound;

var leaderboardPanel;
var hintPanel;
var confirmPanel;
var tncPanel;
var noPoinWarnPanel;
var limitWarnPanel;

var idTextArr = [];
var scoreTextArr = [];
var idCumTextArr = [];
var scoreCumTextArr = [];
var lifeRemaining = [];
var playLimitText;
var tempLimit;
var playerStatus;
var tempUserPoin;

var musicStatus;

var urlParams = new URLSearchParams(window.location.search);
var myParam = urlParams.get('session');

export class Mainmenu extends Phaser.Scene {

  constructor() {

    super("Menu");
  }

  preload(){
    bgSound = this.sound.add('music_menu');
  }

  create(){

    clickSFX = this.sound.add('button_click');
    closeSFX = this.sound.add('close_section');

    bgSound.play();
    bgSound.loop = true;

    background_menu = this.add.sprite(360, 640, 'menu-background');
    background_menu.scaleX = 0.68;
    background_menu.scaleY = 0.68;
    background_menu.setOrigin(0.5, 0.5);

    title = this.add.sprite(360, 350, 'game-title').setScale(.7);
    title.setOrigin(0.5, 0.5);

    this.getUserData();

    playButton = this.add.sprite(357, 650, 'play_button').setScale(.6);
    playButton.setOrigin(0.5, 0.5);
    playButton.on('pointerdown', () => this.startGame());

    hintButton = this.add.image(360, 830, 'hint_button').setScale(.7);
    hintButton.setOrigin(0.5, 0.5);
    hintButton.on('pointerdown', () => this.showHint());

    leaderButton = this.add.sprite(360, 930, 'leaderboard_button').setScale(.7);
    leaderButton.setOrigin(0.5, 0.5);
    leaderButton.on('pointerdown', () => this.showLeaderboard());

    musicButton = this.add.sprite(360, 1030, 'music_button on').setScale(.7);
    musicButton.setOrigin(0.5, 0.5);
    musicButton.setInteractive();
    musicButton.on('pointerdown', () => {
      // musicStatus = !musicStatus;
      this.toogleSound();
    });

    // musicButtonOff = this.add.sprite(360, 1030, 'music_button off').setScale(.7);
    // musicButtonOff.setOrigin(0.5, 0.5);
    // musicButtonOff.setInteractive();
    // musicButtonOff.on('pointerdown', () => {
    //
    //   this.sound.play();
    //   musicButtonOff.visible = false;
    //   musicButton.visible = true;
    // });

    tncButton = this.add.sprite(130, 1230, 'tnc_button').setScale(.7);
    tncButton.setOrigin(0.5, 0.5);
    tncButton.on('pointerdown', () => this.showTnC());

    // quitButton = this.add.sprite(670, 70, 'quit_button').setScale(3);
    // quitButton.setOrigin(0.5, 0.5);
    // quitButton.setInteractive();
    // quitButton.on('pointerdown', () => this.quitGame());

    this.toogleSound();

    document.addEventListener('blur', function(){
      console.log('blur');
      bgSound.pause();
    }, false);

    document.addEventListener('focus', function(){
      console.log('focus');
      if(musicStatus)
      bgSound.resume();
    }, false);
  }

  update(){


  }

  toogleSound(){
    if(musicStatus == true){
      musicStatus = false;
      musicButton.setTexture('music_button off');
      bgSound.pause();
    }
    else {
      musicStatus = true;
      musicButton.setTexture('music_button on')
      bgSound.resume();
    }
  }

  quitGame(){

    // switch(this.getMobileOperatingSystem()){
    //
    //   case 'Android':
    //     urlLink1 = "linipoin://";
    //     window.location.href = urlLink1;
    //     break;
    //   case 'iOS':
    //     urlLink1 = "linipoin://";
    //     window.location.href = urlLink1;
    //     break;
    //   default:
    //     top.location.href = urlLink1;
    //     console.log(urlLink1);
    //     break;
    //   }

    window.open("linipoin://tabs/home");
    //ttes.writeHead(302, { Location: 'linipoin://tabs/home' });
  }

  enableMainButton(){

    playButton.setInteractive();
    leaderButton.setInteractive();
    hintButton.setInteractive();
    tncButton.setInteractive()
  }

  disableMainButton(){

    playButton.disableInteractive();
    leaderButton.disableInteractive();
    hintButton.disableInteractive();
    tncButton.disableInteractive();
  }

  startGame(){

    this.disableMainButton();

    clickSFX.play();

    if(tempLimit == 0 && playerStatus == false){

      if (tempUserPoin < 10) {

        noPoinWarnPanel = this.add.sprite(360, 640, 'poin-warn-panel').setScale(.7);
        noPoinWarnPanel.setOrigin(0.5, 0.5);
        okButton = this.add.sprite(580, 510, 'close_button').setScale(.5);
        okButton.setOrigin(0.5, 0.5);
        okButton.setInteractive();
        okButton.on('pointerdown', () => {

          closeSFX.play();
          noPoinWarnPanel.destroy();
          okButton.destroy();
          this.enableMainButton();
        });
        console.log("Poin tidak mencukupi");
      }
      else {

        confirmPanel = this.add.sprite(360, 640, 'confirm-panel').setScale(.7);
        confirmPanel.setOrigin(0.5, 0.5);

        agreeButton = this.add.sprite(230, 830, 'ok_button').setScale(.7);
        agreeButton.setOrigin(0.5, 0.5);
        agreeButton.setInteractive();
        agreeButton.on('pointerdown', () => this.agreeToPay());

        disagreeButton = this.add.sprite(490, 835, 'no_button').setScale(.7);
        disagreeButton.setOrigin(0.5, 0.5);
        disagreeButton.setInteractive();
        disagreeButton.on('pointerdown', () => this.disagreeToPay());
      }

    }
    else if(playerStatus == true){

      limitWarnPanel = this.add.sprite(360, 640, 'limit-warn-panel').setScale(.7);
      limitWarnPanel.setOrigin(0.5, 0.5);
      okButton = this.add.sprite(580, 510, 'close_button').setScale(.5);
      okButton.setOrigin(0.5, 0.5);
      okButton.setInteractive();
      okButton.on('pointerdown', () => {

        closeSFX.play()
        limitWarnPanel.destroy();
        okButton.destroy();
        this.enableMainButton();
      });
      console.log("Telah mencapai limit harian");
    }
    else {

      this.scene.start("PlayGame", {session: myParam});
    }
  }

  agreeToPay(){

    clickSFX.play();
    this.scene.start("PlayGame", {session: myParam});
    console.log("Bayar 10 Poin");
  }

  disagreeToPay(){

    closeSFX.play();
    confirmPanel.destroy();
    agreeButton.destroy();
    disagreeButton.destroy();

    this.enableMainButton();
  }

  showTnC(){

    clickSFX.play();
    tncPanel = this.add.sprite(360, 640, 'tnc_panel').setScale(.7);
    tncPanel.setOrigin(0.5, 0.5);

    closeButton = this.add.sprite(600, 190, 'close_button').setScale(.7);
    closeButton.setOrigin(0.5, 0.5);
    closeButton.setInteractive();
    closeButton.on('pointerdown', () => this.destroyTnCPanel());
    tncButton.disableInteractive();
    this.disableMainButton();
  }

  destroyTnCPanel(){

    closeSFX.play();
    tncPanel.destroy();
    closeButton.destroy();
    tncButton.setInteractive();
    this.enableMainButton();
  }

  showHint(){

    clickSFX.play();

    hintPanel = this.add.sprite(360, 600, 'hint_panel').setScale(.7);
    hintPanel.setOrigin(0.5, 0.5);

    closeButton = this.add.sprite(620, 140, 'close_button').setScale(.6);
    closeButton.setOrigin(0.5, 0.5);
    closeButton.setInteractive();
    closeButton.on('pointerdown', () => this.destroyHintPanel());
    this.disableMainButton();
  }

  destroyHintPanel(){

    closeSFX.play();
    hintPanel.destroy();
    closeButton.destroy();
    this.enableMainButton();
  }

  showLeaderboard(){

    var startPosId1 = 390;
    var startPosScore1 = 383;
    var startPosId2 = 710;
    var startPosScore2 = 700;

    clickSFX.play();
    leaderboardPanel = this.add.sprite(360, 600, 'leaderboard_panel').setScale(.7);
    leaderboardPanel.setOrigin(0.5, 0.5);

    closeButton = this.add.sprite(600, 150, 'close_button').setScale(.7);
    closeButton.setOrigin(0.5, 0.5);
    //closeButton.setInteractive();
    closeButton.on('pointerdown', () => this.destroyLeaderBoardPanel());

    this.getLeaderboardData(startPosId1, startPosScore1);
    this.getCumulativeLeaderboardData(startPosId2, startPosScore2);
    this.disableMainButton();
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
    this.enableMainButton();
  }

  getMobileOperatingSystem() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) ){

          return 'iOS';
      }
      else if( userAgent.match( /Android/i ) ){

          return 'Android';
      }
      else{

          return 'unknown';
      }
  }

  drawHeart(remainingLife){

    let startPos = 710;

    if(remainingLife != 0){

      for(let i = 1; i <= remainingLife; i++){

        if(i == 1){

          startPos -= 0;
        }
        else {

          startPos -= 60;
        }

        lifeRemaining = this.add.image(210, startPos, 'life').setScale(2);
        lifeRemaining.setOrigin(0.5, 0.5);
      }
    }
  }

  getUserData(){

    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/check_user_limit/?lang=en&session="+myParam+"&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43", {

      method:"GET",
    }).then(response => {

      return response.json();
    }).then(data => {

      if(data.response == 200){

        tempLimit = data.result.lifePlay;
        playerStatus = data.result.isLimit;
        tempUserPoin = data.result.userPoin;
        this.drawHeart(tempLimit);
        this.enableMainButton();
      }

      else if(data.response == 400){

        console.log(data.result.message);
      }

      else if(data.response == 422) {

        console.log(data.result.message);
      }

    }).catch(error => {

      console.log(error);;
    });
  }

  getLeaderboardData(posId, posScore){

    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard?lang=en&pagination=false&order_by=user_highscore&order_type=desc&show_cumulative_score=true&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43&page=5&row=1&include_user=true&grouping=true", {
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

          posId += 47;
          posScore += 47;
        }

        idTextArr[i] = this.add.text(190, posId, ''+data.result.rows[i].user.name, {
          font: 'bold 16px Arial',
          fill: 'white'
        });

        scoreTextArr[i] = this.add.text(510, posScore, ''+data.result.rows[i].user_highscore, {
          font: 'bold 24px Arial',
          fill: 'white',
          align: 'right'
        });

        closeButton.setInteractive();
      }

    }).catch(error => {

      console.log(error);
    });

  }

  getCumulativeLeaderboardData(posId2, posScore2){

     fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard?lang=en&pagination=false&order_by=total_score&order_type=desc&show_cumulative_score=true&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43&page=5&row=1&include_user=true&grouping=true", {

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

          posId2 += 47;
          posScore2 += 47;
        }

        idCumTextArr[i] = this.add.text(190, posId2, ''+data.result.rows[i].user.name, {
          font: 'bold 26px Arial',
          fill: 'white'
        });

        scoreCumTextArr[i] = this.add.text(510, posScore2, ''+data.result.rows[i].total_score, {
          font: 'bold 40px Arial',
          fill: 'white',
          align: 'right'
        });
      }
    }).catch(error => {

      console.log(error);
    });
  }

}
