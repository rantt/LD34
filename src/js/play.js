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
var fishesAlive = 0;
// var fishesTotal = 10;
// var boundedX = 1600;
// var boundedY = 1400;

var boundedX = 1024;
var boundedY = 768;
var level = 1;

var levels = [[0.75],
              [0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75],
              [0.75,1,1,1,1],
              [0.75,0.5,1,1.5],
              [0.75, 0.75, 0.75, 0.75, 0.75, 2, 2],
              [0.5, 0.75, 0.75, 1.25, 1.5,2],
              [0.5,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,4]
              ];
// levels = [[0.5,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,0.75,4]];

var levelNames = ["Oh, it's just you",
                  "Big fish, little pond",
                  "Hey, we're all friend here...",
                  "Where did you come from",
                  "Double Trouble",
                  "Three's a crowd",
                  "Oh, now that's just getting rediculous",
                  "Big Boss Bass",
                  ];
var score = 0;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    
    this.game.world.setBounds(0, 0 ,boundedX,boundedY);
    this.space = this.game.add.tileSprite(0,0,boundedX,boundedY,'background');

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.levelTimer = this.game.time.now;

    this.currentSpeed = 0;
    // Circle Placeholder
    // var circSize = 32;
    // this.circlebmd = this.game.add.bitmapData(circSize, circSize);
    // this.circlebmd.circle(circSize/2,circSize/2,circSize/2,'#FFFFFF');
    // this.player = this.game.add.sprite(Game.w/2, Game.h/2, this.circlebmd);


    this.player = this.game.add.sprite(Game.w/2, Game.h/2, 'fishy');
    this.player.animations.add('swim', [0,1], 10, true);
    
    this.player.anchor.setTo(0.5, 0.5);
    this.player.alive = true;
    this.player.health = 10;
    this.game.physics.arcade.enable(this.player); 

    this.player.body.setSize(40,40);
    // this.player.body.collideWorldBounds = true;

    this.game.physics.arcade.setBoundsToWorld(true, true, true, true, false);

    this.loadLevel(level);

    // // Music
    this.music = this.game.add.sound('music');
    this.music.volume = 0.5;
    this.music.play('',0,1,true);


    this.playerHitSnd = this.game.add.sound('player_hit');
    this.playerHitSnd.volume = 0.2;

    this.mobHitSnd = this.game.add.sound('mob_hit');
    this.mobHitSnd.volume = 0.2;

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

    this.scoreText = this.game.add.bitmapText(Game.w-100, 32, 'minecraftia', 'Score: '+score, 32); 
    this.scoreText.anchor.setTo(0.5, 0.5);

    this.lvlText = this.game.add.bitmapText(32, 32, 'minecraftia', 'Lvl: '+ levelNames[0], 32); 

    // this.lvlText = this.game.add.bitmapText(32, 32, 'minecraftia', 'Lvl: '+ levelNames[0], 32); 
    this.winText = this.game.add.bitmapText(Game.w/2-100, Game.h/2+100, 'minecraftia', 'YOU WIN!', 24); 
    this.winText.anchor.setTo(0.5, 0.5);
    this.winText.visible = false;


  },
  loadLevel: function(lvl) {
    fishes = [];
    this.player.scale.x = 1;
    this.player.scale.y = 1;
    this.player.x = Game.w/2;
    this.player.y = Game.h/2;

    var sizes = levels[lvl-1];
    for (var i=0;i<sizes.length;i++) {
      fishes.push(new Fish(i, this.game, this.player, sizes[i])); 
      fishesAlive += 1;
    }
  },
  update: function() {
 

    if (this.player.alive == true) {  
      // Controls
      if (this.game.input.activePointer.isDown) {
        this.currentSpeed = 500;
        // console.log(this.game.input.activePointer.x +' '+this.player.x);
        if (this.player.y > this.game.input.activePointer.y+20 || this.player.y < this.game.input.activePointer.y-20 || this.player.y > this.game.input.activePointer.y+20 || this.player.y < this.game.input.activePointer.y-20) {
          this.game.physics.arcade.moveToPointer(this.player, this.currentSpeed);
          this.player.rotation = this.game.physics.arcade.angleBetween(this.player,this.game.input.activePointer)
        }
      }    

      if (this.cursors.left.isDown || aKey.isDown) {
          this.player.angle -= 4.5;
      } else if (this.cursors.right.isDown || dKey.isDown) {
          this.player.angle += 4.5;
      }

      if (this.cursors.up.isDown || wKey.isDown) {
          this.currentSpeed = 500;
      }else if (this.cursors.down.isDown || sKey.isDown) {
        this.currentSpeed = 0; //Drift
      }else {
          if (this.currentSpeed > 0) {
              this.currentSpeed -= 12;
          }
      }
      if (this.currentSpeed > 0) {
        this.player.play('swim');
        this.game.physics.arcade.velocityFromRotation(this.player.rotation, this.currentSpeed, this.player.body.velocity);
      }else {
        this.player.frame = 0;
        this.player.animations.stop();
      }
      this.wrapSprite(this.player);

      for(var i = 0; i < fishes.length; i++)
      {
        if (fishes[i].alive) {
          //Add collision Condition
          fishes[i].update();
          this.wrapSprite(fishes[i].sprite);
          this.game.physics.arcade.overlap(this.player, fishes[i].sprite, this.fishEatFish, null, this);

        }

      }

      if (fishesAlive === 0) {
        level += 1;
        if (level > 7) {
          this.winText.setText('YOU WIN!!');
          this.winText.visible = true
        }else {
          this.lvlText.setText('Lvl: '+levelNames[level-1]);
          this.loadLevel(level);
          this.levelTimer = this.game.time.now;
        }
      }
    }else {
      if (this.game.input.activePointer.isDown) {
        this.player.alive = true; 
        this.player.reset(Game.w/2, Game.h/2);

        for(var i = 0; i < fishes.length; i++) {
          fishes[i].sprite.kill();
        }
        this.winText.visible = false;
        this.loadLevel(level);
      }
    }
    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  fishEatFish: function(player, fish) {
    if (player.scale.x < fish.scale.x) {
        this.playerHitSnd.play(); 
        this.winText.setText('YOU LOSE!, Click to Play Again');
        this.winText.visible = true;
        score = 0;
        player.kill();
    }else if (player.scale.x > fish.scale.x) {
      this.mobHitSnd.play(); 
      score += 1;
      this.scoreText.setText('Score: ' + score);
      fish.kill();
      fishesAlive -= 1;
      player.scale.x += 0.25;
      player.scale.y += 0.25;
    }
  },
  wrapSprite: function(sprite) {
    if (sprite.x < 0) {
      sprite.x = boundedX;
    }else if (sprite.x > boundedX) {
      sprite.x = 0;
    }

    if (sprite.y < 0) {
      sprite.y = boundedY;
    }else if (sprite.y > boundedY) {
      sprite.y = 0;
    }

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
    // game.debug.text('fishesAlive: ' + fishesAlive, 32, 96);
    // this.game.debug.spriteInfo(this.player, 64,64);
    // this.game.debug.body(this.player);
  // }


};
