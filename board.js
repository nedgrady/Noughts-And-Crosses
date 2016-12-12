var size = 3;
var board1 = [];
var board2 = [];

board2 = new Array(size);
for (i = 0; i < board2.length; i++)
{
    board2[i] = new Array(size);

    for (j = 0; j < size; j++)
    {
        board2[i][j] = i + " " + j;
    }
}

board1 = new Array(size * size);
for (i = 0; i < board1.length; i++)
{
    board1[i] = i;
}

for (i = 0; i < board2.length; i++)
{
    for (j = 0; j < board2[i].length; j++)
    {
        console.log(board2[i][j]);
    }
}

function move1(piece, index)
{
    if (index < size * size && freeSquare(index))
    {
        board1[index] = piece;
        
    }    
}

function move2(piece, index)
{
    var row = indexToRow(index),
        column = indexToColumn(index);
    
    if (index < size * size && freeSquare(index)) {
        board2[row][column] = piece;
    }
}

function getRow1(rowNum)
{
    if (rowNum < size && rowNum >= 0)
    {
        var row = [];
        var start = rowNum * size;
        var end = start + size;
        for(i = start;i<end;i++)
        {
            row.push(board1[i]);
        }
    }
    return row;
}

function getRow2(rowNum)
{
    if (rowNum < board2.length && rowNum >= 0)
    {
        return board2[rowNum];
    }    
}

function getCol1(colNum)
{
    if (colNum < size && colNum > 0)
    {
        var column = [];
        var start = colNum * size;
        var end = start + size;

        for (i = start; i < end; i++) {
            column.push(board1[i]);
        }
        return column;
    }    
}

function getCol2(colNum)
{
    if (colNum < size)
    {
        var column = [];

        for(let row of board2)
        {
            column.push(row[colNum]);
        }
        return column;
    }    
}

function freeSquare1(index)
{
    return board1[index] == "";
}

function freeSquare2(index)
{
    return board2[indexToRow(index)][indexToColumn(index)] === "";
}

function indexToRow(index)
{
    return index % size;
}

function indexToColumn(index)
{
    return size - (index % size) - 1;
}

function drawBoard2()
{
    var HTMLTable = document.createElement("table");
    
    for(let row of board2)
    {
        var HTMLRow = document.createElement("tr");
        HTMLTable.appendChild(HTMLRow);
        for(let square of row)
        {
            var HTMLTableData = document.createElement("td")
            var button = document.createElement("button");
            HTMLRow.appendChild(HTMLTableData);
            HTMLTableData.appendChild(getButton());
        }
    }
    document.body.appendChild(HTMLTable);
}

function getButton()
{
    var button = document.createElement("input");
    button.type = "button";
    button.value = "TEST";
    return button;
    
}