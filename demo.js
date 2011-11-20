function Demo() {
	var MAX_FLAKES = 100;
	var flakes = [];

	var canvas = document.getElementById('demoCanvas');
	var ctx = canvas.getContext('2d');

    var canvas_height = canvas.height
    var canvas_width = canvas.width;
	
    var copyCanvas = document.getElementById('copyCanvas');
    var copyCtx = copyCanvas.getContext('2d');

	var copyImgd = copyCtx.createImageData(canvas_width, canvas_height);

    function demoStep() {
    	updateFlakes();
    	spawnFlakes();
    	drawFlakes();
    	requestAnimFrame(demoStep, this);
    }

    function updateFlakes() {
		for (var i=0; i < flakes.length; i++) {
		// TTL?
		// if not moving, then attach to background and remove from flake array 
			var flake = flakes[i];
			if (flake.y > canvas_height-10) {
				copyCtx.fillRect(flakes[i].x, Math.floor(flakes[i].y),1,1); 
				//makeWhite(copyImgd, flakes[i].x, Math.floor(flakes[i].y));
				flake.y = 0;
				flake.x = Math.floor(Math.random()*canvas_width);
			}
			flake.y = flake.y + flake.speed;
		}  
    }
    
    
    function spawnFlakes() {
    	if (flakes.length < MAX_FLAKES && Math.random() > 0.8) {
    		var flake = {};
    		flake.y = 0;
    		flake.x = Math.floor(Math.random()*canvas_width);
    		flake.speed = 0.5+(Math.random()*1);
    		flakes.push(flake);
    	}
    }

	function drawFlakes() {
		ctx.clearRect(0, 0, canvas_width, canvas_height);

		ctx.drawImage(copyCanvas, 0, 0);
		for (var i=0; i < flakes.length; i++) {
			ctx.fillRect(flakes[i].x, Math.floor(flakes[i].y),1,1); 
		}
	}

    
    function pixelData(data,x,y) {
	    var pos = 4*(y*canvas_width + x);
    	var r = data.data[pos];
    	return r;
    }
	

    this.startDemo = function() {
    	ctx.fillStyle = "#FAFAFF";  
    	copyCtx.fillStyle = "#FAFAFF";  
		demoStep();
    }
    
}