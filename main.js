const { floor, abs } = Math;
const cellSize = 10;
const size = 60;
const width = cellSize * size;
const height = cellSize * size;
const board = [];

let openSet = [];
let start = undefined;
let end = undefined;
let previousCells = [];
let search = false;
let createWalls = false;
let removeWalls = false;

const manhattanDistance = ({ row: x1, col: y1 }, { row: x2, col: y2 }) => {
  return abs(x2 - x1) + abs(y2 - y1);
};

const createBoard = () => {
  for (let row = 0; row < size; row++) {
    board.push([]);
    for (let col = 0; col < size; col++) {
      board[row].push({ row, col, wall: false, visited: false, f: null, g: null, h: null, previousCell: null });
      noStroke();
      fill(240);
      square(col * cellSize + 1, row * cellSize + 1, cellSize - 2);
    }
  }
};

const fillCell = ({ row, col }, color) => {
  noStroke();
  fill(220);
  square(col * cellSize, row * cellSize, cellSize);
  fill(color);
  square(col * cellSize + 1, row * cellSize + 1, cellSize - 2);
};

const fillWall = ({ row, col }, color) => {
  noStroke();
  fill(color);
  square(col * cellSize, row * cellSize, cellSize);
};

const getNeighbourCells = ({ row, col }) => {
  const neighbours = [];
  if (row > 0) neighbours.push(board[row - 1][col]);
  if (col > 0) neighbours.push(board[row][col - 1]);
  if (row < size - 1) neighbours.push(board[row + 1][col]);
  if (col < size - 1) neighbours.push(board[row][col + 1]);
  return neighbours;
};

const getUnVisitedNeighbourCells = ({ row, col }) => {
  const unVisitedNeighbourCells = [];
  const neighbours = getNeighbourCells({ row, col });
  for (const neighbour of neighbours) {
    const { visited } = neighbour;
    if (!visited) unVisitedNeighbourCells.push(neighbour);
  }
  return unVisitedNeighbourCells;
};

function setup() {
  const canvas = createCanvas(width, height);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  background(220);
  createBoard();
  start = board[1][1];
  end = board[size - 2][size - 2];
  openSet.push(start);
  fillCell(start, 'limegreen');
  fillCell(end, 'orangered');
}

function draw() {
  if (!search) return;
  if (!openSet.length) return;
  openSet.sort((x, y) => x.f < y.f);
  let cell = openSet.pop();
  cell.visited = true;
  if (cell == end) {
    fillCell(cell, 'orangered');
    search = false;
    return;
  }
  for (const previousCell of previousCells) {
    fillCell(previousCell, 'skyblue');
  }
  const neighbours = getUnVisitedNeighbourCells(cell);
  for (const neighbour of neighbours) {
    const tempG = cell.g + 1;
    if (openSet.includes(neighbour)) {
      if (tempG > neighbour.g) continue;
      else {
        neighbour.g = tempG;
        neighbour.f = neighbour.g + neighbour.h;
        neighbour.previousCell = cell;
      }
    } else {
      neighbour.g = tempG;
      neighbour.h = manhattanDistance(neighbour, end);
      neighbour.f = neighbour.g + neighbour.h;
      neighbour.previousCell = cell;
      openSet.push(neighbour);
    }
    fillCell(neighbour, 'pink');
  }
  previousCells = [];
  noStroke();
  fill('lime');
  while (cell != start) {
    const { row, col } = cell;
    square(col * cellSize, row * cellSize, cellSize);
    previousCells.push(cell);
    cell = cell.previousCell;
  }
}

function mousePressed() {
  const row = floor(mouseY / cellSize);
  const col = floor(mouseX / cellSize);
  if (row < 0 || col < 0 || row >= size || col >= size) return;
  if (createWalls) {
    board[row][col].wall = true;
    board[row][col].visited = true;
    fillWall({ row, col }, 'darkslategray');
  }
  if (removeWalls) {
    board[row][col].wall = false;
    board[row][col].visited = false;
    fillCell({ row, col }, 240);
  }
}

function mouseDragged() {
  const row = floor(mouseY / cellSize);
  const col = floor(mouseX / cellSize);
  if (row < 0 || col < 0 || row >= size || col >= size) return;
  if (createWalls) {
    board[row][col].wall = true;
    board[row][col].visited = true;
    fillWall({ row, col }, 'darkslategray');
  }
  if (removeWalls) {
    board[row][col].wall = false;
    board[row][col].visited = false;
    fillCell({ row, col }, 240);
  }
}

function start_search() {
  createWalls = false;
  removeWalls = false;
  openSet = [start];
  previousCells = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const { wall } = board[row][col];
      if (wall) continue;
      board[row][col].g = null;
      board[row][col].h = null;
      board[row][col].f = null;
      board[row][col].visited = false;
      board[row][col].previousCell = null;
      fillCell({ row, col }, 240);
    }
  }
  fillCell(start, 'limegreen');
  fillCell(end, 'orangered');
  search = true;
}

function create_walls() {
  removeWalls = false;
  search = false;
  createWalls = !createWalls;
}

function remove_walls() {
  createWalls = false;
  search = false;
  removeWalls = !removeWalls;
}
