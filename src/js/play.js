/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
function rand (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// var musicOn = true;


var wKey;
var aKey;
var sKey;
var dKey;
var fishes = [];
var fishesTotal = 10;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {

    this.game.world.setBounds(0, 0 ,1600,1200);
    // this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.space = this.game.add.tileSprite(0,0,1600,1200,'background');

    this.currentSpeed = 0;
    var circSize = 32;
    this.circlebmd = this.game.add.bitmapData(circSize, circSize);
    this.circlebmd.circle(circSize/2,circSize/2,circSize/2,'#FFFFFF');

    this.player = this.game.add.sprite(Game.w/2, Game.h/2, this.circlebmd);
    this.player.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(this.player); 
    this.player.body.collideWorldBounds = true;

    this.game.physics.arcade.setBoundsToWorld(true, true, true, true, false);

    for (var i = 0; i < fishesTotal; i++) {
      var size = rand(0.75,1,2);
      // var size = 0.75;
      fishes.push(new Fish(i, this.game, this.player,size));
    }

    // this.fish = new Fish(0, this.game, this.player); 


    //declare enemy fish

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
    

    //Set Camera to follow Player
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);

    //Setup Arrow Keys
    this.cursors = game.input.keyboard.createCursorKeys();


  },

  update: function() {

    // Controls
    if (this.cursors.left.isDown || aKey.isDown) {
        this.player.angle -= 4.5;
    } else if (this.cursors.right.isDown || dKey.isDown) {
        this.player.angle += 4.5;
    }

    if (this.cursors.up.isDown || wKey.isDown) {
        this.currentSpeed = 550;
    }else if (this.cursors.down.isDown || sKey.isDown) {
      this.currentSpeed = 0; //Drift
    }else {
        if (this.currentSpeed > 0) {
            this.currentSpeed -= 12;
        }
    }

    if (this.currentSpeed > 0) {
        this.game.physics.arcade.velocityFromRotation(this.player.rotation, this.currentSpeed, this.player.body.velocity);
    }

    for(var i = 0; i < fishes.length; i++)
    {
      if (fishes[i].alive) {
        console.log('alive');
        //Add collision Condition
        fishes[i].update();
      }
    }
    // this.fish.update();

    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  // render: function() {
  //   game.debug.text('Health: ' + tri.health, 32, 96);
  // }

};
