// 1. Додати нові фігури
// 2. Стилізувати нові фігури
// 3. Додати функцію рандому котра буде поветати випадкову фігуру
// 4. Центрувати фігуру незалежно від ширини



const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS    = 20;
const TETROMINO_NAMES = [
    'O',
    'J',
    'L',
    'T',
    'Z',
    'S',
    'I'
]

const TETROMINOES = {
    'O': [
        [1,1],
        [1,1]
    ],
    'J': [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    'L': [
        [1,0,0],
        [1,0,0],
        [1,1,0]
    ],
    'T': [
        [0,1,0],
        [1,1,0],
        [0,1,0]
    ],
    'Z': [
        [0,1,0],
        [1,1,0],
        [1,0,0]
    ],
    'S': [
        [1,0,0],
        [1,1,0],
        [0,1,0]
    ],
    'I': [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [1,1,1,1]
    ]
}

function convertPositionToIndex(row, column){
    return row * PLAYFIELD_COLUMNS + column;
}

let playfield;
let tetromino;

function generatePlayField(){
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++){
        const div = document.createElement(`div`);
        document.querySelector('.grid').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
                    .map( ()=> new Array(PLAYFIELD_COLUMNS).fill(0) )
    // console.table(playfield);
}

function genRandNumber(){
    const timestamp = new Date().getTime();
    const randomNumber = (((timestamp%7)*(Math.floor(Math.random()*7))) % 7);
    return randomNumber;
}

function generateTetromino(){

    const name = TETROMINO_NAMES[genRandNumber()];
    const matrix = TETROMINOES[name];
    // console.log(matrix);
    const column_center = Math.ceil((playfield[0].length - matrix[0].length) / 2);
    tetromino = {
        name,
        matrix,
        row: 1,
        column: column_center
    }
}

generatePlayField();
generateTetromino();
const cells = document.querySelectorAll('.grid div');

function drawPlayField(){
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] == 0) continue;
            
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row,column);
            // console.log(cellIndex);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino(){
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;
    
    for(let row = 0; row < tetrominoMatrixSize; row++){
        for(let column = 0; column < tetrominoMatrixSize; column++){
            if(!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            // console.log(cellIndex);
            cells[cellIndex].classList.add(name);
        }
        // column
    }
    // row
}
// drawTetromino();
// drawPlayField();

function draw(){
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetromino();
}

draw();

document.addEventListener('keydown', onKeyDown);
function onKeyDown(e){
    switch(e.key){
        case 'ArrowDown':
            moveTetrominoDown();
            break;
        case 'ArrowLeft':
            moveTetrominoLeft();
            break;
        case 'ArrowRight':
            moveTetrominoRight();
            break;
        case 'ArrowUp':
            turnTetromino();

            break;
    }

    draw();
}

function moveTetrominoDown(){
    tetromino.row += 1;
}
function moveTetrominoLeft(){
    tetromino.column -= 1;
}
function moveTetrominoRight(){
    tetromino.column += 1;
}
function turnTetromino(){
    let n = tetromino.matrix[0].length;
    let tempMatrix = [];
    for (let i = 0; i < n; i++){
        tempMatrix.push([]);
        for (let j = 0; j < n; j++){
            tempMatrix[i].push(tetromino.matrix[i][j]);
        }
    }
    for (let i = 0; i < n; i++){
        for (let j = 0; j < n; j++){
            tetromino.matrix[i][j] = tempMatrix[(n-(n%2)-j)%4][i];
        }
    }
    
    floorDown();
    floorDown();

    if (n == 3){
        toTheLeft();
    }

    //tetromino.column -= 1;
    //tetromino.row -=1;
}
function floorDown(){
    let t = 0;
    let n = tetromino.matrix[0].length;
    for (let j = 0; j < n; j++){
        if (tetromino.matrix[n-1][j] == 1){
            t = 1;
            break;
        }
    }
    if (t == 0){
        for (let i = n - 1; i > 0; i--){
            for (let j = 0; j < n; j++){
                tetromino.matrix[i][j] = tetromino.matrix[i-1][j];
            }
        }
        for (let j = 0; j < n; j++){
            tetromino.matrix[0][j] = 0;
        }
    }
}
function toTheLeft(){
    let t = 0;
    let n = tetromino.matrix[0].length;
    for (let i = 0; i < n; i++){
        if (tetromino.matrix[i][0] == 1){
            t = 1;
            break;
        }
    }
    if (t == 0){
        for (let i = 0; i < n; i++){
            for (let j = 0; j < n - 1; j++){
                tetromino.matrix[i][j] = tetromino.matrix[i][j+1];
            }
        }
        for (let i = 0; i < n; i++){
            tetromino.matrix[i][n-1] = 0;
        }
    }
}