function Demo() {
	var MAX_FLAKES = 500;
	var flakes = [];
	var tops = [];

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
		// if hits the ground, then paint to background and reuse 
			var flake = flakes[i];
			if  ((flake.y + flake.speed) > tops[Math.floor(flake.x)]) {
				var nudge = checkAngle(Math.floor(flake.x));			
				if (nudge != 0) {
					flake.x = Math.floor(flake.x) + nudge;
				} 
				tops[Math.floor(flake.x)] = tops[Math.floor(flake.x)] - 1;
				copyCtx.fillRect(Math.floor(flake.x), tops[Math.floor(flake.x)],1,1); 
				flake.y = 0;
				flake.x = Math.floor(Math.random()*canvas_width);
				flake.ttl = 0;
			} else {
				flake.x += Math.sin((flake.ttl/200.0)*(1-flake.speed));
				flake.y = flake.y + flake.speed;
				flake.ttl++;
			}
		}  
    }
    
    
    function spawnFlakes() {
    	if (Math.random() > 0.8) {
    		var flake = {};
    		flake.y = 0;
    		flake.x = Math.floor(Math.random()*canvas_width);
    		flake.speed = 0.5+(Math.random()*1);
    		flake.ttl = 0;
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
		var data = copyCtx.getImageData(0,0,canvas_width, canvas_height);
     
    	for (var x=0; x < canvas_width; x++) {
			var top = canvas_height-10;    		
	    	for (var y=canvas_height; y > 0; y--) {
	    		if (pixelData(data, x, y) > 0) {
	    			top = y;
	    		}
    		}
    		tops.push(top);
	    }
    }
    
    function checkAngle(x) {
    	if (x > 0 && x < canvas_width) {
    		var left = tops[x-1];
    		var right = tops[x+1];
    		var current = tops[x];
    		
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
	

    this.startDemo = function() {
    	ctx.fillStyle = "#FAFAFF";  

    	copyCtx.fillStyle = "#CC2222"; 
    	copyCtx.font = 'bold 50px sans-serif';
    	copyCtx.fillText("Merry xmas!", 100, 200);  
    	copyCtx.fillStyle = "#FAFAFF"; 
	
    	populateTops(); 
		demoStep();
    }
    
}