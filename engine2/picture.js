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
	
	function Picture(path) {
		this.path  = path;
		this.image = new Image();
		var matrix = new Array();
		
		this.load = function() {
			this.image.src = this.path;
			var current = this.image;
			
			this.image.onload = function() {
				Resources.imageLoaded();
				matrix = createMatrix(current);
			}
		}
		
		this.getMatrix = function() {
			return matrix;
		}
		
		var getPixels = function(image) {
			var canvas = document.createElement('canvas');
			canvas.width  = image.width;
			canvas.height = image.height;
			
			canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
			
			return canvas.getContext('2d').getImageData(0, 0, image.width, image.height).data;
		}
		
		var createMatrix = function(image) {
			var matrix = new Array(image.height);
			var pixels = getPixels(image);
			
			for (var i = 0; i < image.height; i++) {
				matrix[i] = new Array(image.width);
				
				for (var j = 0; j < image.width; j++) {
					var index = (i * image.width * 4) + (j * 4);
					
					matrix[i][j] = (255 - pixels[index + 3]) == 0;
				}
			}
			
			return matrix;
		}
	}