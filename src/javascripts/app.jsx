/*
  Tiles Classic Game
  andy.pro
  https://github.com/andy-pro/Tiles-Game-React
  React
  10.07.2016
*/

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TilesGame from 'components/tiles-game/tiles-game';

ReactDOM.render(
  <TilesGame level='2' />,
  document.getElementById('content')
);
