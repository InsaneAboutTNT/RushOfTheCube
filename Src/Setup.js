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
        //this.game.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");

        // Important! Make game correctly scale.
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        
        CubeGame.config.Game = this.game;
        
        CubeGame.config.Font = "Arial";
        this.startSetup();

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