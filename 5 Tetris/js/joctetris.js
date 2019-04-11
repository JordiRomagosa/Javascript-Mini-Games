var Tetris = {
	actiu:false,
	taulell:null,
	colorTaulell:"rgba(0,0,0,1)",
	bloc:null,
	bloc1:null,
	bloc2:null,
	blocGuardat:null,
	blocExtra:".",
	punts:0,
	nivell:0,
	nivellMaxim:null,	//nomes es pot canviar des d'aqui. Si es posa a un numero, el joc es bloquejara quan arribi
	liniesNivell:0,		//a aquell nivell i no anira mes rapid
	blocExtra:false,//quan és true, apareix un bloc extra cada 10 blocs, que es 1x1 i serveix per omplir forats
	blocExtraCont:10,
	blocContext:null,
	taulellContext:null
};
var KEY = {
	LEFT:37,	UP:38,		RIGHT:39,	DOWN:40,	SPACE:32,	SHIFT:16
}
var pressedKeys = [], start=true, end=false, sound=true, theme;

$(document).ready(function(){
	$("#joc").hide();
	$("#peces").hide();
	$("#puntuacions").hide();
	drawBackground();
	drawStart();
	theme = document.getElementById("theme");
	$("#fons").on({
		"click":function(e) {
			var x = e.pageX;
			var y = e.pageY;
			if (x>150&&x<350&&y>250&&y<300&&start) {
				startGame();
				start = false;
			}
			if (x>230&&x<270&&y>410&&y<450&&start) {
				Tetris.blocExtra = !Tetris.blocExtra;
				drawBackground();
				drawStart();
			}
			if (x>150&&x<350&&y>500&&y<550&&final) {
				drawBackground();
				drawStart();
				final = false;
				start = true;
			}
			if (Tetris.actiu&&x>50&&x<90&&y>560&&y<600) {
				sound = !sound;
				soundTheme();
				drawBackground();
			}
		}
	});
	$(document).keydown(function(e){
		if (Tetris.actiu){
			if (e.keyCode==KEY.LEFT) leftBlock();
			else if (e.keyCode==KEY.RIGHT) rightBlock();
			else if (e.keyCode==KEY.DOWN) fallBlock();
			else if (e.keyCode==KEY.UP) turnBlock();
			else if (e.keyCode==KEY.SPACE) dropBlock();
			else if (e.keyCode==KEY.SHIFT) storeBlock();
			return false;
		}
	});
	$(document).keyup(function(e){
		pressedKeys[e.keyCode] = false;
	});
});
function startGame(){	//inicia el joc del tetris
	$("#joc").show();
	$("#peces").show();
	$("#puntuacions").show();
	initVariablesGame();
	drawBackground();
	drawBoard();
	drawBlock();
	drawNextBlock();
	drawSaveBlock();
	writeLevel();
}
function initVariablesGame(){	//inicia les variables del joc del tetris
	Tetris.actiu = true;
	Tetris.taulell = new Taulell (Tetris.colorTaulell);
	Tetris.bloc = new Bloc ("",Tetris.taulell);
	Tetris.bloc1 = new Bloc ("",Tetris.taulell);
	Tetris.bloc2 = new Bloc ("",Tetris.taulell);
	Tetris.blocGuardat = null;
	Tetris.punts = 0;
	Tetris.nivell = 1;
	Tetris.liniesNivell = 0;
	Tetris.blocExtraCont = 10;
	Tetris.blocContext = document.getElementById("bloc").getContext("2d");
	Tetris.taulellContext = document.getElementById("taulell").getContext("2d");
	modifyVelocity();
	soundTheme();
}
function rightBlock(){	//mou el bloc cap a la dreta
	Tetris.bloc.Right();
	drawBlock();
}
function leftBlock(){	//mou el bloc cap a l'esquerra
	Tetris.bloc.Left();
	drawBlock();
}
function turnBlock(){	//gira el bloc i el dibuixa
	Tetris.bloc.Turn();
	drawBlock();
}
function fallBlock(){	//baixa un nivell el bloc i el dibuixa
	if (Tetris.bloc.Down()){
		drawBlock();
	}
	else {
		deleteLines();
		newBlock();
		drawBoard();
		drawBlock();
		drawNextBlock();
	}
}
function dropBlock(){	//deixa caure el bloc al fons i el fixa
	while (Tetris.bloc.Down()){}
	deleteLines();
	newBlock();
	drawBoard();
	drawBlock();
	drawNextBlock();
}
function storeBlock(){	//guarda el bloc per poderlo utilitzar despres
	if (Tetris.blocGuardat==null){
		Tetris.blocGuardat = Tetris.bloc;
		newBlock();
	}
	else {
		var pivot = Tetris.blocGuardat;
		Tetris.blocGuardat = Tetris.bloc;
		Tetris.bloc = pivot;
		Tetris.bloc.X = 4;
		Tetris.bloc.Y = 0;
	}
	drawBlock();
	drawSaveBlock();
}
function newBlock(){ //crea un nou bloc
	Tetris.bloc = Tetris.bloc1;
	Tetris.bloc1 = Tetris.bloc2;
	if (Tetris.blocExtra) {
		if (nextExtraBlock()) Tetris.bloc2 = new Bloc (".",Tetris.taulell);
		else Tetris.bloc2 = new Bloc ("",Tetris.taulell);
	}
	else Tetris.bloc2 = new Bloc ("",Tetris.taulell);
	if (!Tetris.bloc.testBloc()){
		endGame();
	}
}
function nextExtraBlock(){	//si esta activat el bloc extra, descompta el temps que triga en sortir el seguent
	Tetris.blocExtraCont--;
	if (Tetris.blocExtraCont==0) {
		Tetris.blocExtraCont=10;
		return true;
	}
	return false;
}
function deleteLines(){	//esborra les linies i utilitza el numero per sumar punts
	var lines = Tetris.taulell.esborraLiniesPlenes();
	sumActualLines(lines);
	sumPoints(lines);
	writeLevel();
	if (changeLevel()) modifyVelocity();
}
function sumActualLines(lines){ //calcula les linies que queden per canviar de nivell
	Tetris.liniesNivell += lines;
}
function sumPoints(lines){ //suma punts segons el numero de linies esborrades
	switch (lines){
		case 1:	Tetris.punts+=Tetris.nivell*1;
				break;
		case 2:	Tetris.punts+=Tetris.nivell*3;
				break;
		case 3:	Tetris.punts+=Tetris.nivell*6;
				break;
		case 4:	Tetris.punts+=Tetris.nivell*10;
				break;
	}
}
function changeLevel(){ //mira si toca canviar de nivell
	if (Tetris.nivellMaxim!=null&&Tetris.nivell>=Tetris.nivellMaxim) return false;
	if (8<=Tetris.liniesNivell) {
		Tetris.liniesNivell-=8;
		Tetris.nivell++;
		return true;
	}
	return false;
}
function modifyVelocity(){ //modifica la velocitat de caiguda del bloc
	var newVelocity = 1060-60*Tetris.nivell;
	clearInterval(Tetris.game);
	Tetris.game = setInterval(function(){fallBlock();},newVelocity);
}
function endGame(){	//acaba el joc i dibuixa la pantalla de final de partida
	clearInterval(Tetris.game);
	Tetris.actiu=false;
	final = true;
	soundTheme();
	drawBackground();
	drawFinal();
	$("#joc").hide();
	$("#peces").hide();
	$("#puntuacions").hide();
}
function drawBlock(){	//dibuixa el bloc
	Tetris.blocContext.clearRect(0,0,250,500);
	Tetris.bloc.paint(Tetris.blocContext);
}
function drawBoard(){	//dibuixa el taulell
	Tetris.taulell.paint(Tetris.taulellContext);
}
function drawSaveBlock(){	//dibuixa el bloc guardat
	var ctx = document.getElementById("guardat").getContext("2d");
	if (Tetris.blocGuardat!=null) {
		drawBlockOutside(Tetris.blocGuardat,ctx);
	}
	else ctx.clearRect(0,0,100,100);
}
function drawNextBlock(){	//dibuixa els seguents blocs
	var ctx = document.getElementById("seguent1").getContext("2d");
	drawBlockOutside(Tetris.bloc1,ctx);
	ctx = document.getElementById("seguent2").getContext("2d");
	drawBlockOutside(Tetris.bloc2,ctx);
}
function drawBlockOutside(block,ctx){	//dibuixa el bloc en el context donat
	ctx.clearRect(0,0,100,100);
	ctx.beginPath();
	var mida = block.forma.length;
	var X = 0;
	var Y = 0;
	if (mida<3){
		X = 1;
		Y = 1;
	}
	for (var i=0;i<mida;i++){
		for (var c=0;c<mida;c++){
			if (block.forma[i][c] == 1){
				ctx.fillStyle=block.color;
				ctx.fillRect(25*(X+c)+2,25*(Y+i)+2,23,23);
			}
		}
	}
	ctx.stroke();
}
function writeLevel(){	//dibuixa el text de final de partida
	var ctx = document.getElementById("puntuacions").getContext("2d");
	ctx.clearRect(0,0,110,280);
	ctx.fillStyle = "rgba (0,0,0,1)";
	ctx.font="bold 20px Arial";
	ctx.fillText("Level",25,50);
	ctx.fillText("Points",20,170);
	ctx.font="20px Arial";
	if (Tetris.nivell<10) ctx.fillText(Tetris.nivell,45,90);
	else ctx.fillText(Tetris.nivell,40,90);
	if (Tetris.punts<10) ctx.fillText(Tetris.punts,45,210);
	else if (Tetris.punts<100) ctx.fillText(Tetris.punts,40,210);
	else if (Tetris.punts<1000) ctx.fillText(Tetris.punts,35,210);
	else ctx.fillText(Tetris.punts,30,210);
}

function drawStart(){	//dibuixa la pantalla d'inici del joc
	var ctx = document.getElementById("fons").getContext("2d");
	ctx.fillStyle = "yellow";
	ctx.fillRect(150,250,200,50);
	ctx.fillRect(230,410,40,40);
	ctx.strokeStyle = "red";
	ctx.lineWidth = "3";
	ctx.strokeRect(150,250,200,50);
	ctx.strokeRect(230,410,40,40);
	ctx.fillStyle = "red";
	ctx.font="Bold 30px Arial";
	ctx.fillText("START",200,285);
	ctx.fillText("Special Block",150,380);
	if (Tetris.blocExtra){
		ctx.strokeStyle = "red";
		ctx.moveTo(235,415);
		ctx.lineTo(265,445);
		ctx.moveTo(265,415);
		ctx.lineTo(235,445);
		ctx.stroke();
	}
}
function drawFinal(){	//dibuixa la pantalla de final del joc
	var ctx = document.getElementById("fons").getContext("2d");
	ctx.fillStyle = "yellow";
	ctx.fillRect(150,500,200,50);
	ctx.strokeStyle = "red";
	ctx.lineWidth = "3";
	ctx.strokeRect(150,500,200,50);
	ctx.fillStyle = "red";
	ctx.font="Bold 30px Arial";
	ctx.fillText("START",200,535);
	ctx.fillText("GAME END",170,210);
	ctx.font="Bold 25px Arial";
	ctx.fillText("YOU REACHED LV "+Tetris.nivell,130,320);
	if (Tetris.punts<100) {
		ctx.fillText("AND GOT "+Tetris.punts+" POINTS",130,400);
	}
	else ctx.fillText("AND GOT "+Tetris.punts+" POINTS",110,400);
}
function drawBackground(){	//dibuixa el fons "base" del joc
	var ctx = document.getElementById("fons").getContext("2d");
	var grd = ctx.createLinearGradient(0,0,0,630);
	grd.addColorStop(0,"black");
	grd.addColorStop(1,"white");
	ctx.fillStyle=grd;
	ctx.fillRect(0,0,490,630);
	var title = new Image();
	$(title).on("load", function() {
		ctx.drawImage(title,35,20);
	});
	$(title).attr("src","img/titol.png");
	if (Tetris.actiu){
		var soundIcon = new Image();
		$(soundIcon).on("load", function() {
			ctx.drawImage(soundIcon,50,560);
			if (!sound) {
				ctx.strokeStyle = "red";
				ctx.moveTo(55,565);
				ctx.lineTo(85,595);
				ctx.moveTo(85,565);
				ctx.lineTo(55,595);
				ctx.stroke();
			}
		});
		$(soundIcon).attr("src","img/so.png");
	}
}
function soundTheme(){	//controla el so del joc
	if (Tetris.actiu&&sound){
		theme.play();
		theme.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		},false);
	}
	else {
		theme.pause();
	}
}