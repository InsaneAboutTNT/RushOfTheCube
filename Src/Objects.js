/**
 * @description The game objects.
 * Includes player, obstacle, and ground
 * 
 * */

CubeGame.Obstacles = function(game) {
    Phaser.Group.call(this, game);
    this.spawner = this.game.time.events.loop(1400, this.spawn, this);
};
CubeGame.Obstacles.prototype = Object.create(Phaser.Group.prototype);
CubeGame.Obstacles.prototype.constructor = CubeGame.Obstacles;

/**
* If we just create objects and leave them
* this will take a lot of cpu power.
* 
* Uses recycling of objects in a pool
* so objects are reused whenever possible.
*/
CubeGame.Obstacles.prototype.fetchObstacle = function(game, x, y, key) {
    // Get obstacle from group that is not "alive"
    var obstacle = this.getFirstExists(false);
    if (!obstacle) { // If no "not alive" obstacle is found in group
        obstacle = new CubeGame.Obstacle(game, 0, 0); // Create a new one
        this.add(obstacle); // Add to group
    }
    obstacle.reuse(game, x, y, key); // Set up obstacle for use
};
CubeGame.Obstacles.prototype.update = function() {
    var spawnIntervalObj;
        for(i=0;i<CubeGame.config.spawnIntervals.length;i++) {
            spawnIntervalObj = CubeGame.config.spawnIntervals[i];
            if(CubeGame.score === spawnIntervalObj.score) {
                this.spawner.delay = spawnIntervalObj.interval;
        }
    }
};
CubeGame.Obstacles.prototype.spawn = function() {
        // Try to fetch an obstacle from the pool
        // Determines sprite to be used from Game.obstacleTypes
        var seed = this.game.rnd.integerInRange(0, 1);
        var yPos = this.game.rnd.integerInRange(50, CubeGame.PageH - 150);    
        this.fetchObstacle(this.game, CubeGame.PageW, yPos, CubeGame.obstacleTypes[seed]);
};
// -------------------------------------------------------------

CubeGame.Player = function(game, ground) {
    Phaser.Sprite.call(this, game, 250, CubeGame.PageH/3,"Textures" ,"Player");
    game.physics.arcade.enable(this);
    
    this.ground = ground;
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
    this.game.physics.arcade.overlap(this, this.ground, function() {CubeGame.deadSignal.dispatch();});
    if(this.y < 0)CubeGame.deadSignal.dispatch();
};
// --------------------------------------------------------------

/**
* An obstacle
*/
CubeGame.Obstacle = function(game, x, y) {
    // Laser key is just for placeholding.
    // Texture key will actually be set in reuse function
    Phaser.Sprite.call(this, game, x, y, "Textures", "Laser");
};
CubeGame.Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
CubeGame.Obstacle.prototype.constructor = CubeGame.Obstacle;

CubeGame.Obstacle.prototype.update = function() {
    this.checkWorldBounds();
};

CubeGame.Obstacle.prototype.checkWorldBounds = function() {
    // If obstacle has fallen out of world, kill it
    if (!this.inWorld && this.exists) {
        this.kill();
    }
};
/** 
* Function to reset Laser.
* (There is a built in function reset() but
* the velocity needs to be set too)
* 
* This is called by the ObstacleGroup for recycling obstacles.
*/
CubeGame.Obstacle.prototype.reuse = function(game, x, y, key) {
    this.reset(x, y);
    this.hasScored = false;
    this.frameName = key;
    this.anchor.setTo(0, 1);

    game.physics.arcade.enable(this);

    this.body.allowGravity = false;
    this.hasScored = false;
    
    this.body.velocity.x = CubeGame.config.ScrollVelocity;
};
CubeGame.Obstacle.prototype.stop = function() {
    this.body.velocity.x = 0;
};


// ---------------------------------------------------------------

/**
* The ground.
*/
CubeGame.Ground = function(game) {
    Phaser.TileSprite.call(this, game, 0, CubeGame.PageH, CubeGame.PageW, 100, "Textures", "Ground");
    this.autoScroll(CubeGame.config.ScrollVelocity, 0);
    // Set position based on left bottom corner
    this.anchor.setTo(0, 1);
    game.physics.arcade.enable(this);

    this.body.immovable = true;
    this.body.allowGravity = false;
};
CubeGame.Ground.prototype = Object.create(Phaser.TileSprite.prototype);
CubeGame.Ground.prototype.constructor = CubeGame.Ground;

CubeGame.Ground.prototype.stop = function() {
    this.autoScroll(0, 0);
};