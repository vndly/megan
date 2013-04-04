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
	
	Screen.offsetLeft = 0;
	Screen.offsetTop  = 0;
	
	//Crear clase Screen que gestione el canvas
	//Probar funcion: clearRect
	
	//http://stackoverflow.com/questions/2795269/does-html5-canvas-support-double-buffering
	//http://www.brighthub.com/hubfolio/matthew-casperson/blog/archive/2009/06/29/game-development-with-javascript-and-the-canvas-element.aspx
	
	function Screen(width, height) {
		this.screen = null;
		this.canvas = null;
		
		this.init = function(width, height) {
			this.canvas = document.createElement('canvas');
			this.canvas.style.position = 'absolute';
			this.canvas.width  = width;
			this.canvas.height = height;
			this.canvas.style.top  = ((document.body.clientHeight/2) - (height/2)) + 'px';
			this.canvas.style.left = ((document.body.clientWidth/2)  - (width/2)) + 'px';
			
			var body = document.getElementsByTagName('body')[0];
			body.appendChild(this.canvas);
			
			Screen.offsetLeft = this.canvas.offsetLeft;
			Screen.offsetTop  = this.canvas.offsetTop;
			
			this.screen = this.canvas.getContext('2d');
			
			this.canvas.onmousedown = function(event) {
				Megan.onMouseDown(event.clientX - Screen.offsetLeft, event.clientY - Screen.offsetTop);
			}
			
			this.canvas.onmousemove = function(event) {
				Megan.onMouseMove(event.clientX - Screen.offsetLeft, event.clientY - Screen.offsetTop);
			}
		}
		
		this.setHandCursor = function() {
			this.canvas.style.cursor = 'pointer';
		}
		
		this.setDefaultCursor = function() {
			this.canvas.style.cursor = 'default';
		}
		
		this.paint = function(image, x, y, width, height, angle) {
			if (angle != 0) {
				this.screen.save();
				this.screen.translate(x + (width/2), y + (height/2));
				this.screen.rotate((-angle) * Math.PI / 180);			
				this.screen.drawImage(image, 0, 0, width, height);
				this.screen.restore();
			} else 
				this.screen.drawImage(image, x, y, width, height);
		}
		
		this.setBackgroundImage = function(image, x, y, width, height) {
			this.screen.drawImage(image, x, y, width, height);
		}
		
		this.setBackgroundColor = function(color) {
			this.screen.fillStyle = color;  
			this.screen.fillRect(0, 0, Megan.width, Megan.height);
		}
		
		this.show = function() {
			//TODO: Implement Double Buffering
		}
		
		this.init(width, height);
	}