/*
  Tiles Classic Game
  andy.pro
  https://github.com/andy-pro/Tiles-Game-React
  React
  10.07.2016
*/

'use strict';

import Logic from './logic';
import React from 'react';
import CSSTransition from 'react-addons-css-transition-group';

export default class TilesGame extends React.Component {

  constructor(props) {

    super(props);

    this.icons = [
      // visit 'http://fontawesome.io/icons' for details
      "bluetooth", "youtube-square", "envira", "bank", "car",
      "binoculars", "camera-retro", "firefox", "futbol-o", "cogs"
    ];

    this.presets = [
      {pairs: 6, cols: 4}, // beginner, level 1
      {pairs: 8, cols: 4}, // medium, level 2
      {pairs: 10, cols: 5} // expert, level 3
    ];

    // Bind instance methods / callbacks to the instance
    // http://www.newmediacampaigns.com/blog/refactoring-react-components-to-es6-classes
    this.restart = this.restart.bind(this);
    this.changeLevel = this.changeLevel.bind(this);
    this.game = new Logic({
      on_show: this.showTile.bind(this),
      on_hide: this.hideTile.bind(this),
      on_miss: this.hideTwix.bind(this),
      on_hit: this.removeTwix.bind(this),
      on_gameover: this.gameOver.bind(this)
    });

    this.state = this.start();

  }

  start() {
    const level = +(this.state ? this.state.level : this.props.level);
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
  }

  restart() {
    this.setState(this.start());
  }

  changeLevel(event) {
    this.setState({
      level: event.target.value
    });
  }

  gameOver(time) {
    this.setState({
      button: {caption: 'Congratulations!', class: 'gameover'},
      time: 'Your time: ' + time + ' s'
    });
  }

  showTile(tile) {
    tile.show = true;
    this.forceUpdate();
  }

  hideTile(tile) {
    tile.show = false;
    this.forceUpdate();
  }

  removeTwix(tile1, tile2) {
    setTimeout( () => {
      tile1.remove = true;
      tile2.remove = true;
      this.forceUpdate();
    }, 500);
  }

  hideTwix(tile1, tile2) {
    setTimeout( () => {
      tile1.show = false;
      tile2.show = false;
      this.forceUpdate();
    }, 500);
  }

  render() {
    var icons = this.icons,
        pick = this.game.pick,
        pickthis = this.game;
    return (
      <div className="tiles-game">
        <table className="tile-table">
          <tbody>
            { this.state.tiles.map( (row, index) => {
              return (
                <tr key={index}>
                  { row.map( (tile, j) => {
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

}

TilesGame.propTypes = { level: React.PropTypes.string };
TilesGame.defaultProps = { level: '2' };
