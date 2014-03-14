function Vector(x, y){
	this.x = (typeof x != "undefined") ? x : 0;
	this.y = (typeof y != "undefined") ? y : 0;
}

Vector.prototype.add = function(vec){
	return new Vector((this.x + vec.x), (this.y + vec.y)); //{x: (this.x + vec.x), y: (this.y + vec.y)};
}

Vector.prototype.sub = function(vec){
	return new Vector((this.x - vec.x), (this.y - vec.y)); //{x: (this.x + vec.x), y: (this.y + vec.y)};
}

Vector.prototype.mag = function(){
	return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
}

Vector.prototype.sqr = function() {
	return new Vector(this.x)
};

Vector.prototype.multiply = function(scale){
	return new Vector((this.x * scale), (this.y * scale));
}

Vector.prototype.divide = function(scale){
	return new Vector((this.x / scale), (this.y / scale));
}

Vector.prototype.inverse = function() {
	return new Vector(1/this.x, 1/this.y);
};

Vector.prototype.clamp = function(max, min){
	this.x = (this.x > max) ? max : ((this.x < min) ? min : this.x);
	this.y = (this.y > max) ? max : ((this.y < min) ? min : this.y);
};

Vector.prototype.normalize = function() {
	var mag = this.mag();
	return new Vector(this.x/mag, this.y/mag);
};

Vector.prototype.zeroify = function() {
	this.x = this.y = 0;
};

function Point (x, y) {
	this.x = (x != undefined) ? x : 0;
	this.y = (y != undefined) ? y : 0;
}

Point.prototype.dist = function(point) {
	var x = this.x - point.x;
	var y = this.y - point.y;

	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};

Point.prototype.mag = function(){
	return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
}

Point.prototype.vector = function(point){
	var x = this.x - point.x;
	var y = this.y - point.y;

	return new Point(x, y);
}

Point.prototype.add = function(point){
	this.x += point.x;
	this.y += point.y;
}

Point.prototype.sub = function(point){
	this.x -= point.x;
	this.y -= point.y;
}

Point.prototype.mult = function(v){
	return new Point(this.x*v, this.y*v);
}

Point.prototype.divide = function(scale){
	return new Point((this.x / scale), (this.y / scale));
}