import Phaser from "phaser";

var background_menu;
var title;
var banner;

var listOfButton = []
var playButton;
var hintButton;
var leaderButton;
var tncButton;
var closeButton;
var musicButton;
var okButton;
var detailButton;
let payPoinButton;
let watchAdButton;
var preload;

var clickSFX;
var closeSFX;
var bgSound;

var errorPanel;
var detailPanel;
var leaderboardPanel;
var hintPanel;
var tncPanel;
var noPoinWarnPanel;
var limitWarnPanel;

var idTextArr = [];
var scoreTextArr = [];
var idCumTextArr = [];
var scoreCumTextArr = [];
var lifeRemaining = [];
var playLimitText;
var userRankText;
var userCumRankText;
var userHighScoreText;
var userCumHighScoreText;
var videoTimer;
var advideoTimer;
var videoTimerEvent

var tempLimit;
var tempScore;
var playerStatus;
var tempUserPoin;
var tempID;
var userEmail;
var userGender;
var userDOB;
var userPhone;
var userPlayTime;

var startTime;

var graphics;
var text;
var zone;
var mask;
let nextButton;
let prevButton;

var musicStatus;
var detailStatus;

var urlParams = new URLSearchParams(window.location.search);
var myParam = urlParams.get('session');

export class Mainmenu extends Phaser.Scene {

  constructor() {

    super('Menu');
  }

  preload(){

    bgSound = this.sound.add('music_menu');
  }

  create(){

    clickSFX = this.sound.add('button_click');
    closeSFX = this.sound.add('close_section');

    //bgSound.play();
    bgSound.loop = true;
    musicStatus = true;

    this.game.events.on('hidden',function(){
      bgSound.pause();
    });

    this.game.events.on('visible', function(){
      bgSound.resume();
    })

    background_menu = this.add.sprite(360, 640, 'menu-background');
    background_menu.scaleX = 0.67;
    background_menu.scaleY = 0.67;
    background_menu.setOrigin(0.5, 0.5);

    title = this.add.sprite(360, 350, 'game-title').setScale(.6);
    title.setOrigin(0.5, 0.5);

    //banner = this.add.sprite(360, 100, 'linipoin-banner').setScale(.5);
    //banner.setOrigin(0.5, 0.5);

    this.getUserData();

    hintButton = this.add.image(230, 870, 'hint_button').setScale(0.65);
    hintButton.setOrigin(0.5, 0.5);
    hintButton.on('pointerdown', () => this.showHint());

    leaderButton = this.add.sprite(hintButton.x, hintButton.y + 110, 'leaderboard_button').setScale(0.65);
    leaderButton.setOrigin(0.5, 0.5);
    leaderButton.on('pointerdown', () => this.showLeaderboard());

    tncButton = this.add.sprite(500, hintButton.y, 'tnc_button').setScale(0.65);
    tncButton.setOrigin(0.5, 0.5);
    tncButton.on('pointerdown', () => this.showTnC());

    // musicButton = this.add.sprite(tncButton.x, leaderButton.y, 'music_button on').setScale(0.65);
    // musicButton.setOrigin(0.5, 0.5);
    if(musicStatus == true){

      bgSound.play();
      musicButton = this.add.sprite(tncButton.x, leaderButton.y, 'music_button_on').setScale(0.65);
      musicButton.setOrigin(0.5, 0.5);
    }
    else {

      bgSound.resume();
      musicButton = this.add.sprite(tncButton.x, leaderButton.y, 'music_button_off').setScale(0.65);
      musicButton.setOrigin(0.5, 0.5);
    }

    //musicButton.setInteractive();
    musicButton.on('pointerdown', () => this.toggleSound());
  }

  update(){


  }

  toggleSound(){

    clickSFX.play()
    if(musicStatus == true){
      musicStatus = false;
      musicButton.setTexture('music_button_off').setScale(0.65);
      bgSound.pause();
    }
    else {
      musicStatus = true;
      musicButton.setTexture('music_button_on').setScale(0.65);
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

  enableMainButton(buttonList){

    buttonList.forEach(button => {
      button.setInteractive()
    })
  }

  disableMainButton(buttonList){

    buttonList.forEach(button => {
      button.disableInteractive()
    })
  }

  startGame(){

    this.disableMainButton(listOfButton);

    clickSFX.play();

    if(playerStatus == true){

      this.showWarningPanel('limit-warn-panel', 0.8)
    }
    else {

      playButton.disableInteractive();
      startTime = new Date();
      this.postDataOnStart(startTime, myParam, false);
    }
  }

  showPlayOptionButton(buttonAsset, poinRequired){

    payPoinButton = this.add.sprite(250, 650, buttonAsset).setScale(0.3)
    payPoinButton.setOrigin(0.5, 0.5);
    payPoinButton.setInteractive();
    payPoinButton.on('pointerdown', () => {

      this.disableMainButton(listOfButton)
      if (tempUserPoin < poinRequired) {
        this.showWarningPanel('poin-warn-panel', 0.8);
      }
      else {
        this.showUserConfirmation('confirm-panel-'+poinRequired, 0.8);
      }
    })

    watchAdButton = this.add.sprite(470, 650, 'watch-ad').setScale(0.3);
    watchAdButton.setOrigin(0.5, 0.5);
    watchAdButton.setInteractive();
    watchAdButton.on('pointerdown', () => {

      this.getConnectionStatus();
      this.getAdSource();
    })
  }

  showUserConfirmation(panelAsset, size){

    var agreeButton;
    var disagreeButton;
    var confirmPanel;

    this.disableMainButton(listOfButton);

    confirmPanel = this.add.sprite(360, 690, panelAsset).setScale(size);
    confirmPanel.setOrigin(0.5, 0.5);

    agreeButton = this.add.sprite(250, 840, 'ok_button').setScale(.3);
    agreeButton.setOrigin(0.5, 0.5);
    agreeButton.setInteractive();
    agreeButton.on('pointerdown', () => {

      this.preloadAnimation(530, 0.3, 22, 'preloader_highscore')
      startTime = new Date();
      clickSFX.play();
      agreeButton.disableInteractive();
      disagreeButton.disableInteractive();
      this.postDataOnStart(startTime, myParam, false);
    });

    disagreeButton = this.add.sprite(470, 840, 'no_button').setScale(.3);
    disagreeButton.setOrigin(0.5, 0.5);
    disagreeButton.setInteractive();
    disagreeButton.on('pointerdown', () => {

      closeSFX.play();
      confirmPanel.destroy();
      agreeButton.destroy();
      disagreeButton.destroy();

      this.enableMainButton(listOfButton);
    });
  }

  showWarningPanel(panelAsset, size){

    let warningPanel;

    warningPanel = this.add.sprite(360, 640, panelAsset).setScale(size);
    warningPanel.setOrigin(0.5, 0.5);
    okButton = this.add.sprite(560, 430, 'close_button').setScale(0.7);
    okButton.setOrigin(0.5, 0.5);
    okButton.setInteractive();
    okButton.on('pointerdown', () => {

      closeSFX.play();
      warningPanel.destroy();
      okButton.destroy();
      this.enableMainButton(listOfButton);
    });
  }

  showTnC(){

    let page1;
    let page2;
    let page3;
    let tncContent = [];
    let selector

    page1 = [
      "1. Periode event BISCUIT HOOPER",
      "    berlangsung selama 25 April",
      "    2020 s/d 25 May 2020",
      "2. Pemain akan mendapatkan 3 (tiga)",
      "    kali token gratis untuk bermain",
      "    setiap harinya (selama periode",
      "    event berlangsung)",
      "3. Pemain yang ingin bermain lebih",
      "    dari 3x per hari akan diwajibkan",
      "    melihat tayangan iklan atau",
      "    dapat menukarkan poin dari",
      "    LINIPOIN dengan ketentuan",
      "    sebagai berikut:",
      "     * Permainan ke 4 s/d 10 = 10 poin",
      "     * Permainan ke 11 s/d 20 = 50 poin",
      "     * Permainan ke 21 s/d 30 = 100 poin",
      "     * Permainan ke 31 s/d 40 = 150 poin",
      "     * Permainan ke 41 dst. = 200 poin",
      "4. Pemain yang berhasil memindahkan",
      "    biskuit dari 1 (satu) dinding",
      "    pembatas ke dinding pembatas",
      "    lainnya akan mendapatkan 2 (dua)",
      "    poin, dan berlaku seterusnya.",
    ]
    page2 = [
      "5. Poin yang didapat dari setiap akhir",
      "    permainan akan langsung",
      "    ditambahkan ke akumulasi poin",
      "    pada LINIPOIN anda masing-masing.",
      "6. LINIPOIN dengan dan/atau tanpa",
      "    pemberitahuan sebelumnya berhak",
      "    secara sepihak membatalkan",
      "    pemenang dan pemberian hadiah",
      "    apabila ditemukan adanya indikasi",
      "    apabila ditemukan selama periode",
      "    event yang merugikan pihak",
      "    LINIPOIN termasuk namun tidak",
      "    terbatas pada:",
      "     * Penggunaan lebih dari 1 (satu)",
      "        akun oleh 1 (satu) Customer",
      "        atau kelompok yang sama,",
      "        dan/atau",
      "     * Identitas pemilik akun yang",
      "        sama, dan/atau",
      "     * Nomor handphone yang sama,",
      "        dan/atau",
      "     * Alamat pengiriman yang sama,",
      "        dan/atau",
    ]
    page3 = [
      "     * Nomor rekening/kartu kredit/",
      "        debit/identitas pembayaran",
      "        yang sama, dan/atau",
      "     * Riwayat transaksi yang sama,",
      "        dan/atau",
      "7. Jika ada pertanyaan lebih lanjut",
      "    silahkan ajukan ke Pusat Bantuan,",
      "    DM via Instagram @linipoin.id atau",
      "    email ke info@linipoin.com"
    ]

    tncContent = [page1, page2, page3]
    selector = 0

    clickSFX.play();
    tncPanel = this.add.sprite(360, 640, 'tnc_panel').setScale(1);
    tncPanel.setOrigin(0.5, 0.5);

    graphics = this.make.graphics();

    graphics.fillStyle(0xffffff);
    graphics.fillRect(130, 370, 500, 580);

    mask = new Phaser.Display.Masks.GeometryMask(this, graphics);
    text = this.add.text(140, 370, tncContent[selector], {
      font: '20px ComickBook',
      color: '#606060',
      align: 'left',
      wordWrap: {
        width: 500 } }).setOrigin(0);
    text.setMask(mask);

    zone = this.add.zone(130, 370, 600, 800).setOrigin(0).setInteractive();

    zone.on('pointermove', function (pointer) {

        if (pointer.isDown){

          text.y += (pointer.velocity.y / 6);

          text.y = Phaser.Math.Clamp(text.y, -450, 400);
        }
    });

    nextButton = this.add.sprite(520, 1010, 'next_button').setScale(0.2)
    nextButton.setOrigin(0.5, 0.5);
    nextButton.setInteractive()
    nextButton.on('pointerdown', () => {

      if(selector >= 2){
        selector = 2
      }
      else {
        selector += 1
      }
      text.setText(tncContent[selector]);
    })

    prevButton = this.add.sprite(200, 1010, 'prev_button').setScale(0.2)
    prevButton.setOrigin(0.5, 0.5);
    prevButton.setInteractive()
    prevButton.on('pointerdown', () => {

      if(selector <= 0){
        selector = 0
      }
      else {
        selector -= 1
      }
      text.setText(tncContent[selector]);
    })

    closeButton = this.add.sprite(630, 240, 'close_button').setScale(.7);
    closeButton.setOrigin(0.5, 0.5);
    closeButton.setInteractive();
    closeButton.on('pointerdown', () => this.destroyTnCPanel());
    //tncButton.disableInteractive();
    this.disableMainButton(listOfButton);
  }

  destroyTnCPanel(){

    closeSFX.play();
    tncPanel.destroy();
    closeButton.destroy();
    nextButton.destroy();
    prevButton.destroy();

    text.destroy();
    graphics.destroy();
    mask.destroy();
    zone.destroy();

    tncButton.setInteractive();
    this.enableMainButton(listOfButton);
  }

  showHint(){

    clickSFX.play();

    hintPanel = this.add.sprite(360, 640, 'hint_panel');
    hintPanel.scaleX = 1;
    hintPanel.scaleY = 1;
    hintPanel.setOrigin(0.5, 0.5);

    closeButton = this.add.sprite(630, 240, 'close_button').setScale(.7);
    closeButton.setOrigin(0.5, 0.5);
    closeButton.setInteractive();
    closeButton.on('pointerdown', () => this.destroyHintPanel());
    this.disableMainButton(listOfButton);
  }

  destroyHintPanel(){

    closeSFX.play();
    hintPanel.destroy();
    closeButton.destroy();
    this.enableMainButton(listOfButton);
  }

  showLeaderboard(){

    var startPosId1 = 345;
    var startPosScore1 = startPosId1 + 15;
    var startPosId2 = 640;
    var startPosScore2 = startPosId2 + 15;

    clickSFX.play();
    leaderboardPanel = this.add.sprite(360, 620, 'leaderboard_panel').setScale(1.1);
    leaderboardPanel.setOrigin(0.5, 0.5);

    detailButton = this.add.sprite(580, 210, 'detail_button').setScale(.5);
    detailButton.setOrigin(0.5, 0.5);
    detailButton.setInteractive();
    detailButton.on('pointerdown', () => {

      detailStatus = !detailStatus;
      this.toggleDetail();
    });

    detailButton.visible = false;

    closeButton = this.add.sprite(610, 210, 'close_button').setScale(.7);
    closeButton.setOrigin(0.5, 0.5);
    //closeButton.setInteractive();
    closeButton.on('pointerdown', () => this.destroyLeaderBoardPanel());

    this.getUserRank();
    this.getLeaderboardData(startPosId1, startPosScore1, startPosId2, startPosScore2);
    //this.getCumulativeLeaderboardData(startPosId2, startPosScore2);
    this.disableMainButton(listOfButton);
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

    userRankText.destroy();
    userCumRankText.destroy();
    userHighScoreText.destroy();
    userCumHighScoreText.destroy();
    leaderboardPanel.destroy();
    closeButton.destroy();
    detailButton.destroy();
    this.enableMainButton(listOfButton);
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

  drawHeart(remainingLife){

    let startPos = 300;

    if(remainingLife != 0){

      for(let i = 1; i <= remainingLife; i++){

        if(i == 1){
          startPos -= 0;
        }
        else {
          startPos += 70;
        }
        lifeRemaining = this.add.image(startPos, 590, 'life').setScale(0.6);
        lifeRemaining.setOrigin(0.5, 0.5);
      }

      playButton = this.add.sprite(360, 720, 'play_button').setScale(.7);
      playButton.setOrigin(0.5, 0.5);
      playButton.on('pointerdown', () => this.startGame());
    }

    else {

      if(playerStatus == false){

        //let requiredPoin
        if(userPlayTime >= 10 && userPlayTime < 20){
          //requiredPoin = 50
          this.showPlayOptionButton('pay-poin-50', 50)
        }

        else if(userPlayTime >= 20 && userPlayTime < 30){
          //requiredPoin = 100
          this.showPlayOptionButton('pay-poin-100', 100)
        }

        else if(userPlayTime >= 30 && userPlayTime < 40){
          //requiredPoin = 150
          this.showPlayOptionButton('pay-poin-150', 150)
        }

        else if(userPlayTime >= 40){
          //requiredPoin = 200
          this.showPlayOptionButton('pay-poin-200', 200)
        }

        else{
          //requiredPoin = 10
          this.showPlayOptionButton('pay-poin-10', 10);
        }
      }

    }
  }

  preloadAnimation(yPos, size, maxFrame, assetKey){

    preload = this.add.sprite(360, yPos, assetKey).setOrigin(0.5 ,0.5);
    preload.setScale(size);
    preload.setDepth(1);

    this.anims.create({
      key: assetKey,
      frames: this.anims.generateFrameNumbers(assetKey, {
        start: 1,
        end: maxFrame
      }),
      frameRate: 20,
      repeat: -1
    });

    preload.anims.play(assetKey, true);
  }

  postDataOnStart(start, userSession,isWatchAd){

    let data = {

      linigame_platform_token: '66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43',
      session: userSession,
      score: 0,
      game_start: start,
      user_highscore: 0,
      total_score: 0,
    }

    if(isWatchAd === true){

      data.play_video = 'full_played'
    }
    else {

    }

    //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/",{
    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/",{

      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    }).then(response => response.json()).then(res => {

      tempID = res.result.id;
      //console.log(tempID);
      if(res.result.id >= 0){

        this.scene.start("PlayGame", {
          session: myParam,
          id: tempID,
          score: tempScore,
        });
      }

    }).catch(error => {

      console.log(error.json());
    });
    //console.log(data);
  }

  getUserData(){

    this.preloadAnimation(580, 0.5, 19, 'preloader_menu');

    //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/check_user_limit/?lang=en&session="+myParam+"&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43", {
    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/check_user_limit/?lang=en&session="+myParam+"&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43", {

      method:"GET",

    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }
    }).then(data => {

      //console.log(data.result);
      let phoneNumber = data.result.phone_number;

      if(data.result.isEmailVerif === false){

        let emailPanel = this.add.sprite(360, 640, 'email_verify').setScale(0.8);
        emailPanel.setOrigin(0.5, 0.5);
        emailPanel.setDepth(1);
        preload.destroy()
      }
      else {

        userPlayTime = data.result.play_count;
        userEmail = data.result.email;
        userPhone = '0' + phoneNumber.substring(3);

        if(data.result.gender === 'm'){
          userGender = 'male'
        }
        else {
          userGender = 'female'
        }

        userDOB = data.result.dob;
        tempScore = data.result.gamePoin;
        tempLimit = data.result.lifePlay;
        playerStatus = data.result.isLimit;
        tempUserPoin = data.result.userPoin;

        preload.destroy()
        this.drawHeart(tempLimit);
        //playButton.setInteractive();
        if(data.result.lifePlay != 0){
          listOfButton = [playButton, hintButton, leaderButton, tncButton, musicButton]
        }
        else {
          listOfButton = [payPoinButton, watchAdButton, hintButton, leaderButton, tncButton, musicButton]
        }
        this.enableMainButton(listOfButton);
      }

    }).catch(error => {

      console.log(error);
      preload.destroy();
      errorPanel = this.add.sprite(360, 640, 'error_panel').setScale(0.8);
      errorPanel.setOrigin(0.5, 0.5);
    });
  }

  getUserRank(){

    //fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/get_user_rank/?session="+myParam+"&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43", {
    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/get_user_rank/?session="+myParam+"&limit=5&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43", {

      method:"GET",
    }).then(response => {

      return response.json();
    }).then(data => {

      //console.log(data.result);

      if(data.result.rank_high_score === 0){

        userRankText = this.add.text(185, 930, '-', {
          font: '26px ComickBook',
          fill: '#606060'
        });

        userHighScoreText = this.add.text(510, userRankText.y + 5, '0', {
          font: '24px ComickBook',
          fill: '#606060',
        })
      }

      else{

        userRankText = this.add.text(180, 950, '# '+data.result.rank_high_score.ranking, {
          font: '20px ComickBook',
          fill: '#606060',
          align: 'left'
        });
        userRankText.setOrigin(0, 0.5);

        userHighScoreText = this.add.text(530, userRankText.y, ''+data.result.rank_high_score.user_highscore, {
          font: '22px ComickBook',
          fill: '#606060',
          align: 'right'
        })
        userHighScoreText.setOrigin(1, 0.5);
      }

      if(data.result.rank_total_score === 0){

        userCumRankText = this.add.text(185, 970, '-', {
          font: '26px ComickBook',
          fill: '#606060'
        })

        userCumHighScoreText = this.add.text(510, userCumRankText.y + 5, '0', {
          font: '24px ComickBook',
          fill: '#606060',
        })
      }

      else {

        userCumRankText = this.add.text(180, 990, '# '+data.result.rank_total_score.ranking, {
          font: '20px ComickBook',
          fill: '#606060',
          align: 'left'
        })
        userCumRankText.setOrigin(0, 0.5);

        userCumHighScoreText = this.add.text(530, userCumRankText.y, ''+data.result.rank_total_score.total_score, {
          font: '22px ComickBook',
          fill: '#606060',
          align: 'right'
        })
        userCumHighScoreText.setOrigin(1, 0.5);
      }

      closeButton.setInteractive();
    })
  }

  getLeaderboardData(posId, posScore, posId2, posScore2){

    this.preloadAnimation(650, 0.8, 22, 'preloader_leaderboard')

    //fetch("https://linipoinComickBookmacroad.co.id/api/v1.0/leaderboard/leaderboard_imlek?limit_highscore=5&limit_total_score=5&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43", {
    fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/leaderboard_imlek?limit_highscore=5&limit_total_score=5&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43", {

      method: "GET",
    }).then(response => {

      return response.json();

    }).then(data => {

      //console.log(data.result);
      preload.destroy();
      for(let i=0; i<5; i++){

        if (i == 0){

          posId += 0;
          posScore += 0
        }
        else{

          posId += 37;
          posScore += 37;
        }

        let shortname = '';
        let name = data.result.highscore_leaderboard[i]["user.name"] !== null ? data.result.highscore_leaderboard[i]["user.name"] : 'No Name';

        if(name.length > 25){
          shortname = name.substring(0, 25)+"...";
        }
        else{
          shortname = name;
        }
        idTextArr[i] = this.add.text(210, posId, ''+shortname, {
          font: '20px ComickBook',
          fill: '#606060'
        });

        scoreTextArr[i] = this.add.text(520, posScore, ''+data.result.highscore_leaderboard[i].user_highscore, {
          font: '20px ComickBook',
          fill: '#606060',
          align: 'right'
        });
        scoreTextArr[i].setOrigin(1, 0.5);

        //closeButton.setInteractive();
      }

      for(let i=0; i < 5; i++){

        if(i == 0){

          posId2 += 0;
          posScore2 += 0;
        }
        else {

          posId2 += 37;
          posScore2 += 37;
        }

        let shortname = '';
        let name = data.result.totalscore_leaderboard[i]["user.name"] !== null ? data.result.totalscore_leaderboard[i]["user.name"] : 'No Name';

        if(name.length > 25){
          shortname = name.substring(0, 25)+"...";
        }
        else{
          shortname = name;
        }

        idCumTextArr[i] = this.add.text(210, posId2, ''+shortname, {
          font: '20px ComickBook',
          fill: '#606060'
        });

        scoreCumTextArr[i] = this.add.text(520, posScore2, ''+data.result.totalscore_leaderboard[i].total_score, {
          font: '20px ComickBook',
          fill: '#606060',
          align: 'right'
        });
        scoreCumTextArr[i].setOrigin(1, 0.5);
      }

      if(data.result.highscore_leaderboard.length >= 0 ||data.result.total_score_leaderboard.length >= 0){

        closeButton.setInteractive();
      }

    }).catch(error => {

      //console.log(error);
    });

  }

  getConnectionStatus(){

    //fetch('https://captive-api.macroad.co.id/api/v2/linigames/advertisement/connect/53?email='+userEmail+'&dob='+userDOB+'&gender='+userGender+'&phone_number='+userPhone, {
    fetch('https://captive-dev.macroad.co.id/api/v2/linigames/advertisement/connect/53?email='+userEmail+'&dob='+userDOB+'&gender='+userGender+'&phone_number='+userPhone, {
      method: 'GET',
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }
    }).then(data => {

      //console.log(data.result.message);
    }).catch(error => {

      console.log(error);
    })
  }

  getAdSource(){

    this.disableMainButton(listOfButton);
    //console.log('Tes');

    //fetch('https://captive-api.macroad.co.id/api/v2/linigames/advertisement?email='+userEmail+'&dob='+userDOB+'&gender='+userGender+'&phone_number='+userPhone, {
    fetch('https://captive-dev.macroad.co.id/api/v2/linigames/advertisement?email='+userEmail+'&dob='+userDOB+'&gender='+userGender+'&phone_number='+userPhone, {
      method: "GET",
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }
    }).then(data => {

      //console.log(data.result);
      let video = document.createElement('video');
      let headerImage = document.createElement('img');
      let adVideo;
      let adHeader;
      let adHeaderImg;

      videoTimer = data.result.duration

      video.src = data.result.main_source;
      video.playsinline = true;
      video.width = 720;
      video.height = 1280;
      video.autoplay = true;

      headerImage.src = data.result.header_source;
      headerImage.width = 300;
      headerImage.height = 70;

      video.addEventListener('play', (event) => {

        adHeader = this.add.dom(360, 360, 'div', {
          'background-color' : data.result.header_bg_color,
          'width' : '720px',
          'height' : '170px'
        }).setDepth(1);

        advideoTimer = this.add.dom(360, 840, 'p', {
          'font-family' : 'Arial',
          'font-size' : '1.8em',
          'font-weight' : 'bold',
          'color' : 'white'
        }, '``').setDepth(1);

        adHeaderImg = this.add.dom(360, 360, headerImage).setDepth(1);

        adVideo = this.add.dom(360, 640, video, {
          'background-color': 'black'
        });

        videoTimerEvent = this.time.addEvent({
          delay: 1000,
          callback: this.onPlay,
          loop: true
        })

      })

      video.addEventListener('ended', (event) => {

        this.postDataOnStart(startTime, myParam, true);
      })
    })
  }

  onPlay(){

    videoTimer--
    advideoTimer.setText(videoTimer)
    //console.log(videoTimerText.text);

    if(videoTimer === 0){

      videoTimerEvent.remove(false);
    }
  }

}
