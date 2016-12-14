// JavaScript source code
var pieces = ["X", "O", "■", "▲"];
var empty = "";
var target = 3; //number of how many consecutive piece one needs to win

class Piece {

    constructor(config, value) {
        this._config = config;
        this._value = empty;
        this.tryPlace(value);
    }
    
    validMove(value) {    
        return this._empty() && this._config.includes(value);
    }

    tryPlace(value){
        let valid = this.validMove(value);
        if (valid) {
            this._place(value);
        }
        return valid;        
    }    

    _place(value){
        this._value  = value;
    }

    _empty(){
        return this._value === empty;
    }

    equal(piece) {
        return piece.value() === this.value();
    }

    value() {
        return this._value;
    }


}




class Board {

    constructor(config, size) {
        var _size, split, _moveCount;
        this._config = config;
        this._size = size > 0 ? size : 3; //default to 3        
        this._initBoard(this._size);

    }

    _initBoard(size) {
        var _board;
        if (size > 0) {

            this._board = new Array(size);

            for (let i = 0; i < size; i++) {
                this._board[i] = new Array(size);
                for (let j = 0; j < size; j++) {
                    this._board[i][j] = new Piece(this.getConfig(), empty); 
                }
            }
        }
    }

    getPiece(rowNum, colNum) {
        if (this._inRange(rowNum) && this._inRange(colNum)) {
            return this._board[rowNum][colNum];
        }        
    }

    /*
    Concrete logic of placing a specified value in a specified piece
    */
    tryPlace(value, rowNum, colNum) {
        let targetPiece = this.getPiece(rowNum, colNum);
        return tryPlace(this, targetPiece, value);
    }

    increment() {
        this._moveCount++;
    }

    _getRow(rowNum) {
        if (this._inRange(rowNum)) {
            return this._board[rowNum];
        }        
    }

    _getCol(colNum) {
        let col = [];
        if (this._inRange(colNum)) {
            this._board.forEach(function (row) {
                col.push(row[colNum]);
            });
        }
        return col;
    }

    _inRange(index){
        return index < this._size && index >= 0;
    }

    _getDiags() {
        let diag1 = [],
            diag2 = [];
        //using a for loop because we need to know which row we're on
        for (let i = 0; i < this._size; i++) {
            //push the ith piece in the i'th row (i counting up from 0 -> (size-1))
            diag1.push(this._getRow(i)[i]);
            //push the nth piece in the ith row (n counting down from (size - 1) -> 0)
            let n = this._size - 1 - i;
            diag2.push(this._getRow(i)[n]);
        }
        return [diag1, diag2];
    }

    /*
    returns whether or not that piece occurs the target number of times
    */

    endStateReached(piece) {
        return this._checkRows(piece) || this._checkCols(piece) || this._checkDiags(piece);
    }
    


    _checkRows(piece) {

        for (let i = 0; i < this._size; i++) {
            let list = this._getRow(i);
            //if we find enough consecutive pieces
            if (consecutive(target, piece, list)) {
                return true;
            }
        }
        return false;
    }

    _checkCols(piece) {

        for (let i = 0; i < this._size; i++) {
            let list = this._getCol(i);
            //if we find enough consecutive pieces
            if (consecutive(target, piece, list)) {
                return true;
            }
        }
        return false;
    }

    _checkDiags(piece) {
        let diags = this._getDiags();
        for (let i = 0; i < diags.length; i++) {
            let list = diags[i];
            if (consecutive(target, piece, list)) {
                return true;
            }
        }
        return false;
    }

    nextPiece() {
        return next(this._config, this._moveCount);
    }

    getConfig() {
        //TODO: validate the config?
        return this._config;
    }
}

function next(config, counter) {
    return new Piece(config, config[counter % config.length]);
}

function consecutive(target, piece, pieces) {
    let run = 0;
    for(let p of pieces) {
        let equal = p.equal(piece);
        if (equal) {
            if(++run >= target){
                return true
            }
        } else {
            run = 0;
        }
    }
    return false;
}

function tryPlace(board, piece, value) {
    if (piece.tryPlace(value)) {
        board.increment();
        return true;
    }
    return false;
}



var b = new Board(pieces,4);
b
p = new Piece(pieces, "X");
consecutive(4, p, b._getCol(0));
