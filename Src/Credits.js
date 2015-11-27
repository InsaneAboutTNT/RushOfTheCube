CubeGame.Credits = function() {};
CubeGame.Credits.prototype = {
    create: function() {
        this.credits = "Avoid the obstacles with the Cube!\nCreated with the Phaser Game Engine\n\nImages created in Inkscape\nSounds created in Audacity";
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