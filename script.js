const intro = document.getElementById('intro-screen');
const gift = document.getElementById('gift');
const card = document.getElementById('main-card');

const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');

let w, h, particles = [];

// Ajuste dinámico de pantalla
function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
}
window.addEventListener('resize', resize);
resize();

/* CLASE MAESTRA DE PARTÍCULAS (Reutiliza lógica para nieve y confeti) */
class Particle {
    constructor(type) {
        this.type = type;
        if (type === 'confetti') {
            // Configuración explosiva
            this.x = w / 2;
            this.y = h / 2;
            const a = Math.random() * Math.PI * 2;
            const s = Math.random() * 10 + 6;
            this.vx = Math.cos(a) * s;
            this.vy = Math.sin(a) * s - 6;
            this.gravity = .4;
            this.friction = .98;
            this.rotation = Math.random() * 360;
            this.spin = (Math.random() - .5) * 15;
            this.size = Math.random() * 6 + 6;
            this.life = 90;
            // Colores del Grinch
            this.color = ['#e62225', '#89c926', '#fcd93b', '#fff'][Math.floor(Math.random() * 4)];
        } else {
            // Configuración de Nieve suave
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vy = Math.random() * 1.5 + .5;
            this.size = Math.random() * 3 + 1;
            this.color = '#fff';
        }
    }
    update() {
        if (this.type === 'confetti') {
            this.vx *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.spin;
            this.life--;
        } else {
            this.y += this.vy;
            // Reciclaje de copos de nieve
            if (this.y > h) {
                this.y = -10;
                this.x = Math.random() * w;
            }
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        if (this.type === 'confetti') {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * .6);
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Inicializar nieve
for (let i = 0; i < 60; i++) particles.push(new Particle('snow'));

function launchConfetti() {
    for (let i = 0; i < 140; i++) particles.push(new Particle('confetti'));
}

// Loop de animación
function animate() {
    ctx.clearRect(0, 0, w, h);
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        // Eliminar confeti viejo para no saturar memoria
        if (p.type === 'confetti' && p.life <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(animate);
}
animate();

/* SECUENCIA DE APERTURA */
let opened = false;
intro.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    // 1. Animaciones visuales
    gift.classList.add('opening');
    launchConfetti();

    // 2. Transiciones de estado
    setTimeout(() => intro.classList.add('fade-out'), 700);
    setTimeout(() => {
        intro.style.display = 'none';
        card.style.display = 'flex';
        // Forzar un reflow para asegurar que la animación de entrada se ejecute
        void card.offsetWidth; 
        card.classList.add('show');
    }, 1300);
});