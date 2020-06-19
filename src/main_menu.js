import Phaser from 'phaser';

var preload;
var challengeGate;
var challengerListSign;
var challengerGuideSign;
var challengerContract;
var musicToggle;
var musicStatus;
var menuSound;
var clickSound;
var closeSound;
var poinPayOption;
var adWatchPayOption;
var availableButton = [];

var location = {}
var userData = {};
var videoProp = {};

navigator.geolocation.getCurrentPosition((xCoord) => {
  location.latitude = xCoord.coords.latitude
  location.longitude = xCoord.coords.longitude
})

var CryptoJS = require('crypto-js');

export class Menu extends Phaser.Scene {

  constructor(){

    super("MainMenu")
  }

  init(data){

    if(musicStatus === undefined){
      musicStatus = true;
    }
    else {
      musicStatus = data.sound_status
    }
    clickSound = this.sound.add('CLICK_SOUND')
    closeSound = this.sound.add('CLOSE_SOUND')
    menuSound = this.sound.add('MENU_SOUND')
    menuSound.loop = true;
    menuSound.play();
  }

  preload(){

  }

  create(){

    this.challengersInfo();

    var background = this.add.sprite(360, 640, 'MENU_BG').setScale(0.67)
    background.setOrigin(0.5, 0.5);

    var title = this.add.sprite(360, 230, 'TITLE').setScale(0.6)
    title.setOrigin(0.5, 0.5);

    var banner = this.add.sprite(360, 80, 'BANNER').setScale(0.4)
    title.setOrigin(0.5, 0.5);

    challengeGate = this.add.sprite(360, 570, 'BM_1P').setScale(0.63);
    challengeGate.setOrigin(0.5, 0.5);
    challengeGate.on('pointerdown', () => this.conditionChecking())

    challengerGuideSign = this.add.sprite(210, 760, 'BM_2I').setScale(0.85);
    challengerGuideSign.setOrigin(0.5,0.5);
    challengerGuideSign.on("pointerdown",() => this.showTheGuidance())

    challengerContract = this.add.sprite(challengerGuideSign.x, challengerGuideSign.y + 100, 'BM_3TC').setScale(0.85);
    challengerContract.setOrigin(0.5,0.5);
    challengerContract.on("pointerdown",() => this.showTheContract())

    challengerListSign = this.add.sprite(500, challengerGuideSign.y, 'BM_4LD').setScale(0.85);
    challengerListSign.setOrigin(0.5,0.5);
    challengerListSign.on("pointerdown",() => this.showChallengersBoard())



    if(musicStatus === true){
      menuSound.setMute(false)
      musicToggle = this.add.sprite(challengerListSign.x,challengerListSign.y + 100, 'BM_5N').setScale(0.85);
      musicToggle.setOrigin(0.5,0.5);
    }
    else{
      menuSound.setMute(true)
      musicToggle = this.add.sprite(challengerListSign.x,challengerListSign.y + 100, 'BM_5F').setScale(0.85);
      musicToggle.setOrigin(0.5,0.5);
    }

    musicToggle.on('pointerdown', () => this.disableMusic());

    this.game.events.on('hidden',function(){
      menuSound.setMute(true);
    },this);

    this.game.events.on('visible', function(){
      menuSound.setMute(false);
    });
  }

  update(){


  }

  conditionChecking(){

    clickSound.play()
    this.disableButtons()
    if(userData.free_chance != 0){
      let timeStart = new Date()
      this.beatTheGame(timeStart, true)
    }
    else {
      this.showPaymentOption(10)
      //availableButton = [poinPayOption, adWatchPayOption, challengerListSign, challengerGuideSign, challengerContract, musicToggle]
      // this.activateButtons();
    }
  }

  showPaymentOption(required){

    let optionBox = this.add.sprite(360, 640, 'PM_PY').setScale(0.55, 0.6);
    optionBox.setOrigin(0.5, 0.5);

    let changeMind = this.add.sprite(480, 460, 'BM_GEXB').setScale(0.4);
    changeMind.setOrigin(0.5, 0.5);
    changeMind.setInteractive();
    changeMind.on('pointerdown', () => {
      closeSound.play()
      poinPayOption.destroy();
      adWatchPayOption.destroy();
      optionBox.destroy();
      changeMind.destroy();
      this.activateButtons()
    })

    poinPayOption = this.add.sprite(360, 580, 'BM_1BPP'+required).setScale(0.4);
    poinPayOption.setOrigin(0.5,0.5);
    poinPayOption.setInteractive();
    poinPayOption.on('pointerdown', () => {
      clickSound.play()
      poinPayOption.disableInteractive()
      adWatchPayOption.disableInteractive()
      changeMind.disableInteractive()
      if(userData.poin < required){
        this.showDisclaimer('DM_PW', 0.6)
      }
      else {
        this.showPayConfirmation('DM_PP'+required, 0.6, changeMind)
      }
    })

    adWatchPayOption = this.add.sprite(360, poinPayOption.y + 170, 'BM_1AAD').setScale(0.4);
    adWatchPayOption.setOrigin(0.5,0.5);
    adWatchPayOption.setInteractive();
    adWatchPayOption.on("pointerdown",() => {
      clickSound.play()
      poinPayOption.disableInteractive()
      adWatchPayOption.disableInteractive()
      changeMind.disableInteractive()
      this.adVideoSource()
    })
  }

  showTheAd(){

    //this.adVideoSource();

    let timerEvent;
    let timer = videoProp.duration
    let advideoTimer
    let adContentEl = document.createElement('video');
    let adHeaderEl = document.createElement('img');
    let adContentDom;
    let adHeaderDom;
    let adHeaderImgDom;

    adContentEl.src = videoProp.main_source;
    adContentEl.playsinline = true;
    adContentEl.width = 720;
    adContentEl.height = 1280;
    adContentEl.autoplay = true;

    adHeaderEl.src = videoProp.head_source;
    adHeaderEl.width = 300;
    adHeaderEl.height = 70;

    menuSound.pause()

    adContentEl.addEventListener('play', (event) => {

      adContentDom = this.add.dom(360, 640, adContentEl, {
        'background-color': 'black'
      });
      adHeaderDom = this.add.dom(360, 360, 'div', {
        'background-color' : videoProp.background_color,
        'width' : '720px',
        'height' : '170px'
      }).setDepth(1);
      adHeaderImgDom = this.add.dom(360, 360, adHeaderEl).setDepth(1);

      advideoTimer = this.add.dom(680, 10, 'p', {
        'font-family' : 'Arial',
        'font-size' : '2.1em',
        'color' : 'white'
      }, '').setDepth(1)

      timerEvent = this.time.addEvent({
        delay: 1000,
        callback: function(){
          timer--
          advideoTimer.setText(timer)

          if(timer === 0){
            advideoTimer.destroy()
            timerEvent.remove(false);
          }
        },
        loop: true
      })

      adContentEl.addEventListener('ended', (event) => {
        menuSound.resume()
        let timeStart = new Date()
        this.beatTheGame(timeStart, false);
      })
    })
  }

  showPayConfirmation(asset, size, etc){

    //this.disableButtons()
    poinPayOption.disableInteractive()
    adWatchPayOption.disableInteractive()

    let confirmationBoard = this.add.sprite(360, 640, asset).setScale(size);
    confirmationBoard.setOrigin(0.5, 0.5)
    confirmationBoard.setDepth(1)

    let confirmChoice = this.add.sprite(250, 810, 'BM_CPP').setScale(0.65);
    confirmChoice.setOrigin(0.5, 0.5);
    confirmChoice.setDepth(1)
    confirmChoice.setInteractive();
    confirmChoice.on('pointerdown', () => {
      clickSound.play()
      this.preloadAnimation(360, 490, 0.4, 8, 'PRE_ANIM3');
      let timeStart;
      timeStart = new Date();
      this.beatTheGame(timeStart, true)
      confirmChoice.disableInteractive();
    });

    let denyChoice = this.add.sprite(475, 810, 'BM_DPP').setScale(0.65);
    denyChoice.setOrigin(0.5, 0.5);
    denyChoice.setDepth(1)
    denyChoice.setInteractive();
    denyChoice.on('pointerdown', () => {
      clickSound.play()
      poinPayOption.setInteractive()
      adWatchPayOption.setInteractive()

      confirmationBoard.destroy();
      confirmChoice.destroy();
      denyChoice.destroy();
      etc.setInteractive();
      //this.activateButtons()
    });
  }

  showDisclaimer(asset, size){

    this.disableButtons()
    clickSound.play()

    let warningPopUp = this.add.sprite(360, 640, asset).setScale(size);
    warningPopUp.setOrigin(0.5, 0.5);
    warningPopUp.setDepth(1);

    if(asset === 'DM_PW'){
      let closeIt = this.add.sprite(570, 510, 'BM_GEXB').setScale(0.5);
      closeIt.setOrigin(0.5, 0.5);
      closeIt.setDepth(1);
      closeIt.setInteractive();
      closeIt.on('pointerdown', () => {
        closeSound.play()
        warningPopUp.destroy();
        closeIt.destroy();
        this.activateButtons();
      });
    }
  }

  showChallengersBoard(){

    clickSound.play()

    this.disableButtons();
    let idHigh = [];
    let idCum = [];
    let scoreHigh = [];
    let scoreCum = [];
    let rankHSData = {};
    let rankTSData = {};

    let urlParams = new URLSearchParams(window.location.search);
    let userSession = urlParams.get('session');

    var bestChallengerBoard = this.add.sprite(360, 580, 'PM_3LD').setScale(0.65);
    bestChallengerBoard.setOrigin(0.5,0.5);

    var imDone =  this.add.sprite(bestChallengerBoard.x + 250, bestChallengerBoard.y - 370, 'BM_GEXB').setScale(0.5);
    imDone.disableInteractive();
    imDone.setOrigin(0.5,0.5);

    this.challengerListing(idHigh, idCum, scoreHigh, scoreCum);
    this.challengerMilestone(userSession, rankHSData, rankTSData, imDone);

    imDone.on('pointerdown',() => {
      closeSound.play()
      idHigh.forEach((hText) => {
        hText.destroy()
      })
      idCum.forEach((cText) => {
        cText.destroy()
      })
      scoreHigh.forEach((hText) => {
        hText.destroy()
      })
      scoreCum.forEach((cText) => {
        cText.destroy()
      })
      for(let key in rankHSData){
        rankHSData[key].destroy()
      }
      for(let key in rankTSData){
        rankTSData[key].destroy()
      }
      bestChallengerBoard.destroy();
      imDone.destroy();
      this.activateButtons();
    })
  }

  showTheGuidance(){
    clickSound.play()
    this.disableButtons();
    // var contentText = [
    //   '1.\nTap layar untuk menjatuhkan box\n',
    //   '2.\nSusun box di area permainan untuk mendapatkan skor, box yang jatuh di luar area permainan tidak mendapatkan skor\n',
    //   '3.\nPerhitungan skor dilakukan setelah permainan selesai pada detik ke-30\n',
    //   '4.\nSetiap box pada susunan tingkat pertama akan mendapatkan 1 (satu) poin, Setiap box pada susunan tingkat kedua akan mendapatkan 2 (dua) poin, dan berlaku seterusnya'
    // ]

    var guidanceBoard = this.add.sprite(360, 640, 'PM_1I').setScale(0.65);
    guidanceBoard.setOrigin(0.5,0.5);

    var imDone =  this.add.sprite(guidanceBoard.x + 250, guidanceBoard.y - 370, 'BM_GEXB').setScale(0.5);
    imDone.setInteractive();
    imDone.setOrigin(0.5,0.5);

    // var guideText = this.add.text(360, 620, contentText, {
    //
    //   font: '26px HelveticaRoundedLTStd',
    //   fill: '#84446D',
    //   align: 'center',
    //   wordWrap: {
    //     width: 490
    //   }
    // }).setOrigin(0.5, 0.5)

    imDone.on('pointerdown',() => {
      closeSound.play()
      guidanceBoard.destroy();
      //guideText.destroy();
      imDone.destroy();
      this.activateButtons();
    })
  }

  showTheContract(){
    clickSound.play()
    this.disableButtons();

    let page1 = [
      "1. Pemain akan mendapatkan 3 (tiga)",
      "    kali token gratis untuk bermain",
      "    setiap harinya (selama periode",
      "    event berlangsung)",
      "2. Pemain yang ingin bermain lebih",
      "    dari 3x per hari akan diwajibkan",
      "    melihat tayangan iklan atau",
      "    dapat menukarkan 10 poin dari",
      "    LINIPOIN",
      "3. Pemain yang berhasil meletakkan",
      "    kotak pada tempat yg disediakan",
      "    akan mendapatkan poin berdasarkan" ,
      "    tingkatan tumpukan kotak",
      "4. Poin yang didapat dari setiap akhir",
      "    permainan akan langsung",
      "    ditambahkan ke akumulasi poin",
      "    pada LINIPOIN anda masing-masing.",
      "5. Jika ada pertanyaan lebih lanjut",
      "    silahkan ajukan ke Pusat Bantuan,",
      "    DM via Instagram @linipoin.id atau",
      "    email ke info@linipoin.com"
    ]
    let page2 = [

    ]

    let tncContent = [page1, page2]
    let selector = 0

    var contractBoard = this.add.sprite(360,640, 'PM_2TC').setScale(0.65);
    contractBoard.setOrigin(0.5, 0.5);

    let text = this.add.text(370, 670, tncContent[selector], {
      font: 'bold 21px Arial',
      color: 'white',
      align: 'left',
      wordWrap: {
        width: 440
      }
    }).setOrigin(0.5, 0.5);

    // let nextPage = this.add.sprite(470, 1010, 'BM_NEXT').setScale(0.12)
    // nextPage.setOrigin(0.5, 0.5);
    // nextPage.setInteractive()
    // nextPage.on('pointerdown', () => {
    //   if(selector >= tncContent.length - 1){
    //     selector = tncContent.length - 1
    //   }
    //   else {
    //     selector += 1
    //     clickSound.play()
    //   }
    //   text.setText(tncContent[selector]);
    // })
    //
    // let prevPage = this.add.sprite(250, 1010, 'BM_PREV').setScale(0.12)
    // prevPage.setOrigin(0.5, 0.5);
    // prevPage.setInteractive()
    // prevPage.on('pointerdown', () => {
    //   if(selector <= 0){
    //     selector = 0
    //   }
    //   else {
    //     clickSound.play()
    //     selector -= 1
    //   }
    //   text.setText(tncContent[selector]);
    // })

    var imDone =  this.add.sprite(contractBoard.x + 250, contractBoard.y - 370, 'BM_GEXB').setScale(0.5);
    imDone.setInteractive();
    imDone.setOrigin(0.5,0.5);

    imDone.on('pointerdown',() => {
      closeSound.play()
      contractBoard.destroy();
      text.destroy();
      // nextPage.destroy();
      // prevPage.destroy();
      imDone.destroy();
      this.activateButtons();
    })
  }

  preloadAnimation(xPos, yPos, size, maxFrame, assetKey){

    preload = this.add.sprite(xPos, yPos, assetKey).setOrigin(0.5 ,0.5);
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

  disableMusic(){
    clickSound.play()
    if(musicStatus == true){
      menuSound.setMute(true)
      musicStatus = false;
      musicToggle.setTexture('BM_5F');
      musicToggle.setScale(0.85);
    }
    else{
      menuSound.setMute(false);
      musicStatus = true;
      musicToggle.setTexture('BM_5N');
      musicToggle.setScale(0.85);
    }
  }

  disableButtons(){
    availableButton.forEach((button) => {
      button.disableInteractive()
    })
  }

  activateButtons(){
    availableButton.forEach((button) => {
      button.setInteractive()
    })
  }

  beatTheGame(begin, isPoinPay){

    let urlParams = new URLSearchParams(window.location.search);
    let userSession = urlParams.get('session');
    let requestID = CryptoJS.AES.encrypt('LG'+'+66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43+'+Date.now(), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
    let dataID;
    let data = {
      linigame_platform_token: '66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43',
      session: userSession,
      game_start: begin,
      score: 0,
      user_highscore: 0,
      total_score: 0,
    }
    let datas

    if(isPoinPay === true){
      data.play_video = 'not_played'
      //console.log(data);
      datas = {
        datas: CryptoJS.AES.encrypt(JSON.stringify(data), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
      }
    }
    else {
      data.play_video = 'full_played'
      //console.log(data);
      datas = {
        datas: CryptoJS.AES.encrypt(JSON.stringify(data), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
      }
    }

    fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/", {
    //fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/", {
    //fetch("https://fb746e70.ngrok.io/api/v1.0/leaderboard/stacko?lang=id", {

      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'request-id' : requestID
      },
      body: JSON.stringify(datas)
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }

    }).then(data => {

      //console.log(data.result);
      dataID = data.result.id
      if(dataID !== undefined){
        this.scene.start("PlayGame", {
          session: userSession,
          id: dataID,
          sound_status: musicStatus,
          game_score: userData.rule_score
        });
      }

    }).catch(error => {

      //console.log(error.result);
    });
  }

  challengersInfo(){

    this.preloadAnimation(360, 410, 0.6, 19, 'PRE_ANIM1');
    this.disableButtons();

    let urlParams = new URLSearchParams(window.location.search);
    let userSession = urlParams.get('session');

    let data = {
      datas : CryptoJS.AES.encrypt(JSON.stringify({
        lat: location.latitude,
        long: location.longitude,
        session: userSession,
        linigame_platform_token: '66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43'
      }), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
    }

    fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/check_user_limit/", {
    //fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/check_user_limit/", {
    //fetch("https://fb746e70.ngrok.io/api/v1.0/leaderboard/check_user_limit/", {

      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }

    }).then(data => {
      //console.log(data.result);
      if(data.result.isEmailVerif === true){
        userData = {
          rule_score: data.result.gamePoin,
          free_chance : data.result.lifePlay,
          poin: data.result.userPoin,
          phone: '0' + data.result.phone_number.substring(3),
          email: data.result.email,
          date_birth: data.result.dob,
          gender: data.result.gender === 'm' ? 'male' : 'female'
        }
        //this.conditionChecking();
        let startPos = 290
        for(let i = 1; i <= userData.free_chance; i++){
          if(i == 1){
            startPos += 0;
          }
          else {
            startPos += 70;
          }
          let life = this.add.image(startPos, 410, 'LIFE').setScale(0.17);
          life.setOrigin(0.5, 0.5);
        }
        availableButton = [challengeGate, challengerListSign, challengerGuideSign, challengerContract, musicToggle]
        preload.destroy();
        this.activateButtons();
      }
      else {
        this.showDisclaimer('WM_EVW', 0.3)
      }

    }).catch(error => {

      //console.log(error);
      this.showDisclaimer('WM_SE', 0.6)
    });
  }

  challengerListing(hID, cID, hSC, cSC){

    let startPosH = 350
    let startPosC = 645
    this.preloadAnimation(360, 690, 0.6, 22, 'PRE_ANIM2');

    fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/leaderboard_imlek?limit_highscore=5&limit_total_score=5&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43", {
    //fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/leaderboard_imlek?limit_highscore=5&limit_total_score=5&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43", {

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
      for (let i in data.result.highscore_leaderboard){
        let uNameHi = data.result.highscore_leaderboard[i]["user.name"] !== null ? data.result.highscore_leaderboard[i]["user.name"]: 'No Name';

        if(i == 0){
          startPosH += 0
        }
        else {
          startPosH += 44
        }

        let shortHID = uNameHi.length > 16 ? uNameHi.substring(0, 16)+'...' : uNameHi
        hID[i] = this.add.text(185, startPosH, ''+shortHID, {
          font: 'bold 23px Arial',
          fill: 'white',
          align: 'left'
        }).setOrigin(0, 0.5);

        hSC[i] = this.add.text(550, startPosH, ''+data.result.highscore_leaderboard[i].user_highscore, {
          font: 'bold 23px Arial',
          fill: 'white',
          align: 'right'
        }).setOrigin(1, 0.5);
      }

      for(let i in data.result.totalscore_leaderboard){
        let uNameCum = data.result.totalscore_leaderboard[i]["user.name"] !== null ? data.result.totalscore_leaderboard[i]["user.name"]: 'No Name';

        if(i == 0){
          startPosC += 0
        }
        else {
          startPosC += 44
        }

        let shortCID = uNameCum.length > 16 ? uNameCum.substring(0, 16)+'...' : uNameCum
        cID[i] = this.add.text(185, startPosC, ''+shortCID, {
          font: 'bold 23px Arial',
          fill: 'white',
          align: 'left'
        }).setOrigin(0, 0.5);

        cSC[i] = this.add.text(550, startPosC, ''+data.result.totalscore_leaderboard[i].total_score, {
          font: 'bold 23px Arial',
          fill: 'white',
          align: 'left'
        }).setOrigin(1, 0.5);
      }

    }).catch(error => {

      //console.log(error.result);
    });
  }

  challengerMilestone(sess, rHData, rTData, leave){

    let rankPosConfig = {
      high_score: {
        x: 160,
        y: 940
      },
      total_score: {
        x: 160,
        y: 977,
      }
    }

    fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/get_user_rank_imlek/?session="+sess+"&limit=5&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43", {
    //fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/get_user_rank_imlek/?session="+sess+"&limit=5&linigame_platform_token=66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43", {
    //fetch("https://fb746e70.ngrok.io/api/v1.0/leaderboard/check_user_limit/", {

      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }

    }).then(data => {

      //console.log(data.result);
      if(data.result.rank_high_score === 0){
        rHData.rank = this.add.text(rankPosConfig.high_score.x, rankPosConfig.high_score.y, '-', {
          font: 'bold 28px Arial',
          fill: 'white',
          align: 'left'
        }).setOrigin(0, 0.5)
        rHData.score = this.add.text(rankPosConfig.high_score.x + 390, rankPosConfig.high_score.y, '0', {
          font: 'bold 25px Arial',
          fill: 'white',
          align: 'right'
        }).setOrigin(1, 0.5)
      }
      else {
        rHData.rank = this.add.text(rankPosConfig.high_score.x, rankPosConfig.high_score.y, '# '+data.result.rank_high_score.ranking, {
          font: 'bold 24px Arial',
          fill: 'white',
          align: 'left'
        }).setOrigin(0, 0.5)
        rHData.score = this.add.text(rankPosConfig.high_score.x + 390, rankPosConfig.high_score.y, ''+data.result.rank_high_score.user_highscore, {
          font: 'bold 25px Arial',
          fill: 'white',
          align: 'right'
        }).setOrigin(1, 0.5)
      }

      if(data.result.rank_total_score === 0){
        rTData.rank = this.add.text(rankPosConfig.total_score.x, rankPosConfig.total_score.y, '-', {
          font: 'bold 28px Arial',
          fill: 'white',
          align: 'left'
        }).setOrigin(0, 0.5)
        rTData.score = this.add.text(rankPosConfig.total_score.x + 390, rankPosConfig.total_score.y, '0', {
          font: 'bold 25px Arial',
          fill: 'white',
          align: 'right'
        }).setOrigin(1, 0.5)
      }
      else {
        rTData.rank = this.add.text(rankPosConfig.total_score.x, rankPosConfig.total_score.y, '# '+data.result.rank_total_score.ranking, {
          font: 'bold 24px Arial',
          fill: 'white',
          align: 'left'
        }).setOrigin(0, 0.5)
        rTData.score = this.add.text(rankPosConfig.total_score.x + 390, rankPosConfig.total_score.y, ''+data.result.rank_total_score.total_score, {
          font: 'bold 25px Arial',
          fill: 'white',
          align: 'right'
        }).setOrigin(1, 0.5)
      }

      leave.setInteractive()
      preload.destroy();
    }).catch(error => {

      //console.log(error);
    });
  }

  adVideoSource(){

    this.connectToSource();

    this.showDisclaimer('DM_ADL', 0.8)
    this.preloadAnimation(360, 680, 0.8, 8, 'PRE_ANIM3');
    //this.disableButtons()

    fetch('https://captive.macroad.co.id/api/v2/linigames/advertisement?email='+userData.email+'&dob='+userData.date_birth+'&gender='+userData.gender+'&phone_number='+userData.phone,{
    //fetch('https://captive-dev.macroad.co.id/api/v2/linigames/advertisement?email='+userData.email+'&dob='+userData.date_birth+'&gender='+userData.gender+'&phone_number='+userData.phone,{

      method:'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }
    }).then(data => {

      //console.log(data.result);
      videoProp = {
        main_source: data.result.main_source,
        head_source: data.result.header_source,
        duration: data.result.duration,
        background_color: data.result.header_bg_color
      }

      this.showTheAd();
    }).catch(error => {

      console.error(error);
    })
  }

  connectToSource(){

    fetch('https://captive.macroad.co.id/api/v2/linigames/advertisement/connect/53?game_title=poin_ball&email='+userData.email+'&dob='+userData.date_birth+'&gender='+userData.gender+'&phone_number='+userData.phone,{
    //fetch('https://captive-dev.macroad.co.id/api/v2/linigames/advertisement/connect/53?game_title=poin_ball&email='+userData.email+'&dob='+userData.date_birth+'&gender='+userData.gender+'&phone_number='+userData.phone,{

      method:'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }
    }).then(data => {

      //console.log(data.result);
    }).catch(error => {
      console.error(error);
    })
  }
}
