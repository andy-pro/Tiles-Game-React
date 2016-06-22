/*
  Tiles Classic Game
  andy.pro
  https://github.com/andy-pro/Tiles-Game-React
  react
  20.06.2016
*/

'use strict';

var TilesGameApp = React.createClass({

  icons: [
    // visit 'http://fontawesome.io/icons' for details
    "bluetooth", "youtube-square", "envira", "bank", "car",
    "binoculars", "camera-retro", "firefox", "futbol-o", "cogs"
  ],

  presets: [
    {pairs: 6, cols: 4}, // beginner, level 1
    {pairs: 8, cols: 4}, // medium, level 2
    {pairs: 10, cols: 5} // expert, level 3
  ],

  pick: function(tile) {
    this.game.pick(tile);
  },

  start: function() {
    //var level = +this.level;
    var level = 1;
    if (level < 1 || level > this.presets.length) {
      throw "you choosed invalid level!";
    }
    console.log('start game');
    var preset = this.presets[level-1],
        num_pairs = preset.pairs,
        num_tiles = num_pairs * 2,
        num_cols = preset.cols,
        num_rows = ~~(num_tiles / num_cols);
    this.tiles1x = this.game.start(num_pairs);
    // convert to 2-dimensional
    this.tiles = [];
    var id = 0;
    for(var i = 0; i < num_rows; i++) {
      var row = this.tiles[i] = [];
      for(var j = 0; j < num_cols; j++)
        row.push(this.tiles1x[id++]);
    }
    /*return {
      tiles: tiles,
      button: {caption: 'Restart', class: ''},
      time: ''
    }*/
    this.button = {caption: 'Restart', class: ''};
    this.time = '';
  },

  restart: function() {
    this.start();
    this.setState({
      tiles: this.tiles,
      button: this.button,
      time: this.time
    });
  },

  getInitialState: function() {
    this.game = new TilesGame({
      on_show: this.showTile,
      on_hide: this.hideTile,
      on_miss: this.hideTwix,
      on_hit: this.removeTwix,
      on_gameover: this.gameOver
    });
    //return this.start(); // ???
    this.start();
    return {
      tiles: this.tiles,
      button: this.button,
      time: this.time
    }
  },

  gameOver: function(time) {
    this.setState({
      button: {caption: 'Congratulations!', class: 'gameover'},
      time: 'Your time: ' + time + ' s'
    });
  },

  showTile: function(tile) {
    tile.show = true;
    this.forceUpdate();
  },

  hideTile: function(tile) {
    tile.show = false;
    this.forceUpdate();
  },

  removeTwix: function(tile1, tile2) {
    var self = this;
    setTimeout(function() {
      tile1.remove = true;
      tile2.remove = true;
      self.forceUpdate();
    }, 500);
  },

  hideTwix: function(tile1, tile2) {
    var self = this;
    setTimeout(function() {
      tile1.show = false;
      tile2.show = false;
      self.forceUpdate();
    }, 500);
  },

  render: function() {
    return (
      <div className="tiles-game">
        <TilesTable data={this.state.tiles} icons={this.icons} pick={this.pick} />
        <div className="center spaced padded">Level:
          <select>
            <option value="1">Beginner</option>
            <option value="2">Medium</option>
            <option value="3">Expert</option>
          </select>
        </div>
        <div className="center spaced padded">
          <button className={"btn large rounded " + this.state.button.class} onClick={this.restart}>
            {this.state.button.caption} {this.state.time}
          </button>
        </div>
      </div>
    );
  }
});

var TilesTable = React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data
    };
  },
  render: function() {
    var tilesRows = this.renderRows();
    return (
      <table className="tile-table">
        <tbody>
          {tilesRows}
        </tbody>
      </table>
    );
  },
  renderRows: function() {
    var icons = this.props.icons,
        pick = this.props.pick;
    return this.state.data.map(function(row, index) {
      var tilesCols = row.map(function(tile, j) {
        return (
          <td className="nest" key={tile.id}>
            <div className={"nest-tile " + (tile.remove ? "hidden" : "")}
              data-icon={tile.icon} onMouseDown={pick.bind(null, tile)}>
              <i className={"fa fa-5x fa-" + icons[tile.icon] + (tile.show ? "" : " hidden")} aria-hidden="true"></i>
            </div>
          </td>
        );
      });
      return (
        <tr key={index}>
          {tilesCols}
        </tr>
      );
    });
  }

});

ReactDOM.render(
  <TilesGameApp level="2" />,
  document.getElementById('game')
);

