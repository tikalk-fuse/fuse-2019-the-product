const game = {
    canvas : document.getElementById("screen"),
    obstacles: [],
    level: 150,
    next: 0,
    start() {
        this.me = new component(30, 30, "red", 10, 120);
        this.me.gravity = 0.05;
        this.score = new component("30px", "Consolas", "black", 280, 40, "text");

        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.obstacles = [];
        clearInterval(game.interval);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function onLoad_startGame() {
    game.start();
}

function onMouse_accelerate(n) {
    game.me.gravity = n;
}

var ctx
class Component {
    constructor({width, height, fill, x, y, type, gameArea = game}) {
        this.type = type;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.fill = fill;
        this.speedX = 0;
        this.speedY = 0;
        this.gravity = 0;
        this.gravitySpeed = 0;
        this.game = gameArea;
    }
    top() { return this.y }
    left() { return this.x }
    right() { return this.x + this.width }
    bottom() { return this.y + this.height }
    update() {
        const ctx = this.game.context;
        ctx.fillStyle = this.fill;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    newPos() {
        this.newGravitySpeed();
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
    }
    newGravitySpeed() {
        const rockbottom = game.canvas.height - this.height;
        this.gravitySpeed += this.gravity;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    crashWith(other) {
        const right = ({x, width}) => x + width;
        const bottom = ({y, height}) => y + height;
        return !(
           this.bottom()  < other.top()
        || this.top()     > other.bottom()
        || this.right()   < other.left()
        || this.left()    > other.right()
        );
    }
}

function component(width, height, fill, x, y, type) {
    return new Component({width, height, fill, x, y, type});
}

function updateGameArea() {
    const x = game.canvas.width;

    if (game.obstacles.find(o => game.me.crashWith(o))) {
        clearInterval(game.interval);
        return console.log('game over');
    }

    game.clear();

    if (game.frameNo == game.next) {
        const rng = (max, min) => Math.floor(Math.random() * (max - min + 1) + min)
        const height = rng(200, 20);
        const gap = rng(120, 80);
        game.obstacles.push(
          component(10, height, "green", x, 0),
          component(10, x - height - gap, "green", x, height + gap)
        );
        game.level -= 5;
        game.next += game.level;
    }

    game.frameNo += 1;

    game.obstacles.forEach(o => {
        o.x -= 1;
        o.update();
    })
    for (i = 0; i < game.obstacles.length; i += 1) {
        game.obstacles[i].x += -1;
        game.obstacles[i].update();
    }
    game.score.text = "SCORE: " + game.frameNo;
    game.score.update();
    game.me.newPos();
    game.me.update();
}

