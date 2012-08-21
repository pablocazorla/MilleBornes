//Debbuger TEMP	***********************************************************************************
l = function (message) {
	try {
		console.log(message);
	} catch (exception) {
		return;
	};
};

//Utils ************************************************************************************************
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
getScroll = function(){
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

//Millebornes 
// Canvas and Context Config *******************************************************************************
var canvas = document.getElementById('millebornes'),
c = canvas.getContext('2d'); //Context
canvas.center = {
	x : canvas.width/2,
	y : canvas.height/2
};
c.textBaseline = 'middle';

//Functions ***************************************************************************************************
//Hit detector for Events
var hit = function(ev,xmin,xmax,ymin,ymax){
	var mouseX = ev.clientX-canvas.offsetLeft + getScroll().x,
		mouseY = ev.clientY-canvas.offsetTop + getScroll().y;
	if(mouseX > xmin && mouseX < xmax && mouseY > ymin && mouseY < ymax){
		return true;
	}else{
		return false;
	};
},
//Draw shadow
shadow = function(arg){
	var sd = arg.split(' ');
	c.shadowOffsetX = parseInt(sd[0]);
	c.shadowOffsetY = parseInt(sd[1]);
	c.shadowBlur = parseInt(sd[2]);
	c.shadowColor = sd[3];
},
//Draw page
drawPage = function(){	
	var margin = 10,
		background = '#EEE',
		border = '#999';
	
	c.fillStyle = background;
	c.strokeStyle = border;
	
	c.beginPath();
	c.moveTo(margin,margin);
	c.lineTo(canvas.width-margin,margin);
	c.lineTo(canvas.width-margin,canvas.height-margin);
	c.lineTo(margin,canvas.height-margin);
	c.lineTo(margin,margin);
	c.fill();
	c.stroke();
	c.closePath();
},
mouseCursor = '';
//Basic Classes ***************************************************************************************************
//Text
var text_class = function(custom){this.init(custom)},
	text = function(custom){return new text_class(custom);};
text_class.prototype ={
	conf : null,
	init : function(custom){
		this.reset();
		this.conf = ext(this.conf,custom);
		return this;
	},
	reset : function(){
		this.conf = {
			x : 0,
			y : 0,
			text : 'text',
			font : 'Arial, sans-serif',
			size : 14,
			color : '#000',
			align : 'left'
		};
	},
	draw : function(custom){
		this.conf = ext(this.conf,custom);
		c.fillStyle = this.conf.color;
		c.font = this.conf.size + 'px ' + this.conf.font;
		c.textAlign = this.conf.align;
		c.fillText (this.conf.text, this.conf.x, this.conf.y);
		return this;
	}
};
//Button
var button_class = function(custom){this.init(custom)},
	button = function(custom){return new button_class(custom);};
button_class.prototype = {
	conf : null,
	xMin : 0,
	xMax : 0,
	yMin : 0,
	yMax : 0,
	background : '',
	init : function(custom){
		this.reset();
		this.conf = ext(this.conf,custom);
		this.xMin = this.conf.x-this.conf.width/2,
		this.xMax = this.conf.x+this.conf.width/2,
		this.yMin = this.conf.y-this.conf.height/2,
		this.yMax = this.conf.y+this.conf.height/2,
		this.background = this.conf.background;
		return this;
	},
	reset : function(){
		this.conf = {
			x : 0,
			y : 0,
			text : 'text',
			size : 24,
			width : 140,
			height : 36,
			background : '#def'
		};
	},
	draw : function(){
		c.fillStyle = this.background;
		c.strokeStyle = '#666';
		c.beginPath();
		c.moveTo(this.xMin,this.yMin);
		c.lineTo(this.xMax,this.yMin);
		c.lineTo(this.xMax,this.yMax);
		c.lineTo(this.xMin,this.yMax);
		c.lineTo(this.xMin,this.yMin);
		c.fill();
		c.stroke();
		c.closePath();
		c.fillStyle = '#666';
		c.font = this.conf.size + 'px Arial, sans-serif';
		c.textAlign = 'center';
		c.textBaseline = "middle";
		c.fillText (this.conf.text, this.conf.x, this.conf.y);
		return this;
	},
	click : function(ev,callback){
		if(hit(ev,this.xMin,this.xMax,this.yMin,this.yMax)){
			canvas.style.cursor = '';
			callback();
		};
		return this;
	},
	hover : function(ev,callback){
		if(hit(ev,this.xMin,this.xMax,this.yMin,this.yMax)){
			this.background = '#444';	
			canvas.style.cursor = 'pointer';
		}else{
			this.background = this.conf.background;
			canvas.style.cursor = '';
		};
		return this;
	}
};
//Image
var img_class = function(src,custom){this.init(src,custom)},
	img = function(src,custom){return new img_class(src,custom);};
img_class.prototype = {	
	conf : {
		img : null,
		x : 0,
		y : 0,
		w : null,
		h : null,
		dx : null,
		dy : null,
		dw : null,
		dh : null
	},
	init : function(src,custom){
		this.reset();
		this.conf = ext(this.conf,custom);
		this.conf.img = new Image();
		this.conf.img.src = src;
		return this;
	},
	reset : function(){
		this.conf = {
			img : null,
			x : 0,
			y : 0,
			w : null,
			h : null,
			dx : null,
			dy : null,
			dw : null,
			dh : null
		};
	},
	draw : function(custom){
		this.conf = ext(this.conf,custom);
		if(!this.conf.w){
			c.drawImage(this.conf.img,this.conf.x,this.conf.y);
		}else{
			c.drawImage(this.conf.img,this.conf.x,this.conf.y,this.conf.w,this.conf.h,this.conf.dx,this.conf.dy,this.conf.dw,this.conf.dh);
		};
		return this;
	}
};

// Game Classes ****************************************************************************************
// Desktop
var desktop_class = function(){},
	imageDesktop = img('img/desktop.jpg');
desktop_class.prototype = {
	hole : {
		x : canvas.center.x,
		y : 272
	},
	draw : function(){
		imageDesktop.draw();
	}
};
var	desktop = new desktop_class();
	
//Card
//Config for cards
var imageCards = img('img/cards.png',{
						y : 0,
						w : 70,
						h : 90,
						dw : 70,
						dh : 90
					}),
	class_card = function(type,subtype){this.init(type,subtype);},
	card = function(type,subtype){return new class_card(type,subtype);};
class_card.prototype = {
	type : '',
	subtype : '',
	text : null,
	textb : null,
	visible : false,
	turned : false,
	dragged : false,
	scale : 1,
	x : 0,
	y : 0,
	ax : 0,
	ay : 0,
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
		if(typeof type == 'number'){
			if(type >= 100){
				this.fontSize = 30;
			};
			this.text = text({
				text : this.type,
				size : this.fontSize,
				color : '#FFF',
				align : 'center'
			});
		};
		switch(this.type){
			case '50 max':
				this.posImage = 70;
				this.text = text({
					text : '50',
					size : '34',
					color : '#FFF',
					align : 'center'
				});
				this.textb = text({
					text : 'MAX',
					size : '16',
					color : '#FFF',
					align : 'center'
				});
				break;
			case 'End max':
				this.posImage = 140;
				this.text = text({
					text : 'MAX',
					size : '22',
					color : '#FFF',
					align : 'center'
				});
				break;
			case 'Semaphore':
				this.posImage = 210;
				break;
			case 'Stop':
				this.posImage = 280;
				this.text = text({
					text : 'STOP',
					size : '20',
					color : '#FFF',
					align : 'center'
				});
				break;
			case 'Fuel':
				this.posImage = 350;
				break;
			case 'Spare wheel':
				this.posImage = 420;
				break;
			case 'Reparation':
				this.posImage = 490;
				break;
			case 'Flat tire wheel':
				this.posImage = 560;
				break;
			case 'Accident':
				this.posImage = 630;
				break;
			case 'No fuel':
				this.posImage = 700;
				break;
			case 'Best wheel':
				this.posImage = 770;
				break;
			case 'Priority':
				this.posImage = 840;
				break;
			case 'Ace driver':
				this.posImage = 910;
				break;
			case 'Fuel tank':
				this.posImage = 980;
				break;
		};
		return this;
	},
	draw : function(){
		if(this.visible && this.y > -40){
			
			c.scale(this.scale,this.scale);
			c.fillStyle = '#000';
			if(!this.turned){c.fillStyle = '#333';}
			c.strokeStyle = '#BBB';
			//shadow('1px 1px 5px rgba(0,0,0,0.7)');
			var xs = this.x/this.scale,
				ys = this.y/this.scale;
			
			this.minX = xs-this.midW;
			this.maxX = xs+this.midW;
			this.minY = ys-this.midH;
			this.maxY = ys+this.midH;
			
			c.beginPath();
			c.moveTo(this.minX,this.minY);
			c.lineTo(this.maxX,this.minY);
			c.lineTo(this.maxX,this.maxY);
			c.lineTo(this.minX,this.maxY);
			c.lineTo(this.minX,this.minY);
			c.stroke();
			c.fill();
			c.closePath();
			if(this.turned){
				imageCards.draw({
					x : this.posImage,
					dx : xs-this.midW+5,
					dy : ys-this.midH+5,
				});
				if(this.subtype == 'num'){
					this.text.draw({x:xs,y:ys});
				}
				if(this.type == '50 max'){
					this.text.draw({x:xs,y:ys-4});
					this.textb.draw({x:xs,y:ys+22});
				}
				if(this.type == 'End max'){
					this.text.draw({x:xs,y:ys});
				}
				if(this.type == 'Stop'){
					this.text.draw({x:xs,y:ys});
				}
			}
		}
	}
};

//Deck
var deck_class = function(){this.init();};
deck_class.prototype = {
	cards : [],
	x : canvas.center.x,
	y : 143,
	top_card : 0,
	length : 0,
	init : function(){
		var v = [		
			[4,200,'num'],
			[12,100,'num'],
			[10,75,'num'],
			[10,50,'num'],
			[10,25,'num'],
			
			[6,'End max','green'],
			[4,'50 max','red'],
			
			[14,'Semaphore','green'],
			[5,'Stop','red'],
			
			[6,'Fuel','green'],
			[6,'Spare wheel','green'],
			[6,'Reparation','green'],
			
			[3,'Flat tire wheel','red'],
			[3,'Accident','red'],
			[3,'No fuel','red'],
			
			[1,'Best wheel','orange'],
			[1,'Priority','orange'],
			[100,'Ace driver','orange'],
			[1,'Fuel tank','orange']
		];
		for(var i=0;i<v.length;i++){
			for(var j=0;j<v[i][0];j++){
				this.cards.push(card(v[i][1],v[i][2]));
			};
		};
		this.length = this.cards.length;
		this.shuffle();
		return this;
	},
	shuffle : function(){
		for(
			var j, m, i = this.length; i;
			j = parseInt(Math.random() * i),
			m = this.cards[--i],
			this.cards[i] = this.cards[j],
			this.cards[j] = m,
			this.cards[j].visible = false,
			this.cards[j].turned = false,
			this.cards[j].scale = 1,
			this.cards[j].x = this.x,
			this.cards[j].y = this.y,
			this.cards[j].ax = this.x,
			this.cards[j].ay = this.y
		);
		this.top_card = this.length;
	},
	getCard : function(){
		this.top_card--;
		var card = this.cards[this.top_card];
		card.visible = true;
		return card;
	},
	onTop : function(){
		for(var i=0;i<this.length;i++){
			var card = this.cards[i];
			if(card.dragged){
				this.cards.splice(i,1);
				this.cards.push(card);
			};
		};
	}
};


//Player
var player_class = function(humanOrPC){this.init(humanOrPC);}
player_class.prototype = {
	humanOrPC : '',//human or pc
	hand : {
		cards : [],
		x : 0,
		y : 440
	},
	run : {
		cards : [],
		x : 595,
		y : 143
	},
	maxvel : {
		cards : [],
		x : 595,
		y : 272
	},
	safe : {
		cards : [],
		x : 735,
		y : 114
	},
	
	count : {
		v : 0,
		av : 0,
		x : 20,
		y : 200
	},
	
	init : function(humanOrPC){
		this.reset();
		this.humanOrPC = humanOrPC;
		
		if(humanOrPC == 'pc'){
			l('ES PC')
			this.hand.y = 10;//-65;
			this.run.x = 205;
			this.maxvel.x = 205;
			this.safe.x = 62;
			this.count.y = 40;
		};
		return this;
	},
	reset : function(){
		this.count.v = 0;
		this.count.av = 0;
		this.hand.cards = [];
		this.run.cards = [];
		this.maxvel.cards = [];
		this.safe.cards = [];
	},
	
	takeCard : function(card){
		this.hand.cards.push(card);
		card.ay = this.hand.y;
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
		this.hand.cards = this.hand.cards.sort(compareX);
		for(var i = 0;i < this.hand.cards.length;i++){
			this.hand.cards[i].ax = canvas.center.x - widthCard * (this.hand.cards.length - 1)/2 + widthCard * i;
		};
	},
	releaseCard : function(card){
		for(var i = 0;i < this.hand.cards.length;i++){
			if(this.hand.cards[i] == card){
				this.hand.cards.splice(i,1);
			};
		};
		return card;
	},
	IA_play : function(){
		
	},
	drawCounter : function(){
		
	}
};