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