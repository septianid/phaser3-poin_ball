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
var detailButton;

var clickSFX;
var closeSFX;
var bgSound;

var errorPanel;
var detailPanel;
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
var tempID;

var startTime;

var graphics;
var text;
var zone;
var mask;
var content;

var musicStatus;
var detailStatus;

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

    // document.addEventListener('focus', function(){
    //   console.log('focus');
    //   bgSound.resume();
    // }, false);

    this.game.events.on('hidden',function(){
      //console.log('Hidden');
      bgSound.pause();
    },this);

    this.game.events.on('visible', function(){

      //console.log('Visible');
      bgSound.resume();
    })


    background_menu = this.add.sprite(360, 640, 'menu-background');
    background_menu.scaleX = 0.34;
    background_menu.scaleY = 0.34;
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
    //musicButton.setInteractive();
    musicButton.on('pointerdown', () => {

      //musicStatus = !musicStatus;
      this.toggleSound();
    });

    tncButton = this.add.sprite(620, 1200, 'tnc_button').setScale(.7);
    tncButton.setOrigin(0.5, 0.5);
    tncButton.on('pointerdown', () => this.showTnC());

    this.toggleSound();
    

    // document.addEventListener('blur', function(){
    //   console.log('blur');
    //   bgSound.pause();
    // }, false);


  }

  update(){


  }

  toggleSound(){

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
    tncButton.setInteractive();
    musicButton.setInteractive();
  }

  disableMainButton(){

    playButton.disableInteractive();
    leaderButton.disableInteractive();
    hintButton.disableInteractive();
    tncButton.disableInteractive();
    musicButton.disableInteractive();
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

      playButton.disableInteractive();
      startTime = new Date();
      this.postDataOnStart(startTime, myParam);
      // this.scene.start("PlayGame", {
      //   session: myParam
      // });
    }
  }

  agreeToPay(){

    startTime = new Date();
    clickSFX.play();
    agreeButton.disableInteractive();
    this.postDataOnStart(startTime, myParam);
    // this.scene.start("PlayGame", {
    //   session: myParam
    // });
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

    content = [
      "1. Periode event LINIGAMES ",
      "    berlangsung pada tanggal 10",
      "    Desember 2019 sampai 31 ",
      "    Desember 2019",
      "2. Kesempatan bermain hanya ",
      "    diberikan gratis sebanyak",
      "    3 (tiga) kali per pengguna",
      "    per hari selama periode event",
      "3. Jika ingin bermain lebih dari 3",
      "    (tiga) kali per hari, maka",
      "    dikenakan pemotongan sebanyak",
      "    10 poin per 1 (satu) kali main",
      "4. Pemenang akan diambil",
      "    berdasarkan ketentuan sebagai",
      "    berikut.",
      "     1. 5 orang dengan skor tertinggi",
      "         selama periode event",
      "     2. 5 orang dengan skor",
      "         akumulasi tertinggi selama",
      "         periode event",
      "5. Pengundian dan pengumuman",
      "    pemenang akan diadakan pada",
      "    tanggal 02 Januari 2020",
      "6. LINIPOIN berhak membatalkan",
      "    seluruh hadiah jika terbukti",
      "    adanya indikasi kecurangan",
      "    dalam bentuk apapun",
      "7. Jika ada pertanyaan lebih lanjut",
      "    silahkan ajukan ke ‘Pusat",
      "    Bantuan’, DM Via Instagram",
      "    @linipoin.id, atau email",
      "    ke info@linipoin.com",
      "8. Selamat bermain LINIGAME",
    ];

    clickSFX.play();
    tncPanel = this.add.sprite(360, 640, 'tnc_panel').setScale(0.35);
    tncPanel.setOrigin(0.5, 0.5);

    graphics = this.make.graphics();

    graphics.fillStyle(0xffffff);
    graphics.fillRect(130, 420, 500, 550);

    mask = new Phaser.Display.Masks.GeometryMask(this, graphics);
    text = this.add.text(140, 420, content, {
      font: '26px Arial',
      color: '#ffffff',
      align: 'left',
      wordWrap: {
        width: 500 } }).setOrigin(0);
    text.setMask(mask);

    zone = this.add.zone(130, 420, 600, 750).setOrigin(0).setInteractive();

    zone.on('pointermove', function (pointer) {

        if (pointer.isDown){

          text.y += (pointer.velocity.y / 6);

          text.y = Phaser.Math.Clamp(text.y, -130, 420);
        }


    });

    closeButton = this.add.sprite(600, 200, 'close_button').setScale(.7);
    closeButton.setOrigin(0.5, 0.5);
    closeButton.setInteractive();
    closeButton.on('pointerdown', () => this.destroyTnCPanel());
    //tncButton.disableInteractive();
    this.disableMainButton();
  }

  destroyTnCPanel(){

    closeSFX.play();
    tncPanel.destroy();
    closeButton.destroy();

    text.destroy();
    graphics.destroy();
    mask.destroy();
    zone.destroy();

    tncButton.setInteractive();
    this.enableMainButton();
  }

  showHint(){

    clickSFX.play();

    hintPanel = this.add.sprite(360, 640, 'hint_panel');
    hintPanel.scaleX = 0.35;
    hintPanel.scaleY = 0.35;
    hintPanel.setOrigin(0.5, 0.5);

    closeButton = this.add.sprite(610, 200, 'close_button').setScale(.7);
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

    var startPosId1 = 415;
    var startPosScore1 = 412;
    var startPosId2 = 729;
    var startPosScore2 = 726;

    clickSFX.play();
    leaderboardPanel = this.add.sprite(360, 620, 'leaderboard_panel').setScale(.7);
    leaderboardPanel.setOrigin(0.5, 0.5);

    detailButton = this.add.sprite(595, 260, 'detail_button').setScale(.5);
    detailButton.setOrigin(0.5, 0.5);
    detailButton.setInteractive();
    detailButton.on('pointerdown', () => {

      detailStatus = !detailStatus;
      this.toggleDetail();
    });

    closeButton = this.add.sprite(600, 160, 'close_button').setScale(.7);
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

      if(((idTextArr[i] === undefined) || (idTextArr[i] === null)) || scoreTextArr[i] === undefined){

      }

      else {

        idTextArr[i].destroy();
        scoreTextArr[i].destroy();
      }

    }

    for(let i = 0; i < 5; i++){

      if(((idCumTextArr[i] === undefined) || (idCumTextArr[i] === null)) || scoreCumTextArr[i] === undefined){


      }
      else {

        idCumTextArr[i].destroy();
        scoreCumTextArr[i].destroy();
      }

    }

    leaderboardPanel.destroy();
    closeButton.destroy();
    detailButton.destroy();
    this.enableMainButton();
  }

  toggleDetail(){

    if (detailStatus == true){

      detailPanel = this.add.sprite(365, 470, 'detail_panel').setScale(.6);
      detailPanel.setOrigin(0.5, 0.5);
      detailPanel.setDepth(1);
      closeButton.disableInteractive();
    }
    else {

      closeButton.setInteractive();
      detailPanel.destroy();
    }
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

    //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/check_user_limit/?lang=en&session="+myParam+"&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43", {
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

      else {

        errorPanel = this.add.sprite(420, 640, 'error_panel').setScale(.3);
        errorPanel.setOrigin(0.5, 0.5);
        console.log(data.result.message);
      }

    }).catch(error => {

      console.log(error);;
    });
  }

  postDataOnStart(start, userSession){

    //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/",{
    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/",{

      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        linigame_platform_token: '66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43',
        session: userSession,
        score: 0,
        game_start: start,
        user_highscore: 0,
        total_score: 0,
      }),
    }).then(response => response.json()).then(res => {

      tempID = res.result.id;
      //console.log(tempID);
      if(res.result.id >= 0){

        this.scene.start("PlayGame", {
          session: myParam,
          id: tempID,
        });
      }

    }).catch(error => {

      console.log(error.json());
    });
  }

  getLeaderboardData(posId, posScore){

    //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard?lang=en&pagination=false&order_by=user_highscore&order_type=desc&show_cumulative_score=true&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43&page=5&row=1&include_user=true&grouping=true", {
    fetch("https://linipoin-dev/api/v1.0/leaderboard?pagination=false&order_by=score&user_id=11&order_type=desc&lang=en&limit=10&include_user=true", {

      method: "GET",
    }).then(response => {

      return response.json();

    }).then(data => {

      if(data.result.rows.length >= 0){

        closeButton.setInteractive();
      }

      for(let i=0; i<5; i++){

        if (i == 0){

          posId += 0;
          posScore += 0
        }
        else{

          posId += 47;
          posScore += 47;
        }

        let shortname = '';
        let name = data.result.rows[i].user !== null ? data.result.rows[i].user.name : 'No Name';

        if(name.length > 25){
          shortname = name.substring(0, 25)+"...";
        }
        else{
          shortname = name;
        }
        idTextArr[i] = this.add.text(190, posId, ''+shortname, {
          font: '20px Arial',
          fill: 'white'
        });

        scoreTextArr[i] = this.add.text(515, posScore, ''+data.result.rows[i].user_highscore, {
          font: 'bold 26px Arial',
          fill: 'white',
          align: 'right'
        });

        //closeButton.setInteractive();
      }

    }).catch(error => {

      console.log(error);
    });

  }

  getCumulativeLeaderboardData(posId2, posScore2){

     //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard?lang=en&pagination=false&order_by=total_score&order_type=desc&show_cumulative_score=true&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43&page=5&row=1&include_user=true&grouping=true", {
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

        let shortname = '';
        let name = data.result.rows[i].user !== null ? data.result.rows[i].user.name : 'No Name';

        if(name.length > 25){
          shortname = name.substring(0, 25)+"...";
        }
        else{
          shortname = name;
        }

        idCumTextArr[i] = this.add.text(190, posId2, ''+shortname, {
          font: '20px Arial',
          fill: 'white'
        });

        scoreCumTextArr[i] = this.add.text(500, posScore2, ''+data.result.rows[i].total_score, {
          font: 'bold 26px Arial',
          fill: 'white',
          align: 'right'
        });
      }
    }).catch(error => {

      console.log(error);
    });
  }

}
