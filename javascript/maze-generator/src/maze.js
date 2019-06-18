class SquareDimension {
    constructor(columns) {
        this.columns = columns;
    }
}

class Maze {

    path = {};

    constructor(squareDimension) {
        this.squareDimension = squareDimension;
    }

    addPath(from, to){
        this.path[from] = to
    }

    hasPath(from, to) {
        return this.path[from] === to
    }
}

class Location {

    constructor(columns, rows) {
        this.columns = columns;
        this.rows = rows;
    }
}

class MazeCanvas {

    sizeOfEachSquare = 20;

    constructor(squareDimension) {
        this.squareDimension = squareDimension;
        const htmlCanvas =  document.createElement("canvas");
        htmlCanvas.id = "Maze";
        htmlCanvas.width = this.squareDimension.columns * this.sizeOfEachSquare;
        htmlCanvas.height = this.squareDimension.columns * this.sizeOfEachSquare;
        htmlCanvas.style.position = "absolute";
        htmlCanvas.style.border = "1px solid";

        document.getElementsByTagName("body")[0].appendChild(htmlCanvas);

        this.context = htmlCanvas.getContext("2d");
    }

    render(maze) {
        range(
            0,
            this.squareDimension.columns * this.sizeOfEachSquare,
            this.sizeOfEachSquare,
            (row) => {
                range(
                    0,
                    this.squareDimension.columns * this.sizeOfEachSquare,
                    this.sizeOfEachSquare,
                    (column) => {
                        this.context.rect(column, row, this.sizeOfEachSquare, this.sizeOfEachSquare);
                        this.context.stroke();
                    })
            }
        );
    }
}

function* generate(start = 0, end = 0, step = 1) {
    for (let i = start; i < end; i += step) {
        yield i;
    }
}

function range(start = 0, end = 0, step = 1, block) {
    const it = generate(start, end, step);
    let result = it.next();
    while (!result.done) {
        block(result.value);
        result = it.next();
    }
}


// main
(function() {

    let squareDimension = new SquareDimension(20);
    const mazeCanvas = new MazeCanvas(squareDimension);
    const maze = new Maze(squareDimension);
    mazeCanvas.render(maze)

})();