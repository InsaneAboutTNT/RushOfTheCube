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
