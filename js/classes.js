//Mille Bornes

	var canvas,c,desktop,game,class_desk,desk,class_card,card;
	
	canvas = document.getElementById('millebornes');	
	c = canvas.getContext('2d');
	
	canvas.centerX = canvas.width/2;
	canvas.centerY = canvas.height/2;
	
	desktop = {
		position : {
			desk : {
				x : canvas.width/2,
				y : canvas.height/2,
			},
			hand : {
				x : 0,
				y : 300
			}
		}
	};
	class_card = function(arg){this.init(arg);};
	class_card.prototype = {
		type : '',
		visible : false,
		x : desktop.position.desk.x,
		y : desktop.position.desk.y,
		width : 70,
		height : 100,
		midW : 35,
		midH : 50,
		
		init : function(arg){
			this.type = arg;
		},
		draw : function(){
			c.fillStyle = '#FFF';
			c.strokeStyle = '#AAA';
			c.beginPath();
			c.moveTo(this.x-midW,this.y-midH);
			c.lineTo(this.x+midW,this.y-midH);
			c.lineTo(this.x+midW,this.y+midH);
			c.lineTo(this.x-midW,this.y+midH);
			c.lineTo(this.x-midW,this.y-midH);
			c.fill();
			c.closePath();
		}
	};
	card = function(arg){
		return new class_card(arg);
	};
	class_desk = function(){this.init();};
	class_desk.prototype = {
		cards : [],
		top_card : 0,
		init : function(){
			var v = [[4,200],[12,100],[10,75],[10,50],[10,25]];
			for(var i=0;i<v.length;i++){
				for(var j=0;j<v[i][0];j++){
					this.cards.push(card(v[i][1]));
				};
			};
			this.shuffle();
		},
		shuffle : function(){
			for(var j, x, i = this.cards.length; i; j = parseInt(Math.random() * i), x = this.cards[--i], this.cards[i] = this.cards[j], this.cards[j] = x, this.cards[j].turn = true);
		}
		
	};
	desk = new class_desk();
	
