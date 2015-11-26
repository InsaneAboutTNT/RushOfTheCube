// -------------------------------------------------------------

CubeGame.Player = function(game) {
    Phaser.Sprite.call(this, game, 250, CubeGame.PageH/3,"Textures" ,"Player");
    game.physics.arcade.enable(this);
    
};
CubeGame.Player.prototype = Object.create(Phaser.Sprite.prototype);
CubeGame.Player.prototype.constructor = CubeGame.Player;

CubeGame.Player.prototype.jump = function() {
    // Jump
    this.body.velocity.y = CubeGame.config.JumpVelocity;
};
CubeGame.Player.prototype.initObstacleCollisions = function(obstGroup) {
    this.game.physics.arcade.collide(this, obstGroup, function(){CubeGame.deadSignal.dispatch();});
};
CubeGame.Player.prototype.update = function() {
    // Collide player and ground
    // Player is dead if player overlaps ground
    
    // this.game is the reference to the game the player is running in.
    if(this.y < 0)CubeGame.deadSignal.dispatch();
    if(this.y > CubeGame.PageH - 60)CubeGame.deadSignal.dispatch();
};