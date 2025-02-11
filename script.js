function createCells() {
	let table = document.getElementById("table");
	for (let i = 10; i < 24; ++i) {
		let line = document.createElement("div");
		line.style.display = "flex";
		line.id = `${i}`;
		for (let j = 10; j < 30; ++j) {
			let cell = document.createElement("div");
			cell.style.width = "50px";
			cell.style.height = "50px";
			cell.id = `${i}${j}`;
			line.appendChild(cell);
		}
		table.appendChild(line);
	}
}

function setScore(){
	let l = document.getElementById("lives");
	let sec = 0;
	let timer = setInterval(function(){
		if (!gameOver) {
			return;
		}
		l.textContent = "Score: "+sec;
		++sec;
		if (sec < 0) {
			clearInterval(timer);
		}
	}, 1000);
}

createCells();

const LINES = 0;
const COLUMNS = 1;

let coordonates = [17, 21];
let gameOver = 1;

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
	if (!gameOver || !n) {
		return;
	}
	n = parseInt(n);
	if (coordonates[axis] + n >= min && coordonates[axis] + n < max) {
		drawPlane("remove");
		coordonates[axis] += n;
		drawPlane("add");
	}
}

function processLines(n) {
	updateCoordinate(LINES, n, 10, 21);
}

function processColumns(n) {
	updateCoordinate(COLUMNS, n, 12, 28);
}

function handleKeyboardInputs() {
	document.addEventListener('keydown', function(event) {
		if (event.key === 'ArrowLeft') {
			processColumns(-1);
		} else if (event.key === 'ArrowRight') {
			processColumns(1);
		} else if (event.key === 'ArrowUp') {
			processLines(-1);
		} else if (event.key === 'ArrowDown') {
			processLines(1);
		}
	});
}

function shutBullets() {
	for (let j = 0; j < 100000; ++j) {
		setTimeout(() => {
			if (!gameOver) {
				return;
			}
			let boolet = Math.floor(Math.random() * (28 - 11 + 1)) + 11;
			selectCell(10, boolet).classList.add("color");
			for (let i = 10; i <= 23; ++i) {
				setTimeout(() => {
					selectCell(i, boolet).removeAttribute("class");
					if (selectCell(i + 1, boolet).classList.contains("color")) {
						gameOver = 0;
						return;
					}
					selectCell(i + 1, boolet).classList.add("color");
				}, (i - 10) * 140);
			}
		}, j * 400);
	}
}

drawPlane("add");
setScore();
shutBullets();
handleKeyboardInputs();
