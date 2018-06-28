const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
const scriptNode = document.getElementById("canvasNet");
const count = scriptNode.getAttribute("count") || 100;
const distance = scriptNode.getAttribute("distance") || 70;

const canvasElement = document.createElement("canvas");
canvasElement.style.position = 'absolute';
canvasElement.style.top = 0;
canvasElement.style.left = 0;
canvasElement.height = canvasHeight;
canvasElement.width = canvasWidth;

const ctx = canvasElement.getContext("2d");

document.body.appendChild(canvasElement);


function Dot(x,y){
	this.x = x;
	this.y = y;
	this.speedX = Math.random();
	this.speedY = Math.random();
	this.directionX = x%2 ==0?1:-1;
	this.directionY = x%2 ==0?1:-1;
}

Dot.prototype.run = function(){
	
	if(this.x<0 || this.x>canvasWidth){
		this.directionX *= -1;
	}
	if (this.y < 0 || this.y>canvasHeight){
		this.directionY *= -1;
	}
	this.x += this.speedX * this.directionX;
	this.y += this.speedY * this.directionY;
}


let dotArray = [];
for (let i = 0; i < count;i++){
	let x = Math.random()*canvasWidth|0;
	let y = Math.random()*canvasHeight|0;
	let dot = new Dot(x,y);
	dotArray.push(dot);
}

function clear(){
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function draw(){
	clear();
	dotArray.forEach((item,index)=>{
		ctx.fillRect(item.x,item.y,1,1);
		let nearArray = dotArray.filter((dot,dIndex) => dIndex!=index && getDistance(item.x,item.y,dot.x,dot.y)<distance);
		nearArray.forEach(nearItem=>{
			let alpha = 1 - getDistance(item.x, item.y, nearItem.x, nearItem.y) / distance;
			drawLine(item, nearItem, alpha);
		})
	});
	
}
function getDistance(x1, y1, x2, y2) {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function drawLine(item1, item2, alpha){
	ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
	ctx.beginPath();
	ctx.moveTo(item1.x, item1.y);
	ctx.lineTo(item2.x, item2.y);
	ctx.stroke();
}

(function tick(timestamp){
	window.requestAnimationFrame(tick);		
	
	dotArray.forEach(item => {
		item.run();
	});
	draw();
})()
