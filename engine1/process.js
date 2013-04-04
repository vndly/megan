/*
	Copyright (c) 2010 Max Power
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	
*/
	
	function Process(run) {
		this.id = Megan.nextProcessId();
		this.x  = 0;
		this.y  = 0;
		this.width  = 0;
		this.height = 0;
		this.angle  = 0;
		this.alpha  = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		this.image  = null;
		this.visible  = false;
		this.isWakeUp = true;
		this.isFreeze = false;
		this.isSleep  = false;
		this.isFinish = false;
		
		//https://developer.mozilla.org/en/DOM/element.addEventListener
		//http://www.nonobtrusive.com/2009/07/24/custom-events-in-javascript-by-making-your-own-dispatcher-class/
		
		var getRun = function(run) {
			if (run)
				return run;
			else
				return (function() {})
		}
		
		this.run = getRun(run);
		
		this.setAngle = function(newAngle) {
			this.angle = parseInt(newAngle % 360);
			
			if (newAngle < 0)
				this.angle += 360;
		}
		
		this.addAngle = function(value) {
			this.setAngle(this.angle + value);
		}
		
		this.toRadian = function(angle) {
			return (angle * Math.PI) / 180.0;
		}
		
		this.cos = function(angle) {
			return Math.cos(this.toRadian(angle));
		}
		
		this.sin = function(angle) {
			return Math.sin(this.toRadian(angle));
		}
		
		this.advance = function(value) {
			this.x += parseInt(this.cos(this.angle) * value);
			this.y -= parseInt(this.sin(this.angle) * value);
		}
		
		this.isVisible = function() {
			return ((this.image != null) && (this.visible));
		}
		
		this.getAngleWith = function(process) {
			return -((Math.atan2(process.y - this.y, process.x - this.x)) * 180.0) / Math.PI;
		}
		
		this.getDistance = function(process) {
			return Math.sqrt(Math.pow(this.x - process.x, 2) + Math.pow(this.y - process.y, 2));
		}
		
		this.getDistanceX = function(process) {
			return Math.abs(this.x - process.x);
		}
		
		this.getDistanceY = function(process) {
			return Math.abs(this.y - process.y);
		}
		
		this.collision = function(type) {			
			return Megan.collision(this, type);
		}
		
		this.collisionWith = function(process) {
			return Megan.collisionWith(this, process);
		}
		
		this.setScaleX = function(value) {
			this.scaleX = value;
		}
		
		this.setScaleY = function(value) {
			this.scaleY = value;
		}
		
		this.setScale = function(value) {
			this.setScaleX(value);
			this.setScaleY(value);
		}
		
		this.existsProcess = function(process) {
			Megan.existsProcess(process);
		}
		
		this.existsType = function(type) {
			Megan.existsType(type);
		}
		
		this.letMeAlone = function() {
			Megan.letMeAlone(this);
		}
		
		this.moveUp = function(distance) {
			this.y -= distance;
		}
		
		this.moveDown = function(distance) {
			this.y += distance;
		}
		
		this.moveLeft = function(distance) {
			this.x -= distance;
		}
		
		this.moveRight = function(distance) {
			this.x += distance;
		}
		
		this.setImage = function(name) {
			if (name) {
				this.image   = Resources.getImage(name);
				this.visible = true;
				this.width   = this.image.width;
				this.height  = this.image.height;
			} else {
				this.image = null;
				this.visible = false;
			}
		}
		
		this.fadeIn = function() {
			//TODO
		}
		
		this.fadeOut = function() {
			//TODO
		}
		
		this.sleep = function() {
			this.visible  = false;
        	this.isSleep  = true;
        	this.isFreeze = false;
        	this.isWakeUp = false;
        	
        	//dispatchEvent(new Signal(Signal.SLEEP));
		}
		
		this.freeze = function() {
			this.visible  = true;
        	this.isFreeze = true;
        	this.isSleep  = false;
        	this.isWakeUp = false;
        	
        	//dispatchEvent(new Signal(Signal.FREEZE));
		}
		
		this.wakeUp = function() {
			this.visible  = true;
        	this.isFreeze = false;
        	this.isSleep  = false;
        	this.isWakeUp = true;
			
        	//dispatchEvent(new Signal(Signal.WAKE_UP));
		}
		
		this.finish = function(sendSignal) {
			this.isFinish = true;
        	this.isWakeUp = false;
        	
			//if (sendSignal)
			//	dispatchEvent(new Signal(Signal.FINISH));
			
			Megan.deleteProcess(this);
		}
		
		this.onSleep = function(func) {
			//addEventListener(Signal.FREEZE, func);
		}
		
		this.onFreeze = function(func) {
			//addEventListener(Signal.FREEZE, func);
		}
		
		this.onWakeUp = function(func) {
			//addEventListener(Signal.WAKE_UP, func);
		}
		
		this.onFinish = function(func) {
			//addEventListener(Signal.FINISH, func);
		}
		
		this.isSleeping = function() {
			return this.isSleep;
		}
		
		this.isFrozen = function() {
			return this.isFreeze;
		}
		
		this.isAwake = function() {
			return this.isWakeUp;
		}
		
		Megan.addProcess(this);
	}
	
	Process.create = function(process) {
		process.type = process.__proto__.constructor.name;
		process.superClass = Process;
		process.superClass(process.run);
		delete process.superClass;
	}