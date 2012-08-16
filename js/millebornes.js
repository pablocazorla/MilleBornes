//METAGAME ********************************************
var stage = 'present'; //present,config,pause,help,result,about,game

//Present Stage
var titlePresent = text({
		text : 'Mille Bornes',
		size : 60,
		align : 'center',
		x : canvas.center.x,
		y : 160,
	}),
	btnPresent = button({
		text : 'Start',
		x : canvas.center.x,
		y : 350
	}),
	present_draw = function(){
		drawPage();
		titlePresent.draw();
		btnPresent.draw();
	};
	
//Config Stage, Help Stage, About Stage, Result Stage,
/* Nada por ahora */

//Pause Stage
var titlePause = text({
		text : 'Pause',
		size : 40,
		align : 'center',
		x : canvas.center.x,
		y : 160,
	}),
	btnPauseHelp = button({
		text : 'Help',
		x : canvas.center.x,
		y : 300
	}),
	btnPauseQuit = button({
		text : 'Quit',
		x : canvas.center.x,
		y : 300
	}),
	btnPauseContinue = button({
		text : 'Continue',
		x : canvas.center.x,
		y : 400
	}),
	pause_draw = function(){
		drawPage();
		titlePause.draw();
		btnPauseHelp.draw();
		btnPauseQuit.draw();
		btnPauseContinue.draw();
	};
	
//Game Stage
var game_stage_class = function(){
	
	var turn,cardDragged,discardedCards,
		deck = new deck_class();
		playerPC = new player_class('pc'),
		playerHuman = new player_class('human'),
		cursor = '',
		
	
		dealCards = function(){
			deck.shuffle();
			var currentPlayer = playerHuman,
				numCard = 13;
			var dealTimer = setInterval(function(){
				var card = deck.getCard();
				currentPlayer.takeCard(card);
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
		},
		changeTurn = function(){
			/*if(turn == 'human'){
				turn = 'pc';
				var waitPC = setTimeout(function(){
					clearTimeout(waitPC);
					//IA
					l('Juega PC')
					changeTurn();
				},2000);
			}else{
				var waitToHuman = setTimeout(function(){
					clearTimeout(waitToHuman);
					turn = 'human';
					l('Juega human')
				},2000);
			};*/
			var card = deck.getCard();
				
			if(turn == 'human'){
				turn = 'pc';
				l('Juega pc')
				playerPC.takeCard(card);
			}else{
				turn = 'human';
				l('Juega human')
				playerHuman.takeCard(card);
			};
		},
	
		rulesEvaluate = function(card){ //Private
			var currentPlayer,enemyPlayer,field,minLim = 335,maxLim = 465;
			if(turn == 'human'){
				currentPlayer = playerHuman;
				enemyPlayer = playerPC;
			}else{
				currentPlayer = playerPC;
				enemyPlayer = playerHuman;
			};
			
			var safeZoneTest = function(player,typ){
				var enabled = true
				for(var i = 0; i<player.safeZoneCards.length; i++){
					if(player.safeZoneCards[i].type == typ){
						enabled = false;
					};
				};
				return enabled;
			};
			
			var rulesPlay = function(field){				
				if(field == 'friend'){	
					if(card.subtype == 'orange'){
						currentPlayer.releaseCard(card);
						currentPlayer.safeZoneCards.push(card);
						card.ax = currentPlayer.safeZoneCardsX;
						card.ay = currentPlayer.safeZoneCardsY;
						card.scale = 0.6;
						currentPlayer.safeZoneCardsY += 68;
						currentPlayer.handOrderCards(card);
						changeTurn();
					}else if(card.subtype == 'num'){
						var total,runLength = currentPlayer.runZoneCards.length;
						if(runLength > 0){
							
							if(currentPlayer.runZoneCards[runLength - 1].type == 'Semaphore'){
								var maxVelZoneLength = currentPlayer.maxVelZoneCards.length,
									velocRight = true;
								if(maxVelZoneLength > 0){														
									if(currentPlayer.maxVelZoneCards[maxVelZoneLength - 1].type == '50 max' && card.type > 50){
										velocRight = false;
									};
								}
								total = currentPlayer.count.av + card.type;
								if(total <= 1000 && velocRight){
									currentPlayer.releaseCard(card);
									card.ax = -200;
									card.ay = -200;
									currentPlayer.count.av = total;
									currentPlayer.handOrderCards(card);
									changeTurn();
								};
								
							};
							
						};
					}else if(card.subtype == 'green'){
						
						if(card.type == 'End max'){
							var maxVelZoneLength = currentPlayer.maxVelZoneCards.length;
							if(maxVelZoneLength > 0){							
								if(currentPlayer.maxVelZoneCards[maxVelZoneLength - 1].type == '50 max'){
									currentPlayer.releaseCard(card);
									currentPlayer.maxVelZoneCards.push(card);
									card.ax = currentPlayer.maxVelZoneCardsX;
									card.ay = currentPlayer.maxVelZoneCardsY;
									if(currentPlayer.maxVelZoneCards.length >= 3){
										currentPlayer.maxVelZoneCards[currentPlayer.maxVelZoneCards.length - 3].visible = false;
									}
									currentPlayer.handOrderCards(card);
									changeTurn();
								}
							}
						}else{
							var enabled = false,
								lastType = 'none',
								lastSubtype = 'none',
								runLength = currentPlayer.runZoneCards.length;
								
							if(runLength > 0){
								lastType = currentPlayer.runZoneCards[runLength - 1].type;
								lastSubtype = currentPlayer.runZoneCards[runLength - 1].subtype;
							};
							if(card.type == 'Semaphore'){
								if(lastSubtype == 'green' || lastType == 'Stop' || lastType == 'none'){
									enabled = true;
								};
							}else if(card.type == 'Fuel' && lastType == 'No fuel'){
									enabled = true;
							}else if(card.type == 'Spare wheel' && lastType == 'Flat tire wheel'){
									enabled = true;
							}else if(card.type == 'Reparation' && lastType == 'Accident'){
									enabled = true;
							};
							if(enabled){
								currentPlayer.releaseCard(card);
								currentPlayer.runZoneCards.push(card);
								card.ax = currentPlayer.runZoneCardsX;
								card.ay = currentPlayer.runZoneCardsY;
								if(currentPlayer.runZoneCards.length >= 3){
									currentPlayer.runZoneCards[currentPlayer.runZoneCards.length - 3].visible = false;
								};
								currentPlayer.handOrderCards(card);
								changeTurn();
							};
						};
					};
				}else{//field = 'enemy'
					if(card.subtype == 'red'){
						var runLength = enemyPlayer.runZoneCards.length;
						if(runLength > 0){
							var enabledCard = false,
								overSemaphore = false;
							if(enemyPlayer.runZoneCards[runLength-1].type == 'Semaphore'){
								overSemaphore = true;
							};
							if(card.type == 'Stop'){
								enabledCard = true;
							}else if(card.type == 'Accident' && safeZoneTest(enemyPlayer,'Ace driver')){
								enabledCard = true;
							}else if(card.type == 'Flat tire wheel' && safeZoneTest(enemyPlayer,'Best wheel')){
								enabledCard = true;
							}else if(card.type == 'No fuel' && safeZoneTest(enemyPlayer,'Fuel tank')){
								enabledCard = true;
							};
							if(enabledCard && overSemaphore){
								currentPlayer.releaseCard(card);
								enemyPlayer.runZoneCards.push(card);
								card.ax = enemyPlayer.runZoneCardsX;
								card.ay = enemyPlayer.runZoneCardsY;
								if(enemyPlayer.runZoneCards.length >= 3){
									enemyPlayer.runZoneCards[enemyPlayer.runZoneCards.length - 3].visible = false;
								};
								currentPlayer.handOrderCards(card);
								changeTurn();
							};
						}
						if(card.type == '50 max' && safeZoneTest(enemyPlayer,'Priority')){
							currentPlayer.releaseCard(card);
							enemyPlayer.maxVelZoneCards.push(card);
							card.ax = enemyPlayer.maxVelZoneCardsX;
							card.ay = enemyPlayer.maxVelZoneCardsY;
							if(enemyPlayer.maxVelZoneCards.length >= 3){
								enemyPlayer.maxVelZoneCards[enemyPlayer.maxVelZoneCards.length - 3].visible = false;
							}
							currentPlayer.handOrderCards(card);
							changeTurn();
						}
					}
				}
			};
			
			//Discard
			if(card.x > minLim && card.x < maxLim){
				currentPlayer.releaseCard(card);
				discardedCards.push(card);
				card.ax = desktop.discardedCards.x
				card.ay = desktop.discardedCards.y
				if(discardedCards.length >= 3){
					discardedCards[discardedCards.length - 3].visible = false;
				}
				currentPlayer.handOrderCards(card);
				changeTurn();
			}
			//Fields
			if(card.x <= minLim){
				field = 'friend';
				if(turn == 'human'){field = 'enemy';}
				rulesPlay(field);
			}else  if(card.x >= maxLim){
				field = 'friend';
				if(turn == 'pc'){field = 'enemy';}
				rulesPlay(field);
			}
		};
	//Drag Card Actions
	this.dragStart = function(ev){
		//if(turn == 'human'){
			var mouseX = ev.clientX-canvas.offsetLeft + get_scroll().x,
				mouseY = ev.clientY-canvas.offsetTop + get_scroll().y;
			for(var i = 0;i < deck.length;i++){
				var card = deck.cards[i]
				if(card.visible){// && card.y > 375){
					if(hit(ev,card.minX,card.maxX,card.minY,card.maxY)){
						card.dragged = true;
						cardDragged.card = card;
						cardDragged.difX = card.x - mouseX;
						cardDragged.difY = card.y - mouseY;
						deck.onTop();
					};
				};
			};
		//};
	};
	this.dragging = function(ev){
		if(cardDragged.card){
			var mouseX = ev.clientX-canvas.offsetLeft + get_scroll().x,
				mouseY = ev.clientY-canvas.offsetTop + get_scroll().y;
			cardDragged.card.x = mouseX + cardDragged.difX;
			cardDragged.card.y = mouseY + cardDragged.difY;
		}
	};
	this.dragEnd = function(){
		if(cardDragged.card){
			cardDragged.card.dragged = false;
			if(false){//cardDragged.card.y > 375){
				playerHuman.handOrderCards(cardDragged.card);
			}else{
				rulesEvaluate(cardDragged.card);
			}
			cardDragged.card = null;
		}
	};
	
	//Init
	this.init = function(){
		stage = 'game';
		turn = 'none';
		cardDragged = {
			card : null,
			difX : 0,
			difY : 0
		};
		discardedCards = [];
		playerPC.reset();
		playerHuman.reset();
		dealCards();
		return this;
	};
	this.move = function(){
		var vel = 0.1;
		for(var i = 0;i < deck.length;i++){
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
		return this;
	};
	this.hover = function(ev){
		cursor = '';
		for(var i = 0;i < deck.length;i++){
			var card = deck.cards[i];
			if(card.y > 375 && hit(ev,card.minX,card.maxX,card.minY,card.maxY) && turn == 'human'){
				cursor = 'pointer';
				break;
			}
		};
		return this;
	};
	this.draw = function(){
		canvas.style.cursor = cursor;
		for(var i = 0;i < deck.length;i++){
			deck.cards[i].draw();
		};
		return this;
	};
},
game_stage = new game_stage_class();

// Draw ********************************************************************************************************
draw = function(){
	//Clear all
	desktop.draw();
	switch(stage){
		case 'present':
			present_draw();
			break;
		case 'pause':
			pause_draw();
			break;
		case 'game':
			game_stage.move().draw();
			break;
		default:
			
	};
};
timer = setInterval(draw,20);

// Events ********************************************************************************************************
on(canvas,'mousedown',function(ev){
	switch(stage){
		case 'present':
			btnPresent.click(ev,function(){
				// stage = 'config';
				game_stage.init();
			});
			break;
		case 'pause':
			btnPauseContinue.click(ev,function(){
				stage = 'game';
			});
			break;
		case 'game':
			game_stage.dragStart(ev);
			break;
		default:
			
	};
});
on(canvas,'mousemove',function(ev){
	switch(stage){
		case 'present':
			btnPresent.hover(ev);
			break;
		case 'game':
			game_stage.hover(ev).dragging(ev);
			break;
		default:
			
	};
});
on(document.body,'mouseup',function(ev){
	switch(stage){
		case 'game':
			game_stage.dragEnd(ev);
			break;
	};
});