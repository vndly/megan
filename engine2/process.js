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
		var id = Megan.nextProcessId();
		var x  = 0;
		var y  = 0;
		var width     = 0;
		var height    = 0;
		var angle     = 0;
		var alpha     = 0;
		var imageName = '';
		var image     = null;
		var visible   = false;
		var isWakeUp  = true;
		var isFreeze  = false;
		var isSleep   = false;
		var isFinish  = false;
		var matrix    = new Array();
		
		//https://developer.mozilla.org/en/DOM/element.addEventListener
		//http://www.nonobtrusive.com/2009/07/24/custom-events-in-javascript-by-making-your-own-dispatcher-class/
		
		var getRun = function(run) {
			if (run)
				return run;
			else
				return (function() {})
		}
		
		this.updateMatrix = function() {
			if (image) {
				matrix = new Array();
				var pixels = Resources.getImageMatrix(imageName);
				
				for (var i = 0; i < image.height; i++) {
					for (var j = 0; j < image.width; j++) {
						if (pixels[i][j])
							matrix.push(parseInt(x + j), parseInt(y + i));
					}
				}
			} else
				matrix = null;
		}
		
		this.run = getRun(run);
		
		this.getId = function() {
			return id;
		}
		
		this.setAngle = function(newAngle) {
			angle = parseInt(newAngle % 360);
			
			if (newAngle < 0)
				angle += 360;
			
			if (image) {
				image.style.setProperty('-moz-transform', 'rotate(' + (-angle) + 'deg)', null);
				image.style.setProperty('-webkit-transform', 'rotate(' + (-angle) + 'deg)', null);
			}
		}
		
		this.addAngle = function(value) {
			this.setAngle(angle + value);
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
			x += parseInt(this.cos(angle) * value);
			y -= parseInt(this.sin(angle) * value);
			updatePosition();
		}
		
		this.isVisible = function() {
			return ((image != null) && (visible));
		}
		
		this.getAngleWith = function(process) {
			return -((Math.atan2(process.getY() - y, process.getX() - x)) * 180.0) / Math.PI;
		}
		
		this.getDistance = function(process) {
			return Math.sqrt(Math.pow(x - process.getX(), 2) + Math.pow(y - process.getY(), 2));
		}
		
		this.getDistanceX = function(process) {
			return Math.abs(x - process.getX());
		}
		
		this.getDistanceY = function(process) {
			return Math.abs(y - process.getY());
		}
		
		this.collision = function(type) {			
			return Megan.collision(this, type);
		}
		
		this.collisionWith = function(process) {
			return Megan.collisionWith(this, process);
		}
		
		this.setScaleX = function(value) {
			image.width = width * value;
		}
		
		this.setScaleY = function(value) {
			image.height = height * value;
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
			y -= distance;
			updatePosition();
		}
		
		this.moveDown = function(distance) {
			y += distance;
			updatePosition();
		}
		
		this.moveLeft = function(distance) {
			x -= distance;
			updatePosition();
		}
		
		this.moveRight = function(distance) {
			x += distance;
			updatePosition();
		}
		
		this.width = function() {
			var result = 0;
			
			if (image)
				result = image.width;
				
			return result;
		}
		
		this.height = function() {
			var result = 0;
			
			if (image)
				result = image.height;
				
			return result;
		}
		
		this.size = function() {
			var size = 0;
			
			if (image) {
				if (image.width > image.height)
					size = image.width/2;
				else
					size = image.height/2;
			}
			
			return size;
		}
		
		this.getX = function() {
			return x;
		}
		
		this.getY = function() {
			return y;
		}
		
		this.setX = function(value) {
			x = value;
			updatePosition();
		}
		
		this.setY = function(value) {
			y = value;
			updatePosition();
		}
		
		var updatePosition = function() {
			if (image) {
				image.style.left = parseInt(x);
				image.style.top  = parseInt(y);
			}
		}
		
		this.removeImage = function() {
			Screen.removeImage(image);
		}
		
		this.getMatrix = function() {
			return matrix;
		}
		
		this.setImage = function(name) {
			if (name) {
				imageName = name;
				visible   = true;
				
				if (image) {
					image.src = name;
					width  = image.width;
					height = image.height;
				} else {
					image = document.createElement('img');
					image.src = name;
					image.style.position = 'absolute';
					updatePosition();
					Screen.addImage(image);
					
					width  = image.width;
					height = image.height;
				}
			} else {
				if (image) {
					this.removeImage();
					image = null;
					imageName = '';
				}
				visible = false;
			}
		}
		
		this.fadeIn = function() {
			//TODO
		}
		
		this.fadeOut = function() {
			//TODO
		}
		
		this.sleep = function() {
			visible  = false;
        	isSleep  = true;
        	isFreeze = false;
        	isWakeUp = false;
        	
        	//dispatchEvent(new Signal(Signal.SLEEP));
		}
		
		this.freeze = function() {
			visible  = true;
        	isFreeze = true;
        	isSleep  = false;
        	isWakeUp = false;
        	
        	//dispatchEvent(new Signal(Signal.FREEZE));
		}
		
		this.wakeUp = function() {
			visible  = true;
        	isFreeze = false;
        	isSleep  = false;
        	isWakeUp = true;
			
        	//dispatchEvent(new Signal(Signal.WAKE_UP));
		}
		
		this.finish = function(sendSignal) {
			isFinish = true;
        	isWakeUp = false;
        	
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
			return isSleep;
		}
		
		this.isFrozen = function() {
			return isFreeze;
		}
		
		this.isAwake = function() {
			return isWakeUp;
		}
		
		Megan.addProcess(this);
	}
	
	Process.create = function(process) {
		process.type = process.__proto__.constructor.name;
		process.superClass = Process;
		process.superClass(process.run);
		delete process.superClass;
	}