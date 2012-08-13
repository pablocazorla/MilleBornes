var backdesktop = new Image();
backdesktop.src = 'img/desktop.jpg';
var cardsImage = new Image();
cardsImage.src = 'img/cards.png';

//PRE Stage
pre_stage_Object = function(){
	var title = new text({
		text : 'Mille Bornes',
		size : 60,
		align : 'center',
		x : canvas.center.x,
		y : 160
	});
	this.btnStart = new button({
		text : 'Iniciar',
		x : canvas.center.x,
		y : 350
	});
	
	this.draw = function(){
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
		title.draw();
		this.btnStart.draw();
	}
};
pre_stage = new pre_stage_Object();


//PLAY Stage
deck = new deck_object();
playerPC = new player_object('pc');
playerHuman = new player_object('human');
turn = 'none';
cardDragged = null;
cardDragged_difX = 0;
cardDragged_difY = 0;
	
dealCards = function(){
	deck.shuffle();
	var currentPlayer = playerHuman,
		numCard = 12;
	var dealTimer = setInterval(function(){
		var crd = deck.getCard();
		currentPlayer.takeCard(crd);
		if(currentPlayer == playerPC){
			currentPlayer = playerHuman;
		}else{
			currentPlayer = playerPC;
		}
		numCard--;
		if(numCard<=0){
			clearInterval(dealTimer);
			turn = 'human';
		}
	},500);
};
turnToPC = function(){
	turn = 'PC';
	var waiter = setTimeout(function(){
		clearTimeout(waiter);
		//IA
		l('Juega PC')
		
		
		var postWaiter = setTimeout(function(){
			clearTimeout(postWaiter);
			turn = 'human';
			l('Juega human')
		},2000);
	},2000);
};
discardedCards = [];
discard = function(card){
	discardedCards.push(card);
	card.ax = desktop.discardedCards.x
	card.ay = desktop.discardedCards.y
	if(discardedCards.length >= 3){
		discardedCards[discardedCards.length - 3].visible = false;
	}
	playerHuman.handOrderCards(card);
	turnToPC();
}
	
play_stage_init = function(){
	stage = 'play';
	dealCards();
}
evaluateDragging = function(card){
	var minLim = 335,maxLim = 465;
	if(card.x <= minLim){
		
	}else if(card.x > minLim && card.x < maxLim){
		//Discard
		playerHuman.releaseCard(card);
		discard(card)
	}else if(card.x >= maxLim){
		
	}
};
clickCard = function(ev){
	if(turn == 'human'){
		var mouseX = ev.clientX-canvas.offsetLeft + get_scroll().x,
			mouseY = ev.clientY-canvas.offsetTop + get_scroll().y;
			
		for(var i = 0;i < deck.cards.length;i++){
			var card = deck.cards[i]
			if(card.visible && card.y > 375){
				if(mouseX > card.minX && mouseX < card.maxX && mouseY > card.minY && mouseY < card.maxY){
					card.dragged = true;
					cardDragged = card;
					cardDragged_difX = card.x - mouseX;
					cardDragged_difY = card.y - mouseY;
					deck.onTop();
				};
			};
		};
	};
}
dragCard = function(ev){
	if(cardDragged){
		var mouseX = ev.clientX-canvas.offsetLeft + get_scroll().x,
			mouseY = ev.clientY-canvas.offsetTop + get_scroll().y;
		cardDragged.x = mouseX + cardDragged_difX;
		cardDragged.y = mouseY + cardDragged_difY;
	}
};
releaseCard = function(){
	if(cardDragged){
		cardDragged.dragged = false;
		
		
		if(cardDragged.y > 375){
			playerHuman.handOrderCards(cardDragged);
		}else{
			evaluateDragging(cardDragged);
		}
		cardDragged = null;
	}
};

play_stage_draw = function(){
	for(var i = 0;i < deck.cards.length;i++){
		deck.cards[i].draw();
	}
}

move = function(){
	var vel = 0.1;
	for(var i = 0;i < deck.cards.length;i++){
		if(deck.cards[i].visible && !deck.cards[i].dragged){
			var difx = deck.cards[i].ax - deck.cards[i].x,
				dify = deck.cards[i].ay - deck.cards[i].y;
			if(Math.abs(difx)>1){
				deck.cards[i].x += difx*vel;
			}else{
				deck.cards[i].x = deck.cards[i].ax;
			}
			if(Math.abs(dify)>1){
				deck.cards[i].y += dify*vel;
			}else{
				deck.cards[i].y = deck.cards[i].ay;
			}
		}
	}
}
draw = function(){
	
	//Clear all
	c.drawImage(backdesktop, 0, 0)
	switch(stage){
		case 'pre':
			pre_stage.draw();
			break;
		case 'play':
			move();
			play_stage_draw();
			break;
		default:
			
	};
};

timer = setInterval(draw,20);

// Events
on(canvas,'mousedown',function(ev){
	switch(stage){
		case 'pre':
			pre_stage.btnStart.click(ev,function(){
				play_stage_init();
			});
			break;
		case 'play':
			clickCard(ev);
			break;
		default:
			
	};
});
on(canvas,'mousemove',function(ev){
	switch(stage){
		case 'pre':
			pre_stage.btnStart.hover(ev);
			break;
		case 'play':
			dragCard(ev);
			break;
		default:
			
	};
});
on(document.body,'mouseup',function(ev){
	releaseCard();
});
