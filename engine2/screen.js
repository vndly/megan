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
	
	Screen.screen = null;
	Screen.background = null;
	
	function Screen() {
	}
	
	Screen.init = function() {
		Screen.screen = document.getElementsByTagName('body')[0];
		
		Screen.background = document.createElement('img');
		Screen.background.src = '';
		Screen.background.style.position = 'absolute';
		Screen.background.style.left = 0;
		Screen.background.style.top  = 0;
		Screen.addImage(Screen.background);
		
		//TODO: index-z: ?
	}
	
	Screen.addImage = function(image) {
		Screen.screen.appendChild(image);
	}
	
	Screen.removeImage = function(image) {
		try {
			Screen.screen.removeChild(image);
		} catch (e) {
		}
	}
	
	Screen.setBackgroundImage = function(image, x, y, width, height) {
		Screen.background.src = image;
		
		if (x && y && width && height) {
			Screen.background.style.left   = x;
			Screen.background.style.top    = y;
			Screen.background.style.width  = width;
			Screen.background.style.height = height;
		} else {
			Screen.background.style.left   = 0;
			Screen.background.style.top    = 0;
			Screen.background.style.width  = Megan.width;
			Screen.background.style.height = Megan.height;
		}
	}
	
	Screen.setBackgroundColor = function(color) {
		Screen.background.src = '';
		Screen.screen.style.backgroundColor = color;
	}
	
	Screen.setHandCursor = function() {
		Screen.screen.style.cursor = 'pointer';
	}
	
	Screen.setDefaultCursor = function() {
		Screen.screen.style.cursor = 'default';
	}