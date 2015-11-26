
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