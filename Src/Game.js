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

        // Set background colour
        this.game.stage.backgroundColor = "#eeeeee";
        
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
        //this.ground = new CubeGame.Ground(this.game);
        //this.game.add.existing(this.ground);
        
        // Player
        this.player = new CubeGame.Player(this.game);
        this.game.add.existing(this.player);
        
        // Sound
        this.ping = this.game.add.audio("Ping");
        this.ping.play();

        this.addEventListeners(); // add input listeners

        // Obstacles
        this.obstacles = new CubeGame.Obstacles(this.game);
        this.game.add.existing(this.obstacles);
        // Spawn Timer

        CubeGame.ScoreManager.resetScore(); 
        
        // Make score text
        this.scoreText = this.game.add.text(40, 20, "Score: " + CubeGame.score.toString(), {
            font: "40px " + CubeGame.config.Font,
            fill: "#5f5f5f"
        });
        
        this.scoreTextSlideIn = this.game.add.tween(this.scoreText).from({x:-300}, 300, Phaser.Easing.Sinusoidal.Out).start();
        
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
        CubeGame.obstacleTypes = ["Laser", "Spikes"];
        
        // Increase score every 1 second
        // Score is based on survival time
        this.game.time.events.loop(1000, this.updateScore, this);
        
        
    },
    /**
    * Add event listeners, as in Phaser.Signal's. 
    */
    addEventListeners: function() {
        this.input.onDown.add(this.player.jump, this.player);
        
        // die() method will execute when signal is dispatched
        CubeGame.deadSignal.add(this.die, this);
    },
    /**
    * RIP Cube!!!
    */
    die: function() {
        this.game.state.start("GameOver");
    },
    updateScore: function() {
        CubeGame.ScoreManager.increaseScore(10);
    },
    updateScoreText: function() {
        this.scoreText.setText("Score: " + CubeGame.score);
    },
    update: function() {
        //this.game.physics.arcade.overlap(this.player, this.obstacles, function() {CubeGame.deadSignal.dispatch();});
        this.player.initObstacleCollisions(this.obstacles);
        this.updateScoreText();
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