let gameField;
let numbersPool = [];
let sidesName = ['front', 'right', 'back', 'left', 'top', 'bottom'];

let startButton;
let restartButton;
let endGameButton;
let compliments;
let movesAmount;

let highlight;

let firstNumber = null;
let secondNumber = null;
let elem;

let timeout = 0;
let cubesCount = 20;
let movesCount = 0;

let gameOver = false;

let wrapper = document.querySelector('.wrapper');
let result = document.createElement('div');
result.className = 'result';

function createStartButton(){
	
	startButton = document.createElement('button');
	startButton.innerHTML = 'начать игру';
	startButton.className = 'startButton';
	startButton.addEventListener('click', startGame);

	highlight = document.createElement('div');
	highlight.className = 'highlight';	

	wrapper.appendChild(startButton);
	
};

function getRandomPool(){
		
	while (numbersPool.length < 20){
		for(let i = 1; i < 11; i++){
			numbersPool.push(i);
	};
	};

	let random;
	let buffer1;
	let buffer2;


	for (let i = 0; i < numbersPool.length; i++){
		random = Math.ceil(Math.random() * 19);
		buffer1 = numbersPool[i];
		buffer2 = numbersPool[random];
		numbersPool[i] = buffer2;
		numbersPool[random] = buffer1;
	};
};

function createGameField(){
	gameField = document.createElement('div');
	gameField.className = 'gameField';
	return gameField;
};

function createCube(){
	let cubeContainer = document.createElement('div');
	cubeContainer.className = 'cubeContainer';

	let cube = document.createElement('div');  
	cube.className = 'cube';

	cubeContainer.appendChild(cube);

	let side;
	
	for (let i = 0; i < 6; i++){
		side = document.createElement('div');
		side.className = 'side ' + sidesName[i];
		cube.appendChild(side);
	}						
	return cubeContainer;	
};


function addBlocks(delay){
	let cube;
	let backSide;
	let span;

	for (let i = 0; i < 20; i++){
		setTimeout(() => {
			cube = createCube();					
			gameField.appendChild(cube);

			backSide = document.querySelectorAll('.back');
			span = document.createElement('span');
			backSide[i].appendChild(span);
			span.innerHTML = numbersPool[i];
		}, timeout);
		timeout += delay;
	};

};

function getCubes(){
	let cubes = document.querySelectorAll('.cube');	
	for(let i = 0; i < cubes.length; i++){		
		cubes[i].addEventListener('click', Pick);
	};
};

function addButtonsPanel(){	

	restartButton = document.createElement('button');
	restartButton.className = 'restartButton'
	restartButton.innerHTML = 'начать заново';
	restartButton.addEventListener('click', restartGame);

	endGameButton = document.createElement('button');
	endGameButton.className = 'endGameButton';
	endGameButton.innerHTML = 'закончить игру';
	endGameButton.addEventListener('click', endGame);
	
	wrapper.appendChild(restartButton);
	wrapper.appendChild(endGameButton);
	
};

function startButtonHide(){
	startButton.className += ' hide';
	setTimeout(() => startButton.setAttribute('style', 'display: none'), 300);
};

let timeout2 = 0;

function clearField(delay, animation, duration){
	let cubes = document.querySelectorAll('.cube');
	let backs = document.querySelectorAll('.back');	
	for (let i = cubes.length - 1; i >= 0 ; i--){
		if (cubes[i].getAttribute('style') === 'display: none;'){			
		} else{
			backs[i].innerHTML = '';
			cubes[i].addEventListener('animationend', () => cubes[i].setAttribute('style', 'display: none'));			
			setTimeout(() => cubes[i].setAttribute('style', 'animation: ' + animation + ' ' + duration + 's;'), timeout2);
			timeout2 += delay;						
		};
	};
	if (timeout2 === 0){
		timeout2 = 900;
	}	
	setTimeout(() => wrapper.removeChild(gameField), timeout2);
	firstNumber = null;
	secondNumber = null;
	cubesCount = 20;
};

function startGame(){
	startButtonHide();
	setTimeout(() => {
		wrapper.appendChild(createGameField());
		getRandomPool();
		addBlocks(60);
		setTimeout(() => addButtonsPanel(), timeout + 200);
		setTimeout(() => getCubes(), timeout);
		timeout = 0;
	}, 400)
	
};

function restartGame(){
	if (gameOver === true){
		removeCompliments();
	}
	clearField(30, 'cubeDisappearanceScale', 0.3);
	setTimeout(() => {
		wrapper.appendChild(createGameField());	
		getRandomPool();
		addBlocks(30);
		setTimeout(() => getCubes(), timeout);	
		timeout = 0;
	}, timeout2);
	timeout2 = 0;		
};

function endGame(){	
	if (gameOver == true){
		removeCompliments();
	}
	clearField(0, 'cubeDisappearanceOpacity', 0.8);

	restartButton.addEventListener('animationend', () => wrapper.removeChild(restartButton));
	endGameButton.addEventListener('animationend', () => wrapper.removeChild(endGameButton));
	restartButton.setAttribute('style', 'animation: restartButtonDisappearance .8s');
	endGameButton.setAttribute('style', 'animation: endButtonDisappearance .8s');
	setTimeout(() => {		
		startButton.removeAttribute('style');
		startButton.className = 'startButton';
	}, timeout2);
	timeout2 = 0	
};

function removeCompliments(){
	compliments.addEventListener('animationend', () => wrapper.removeChild(compliments));
	movesAmount.addEventListener('animationend', () => wrapper.removeChild(movesAmount));
	result.addEventListener('animationend', () => wrapper.removeChild(result));

	setTimeout(() => compliments.setAttribute('style', 'animation: complimentsDisappearence .5s'), 550);
	setTimeout(() => movesAmount.setAttribute('style', 'animation: complimentsDisappearence .5s'), 250);
	result.setAttribute('style', 'animation: complimentsDisappearence .5s');
};

function Pick(){	
	this.className += ' show';
	let value;	
	
	if (firstNumber === null){

		elem = this;		
		value = this.querySelector('span');
		firstNumber = value.innerHTML;
		console.log(firstNumber);		
	} else {
		if (this === elem){
			this.className = 'cube';
			firstNumber = null;

		} else {
			value = this.querySelector('span');
			secondNumber = value.innerHTML;
			console.log(secondNumber);

			if (firstNumber != secondNumber){
			firstNumber = null;
			secondNumber = null;		
			noMatchHide(this, elem);
			
			console.log('no match!')

			} else {
				firstNumber = null;
				secondNumber = null;
				console.log('match!');
				matchHide(this, elem);			
		}
		}
		
	}
	
};

function noMatchHide(element1, element2){
	let firstElement = element1;
	let secondElement = element2;
	setTimeout(() => {
		firstElement.className = 'cube';
		secondElement.className = 'cube';
	}, 1100);
	movesCount += 1;
};

function matchHide(element1, element2){
	let firstElement = element1;
	let secondElement = element2;

	let back1 = firstElement.querySelector('.back');
	let back2 = secondElement.querySelector('.back');

	setTimeout(() => {
		back1.setAttribute('style', 'color: #ACFF0E; border: 3px solid #ACFF0E;');
		back2.setAttribute('style', 'color: #ACFF0E; border: 3px solid #ACFF0E;');
	}, 700);		
	
	firstElement.addEventListener('animationend', () => firstElement.setAttribute('style', 'display: none;'));
	secondElement.addEventListener('animationend', () => secondElement.setAttribute('style', 'display: none;'));
	
	setTimeout(() => {
		firstElement.setAttribute('style', 'animation: cubeDisappearanceScale .3s;');
		secondElement.setAttribute('style', 'animation: cubeDisappearanceScale .3s;');

		setTimeout(() => {
			cubesCount -= 2;						
			if (cubesCount === 0){				
				
				compliments = document.createElement('div');
				compliments.className = 'compliments';
				compliments.innerHTML = 'Поздравляем!';

				movesAmount = document.createElement('div');
				movesAmount.className = 'moves';
				movesAmount.innerHTML = 'Количество ваших ходов:'

				wrapper.appendChild(compliments);
				setTimeout(() => wrapper.appendChild(movesAmount), 250);				
				setTimeout(() => wrapper.appendChild(result), 550);

				result.innerHTML = movesCount;

				cubesCount = 20;
				movesCount = 0;
				gameOver = true;
			};
		}, 300);				
	}, 1000);	
};

function test(){
	wrapper.removeChild(gameField);
				compliments = document.createElement('div');
				compliments.className = 'compliments';
				compliments.innerHTML = 'Поздравляем!';

				movesAmount = document.createElement('div');
				movesAmount.className = 'moves';
				movesAmount.innerHTML = 'Количество ваших ходов:'

				setTimeout(() => wrapper.appendChild(result),550);
				setTimeout(() => wrapper.appendChild(movesAmount),250);				
				wrapper.appendChild(compliments);

				result.innerHTML = movesCount;

				setTimeout(removeCompliments, 3000)
}
createStartButton();





































