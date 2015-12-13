var Fish = function(index, game, player, scale, enemies) {
  var x = game.world.randomX;
  var y = game.world.randomY;

  this.player = player;
  this.game = game;
  this.baseSpeed = 200;
  this.speed = this.baseSpeed/scale;
  this.alive = true;
  this.enemies = enemies || [];

  // var circSize = 32;
  // this.circlebmd = this.game.add.bitmapData(circSize, circSize);
  // this.circlebmd.circle(circSize/2,circSize/2,circSize/2,'#FFFFFF');
  // this.sprite = this.game.add.sprite(x, y, this.circlebmd); 
  this.sprite = this.game.add.sprite(x, y, 'fishy'); 
  this.sprite.animations.add('swim', [0,1], 10, true);

  this.sprite.anchor.setTo(0.5, 0.5);
  this.sprite.scale.x = scale;
  this.sprite.scale.y = scale;
  this.game.physics.arcade.enable(this.sprite); 
  this.sprite.body.setSize(40,40);
  // this.sprite.body.collideWorldBounds = true;
  // this.sprite.body.bounce.setTo(1, 1);
  this.sprite.name = index.toString(); 

  this.sprite.angle = this.game.rnd.angle();

  // 50% Chance to spawn heading toward Tri
  // if (rand(0,1) === 1) {
  //   this.game.physics.arcade.velocityFromRotation(this.sprite.angle, 100, this.sprite.body.velocity);
  // }else {
    this.game.physics.arcade.velocityFromRotation(this.game.physics.arcade.angleBetween(this.sprite, this.player), 150, this.sprite.body.velocity);
  // }
};

Fish.prototype = {
  update: function(){
    this.speed = this.baseSpeed/this.sprite.scale.x;
    this.sprite.animations.play('swim');
    //Update Enemies
    if (this.player.scale.x < this.sprite.scale.x) {
      this.sprite.tint = 0xff0000;
    }else if (this.player.scale.x == this.sprite.scale.x) {
      // this.sprite.tint = 0x0000ff;
      this.sprite.tint = 0xff8C00;
    }else {
      this.sprite.tint = 0x00ff00;
    }

    if (this.game.physics.arcade.distanceBetween(this.sprite, this.player) < 300) {
      if (this.player.alive === true) {
        if (this.player.scale.x < this.sprite.scale.x) {
         // this.sprite.rotation = this.game.physics.arcade.angleBetween(this.player, this.sprite); 
          this.sprite.rotation = this.game.physics.arcade.angleBetween(this.sprite, this.player); 
         this.game.physics.arcade.moveToObject(this.sprite, this.player, this.speed);
        }else {
          this.sprite.rotation = this.game.physics.arcade.angleBetween(this.player, this.sprite); 
          this.game.physics.arcade.velocityFromRotation(this.sprite.rotation, 100, this.sprite.body.velocity);
        }
      }
    }

  },
};
