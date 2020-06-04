import Phaser from "phaser";

var game;
var background_game;
var scoreText;
var scoreSign;
var finalScoreText;
var userHighScore;
var endPanel;
var exitButton;

var popBall;
var collideBall;

var damnIt;
var worthyMeter;
var leaveMeAlone = []
var iSignIt;
var imExist;
var committeeRule;

var CryptoJS = require('crypto-js')
// global object containing all configurable options
var gameOptions = {

  // number of circles used in the game
  numCircles: 4,

  // circle min/max radius, in pixels
  circleRadiusRange: [120, 200],

  // min/max distance between circles, in pixels
  circleDistanceRange: [600, 750],

  // distance from the bottom of the canvas, in pixels
  bottomDistance: 150,

  // min/max circle distance from the center of the canvas, in pixels
  distanceFromCenter: [0, 150],

  // ball speed, in pixels per second
  speed: 1000,

  // possible arc colors
  circleColors: [0xe50e23],

  // arc length, in degrees
  arcLength: [10, 90],

  // amount of arcs on each circle
  arcsOnCircle: 3
}

// window.onbeforeunload = () => {
//
//   return "Do you really want to leave our application?";
// }

window.addEventListener('beforeunload', (e) => {

  e.preventDefault();
  var message = 'Are You Sure?'

  if (typeof e == 'undefined') {
    e = window.event
  }
  if (e) {
    e.returnValue = message
  }

  return message;
})

export class GamePlay extends Phaser.Scene {

  constructor() {
    super("PlayGame");
  }

  init(data){

    imExist = data.session;
    iSignIt = data.id;
    committeeRule = data.score;
  }


  preload() {


  }

  create() {

    damnIt = false;

    this.finalScoreText = '';
    this.userHighScore = '';

    popBall = this.sound.add('pop-ball');
    collideBall = this.sound.add('lose-ball');

    this.worthyMeter = 0;

    background_game = this.add.sprite(360, 640, 'game_background');
    background_game.scaleX = 0.67;
    background_game.scaleY = 0.67;
    background_game.setOrigin(0.5, 0.5);

    scoreSign = this.add.sprite(570, 70, 'score').setScale(.8);
    scoreSign.setOrigin(0.5, 0.5)
    this.scoreText = this.add.text(570, 78, '0', {
      font: '42px Newsflash',
      fill: 'white',
      align: 'center',
    });
    this.scoreText.setOrigin(0.5, 0.5);
    // scoreSign.visible = false;
    // this.scoreText.visible = false;

    // group which will contain the ball, all circles and landing spots
    this.stuffGroup = this.add.group();

    // flag to determine if the player can shoot the ball
    this.canShoot = true;

    // array which will contain all circles
    this.circles = [];

    // array which will contain all landing spots
    this.landingSpots = [];

    // array which will contain all arcs
    this.arcs = [];

    // array which will contain all arc tweens
    this.arcTweens = [];

    // index of the circle currently at the bottom of the canvas
    this.bottomCircle = 0;

    // time to create circles
    for (let i = 0; i < gameOptions.numCircles; i++) {

      // add a graphics object at i-th position of the array
      this.circles[i] = this.add.graphics();

      // add the graphic object to stuffGroup group
      this.stuffGroup.add(this.circles[i]);

      // add a graphics object at i-th position of the array
      this.arcs[i] = this.add.graphics();

      // add the graphic object to stuffGroup group
      this.stuffGroup.add(this.arcs[i]);

      // infinite tween to rotate the arc by 360 degrees in one second
      this.arcTweens[i] = this.tweens.add({
        targets: this.arcs[i],
        angle: 360,
        duration: 1000,
        repeat: -1,
      })

      // add a sprite representing the landing spot at i-th position of the array
      this.landingSpots[i] = this.add.sprite(0, 0, "ball").setScale(0.11);

      // set the landing spot semi-transparent
      this.landingSpots[i].alpha = 0.5;

      // add landing spot to stuffGroup group
      this.stuffGroup.add(this.landingSpots[i]);

      // this method will draw a random circle
      this.paintThatShit(i);
    }

    // the ball! The hero of our game
    this.ball = this.add.sprite(this.circles[0].x, this.circles[0].y, "ball").setScale(0.11);

    // the ball too is added to stuffGroup group
    this.stuffGroup.add(this.ball);

    // wait for player input then call shootBall method
    this.input.on("pointerdown", () => this.blastOffBlyat());

  }

  // method to draw a circle along with its landing area
  paintThatShit(i) {

    // clear the graphic object
    this.circles[i].clear();

    // set graphic line style choosing a random color
    this.circles[i].lineStyle(8, 0xe50e23, 1);

    // define a random radius
    let radius = this.randomOption(gameOptions.circleRadiusRange);

    // save the radius as a custom property
    this.circles[i].radius = radius;

    // place the circle at a random horizontal position
    this.circles[i].x = this.game.config.width / 2 + this.randomOption(gameOptions.distanceFromCenter) * Phaser.Math.RND.sign();

    // if both i and bottomCircle are equal to zero, this means it's the first grapic object we are placing
    if (i == 0 && this.bottomCircle == 0) {

      // so we place it at the bottom of the screen
      this.circles[i].y = this.game.config.height - radius - gameOptions.bottomDistance;
    } else {

      // otherwise we are placing it above the grapic object in the highest position
      this.circles[i].y = this.circles[Phaser.Math.Wrap(i - 1, 0, gameOptions.numCircles)].y - this.randomOption(gameOptions.circleDistanceRange);
    }

    this.arcs[i].x = this.circles[i].x
    this.arcs[i].y = this.circles[i].y

    // time to draw the circle
    this.circles[i].strokeCircle(0, 0, radius);

    // place the landing spot at circle origin
    this.landingSpots[i].x = this.circles[i].x;
    this.landingSpots[i].y = this.circles[i].y;

    // place the arc at circle origin
    this.arcs[i].x = this.circles[i].x
    this.arcs[i].y = this.circles[i].y

    // clear the graphic object
    this.arcs[i].clear();
    this.arcs[i].arcCoords = [];

    // set graphic line style choosing a random color
    this.arcs[i].lineStyle(18, Phaser.Utils.Array.GetRandom(gameOptions.circleColors), 1);

    // drawing arcs
    for (let j = 0; j < gameOptions.arcsOnCircle; j++) {
      this.arcs[i].beginPath();
      let arcStart = Phaser.Math.Between(0, 360)
      let arcEnd = arcStart + this.randomOption(gameOptions.arcLength);
      this.arcs[i].arc(0, 0, radius, Phaser.Math.DegToRad(arcStart), Phaser.Math.DegToRad(arcEnd), false);
      this.arcs[i].strokePath();

      // although arc width has already been set, we save a slighty bigger ark, for collision detection purpose
      this.arcs[i].arcCoords[j] = [arcStart - 8, arcEnd + 8]
    }

    // this is a speed divider to apply to tween duration
    // this way it will range from 1/0.3 to 1/0.5 seconds

    if(this.worthyMeter >= 0 && this.worthyMeter < 24){
      this.arcTweens[i].timeScale = Phaser.Math.RND.realInRange(0.15, 0.28);
      // console.log(this.arcTweens[i].timeScale);
    }

    else if (this.worthyMeter >= 24 && this.worthyMeter < 36){
      this.arcTweens[i].timeScale = Phaser.Math.RND.realInRange(0.35, 0.48);
      // console.log(this.arcTweens[i].timeScale);
    }

    else if(this.worthyMeter >= 36 && this.worthyMeter < 50){
      this.arcTweens[i].timeScale = Phaser.Math.RND.realInRange(0.55, 0.68);
      // console.log(this.arcTweens[i].timeScale);
    }

    else if(this.worthyMeter >= 50 && this.worthyMeter < 80){
      this.arcTweens[i].timeScale = Phaser.Math.RND.realInRange(0.72, 0.85);
      // console.log(this.arcTweens[i].timeScale);
    }

    else {
      this.arcTweens[i].timeScale = Phaser.Math.RND.realInRange(0.86, 0.95);
    }
  }

  // choose a random integer between an option declared in gameOptions object
  randomOption(option) {
    return Phaser.Math.Between(option[0], option[1]);
  }

  // method to shoot the ball
  blastOffBlyat() {

    // if the player can shoot...
    if (this.canShoot) {

      popBall.play();
      // can't shoot anymore at the moment
      this.canShoot = false;

      // define target index, that is the circle at the top of the canvas
      let targetIndex = Phaser.Math.Wrap(this.bottomCircle + 1, 0, gameOptions.numCircles);

      // calculate distance between the two targets
      let distance = Phaser.Math.Distance.Between(this.landingSpots[this.bottomCircle].x, this.landingSpots[this.bottomCircle].y, this.landingSpots[targetIndex].x, this.landingSpots[targetIndex].y);

      // add a tween to the ball to move to the target
      this.ballTween = this.tweens.add({
        targets: this.ball,
        x: this.landingSpots[targetIndex].x,
        y: this.landingSpots[targetIndex].y,

        // duration, in milliseconds, is determined according to distance and speed
        duration: distance * 1000 / gameOptions.speed,
        callbackScope: this,

        // at each update call checkCollision method looking for collision with the circle at the
        // bottom of the screen and the circle immediately above it, the one at the top of the screen
        onUpdate: function() {
          this.didIPunchSomething(this.bottomCircle);
          this.didIPunchSomething(Phaser.Math.Wrap(this.bottomCircle + 1, 0, gameOptions.numCircles));
          if(damnIt === true){

            let deadSecond = new Date();
            this.weHaveTheChampion(deadSecond, imExist);
            this.yourEndIsNear();
          }
        },

        // once the tween is completed
        onComplete: function() {

          // determine the amount of pixels to scroll to make top circle move down to the bottom of the canvas
          let yScroll = this.game.config.height - this.circles[targetIndex].radius - gameOptions.bottomDistance - this.circles[targetIndex].y

          //background_game.tilePositionY += yScroll;

          // add a tween to all stuffGroup children to move them down by yScroll pixels
          this.tweens.add({
            targets: this.stuffGroup.getChildren(),
            props: {
              y: {
                value: "+=" + yScroll
              }
            },
            duration: 250,
            callbackScope: this,
            onComplete: function() {

              // at the end of the tween, save bottomCircle value
              let currentCircle = this.bottomCircle;
              let date = new Date()

              // update bottomCircle value
              this.bottomCircle = Phaser.Math.Wrap(this.bottomCircle + 1, 0, gameOptions.numCircles);

              // redraw the bottom target to be placed at the top
              this.paintThatShit(Phaser.Math.Wrap(currentCircle, 0, gameOptions.numCircles))

              // player can shoot again
              this.canShoot = true;

              this.worthyMeter += committeeRule;

              scoreSign.visible = true;
              this.scoreText.visible = true;
              this.scoreText.text = "" +this.worthyMeter;

              leaveMeAlone.push({

                time: date,
                score: this.worthyMeter
              })
            }
          })
        }
      })
    }
  }

  // method to check collision between the ball and the arcs on the i-th circle
  didIPunchSomething(i) {

    //console.log(i);
    // calculate the distance between the circle and the ball
    let distance = Phaser.Math.Distance.Between(this.circles[i].x, this.circles[i].y, this.ball.x, this.ball.y);

    // if the difference between the distance and the radius is less than ball radius,
    // this means the ball could collide with an arc and we have to investigate
    if (Math.abs(distance - this.circles[i].radius) < this.ball.width / 13) {

      // determine the angle between the ball and the circle
      let angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.circles[i].x, this.circles[i].y, this.ball.x, this.ball.y));

      // looping through all arcs
      this.arcs[i].arcCoords.forEach(function(p) {

        // get arc start and end angle, according to tween rotation
        let arcStart = Phaser.Math.Angle.WrapDegrees(p[0] + this.arcs[i].angle);
        let arcEnd = Phaser.Math.Angle.WrapDegrees(p[1] + this.arcs[i].angle);

        // if the angle between the ball and the circle is between arc start and end angle,
        // we have a collision.
        if (angle >= arcStart && angle <= arcEnd) {

          // stop tweens
          this.ballTween.stop();

          //this.arcTweens[i].stop();
          if(this.arcTweens[i+1] != null){

            this.arcTweens[i].stop();
            this.arcTweens[i+1].stop();
          }
          if(this.arcTweens[i-1] != null){

            this.arcTweens[i].stop();
            this.arcTweens[i-1].stop();
          }

          // shake the camera
          this.cameras.main.shake(500, 0.01);
          collideBall.play();
          damnIt = true;




          // restart the game in two seconds
          this.time.addEvent({
            delay: 500,
            callbackScope: this,
            callback: function() {
              //this.scene.pause("PlayGame")
            }
          });
        }
      }.bind(this))
    }
  }


  yourEndIsNear(){

    //this.getPLayerHighScore();
    endPanel = this.add.sprite(360, 620, 'gameover_panel').setScale(.8);
    endPanel.setOrigin(0.5, 0.5);
    //retryButton = this.add.sprite(230, 810, 'retry_button').setScale(.7);
    exitButton = this.add.sprite(360, 910, 'exit_button').setScale(.45);
    exitButton.setOrigin(0.5, 0.5);

    this.scoreText.visible = false;
    scoreSign.visible = false;

    this.finalScoreText = this.add.text(360, 520, ''+this.worthyMeter, {
      font: '120px Newsflash',
      fill: 'white',
      align: 'center'
    });
    this.finalScoreText.setOrigin(0.5, 0.5);

    exitButton.on('pointerdown', () => this.sayonaraMadafaka());

  }

  sayonaraMadafaka(){

    iSignIt = 0;
    leaveMeAlone = []
    this.scene.start("Menu");
  }

  weHaveTheChampion(over, userSession){

    let preload = this.add.sprite(360, 780, 'preloader_highscore').setOrigin(0.5 ,0.5);
    preload.setScale(0.5);
    preload.setDepth(1);

    this.anims.create({
      key: 'loading_highscore',
      frames: this.anims.generateFrameNumbers('preloader_highscore', {
        start: 1,
        end: 22
      }),
      frameRate: 20,
      repeat: -1
    });

    preload.anims.play('loading_highscore', true);

    let requestID = CryptoJS.AES.encrypt('LG'+'+66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43+'+Date.now(), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
    let final = {

      datas: CryptoJS.AES.encrypt(JSON.stringify({
        linigame_platform_token: '66cfbe9876ff5097bc861dc8b8fce03ccfe3fb43',
        id: iSignIt,
        session: userSession,
        game_end: over,
        score: this.worthyMeter,
        log: leaveMeAlone
      }), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
    }

    fetch("https://linipoin-api.macroad.co.id/api/v1.0/leaderboard/score",{
    //fetch("https://linipoin-dev.macroad.co.id/api/v1.0/leaderboard/score/",{
    //fetch("https://f9c4bb3b.ngrok.io/api/v1.0/leaderboard/score/",{

      method:"PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'request-id' : requestID
      },
      body: JSON.stringify(final)
    }).then(response => response.json()).then(res => {

      //console.log(res.result.user_highscore);
      if(res.result.user_highscore === undefined){

        this.userHighScore = this.add.text(360, 670, '', {
          font: 'bold 62px Arial',
          fill: 'white',
          align: 'center'
        });
        //exitButton.setInteractive();
      }
      else if(res.result.user_highscore !== undefined){

        this.userHighScore = this.add.text(360, 780, ''+res.result.user_highscore, {
          font: '84px Newsflash',
          fill: 'white',
          align: 'center'
        });
        this.userHighScore.setOrigin(0.5, 0.5);
        exitButton.setInteractive();
      }

      preload.destroy();
      this.userHighScore.setOrigin(0.5, 0.5);
      this.userHighScore.setDepth(1);

    }).catch(error => {

      //console.log(error.json());
    });
  }
}
