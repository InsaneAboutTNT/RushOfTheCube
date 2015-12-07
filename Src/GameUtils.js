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
        font: size + "px " + CubeGame.config.Font,
        fill: colour
    });
};

CubeGame.DataManager = function() {};
CubeGame.DataManager.setHiscore = function(score) {
    localStorage.setItem("CubeGameHiscore", score.toString());
};
CubeGame.DataManager.getHiscore = function() {
    return parseFloat(localStorage.getItem("CubeGameHiscore"));
}