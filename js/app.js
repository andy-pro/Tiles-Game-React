/*
  Tiles Classic Game
  andy.pro
  https://github.com/andy-pro/Tiles-Game-React
  react
  22.06.2016
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

  start: function() {
    var level = +(this.state ? this.state.level : (this.props.level || "2"));
    if(level < 1 || level > this.presets.length) {
      throw "you choosed invalid level!";
    }
    var preset = this.presets[level-1],
        num_pairs = preset.pairs,
        num_tiles = num_pairs * 2,
        num_cols = preset.cols,
        num_rows = ~~(num_tiles / num_cols);
    this.tiles1x = this.game.start(num_pairs);
    // convert to 2-dimensional
    var tiles = [];
    var id = 0;
    for(var i = 0; i < num_rows; i++) {
      var row = tiles[i] = [];
      for(var j = 0; j < num_cols; j++)
        row.push(this.tiles1x[id++]);
    }
    return {
      tiles: tiles,
      button: {caption: 'Restart', class: ''},
      time: '',
      level: level
    }
  },

  restart: function() {
    this.setState(this.start());
  },

  changeLevel: function(event) {
    this.setState({
      level: event.target.value
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
    return this.start();
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
    var icons = this.icons,
        pick = this.game.pick,
        pickthis = this.game;
    return (
      <div className="tiles-game">
        <table className="tile-table">
          <tbody>
            { this.state.tiles.map(function(row, index) {
              return (
                <tr key={index}>
                  { row.map(function(tile, j) {
                    return (
                      <td className="nest" key={tile.id}>
                        <CSSTransition
                        transitionName="tile"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}>
                          { tile.remove ? '' :
                            <div className="nest-tile"
                            data-icon={tile.icon}
                            onMouseDown={pick.bind(pickthis, tile)}>
                              <CSSTransition
                              transitionName="tile"
                              transitionEnterTimeout={500}
                              transitionLeaveTimeout={500}>
                                { tile.show ?
                                  <i className={"fa fa-5x fa-" + icons[tile.icon]}
                                  aria-hidden="true"></i> : ''
                                }
                              </CSSTransition>
                            </div>
                          }
                        </CSSTransition>
                      </td>
                    );
                  }) }
                </tr>
              );
            }) }
          </tbody>
        </table>
        <div className="center spaced padded">Level:
          <select value={this.state.level}
          onChange={this.changeLevel}>
            <option value="1">Beginner</option>
            <option value="2">Medium</option>
            <option value="3">Expert</option>
          </select>
        </div>
        <div className="center spaced padded">
          <button className={"btn large rounded " + this.state.button.class}
          onClick={this.restart}>
            {this.state.button.caption} {this.state.time}
          </button>
        </div>
      </div>
    );
  }

});

var CSSTransition = React.addons.CSSTransitionGroup;

ReactDOM.render(
  <TilesGameApp level="2" />,
  document.getElementById('game')
);
