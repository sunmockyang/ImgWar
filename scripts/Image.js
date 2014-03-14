var ParticleMode = {
	orbitCenter: 0,
	avoid: 1,
	wander: 2,
	rearrange: 3,
	toMiddle: 4,
	attract: 5,
	boid: 6
}

function WholeImage(src){
	var that = this;
	this.canvas = null;

	this.image = new Image();
	this.image.src = src;
	this.src = src;
	this.width = this.height = -1;
	this.target = new Vector();

	this.children = [];
	this.center = new Vector();

	this.switchMode();

	this.image.onload = function(){that.onload();};
}

WholeImage.prototype.maxWidth =400;
WholeImage.prototype.maxHeight = 400;

WholeImage.prototype.onload = function() {
	this.offScreenCanvas();

	this.width = this.image.width;
	this.height = this.image.height;

	var x = Math.random() * (globs.cWidth - this.width);
	var y = Math.random() * (globs.cHeight - this.height);

	for(var i=0; i < this.width/this.size - 1; i ++){
		for (var j = 0; j < this.height/this.size - 1; j++) {
			var child = new ImageParticle(this.canvas, i, j, i*this.size, j*this.size, this.size, x, y, this.children, this);
			globs.allParticles.push(child);
			this.children.push(child);
		};
	};
};

WholeImage.prototype.switchMode = function() {
	var that = this;
	this.mode = Math.floor(Math.random() * Object.keys(ParticleMode).length);
	setTimeout(function(){that.switchMode();}, Math.random() * 10000 + 5000);
};

WholeImage.prototype.update = function() {
	this.findCenter();
	this.randomTarget();

	for (var i = 0; i < this.children.length; i++) {
		this.children[i].update();
	};
};

WholeImage.prototype.draw = function() {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].draw();
	};
	// globs.context.fillStyle = "#F00";
	// globs.context.fillRect(this.target.x, this.target.y, 10, 10);
};

WholeImage.prototype.randomTarget = function() {
	var x = Math.random() * (globs.cWidth);
	var y = Math.random() * (globs.cHeight);
	this.target = new Vector(x, y);
};

WholeImage.prototype.findCenter = function() {
	this.center.zeroify();
	for (var i = 0; i < this.children.length; i++) {
		this.center = this.center.add(this.children[i].pos);
	};
	this.center = this.center.divide(this.children.length);
};

WholeImage.prototype.offScreenCanvas = function() {
	this.canvas = document.createElement('canvas');
	if(this.image.width > this.maxWidth){
		this.image.height = this.image.height / (this.image.width/this.maxWidth);
		this.image.width = this.maxWidth;
	}
	else if(this.image.height > this.maxHeight){
		this.image.width = this.image.width / (this.image.height/this.maxHeight);
		this.image.height = this.maxHeight;
	}

	this.canvas.width = this.image.width;
	this.canvas.height = this.image.height;

	var context = this.canvas.getContext("2d");
	context.fillStyle = "#000";
	context.fillRect(0, 0, this.image.width, this.image.height);
	context.drawImage(this.image, 0,0,this.image.width, this.image.height);
};

WholeImage.prototype.quads = null;

function ImageParticle(image, iX, iY, srcX, srcY, srcSize, wholeX, wholeY, siblings, parent){
	this.image = image;

	this.iX = iX;
	this.iY = iY;

	this.srcX = srcX;
	this.srcY = srcY;
	this.srcSize = srcSize;

	this.accel = new Vector();
	this.speed = new Vector(Math.random() * this.maxSpeed*2 - this.maxSpeed, Math.random() * this.maxSpeed*2 - this.maxSpeed);
	this.pos = new Vector(wholeX + this.srcX / (this.srcSize / this.size), wholeY + this.srcY/ (this.srcSize / this.size));

	this.quad = this.quadManager.getQuadAt(this.pos.x, this.pos.y);

	this.siblings = siblings;
	this.parent = parent;

	this.awayCenter = new Vector();

	this.maxSpeed = Math.random()*2 + 3;

	this.draw();
}

ImageParticle.prototype.maxSpeed = 5;
ImageParticle.prototype.quadManager = null;

ImageParticle.prototype.update = function() {
	// this.avoid();

	if(globs.mouse.clicked == true && globs.mouse.mouseover == true){
		this.follow(new Vector(globs.mouse.x, globs.mouse.y));
	}
	else
		switch(this.parent.mode){
			case ParticleMode.orbitCenter:
				this.orbitCenter();
			break;
			case ParticleMode.avoid:
				this.avoid();
			break;
			case ParticleMode.wander:
				this.wander();
			break;
			case ParticleMode.rearrange:
				this.rearrange();
			break;
			case ParticleMode.toMiddle:
				this.toMiddle();
			break;
			case ParticleMode.attract:
				this.attract();
			break;
			case ParticleMode.boid:
				this.boid();
			break;
		}

	this.mouseAvoid();

	this.bounds();

	this.speed = this.speed.add(this.accel);

	this.speed.clamp(this.maxSpeed, -this.maxSpeed);

	this.pos = this.speed.add(this.pos);

	this.accel.zeroify();

	/*var neighbours = this.quad.getNeighbours(1);
	console.log(neighbours);

	for (var i = 0; i < neighbours.length; i++) {
		neighbours[i];
	};
*/
	// var mouseVec = this.pos.sub(new Vector(globs.mouse.x, globs.mouse.y));

	// var force = mouseVec.inverse();

	// this.pos = this.pos.add(force.multiply(10));
};

ImageParticle.prototype.boid = function() {
	this.attract(200);
	this.avoid(50);
};

ImageParticle.prototype.attract = function(size) {
	var distance = (size != undefined) ? size : 300;
	var neighbours = this.quad.getNeighbours(1);

	var center = new Vector();
	var num = 0;

	for (var i = 0; i < neighbours.length; i++) {
		if(this.parent.src == neighbours[i].parent.src && this.pos.sub(neighbours[i].pos).mag() < distance){
			center = center.add(neighbours[i].pos);
			num++;
		}
	};

	if(num === 0)
		return;

	center = center.divide(num);
	this.awayCenter = center.sub(this.pos);//this.pos.sub(center);

	var distanceFromCenter = this.pos.sub(center).mag();
	if(distanceFromCenter == 0)
		return;

	this.awayCenter = this.awayCenter.normalize().multiply((distance+1)/(distanceFromCenter+1) * 20);

	this.accel.x += this.awayCenter.x / 500;
	this.accel.y += this.awayCenter.y / 500;
};

ImageParticle.prototype.mouseAvoid = function(){
	var distance = 300;

	var center = new Vector(globs.mouse.x, globs.mouse.y);

	var distanceFromCenter = this.pos.sub(center).mag();
	if(distanceFromCenter == 0)
		return;

	this.awayCenter = this.pos.sub(center).normalize().multiply((distance+1)/(distanceFromCenter+1) * 100);

	this.accel.x += this.awayCenter.x / 500;
	this.accel.y += this.awayCenter.y / 500;
}

ImageParticle.prototype.avoid = function(size) {
	var neighbours = this.quad.getNeighbours(1);

	var center = new Vector();
	var num = 0;

	var distance = (size != undefined) ? size : 300;

	for (var i = 0; i < neighbours.length; i++) {
		if(this.parent.src == neighbours[i].parent.src && this.pos.sub(neighbours[i].pos).mag() < distance){
			center = center.add(neighbours[i].pos);
			num++;
		}
	};

	if(num === 0)
		return;

	center = center.divide(num);
	this.awayCenter = this.pos.sub(center);

	var distanceFromCenter = this.pos.sub(center).mag();
	if(distanceFromCenter == 0)
		return;

	this.awayCenter = this.pos.sub(center).normalize().multiply((distance+1)/(distanceFromCenter+1) * 30);

	this.accel.x += this.awayCenter.x / 500;
	this.accel.y += this.awayCenter.y / 500;
};

ImageParticle.prototype.orbitCenter = function() {
	this.follow(this.parent.center);
};

ImageParticle.prototype.follow = function(target) {
	var toCenter = target.sub(this.pos);
	this.accel.x += toCenter.x / 500;
	this.accel.y += toCenter.y / 500;
};


ImageParticle.prototype.toMiddle = function() {
	var toCenter = globs.canvasCenter.sub(this.pos);
	this.accel.x += toCenter.x / 500;
	this.accel.y += toCenter.y / 500;
};


ImageParticle.prototype.rearrange = function() {
	var toCenter = this.parent.target.sub(this.pos);
	this.accel.x += (toCenter.x - this.parent.image.width/2 + this.iX*this.size) / 500;
	this.accel.y += (toCenter.y - this.parent.image.height/2 + this.iY*this.size) / 500;
};

ImageParticle.prototype.wander = function(){
	var wiggle = 1;

	this.accel.x = Math.random()*wiggle*2 - wiggle;
	this.accel.y = Math.random()*wiggle*2 - wiggle;
};

ImageParticle.prototype.bounds = function() {
	var buffer = 50;
	if(this.pos.x < buffer || this.pos.x > this.canvas.width - buffer || this.pos.y < buffer || this.pos.y > this.canvas.height - buffer){
		this.toMiddle();
		return;
	}
};

ImageParticle.prototype.draw = function() {
	this.context.drawImage(this.image, this.srcX, this.srcY, this.srcSize, this.srcSize, this.pos.x, this.pos.y, this.size, this.size);

	// this.context.fillStyle = "red"
	// this.context.fillRect(this.awayCenter.x, this.awayCenter.y, 10, 10);

	// this.context.strokeStyle = "#F00";
	// this.context.beginPath();
	// this.context.moveTo(this.pos.x, this.pos.y);
	// this.context.lineTo(this.pos.x + this.awayCenter.x, this.pos.y + this.awayCenter.y);
	// this.context.stroke();
};

ImageParticle.prototype.canvas = null;
ImageParticle.prototype.context = null;

WholeImage.prototype.size = ImageParticle.prototype.size = 30;