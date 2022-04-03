let lastRenderTime = 0
const gameBoard = document.getElementById("game-board")

gameOver = false
function main(currentTime) {
	if(gameOver) {
		if (confirm("You died. press ok to respawn.")){
			location.reload()
		}
		return
	}
	window.requestAnimationFrame(main)
	const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
	if (secondsSinceLastRender < 1 / SnakeSpeed) return
	
	console.log("Render")
	lastRenderTime = currentTime

	update()
	draw()
}

window.requestAnimationFrame(main)

const SnakeSpeed = 8

const snakeBody = [{ x:11, y: 11 }]

function update(){
	let inputDirection = getInputDirection()
	for (let i = snakeBody.length -2; i >=0; i--) {
		snakeBody[i+1] = { ...snakeBody[i] }
	}

	snakeBody[0].x += inputDirection.x
	snakeBody[0].y += inputDirection.y
	checkDeath()
	updateFood()
	addSegments()


}

function draw() {
	gameBoard.innerHTML = ""
	snakeBody.forEach(segment => {
	let snakeElement = document.createElement("div")
		snakeElement.style.gridRowStart = segment.y
		snakeElement.style.gridColumnStart = segment.x
		snakeElement.classList.add("snake")
		gameBoard.appendChild(snakeElement)
		drawFood(gameBoard)
	})

}


let inputDirection = { x:0, y:0 }
let lastInputDirection = { x:0, y:0 }

function getInputDirection() {
	lastInputDirection = inputDirection
	return inputDirection

}

document.addEventListener("keydown", e=> {
	switch (e.key) {
		case "ArrowUp":
			if (lastInputDirection.y !==0) break
			inputDirection = { x: 0, y: -1 }
		break
		case "ArrowDown":
			if (lastInputDirection.y !==0) break
			inputDirection = { x: 0, y: +1 }
		break
		case "ArrowLeft":
			if (lastInputDirection.x !==0) break
			inputDirection = { x: -1, y: 0 }
		break
		case "ArrowRight":
			if (lastInputDirection.x !==0) break
			inputDirection = { x: 1, y: 0 }
		break
	}

})

//document.addEventListener('keydown', function(e) {
  //if (e.key) {
    //document.getElementById('audio').play();
//  }
//});

let food = getRandomFoodPosition()
const EXPANSION_RATE = 1

let newSegments = 0;

function expandSnake(amount) {
	newSegments += amount
}

function onSnake(position, { ignoreHead = false } = {}) {
	return snakeBody.some((segment,index) => {
		if (ignoreHead && index === 0) return false
		return equalPositions(segment, position)
	})
}

function equalPositions(pos1,pos2) {
	return (pos1.x === pos2.x && pos1.y === pos2.y)
}

//takes eaten food an ands to snake.
function addSegments() { 
	for (let i = 0; i < newSegments; i++)
		snakeBody.push({...snakeBody[snakeBody.length -1]})
	newSegments = 0

}



function updateFood(){
	if (onSnake(food)){
		expandSnake(EXPANSION_RATE);
		food = getRandomFoodPosition();
		 document.getElementById('eat').play();

}
	}



function drawFood() {
		const foodElement = document.createElement("div")
		foodElement.style.gridRowStart = food.y
		foodElement.style.gridColumnStart = food.x
		foodElement.classList.add("food")
		gameBoard.appendChild(foodElement)
	}

function getRandomFoodPosition() { //random position to the food spawning and not on top of snake
	let newFoodPosition
	while(newFoodPosition == null || onSnake(newFoodPosition)) {
		newFoodPosition = randomGridPosition()
	}
	return newFoodPosition
}

function randomGridPosition() { //randomized the food to a random position in the grid
	return {
		x: Math.floor(Math.random() * 21) + 1,
		y: Math.floor(Math.random() * 21) + 1,
	}
}


//checks if you loose
function checkDeath() { 
	gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()}

//Checks if out of bounds
function outsideGrid(position){
	return(
		position.x < 1 || position.x > 21 ||
		position.y < 1 || position.y > 21)
}

function getSnakeHead() {
	return snakeBody[0]
}

function snakeIntersection() {
	return onSnake(snakeBody[0], { ignoreHead: true })
}



