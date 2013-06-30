	
	/*
		Copyright (c) 2013 Mauricio Togneri
		
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
	
	/**
	 * Manages the game engine.
	 */
	function Megan() {
	}
	
	Megan.time      = 0;
	Megan.width     = 0;
	Megan.height    = 0;
	Megan.screen    = null;
	Megan.keys      = new Array();
	Megan.processes = new Array();
	Megan.lastProcessId = 0;
	
	// initializes the engine
	Megan.init = function(fps, width, height)
	{
		document.onkeydown = function(event)
		{
			Megan.keyPressed(event)
		}
		
		document.onkeyup = function(event)
		{
			Megan.keyReleased(event)
		}
		
		var html = document.getElementsByTagName('html')[0];
		html.style.overflow = 'hidden';
		
		Megan.time = parseInt(1000/fps);
		
		if (width && height)
		{
			Megan.width  = width;
			Megan.height = height;
		}
		else
		{
			Megan.width  = document.body.clientWidth;
			Megan.height = document.body.clientHeight;
		}
		
		Megan.screen = new Screen(Megan.width, Megan.height);
		setInterval(Megan.update, Megan.time);
	}
	
	// returns the screen width
	Megan.getScreenWidth = function()
	{
		return Megan.width;
	}
	
	// returns the screen height
	Megan.getScreenHeight = function()
	{
		return Megan.height;
	}
	
	// binds the function to the object
	Function.prototype.bind = function()
	{
		var that = this;
		var args = new Array();
		
		for (var i = 0; i < arguments.length; i++)
		{
			args.push(arguments[i]);
		}
		
		var object = args.shift();
		
		return function()
		{
			return that.apply(object, args);
		}
	}
	
	// sets the hand cursor
	Megan.setHandCursor = function()
	{
		Megan.screen.setHandCursor();
	}
	
	// sets the default cursor
	Megan.setDefaultCursor = function()
	{
		Megan.screen.setDefaultCursor();
	}
	
	// returns a random number
	Megan.random = function(min, max)
	{
		return parseInt(min) + Math.round(Math.random() * (max - min));
	}
	
	// sets the background color
	Megan.setBackgroundColor = function(color)
	{
		Megan.screen.setBackgroundColor(color);
	}
	
	// sets the background image
	Megan.setBackgroundImage = function(path)
	{
		Megan.screen.setBackgroundImage(path);
	}
	
	// returns the next process id
	Megan.nextProcessId = function()
	{
		return Megan.lastProcessId++;
	}
	
	// updates the game
	Megan.update = function()
	{
		//var start = new Date().getMilliseconds();
		
		var length = Megan.processes.length;
		
		for (var i = 0; i < length; i++)
		{
			var process = Megan.processes[i];
			
			if ((process) && process.isAwake())
			{
				process.update(Megan.time);
			}
		}
		
		Megan.screen.clear();
		
		for (var i = 0; i < length; i++)
		{
			var process = Megan.processes[i];
			
			if (process && (process.isAwake() || process.isFrozen()) && process.isVisible())
			{
				Megan.screen.paint(process.getImage(), process.getX(), process.getY(), process.getImageWidth() * process.getScaleX(), process.getImageHeight() * process.getScaleY(), process.angle);
			}
		}
		
		//console.log(new Date().getMilliseconds() - start);
	}
	
	// adds the process to the game
	Megan.addProcess = function(process)
	{
		Megan.processes.push(process);
	}
	
	// removes the process of the game
	Megan.removeProcess = function(process)
	{
		var length = Megan.processes.length;
		
		for (var i = 0; i < length; i++)
		{
			var current = Megan.processes[i];
			
			if ((current) && (current.id == process.id))
			{
				Megan.processes.splice(i, 1);
				break;
			}
		}
	}
	
	// kills the rest of the processes
	Megan.letMeAlone = function(process)
	{
		var length = Megan.processes.length;
		
		for (var i = 0; i < length; i++)
		{
			var current = Megan.processes[i];
			
			if (current && (current.id != process.id))
			{
				current.finish(true);
			}
		}
		
		Megan.processes = new Array(process);
	}
	
	// returns true if the process exists
	Megan.existsProcess = function(process)
	{
		var exist = false;
		var length = Megan.processes.length;
		
		for (var i = 0; i < length; i++)
		{
			var current = Megan.processes[i];
			
			if (current && (current.id == process.id))
			{
				exist = true;
				break;
			}
		}
		
		return exist;
	}
	
	// sets the key as pressed
	Megan.keyPressed = function(event)
	{
		Megan.keys[event.keyCode] = true;
	}
	
	// sets the key as released
	Megan.keyReleased = function(event)
	{
		Megan.keys[event.keyCode] = false;
	}
	
	// returns true if the key is pressed
	Megan.key = function(code)
	{
		return Megan.keys[code];
	}
	
	// returns true if the key UP is pressed
	Megan.keyUp = function()
	{
		return Megan.key(38);
	}
	
	// returns true if the key DOWN is pressed
	Megan.keyDown = function()
	{
		return Megan.key(40);
	}
	
	// returns true if the key LEFT is pressed
	Megan.keyLeft = function()
	{
		return Megan.key(37);
	}
	
	// returns true if the key RIGHT is pressed
	Megan.keyRight = function()
	{
		return Megan.key(39);
	}
	
	// returns true if the key SPACE is pressed
	Megan.keySpace = function()
	{
		return Megan.key(32);
	}
	
	// returns true if the key ESCAPE is pressed
	Megan.keyEscape = function()
	{
		return Megan.key(27);
	}
	
	// returns true if the key ENTER is pressed
	Megan.keyEnter = function()
	{
		return Megan.key(13);
	}
	
	// plays the sound
	Megan.playSound = function(path, loop)
	{
		return Sound.play(path, loop);
	}
	
	// stops the sound
	Megan.stopSound = function(sound)
	{
		return Sound.stop(sound);
	}
	
	// plays the music
	Megan.playMusic = function(path)
	{
		return Sound.play(path, true);
	}
	
	// returns the process of the given type if it's colliding with it
	Megan.collision = function(process, type)
	{
		var result = null;
		type = type.name;
		var length = Megan.processes.length;
		
		for (var i = 0; i < length; i++)
		{
			var current = Megan.processes[i];
			
			if (current && (current.type == type) && Megan.collisionWith(current, process))
			{
				result = current;
				break;
			}
		}
		
		return result;
	}
	
	// returns true if p1 and p2 are colliding
	Megan.collisionWith = function(p1, p2)
	{
		var result = false;
		
		if ((p1.getId() != p2.getId()) && (p1.isVisible()) && (p2.isVisible()))
		{
			var intersection = Megan.simpleCollision(p1, p2);
			
			if (intersection.intersecting)
			{
				var image1 = p1.getDrawing();
				var image2 = p2.getDrawing();
				
				var intersectionWidth  = intersection.right - intersection.left + 1;
				var intersectionHeight = intersection.bottom - intersection.top + 1;
				
				var p1X = parseInt(p1.getX());
				var p1Y = parseInt(p1.getY());
				
				var p2X = parseInt(p2.getX());
				var p2Y = parseInt(p2.getY());
				
				for (var x = 0; ((x < intersectionWidth) && (!result)); x++)
				{
					for (var y = 0; (y < intersectionHeight) && (!result); y++)
					{
						var realX = x + intersection.left;
						var realY = y + intersection.top;
						
						result = ((image1.getPixel(realX - p1X, realY - p1Y)[3]) > 0) && ((image2.getPixel(realX - p2X, realY - p2Y)[3]) > 0);
					}
				}
			}
		}
		
		return result;
	}
	
	// returns the rectangle intersection between the two processes
	Megan.simpleCollision = function(p1, p2)
	{
		var p1Left   = parseInt(p1.getX());
		var p1Right  = parseInt(p1Left + p1.getImageWidth());
		var p1Top    = parseInt(p1.getY());
		var p1Bottom = parseInt(p1Top + p1.getImageHeight());
		
		var p2Left   = parseInt(p2.getX());
		var p2Right  = parseInt(p2Left + p2.getImageWidth());
		var p2Top    = parseInt(p2.getY());
		var p2Bottom = parseInt(p2Top + p2.getImageHeight());
		
		var cond1 = p1Left > p2Right;
		var cond2 = p1Right < p2Left;
		var cond3 = p1Top > p2Bottom;
		var cond4 = p1Bottom < p2Top;
		
		var intersecting = (!cond1) && (!cond2) && (!cond3) && (!cond4);
		
		var result = new Object();
		result['intersecting'] = intersecting;
		
		if (intersecting)
		{
			result['left']   = Math.max(p1Left, p2Left); 
			result['right']  = Math.min(p1Right, p2Right);
			result['top']    = Math.max(p1Top, p2Top); 
			result['bottom'] = Math.min(p1Bottom, p2Bottom);
		}
		
		return result;
	}
	
	
	// creates a label
	Megan.createText = function(text, x, y, font, size, color, bold, italic, underline, alignment)
	{
		var label = new Text();
		label.create(text, x, y, font, size, color, bold, italic, underline, alignment);
		
		return label;
	}
	
	// removes the label
	Megan.removeText = function(label)
	{
		var body = Megan.getBody();
		body.removeChild(label.getLabel());
	}
	
	// returns the body of the document
	Megan.getBody = function()
	{
		return document.getElementsByTagName('body')[0];
	}
	
	// ============================= PROCESS ============================= \\
		
	/**
	 * Represents a generic process in the game.
	 */
	function Process(update)
	{
		// id
		this.id = Megan.nextProcessId();
		
		// position
		this.x  = 0;
		this.y  = 0;
		this.angle = 0;
		
		// image
		this.image = null;
		this.imageWidth  = 0;
		this.imageHeight = 0;
		this.alpha   = 0;
		this.scaleX  = 1;
		this.scaleY  = 1;
		this.visible = false;
		
		// state
		this.awake    = true;
		this.freeze   = false;
		this.sleeping = false;
		
		// gets the update method of the process
		var getUpdate = function(update)
		{
			if (update)
			{
				return update;
			}
			else
			{
				return (function() {})
			}
		}
		
		this.update = getUpdate(update);
		
		// returns the process id
		this.getId = function()
		{
			return this.id;
		}
		
		// sets the angle of the image
		this.setAngle = function(value)
		{
			this.angle = parseInt(value % 360);
			
			if (value < 0)
			{
				this.angle += 360;
			}
		}
		
		// adds an angle to the image
		this.addAngle = function(value)
		{
			this.setAngle(this.angle + value);
		}
		
		// returns the angle in radians
		this.toRadian = function(angle)
		{
			return (angle * Math.PI) / 180.0;
		}
		
		// applies the cos function
		this.cos = function(angle)
		{
			return Math.cos(this.toRadian(angle));
		}
		
		// applies the sin function
		this.sin = function(angle)
		{
			return Math.sin(this.toRadian(angle));
		}
		
		// advance the image according to the angle
		this.advance = function(value)
		{
			this.x += parseInt(this.cos(this.angle) * value);
			this.y -= parseInt(this.sin(this.angle) * value);
		}
		
		// returns true if the process is visible
		this.isVisible = function()
		{
			return ((this.image != null) && (this.visible));
		}
		
		// returns the angle of the process with another
		this.getAngleWith = function(process)
		{
			return -((Math.atan2(process.y - this.y, process.x - this.x)) * 180.0) / Math.PI;
		}
		
		// returns the distance of the process with another
		this.getDistance = function(process)
		{
			return Math.sqrt(Math.pow(this.x - process.x, 2) + Math.pow(this.y - process.y, 2));
		}
		
		// returns the horizontal distance of the process with another
		this.getDistanceX = function(process)
		{
			return Math.abs(this.x - process.x);
		}
		
		// returns the process if it's colliding with it
		this.getDistanceY = function(process)
		{
			return Math.abs(this.y - process.y);
		}
		
		// returns the process of the given type if it's colliding with it
		this.collision = function(type)
		{			
			return Megan.collision(this, type);
		}
		
		// returns true if it's colliding with the process
		this.collisionWith = function(process)
		{
			return Megan.collisionWith(this, process);
		}
		
		// sets the horizontal scale
		this.setScaleX = function(value)
		{
			this.scaleX = value;
		}
		
		// returns the horizontal scale
		this.getScaleX = function()
		{
			return this.scaleX;
		}
		
		// sets the vertical scale
		this.setScaleY = function(value)
		{
			this.scaleY = value;
		}
		
		// returns the vertical scale
		this.getScaleY = function()
		{
			return this.scaleY;
		}
		
		// sets the horizontal and vertical scale
		this.setScale = function(value)
		{
			this.setScaleX(value);
			this.setScaleY(value);
		}
		
		// returns true if the process exists
		this.existsProcess = function(process)
		{
			Megan.existsProcess(process);
		}
		
		// returns true if exists a process of the given type
		this.existsType = function(type)
		{
			Megan.existsType(type);
		}
		
		// kills the rest of the processes
		this.letMeAlone = function()
		{
			Megan.letMeAlone(this);
		}
		
		// moves the image up
		this.moveUp = function(distance)
		{
			this.y -= distance;
		}
		
		// moves the image down
		this.moveDown = function(distance)
		{
			this.y += distance;
		}
		
		// moves the image to the left
		this.moveLeft = function(distance)
		{
			this.x -= distance;
		}
		
		// moves the image to the right
		this.moveRight = function(distance)
		{
			this.x += distance;
		}
		
		// returns the x value of the process
		this.getX = function()
		{
			return this.x;
		}
		
		// sets the x value of the process
		this.setX = function(value)
		{
			this.x = value;
		}
		
		// returns the y value of the process
		this.getY = function()
		{
			return this.y;
		}
		
		// sets the y value of the process
		this.setY = function(value)
		{
			this.y = value;
		}
		
		// returns the screen width
		this.getScreenWidth = function()
		{
			return Megan.getScreenWidth();
		}
		
		// returns the screen height
		this.getScreenHeight = function()
		{
			return Megan.getScreenHeight();
		}
		
		// sets the image of the process
		this.setImage = function(path)
		{
			if (path)
			{
				this.image   = Resources.getImage(path);
				this.visible = true;
				this.imageWidth  = this.image.image.width;
				this.imageHeight = this.image.image.height;
			}
			else
			{
				this.image = null;
				this.visible = false;
				this.imageWidth  = 0;
				this.imageHeight = 0;
			}
		}
		
		// returns the image of the process
		this.getImage = function()
		{
			return this.image.image;
		}
		
		// returns the drawing of the process
		this.getDrawing = function()
		{
			return this.image;
		}
		
		// returns the width of the image
		this.getImageWidth = function()
		{
			return this.imageWidth;
		}
		
		// returns the height of the image
		this.getImageHeight = function()
		{
			return this.imageHeight;
		}
		
		// returns true if the process has an image
		this.hasImage = function()
		{
			return (this.image != null);
		}
		
		// plays the sound
		this.playSound = function(path, loop)
		{
			return Megan.playSound(path, loop);
		}
		
		// stops the sound
		this.stopSound = function(sound)
		{
			return Megan.stopSound(sound);
		}
		
		// finishes the process
		this.finish = function(keepAlive)
		{
			if (this.onFinish)
			{
				this.onFinish()
			}
			
			this.sleeping = false;
        	this.freeze   = false;
        	this.awake    = false;
			
			if (!keepAlive)
			{
				Megan.removeProcess(this);
			}
		}
		
		// the process doesn't execute the update and doesn't appears on the screen
		this.sleep = function()
		{
			this.visible  = false;
        	this.sleeping = true;
        	this.freeze   = false;
        	this.awake    = false;
		}
		
		// the process executes the update but doesn't appears on the screen
		this.freeze = function()
		{
			this.visible  = true;
        	this.sleeping = false;
			this.freeze   = true;
        	this.awake    = false;
		}
		
		// the process executes the update and appears on the screen
		this.wakeUp = function()
		{
			this.visible  = true;
        	this.sleeping = false;
			this.freeze   = false;
        	this.awake    = true;
		}
		
		// returns true if the process is sleeping
		this.isSleeping = function()
		{
			return this.sleeping;
		}
		
		// returns true if the process is frozen
		this.isFrozen = function()
		{
			return this.freeze;
		}
		
		// returns true if the process is awake
		this.isAwake = function()
		{
			return this.awake;
		}
		
		// adds the process to the game
		Megan.addProcess(this);
	}
	
	// sets the super class of the process
	Process.create = function(process)
	{
		process.type = process.__proto__.constructor.name;
		process.superClass = Process;
		process.superClass(process.update);
		delete process.superClass;
	}
	
	// ============================= SCREEN ============================= \\
	
	/**
	 * Manages the screen on the game.
	 */
	function Screen(width, height)
	{
		this.screen = null;
		this.canvas = null;
		this.background = null;
		
		// initializes the screen
		this.init = function(width, height)
		{
			this.background = document.createElement('img');
			this.background.style.position = 'absolute';
			this.background.width  = width + 2;
			this.background.height = height + 2;
			this.background.style.top  = ((document.body.clientHeight/2) - (height/2)) -1 + 'px';
			this.background.style.left = ((document.body.clientWidth/2)  - (width/2)) -1 + 'px';
			
			this.canvas = document.createElement('canvas');
			this.canvas.style.position = 'absolute';
			this.canvas.width  = width;
			this.canvas.height = height;
			this.canvas.style.top  = ((document.body.clientHeight/2) - (height/2)) + 'px';
			this.canvas.style.left = ((document.body.clientWidth/2)  - (width/2)) + 'px';
			this.screen = this.canvas.getContext('2d');
			
			var body = Megan.getBody();
			body.appendChild(this.background);
			body.appendChild(this.canvas);
			
			var offsetLeft = this.canvas.offsetLeft;
			var offsetTop  = this.canvas.offsetTop;
			
			this.canvas.onmousedown = function(event)
			{
				//TODO: future implementation
				//Megan.onMouseDown(event.clientX - offsetLeft, event.clientY - offsetTop);
			}
			
			this.canvas.onmousemove = function(event)
			{
				//TODO: future implementation
				//Megan.onMouseMove(event.clientX - offsetLeft, event.clientY - offsetTop);
			}
		}
		
		// sets the hand cursor
		this.setHandCursor = function()
		{
			this.canvas.style.cursor = 'pointer';
		}
		
		// sets the default cursor
		this.setDefaultCursor = function()
		{
			this.canvas.style.cursor = 'default';
		}
		
		// draws the image on the screen
		this.paint = function(image, x, y, width, height, angle)
		{
			if (angle)
			{
				this.screen.save();
				this.screen.translate(x + (width/2), y + (height/2));
				this.screen.rotate((-angle) * Math.PI / 180);			
				this.screen.drawImage(image, 0, 0, width, height);
				this.screen.restore();
			}
			else
			{
				this.screen.drawImage(image, x, y, width, height);
			}
		}
		
		// sets the background image
		this.setBackgroundImage = function(path)
		{
			this.background.src = path;
			this.background.style.backgroundColor = '#000000';
		}
		
		// sets the background color
		this.setBackgroundColor = function(color)
		{
			this.background.src = '';
			this.background.style.backgroundColor = color;
		}
		
		// clears the screen
		this.clear = function()
		{
			this.canvas.width = this.canvas.width;
		}
		
		// initializes te screen
		this.init(width, height);
	}
	
	// ============================= RESOURCES ============================= \\
		
	/**
	 * Manages all the resources (images and sounds) on the game.
	 */ 
	function Resources() {
	}
	
	Resources.finish = null;
	Resources.imagesLoaded = 0;
	Resources.images = new Array();
	Resources.soundsLoaded = 0;
	Resources.sounds = new Array();
	
	// returns the image for the given path
	Resources.getImage = function(path)
	{
		var result = null;
		var length = Resources.images.length;
		
		for (var i = 0; i < length; i++)
		{
			var drawing = Resources.images[i];
			
			if (drawing.path == path)
			{
				result = drawing;
				break;
			}
		}
		
		return result;
	}
	
	// returns the sound for the given path
	Resources.getSound = function(path)
	{
		var result = null;
		var length = Resources.sounds.length;
		
		for (var i = 0; i < length; i++)
		{
			var audio = Resources.sounds[i];
			
			if (audio.path == path)
			{
				result = audio.sound;
				break;
			}
		}
		
		return result;
	}
	
	// adds an image to the resources
	Resources.addImages = function(containter)
	{
		for (var attribute in containter)
		{
			if (typeof(containter[attribute]) == 'string')
			{
				Resources.images.push(new Drawing(containter[attribute]));
			}
		}
	}
	
	// adds a sound to the resources
	Resources.addSounds = function(containter)
	{
		for (var attribute in containter)
		{
			if (typeof(containter[attribute]) == 'string')
			{
				Resources.sounds.push(new Sound(containter[attribute]));
			}
		}
	}
	
	// loads all the resources
	Resources.load = function(finish, imageContainer, soundContainer)
	{
		Resources.finish = finish;
		
		if (imageContainer)
		{
			Resources.addImages(imageContainer);
		}
		
		if (soundContainer)
		{
			Resources.addSounds(soundContainer);
		}
		
		var imagesLength = Resources.images.length;
		
		for (var i = 0; i < imagesLength; i++)
		{
			Resources.images[i].load();
		}
		
		var soundsLength = Resources.sounds.length;
		
		for (var i = 0; i < soundsLength; i++)
		{
			Resources.sounds[i].load();
		}
	}
	
	// called when an image is loaded
	Resources.imageLoaded = function()
	{
		Resources.imagesLoaded++;
		Resources.check();
	}
	
	// called when a sound is loaded
	Resources.soundLoaded = function()
	{
		Resources.soundsLoaded++;
		Resources.check();
	}
	
	// checks if all the resources have been loaded
	Resources.check = function()
	{
		if ((Resources.imagesLoaded == Resources.images.length) && (Resources.soundsLoaded == Resources.sounds.length))
		{
			Resources.finish();
		}
	}
	
	// ============================= IMAGES ============================= \\
		
	/**
	 * Represents an image on the game.
	 */
	function Drawing(path)
	{
		this.path  = path;
		this.image = new Image();
		this.canvas = null;
		
		// loads the image
		this.load = function()
		{
			this.image.src = this.path;
			var that = this;
			
			this.image.onload = function()
			{
				Resources.imageLoaded();
				that.createCanvas();
			}
		}
		
		// creates the canvas related to the image
		this.createCanvas = function()
		{
			this.canvas = document.createElement('canvas');
			this.canvas.width  = this.image.width;
			this.canvas.height = this.image.height;
			this.canvas = this.canvas.getContext('2d');
			this.canvas.drawImage(this.image, 0, 0, this.image.width, this.image.height);
		}
		
		// returns the pixel at the given position
		this.getPixel = function(i, j)
		{
			return this.canvas.getImageData(i, j, 1, 1).data;
		}
	}
	
	// ============================= AUDIO ============================= \\
		
	/**
	 * Represents an audio on the game.
	 */
	function Sound(path)
	{
		this.path  = path;
		this.sound = document.createElement('audio');
		this.sound.preload = 'auto';
		
		// loads the sound
		this.load = function()
		{
			this.sound.src = this.path;
			
			this.sound.addEventListener('canplaythrough', function()
			{
				Resources.soundLoaded();
			}, false);
		}
	}
	
	// plays the sound
	Sound.play = function(path, loop)
	{
		var audio = document.createElement('audio');
		audio.src = path;
		
		if (loop)
		{
			audio.loop = loop;
		}
		else
		{
			audio.loop = false;
		}
		
		audio.addEventListener('canplaythrough', function()
		{ 
		   audio.play();
		}, false);
		
		return audio;
	}
	
	// stops the sound
	Sound.stop = function(sound)
	{
		if (sound)
		{
			sound.pause();
			sound.src = '';
		}
	}
	
	// ============================= TEXT ============================= \\
	
	/**
	 * Represents a text on the screen.
	 */
	function Text()
	{
		this.label = null;
		this.node  = null;
		
		// creates the text
		this.create = function(text, x, y, font, size, color, bold, italic, underline, alignment)
		{
			this.label = document.createElement('div');
			var width = Megan.getScreenWidth();
			
			this.label.style.position = 'absolute';
			this.label.style.top  = y + 'px';
			
			if (alignment == 'left')
			{
				this.label.style.left = x + 'px';
			}
			else if (alignment == 'right')
			{
				this.label.style.left = (x - width) + 'px';
				this.label.style.width = width + 'px';
			}
			else if (alignment == 'center')
			{
				this.label.style.left = (x - (width / 2)) + 'px';
				this.label.style.width = width + 'px';
			}
			
			this.node = document.createTextNode(text);
			this.label.appendChild(this.node);
			
			if (font)
			{
				this.label.style.fontFamily = font;
			}
			
			if (size)
			{
				this.label.style.fontSize = size + 'px';
			}
			
			if (color)
			{
				this.label.style.color = '#' + color;
			}
			
			if (bold)
			{
				this.label.style.fontWeight = 'bold';
			}
			
			if (italic)
			{
				this.label.style.fontStyle = 'italic';
			}
			
			if (underline)
			{
				this.label.style.textDecoration = 'underline';
			}
			
			if (alignment)
			{
				this.label.style.textAlign = alignment;
			}
			
			var body = Megan.getBody();
			body.appendChild(this.label);
		}
		
		// returns the label
		this.getLabel = function()
		{
			return this.label;
		}
		
		// sets the text
		this.setText = function(value)
		{
			this.label.removeChild(this.node);
			this.node = document.createTextNode(value);
			this.label.appendChild(this.node);
		}
		
		// set the horizontal position of the text
		this.setX = function(value)
		{
			this.label.style.left = value + 'px';
		}
		
		// sets the vertical position of the text
		this.setY = function(value)
		{
			this.label.style.top = value + 'px';
		}
		
		// sets the font of the text
		this.setFont = function(value)
		{
			this.label.style.fontFamily = value;
		}
		
		// sets the size of the text
		this.setSize = function(value)
		{
			this.label.style.fontSize = value + 'px';
		}
		
		// set the color of the text
		this.setColor = function(value)
		{
			this.label.style.color = '#' + value;
		}
		
		// set the text to bold
		this.setBold = function(value)
		{
			if (value)
			{
				this.label.style.fontWeight = 'bold';
			}
			else
			{
				this.label.style.fontWeight = 'normal';
			}
		}
		
		// set the text to italic
		this.setItalic = function(value)
		{
			if (value)
			{
				this.label.style.fontStyle = 'italic';
			}
			else
			{
				this.label.style.fontStyle = 'normal';
			}
		}
		
		// set the text underline
		this.setUnderline = function(value)
		{
			if (value)
			{
				this.label.style.textDecoration = 'underline';
			}
			else
			{
				this.label.style.textDecoration = 'none';
			}
		}
		
		// set the alignment of the text
		this.setAlignment = function(value)
		{
			this.label.style.textAlign = value;
		}
	}