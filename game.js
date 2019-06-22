var segments = [],food,counter=0,hdir=1,vdir=0,canPress=true,multiplier=10,w=20,h=20

var g=ga(w*multiplier,h*multiplier,setup)
g.start()
g.scaleToWindow()

function clear(){
	for(let i=0;i<segments.length;i++){
		g.gameScene.removeChild(segments[i])
	}
	segments = []
	var segment
	let initI = Math.floor(h/2)
	for(let i=initI;i>=initI-2;i--){
		segment = g.rectangle(1*multiplier,1*multiplier,"black")
		segment.x = i*multiplier
		segment.y = Math.floor(h/2)*multiplier
		segments.push(segment)
		g.gameScene.addChild(segment)		
	}	
	segments[0].clor = "yellow"
}

function setup(){
	g.backgroundColor = "white"
	
	g.gameScene = g.group()	
	clear()
	food = g.rectangle(1*multiplier,1*multiplier,"blue")
	g.gameScene.addChild(food)
	generateFood()
	
	var message = g.text("PRESS SPACE", w+"px Futura","black",20,20)
	message.x=g.canvas.width / 2 - message.width
	message.y=g.canvas.height / 2 - message.height
	g.gameOverScene = g.group(message)
	g.gameOverScene.visible=false
	
	g.state=menu
}

function checkFoodCoords(){
	for(let i=0;i<segments.length;i++){
		if(food.x==segments[i].x&&food.y==segments[i].y) return false
	}
	return true
}

function generateFood(){
	do{
		food.x = Math.floor(Math.random()*w)*multiplier
		food.y = Math.floor(Math.random()*h)*multiplier
	} while(!checkFoodCoords())
}

g.key.upArrow.release = function(){
	if(vdir==0&&canPress){
		vdir=-1
		hdir=0
		canPress=false
	}	
}

g.key.downArrow.release = function(){
	if(vdir==0&&canPress){
		vdir=1
		hdir=0
		canPress=false
	}
}

g.key.leftArrow.release = function(){
	if(hdir==0&&canPress){
		vdir=0
		hdir=-1
		canPress=false
	}
}

g.key.rightArrow.release = function(){
	if(hdir==0&&canPress){
		vdir=0
		hdir=1
		canPress=false
	}
}

g.key.space.release = function(){
	if(g.state==menu){
		clear()
		generateFood()
		g.state=play
	}
}

function play(){
	g.gameScene.visible=true
	g.gameOverScene.visible=false
	counter++;
	let hitFood = false;
	if(counter%45==0){
		if(g.hitTestRectangle(segments[0],food))hitFood = true
		if(hitFood){
			var newbie = g.rectangle(1*multiplier,1*multiplier,"black")
			newbie.x = food.x
			newbie.y = food.y
			segments.unshift(newbie)
			g.gameScene.addChild(newbie)
			generateFood()			
		}
		for(let i=segments.length-1;i>0;i--){
			segments[i].x=segments[i-1].x
			segments[i].y=segments[i-1].y
		}			
		segments[0].x+=hdir*multiplier	
		segments[0].y+=vdir*multiplier	
		canPress=true		
	}			
	if(g.contain(segments[0],g.stage.localBounds)) g.state=menu
	for(let i=1;i<segments.length;i++){
		if(g.hitTestRectangle(segments[0],segments[i]))
			g.state=menu
	}	
}

function menu(){
	g.gameScene.visible=false
	g.gameOverScene.visible=true
}