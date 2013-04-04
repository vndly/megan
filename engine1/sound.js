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
	
	function Sound(path) {
		this.path  = path;
		this.sound = document.createElement('audio');
		
		this.sound.setAttribute('src', path);
		this.sound.load();
		
		var test = new Audio(path).play();
		
		test.ended = function() {
			alert('end')
		}
		
		//http://www.position-absolute.com/articles/introduction-to-the-html5-audio-tag-javascript-manipulation/
		//http://forestmist.org/2010/04/html5-audio-loops/
		//http://www.javascripter.net/faq/sound/play.htm
		
		//test.addEventListener('ended', function() {
		  //this.sound.play();
		 // alert('finish')
		//}, true);
		
		this.sound.addEventListener('load', function() {
		  //this.sound.play();
		  alert('x')
		}, true);
		
		this.load = function() {
			//this.sound.src = this.path;
			
			this.sound.onload = function() {
				Resources.soundLoaded();
			}
		}
	}