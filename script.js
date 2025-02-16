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
let countAvoidedBullets = 0;

function shutBullets() {
	let bulletInterval = setInterval(() => {
		if (!gameOver) {
			clearInterval(bulletInterval);
			return;
		}

		let boolet = Math.floor(Math.random() * (28 - 11 + 1)) + 11;
		let i = 10;

		let bullets = setInterval(() => {
			if (!gameOver) {
				clearInterval(bullets);
				return;
			}

			let currentCell = selectCell(i, boolet);
			let nextCell = i + 1 <= 23 ? selectCell(i + 1, boolet) : null;

			if (currentCell) {
				currentCell.classList.remove("color");
			}

			// ✅ Ensure the bullet isn't destroyed before adding "color"
			if (nextCell && !nextCell.classList.contains("boolet")) {
				nextCell.classList.add("color");
			}

			// ✅ If the bullet hits a "green" zone (safe area), increase score
			if (nextCell && nextCell.classList.contains("green") && gameOver) {
				++countAvoidedBullets;
				l.textContent = `Score: ${countAvoidedBullets}`;
			}

			// ✅ Stop bullets when reaching last row
			++i;
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

		// ✅ If it hits an enemy bullet, destroy it and stop moving
		if (boolet.classList.contains("color")) {
			boolet.classList.remove("color"); // Remove enemy bullet
			clearInterval(bulletInterval);
			++hits;
			l.textContent = `HITS: ${hits}`;
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
