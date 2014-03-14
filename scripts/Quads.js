function Quadrants(width, height, size){
	Quad.prototype.manager = this;

	this.quads = [];
	this.size = size;

	this.iWidth = width/size;
	this.iHeight = height/size;

	for (var i = 0; i < this.iWidth; i++) {
		var temp = [];
		for (var j = 0; j < this.iHeight; j++) {
			temp.push(new Quad(i*size, j*size, i, j, size));
		};
		this.quads.push(temp);
	};

	this.counter = 0;

	Quad.prototype.rRand = Math.random()*2 * Math.PI;
	Quad.prototype.gRand = Math.random()*2 * Math.PI;
	Quad.prototype.bRand = Math.random()*2 * Math.PI;
}

Quadrants.prototype.draw = function() {
	for (var i = 0; i < this.quads.length; i++) {
		for (var j = 0; j < this.quads[i].length; j++) {
			this.quads[i][j].draw(this.counter);
		};
	};

    this.counter++;
    if(this.counter > 10000000000000)
    	this.counter = 0;
};

Quadrants.prototype.getQuadAt = function(x, y) {
	var i = Math.floor(x/this.size);
	var j = Math.floor(y/this.size);

	return (this.quads[i] == undefined) ? null : this.quads[i][j];
};

// Need a quad, pos attribute to work properly.
Quadrants.prototype.processObj = function(obj) {
	var quad = this.getQuadAt(obj.pos.x, obj.pos.y);

	if(!quad)
		return;

	if(quad.contains(obj)){

	} else{
		obj.quad.removeObj(obj);
		obj.quad = quad;
		quad.addObj(obj);
	}
};

Quadrants.prototype.addTo = function(x, y, obj) {

	this.getQuadAt(x,y).addObj(obj);
};

function Quad(x, y, xIndex, yIndex, size){
	this.x = x;
	this.y = y;

	this.xIndex = xIndex;
	this.yIndex = yIndex;

	this.size = size;

	this.objs = [];

	this.rMultiplier = 1;
	this.gMultiplier = 1;
	this.bMultiplier = 1;
}

Quad.prototype.manager = null;

Quad.prototype.draw = function(counter) {
	this.rMultiplier = (Math.sin(counter/100 + this.rRand) + 1) * 2;
	this.gMultiplier = (Math.sin(counter/100 + this.gRand)+ 1) * 2;
	this.bMultiplier = (Math.sin(counter/100 + this.bRand)+ 1) * 2;

    // globs.context.strokeStyle = "#555";

    // globs.context.lineWidth = 1;
    // globs.context.strokeRect(this.x, this.y, this.size, this.size);
    var rTint = this.objs.length * this.rMultiplier;
    rTint = Math.floor(Math.min(rTint, 255));

    var gTint = this.objs.length * this.gMultiplier;
    gTint = Math.floor(Math.min(gTint, 255));

    var bTint = this.objs.length * this.bMultiplier;
    bTint = Math.floor(Math.min(bTint, 255));

    globs.context.fillStyle = "rgb(" + rTint +"," + gTint + ", " + bTint + ")";
    //globs.context.fillStyle = "#FFF"
    globs.context.fillRect(this.x, this.y, this.size, this.size);
};

Quad.prototype.addObj = function(obj) {
	this.objs.push(obj);

	return [this.xIndex, this.yIndex];
};

Quad.prototype.removeObj = function(obj){
	var i = this.objs.indexOf(obj);
	
	if (i > -1) {
		this.objs.splice(i, 1);
	}
};

Quad.prototype.getNeighbours = function(depth) {
	var objs = [];

	var searchRadi = depth*2+1;

	var startX = Math.max(0,this.xIndex-depth);
	var endX = Math.min(this.xIndex + searchRadi, this.manager.iWidth);

	var startY = Math.max(0,this.yIndex-depth);
	var endY = Math.min(this.yIndex + searchRadi, this.manager.iHeight);

	for (var i = startX; i < endX; i++) {
		for (var j = startY; j < endY; j++) {
			objs.push.apply(objs, this.manager.quads[i][j].objs);
		};
	};

	return objs;
};

Quad.prototype.contains = function(obj) {
	if(this.objs.indexOf(obj) != -1)
		return true;
	return false;
};