class SquareDimension {
    constructor(size) {
        this.size = size;
    }
}

class Maze {

    path = new Set();

    constructor(squareDimension) {
        this.squareDimension = squareDimension;
    }

    addPath(from, to){
        this.path.add(this.idOfPath(from, to));
    }

    hasPath(from, to) {
        return this.path.has(this.idOfPath(from, to));
    }

    idOfPath(from, to) {
        let id;
        if(from.columns <= to.columns && from.rows <= to.rows) {
            id = `${from.toString()}<->${to.toString()}`
        } else {
            id = `${to.toString()}<->${from.toString()}`
        }
        return id
    }
}

class MazeBuilder {

    * start(seed, squareDimension) {
        const maze = new Maze(squareDimension);
        const mulberry = mulberry32(seed);
        const random = () => Math.floor(mulberry() * Math.pow(10, 16));

        let current = new Location(random() % squareDimension.size, random() % squareDimension.size);
        const visited = {};
        const stack = [];

        visited[current] = true;
        stack.push(current);
        while(stack.length > 0) {
            const unvisitedNeighbours = this.findUnvisitedNeighbours(current, visited, squareDimension);

            if(unvisitedNeighbours.length === 1)    {
                const chosenNeighbour = unvisitedNeighbours.pop();
                maze.addPath(current, chosenNeighbour);
                stack.push(current);
                current = chosenNeighbour;
                visited[current] = true;
            }
            else if(unvisitedNeighbours.length > 1) {
                const chosenNeighbour = unvisitedNeighbours[(random() % unvisitedNeighbours.length)];
                maze.addPath(current, chosenNeighbour);
                stack.push(current);
                current = chosenNeighbour;
                visited[current] = true;
            }
            else {
                current = stack.pop();
            }

            yield maze
        }
    }

    findUnvisitedNeighbours(location, visited, squareDimension) {
        return Array.of(
            location.up(),
            location.right(),
            location.down(),
            location.left()
        )
            .filter((neighbour) => {
                return visited[neighbour] === undefined
            })
            .filter((neighbour) => {
                return neighbour.columns >= 0 &&
                    neighbour.rows >= 0 &&
                    neighbour.columns <= squareDimension.size - 1 &&
                    neighbour.rows <= squareDimension.size - 1
            });

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
        return `column:${this.columns},row:${this.rows}`
    }

    equals(other) {
        if(other !== null && other !== undefined) {
            return this.columns === other.columns && this.rows === other.rows
        } else {
            return false
        }
    }

    isValid() {
        return this.columns >= 0 && this.rows >= 0;
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
        htmlCanvas.style.border = "none";


        document.getElementsByTagName("body")[0].appendChild(htmlCanvas);

        this.context = htmlCanvas.getContext("2d");
    }

    render(maze) {

        this.context.clearRect(
            0,
            0,
            this.squareDimension.size * MazeCanvas.sizeOfEachSquare,
            this.squareDimension.size * MazeCanvas.sizeOfEachSquare
        );

        this.context.beginPath();

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
                        if(!maze.hasPath(location, location.up()) && !location.equals(new Location(0,0))) {
                            this.context.moveTo(point.x, point.y);
                            this.context.lineTo(topRightCorner.x, topRightCorner.y);
                        }

                        const bottomRightCorner = topRightCorner.down(MazeCanvas.sizeOfEachSquare);
                        if(!maze.hasPath(location, location.right())) {
                            this.context.moveTo(topRightCorner.x, topRightCorner.y);
                            this.context.lineTo(bottomRightCorner.x, bottomRightCorner.y);
                        }

                        const bottomLeftCorner = bottomRightCorner.left(MazeCanvas.sizeOfEachSquare);
                        if(!maze.hasPath(location, location.down()) && !location.equals(new Location(this.squareDimension.size - 1,this.squareDimension.size - 1))) {
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

    renderWalk(maze,theWalk) {
        this.render(maze);
        theWalk.forEach((location) => {
            this.context.beginPath();
            this.context.fillStyle = "#b78b54";

            const point = location.toPoint();
            const halfOfSquareSize = Math.floor(MazeCanvas.sizeOfEachSquare / 2);
            const middleOfSquare = point
                .right(halfOfSquareSize)
                .down(halfOfSquareSize);

            const sizeOfBreadcrumb =  Math.floor(MazeCanvas.sizeOfEachSquare / 8);
            this.context.moveTo(middleOfSquare.x, middleOfSquare.y);
            this.context.arc(middleOfSquare.x, middleOfSquare.y, sizeOfBreadcrumb, 0, Math.PI * 2, true);

            this.context.fill();
        })
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

class MazeWalker {

    constructor(start, end, maze) {
        this.start = start;
        this.end = end;
        this.maze = maze;
        this.breadcrumbs = [];
    }

    * walk(seed) {
        const mulberry = mulberry32(seed);
        const random = () => Math.floor(mulberry() * Math.pow(10, 16));

        let current = this.start;
        let visited = {};

        visited[current] = true;
        while(!this.end.equals(current)) {
            const possibleMoves = Array.of(
                current.up(),
                current.right(),
                current.down(),
                current.left(),
            ).filter((location)=> {
                return location.isValid() &&
                    this.maze.hasPath(current, location) &&
                    location.columns <= this.maze.squareDimension.size - 1 &&
                    location.rows <= this.maze.squareDimension.size - 1 &&
                    visited[location] === undefined
            });

            if(possibleMoves.length > 0) {
                const locationToMoveTo = possibleMoves[random() % possibleMoves.length];
                this.breadcrumbs.push(current);
                current = locationToMoveTo;
                visited[locationToMoveTo] = true;
            } else {
                current = this.breadcrumbs.pop();
            }

            yield this;

        }
        this.breadcrumbs.push(current);

        yield this;
    }
}


// main
(function() {

    let squareDimension = new SquareDimension(40);

    let generate = new MazeBuilder()
        .start(100, squareDimension);

    let mazeBuilding = generate
        .next();

    let maze;

    let walkGenerator;
    let walkerProgress;
    let walker;

    const mazeCanvas = new MazeCanvas(squareDimension);

    window.setInterval(() => {
        if (!mazeBuilding.done) {
            maze = mazeBuilding.value;
            mazeCanvas.render(maze);
            mazeBuilding = generate.next();
        } else if (walkGenerator === undefined || !walkerProgress.done) {
            if(walkGenerator === undefined) {
                const start = new Location(0,0);
                const exit = new Location(squareDimension.size - 1, squareDimension.size - 1);
                walkGenerator = new MazeWalker(start, exit, maze)
                    .walk(100);
            }

            walkerProgress = walkGenerator.next();
            if(!walkerProgress.done) {
                walker = walkerProgress.value;
                mazeCanvas.renderWalk(maze, walker.breadcrumbs);
            } else {
                console.log(walker.breadcrumbs.length);
            }

        }
    }, 5);


})();

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function mulberry32(a) {
    return function() {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}