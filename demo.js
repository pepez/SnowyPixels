function Demo() {
	var MAX_FLAKES = 100;
	var flakes = [];
	var tops = [];

	var canvas = document.getElementById('demoCanvas');
	var ctx = canvas.getContext('2d');

    var canvas_height = canvas.height
    var canvas_width = canvas.width;
	
    var copyCanvas = document.getElementById('copyCanvas');
    var copyCtx = copyCanvas.getContext('2d');

    function demoStep() {
    	updateFlakes();
    	if (flakes.length < MAX_FLAKES) spawnFlakes();
    	drawFlakes();
    	requestAnimFrame(demoStep);
    }

    function updateFlakes() {
    	
		for (var i=0; i < flakes.length; i++) {
		// if not moving, then paint to background and reuse 
			var flake = flakes[i];
			if (flake.y > canvas_height-10 || Math.floor(flake.y) > tops[Math.floor(flake.x)]) {
				tops[Math.floor(flake.x)]--;
				copyCtx.fillRect(Math.floor(flake.x), Math.floor(flake.y),1,1); 
				flake.y = 0;
				flake.x = Math.floor(Math.random()*canvas_width);
				flake.ttl = 0;
			}
			flake.y = flake.y + flake.speed;
			flake.ttl++;
			flake.x += Math.sin((flake.ttl/200.0)*(1-flake.speed));
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
    	for (var i=0; i < canvas_width; i++) {
    		tops.push(119);
	    }
    }
    
    function pixelData(data,x,y) {
	    var pos = (y*canvas_width + x);
    	var r = data[pos];
    	return r;
    }
	

    this.startDemo = function() {
    	ctx.fillStyle = "#FAFAFF";  
    	copyCtx.fillStyle = "#FAFAFF"; 
    	populateTops(); 
		demoStep();
    }
    
}