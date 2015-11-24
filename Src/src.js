/**
 * @description The Game states and logic
 * 
 * Last updated 3/10/15
 * */

var CubeGame = function() {
};

// ------------------------------------------------------------
/**
* Game's default configuration
* @enum {Number}
*/
CubeGame.config = {
    Font: "Lato",
    ScrollVelocity: -450,
    Gravity: 800,
    JumpVelocity: -300,
    AtlasSettings: {
        Name: "Textures",
        JSON: "Textures.json",
        Img: "Textures.png"
    },
    Game: null
};

CubeGame.Boot = function() {
};
CubeGame.Boot.prototype = {
    /**
    * Kick off the setup state (CubeGame.Setup)
    */
    startSetup: function() {
        this.game.state.start("Setup");
    },
    preload: function() {
        // This helps alleviate lagginess
        // Trying to reduce ragequitting due to lag!!
        
        // forcesingleupdate forces a logic update every time the loop happens.
        this.game.forceSingleUpdate = true;

        // Set background colour
        this.game.stage.backgroundColor = 0xe0e0e0;
        
        var t = this; // Reference to this
        
        // Load google font script.
        // Note: may use own font and remove this script later
        this.game.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");

        // Important! Make game correctly scale.
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        
        CubeGame.config.Game = this.game;

        // Google font config.
        // Note: may use own font and remove this script later
        WebFontConfig = {
            active: function() {
                // Note: this reference refers to WebFontConfig
                // and t is the CubeGame.Setup's this reference
                t.startSetup(); // Start game when font ready
            },
            google: {
                families: [CubeGame.config.Font+":400,700"]
            }
        };
    }
};
CubeGame.Setup = function() {
};
CubeGame.Setup.prototype = {
    preload: function() {
        // Load a whole pile of stuff
        // Maybe replace with texture atlas
        this.loaded = this.game.add.text(400, 250, "Loading", {
            font: "50px " + CubeGame.config.Font,
            fill: "#5f5f5f"
        });
        
//        this.game.load.image("Player", "Assets/Player.png");
//        this.game.load.image("Ground", "Assets/Ground.png");
//        this.game.load.image("Spikes", "Assets/Spikes.png");
//        this.game.load.image("Logo", "Assets/Logo.png");
//        
//        this.game.load.image("Laser", "Assets/Laser.png");
//        this.game.load.image("PlayButton", "Assets/PlayButton.png");
//        this.game.load.image("MenuButton", "Assets/MenuButton.png");
        var atlasSettings = CubeGame.config.AtlasSettings;
        
        this.game.load.atlasJSONHash(atlasSettings.Name, atlasSettings.Img, atlasSettings.JSON);
        this.game.load.audio("Ping", ["Audio/Ping.ogg"]);
        // Google font config
    },
    create: function() {
        this.loaded.setText("Loaded!");
        
        var t = this;
        this.game.time.events.add(2000, function() {
            t.game.state.start("Menu");
        });
    }
};
CubeGame.Menu = function() {
};
CubeGame.Menu.prototype = {
    preload: function() {
    },
    create: function() {
        this.game.stage.backgroundColor = "#eeeeee";
        
        this.logo = this.game.add.sprite(250, 100, "Textures", "Logo");
        
        this.playButton = this.game.add.button(400, 350, "Textures", this.startPlay, this);
        this.playButton.frameName = "PlayButton";
        
        this.helpText = this.game.add.text(250, 70, "Click with mouse to jump", {
            font: "30px " + CubeGame.config.Font,
            fill: "#5f5f5f"
        });
        
        // Bounce logo in from up
        this.logoBounceIn = this.game.add.tween(this.logo).from({y:-300}, 500, Phaser.Easing.Sinusoidal.Out).start();
        
        // Bounce logo up and down
        this.logoUpDown = this.game.add.tween(this.logo)
            .to({y: 120}, 500, Phaser.Easing.Linear.None)
            .to({y: 100}, 500, Phaser.Easing.Linear.None)
            .loop(true);
        // Up-and-down tween will play after bounce-in
        this.logoBounceIn.chain(this.logoUpDown);
        
        this.helpTextSlideIn = this.game.add.tween(this.helpText)
            .from({x:-300}, 500, Phaser.Easing.Sinusoidal.Out).start();
        // Bounce in play button
        this.playButtonSlideIn = this.game.add.tween(this.playButton)
            .from({x:-300}, 500, Phaser.Easing.Sinusoidal.Out).start();
    },
    /**
    * Start game when play button clicked
    */
    startPlay: function() {
        this.game.state.start("Play");
    },
    update: function() {

    }
};

CubeGame.Play = function() {
};
CubeGame.Play.prototype = {
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = CubeGame.config.Gravity;
        
        this.game.stage.backgroundColor = "#eeeeee";

        // Create ground
        this.ground = new CubeGame.Ground(this.game);
        this.game.add.existing(this.ground);
        
        // Player
        this.player = new CubeGame.Player(this.game, this.ground);
        this.game.add.existing(this.player);
        
        // Sound
        this.ping = this.game.add.audio("Ping");
        this.ping.play();

        this.addEventListeners(); // add input listeners

        // Obstacles
        this.obstacles = new CubeGame.Obstacles(this.game);
        this.game.add.existing(this.obstacles);
        // Spawn Timer
        this.spawner = this.game.time.events.loop(1400, this.spawn, this);

        CubeGame.score = 0; 
        // Needs to be accessible between game states
        // so it is declared in CubeGame
        
        // Make score text
        this.scoreText = this.game.add.text(40, 20, "Score: " + CubeGame.score.toString(), {
            font: "40px " + CubeGame.config.Font,
            fill: "#5f5f5f"
        });
        
        this.scoreTextSlideIn = this.game.add.tween(this.scoreText).from({x:-300}, 300, Phaser.Easing.Sinusoidal.Out).start();
        
        // Configuration
        
        /** When you geet a certain score,
        * there will be a faster spawn rate.
        * This array determines this spawn rates at certain scores.
        *
        * score: The score
        * interval: The interval when the player reaches the score. (ms)
        * eg. {score: 40, interval: 1000}
        * means when the player reaches 40pts then obstacles spawn every 1000 ms
        */
        CubeGame.config.spawnIntervals = 
            [{score: 40, interval: 1000},
             {score: 100, interval: 700},
             {score: 140, interval: 500}];
        CubeGame.obstacleTypes = ["Laser", "Spikes"];
    },
    /**
    * Add event listeners, as in Phaser.Signal's. 
    */
    addEventListeners: function() {
        this.input.onDown.add(this.player.jump, this.player);
        
        // die() method will execute when signal is dispatched
        CubeGame.deadSignal.add(this.die, this);
    },
    spawn: function() {
        // Try to fetch an obstacle from the pool
        // Determines sprite to be used from Game.obstacleTypes
        var seed = this.game.rnd.integerInRange(0, 1);
        var yPos = this.game.rnd.integerInRange(50, CubeGame.PageH - 150);    
        // fetchObstacle method is in the ObstaclePool "pseudoclass" declaration
        this.obstacles.fetchObstacle(this.game, CubeGame.PageW, yPos, CubeGame.obstacleTypes[seed]);
    },
    /**
    * Method to send signal when player is dead
    */
    /*sendDeadSignal: function() {
        CubeGame.deadSignal.dispatch();
    },*/
    /**
    * Enable collision callback when player hits obstacle. Will call sendDeadSignal
    */
    enableOverlap: function(obstacle) {
        // Signal player is dead if player collides obstacle
        this.game.physics.arcade.overlap(this.player, obstacle, function() {CubeGame.signal.sendDeadSignal();});
    },
    /**
    * Check if obstacle has been scored.
    */
    checkScore: function(obstacle) {
        // If obstacle exists,
        // if obstacle has not been already scored, 
        // if player has passed the obstacle,
        // obstacle has been scored
        if (obstacle.exists && !obstacle.hasScored && obstacle.world.x <= this.player.world.x) {
            this.ping.play();
            obstacle.hasScored = true;
            CubeGame.score += 10; // Increase score
            this.scoreText.setText("Score: " + CubeGame.score.toString()); // Update score on HUD
        }
    },
    /**
    * RIP Cube!!!
    */
    die: function() {
        var t = this;
        // Hide player
        this.player.visible = false;
        
        // stop() functions will stop objects moving
        this.obstacles.forEach(function(obstacle) {
          obstacle.stop();
        });
        this.ground.stop();
        this.game.time.events.remove(this.spawner);
        
        this.scoreText.setText("Dead!");
        
        // Wait 1 secs then go to Game Over state
        this.game.time.events.add(1000, function() {
            t.game.state.start("GameOver");
        });
    },
    update: function() {
        var spawnIntervalObj;
        for(i=0;i<CubeGame.config.spawnIntervals.length;i++) {
            spawnIntervalObj = CubeGame.config.spawnIntervals[i];
            if(CubeGame.score === spawnIntervalObj.score) {
                this.spawner.delay = spawnIntervalObj.interval;
            }
        }
        
        this.obstacles.forEach(function(obstacle) {
            this.checkScore(obstacle); // Is obstacle scored?
            this.enableOverlap(obstacle); // This will enable callback when player hits obstacle (and should die.)
        }, this);
        
    }
};

/**
* Game Over!!! 
*/
CubeGame.GameOver = function() {
};
CubeGame.GameOver.prototype = {
    preload: function() {
    },
    create: function() {
        this.game.stage.backgroundColor = "#eeeeee";

        // Group contains elements that show score.
        this.gameOverGroup = this.game.add.group();
        this.buttonsGroup = this.game.add.group();
        
        this.scoreIs = this.game.add.text(150, 50, "You got", {
            font: "30px " + CubeGame.config.Font,
            fill: "#5f5f5f"
        });
        
        // Score text
        var scoreStr = CubeGame.score.toString()+" pts";
        this.points = this.game.add.text(150, 120, scoreStr, {
            font: "bold 120px " + CubeGame.config.Font,
            fill: "#3498db"
        });
                
        // Add these elements to the group
        this.gameOverGroup.add(this.scoreIs);
        this.gameOverGroup.add(this.points);
        
        this.gameOverSlideIn = this.game.add.tween(this.gameOverGroup).from({x:-300}, 200, Phaser.Easing.Sinusoidal.Out).start();
        
        this.replayButton = this.game.add.button(300, 400, "Textures", this.startPlay, this);
        this.replayButton.frameName = "PlayButton";
        this.menuButton = this.game.add.button(500, 400, "Textures", this.gotoMenu, this);
        this.menuButton.frameName = "MenuButton";
        this.buttonsGroup.add(this.replayButton);
        this.buttonsGroup.add(this.menuButton);
        
        this.buttonsSlideIn = this.game.add.tween(this.buttonsGroup).from({x:CubeGame.PageW + 200}, 500, Phaser.Easing.Sinusoidal.Out).start();
    },
    startPlay: function() {
        this.game.state.start("Play");
    },
    gotoMenu: function() {
        this.game.state.start("Menu");
    },
    update: function() {

    }
};

/**
 * @description The game objects.
 * Includes player, obstacle, and ground
 * 
 * */

CubeGame.Obstacles = function(game) {
    Phaser.Group.call(this, game);
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
/** Built in Phaser function */
CubeGame.Obstacles.prototype.update = function() {
    
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
CubeGame.Player.prototype.update = function() {
    // Collide player and ground
    // Player is dead if player overlaps ground
    
    // this.game is the reference to the game the player is running in.
    this.game.physics.arcade.overlap(this, this.ground, function() {CubeGame.signal.sendDeadSignal();});
    if(this.y < 0)CubeGame.signal.sendDeadSignal();
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