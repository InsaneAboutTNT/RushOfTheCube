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
        //this.ping = this.game.add.audio("Ping");
        //this.ping.play();
        CubeGame.AudioManager.playAudio("Ping");

        this.addEventListeners(); // add input listeners

        // Obstacles
        this.obstacles = new CubeGame.Obstacles(this.game);
        this.game.add.existing(this.obstacles);
        // Spawn Timer

        CubeGame.ScoreManager.resetScore(); 
        
        // Make score text
//        this.scoreText = this.game.add.text(40, 20, "Score: " + CubeGame.Score.toString(), {
//            font: "40px " + CubeGame.config.Font,
//            fill: "#5f5f5f"
//        });
        this.scoreText = CubeGame.factory.addText(40, 20, "Score: 0", 40, "#5f5f5f");
        
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
        CubeGame.config.obstacleTypes = ["Laser", "Spikes"];
        
        // Increase score every 1 second
        // Score is based on survival time
        this.game.time.events.loop(1000, this.updateScore, this);
        
        
    },
    /**
    * Add event listeners, as in Phaser.Signal's. 
    */
    addEventListeners: function() {
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
        //this.game.physics.arcade.overlap(this.player, this.obstacles, function() {CubeGame.deadSignal.dispatch();});
        this.player.initObstacleCollisions(this.obstacles);
        this.updateScoreText();
    }
};

