
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