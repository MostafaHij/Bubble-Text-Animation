/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let adjustX = 6;
let adjustY = 1;
ctx.lineWidth = 2;

let particlesArray = [];

const mouse = {
    x: null,
    y: null,
    radius: 150
}


window.addEventListener('mousemove', event => {
    mouse.x = event.x;
    mouse.y = event.y;
});


ctx.font = '30px Verdana';
ctx.fillText('JS', 0, 35);

const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 8 + 1;
        this.distance;
    }

    draw() { // drawing bubbles
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.strokeStyle = 'rgba(34,147,214,1)';
        ctx.beginPath();

        if (this.distance < mouse.radius - 5) {
            this.size = 13;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x - 4, this.y - 3, this.size / 2.5, 0, Math.PI * 2);
            ctx.arc(this.x + 7, this.y + 1, this.size / 3.5, 0, Math.PI * 2);


        } else if (this.distance <= mouse.radius) {
            this.size = 10;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.arc(this.x - 2, this.y - 2, this.size / 3, 0, Math.PI * 2);

        } else {
            this.size = 8;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x - 1, this.y - 1, this.size / 3, 0, Math.PI * 2);

        }

        ctx.closePath();
        ctx.fill();
    }


    update() {

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        this.distance = distance;
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / distance; // Example: * (100 - 20 = 80).  ** (80 / 100) = 0.8

        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;


        // particles in mouse area will move away
        if (distance < maxDistance) {

            this.x -= directionX;
            this.y -= directionY;

        } else { // particle in out of mouse area will come back to orginal position

            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }

        }
    }
}


function init() {
    particlesArray = [];

    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {

            // for each pexil we check if that pexil is more than 128.
            // number 128 means = 50% opacity because possible range for alpha balue in clamped array is between 0 and 255, within this range number is roughly 50%.
            // textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] means check every 4 pixles
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particlesArray.push(new Particle(positionX * 20, positionY * 20));
            }
        }
    }
}
init();


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();

    }
    requestAnimationFrame(animate)
}
animate();



window.addEventListener('resize', e => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});