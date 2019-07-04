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
        this.path[from.toString()] = to
    }

    hasPath(from, to) {
        let pathElement = this.path[from.toString()];
        let pathElement1 = this.path[to.toString()];
        return (to.equals(pathElement)|| from.equals(pathElement1))
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

    down(units = 1) {
        return new Location(this.columns, this.rows + units);
    }

    up(units = 1) {
        return new Location(this.columns, this.rows - units);
    }

    left(units = 1) {
        return new Location(this.columns - units, this.rows);
    }

    toPoint() {
        return new Point(this.columns * MazeCanvas.sizeOfEachSquare, this.rows * MazeCanvas.sizeOfEachSquare)
    }

    toString() {
        return `${this.columns},${this.rows}`
    }

    equals(other) {
        if(other !== null && other !== undefined) {
            return this.columns === other.columns && this.rows === other.rows
        } else {
            return false
        }
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    right(units = 1) {
        return new Point(this.x + units, this.y);
    }

    down(units = 1) {
        return new Point(this.x, this.y + units);
    }

    left(units = 1) {
        return new Point(this.x - units, this.y);
    }

    up(units = 1) {
        return new Point(this.x, this.y - units);
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
                        const location = Location.origin.right(column).down(row);
                        const point = location.toPoint();
                        this.context.beginPath();

                        const topRightCorner = point.right(MazeCanvas.sizeOfEachSquare);
                        if(!maze.hasPath(location, location.up())) {
                            this.context.moveTo(point.x, point.y);
                            this.context.lineTo(topRightCorner.x, topRightCorner.y);
                        }

                        const bottomRightCorner = topRightCorner.down(MazeCanvas.sizeOfEachSquare);
                        if(!maze.hasPath(location, location.right())) {
                            this.context.moveTo(topRightCorner.x, topRightCorner.y);
                            this.context.lineTo(bottomRightCorner.x, bottomRightCorner.y);
                        }

                        const bottomLeftCorner = bottomRightCorner.left(MazeCanvas.sizeOfEachSquare);
                        if(!maze.hasPath(location, location.down())) {
                            this.context.moveTo(bottomRightCorner.x, bottomRightCorner.y);
                            this.context.lineTo(bottomLeftCorner.x, bottomLeftCorner.y);
                        }

                        const topLeftCorner = bottomLeftCorner.up(MazeCanvas.sizeOfEachSquare);
                        if(!maze.hasPath(location, location.left())) {
                            this.context.moveTo(bottomLeftCorner.x, bottomLeftCorner.y);
                            this.context.lineTo(topLeftCorner.x, topLeftCorner.y);
                        }

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