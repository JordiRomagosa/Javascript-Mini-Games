
/*	El joc té dos modes: normal i madMode, i s'inicia en mode normal.
	
	En el mode normal, hi ha una única bola i guanya el jugador que marca primer 5 vegades
	
	En el madMode, les pilotes van apareixent (fins un màxim de 10) i van sumant punts quan es colen.
	En aquest mode de joc, guanya el primer jugador que aconsegueixi 15 punts, independenment del número de boles
	que quedin en joc. */


var KEY = {  // codi numèric de les tecles que els jugadors usen per moure la raqueta 
  UP: 38, 
  DOWN: 40, 
  W: 87, 
  S: 83 
}
var pingpong = {      // un objecte global per emmagatzemar totes les variables globals 
   pressedKeys : [],  // un array per recordar si s'està prement la tecla 
   timer: null        // cronòmetre per temporitzar l'animació 
}
const VSTART=3, VINCREMENT=0, XSTART=200/*la meitat del tablero*/, YSTART=100/*la meitat del tablero*/;

/* 	Es crea un objecte per cada pilota, amb dx, dy, x, y i velocitats pròpies. També tenen un boolean que diu si estan actives i una
	id per poder utilitzar correctament els diferents mètodes. */
var ball1 = {
	dx:null, dy:null, x:null, y:null,
	vStart:VSTART, v:VSTART, vIncrement:VINCREMENT,
	active:false, id:"#ball1"
}
var ball2 = {
	dx:null, dy:null, x:null, y:null,
	vStart:VSTART, v:VSTART, vIncrement:VINCREMENT,
	active:false, id:"#ball2"
}
var ball3 = {
	dx:null, dy:null, x:null, y:null,
	vStart:VSTART, v:VSTART, vIncrement:VINCREMENT,
	active:false, id:"#ball3"
}
var ball4 = {
	dx:null, dy:null, x:null, y:null,
	vStart:VSTART, v:VSTART, vIncrement:VINCREMENT,
	active:false, id:"#ball4"
}
var ball5 = {
	dx:null, dy:null, x:null, y:null,
	vStart:VSTART, v:VSTART, vIncrement:VINCREMENT,
	active:false, id:"#ball5"
}
var ball6 = {
	dx:null, dy:null, x:null, y:null,
	vStart:VSTART, v:VSTART, vIncrement:VINCREMENT,
	active:false, id:"#ball6"
}
var ball7 = {
	dx:null, dy:null, x:null, y:null,
	vStart:VSTART, v:VSTART, vIncrement:VINCREMENT,
	active:false, id:"#ball7"
}
var ball8 = {
	dx:null, dy:null, x:null, y:null,
	vStart:VSTART, v:VSTART, vIncrement:VINCREMENT,
	active:false, id:"#ball8"
}
var ball9 = {
	dx:null, dy:null, x:null, y:null,
	vStart:VSTART, v:VSTART, vIncrement:VINCREMENT,
	active:false, id:"#ball9"
}
var ball10 = {
	dx:null, dy:null, x:null, y:null,
	vStart:VSTART, v:VSTART, vIncrement:VINCREMENT,
	active:false, id:"#ball10"
}
var newBallTimer=100, newBallTime=100;	//variables que controlen el temps d'aparició de noves pilotes
var madMode=false, ready=true;		//madMode controla el mode de joc i ready impedeix 
									//que es crein problemes si el joc encara no està llest per canviar de mode

var hBoard, wBoard, hPaddle, wPaddle, hBall, wBall;	//variables per medir i calcular els xocs
var points1=0, points2=0, win=5;		//controlen els punts de cada jugador i qui ha guanyat
const PLAYER1=1, PLAYER2=2;		//per sumar punts al jugador que toca

$(document).ready(function(){
	
	hPaddle = parseInt($("#paddleA").css("height"));	//es calculen les variables de mides per mirar després els xocs
	hBall = parseInt($("#ball1").css("height"));
	hBoard = parseInt($("#playground").css("height"));
	wPaddle = parseInt($("#paddleA").css("width"));
	wBall = parseInt($("#ball1").css("width"));
	wBoard = parseInt($("#playground").css("width"));
	start();
	$(document).keydown(function(e){
    	pingpong.pressedKeys[e.keyCode] = true;
 	});
 	$(document).keyup(function(e){
    	pingpong.pressedKeys[e.keyCode] = false;
  });
});
function gameloopMadMode(){	//el loop del joc amb totes les pilotes activades
	movePaddles();
	addBallTimer();
	moveBall(ball1);
	moveBall(ball2);
	moveBall(ball3);
	moveBall(ball4);
	moveBall(ball5);
	moveBall(ball6);
	moveBall(ball7);
	moveBall(ball8);
	moveBall(ball9);
	moveBall(ball10);
}
function gameloopNormal(){	//el loop del joc normal (una única pilota)
	movePaddles();
	moveBall(ball1);
}
function movePaddles(){		//mètode per moure les pales
	if (pingpong.pressedKeys[KEY.UP]){ // fletxa amunt mou la raqueta B 5 píxels cap amunt 
    var top = parseInt($("#paddleB").css("top")); 
    if ((top-5)<5) {
	}
	else {
		$("#paddleB").css("top",top-5);
	}
  }
if (pingpong.pressedKeys[KEY.DOWN]){ // fletxa abaix mou la raqueta B 5 píxels cap abaix
    var top = parseInt($("#paddleB").css("top"));
    if (top+hPaddle+10>hBoard) {
	}
	else {
		$("#paddleB").css("top",top+5); 
	}
  }
if (pingpong.pressedKeys[KEY.W]){ // fletxa amunt mou la raqueta A 5 píxels cap amunt 
    var top = parseInt($("#paddleA").css("top"));
	if ((top-5)<5) {
	}
    else {
		$("#paddleA").css("top",top-5); 
	}
  }
if (pingpong.pressedKeys[KEY.S]){ // fletxa abaix mou la raqueta B 5 píxels cap abaix 
    var top = parseInt($("#paddleA").css("top"));
    if (top+hPaddle+10>hBoard) {
	}
	else {
		$("#paddleA").css("top",top+5); 
	}
  }
}
function addVelocity(ball){	//incrementa la velocitat de la bola
	with(ball) {
		vIncrement++;
		v=parseInt(vStart+(vIncrement/400));
	}
}
function moveBall(ball){	//mou la bola i la fa rebotar si cal
	with (ball) {
		if (active) {
			addVelocity(ball);
			x=parseInt($(id).css("left"));
			y=parseInt($(id).css("top"));
	
			//el codi de sota controla els xocs de la pilota amb el tauler i dóna punts si un jugador ha guanyat
			if((x+wBall+v*dx)>wBoard) { givePoint(PLAYER1); deleteBall(ball);}
			if((x+v*dx)<0) { givePoint(PLAYER2); deleteBall(ball);}
			if((y+hBall+v*dy)>hBoard)  dy=-dy;
			if((y+v*dy)<0) dy=-dy;
	
			//el codi de sota controla els xocs de la pilota amb les pales
			
			if ((x-wPaddle+v*dx)<parseInt($("#paddleA").css("left"))&&((y+v*dy)<parseInt($("#paddleA").css("top"))+hPaddle)&&((y+hBall+v*dy)>parseInt($("#paddleA").css("top")))&&((x+v*dx)>parseInt($("#paddleA").css("left")))) {
				dx=-dx;
			}
			if ((x+wBall+v*dx)>parseInt($("#paddleB").css("left"))&&((y+v*dy)<parseInt($("#paddleB").css("top"))+hPaddle)&&((y+hBall+v*dy)>parseInt($("#paddleB").css("top")))&&((x+v*dx)<parseInt($("#paddleB").css("left")))) {
				dx=-dx;
			}
	
			$(id).css("left",(x+v*dx)+"px");	//escriu la nova posicio de la pilota
			$(id).css("top",(y+v*dy)+"px");
}
		}
}
function addBallTimer(){	//controla el temps perquè surti una altre pilota
	newBallTimer++;
	if (newBallTimer>=newBallTime) {
		newBallTimer=0;
		newBall();
	}
}
function newBall(){			//controla quina pilota és la següent que toca iniciar i posar en moviment
	if (!ball1.active) {
		initializeBall(ball1);
	}
	else if (!ball2.active) {
		initializeBall(ball2);
	}
	else if (!ball3.active) {
		initializeBall(ball3);
	}
	else if (!ball4.active) {
		initializeBall(ball4);
	}
	else if (!ball5.active) {
		initializeBall(ball5);
	}
	else if (!ball5.active) {
		initializeBall(ball5);
	}
	else if (!ball6.active) {
		initializeBall(ball6);
	}
	else if (!ball7.active) {
		initializeBall(ball7);
	}
	else if (!ball8.active) {
		initializeBall(ball8);
	}
	else if (!ball9.active) {
		initializeBall(ball9);
	}
	else if (!ball10.active) {
		initializeBall(ball10);
	}
}
function initializeBall(ball){	//inicialitza la pilota (l'activa), li dóna dx, dy i velocitat i la coloca en una posició aleatoria al centre del camp
	with (ball) {
		active=true;
		v=vStart;
		vIncrement=VINCREMENT;
		var r=Math.random();
		if (r<0.5) {			//direccio aleatoria
			dx=-(Math.random()+1)/2;
		}
		else {
			dx=(Math.random()+1)/2;
		}
		r=Math.random();
		if (r<0.5) {			//direccio aleatoria
			dy=-(Math.random()+2)/3;
		}
		else {
			dy=(Math.random()+2)/3;
		}
		r=Math.random();
		if (r<0.5) {			//posa la bola aleatoriament dins del camp
			x=XSTART-(Math.random()*49);
		}
		else {
			x=XSTART+(Math.random()*49);
		}
		r=Math.random();
		if (r<0.5) {
			y=YSTART-(Math.random()*49);
		}
		else {
			y=YSTART+(Math.random()*49);
		}
		$(id).css("display","block");	//fa la bola visible i la posa dins del camp
		$(id).css("left",(x)+"px");
		$(id).css("top",(y)+"px");
	}
}
function deleteBall(ball){		//elimina la bola
	with (ball) {
		active=false;
		$(id).css("display","none");
	}
}
function givePoint(player) {	//controla el fet de donar punts i torna a iniciar el joc si s'ha arribat als punts per guanyar.
								//si està en el mode normal també torna a activar la pilota
	if (madMode) {
		if (player==PLAYER1) {		//dona un punt al jugador 1
			points1++;
			$("#scoreA").html(points1);
			if (points1==win) {
				alert("El jugador 1 ha guanyat!");
				resetAll();
				setTimeout(function(){
					start();
				},1000);
				return;
			}
		}
		else {						//dona un punt al jugador 2
			points2++;
			$("#scoreB").html(points2);
			if (points2==win) {
				alert("El jugador 2 ha guanyat!");
				resetAll();
				setTimeout(function(){
					start();
				},1000);
				return;
			}
		}
	}
	else {
		if (player==PLAYER1) {		//dona un punt al jugador 1
			points1++;
			$("#scoreA").html(points1);
			if (points1==win) {
				alert("El jugador 1 ha guanyat!");
				resetAll();
				setTimeout(function(){
					start();
				},1000);
				return;
			}
		}
		else {						//dona un punt al jugador 2
			points2++;
			$("#scoreB").html(points2);
			if (points2==win) {
				alert("El jugador 2 ha guanyat!");
				resetAll();
				setTimeout(function(){
					start();
				},1000);
				return;
			}
		}
		window.clearInterval(pingpong.timer);
		setTimeout(function(){	//atura el joc, reseteja les posicions i el torna a iniciar
			restartBall();
			with (ball1) {
				$(id).css("left",(x)+"px");
				$(id).css("top",(y)+"px");
			}
			start();
		},500);
		return;
	}
}
function start() {			//funció que inicia el joc amb un compte enrere des de 3. Té en compte el mode de joc quan inicia el gameloop
	if (ready) {
		ready=false;
		var count=3;
		newBallTimer=100;
		$("#start").css("display","block");
		$("#start").html(count);
		setTimeout(function(){
			count--;
			$("#start").html(count);
			setTimeout(function(){
				count--;
				$("#start").html(count);
				setTimeout(function(){
					$("#start").css("display","none");
					if (madMode) {
						pingpong.timer = setInterval(gameloopMadMode,1000/60);
						win=15;
						ready=true;
					}
					else {
						pingpong.timer = setInterval(gameloopNormal,1000/60);
						initializeBall(ball1);
						win=5;
						ready=true;
					}
				},1000);
			},1000);
		},1000);
	}
}
function resetAll(){	//reseteja totes les pilotes i marcadors, i atura el gameloop
	window.clearInterval(pingpong.timer);
	points1=0;
	$("#scoreA").html(points1);
	points2=0;
	$("#scoreB").html(points1);
	$(ball1.id).css("display","none");
	$(ball2.id).css("display","none");
	$(ball3.id).css("display","none");
	$(ball4.id).css("display","none");
	$(ball5.id).css("display","none");
	$(ball6.id).css("display","none");
	$(ball7.id).css("display","none");
	$(ball8.id).css("display","none");
	$(ball9.id).css("display","none");
	$(ball10.id).css("display","none");
}
function restartBall() {	//torna a activar la pilota en el mode de joc normal
	initializeBall(ball1);
	$("#ball1").css("display","block");
}
function activarMadMode(){	//quan s'apreta el botó, canvia el mode de joc
	if (ready) {
		if (madMode) {
			resetAll();
			madMode=false;
			$("#madMode").val("Activa MadMode");
			start();
		}
		else {
			resetAll();
			madMode=true;
			$("#madMode").val("Desactiva MadMode");
			start();
		}
	}
}