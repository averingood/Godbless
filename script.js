var W = '♀';
var P = '♂';
var F = '†';
var E = ' ';
var up = 'up', down = 'down', left = 'left', right = 'right';


function createMap(width, height) {
  var map = [];
  for (var y = 0; y < height; y++) {
    map[y] = [];
    for (var x = 0; x < width; x++) {
      map[y][x] = W;
    }
  }
  map.width = width;
  map.height = height;
  map.player = { x: 0, y: 0 };
  map.finish = { x: width - 1, y: height - 1 };
  dig(map, height - 1, width - 1);
  dig(map, 0, 0);
  map[0][0] = E;
  return map;
}

function dig(map, y, x){
  if (!canDig(map, y, x)){ return false }
  map[y][x] = E;
  ways = shuffleWays();
  for (var i = 0; i <= ways.length; i++){
    if (ways[i] == down){
      dig(map, y + 1, x);
    }
    if (ways[i] == up){
      dig(map, y - 1, x);
    }
    if (ways[i] == left){
      dig(map, y, x - 1);
    }
    if (ways[i] == right){
      dig(map, y, x + 1);
    }
  }
}

function shuffleWays(){
  return [up, down, right, left].sort((a, b) => Math.random() - 0.5);
}

function isValidPosition(map, y, x) {
  return x >= 0 && y >= 0 && y < map.height && x < map.width;
}

function canDig(map, y, x){
  var counter = 0;
  if (!isValidPosition(map, y, x)) return false;
  if (map[y][x] === E) return false;
  if (y < map[0].length - 1){
    if (map[y + 1][x] == E) ++counter;
  }
  if (x < map.length - 1){
    if (map[y][x + 1] == E) ++counter;
  }
  if (y > 0){
    if (map[y - 1][x] == E) ++counter;
  }
  if (x > 0){
    if (map[y][x - 1] == E) ++counter;
  }
  return counter < 2;
}

function renderMap(map) {
  if (map.player.x === map.finish.x && map.player.y === map.finish.y){
    finishGame(map);
    return '<table>God loves you!<p>Do it again...</table>';
  }
  var html = '<table>';
  for (var y = 0; y < map.height; y++) {
    html += '<tr>';
    for(var x = 0; x < map.width; x++) {
      if (map.player.x === x && map.player.y === y) {
         html += '<td class="player"></td>';
      } else if (map.finish.x === x && map.finish.y === y) {
         html += '<td class="finish"></td>';
      } else if (map[y][x] === E) {
         html += '<td></td>';
      } else {
         html += '<td class="wall"></td>';
      }
    }
    html += '</tr>';
  }
  html += '</table>';
  return html;
}

function createGame(height, width) {
  var map = createMap(height, width);
  var render = function () {
    document.querySelector('.game').innerHTML = renderMap(map);
  };
  var game = {
    map: map,
    stepUp: function () {
      if (!canStep(map, map.player.y - 1, map.player.x)) return false;
      map.player.y--;
      render();
    },
    stepDown: function () {
      if (!canStep(map, map.player.y + 1, map.player.x)) return false;
      map.player.y++;
      render();
    },
    stepLeft: function () {
      if (!canStep(map, map.player.y, map.player.x - 1)) return false;
      map.player.x--;
      render();
    },
    stepRight: function () {
      if (!canStep(map, map.player.y, map.player.x + 1)) return false;
      map.player.x++;
      render();
    },
    restart: function () {
      map = createMap(10, 10);
      render();
    }
  };
  dig(map, 0, 0);
  render();
  bindKeys(map, function(){ renderMap(map) });
  return game;
}

function canStep(map, y, x){
  if (!isValidPosition(map, y, x)) return false;
  return map[y][x] !== W;
}

function bindKeys(map){
  document.onkeydown = function (event){
    if (event.key === 'ArrowDown'){
      game.stepDown();
    }
    if (event.key === 'ArrowUp'){
      game.stepUp();
    }
    if (event.key === 'ArrowLeft'){
      game.stepLeft();
    }
    if (event.key === 'ArrowRight'){
      game.stepRight();
    }
  }
}

function finishGame(map){
  var sound = document.querySelector('.sound-finish')
  sound.volume = 1;
  sound.play();
  setTimeout(function() {
    game = createGame(map.height + 1, map.width + 1);
    sound.volume = 0;
  }, 1700);
}

game = createGame(7, 7);

