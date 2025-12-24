const intro = document.getElementById('intro-screen');
const gift = document.getElementById('gift');
const card = document.getElementById('main-card');

/* ================= CANVAS ================= */
const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');

let w, h;
let particles = [];

function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
}
window.addEventListener('resize', resize);
resize();

/* ================= PARTÍCULAS ================= */
class Particle{
    constructor(type){
        this.type = type;

        if(type === 'confetti'){
            this.x = w / 2;
            this.y = h / 2;

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 10 + 6;

            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 6;

            this.gravity = 0.4;
            this.friction = 0.98;

            this.rotation = Math.random() * 360;
            this.spin = (Math.random() - 0.5) * 15;

            this.size = Math.random() * 6 + 6;
            this.life = 90;

            this.color = ['#e62225', '#89c926', '#fcd93b', '#ffffff']
                [Math.floor(Math.random() * 4)];
        } 
        else {
            /* nieve */
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vy = Math.random() * 1.5 + 0.5;
            this.size = Math.random() * 3 + 1;
            this.color = '#fff';
        }
    }

    update(){
        if(this.type === 'confetti'){
            this.vx *= this.friction;
            this.vy += this.gravity;

            this.x += this.vx;
            this.y += this.vy;

            this.rotation += this.spin;
            this.life--;
        } else {
            this.y += this.vy;
            if(this.y > h){
                this.y = -10;
                this.x = Math.random() * w;
            }
        }
    }

    draw(){
        ctx.fillStyle = this.color;

        if(this.type === 'confetti'){
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillRect(
                -this.size / 2,
                -this.size / 2,
                this.size,
                this.size * 0.6
            );
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

/* ================= NIEVE BASE ================= */
for(let i = 0; i < 60; i++){
    particles.push(new Particle('snow'));
}

/* ================= CONFETTI ================= */
function launchConfetti(){
    for(let i = 0; i < 140; i++){
        particles.push(new Particle('confetti'));
    }
}

/* ================= LOOP ================= */
function animate(){
    ctx.clearRect(0, 0, w, h);

    for(let i = particles.length - 1; i >= 0; i--){
        const p = particles[i];
        p.update();
        p.draw();

        if(p.type === 'confetti' && p.life <= 0){
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(animate);
}
animate();

/* ================= INTRO ================= */
let opened = false;

intro.addEventListener('click', () => {
    if(opened) return;
    opened = true;

    gift.classList.add('opening');
    launchConfetti();

    setTimeout(() => intro.classList.add('fade-out'), 700);
    setTimeout(() => {
        intro.style.display = 'none';
        card.style.display = 'flex';
    }, 1300);
});
