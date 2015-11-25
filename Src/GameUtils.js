/**
* This signal is to be fired when
* the player is dead.
*/
CubeGame.deadSignal = new Phaser.Signal();

CubeGame.ScoreManager = function() {};
CubeGame.ScoreManager.increaseScore = function(increment) {
    CubeGame.score += increment;
};
CubeGame.ScoreManager.resetScore = function() {
    CubeGame.score = 0;
};