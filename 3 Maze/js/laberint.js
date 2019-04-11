var mazes = [

//hi ha 30 laberints en total, 10 de cada mida. Cada array té tres variables, la primera diu on està la imatge del laberint
//i la segona i la tercera diuen on s'ha de colocar el personatge dins del laberint.

	[	["img/laberints/facil1.gif",50,20],			["img/laberints/facil2.gif",512,66],
		["img/laberints/facil3.gif",291,20],		["img/laberints/facil4.gif",19,202],
		["img/laberints/facil5.gif",328,257],		["img/laberints/facil6.gif",20,104],
		["img/laberints/facil7.gif",19,20],			["img/laberints/facil8.gif",53,20],
		["img/laberints/facil9.gif",66,257],		["img/laberints/facil10.gif",512,173]		],
		
	[	["img/laberints/mitja1.gif",19,33],			["img/laberints/mitja2.gif",19,170],
		["img/laberints/mitja3.gif",342,342],		["img/laberints/mitja4.gif",495,20],
		["img/laberints/mitja5.gif",682,288],		["img/laberints/mitja6.gif",446,342],
		["img/laberints/mitja7.gif",158,342],		["img/laberints/mitja8.gif",376,20],
		["img/laberints/mitja9.gif",682,328],		["img/laberints/mitja10.gif",202,19]		],
		
	[	["img/laberints/dificil1.gif",937,513],		["img/laberints/dificil2.gif",733,20],
		["img/laberints/dificil3.gif",104,512],		["img/laberints/dificil4.gif",1022,189],
		["img/laberints/dificil5.gif",685,512],		["img/laberints/dificil6.gif",665,512],
		["img/laberints/dificil7.gif",359,20],		["img/laberints/dificil8.gif",478,20],
		["img/laberints/dificil9.gif",1022,120],	["img/laberints/dificil10.gif",1022,495]	]
];
var KEY = {		//objecte on es guarden els valors de les diferents tecles que es poden utilitzar
  SHIFT: 16,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,  
  DOWN: 40
}
var pressedKeys = [];				//emmagatzema les tecles apretades
var gameTimer, timeCounter, time;	//els dos loops que fan funcionar el joc i el temporitzador, i la variable que diu
									//quant temps queda
var canvas, context;				//variables que permeten manipular el canvas
var dif=0, maze, xpos, ypos;		//diuen quin laberint és el que s'ha d'utilitzar i on està actualment el personatge
var size=0, mode=1;					//permeten guardar el valor de la mida i el mode sense alterar el joc actual
var auto=false, IA=false;			//marquen el funcionament en l'activació de tecles i el moviment del personatge
var firstWall;						//en la IA, serveix per indicar que ja s'ha trobat la primera paret i
									//iniciar el moviment normal
	
$(document).ready(function(){	//quan la pagina es carrega fa visible el menu
	$("#menu").show();
	$("#small").prop('checked', true);		//marca les caselles que han d'estar marcades per no causar problemes
	$("#normal").prop('checked', true);		//amb les mides i modes si es recarrega la pàgina despés d'iniciar el joc
	$("#timeValue").prop('value', 360);		//el mateix però amb el temps
  	
	$(document).keydown(function(e){	//canvia les tecles que estan actives, en funció del mode de joc
		if (!IA){		//si la IA està activada, ignora les tecles
			if (auto){		//si el mode automàtic està activat, només deixa que hi hagi una tecla apretada
				pressedKeys[KEY.LEFT] = false;
				pressedKeys[KEY.RIGHT] = false;
				pressedKeys[KEY.UP] = false;
				pressedKeys[KEY.DOWN] = false;
			}
			pressedKeys[e.keyCode] = true;
		}
		if (e.keyCode==KEY.UP || e.keyCode==KEY.DOWN){	//impedeix que la pantalla es mogui cap amunt o avall
			return false;								//al moure el personatge
		}
 	});	//amb el return false s'impedeix que es mogui la barra de l'explorador al jugar
	
 	$(document).keyup(function(e){	//desactiva les tecles que estan actives, en funció del mode de joc
    	if (!IA){		//si la IA està activada,  no fa res
			if (!auto){		//si el mode automàtic no està activat, desactiva la tecla
				pressedKeys[e.keyCode] = false;
			}
			else if (e.keyCode == KEY.SHIFT) {pressedKeys[KEY.SHIFT] = false;}	//aquestes dues condicions són per evitar que
			else if (e.keyCode == KEY.SPACE) {pressedKeys[KEY.SPACE] = false;}	//es quedin clavades les tecles en el mode auto
		}																		//i s'avanci sempre pixel per pixel
 	});  
});

function start(){	//la funció es crida al apretar el botó "Start"
	setVariables();		//atura els dos bucles (si estaven actius) i retorna totes les tecles
						//a desactivades (per evitar problemes al canviar de mode de joc)
	setGameMode();				//activa un mode de joc o un altre
	canvas=$("#canvas")[0];                 // equivalent a document.getElementById("canvas")
  	context=canvas.getContext("2d");        // agafem el context per poder dibuixar
	maze = randomMaze();		//aquests dos estableixen el laberint que s'ha d'agafar
	dif = size;
	initializePos();			//coloca el personatge dins del laberint
	drawMaze(mazes[dif][maze]);		//dibuixa per primera vegada el laberint
	if (IA) {firstWall = true;}		//si és la IA, posa a true la variable per poder trobar
									//una paret abans de començar a moure's normalment
	initializeTime();		//inicia el valor del temps màxim
	gameTimer = setInterval(gameloop,20);	//posa en marxa el joc
	$("#canvasContainer").show();		//torna visible el canvas per poder veure el laberint
}

//funcions que es criden un únic cop, al iniciar el joc

function setVariables(){	//atura els dos bucles (si estaven actius) i retorna totes les tecles
							//a desactivades (per evitar problemes al canviar de mode de joc)
	clearInterval(timeCounter);
	clearInterval(gameTimer);
	pressedKeys[KEY.LEFT] = false;
	pressedKeys[KEY.RIGHT] = false;
	pressedKeys[KEY.UP] = false;
	pressedKeys[KEY.DOWN] = false;
	pressedKeys[KEY.SHIFT] = false;
	pressedKeys[KEY.SPACE] = false;
}
function setGameMode(){		//canvia les variables que indiquen el mode de joc
	if (mode==1){
		auto = false;
		IA = false;
	}
	else if (mode==2){
		auto = true;
		IA = false;
	}
	else {	//és igual el valor de auto, perquè la IA sempre bloqueja les funcions normals i auto
		IA = true;
	}
}
function randomMaze(){		//seleciona un laberint aleatori entre els 10 de la mida donada
	return parseInt(Math.random()*10);
}
function initializePos(){	//inicia els valors de la posició inicial del personatge
	xpos=mazes[dif][maze][1];
	ypos=mazes[dif][maze][2];
}
function initializeTime(){	//inicia el bucle del temps i posa el contador al temps màxim
	time = $("#timeValue").val();
	timeCounter = setInterval(addSecond,1000);
	$("#temporizer").html("Time to die: "+time+" seconds");
}
function gameloop(){		//el loop del joc, fa que el joc funcioni
	if (!IA) {moveCharacter();}	//fa moure el personatge segons el mode de joc que estigui indicat
	else {iaMove();}
	endPosition();		//mira si el personatge està en la posició final
}

//funcions del bucle del temps
function addSecond(){	//resta un al contador de segons i acaba el joc si està a zero
	time--;
	$("#temporizer").html("Time to die: "+time+" seconds");		//actualitza el marcador
	if (time==0){
		endGame("time");	//crida la funció que acaba el joc per falta de temps
	}
}

//funcions que dibuixen i permeten el moviment del personatge

function drawMaze(maze) {		//dibuixa el laberint i el personatge
  	var mazeImg = new Image();			//crea una imatge per el laberint i una pel personatge
	var character = new Image();     
  	$(mazeImg).on("load", function() {     		// event que es produeix quan s'ha carregat la imatge del fitxer
	  	canvas.width = mazeImg.width;        	// dimensiona el llenç (Canvas) d'acord a la imatge 
	  	canvas.height = mazeImg.height;
	  	context.drawImage(mazeImg, 0,0);     	// "dibuixa" la imatge en el llenç en l aposició (0,0)
		context.drawImage(character, xpos, ypos);	//coloca el personarge a la posició
		context.stroke();                    	// ara és quan es dibuixa al canvas
	});
	$(mazeImg).attr("src",maze[0]);	//mira a la posició 0, que és on hi ha la direcció de la imatge
	$(character).attr("src","img/personatge4.gif");	//carrega el personatge, hi ha 4 personatges diferents, però només es pot
}													//canviar d'imatge des d'aquí

function moveCharacter(){	//mou el personatge segons les tecles apretades
	if (pressedKeys[KEY.LEFT]){
		if (auto && (pressedKeys[KEY.SHIFT] || pressedKeys[KEY.SPACE])){	//en aquesta comprovació i les que són equivalents
			pressedKeys[KEY.LEFT] = false;									//per les altres tecles, es desactiva el moviment
		}																	//si el Shift o l'Space estan apretats (només mou un
																			//pixel per cada vegada que s'activa la tecla)
		if(!isWall("left")){		//aqui i als de sota, primer mira si hi ha paret i avança si no n'hi ha											
			xpos--;
			drawMaze(mazes[dif][maze]);
		}
	}
	if (pressedKeys[KEY.RIGHT]){
    	if (auto && (pressedKeys[KEY.SHIFT] || pressedKeys[KEY.SPACE])){
			pressedKeys[KEY.RIGHT] = false;
		}
		if(!isWall("right")){
			xpos++;
			drawMaze(mazes[dif][maze]);
		}
  	}
	if (pressedKeys[KEY.UP]){
		if (auto && (pressedKeys[KEY.SHIFT] || pressedKeys[KEY.SPACE])){
			pressedKeys[KEY.UP] = false;
		}
		if(!isWall("up")){
			ypos--;
			drawMaze(mazes[dif][maze]);
		}
  	}
	if (pressedKeys[KEY.DOWN]){
    	if (auto && (pressedKeys[KEY.SHIFT] || pressedKeys[KEY.SPACE])){
			pressedKeys[KEY.DOWN] = false;
		}
		if(!isWall("down")){
			ypos++;
			drawMaze(mazes[dif][maze]);
		}
  	}
}

function iaMove(){		//controla el moviment del personatge segons la IA. Més ben explicat a l'informe
	if (firstWall){
		if (ypos<30){
			if (!isWall("right")){
				xpos++;
			}
			else {
				firstWall=false;
				pressedKeys[KEY.UP] = true;
				ypos--;
			}
		}
		else if (xpos<30){
			if (!isWall("up")){
				ypos--;
			}
			else {
				firstWall=false;
				pressedKeys[KEY.LEFT] = true;
				xpos--;
			}
		}
		else if (ypos>canvas.height-30){
			if (!isWall("right")){
				xpos++;
			}
			else {
				firstWall=false;
				pressedKeys[KEY.UP] = true;
				ypos--;
			}
		}
		else {
			if (!isWall("up")){
				ypos--;
			}
			else {
				firstWall=false;
				pressedKeys[KEY.LEFT] = true;
				xpos--;
			}
		}
		drawMaze(mazes[dif][maze]);
	}
	else {
		if (pressedKeys[KEY.LEFT]){
			if (isWall("up")){
				if (!isWall("left")){
					xpos--;
					drawMaze(mazes[dif][maze]);
				}
				else {
					pressedKeys[KEY.LEFT] = false;
					pressedKeys[KEY.DOWN] = true;
					ypos++;
					drawMaze(mazes[dif][maze]);
				}
			}
			else {
				pressedKeys[KEY.LEFT] = false;
				pressedKeys[KEY.UP] = true;
				ypos--;
				drawMaze(mazes[dif][maze]);
			}
			
		}
		else if (pressedKeys[KEY.RIGHT]){
			if (isWall("down")){
				if(!isWall("right")){
					xpos++;
					drawMaze(mazes[dif][maze]);
				}
				else {
					pressedKeys[KEY.RIGHT] = false;
					pressedKeys[KEY.UP] = true;
					ypos--;
					drawMaze(mazes[dif][maze]);
				}
			}
			else {
				pressedKeys[KEY.RIGHT] = false;
				pressedKeys[KEY.DOWN] = true;
				ypos++;
				drawMaze(mazes[dif][maze]);
			}
		}
		else if (pressedKeys[KEY.UP]){
			if (isWall("right")){
				if(!isWall("up")){
					ypos--;
					drawMaze(mazes[dif][maze]);
				}
				else {
					pressedKeys[KEY.UP] = false;
					pressedKeys[KEY.LEFT] = true;
					xpos--;
					drawMaze(mazes[dif][maze]);
				}
			}
			else {
				pressedKeys[KEY.UP] = false;
				pressedKeys[KEY.RIGHT] = true;
				xpos++;
				drawMaze(mazes[dif][maze]);
			}
		}
		else if (pressedKeys[KEY.DOWN]){
			if (isWall("left")){
				if(!isWall("down")){
					ypos++;
					drawMaze(mazes[dif][maze]);
				}
				else {
					pressedKeys[KEY.DOWN] = false;
					pressedKeys[KEY.RIGHT] = true;
					xpos++;
					drawMaze(mazes[dif][maze]);
				}
			}
			else{
				pressedKeys[KEY.DOWN] = false;
				pressedKeys[KEY.LEFT] = true;
				xpos--;
				drawMaze(mazes[dif][maze]);
			}
		}
	}
}
function isWall(coord){		//mira si hi ha paret a la coordenada que se li dóna com a paràmetre
	var black = [0,0,0,255], data;
	if (coord=="left"){
		if (xpos-1<10){return true;}	//mira si està dins del laberint
		for (var i = 0; i<= 10; i++){	//per cada punt, mira si hi ha negre en algun dels pixels de l'esquerra
			data = context.getImageData(xpos-1, ypos+i, 1, 1).data;
			if ((black[0]==data[0] && black[1]==data[1] && black[2]==data[2] && black[3]==data[3])){
				return true;
			}
		}
	}
	if (coord=="right"){
		if (xpos+11>canvas.width-10){return true;}	//mira si està dins del laberint
		for (var i = 0; i<= 10; i++){	//per cada punt, mira si hi ha negre en algun dels pixels de la dreta
			data = context.getImageData(xpos+11, ypos+i, 1, 1).data;
			if ((black[0]==data[0] && black[1]==data[1] && black[2]==data[2] && black[3]==data[3])){
				return true;
			}
		}
	}
	if (coord=="up"){
		if (ypos-1<10){return true;}	//mira si està dins del laberint
		for (var i = 0; i<= 10; i++){	//per cada punt, mira si hi ha negre en algun dels pixels de dalt
			data = context.getImageData(xpos+i, ypos-1, 1, 1).data;
			if ((black[0]==data[0] && black[1]==data[1] && black[2]==data[2] && black[3]==data[3])){
				return true;
			}
		}
	}
	if (coord=="down"){
		if (ypos+11>canvas.height-10){return true;}	//mira si està dins del laberint
		for (var i = 0; i<= 10; i++){	//per cada punt, mira si hi ha negre en algun dels pixels de baix
			data = context.getImageData(xpos+i, ypos+11, 1, 1).data;
			if ((black[0]==data[0] && black[1]==data[1] && black[2]==data[2] && black[3]==data[3])){
				return true;
			}
		}
	}
	return false;
}

//funcions que controlen el final del joc

function endPosition(){		//comprova si el personatge ha arribat al final del laberint
	var red = [231,6,1,255];	//agafa el vermell perquè és el color de la fletxa del final
	var x = xpos+1;
	var y = ypos+1;
	var data = context.getImageData(x, y, 1, 1).data;
	if(red[0]==data[0] && red[1]==data[1] && red[2]==data[2] && red[3]==data[3]){
		endGame("final");		//si ha arribat al final, acaba el joc
	}
}
function endGame(origin){		//acaba el joc, tenint en compte quin és l'origen que el crida
	setVariables();
	if (origin=="final"){		//si és perquè s'ha arribat al final, felicita el jugador
		alert("Enhorabona! Has aconseguit completar el laberint dins del temps màxim!");
	}
	else {						//si és perquè s'ha acabat el temps ho anuncia i diu que el jugador ha perdut
		alert("No has aconseguit sortir a temps del laberint i has mort de set");
	}
}

//funcions que s'activen pel menú
function changeSize(changeSize){
	size = changeSize;
}
function gameMode(change){
	mode = change;
}