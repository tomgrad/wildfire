const GRID_SIZE = 200;
const CELL_SIZE = 3;

const WIDTH = GRID_SIZE * CELL_SIZE;

const S = 0;  // Susceptible
const I = 1;  // Infected
const R = 2;  // Recovered
const W = 3;  // Wall

let grid;
let img;
let infectionTime;

let recoveryTime = 3;
let immunityTime = 7;
let probe = true;

let probe_x = 50;
let probe_y = 50;
let probe_r = 20;
let history = [];
let plot_size = 200;
let shades = true;

let indices = [];

let cmap;


function setup() {
  createCanvas(WIDTH, WIDTH + plot_size);
  setupGui();
  grid = createGrid();
  infectionTime = create2DArray(GRID_SIZE, GRID_SIZE, 0);
  history = Array(32).fill(0);
  img = createImage(GRID_SIZE, GRID_SIZE);
  noSmooth();

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      indices.push([i, j]);
    }
  }

  cmap = [
    color(255, 255, 255), // Susceptible
    color(255, 0, 0),     // Infected
    color(0, 0, 0),       // Recovered
    color(0, 0, 0, 0)     // Wall (transparent)
  ]
}

function draw() {
  background(220);
  asyncUpdateGrid();

  img.loadPixels();
  for (let x = 0; x < GRID_SIZE; ++x)
    for (let y = 0; y < GRID_SIZE; ++y)
      if (shades) {
        if (grid[x][y] === S) img.set(x, y, color(255));
        else if (grid[x][y] === I) img.set(x, y, color(infectionTime[x][y] / recoveryTime * 255, 0, 0));
        else if (grid[x][y] === R) img.set(x, y, color(255 - infectionTime[x][y] / immunityTime * 255));
        else img.set(x, y, color(0, 0, 0, 0)); // Transparent for any other state
      }
      else // No shades, just colors
      {
        img.set(x, y, cmap[grid[x][y]]);
      }

  img.updatePixels();
  image(img, 0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

  if (probe) {
    fill(0, 0, 255, 100);
    stroke("blue")
    circle(probe_x * CELL_SIZE + CELL_SIZE / 2, probe_y * CELL_SIZE + CELL_SIZE / 2, probe_r * 2 * CELL_SIZE);
    plotActivated();
  }
  select('#actualframerateValue').html(frameRate().toFixed(1));
}

function plotActivated() {
  history.shift();
  history.push(getInfectedCountInProbeArea());
  probe_area = 3.14 * probe_r * probe_r;
  noFill();
  stroke(0);
  beginShape();
  for (let i = 0; i < history.length; i++) {
    let x = map(i, 0, history.length - 1, 0, WIDTH);
    let y = map(history[i] / probe_area, 0, 1, 0, plot_size);
    vertex(x, WIDTH + plot_size - y);
  }
  endShape();
}

function mousePressed() {
  let i = floor(mouseX / CELL_SIZE);
  let j = floor(mouseY / CELL_SIZE);
  if (i >= 0 && i < GRID_SIZE && j >= 0 && j < GRID_SIZE) {
    if (keyIsDown(SHIFT)) {
      if (grid[i][j] === W)
        grid[i][j] = S; // Remove wall
      else
        grid[i][j] = W; // Place wall
      infectionTime[i][j] = 0; // Reset infection time for walls
    }
    else if (grid[i][j] === S) {
      grid[i][j] = I;
      infectionTime[i][j] = recoveryTime;
    }
  }
}

function createGrid() {
  let arr = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    arr[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      arr[i][j] = S;
    }
  }
  return arr;
}

function create2DArray(cols, rows, val) {
  let arr = [];
  for (let i = 0; i < cols; i++) {
    arr[i] = [];
    for (let j = 0; j < rows; j++) {
      arr[i][j] = val;
    }
  }
  return arr;
}

function asyncUpdateGrid() {


  shuffle(indices, true);

  for (let [i, j] of indices) {
    let state = grid[i][j];

    if (state === S) {
      let infectedNeighbor = getNeighbors(i, j).some(([x, y]) => grid[x][y] === I);
      if (infectedNeighbor) {
        grid[i][j] = I;
        infectionTime[i][j] = recoveryTime;
      }

    } else if (state === I) {
      infectionTime[i][j]--;
      if (infectionTime[i][j] <= 0) {
        grid[i][j] = R;
        infectionTime[i][j] = immunityTime;
      }

    } else if (state === R) {
      infectionTime[i][j]--;
      if (infectionTime[i][j] <= 0) {
        grid[i][j] = S;
      }
    }
  }
}

function getNeighbors(x, y) {
  let neighbors = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      let nx = x + dx;
      let ny = y + dy;
      if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
        neighbors.push([nx, ny]);
      }
    }
  }
  return neighbors;
}

function getInfectedCountInProbeArea() {
  let count = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === I) {
        let d = dist(probe_x * CELL_SIZE + CELL_SIZE / 2, probe_y * CELL_SIZE + CELL_SIZE / 2, i * CELL_SIZE + CELL_SIZE / 2, j * CELL_SIZE + CELL_SIZE / 2);
        if (d <= probe_r * CELL_SIZE) {
          count++;
        }
      }
    }
  }
  return count;
}