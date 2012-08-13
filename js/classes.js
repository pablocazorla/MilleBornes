//Debbuger TEMP	
l = function (message) {
	try {
		console.log(message);
	} catch (exception) {
		return;
	};
};
//-------------------------------------------------------------------
//Scope
var canvas,c,text,stage,pre_stage;
//-------------------------------------------------------------
// UTILS
/* Object extend */	
var ext = function(destination, source) {
	for (var property in source) {
		if (source[property] && source[property].constructor && source[property].constructor === Object) {
			destination[property] = destination[property] || {};
			arguments.callee(destination[property], source[property]);
		}else{
			destination[property] = source[property];
		};
	};
	return destination;
},
/* Events */
on = function(elem,eventType, eventHandler) {
	if (elem.addEventListener) {
		elem.addEventListener(eventType, eventHandler,false);
	} else if (elem.attachEvent) {
	eventType = "on" + eventType;
		elem.attachEvent(eventType, eventHandler);
	} else {
		elem["on" + eventType] = eventHandler;
	}
},
/*Scroll*/
get_scroll = function(){
   var x = 0, y = 0;
    if( typeof( window.pageYOffset ) == 'number' ) {
        //Netscape compliant
        y = window.pageYOffset;
        x = window.pageXOffset;
    } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
        //DOM compliant
        y = document.body.scrollTop;
        x = document.body.scrollLeft;
    } else if( document.documentElement && 
    ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
        //IE6 standards compliant mode
        y = document.documentElement.scrollTop;
        x = document.documentElement.scrollLeft;
    }
    var obj = new Object();
    obj.x = x;
    obj.y = y;
    return obj;
};

//---------------------------------------------------------------------
// Canvas and c
canvas = document.getElementById('millebornes');
c = canvas.getContext('2d');

canvas.center = {
	x : canvas.width/2,
	y : canvas.height/2
};
c.textBaseline = 'middle';
//Text
text = function(custom){
	var conf = {
		x : 0,
		y : 0,
		text : 'text',
		font : 'Arial, sans-serif',
		size : 14,
		color : '#000',
		align : 'left'
	};
	conf = ext(conf,custom);
	this.text = conf.text;
	this.draw = function(){
		
		c.fillStyle = conf.color;
		c.font = conf.size + 'px ' + conf.font;
		c.textAlign = conf.align;
		c.fillText (this.text, conf.x, conf.y);
		
	};
};
button = function(custom){
	var conf = {
		x : 0,
		y : 0,
		text : 'text',
		size : 24,
		width : 140,
		height : 36,
		background : '#def'
	};
	conf = ext(conf,custom);
	var xMin = conf.x-conf.width/2,
		xMax = conf.x+conf.width/2,
		yMin = conf.y-conf.height/2,
		yMax = conf.y+conf.height/2,
		background = conf.background;
		
	this.draw = function(){
		c.fillStyle = background;
		c.strokeStyle = '#666';
		c.beginPath();
		c.moveTo(xMin,yMin);
		c.lineTo(xMax,yMin);
		c.lineTo(xMax,yMax);
		c.lineTo(xMin,yMax);
		c.lineTo(xMin,yMin);
		c.fill();
		c.stroke();
		c.closePath();
		c.fillStyle = '#666';
		c.font = conf.size + 'px Arial, sans-serif';
		c.textAlign = 'center';
		c.textBaseline = "middle";
		c.fillText (conf.text, conf.x, conf.y);
	};
	this.click = function(ev,callback){
		var mouseX = ev.clientX-canvas.offsetLeft + get_scroll().x,
			mouseY = ev.clientY-canvas.offsetTop + get_scroll().y;
		if(mouseX > xMin && mouseX < xMax && mouseY > yMin && mouseY < yMax){
			callback();
		};
	};
	this.hover = function(ev){
		var mouseX = ev.clientX-canvas.offsetLeft + get_scroll().x,
			mouseY = ev.clientY-canvas.offsetTop + get_scroll().y;
		if(mouseX > xMin && mouseX < xMax && mouseY > yMin && mouseY < yMax){
			background = '#444';
		}else{
			background = conf.background;
		};
	}
	
};
//Stage ******************************************************************************************
stage = 'pre'; //pre,play,end

desktop = {
	deck : {
		x : canvas.center.x,
		y : 143
	},
	hand : {
		x : canvas.center.x - 250,
		y : 440
	},
	discardedCards : {
		x : canvas.center.x,
		y : 272
	}
};

shadow = function(arg){
	var sd = arg.split(' ');
	c.shadowOffsetX = parseInt(sd[0]);
	c.shadowOffsetY = parseInt(sd[1]);
	c.shadowBlur = parseInt(sd[2]);
	c.shadowColor = sd[3];
};
//Card
class_card = function(type,subtype){this.init(type,subtype);};
class_card.prototype = {
	type : '',
	subtype : '',
	visible : false,
	turned : false,
	dragged : false,
	scale : 1,
	x : desktop.deck.x,
	y : desktop.deck.y,
	ax : desktop.deck.x,
	ay : desktop.deck.y,
	width : 80,
	height : 100,
	midW : 0,
	midH : 0,
	minX : 0,
	maxX : 0,
	minY : 0,
	maxY : 0,
	
	posImage : 0,
	fontSize : 36,
	
	init : function(type,subtype){
		this.type = type;
		this.subtype = subtype;
		this.midW = this.width/2;
		this.midH = this.height/2;
		if(typeof type == 'number' && type >= 100){
			this.fontSize = 30;
		}
		switch(this.type){
			case '50 max':
				this.posImage = 70;
				break;
			case 'Fin max':
				this.posImage = 140;
				break;
			default:
				
		}
	},
	draw : function(){
		if(this.visible && this.y > -40){
			c.save()
			c.fillStyle = '#000';
			c.strokeStyle = '#BBB';
			//shadow('1px 1px 5px rgba(0,0,0,0.7)');
			
			this.minX = this.x-this.midW;
			this.maxX = this.x+this.midW;
			this.minY = this.y-this.midH;
			this.maxY = this.y+this.midH;
			
			c.beginPath();
			c.moveTo(this.minX,this.minY);
			c.lineTo(this.maxX,this.minY);
			c.lineTo(this.maxX,this.maxY);
			c.lineTo(this.minX,this.maxY);
			c.lineTo(this.minX,this.minY);
			c.stroke();
			c.fill();
			if(this.turned){
				c.drawImage(cardsImage,this.posImage,0,70,90,this.x-this.midW+5,this.y-this.midH+5,70,90);
				if(this.subtype == 'num'){
					c.fillStyle = '#FFF';
					c.font = this.fontSize +'px Arial,sans-serif';
					c.textAlign = 'center';
					c.fillText (this.type, this.x, this.y);
				}
				if(this.type == '50 max'){
					c.fillStyle = '#FFF';
					c.font = '34px Arial,sans-serif';
					c.textAlign = 'center';
					c.fillText (50, this.x, this.y-4);
					c.font = '16px Arial,sans-serif';
					c.fillText ('MAX', this.x, this.y+22);
				}
				if(this.type == 'Fin max'){
					c.fillStyle = '#FFF';
					c.font = '22px Arial,sans-serif';
					c.textAlign = 'center';
					c.fillText ('MAX', this.x, this.y);
				}
			}
			c.closePath();
		}
	}
};
card = function(type,subtype){
	return new class_card(type,subtype);
};
//deck
deck_object = function(){this.init();};
deck_object.prototype = {
	cards : [],
	top_card : 0,
	init : function(){
		var v = [
		/*
		[4,200,'num'],
		[12,100,'num'],
		[10,75,'num'],
		[10,50,'num'],
		*/
		[10,25,'num'],
		//[4,'50 max','yellow'],
		
		
		[64,'Fin max','yellow'],
		
		/*
		[3,'Sin combustible','red'],
		[3,'Rueda pinchada','red'],
		[3,'Accidente','red'],
		[5,'Stop','red'],
		[6,'Combustible','green'],
		[6,'Rueda de auxilio','green'],
		[6,'Reparación','green'],
		[14,'Semáforo','green'],
		[1,'Tanque combustible','orange'],
		[1,'Rueda impinchable','orange'],
		[1,'Prioritario','orange'],
		[1,'As del volante','orange']
		
		*/
		];
		for(var i=0;i<v.length;i++){
			for(var j=0;j<v[i][0];j++){
				this.cards.push(card(v[i][1],v[i][2]));
			};
		};
		this.top_card = this.cards.length;
		this.shuffle();
	},
	shuffle : function(){
		for(var j, x, i = this.cards.length; i; j = parseInt(Math.random() * i), x = this.cards[--i], this.cards[i] = this.cards[j], this.cards[j] = x, this.cards[j].visible = false,this.cards[j].turned = false);
	},
	getCard : function(){
		this.top_card--;
		var crd = this.cards[this.top_card];
		crd.visible = true;
		return crd;
	},
	onTop : function(){
		for(var i=0;i<this.cards.length;i++){
			var card = this.cards[i];
			if(card.dragged){
				
				this.cards.splice(i,1);
				this.cards.push(card);
			}
		}
	}
	
};

//Player
player_object = function(humanOrPC){this.init(humanOrPC);}

player_object.prototype = {
	humanOrPC : '',//human or pc
	
	init : function(humanOrPC){
		this.clear();
		this.humanOrPC = humanOrPC;
		if(humanOrPC == 'pc'){
			this.handZoneCardsY = -65;
		}
	},
	clear : function(){
		this.handZoneCards = [];
		this.runZoneCards = [];
		this.maxVelZoneCards = [];
		this.safeZoneCards = [];
	},
	handZoneCards : [],
	handZoneCardsX : desktop.hand.x,
	handZoneCardsY : desktop.hand.y,
	takeCard : function(card){
		this.handZoneCards.push(card);
		card.ay = this.handZoneCardsY;
		this.handOrderCards(card);
		var toTurn = setTimeout(function(){
			card.turned = true;
			clearTimeout(toTurn);
		},1000);
	},
	handOrderCards : function(card){
		var compareX = function(a,b){
			return a.x - b.x;
		},
		widthCard = card.width + 20;
		this.handZoneCards = this.handZoneCards.sort(compareX);
		for(var i = 0;i < this.handZoneCards.length;i++){
			this.handZoneCards[i].ax = canvas.center.x - widthCard * (this.handZoneCards.length - 1)/2 + widthCard * i;
		}
	},
	releaseCard : function(card){
		for(var i = 0;i < this.handZoneCards.length;i++){
			if(this.handZoneCards[i] == card){
				this.handZoneCards.splice(i,1);
			}
		}
		return card;
	},
	runZoneCards : [],
	maxVelZoneCards : [],
	safeZoneCards : []
	
		
	
	
	
}
















	