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
	
	function Resources() {
	}
	
	Resources.finish = null;
	
	Resources.imagesLoaded = 0;
	Resources.images = new Array();
	
	Resources.soundsLoaded = 0;
	Resources.sounds = new Array();
	
	Resources.getImage = function(path) {
		return Resources.images[Resources.getImageIndex(path)].image;
	}
	
	Resources.getImageMatrix = function(path) {
		return Resources.images[Resources.getImageIndex(path)].getMatrix();
	}
	
	Resources.getImageIndex = function(path) {
		var index = 0;
		
		for (var i = 0; i < Resources.images.length; i++) {
			if (Resources.images[i].path == path) {
				index = i;
				break;
			}
		}
		
		return index;
	}
	
	Resources.getSound = function(path) {
		var sound = null;
		
		for (var index in Resources.sounds) {
			var audio = Resources.sounds[index];
			
			if (audio.path == path) {
				sound = audio.sound;
				break;
			}
		}
		
		return sound;
	}
	
	Resources.addImages = function(containter) {
		for (var attribute in containter) {
			if (typeof(containter[attribute]) == 'string')
				Resources.images.push(new Picture(containter[attribute]));
		}
	}
	
	Resources.addSounds = function(containter) {
		for (var attribute in containter) {
			if (typeof(containter[attribute]) == 'string')
				Resources.sounds.push(new Sound(containter[attribute]));
		}
	}
	
	Resources.load = function(finish, imageContainer, soundContainer) {
		Resources.finish = finish;
		
		if (imageContainer)
			Resources.addImages(imageContainer);
		
		if (soundContainer)
			Resources.addSounds(soundContainer);
		
		for (var index in Resources.images)
			Resources.images[index].load();
		
		for (var index in Resources.sounds)
			Resources.sounds[index].load();
	}
	
	Resources.imageLoaded = function() {
		Resources.imagesLoaded++;
		Resources.check();
	}
	
	Resources.soundLoaded = function() {
		Resources.soundsLoaded++;
		Resources.check();
	}
	
	Resources.check = function() {
		if ((Resources.imagesLoaded == Resources.images.length) && (Resources.soundsLoaded == Resources.sounds.length))
			Resources.finish();
	}