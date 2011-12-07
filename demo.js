function Demo() {
	var MAX_FLAKES = 500;
	var flakes = [];
	var tops = [];
	var textTops = [];

	var canvas = document.getElementById('demoCanvas');
	var ctx = canvas.getContext('2d');

    var canvas_height = canvas.height
    var canvas_width = canvas.width;
	
    var copyCanvas = document.getElementById('copyCanvas');
    var copyCtx = copyCanvas.getContext('2d');

    function demoStep() {
    	if (flakes.length < MAX_FLAKES) spawnFlakes();
    	drawFlakes();
    	updateFlakes();
    	requestAnimFrame(demoStep);
    }

    function updateFlakes() {
		for (var i=0; i < flakes.length; i++) {
		// if hits the ground or text, then paint to background and reuse 
			var flake = flakes[i];
			var topArray = textTops;
			if (flake.ground) {
				topArray = tops;
			}
			
			if  ((flake.y + flake.speed) > topArray[Math.floor(flake.x)] && (flake.y + flake.speed) < (topArray[Math.floor(flake.x)]+10)) {
				var nudge = checkAngle(Math.floor(flake.x), topArray);			
				if (nudge != 0) {
					flake.x = Math.floor(flake.x) + nudge;
				} 
				topArray[Math.floor(flake.x)] = topArray[Math.floor(flake.x)] - 1;
				copyCtx.fillRect(Math.floor(flake.x), topArray[Math.floor(flake.x)],1,1); 
				initFlake(flake);
			} else if (flake.y > canvas_height) {
				initFlake(flake);
			} else {
				flake.x += Math.sin((flake.ttl/200.0)*(1-flake.speed));
				flake.y = flake.y + flake.speed;
				flake.ttl++;
			}
		}  
    }
    
    function initFlake(flake) {
    	flake.y = 0;
		flake.x = Math.floor(Math.random()*canvas_width);
		flake.ttl = 0;
    }
    
    function spawnFlakes() {
    	if (Math.random() > 0.8) {
    		var flake = {};
    		initFlake(flake);
    		flake.speed = 0.5+(Math.random()*1);
    
    		if (Math.random() > 0.2) {
	    		flake.ground = true;
    		} else {
	    		flake.ground = false;
    		}
    		flakes.push(flake);
    	}
    }

	function drawFlakes() {
		ctx.clearRect(0, 0, canvas_width, canvas_height);
		for (var i=0; i < flakes.length; i++) {
			ctx.fillRect( Math.floor(flakes[i].x), Math.floor(flakes[i].y),1,1); 
		}
	}

    function populateTops() {
    	for (var x=0; x < canvas_width; x++) {
    		tops.push(canvas_height);
	    }
    }


    function populateTextTops() {
		var data = copyCtx.getImageData(0,0,canvas_width, canvas_height);
     
    	for (var x=0; x < canvas_width; x++) {
			var top = 700; // hack to prevent spikes
	    	for (var y=canvas_height; y > 0; y--) {
	    		if (pixelData(data, x, y) > 0) {
	    			top = y;
	    		}
    		}
    		textTops.push(top);
	    }
    }
    
    function checkAngle(x, topArray) {
    	if (x > 0 && x < canvas_width) {
    		var left = topArray[x-1];
    		var right = topArray[x+1];
    		var current = topArray[x];
    		
    		// lower than neighbours or level - lower has greater value 
    		if (current >= left && current >= right) {
    			return 0;
    		// higher than neighbours, neighbours level
    		} else if (left === right) {
    			return  (Math.random() > 0.5) ? 1 : -1;
    		} else if (left > right) {
    			return -1;
    		} else {
    			return 1;
    		}
    	}
    	return 0; 
    }
    
    function pixelData(data,x,y) {
	    var pos = 4*(y*canvas_width + x);
    	var r = data.data[pos];
    	return r;
    }
	

	function getURLParameter(name) {
		//http://stackoverflow.com/questions/831030/how-to-get-get-variables-from-request-in-javascript
	   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
	      return decodeURIComponent(name[1]);
	}

    this.startDemo = function() {
		copyCtx.textAlign = "center";
    	copyCtx.fillStyle = "#CC2222"; 
    	copyCtx.font = '50px serif';
    	
    	var text = getURLParameter("greeting");
    	if (!text) {
    		text = "Merry Christmas!";
    	}
    	
    	copyCtx.fillText(text, 300, 200);  

    	copyCtx.fillStyle = "#FAFAFF"; 
    	ctx.fillStyle = "#FAFAFF";  
	
    	populateTextTops(); 
    	populateTops(); 
		demoStep();
    }
    
}