function createDomElement(tag, className, inner){
	let element = document.createElement(tag);
	element.className = className;

	if (inner !== undefined){
		element.innerHTML = inner;
	}
	return element;
}

const CUBE_HIDE_DELAY = 30;
const CUBE_APPEARANCE_DELAY = 60;
const CUBE_HIDE_ANIMATION = 'cubeDisappearanceScale .3s;';
const CUBE_END_GAME_ANIMATION = 'cubeDisappearanceOpacity .8s;';
const SIDES_NAMES = ['front', 'right', 'back', 'left', 'top', 'bottom'];

const COMPLIMENTS_DISAP_ANIM = 'complimentsDisappearence .5s;';

let gl_firstNumber = null;
let gl_secondNumber = null;
let gl_cubeRemains = 20;
let gl_movesCount = 0;
let gl_gameEnd = false;
let gl_previousCube;

const app = document.querySelector('.app');
const compliments = createDomElement('div', 'compliments', 'Поздравляем!');
const moveScore = createDomElement('div', 'moves', 'Количество ваших ходов:');
const score = createDomElement('div', 'score');

const restartButton = createDomElement('button', 'restart-button', 'начать заново');
restartButton.addEventListener('click', restartGame);

const endGameButton = createDomElement('button', 'end-game-button', 'закончить игру');
endGameButton.addEventListener('click', endGame);

const buttonBar = createDomElement('div', 'button-bar');
buttonBar.appendChild(restartButton);
buttonBar.appendChild(endGameButton);

const startButton = createDomElement('button', 'start-button', 'начать игру');
startButton.addEventListener('click', startGame);
app.appendChild(startButton);

async function startGame() {
	await _hideStartButton();
	await createStage();
	_addButtonBar();

	function _hideStartButton() {
		return new Promise(resolve => {
			startButton.classList.add('hide');

			setTimeout(() => {
				startButton.setAttribute('style', 'display: none');
				resolve();
			}, 300);
		})
	}

	function _addButtonBar() {
		app.append(buttonBar);
		_stickButtonBar();

		function _stickButtonBar(){
			let x = buttonBar.offsetLeft;
			let y = buttonBar.offsetTop;
	
			buttonBar.setAttribute('style', `position: absolute; left: ${x}px; top: ${y}px;`) 
		}
	}
}

async function restartGame() {
	checkEndGame();
	await _clearStage(CUBE_HIDE_DELAY, CUBE_HIDE_ANIMATION);
	createStage();	
	
	async function _clearStage(delay, animation){
		await _removeCubes();
		_deleteStage();
		_resetCounters();
	
		return new Promise(resolve => resolve());
	
		async function _removeCubes(){
			let cubes = document.querySelectorAll('.cube');
			
			for (let i = cubes.length - 1; i >= 0; i--){
				await _hideCube(cubes[i]);
			}
	
			function _hideCube(cube){
				return new Promise(resolve => {
					if (cube.style.display !== 'none'){	
						cube.addEventListener('animationend', () => cube.setAttribute('style', 'display: none'));
		
						setTimeout(() => {
							cube.setAttribute('style', 'animation: ' + animation);
							resolve();
						}, delay);
		
					} else {
						setTimeout(() => resolve(), delay);
					}
				});
			}
		}
	
		function _deleteStage(){
			let stage = app.querySelector('.stage');
			
			if (stage){
				app.removeChild(stage)
			}
		}
	
		function _resetCounters(){
			gl_firstNumber = null;
			gl_secondNumber = null;
			gl_cubeRemains = 20;
		}
	}
}

function endGame(){	
	checkEndGame();
	_removeStage();
	_swapButtons();

	function _removeStage(){
		let cubes = app.querySelectorAll('.cube');

		for (let cube of cubes){
			if (cube.style.display !== 'none'){
				cube.querySelector('.back').innerHTML = '';
				cube.addEventListener('animationend', () => cube.setAttribute('style', 'display: none'));
				cube.setAttribute('style', 'animation: ' + CUBE_END_GAME_ANIMATION);
			}
		}
	}

	function _swapButtons(){
		restartButton.setAttribute('style', 'animation: restartButtonDisappearance .8s');
		endGameButton.setAttribute('style', 'animation: endButtonDisappearance .8s');

		setTimeout(() => {
			let stage = app.querySelector('.stage');

			app.removeChild(stage);
			app.removeChild(buttonBar);	

			restartButton.removeAttribute('style');
			endGameButton.removeAttribute('style');

			startButton.removeAttribute('style');
			startButton.classList.remove('hide');
		}, 800);
	}
}

async function createStage() {
	const stage = createDomElement('div', 'stage');
	app.appendChild(stage);

	const cubes = _createCubes();
	await _addCubes(CUBE_APPEARANCE_DELAY);

	return new Promise(resolve => resolve());

	function _createCubes() {
		let numbers = _getRandomNumbers();
		let cubes = [];
	
		for (let i = 0; i < numbers.length; i++){
			let cube = _createCube();
			_addNumberToCube(cube, numbers[i]);
			cubes.push(cube);
		}
	
		return cubes;
	
		function _createCube() {
			let cubeContainer = createDomElement('div', 'cube-container');
			let cube = createDomElement('div', 'cube'); 
			
			_addCubeSideClasses();		
			cube.addEventListener('click', clickCube);
			cubeContainer.appendChild(cube);
			
			return cubeContainer;	
	
			function _addCubeSideClasses(){
				for (let i = 0; i < SIDES_NAMES.length; i++){
					let side = document.createElement('div');
					side.className = 'side ' + SIDES_NAMES[i];
					cube.appendChild(side);
				}
			}
		}
	
		function _addNumberToCube(cube, number) {
			let cubeBackSide = cube.querySelector('.back');
			let numberCell = document.createElement('span');
			numberCell.innerHTML = number;
			cubeBackSide.appendChild(numberCell);
		}
	
		function _getRandomNumbers() {
			let numbers = [];
		
			_fillNumbersPool();
			_shuffleNumbersPool();
		
			return numbers;
		
			function _fillNumbersPool() {
				while (numbers.length < 20){
					for(let i = 1; i <= 10; i++){
						numbers.push(i);
					}
				}
			}
			
			function _shuffleNumbersPool() {
				let random;
				let buffer1;
				let buffer2;
		
				for (let i = 0; i < numbers.length; i++){
					random = Math.ceil(Math.random() * 19);
					buffer1 = numbers[i];
					buffer2 = numbers[random];
					numbers[i] = buffer2;
					numbers[random] = buffer1;
				}
			}
		}
	}

	async function _addCubes(delay) {
		for (let cube of cubes){
			await appendCube(cube);
		}
	
		return new Promise(resolve => resolve());
	
		function appendCube(cube){
			return new Promise(resolve => {
				setTimeout(() => {
					stage.appendChild(cube);
					resolve();
				}, delay);
			});
		}
	}
}

function checkEndGame(){
	if (gl_gameEnd == true){
		removeScoreBoard();
	}
}

function showScore(){
	setTimeout(() => app.appendChild(score),550);
	setTimeout(() => app.appendChild(moveScore),250);				
	app.appendChild(compliments);

	score.innerHTML = gl_movesCount;
	gl_cubeRemains = 20;
	gl_movesCount = 0;
	gl_gameEnd = true;
}

function removeScoreBoard(){
	compliments.addEventListener('animationend', _removeCompliments);
	moveScore.addEventListener('animationend', _removeMoveScore);
	score.addEventListener('animationend', _removeScore);

	setTimeout(() => {compliments.setAttribute('style', 'animation: ' + COMPLIMENTS_DISAP_ANIM)}, 550);
	setTimeout(() => moveScore.setAttribute('style', 'animation: ' + COMPLIMENTS_DISAP_ANIM), 250);
	score.setAttribute('style', 'animation: ' + COMPLIMENTS_DISAP_ANIM);
	
	function _removeCompliments(){
		app.removeChild(compliments);
		compliments.setAttribute('style', 'animation: complimentsAppearence .4s;');
		compliments.removeEventListener('animationend', _removeCompliments);
	}

	function _removeMoveScore(){
		app.removeChild(moveScore);
		moveScore.setAttribute('style', 'animation: movesAppearence .4s;');
		moveScore.removeEventListener('animationend', _removeMoveScore);
	}

	function _removeScore(){
		app.removeChild(score);
		score.setAttribute('style', 'animation: resultAppearence 2.8s;');
		score.removeEventListener('animationend', _removeScore);
	}
}

function clickCube(){
	this.classList.add('show');
	
	if (gl_firstNumber === null){
		gl_previousCube = this;		
		gl_firstNumber = this.querySelector('span').innerHTML;
	} else {

		if (this === gl_previousCube){
			this.classList.remove('show');
			gl_firstNumber = null;
			return;
		}

		gl_secondNumber = this.querySelector('span').innerHTML;

		if (gl_firstNumber != gl_secondNumber){
			gl_firstNumber = null;
			gl_secondNumber = null;		
			_hideWithNoMatch(this, gl_previousCube);
		} else {
			gl_firstNumber = null;
			gl_secondNumber = null;
			_hideWithMatch(this, gl_previousCube);			
		}
	}

	function _hideWithNoMatch(element1, element2){
		setTimeout(() => {
			element1.classList.remove('show');
			element2.classList.remove('show');
		}, 1100);
		gl_movesCount += 1;
	}

	function _hideWithMatch(element1, element2){
		_highlightCubes();
		_removeCubes();

		function _highlightCubes(){
			let back1 = element1.querySelector('.back');
			let back2 = element2.querySelector('.back');
		
			setTimeout(() => {
				back1.setAttribute('style', 'color: #ACFF0E; border: 3px solid #ACFF0E;');
				back2.setAttribute('style', 'color: #ACFF0E; border: 3px solid #ACFF0E;');
			}, 700);
		}

		function _removeCubes(){
			element1.addEventListener('animationend', () => element1.setAttribute('style', 'display: none;'));
			element2.addEventListener('animationend', () => element2.setAttribute('style', 'display: none;'));
			
			setTimeout(() => {
				element1.setAttribute('style', 'animation: cubeDisappearanceScale .3s;');
				element2.setAttribute('style', 'animation: cubeDisappearanceScale .3s;');
		
				setTimeout(() => {
					gl_cubeRemains -= 2;						
					if (gl_cubeRemains === 0){				
						showScore();
					}
				}, 300);				
			}, 1000);
		}
	}
}