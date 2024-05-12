const canvas=document.querySelector("canvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

const c=canvas.getContext('2d');

const score=document.querySelector("#score");
let curscore=0;

const startGameBtn=document.querySelector("#startGameBtn");

const modalEl=document.querySelector("#modalEl");

const bigScore=document.querySelector("#bigScore");

class Player{
    constructor(x,y,radius,color){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle=this.color;
        c.fill();
    }
}


class Projectile{
    constructor(x,y,radius,color,velocity){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle=this.color;
        c.fill();
    }
    update(){
        this.draw();
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y
    }
}

class Enemy{
    constructor(x,y,radius,color,velocity){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle=this.color;
        c.fill();
    }
    update(){
        this.draw();
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y
    }
}




let player=new Player(canvas.width/2,canvas.height/2,10,'white');
// player.draw();
// const projectile =new Projectile(canvas.width/2,canvas.height/2,5,'red',{x:1,y:1});
let projectiles=[];
let enemies=[];

function init(){
    player=new Player(canvas.width/2,canvas.height/2,10,'white');
    projectiles=[];
    enemies=[];
    curscore=0;
    score.innerHTML=curscore;
    bigScore.innerHTML=curscore;
}
let animationId;
function animate(){
    animationId=requestAnimationFrame(animate);
    c.fillStyle= 'rgba(0,0,0,0.1)';
    c.fillRect(0,0,canvas.width,canvas.height);
    player.draw();
    projectiles.forEach(projectile=>{
        projectile.update();
        if(projectile.x+projectile.radius<0||
            projectile.x-projectile.radius>canvas.width||
            projectile.y+projectile.radius<0||
            projectile.y-projectile.radius>canvas.height){
            setTimeout(() => {
                projectiles.splice(projindex,1);
            }, 0);
        }
    })
    enemies.forEach((enemy,enemindex)=>{
        enemy.update();
        const dist=Math.hypot(player.x-enemy.x,player.y-enemy.y);
        if(dist-(player.radius+enemy.radius)<1){
            cancelAnimationFrame(animationId);
            modalEl.style.display='flex';
            bigScore.innerHTML=curscore;
        }
        projectiles.forEach((projectile,projindex)=>{
            const dist=Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y);
            if(dist-(projectile.radius+enemy.radius)<1){
                curscore+=100;
                score.innerHTML=curscore;
                if(enemy.radius-10>10){
                    gsap.to(enemy,{radius:enemy.radius-10});
                    setTimeout(() => {
                        projectiles.splice(projindex,1);
                    }, 0);
                }
                else{
                    setTimeout(() => {
                        projectiles.splice(projindex,1);
                        enemies.splice(enemindex,1); 
                    }, 0); 
                }
            }
        })
    })
    
}
function spawnEnemies(){
    setInterval(()=>{
        const radius=Math.random()*(40-7)+7;
        let x,y;
        if(Math.random()<0.5){
            x=Math.random()<0.5?0-radius:canvas.width+radius;
            y=Math.random()*canvas.height;
        }
        else{
            x=Math.random()*canvas.width;
            y=Math.random()<0.5?0-radius:canvas.height+radius;
        }
        // const x=Math.random()<0.5?0-radius:canvas.width+radius;
        // const y=Math.random()<0.5?0-radius:canvas.height+radius;
        const color=`hsl(${Math.random()*360},50%,50%)`;
        const angle=Math.atan2(canvas.height/2-y,canvas.width/2-x);
        const velocity={x:Math.cos(angle)*3,y:Math.sin(angle)*3};
        enemies.push(new Enemy(x,y,radius,color,velocity))
    },8000);
}
window.addEventListener('mousedown',(event)=>{
    const angle=Math.atan2(event.clientY-canvas.height/2,event.clientX-canvas.width/2);
    const velocity={x:Math.cos(angle)*6,y:Math.sin(angle)*6};
    projectiles.push(new Projectile(canvas.width/2,canvas.height/2,5,'white',velocity));
    
});
window.addEventListener('mouseup', (event)=> {
	isDown=false;  
});


startGameBtn.addEventListener('click',()=>{
    init();
    animate();
    spawnEnemies();
    modalEl.style.display='none';
})


