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
			//cell.style.border = "1px solid #87CEEB";
			cell.id = `${i}${j}`;
			line.appendChild(cell);
		}
		table.appendChild(line);
	}
}

createCells();
let lines = 17;
let columns = 21;
let lives = Number(10);

function processLines(n) {
	if (lives <= 0) {
		return;
	}
	n = parseInt(n);
	if (lines + n < 21 && lines + n >= 10) {
		erasePlane();
		lines += n;
		drawPlane();
	}
}

function processColumns(n) {
	if (lives <= 0) {
		return;
	}
	n = parseInt(n);
	if (columns + n < 28 && columns + n >= 12) {
		erasePlane();
		columns += n;
		drawPlane();
	}
}

function selectCell(l, c) {
	return document.getElementById(`${l}` + `${c}`);
}

function erasePlane() {
	for (let i = 0; i <= 3; ++i) {
		selectCell(lines + i, columns).removeAttribute("class");
	}
	for (let i = columns - 2; i <= columns + 2; ++i) {
		selectCell(lines + 1, i).removeAttribute("class");
		if (i > columns - 2 && i < columns + 2) {
			selectCell(lines + 3, i).removeAttribute("class");
		}
	}
}

function drawPlane() {
	for (let i = 0; i <= 3; ++i) {
		selectCell(lines + i, columns).classList.add("color");
	}
	for (let i = columns - 2; i <= columns + 2; ++i) {
		selectCell(lines + 1, i).classList.add("color");
		if (i > columns - 2 && i < columns + 2) {
			selectCell(lines + 3, i).classList.add("color");
		}
	}
}

let l = document.getElementById("lives");
l.innerHTML = `lives: ${lives}`;

drawPlane();

function bullets() {
	for (let j = 0; j < 100000; ++j) {
		setTimeout(() => {
			if (lives <= 0) {
				l.innerHTML = "GAME OVER!";
				return;
			}
			let boolet = Math.floor(Math.random() * (29 - 10 + 1)) + 10;
			selectCell(10, boolet).classList.add("color");
			for (let i = 10; i <= 23; ++i) {
				setTimeout(() => {
					selectCell(i, boolet).removeAttribute("class");
					if (selectCell(i + 1, boolet).classList.contains("color")) {
						--lives;
						l.innerHTML = `lives: ${lives}`;
					}
					selectCell(i + 1, boolet).classList.add("color");
				}, (i - 10) * 140);
			}
		}, j * 400);
	}
}
bullets();

document.addEventListener('keydown', function(event) {
	if(event.keyCode == 37) {
		processColumns(-1);
	} else if(event.keyCode == 39) {
		processColumns(1);
	} else if (event.keyCode == 38) {
		processLines(-1)
	} else if (event.keyCode == 40) {
		processLines(1)
	}
});
