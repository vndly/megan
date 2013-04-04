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
	
	//http://box2d-js.sourceforge.net/index2.html
	//http://forums.xkcd.com/viewtopic.php?f=11&t=62740
	//http://forums.vanthia.com/viewtopic.php?pid=1849
	//http://beej.us/blog/2010/02/html5s-canvas-part-ii-pixel-manipulation/
	//http://canvex.lazyilluminati.com/misc/cgi/issues.cgi/message/%3Cw2u185b16f71004072356u8a0a609bx4c7cca39a89ca4a7@mail.gmail.com%3E
	//http://www.mail-archive.com/whatwg@lists.whatwg.org/msg20926.html
	//http://html5app.com/blog/?p=435
	
	//CAKE
	//http://www.brighthub.com/hubfolio/matthew-casperson/blog/archive/2009/08/24/cake-programming-tutrorials.aspx
	//http://code.google.com/p/cakejs
	
	//http://upsidedownturtle.com/boredboredbored/
	//http://www.paulbrunt.co.uk/bert/
	//http://www.benjoffe.com/code/games/torus/
	//http://www.kesiev.com/akihabara/
	
	//IMPLEMENTAR JUEGOS:
	//http://www.pixelprospector.com/2009/11/echoes
	//http://www.pixelprospector.com/2010/03/grid-assault
	//http://www.pixelprospector.com/2009/12/rainbow-wars
	
	//Crear funciones para mostrar texto
	
	//------------------------------------------------------------------------
	
	function Megan() {
	}
	
	Megan.fps     = 0;
	Megan.process = new Array();
	Megan.keys    = new Array();
	Megan.width   = 0;
	Megan.height  = 0;
	Megan.lastProcessId = 0;
	
	Megan.init = function(fps, width, height) {
		document.onkeydown = function(event) {
			Megan.keyPressed(event)
		}
		
		document.onkeyup = function(event) {
			Megan.keyReleased(event)
		}
		
		var html = document.getElementsByTagName('html')[0];
		html.style.overflow = 'hidden';
		
		if (fps)
			Megan.fps = fps;
		else
			Megan.fps = 30;
		
		if (width && height) {
			Megan.width  = width;
			Megan.height = height;
		} else {
			Megan.width  = document.body.clientWidth;
			Megan.height = document.body.clientHeight;
		}
		
		Screen.init();
	}
	
	Function.prototype.bind = function() {
		var that = this;
		var args = new Array();
		
		for (var i = 0; i < arguments.length; i++)
			args.push(arguments[i]);
		
		var object = args.shift();
		
		return function() {
			return that.apply(object, args);
		}
	}
	
	Megan.onMouseDown = function(x, y) {
		//TODO
		alert('CLICK: (' + x + ', ' + y + ')');
	}
	
	Megan.onMouseMove = function(x, y) {
		//TODO
	}
	
	Megan.setHandCursor = function() {
		Screen.setHandCursor();
	}
	
	Megan.setDefaultCursor = function() {
		Screen.setDefaultCursor();
	}
	
	Megan.nextProcessId = function() {
		return Megan.lastProcessId++;
	}
	
	Megan.random = function(min, max) {
		return parseInt(min) + Math.round(Math.random() * (max - min));
	}
	
	Megan.start = function() {
		setInterval(Megan.run, parseInt(1000/Megan.fps));
	}
	
	Megan.setBackgroundColor = function(color) {
		Screen.setBackgroundColor(color);
	}
	
	Megan.setBackgroundImage = function(image) {
		Screen.setBackgroundImage(image);
	}
	
	Megan.addProcess = function(process) {
		Megan.process.push(process);
	}
	
	Megan.deleteProcess = function(process) {
		for (var i = 0; i < Megan.process.length; i++) {
			var current = Megan.process[i];
			
			if (current.getId() == process.getId()) {
				current.removeImage();
				Megan.process.splice(i, 1);
				break;
			}
		}
	}
	
	Megan.letMeAlone = function(process) {
		for (var i = 0; i < Megan.process.length; i++)
			Megan.process[i].removeImage();
		
		Megan.process = new Array(process);
	}
	
	Megan.existsProcess = function(process) {
		var exist = false;
	
		for (var i = 0; i < Megan.process.length; i++) {
			var current = Megan.process[i];
			
			if (current.getId() == process.getId()) {
				exist = true;
				break;
			}
		}
		
		return exist;
	}
	
	Megan.run = function() {
		for (var i = 0; i < Megan.process.length; i++) {
			var process = Megan.process[i];
			
			if ((process) && process.isAwake()) {
				process.run();
				process.updateMatrix();
			}
		}
	}
	
	Megan.collision = function(process, type) {
		var result = null;
		type = type.name;
		
		for (var i = 0; i < Megan.process.length; i++) {
			var current = Megan.process[i];
			
			if ((current.type == type) && Megan.collisionWith(current, process)) {
				result = current;
				break;
			}
		}
		
		return result;
	}
	
	Megan.containsPosition = function(matrix, x, y) {
		var contains = false;
		
		for (var i = 0; i < matrix.length; i += 2) {
			if ((matrix[i] == x) && (matrix[i + 1] == y)) {
				contains = true;
				break;
			}
		}
		
		return contains;
	}
	
	Megan.isClose = function(p1, p2) {
		var p1x = p1.getX() + (p1.width()/2);
		var p1y = p1.getY() + (p1.height()/2);
		
		var p2x = p2.getX() + (p2.width()/2);
		var p2y = p2.getY() + (p2.height()/2);
		
		var dist = parseInt(Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2)));
		
		return ((p1.getId() != p2.getId()) && (dist <= (p1.size() + p2.size())) && p1.isVisible() && p2.isVisible());
	}
	
	Megan.collisionWith = function(p1, p2) {
		var collision = false;
		
		if (Megan.isClose(p1, p2)) {
			var matrix1 = p1.getMatrix();
			var matrix2 = p2.getMatrix();
			
			if ((matrix1 != null) && (matrix2 != null)) {
				for (var i = 0; i < matrix1.length; i += 2) {
					if (Megan.containsPosition(matrix2, matrix1[i], matrix1[i + 1])) {
						collision = true;
						break;
					}
				}
			}
		}
		
		return collision;
	}
	
	Megan.keyPressed = function(event) {
		Megan.keys[event.keyCode] = true;
	}
	
	Megan.keyReleased = function(event) {
		Megan.keys[event.keyCode] = false;
	}
	
	Megan.key = function(code) {
		return (Megan.keys[code] == true);
	}
	
	Megan.keyUp = function() {
		return Megan.key(38);
	}
	
	Megan.keyDown = function() {
		return Megan.key(40);
	}
	
	Megan.keyLeft = function() {
		return Megan.key(37);
	}
	
	Megan.keyRight = function() {
		return Megan.key(39);
	}
	
	Megan.keySpace = function() {
		return Megan.key(32);
	}
	
	Megan.keyEscape = function() {
		return Megan.key(27);
	}
	
	Megan.keyEnter = function() {
		return Megan.key(13);
	}