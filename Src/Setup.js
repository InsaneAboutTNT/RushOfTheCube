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
        
        // 
        CubeGame.config.Font = "Lato";
        CubeGame.DataManager.initialise();
        
        // Make sure hiscore is not NaN
        // (eg. if the player plays the game for the first time)
        if (isNaN(CubeGame.DataManager.getHiscore())){ CubeGame.DataManager.setHiscore(0);         console.log(CubeGame.DataManager.getHiscore());}
        
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
        
        this.game.load.atlasJSONHash(atlasSettings.Name, atlasSettings.Img, atlasSettings.JSON);
        //this.game.load.audio("Ping", ["Audio/Ping.ogg"]);
        this.game.load.audiosprite("Audiosprite", "Audio/Audiosprite.ogg", "Audio/Audiosprite.json");
        // Google font config
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