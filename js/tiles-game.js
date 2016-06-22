/*
  Tiles Classic Game
  andy.pro
  https://github.com/andy-pro/Tiles-Game
  angular
  20.06.2016
*/

'use strict';

function TilesGame(opts) {
  function dummy() {};
  var self = this;
  // events binding
  [ 'on_show',
    'on_hide',
    'on_hit',
    'on_miss',
    'on_gameover' ]
  .forEach(function(opt) {
    self[opt] = opts[opt] || dummy;
  });
}

TilesGame.prototype = {

  pick: function(latter) {
    // vars 'latter' and 'former' match the current and previous tiles
    var former = this.former;
    if(former === null) { // first click for pair
      this.former = latter;
      this.on_show(latter);
    } else { // second click for pair
      if(former.id == latter.id) { // need to close the tile, it is the same!
        this.on_hide(latter);
      } else { // different tiles
        this.on_show(latter);
        if(former.icon == latter.icon) { // the contents of the tiles is same, both should disappear
          this.on_hit(former, latter);
          if(!--this.count) {
            this.gameover = true;
            this.on_gameover(Math.floor((performance.now() - this.starttime)/1000));
          }
        } else{ // different contents, both should close
          this.on_miss(former, latter);
        }
      }
      // after second click we must reset previous tile
      this.former = null;
    }
  },

  start: function(num_pairs) {

    // Shuffles an array in-place.
    // Source: http://stackoverflow.com/a/12646864
    function shuffle(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    }

    var num_tiles = num_pairs * 2,
        tiles = [];

    this.count = num_pairs;
    this.former = null;
    this.gameover = false;

    for(var i = 0; i < num_tiles; i++) {
      tiles.push({
        //show: true, // uncomment this for God-mode :)
        id: i,
        icon: Math.floor(i % num_pairs)
      });
    }

    shuffle(tiles); // comment this for half-God-mode :)

    this.starttime = performance.now();

    return tiles;

  }

}