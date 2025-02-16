function createCells() {
	let table = document.getElementById("table");
	for (let i = 10; i < 24; ++i) {
		let line = document.createElement("div");
		line.classList.add("flex");
		line.id = `${i}`;
		for (let j = 10; j < 30; ++j) {
			let cell = document.createElement("div");
			cell.style.width = "50px";
			cell.style.height = "50px";
			cell.id = `${i}${j}`;
			if (i == 10) {
				cell.classList.add("blue");
			} else if (i == 23) {
				cell.classList.add("green");
			}
			line.appendChild(cell);
		}
		table.appendChild(line);
	}
}

createCells();

const LINES = 0;
const COLUMNS = 1;

let coordonates = [17, 21];
let gameOver = 1;
let hit = 0;

function selectCell(l, c) {
	return document.getElementById(`${l}` + `${c}`);
}

function drawPlane(status) {
	for (let i = 0; i <= 3; ++i) {
		selectCell(coordonates[LINES] + i, coordonates[COLUMNS]).classList[status]("color");
	}
	for (let i = coordonates[COLUMNS] - 2; i <= coordonates[COLUMNS] + 2; ++i) {
		selectCell(coordonates[LINES] + 1, i).classList[status]("color");
		if (i > coordonates[COLUMNS] - 2 && i < coordonates[COLUMNS] + 2) {
			selectCell(coordonates[LINES] + 3, i).classList[status]("color");
		}
	}
}

function updateCoordinate(axis, n, min, max) {
	n = parseInt(n);
	if (coordonates[axis] + n >= min && coordonates[axis] + n < max && gameOver && n) {
		drawPlane("remove");
		coordonates[axis] += n;
		drawPlane("add");
	}
}

function processLines(n) {
	updateCoordinate(LINES, n, 11, 20);
}

function processColumns(n) {
	updateCoordinate(COLUMNS, n, 12, 28);
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


let l = document.getElementById("lives");
l.textContent = "SCORE: 0";

function shutBullets() {
	let bulletInterval = setInterval(() => {
		if (!gameOver) {
			clearInterval(bulletInterval);
			return;
		}

		let boolet = Math.floor(Math.random() * (28 - 11 + 1)) + 11;
		let i = 10;
		let bullets = setInterval(() => {
			let currentCell = selectCell(i, boolet);
			let nextCell = i + 1 <= 23 ? selectCell(i + 1, boolet) : null;

			if (currentCell) {
				currentCell.classList.remove("color");
			}

			// ✅ If an enemy bullet is destroyed by player bullet, remove it
			if (nextCell && nextCell.classList.contains("boolet")) {
				nextCell.classList.remove("boolet");
				clearInterval(bullets); // Stop the enemy bullet
				return;
			}

			// ✅ Collision: If bullet hits player's plane, game over
			if (nextCell && nextCell.classList.contains("color")) {
				gameOver = 0;
				clearInterval(bullets);
				clearInterval(bulletInterval);
				nextCell.classList.add("explosion");
				nextCell.innerHTML = "💥";
				return;
			}

			// ✅ Move enemy bullet downward
			if (nextCell) {
				nextCell.classList.add("color");
			}

			/*
			if (nextCell && nextCell.classList.contains("green")) {
				++countAvoidedBullets;
				l.textContent = `Score: ${countAvoidedBullets}`;
			}*/

			// ✅ Stop bullet at the last row
			i++;
			if (i > 23) {
				clearInterval(bullets);
			}
		}, 200);
	}, 400);
}

let hits = 0;

function fire() {
	let i = coordonates[LINES] - 1, j = coordonates[COLUMNS];
	let bulletInterval = setInterval(() => {
		if (i < 10) {
			clearInterval(bulletInterval);
			selectCell(10, j).classList.remove("boolet");
			return;
		}

		let boolet = selectCell(i, j);

		// ✅ If player's bullet hits an enemy bullet, destroy both
		if (boolet.classList.contains("color")) {
			boolet.classList.remove("color"); // Remove enemy bullet
			boolet.classList.remove("boolet"); // Remove player's bullet
			
			++hits; // ✅ Increment score before stopping interval
			l.textContent = `SCORE: ${hits}`;
			
			clearInterval(bulletInterval); // Stop the bullet movement
			return;
		}

		// Move the fired bullet upwards
		boolet.classList.add("boolet");
		if (i < coordonates[LINES] - 1) {
			selectCell(i + 1, j).classList.remove("boolet");
		}
		--i;
	}, 30);
}

drawPlane("add");
handleKeyboardInputs();
