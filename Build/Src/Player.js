// -------------------------------------------------------------

CubeGame.Player = function(game) {
    Phaser.Sprite.call(this, game, 250, 0,"Textures" ,"Player");
    game.physics.arcade.enable(this);

    this.y = this.game.height / 3;
};
CubeGame.Player.prototype = Object.create(Phaser.Sprite.prototype);
CubeGame.Player.prototype.constructor = CubeGame.Player;

CubeGame.Player.prototype.jump = function() {
    // Jump
    this.body.velocity.y = CubeGame.config.JUMP_VELOCITY;
};
CubeGame.Player.prototype.initObstacleCollisions = function(obstGroup) {
    this.game.physics.arcade.collide(this, obstGroup, function(){CubeGame.deadSignal.dispatch();});
};
CubeGame.Player.prototype.update = function() {
    if(this.y < 0)CubeGame.deadSignal.dispatch();
    if(this.y > this.game.height - 60)CubeGame.deadSignal.dispatch();
};
