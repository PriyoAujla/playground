class SquareDimension {
    constructor(size) {
        this.size = size;
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
    static origin = new Location(0,0);

    constructor(columns, rows) {
        this.columns = columns;
        this.rows = rows;
    }

    right(units = 1) {
        return new Location(this.columns + units, this.rows);
    }

    bottom(units = 1) {
        return new Location(this.columns, this.rows + units);
    }

    toPoint() {
        return new Point(this.columns * MazeCanvas.sizeOfEachSquare, this.rows * MazeCanvas.sizeOfEachSquare)
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class MazeCanvas {

    static sizeOfEachSquare = 20;

    constructor(squareDimension) {
        this.squareDimension = squareDimension;
        const htmlCanvas =  document.createElement("canvas");
        htmlCanvas.id = "Maze";
        htmlCanvas.width = this.squareDimension.size * MazeCanvas.sizeOfEachSquare;
        htmlCanvas.height = this.squareDimension.size * MazeCanvas.sizeOfEachSquare;
        htmlCanvas.style.position = "absolute";
        htmlCanvas.style.border = "1px solid";

        document.getElementsByTagName("body")[0].appendChild(htmlCanvas);

        this.context = htmlCanvas.getContext("2d");
    }

    render(maze) {
        range(
            0,
            this.squareDimension.size,
            1,
            (row) => {
                range(
                    0,
                    this.squareDimension.size,
                    1,
                    (column) => {
                        const location = Location.origin.right(column).bottom(row);
                        const point = location.toPoint();
                        this.context.rect(point.x, point.y, MazeCanvas.sizeOfEachSquare, MazeCanvas.sizeOfEachSquare);
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