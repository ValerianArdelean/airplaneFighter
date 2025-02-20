const TOP_BOUNDARY = 10;
const BOTTOM_BOUNDARY = 23;
const WIDTH = 29;
const PLANE_HEIGHT = 4;
const LINES = 0;
const COLUMNS = 1;

let game = {
	hits: 0,
	gameOver: true,
	coordinates: [17, 21],
	scoreDisplay: document.getElementById("score")
}

function createCells() {
	let table = document.getElementById("table");
	for (let i = TOP_BOUNDARY; i <= BOTTOM_BOUNDARY; ++i) {
		let line = document.createElement("div");
		line.classList.add("flex");
		line.id = `${i}`;
		for (let j = TOP_BOUNDARY; j <= WIDTH; ++j) {
			let cell = document.createElement("div");
			cell.classList.add("cell");
			cell.id = `${i}${j}`;
			if (i == TOP_BOUNDARY) {
				cell.classList.add("blue");
			} else if (i == BOTTOM_BOUNDARY) {
				cell.classList.add("green");
			}
			line.appendChild(cell);
		}
		table.appendChild(line);
	}
}

function selectCell(line, column) {
	return document.getElementById(`${line}` + `${column}`);
}

function drawPlane(status) {
	for (let i = 0; i < PLANE_HEIGHT ; ++i) {
		selectCell(game.coordinates[LINES] + i, game.coordinates[COLUMNS]).classList[status]("color");
	}
	for (let i = game.coordinates[COLUMNS] - 2; i <= game.coordinates[COLUMNS] + 2; ++i) {
		selectCell(game.coordinates[LINES] + 1, i).classList[status]("color");
		if (i > game.coordinates[COLUMNS] - 2 && i < game.coordinates[COLUMNS] + 2) {
			selectCell(game.coordinates[LINES] + 3, i).classList[status]("color");
		}
	}
}

function updateCoordinates(axis, n, min, max) {
	n = parseInt(n);
	if (game.coordinates[axis] + n > min && game.coordinates[axis] + n < max && game.gameOver && n) {
		drawPlane("remove");
		game.coordinates[axis] += n;
		drawPlane("add");
	}
}

function processLines(n) {
	updateCoordinates(LINES, n, TOP_BOUNDARY, BOTTOM_BOUNDARY - PLANE_HEIGHT + 1);
}

function processColumns(n) {
	updateCoordinates(COLUMNS, n, TOP_BOUNDARY + 1, WIDTH - 1);
}

function handleKeyboardInputs() {
	document.addEventListener('keydown', function(event) {
		if (event.key === 'ArrowLeft' || event.key === 'a') {
			processColumns(-1);
		} else if (event.key === 'ArrowRight' || event.key === 'd') {
			processColumns(1);
		} else if (event.key === 'ArrowUp' || event.key === 'w') {
			processLines(-1);
		} else if (event.key === 'ArrowDown' || event.key === 's') {
			processLines(1);
		}
	});
}

function incomingObjects() {
	const OBJECT_SPEED = 200;
	const OBJECT_INTERVAL = 400;
	let objectsInterval = setInterval(() => {
		if (!game.gameOver) {
			clearInterval(objectsInterval);
			return;
		}
		let object = Math.floor(Math.random() * (WIDTH - TOP_BOUNDARY - 1)) + TOP_BOUNDARY + 1;
		let i = TOP_BOUNDARY;
		let objects = setInterval(() => {
			let currentCell = selectCell(i, object);
			let nextCell = i + 1 <= BOTTOM_BOUNDARY ? selectCell(i + 1, object) : null;
			if (currentCell) {
				currentCell.classList.remove("color");
			}
			if (nextCell && nextCell.classList.contains("boolet")) {
				nextCell.classList.remove("boolet");
				clearInterval(objects);
				return;
			}
			if (nextCell && nextCell.classList.contains("color")) {
				game.gameOver = false;
				clearInterval(objects);
				clearInterval(objectsInterval);
				nextCell.classList.add("explosion");
				nextCell.innerHTML = "💥";
				return;
			}
			if (nextCell) {
				nextCell.classList.add("color");
			}
			/*implementation for bonus 1
			if (nextCell && nextCell.classList.contains("green")) {
				++countAvoidedBullets;
				l.textContent = `Score: ${countAvoidedBullets}`;
			}*/
			++i;
			if (i > BOTTOM_BOUNDARY) {
				clearInterval(objects);
			}
		}, OBJECT_SPEED);
	}, OBJECT_INTERVAL);
}

function fire() {
	const BULLET_SPEED = 30;
	let line = game.coordinates[LINES] - 1,  column = game.coordinates[COLUMNS];
	let booletInterval = setInterval(() => {
		if (line < TOP_BOUNDARY) {
			clearInterval(booletInterval);
			selectCell(TOP_BOUNDARY, column).classList.remove("boolet");
			return;
		}
		let boolet = selectCell(line, column);
		if (boolet.classList.contains("color")) {
			boolet.classList.remove("color", "boolet");
			clearInterval(booletInterval);
			++game.hits;
			game.scoreDisplay.textContent = `SCORE: ${game.hits}`;
			return;
		}
		boolet.classList.add("boolet");
		if (line < game.coordinates[LINES] - 1) {
			selectCell(line + 1, column).classList.remove("boolet");
		}
		--line;
	}, BULLET_SPEED);
}

createCells();
drawPlane("add");
handleKeyboardInputs();
