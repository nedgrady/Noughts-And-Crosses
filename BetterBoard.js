// JavaScript source code

gConfig = {
    size: 3,
    empty: "",
    boundsX: {
        min: 0,
        max: 2
    },
    boundsY: {
        min: 0,
        max: 2
    },
    initialMoveCount: 0,
    target: 3,
    pieces: ["X", "O", "■", "▲"],
    replaceablePieces: []

}


class Piece {

    constructor(config, value) {
        this.config = config;
        this.value = config.empty; //default to the first empty piece
        this.tryPut(value);        
    }

    validMove(value) {
        return pValidMove(this, value, this.config);
    }

    tryPut(value) {
        return pTryPut(this, this.config, value);
    }

    put(value) {
        pPut(this, value);
    }

    equal(piece) {
        return pEqual(this, piece);
    }
}




class Board {

    constructor(config) {
        var size, split, grid;
        this.config = config;
        this.size = config.size > 0 ? config.size : 3; //default to 3        
        this.initBoard(this.size);
        this.moveCount = config.initialMoveCount;

    }

    initBoard() {
        this.grid = pInitGrid(this.config);
        debugger;
    }

    getPiece(rowNum, colNum) {

        return pGetPieceFromGrid(this.grid, this.config, rowNum, colNum);
    }

    /*
    Concrete logic of placing a specified piece on the grid.
    */
    tryPlaceOnGrid(piece, rowNum, colNum) {
        let targetPiece = pGetPieceFromGrid(this.grid, this.config, rowNum, colNum);//this.getPiece(this, rowNum, colNum);
        return pTryPlaceOnGrid(targetPiece, );
    }

    increment() {
        pIncrement(this);
    }

    /*
    returns whether or not that piece occurs the target number of times
    */
    winStateReached(piece) {
        return pWinStateReached(this.grid, this.config, piece);
    }

    checkRows(piece) {
        return pCheckRows(this.config, this.grid, piece);
    }

    checkCols(piece) {
        return pCheckCols(this.grid, this.config, piece)
    }

    checkDiags(piece) {
        return pCheckDiags(this.grid, this.config, piece);
    }

    nextPiece() {
        return pNext(this.config, this.moveCount);
    }
}

class Grid{
    constructor(empty, size){
        var _grid = pInitGrid(empty, size);
    }

    getRow(rowNum) {
        return pGetRow(this._grid, this.config, rowNum);
    }

    getCol(colNum) {
        return pGetCol(this._grid, this.config, colNum);
    }

    getDiags() {
        return pGetDiags(this._grid, this.config);
    }

    getPiece(rowNum, colNum) {
        return pGetPieceFromGrid(this._grid, rowNum, colNum);
    }

}

//these p (pure) functions have no side effects (??)

// ============= BOARD FUNCTION ============

//return the next piece according to the config and number of turns
function pNext(config, counter) {
    return new Piece(config, config[counter % config.size]);
}

//check some set of pieces for target consecutive pieces.
function pConsecutive(target, piece, pieces) {
    let run = 0;
    for(let p of pieces) {
        let equal = pEqual(p, piece);
        if (equal) {
            if (++run >= target) {
                return true
            }
        } else {
            run = 0;
        }
    }
    return false;
}

//try to put some piece in a grid
function pTryPlaceOnGrid(piece, grid, rowNum, colNum) {
    pTryPut()
}

//initialise some grid with respect to some config
function pInitGrid(empty, size) {
    let grid;
    if (size > 0) {
        grid = new Array(size);
        for (let i = 0; i < size;i++) {
            grid[i] = new Array(size);
            for (let j = 0; j < size;j++) {
                grid[i][j] = new Piece(config, empty);
            }
        }
    }
    return grid; //undefined grid if size < 1
}

function pGetPieceFromGrid(grid, config, rowNum, colNum) {
    debugger;
    if (pInRange(rowNum, config.boundsX) &&
        pInRange(colNum, config.boundsY)) {
        return grid[rowNum][colNum];
    }
}

//inclusive bounds
function pInRange(index, bounds) {
    return index >= bounds.min && index <= bounds.max;
}

//this has side effects??
function pIncrement(board) {
    board.moveCount++;
}

//get some row from some board
function pGetRow(grid, config, rowNum) {
    if (pInRange(config.boundsX)) {
        return grid[rowNum];
    }
}

//get some column from some grid
function pGetCol(grid, config, colNum) {
    let col = [];
    if (pInRange(colNum, config.boundsY)) {
        grid.forEach(function (row) {
            col.push(row[colNum]);
        });
    }
    return col;
}

//get both diagonals from some grid
function pGetDiags(grid, config) {
    let size = config.size;
    let diag1 = new Array(size),
        diag2 = new Array(size);

    for (let i = 0; i < size; i++) {
        diag1[i] = pGetPieceFromGrid(grid, config, i, i);
        diag2[i] = pGetPieceFromGrid(grid, config, size - i - 1);
    }

    return [diag1, diag2];
}

function pWinStateReached(grid, config, piece) {
    return pCheckRows(grid, config, piece) || pCheckCols(grid, config, piece) || pCheckDiags(grid, config, piece);
}

//cehck all the rows in some grid for a piece
function pCheckRows(grid, config, piece) {
    let list
    for (let i = 0; i < config.size; i++) {
        list = pGetRow(grid, config, i);
        //if we find enough consecutive pieces
        if (pConsecutive(config.target, piece, list)) {
            return true;
        }
    }
    return false;
}

//cehck all the cols in some grid for a piece
function pCheckCols(grid, config, piece) {
    let list
    for (let i = 0; i < config.size; i++) {
        list = pGetCol(grid, config, i);
        if (pConsecutive(config.target, piece, list)) {
            return true;
        }
    }
    return false;
}

//check all of the diags in some grid.
function pCheckDiags(grid, config, piece) {
    let diags = pGetDiags(grid, config);
    let list;
    for (let i = 0; i < diags.length; i++) {
        list = diags[i];
        if (pConsecutive(config.target, piece, list)) {
            return true;
        }
    }
    return false;
}

// ============= PIECE FUNCTIONS =============

//check if for some piece we can place the value in it, with respect to the config.
function pValidMove(currentValue , config, value) {
    //ensure that the value IS empty, and that the config includes the value
    return (currentValue === config.empty || currentValue === config.replaceablePieces.includes(currentValue))
            && config.pieces.includes(value);
}

//try to put some value in a piece
function pTryPut(piece, config, value) {
    let valid = pValidMove(piece.value, config, value);
    if (valid) {
        pPut(piece, value);
    }
    return valid;
}

//put a value in a piece
function pPut(piece, value) {
    piece.value = value;
}

//check that 2 pieces are of equal value
function pEqual(piece1, piece2) {
    return piece1.value === piece2.value;
}


//============== GRID FUNCTIONS ==============

var b = new Board(gConfig);
b
p = new Piece(gConfig, "X");

