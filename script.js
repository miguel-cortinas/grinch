const intro = document.getElementById('intro-screen');
const gift = document.getElementById('gift');
const card = document.getElementById('main-card');

/* CANVAS */
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

/* PARTÍCULAS */
class Particle{
    constructor(type){
        this.type = type;
        if(type === 'confetti'){
            this.x = w/2;
            this.y = h/2;
            this.size = Math.random()*6+4;
            this.vx = (Math.random()-.5)*18;
            this.vy = (Math.random()-.8)*18;
            this.life = 80;
            this.gravity = .6;
            this.rotation = Math.random()*360;
            this.spin = (Math.random()-.5)*20;
            this.color = ['#e62225','#89c926','#fcd93b','#fff'][Math.floor(Math.random()*4)];
        }else{
            this.x = Math.random()*w;
            this.y = Math.random()*h;
            this.size = Math.random()*3+1;
            this.vy = Math.random()*1.5+.5;
            this.color = '#fff';
        }
    }

    update(){
        if(this.type==='confetti'){
            this.x+=this.vx;
            this.y+=this.vy;
            this.vy+=this.gravity;
            this.rotation+=this.spin;
            this.life--;
        }else{
            this.y+=this.vy;
            if(this.y>h) this.y=0;
        }
    }

    draw(){
        ctx.fillStyle=this.color;
        if(this.type==='confetti'){
            ctx.save();
            ctx.translate(this.x,this.y);
            ctx.rotate(this.rotation*Math.PI/180);
            ctx.fillRect(-this.size/2,-this.size/2,this.size,this.size);
            ctx.restore();
        }else{
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
            ctx.fill();
        }
    }
}

/* NIEVE */
for(let i=0;i<50;i++) particles.push(new Particle('snow'));

function launchConfetti(){
    for(let i=0;i<120;i++) particles.push(new Particle('confetti'));
}

function animate(){
    ctx.clearRect(0,0,w,h);
    for(let i=particles.length-1;i>=0;i--){
        const p=particles[i];
        p.update();
        p.draw();
        if(p.type==='confetti' && p.life<=0){
            particles.splice(i,1);
        }
    }
    requestAnimationFrame(animate);
}
animate();

/* 🎬 APERTURA */
let opened=false;
intro.addEventListener('click',()=>{
    if(opened) return;
    opened=true;

    gift.classList.add('opening');
    launchConfetti();

    setTimeout(()=>intro.classList.add('fade-out'),700);
    setTimeout(()=>{
        intro.style.display='none';
        card.style.display='flex';
    },1300);
});
