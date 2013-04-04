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
	Megan.screen  = null;
	Megan.width   = 0;
	Megan.height  = 0;
	Megan.backColor = '#000000';
	Megan.backImage = '';
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
			Megan.fps = 20;
		
		if (width && height) {
			Megan.width  = width;
			Megan.height = height;
		} else {
			Megan.width  = document.body.clientWidth;
			Megan.height = document.body.clientHeight;
		}
		
		Megan.screen = new Screen(Megan.width, Megan.height);
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
	}
	
	Megan.onMouseMove = function(x, y) {
		//TODO
	}
	
	Megan.setHandCursor = function() {
		Megan.screen.setHandCursor();
	}
	
	Megan.setDefaultCursor = function() {
		Megan.screen.setDefaultCursor();
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
		Megan.backColor = color;
		Megan.backImage = '';
	}
	
	Megan.setBackgroundImage = function(name) {
		Megan.backColor = '';
		Megan.backImage = Resources.getImage(name);
	}
	
	Megan.run = function() {
		Megan.paintBackground();
		
		for (var index in Megan.process) {
			var process = Megan.process[index];
			
			if ((process) && process.isAwake()) {
				process.run();
				
				if (process.image && process.visible)
					Megan.screen.paint(process.image, process.x, process.y, process.width * process.scaleX, process.height * process.scaleY, process.angle);
			}
		}
		
		Megan.screen.show();
	}
	
	Megan.paintBackground = function() {
		if (Megan.backColor != '')
			Megan.screen.setBackgroundColor(Megan.backColor);
		else if (Megan.backImage != '')
			Megan.screen.setBackgroundImage(Megan.backImage, 0, 0, Megan.width, Megan.height);
	}
	
	Megan.addProcess = function(process) {
		Megan.process.push(process);
	}
	
	Megan.deleteProcess = function(process) {
		for (var index in Megan.process) {
			var current = Megan.process[index];
			
			if (current.id == process.id) {
				Megan.process.splice(index, 1);
				break;
			}
		}
	}
	
	Megan.letMeAlone = function(process) {
		Megan.process = new Array(process);
	}
	
	Megan.existsProcess = function(process) {
		var exist = false;
	
		for (var index in Megan.process) {
			var current = Megan.process[index];
			
			if (current.id == process.id) {
				exist = true;
				break;
			}
		}
		
		return exist;
	}
	
	Megan.collision = function(process, type) {
		var result = null;
		type = type.name;
		
		for (var index in Megan.process) {
			var current = Megan.process[index];
			
			if ((current.type == type) && Megan.collisionWith(current, process)) {
				result = current;
				break;
			}
		}
		
		return result;
	}
	
	Megan.collisionWith = function(p1, p2) {
		var dist = parseInt(Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)));
		
		return (p1.id != p2.id) && (dist < 30) && p1.visible && p2.visible ;
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