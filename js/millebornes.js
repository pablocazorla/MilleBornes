stage = 'pre'; //pre,play,end

drawPre = function(){
	var margin = 10;
	c.fillStyle = '#EEE';
	c.strokeStyle = '#999';
	
	c.beginPath();
	c.moveTo(margin,margin);
	c.lineTo(canvas.width-margin,margin);
	c.lineTo(canvas.width-margin,canvas.height-margin);
	c.lineTo(margin,canvas.height-margin);
	c.lineTo(margin,margin);
	c.fill();
	c.stroke();
	c.closePath();
	c.fillStyle = '#000';
	c.font = '60px Arial';
	c.textAlign ='center';
	c.fillText ('Mille Bornes', canvas.centerX, canvas.centerY);
}





game = function(){}

move = function(){
	
}
draw = function(){
	//Clear all
	c.clearRect(0,0,canvas.width,canvas.height);
	switch(stage){
		case 'pre':
			drawPre();
			break;
		case 'play':
			move();
			break;
		default:
			
	};
};

timer = setInterval(draw,20);
