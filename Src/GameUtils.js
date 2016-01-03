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
        font: size + "px " + CubeGame.config.FONT,
        fill: colour
    });
};

/**
* If the browser doesn't support real local storage
* a "fake storage" is used instead.
* The fake storage data can't be saved
*
* (Credits to the 2048 game for this idea! Check it out at https://github.com/gabrielecirulli/2048)
*/
window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  }
};

CubeGame.DataManager = function() {};
CubeGame.DataManager.initialise = function() {
    console.log("Local storage supported? "+this.localStorageSupported());
    this.storage = (this.localStorageSupported()) ? window.localStorage : window.fakeStorage;
};
CubeGame.DataManager.localStorageSupported = function() {
    try {
        localStorage.setItem("hi", "hi");
        localStorage.removeItem("hi");
        return true;
    } catch (exception) {
        return false;
    }
};
CubeGame.DataManager.setHiscore = function(score) {
    this.storage.setItem("CubeGameHiscore", score.toString());
};
CubeGame.DataManager.getHiscore = function() {
    return parseFloat(this.storage.getItem("CubeGameHiscore"));
}


