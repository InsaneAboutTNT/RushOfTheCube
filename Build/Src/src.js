/**
 * @description The Game states and logic
 *
 * Last updated 3/10/15
 * */

/**
* Global CubeGame Instance
*/
var CubeGame = function() {
};

// ------------------------------------------------------------
/**
* Game's default configuration
* @enum {Number}
*/
CubeGame.config = {
    FONT: "Lato",
    SCROLL_VELOCITY: -450,
    GRAVITY: 800,
    JUMP_VELOCITY: -300,
    AtlasSettings: {
        NAME: "Textures",
        JSON: "Textures.json",
        IMG: "Textures.png"
    },
    GAME: null
};


CubeGame.Play = function() {
};
CubeGame.Play.prototype = {
    create: function() {

        this.initGame();
        this.initPlayer();
        this.initObstacles();
        this.initEventListeners(); // add input listeners
        this.initGUI();
        this.initConfig();
    },
    /**
    * Add event listeners, as in Phaser.Signal's.
    */
    initGame: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = CubeGame.config.GRAVITY;
        CubeGame.AudioManager.playAudio("Ping");

        this.game.stage.backgroundColor = "#eeeeee";
    },
    initPlayer: function() {
        // Player
        this.player = new CubeGame.Player(this.game);
        this.game.add.existing(this.player);
    },
    initObstacles: function() {
        // Obstacles
        this.obstacles = new CubeGame.Obstacles(this.game);
        this.game.add.existing(this.obstacles);
    },
    initGUI: function() {
        // Score text
        CubeGame.ScoreManager.resetScore();
        this.scoreText = CubeGame.factory.addText(40, 20, "Score: 0", 40, "#5f5f5f");

        this.scoreTextSlideIn = this.game.add.tween(this.scoreText).from({x:-300}, 300, Phaser.Easing.Sinusoidal.Out).start();
    },
    initConfig: function() {
        // Configuration

        /** When you get a certain score,
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
             {score: 100, interval: 800},
             {score: 140, interval: 700}];

        // Texture keys. When obstacles spawn
        // a random texture will be picked
        // from this array
        CubeGame.config.obstacleTypes = ["Laser", "Spikes"];

        // Increase score every 1 second
        // Score is based on survival time
        this.game.time.events.loop(1000, this.updateScore, this);
    },
    initEventListeners: function() {
        this.input.onDown.add(this.player.jump, this.player);

        this.spaceBarKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceBarKey.onDown.add(this.player.jump, this.player);

        // die() method will execute when signal is dispatched
        CubeGame.deadSignal.add(this.die, this);
    },
    /**
    * RIP Cube!!!
    */
    die: function() {
        CubeGame.AudioManager.playAudio("Death");

        this.game.state.start("GameOver");
    },
    updateScore: function() {
        CubeGame.ScoreManager.increaseScore(10);
    },
    updateScoreText: function() {
        this.scoreText.setText("Score: " + CubeGame.Score);
    },
    update: function() {
        this.player.initObstacleCollisions(this.obstacles);
        this.updateScoreText();
    }
};


CubeGame.Credits = function() {};
CubeGame.Credits.prototype = {
    create: function() {
        this.credits = "Avoid the obstacles with the Cube!\nA Javascript/HTML5 Game\nCreated with the Phaser Game Engine\n\nImages created in Inkscape\nSounds created in Audacity";
        this.creditsText = CubeGame.factory.addText(100, 50, this.credits, 30, "#5f5f5f");

        this.menuButton = this.game.add.button(100, 400, "Textures", this.menuState, this);
        this.menuButton.frameName = "MenuButton";

        this.creditsThingsGroup = this.game.add.group();
        this.creditsThingsGroup.add(this.menuButton);
        this.creditsThingsGroup.add(this.creditsText);
        this.creditsThingsSlideIn = this.game.add.tween(this.creditsThingsGroup)
            .from({x:1500}, 500, Phaser.Easing.Sinusoidal.Out).start();
    },
    menuState: function() {
        this.game.state.start("Menu");
    }
};

/**
* Game Over!!!
*/
CubeGame.GameOver = function() {
};
CubeGame.GameOver.prototype = {
    evaluateHiscore: function() {
        var hiscore = 0;
        var curHiscore = CubeGame.DataManager.getHiscore();
        var curScore = CubeGame.Score;
        if (curScore > curHiscore) {
            hiscore = curScore;
        }
        else hiscore = curHiscore;
        console.log(hiscore);
        return hiscore;
    },
    preload: function() {
    },
    create: function() {
        this.initGameOverMenu();
        this.initGameOverTweens();
    },
    initGameOverMenu: function() {
        this.game.stage.backgroundColor = "#eeeeee";

        // Group contains elements that show score.
        this.gameOverGroup = this.game.add.group();
        this.buttonsGroup = this.game.add.group();

        var hiscore = this.evaluateHiscore();
        var newHiscore = false;
        if (hiscore !== CubeGame.DataManager.getHiscore()) {
            CubeGame.DataManager.setHiscore(hiscore);
            newHiscore = true;
        }

        this.scoreIsText = CubeGame.factory.addText(150, 50, "The score is...", 30, "#5f5f5f");
        // Score text
        var scoreStr = CubeGame.Score.toString()+" pts";
        var hiscoreStr = "Hiscore: " + CubeGame.DataManager.getHiscore() +" pts";

        if (newHiscore) {
            this.newHiscoreText = CubeGame.factory.addText(500, 270, "New Hiscore!!!", 30, "#3498db");
            this.newHiscoreText.anchor.setTo(0.5, 0.5);
            this.newHiscoreText.angle = -10;
            this.newHiscoreTextTween = this.game.add.tween(this.newHiscoreText.scale)
                .to({x: 1.2,  y: 1.2}, 500).to({x: 1,  y: 1}, 500).loop(true).start();
        }

        this.scoreText = CubeGame.factory.addText(150, 120, scoreStr, 120, "#3498db");

        this.hiscoreText = CubeGame.factory.addText(150, 300, hiscoreStr, 30, "#5f5f5f");

        // Add these elements to the group
        if (newHiscore) {
            this.gameOverGroup.add(this.newHiscoreText);
        }
        this.gameOverGroup.add(this.scoreIsText);
        this.gameOverGroup.add(this.scoreText);
        this.gameOverGroup.add(this.hiscoreText);
    },
    initGameOverTweens: function() {
        this.gameOverSlideIn = this.game.add.tween(this.gameOverGroup).from({x:-300}, 200, Phaser.Easing.Sinusoidal.Out).start();

        this.replayButton = this.game.add.button(300, 400, "Textures", this.startPlay, this);
        this.replayButton.frameName = "PlayButton";
        this.menuButton = this.game.add.button(500, 400, "Textures", this.gotoMenu, this);
        this.menuButton.frameName = "MenuButton";
        this.buttonsGroup.add(this.replayButton);
        this.buttonsGroup.add(this.menuButton);

        this.buttonsSlideIn = this.game.add.tween(this.buttonsGroup).from({x:this.game.width + 200}, 500, Phaser.Easing.Sinusoidal.Out).start();
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
* This signal is to be fired when
* the player is dead.
*/
CubeGame.deadSignal = new Phaser.Signal();

CubeGame.ScoreManager = function() {};
CubeGame.ScoreManager.increaseScore = function(increment) {
    CubeGame.Score += increment;
};
CubeGame.ScoreManager.resetScore = function() {
    CubeGame.Score = 0;
};

CubeGame.AudioManager = function() {};
CubeGame.AudioManager.loadAudio = function(sfx) {
    this.sfx = sfx;
};
CubeGame.AudioManager.playAudio = function(key) {
    this.sfx.play(key);
};

CubeGame.factory = function() {}
CubeGame.factory.addText = function(x, y, text, size, colour) {
    return CubeGame.config.Game.add.text(x, y, text, {
        font: size + "px " + CubeGame.config.FONT,
        fill: colour
    });
};

/**
* If the browser doesn't support real local storage
* a "fake storage" is used instead.
* The fake storage data can't be saved
*
* (Credits to the 2048 game for this idea! Check it out at https://github.com/gabrielecirulli/2048)
*/
window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  }
};

CubeGame.DataManager = function() {};
CubeGame.DataManager.initialise = function() {
    console.log("Local storage supported? "+this.localStorageSupported());
    this.storage = (this.localStorageSupported()) ? window.localStorage : window.fakeStorage;
};
CubeGame.DataManager.localStorageSupported = function() {
    try {
        localStorage.setItem("hi", "hi");
        localStorage.removeItem("hi");
        return true;
    } catch (exception) {
        return false;
    }
};
CubeGame.DataManager.setHiscore = function(score) {
    this.storage.setItem("CubeGameHiscore", score.toString());
};
CubeGame.DataManager.getHiscore = function() {
    return parseFloat(this.storage.getItem("CubeGameHiscore"));
}



CubeGame.Menu = function() {
};
CubeGame.Menu.prototype = {
    preload: function() {
    },
    create: function() {
        this.initMenu();
        this.initMenuTweens();
        this.initParticleEmitter();

    },
    initMenu: function() {
        this.game.stage.backgroundColor = "#eeeeee";

        this.logo = this.game.add.sprite(250, 100, "Textures", "Logo");

        this.playButton = this.game.add.button(400, 350, "Textures", this.startPlay, this);
        this.playButton.frameName = "PlayButton";

        this.creditsButton = this.game.add.button(100, 500, "Textures", this.creditsState, this);
        this.creditsButton.frameName = "CreditsButton";

        this.helpText = CubeGame.factory.addText(250, 70, "Click with mouse or spacebar to jump", 25, "#5f5f5f");
            //this.game.add.text(250, 70, "Click with mouse to jump", {
            //font: "30px " + CubeGame.config.Font,
            //fill: "#5f5f5f"
        //});
        // Version
        this.versionText = CubeGame.factory.addText(900, 500, "v1.1.0", 30, "#5f5f5f");
    },
    initMenuTweens: function() {
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
        // Slide in play button
        this.playButtonSlideIn = this.game.add.tween(this.playButton)
            .from({x:-300}, 500, Phaser.Easing.Sinusoidal.Out).start();
        // Slide in credits button from right
        this.creditsButtonSlideIn = this.game.add.tween(this.creditsButton)
            .from({x:1500}, 1000, Phaser.Easing.Sinusoidal.Out).start();
        this.versionTextButtonSlideIn = this.game.add.tween(this.versionText.scale)
            .from({x: 0, y: 0}, 300, Phaser.Easing.Sinusoidal.Out).start();
    },
    initParticleEmitter: function() {
        // Particles
        this.particleEmitter = this.game.add.emitter(this.game.width/2, 0, 400);
        this.particleEmitter.width = this.game.width;

        this.particleEmitter.makeParticles([CubeGame.config.AtlasSettings.NAME],["Player"]);

	    this.particleEmitter.minParticleScale = 0.1;
	    this.particleEmitter.maxParticleScale = 0.3;

	    this.particleEmitter.setYSpeed(100, 200);
        this.particleEmitter.setXSpeed(0, 0);

        this.particleEmitter.setAll("body.allowGravity", false);

	    this.particleEmitter.minRotation = 0;
	    this.particleEmitter.maxRotation = 0;

	    this.particleEmitter.start(false, 5000, 300, 0);
    },
    /**
    * Start game when play button clicked
    */
    startPlay: function() {
        this.game.state.start("Play");
    },
    creditsState: function() {
        this.game.state.start("Credits");
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
            if(CubeGame.Score === spawnIntervalObj.score) {
                this.spawner.delay = spawnIntervalObj.interval;
        }
    }
};
CubeGame.Obstacles.prototype.spawn = function() {
        // Try to fetch an obstacle from the pool
        // Determines sprite to be used from Game.config.obstacleTypes
        var seed = this.game.rnd.integerInRange(0, 1);
        var yPos = this.game.rnd.integerInRange(50, this.game.height - 50);
        this.fetchObstacle(this.game, this.game.width, yPos, CubeGame.config.obstacleTypes[seed]);
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
* Function to reset Obstacle.
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

    this.body.velocity.x = CubeGame.config.SCROLL_VELOCITY;
};
CubeGame.Obstacle.prototype.stop = function() {
    this.body.velocity.x = 0;
};


// ---------------------------------------------------------------
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

        // Set background colour
        this.game.stage.backgroundColor = "#eeeeee";

        var t = this; // Reference to this

        // Important! Make game correctly scale.
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;

        CubeGame.config.Game = this.game;

        CubeGame.config.Font = "Lato";
        CubeGame.DataManager.initialise();

        // Make sure hiscore is not NaN
        // (eg. if the player plays the game for the first time)
        if (isNaN(CubeGame.DataManager.getHiscore())){ CubeGame.DataManager.setHiscore(0);}

        this.startSetup();

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

        this.game.load.atlasJSONHash(atlasSettings.NAME, atlasSettings.IMG, atlasSettings.JSON);
        this.game.load.audiosprite("Audiosprite", ["Audio/Audiosprite.ogg","Audio/Audiosprite.m4a"], "Audio/Audiosprite.json");
    },
    create: function() {
        var audiosprite = this.game.add.audioSprite("Audiosprite");

        CubeGame.AudioManager.loadAudio(audiosprite);
        this.loaded.setText("Loaded!");

        var t = this;
        this.game.time.events.add(2000, function() {
            t.game.state.start("Menu");
        });
    }
};
