"use strict";

var gameField;
var numbersPool = [];
var sidesName = ['front', 'right', 'back', 'left', 'top', 'bottom'];
var startButton;
var restartButton;
var endGameButton;
var compliments;
var movesAmount;
var highlight;
var firstNumber = null;
var secondNumber = null;
var elem;
var timeout = 0;
var cubesCount = 20;
var movesCount = 0;
var gameOver = false;
var wrapper = document.querySelector('.wrapper');
var result = document.createElement('div');
result.className = 'result';

function createStartButton() {
  startButton = document.createElement('button');
  startButton.innerHTML = 'начать игру';
  startButton.className = 'startButton';
  startButton.addEventListener('click', startGame);
  highlight = document.createElement('div');
  highlight.className = 'highlight';
  wrapper.appendChild(startButton);
}

;

function getRandomPool() {
  while (numbersPool.length < 20) {
    for (var i = 1; i < 11; i++) {
      numbersPool.push(i);
    }

    ;
  }

  ;
  var random;
  var buffer1;
  var buffer2;

  for (var _i = 0; _i < numbersPool.length; _i++) {
    random = Math.ceil(Math.random() * 19);
    buffer1 = numbersPool[_i];
    buffer2 = numbersPool[random];
    numbersPool[_i] = buffer2;
    numbersPool[random] = buffer1;
  }

  ;
}

;

function createGameField() {
  gameField = document.createElement('div');
  gameField.className = 'gameField';
  return gameField;
}

;

function createCube() {
  var cubeContainer = document.createElement('div');
  cubeContainer.className = 'cubeContainer';
  var cube = document.createElement('div');
  cube.className = 'cube';
  cubeContainer.appendChild(cube);
  var side;

  for (var i = 0; i < 6; i++) {
    side = document.createElement('div');
    side.className = 'side ' + sidesName[i];
    cube.appendChild(side);
  }

  return cubeContainer;
}

;

function addBlocks(delay) {
  var cube;
  var backSide;
  var span;

  var _loop = function _loop(i) {
    setTimeout(function () {
      cube = createCube();
      gameField.appendChild(cube);
      backSide = document.querySelectorAll('.back');
      span = document.createElement('span');
      backSide[i].appendChild(span);
      span.innerHTML = numbersPool[i];
    }, timeout);
    timeout += delay;
  };

  for (var i = 0; i < 20; i++) {
    _loop(i);
  }

  ;
}

;

function getCubes() {
  var cubes = document.querySelectorAll('.cube');

  for (var i = 0; i < cubes.length; i++) {
    cubes[i].addEventListener('click', Pick);
  }

  ;
}

;

function addButtonsPanel() {
  restartButton = document.createElement('button');
  restartButton.className = 'restartButton';
  restartButton.innerHTML = 'начать заново';
  restartButton.addEventListener('click', restartGame);
  endGameButton = document.createElement('button');
  endGameButton.className = 'endGameButton';
  endGameButton.innerHTML = 'закончить игру';
  endGameButton.addEventListener('click', endGame);
  wrapper.appendChild(restartButton);
  wrapper.appendChild(endGameButton);
}

;

function startButtonHide() {
  startButton.className += ' hide';
  setTimeout(function () {
    return startButton.setAttribute('style', 'display: none');
  }, 300);
}

;
var timeout2 = 0;

function clearField(delay, animation, duration) {
  var cubes = document.querySelectorAll('.cube');
  var backs = document.querySelectorAll('.back');

  var _loop2 = function _loop2(i) {
    if (cubes[i].getAttribute('style') === 'display: none;') {} else {
      backs[i].innerHTML = '';
      cubes[i].addEventListener('animationend', function () {
        return cubes[i].setAttribute('style', 'display: none');
      });
      setTimeout(function () {
        return cubes[i].setAttribute('style', 'animation: ' + animation + ' ' + duration + 's;');
      }, timeout2);
      timeout2 += delay;
    }

    ;
  };

  for (var i = cubes.length - 1; i >= 0; i--) {
    _loop2(i);
  }

  ;

  if (timeout2 === 0) {
    timeout2 = 900;
  }

  setTimeout(function () {
    return wrapper.removeChild(gameField);
  }, timeout2);
  firstNumber = null;
  secondNumber = null;
  cubesCount = 20;
}

;

function startGame() {
  startButtonHide();
  setTimeout(function () {
    wrapper.appendChild(createGameField());
    getRandomPool();
    addBlocks(60);
    setTimeout(function () {
      return addButtonsPanel();
    }, timeout + 200);
    setTimeout(function () {
      return getCubes();
    }, timeout);
    timeout = 0;
  }, 400);
}

;

function restartGame() {
  if (gameOver === true) {
    removeCompliments();
  }

  clearField(30, 'cubeDisappearanceScale', 0.3);
  setTimeout(function () {
    wrapper.appendChild(createGameField());
    getRandomPool();
    addBlocks(30);
    setTimeout(function () {
      return getCubes();
    }, timeout);
    timeout = 0;
  }, timeout2);
  timeout2 = 0;
}

;

function endGame() {
  if (gameOver == true) {
    removeCompliments();
  }

  clearField(0, 'cubeDisappearanceOpacity', 0.8);
  restartButton.addEventListener('animationend', function () {
    return wrapper.removeChild(restartButton);
  });
  endGameButton.addEventListener('animationend', function () {
    return wrapper.removeChild(endGameButton);
  });
  restartButton.setAttribute('style', 'animation: restartButtonDisappearance .8s');
  endGameButton.setAttribute('style', 'animation: endButtonDisappearance .8s');
  setTimeout(function () {
    startButton.removeAttribute('style');
    startButton.className = 'startButton';
  }, timeout2);
  timeout2 = 0;
}

;

function removeCompliments() {
  compliments.addEventListener('animationend', function () {
    return wrapper.removeChild(compliments);
  });
  movesAmount.addEventListener('animationend', function () {
    return wrapper.removeChild(movesAmount);
  });
  result.addEventListener('animationend', function () {
    return wrapper.removeChild(result);
  });
  setTimeout(function () {
    return compliments.setAttribute('style', 'animation: complimentsDisappearence .5s');
  }, 550);
  setTimeout(function () {
    return movesAmount.setAttribute('style', 'animation: complimentsDisappearence .5s');
  }, 250);
  result.setAttribute('style', 'animation: complimentsDisappearence .5s');
}

;

function Pick() {
  this.className += ' show';
  var value;

  if (firstNumber === null) {
    elem = this;
    value = this.querySelector('span');
    firstNumber = value.innerHTML;
    console.log(firstNumber);
  } else {
    if (this === elem) {
      this.className = 'cube';
      firstNumber = null;
    } else {
      value = this.querySelector('span');
      secondNumber = value.innerHTML;
      console.log(secondNumber);

      if (firstNumber != secondNumber) {
        firstNumber = null;
        secondNumber = null;
        noMatchHide(this, elem);
        console.log('no match!');
      } else {
        firstNumber = null;
        secondNumber = null;
        console.log('match!');
        matchHide(this, elem);
      }
    }
  }
}

;

function noMatchHide(element1, element2) {
  var firstElement = element1;
  var secondElement = element2;
  setTimeout(function () {
    firstElement.className = 'cube';
    secondElement.className = 'cube';
  }, 1100);
  movesCount += 1;
}

;

function matchHide(element1, element2) {
  var firstElement = element1;
  var secondElement = element2;
  var back1 = firstElement.querySelector('.back');
  var back2 = secondElement.querySelector('.back');
  setTimeout(function () {
    back1.setAttribute('style', 'color: #ACFF0E; border: 3px solid #ACFF0E;');
    back2.setAttribute('style', 'color: #ACFF0E; border: 3px solid #ACFF0E;');
  }, 700);
  firstElement.addEventListener('animationend', function () {
    return firstElement.setAttribute('style', 'display: none;');
  });
  secondElement.addEventListener('animationend', function () {
    return secondElement.setAttribute('style', 'display: none;');
  });
  setTimeout(function () {
    firstElement.setAttribute('style', 'animation: cubeDisappearanceScale .3s;');
    secondElement.setAttribute('style', 'animation: cubeDisappearanceScale .3s;');
    setTimeout(function () {
      cubesCount -= 2;

      if (cubesCount === 0) {
        compliments = document.createElement('div');
        compliments.className = 'compliments';
        compliments.innerHTML = 'Поздравляем!';
        movesAmount = document.createElement('div');
        movesAmount.className = 'moves';
        movesAmount.innerHTML = 'Количество ваших ходов:';
        wrapper.appendChild(compliments);
        setTimeout(function () {
          return wrapper.appendChild(movesAmount);
        }, 250);
        setTimeout(function () {
          return wrapper.appendChild(result);
        }, 550);
        result.innerHTML = movesCount;
        cubesCount = 20;
        movesCount = 0;
        gameOver = true;
      }

      ;
    }, 300);
  }, 1000);
}

;

function test() {
  wrapper.removeChild(gameField);
  compliments = document.createElement('div');
  compliments.className = 'compliments';
  compliments.innerHTML = 'Поздравляем!';
  movesAmount = document.createElement('div');
  movesAmount.className = 'moves';
  movesAmount.innerHTML = 'Количество ваших ходов:';
  setTimeout(function () {
    return wrapper.appendChild(result);
  }, 550);
  setTimeout(function () {
    return wrapper.appendChild(movesAmount);
  }, 250);
  wrapper.appendChild(compliments);
  result.innerHTML = movesCount;
  setTimeout(removeCompliments, 3000);
}

createStartButton();