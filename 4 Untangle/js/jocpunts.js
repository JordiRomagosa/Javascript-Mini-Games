//   NAMESPACE	//
var jocDesenredar = {
	cercles: [],
	cercleClicat: undefined,    
	liniaPrima: 1,
	linies: [],
	ranking: []
};
//				//
var defaultLevels = [
	{	"nivell" : 0,
  		"cercles" :[{"x" : 400, "y" : 156}, 
					{"x" : 381, "y" : 241}, 
					{"x" : 84 , "y" : 233}, 
					{"x" : 88 , "y" : 73 }], 
		"connexions" : {"0" : {"connectaAmb" : [1,2]},  // connexions amb els "següents" cercles 
						"1" : {"connectaAmb" : [3]}, 
						"2" : {"connectaAmb" : [3]}}                                
	},
	{	"nivell" : 1,
  		"cercles" :[{"x" : 500, "y" : 50 }, 
					{"x" : 200, "y" : 300}, 
					{"x" : 200, "y" : 50 }, 
					{"x" : 500, "y" : 300}], 
		"connexions" : {"0" : {"connectaAmb" : [1,2]},  // connexions amb els "següents" cercles 
						"1" : {"connectaAmb" : [3]}, 
						"2" : {"connectaAmb" : [3]}}                                
	},
	{	"nivell" : 2,
  		"cercles" :[{"x" : 256, "y" : 156}, 
					{"x" : 381, "y" : 241}, 
					{"x" : 84 , "y" : 287}, 
					{"x" : 25 , "y" : 73 }], 
		"connexions" : {"0" : {"connectaAmb" : [1,2]},  // connexions amb els "següents" cercles 
						"1" : {"connectaAmb" : [3,2]}, 
						"2" : {"connectaAmb" : [3]}}                                
	},
	{	"nivell" : 3,
  		"cercles" :[{"x" : 652, "y" : 156}, 
					{"x" : 381, "y" : 241}, 
					{"x" : 321, "y" : 233}, 
					{"x" : 120, "y" : 89 }], 
		"connexions" : {"0" : {"connectaAmb" : [1,2,3]},  // connexions amb els "següents" cercles 
						"1" : {"connectaAmb" : [2,3]}, 
						"2" : {"connectaAmb" : [3]}}                                
	},
	{	"nivell" : 4,
  		"cercles" :[{"x" : 456, "y" : 26}, 
					{"x" : 58 , "y" : 257}, 
					{"x" : 549, "y" : 169}, 
					{"x" : 618, "y" : 58 }], 
		"connexions" : {"0" : {"connectaAmb" : [1,2,3]},  // connexions amb els "següents" cercles 
						"1" : {"connectaAmb" : [2,3]}, 
						"2" : {"connectaAmb" : [3]}}                                
	}
];
var actualPoints, level, readyToEnd;	//controlen el joc en general
var autoSave;							//si està en el mode infinit, indica que s'ha de guardar al finalitzar els nivells
var lastingTime, competitiveTimer;		//el contador de temps i el bucle del mode competitiu

$(document).ready(function(){
	jocDesenredar.canvas = document.getElementById("canvas");  // afegim a la variable global jocDesenredar
	jocDesenredar.ctx = jocDesenredar.canvas.getContext("2d");
	
	getStorage();		//carrega el ranking guardat
	initMenus();		//activa els menus perquè surtin en pantalla
	
	// Events per arrossegar els cercles
	$("#canvas").on({
		"mousedown":function(e) {
		  // posició del clic
	   	var ratoli=new Punt(e.pageX-canvas.offsetLeft || 0, e.pageY-canvas.offsetTop  || 0);
	    // mirem si el clic ha estat interior a un cercle	
			for(var i=0;i<jocDesenredar.cercles.length && !jocDesenredar.cercleClicat;i++){
				var cercle = jocDesenredar.cercles[i] ; 
				if(Punt.distanciaPuntPunt(ratoli,cercle.centre) < cercle.radi){
					jocDesenredar.cercleClicat = i;
				}
			}
		readyToEnd = false;
	  },
	  "mousemove":function(e) {
	    if (jocDesenredar.cercleClicat != undefined){
				var ratoli=new Punt(e.pageX-canvas.offsetLeft || 0, e.pageY-canvas.offsetTop  || 0);
				jocDesenredar.cercles[jocDesenredar.cercleClicat].centre.x=ratoli.x;
				jocDesenredar.cercles[jocDesenredar.cercleClicat].centre.y=ratoli.y;
	    }
	  },
	  "mouseup": function(e) {    	
	   	jocDesenredar.cercleClicat = undefined;
		readyToEnd = true;   	
	  }
	});	
	// actualització del fotograma
	jocDesenredar.timer = setInterval(updateScreen, 1000/30);	// 30 fps
});

//Funcions bàsiques per tal que el joc funcioni

	//Funcions que s'executen al canviar de nivell
function initVariables(){	//inicia les variables per començar el joc des del nivell 0
	level = 0;
	readyToEnd = true;
	autoSave = false;
}
function nextLevel(){		//fa el necessari per crear el següent nivell
	level++;
	startNewLevel();
	if (autoSave){
		saveGame();			//si està en mode infinit, guarda l'estat actual
	}
}
function startNewLevel(){	//calcula el nombre de punts que calen i crea els cercles i segments
	numberOfPoints();
	if (actualPoints>4){	//comprova si està en els cinc nivells de prova
		createCircles();
		connectCircles();	
	}
	else {
		uploadDefaultLevel();	//si no està en els cinc de prova, carrega un nivell normal
	}
}
function numberOfPoints(){		//retorna quants punts s'han de crear (si no està en els cinc primers)
	if (level<5) {
		actualPoints = 4;
	}
	else {
		actualPoints = level;
	}
}
function createCircles(){	//crea tants cercles com el nivell actual necessita
	jocDesenredar.cercles = [];
	for (var i=0;i<actualPoints;i++){
		jocDesenredar.cercles.push(new Cercle(new Punt(Utilitats.nombreAleatoriEntre(10,jocDesenredar.canvas.width-10),
		                                               Utilitats.nombreAleatoriEntre(10,jocDesenredar.canvas.height-10)), 10));
	}
}
function connectCircles(){	//connecta els cercles amb segments. Funcionament: connecta els dos primers cercles amb tots els
							//altres i després connecta cada cercle amb el següent, creant un graf pla.
	jocDesenredar.linies = [];6
	for (var i=1;i<jocDesenredar.cercles.length;i++){
		jocDesenredar.linies.push(new Segment(jocDesenredar.cercles[0].centre, jocDesenredar.cercles[i].centre));
	}
	for (var i=2;i<jocDesenredar.cercles.length;i++){
		jocDesenredar.linies.push(new Segment(jocDesenredar.cercles[1].centre, jocDesenredar.cercles[i].centre));
	}
	for (var i=2;i<jocDesenredar.cercles.length-1;i++){
		jocDesenredar.linies.push(new Segment(jocDesenredar.cercles[i].centre, jocDesenredar.cercles[i+1].centre));
	}
}
function uploadDefaultLevel(){	//carrega el nivell "prefabricat" que toca a partir dels que hi ha escrits a la part de dalt
	jocDesenredar.cercles = [];
	jocDesenredar.linies = [];
	for (var i=0;i<4;i++){
		var x = defaultLevels[level].cercles[i].x;
		var y = defaultLevels[level].cercles[i].y;
		jocDesenredar.cercles.push(new Cercle(new Punt(x,y),10));
	}
	var connections = defaultLevels[level].connexions;
	for (var i in connections) {
		var connectedPoints = connections[i].connectaAmb;
		var firstPoint = jocDesenredar.cercles[i].centre;
		for (var j in connectedPoints) {
			var secondPoint = jocDesenredar.cercles[connectedPoints[j]].centre;
			jocDesenredar.linies.push(new Segment(firstPoint,secondPoint));
		}
	}
}

	//Funcions que es fan dins el bucle d'actualitzar la pantalla
function updateScreen(){	//funcio (bucle) que s'executa per actualitzar l'estat de la pantalla del joc
	cuttingSegments();	//mira si hi ha segments que es creuin
	drawAll();			//dibuixa al canvas
	updateState();		//reescriu el nivell i el % completat
}
function cuttingSegments(){	//comprova si hi ha algun segment que es talli amb un altre i en canvia el gruix
	var acabar=true;
	for (var i=0;i<jocDesenredar.linies.length;i++){	//torna els segments a gruix 1
		jocDesenredar.linies[i].setGruix(1);
	}
	for (var i=0;i<jocDesenredar.linies.length-1;i++){	//per cada segment comprova se es talla amb els altres
		for (var c=i+1;c<jocDesenredar.linies.length;c++){
			if (Segment.esTallen(jocDesenredar.linies[i],jocDesenredar.linies[c])){	//si es tallen, canvia el gruix dels dos
				jocDesenredar.linies[i].setGruix(5);
				jocDesenredar.linies[c].setGruix(5);
				acabar = false;
			}
		}
	}
	if (acabar && readyToEnd) {	//si no es talla cap segment (i s'ha deixat anar el ratolí), crida a la funcio que acaba el nivell
		endLevel();
	}
}
function drawAll() {	//dibuixa al canvas els cercles i segments
	var canvas = jocDesenredar.canvas;  
	var ctx = jocDesenredar.ctx; 				
	// esborrem el canvas
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height); 
	// dibuixem totes les línies
	for(var i=0;i<jocDesenredar.linies.length;i++) {
		jocDesenredar.linies[i].dibuixar(ctx);
	}
	// dibuixem tots els cercles
	for(var i=0;i<jocDesenredar.cercles.length;i++) {
		jocDesenredar.cercles[i].dibuixar(ctx);
	}
}
function updateState(){	//canvia el text que surt sota el canvas, amb el nivell i el % completat
	var percent = calculatePercent();
	$("#estat").html("Nivell "+level+", Completat: "+percent+"%");
}
function calculatePercent(){	//calcula el % de segments que no es tallen
	var total = jocDesenredar.linies.length;
	var completed = 0;
	for (var i=0;i<total;i++){
		if (jocDesenredar.linies[i].gruix==1){	//si no es tallen, el gruix es 1
			completed++;
		}
	}
	return Math.round((completed/total)*100);
}
function endLevel(){	//acaba el nivell, anuncia el fi d'aquest i inicia el pròxim nivell automàticament
	alert("Nivell Superat!");
	nextLevel();
}

//Funcions del mode competitiu

function writeRanking(){	//transcriu el contingut del ranking per tal que es pugui llegir des de la pestanya "Ranking"
	$("#ranking1").html(jocDesenredar.ranking[0][0]+" - "+jocDesenredar.ranking[0][1]);
	$("#ranking2").html(jocDesenredar.ranking[1][0]+" - "+jocDesenredar.ranking[1][1]);
	$("#ranking3").html(jocDesenredar.ranking[2][0]+" - "+jocDesenredar.ranking[2][1]);
	$("#ranking4").html(jocDesenredar.ranking[3][0]+" - "+jocDesenredar.ranking[3][1]);
	$("#ranking5").html(jocDesenredar.ranking[4][0]+" - "+jocDesenredar.ranking[4][1]);
}
function initTime(){	//en mode competitiu, prepara el temps i inicia el cronòmetre
	lastingTime = 5*60;
	writeTime();
	competitiveTimer = setInterval(cronometer, 1000);
}
function writeTime(){	//escriu el temps que queda a la pestanya a l'esquerra del joc
	$("#time").html("Queden: "+lastingTime+" segons");
}
function cronometer(){	//funcio (bucle) que va contant cada segon. Quan s'acaba el temps mira si s'ha d'actualitzar el ranking
	lastingTime--;
	writeTime();	//escriu el temps que queda
	if (lastingTime==0){
		clearInterval(competitiveTimer);
		actualizeRanking();		//comprova si s'ha superat algun ranking
		setTimeout(function() {	//torna al menú
			$("#menuPrincipal").show();
			$("#time").hide();
			$("#joc").hide();
		},2000);
	}
}
function actualizeRanking(){	//comprova el nivell al que s'ha arribat i comprova si s'ha d'actualitzar el ranking
	var actualize = false;
	for (var i=0;i<5 && !actualize;i++){	//mira si és un nivell superior als guardats
		if (level>jocDesenredar.ranking[i][0]){
			actualize = true;
			var pos = i;
		}
	}
	if (actualize){		//si és superior, guarda el nou record
		var name = $("#text").val();
		var newRecord = [];
		anounceEndRecord();	//pantalla que anuncia que s'ha aconseguit un record
		newRecord.push(level);
		newRecord.push(name);
		for (var i=3;i>=pos;i--){	//posa el record al lloc que correspon
			jocDesenredar.ranking[i+1] = jocDesenredar.ranking[i];
		}
		jocDesenredar.ranking[pos] = newRecord;
		setRanking();	//guarda el ranking al "local space"
	}
	else {
		anounceEndNoRecord();	//anuncia que no s'ha aconseguit un record
	}
}

function anounceEndNoRecord(){	//fa que surti un missatge que anuncia que no s'ha establert un nou rècord i torna al menú
	$("#avisos").show();
	$("#avisos").html("S'ha acabat el temps! I no has arribat a un nivell prou alt com per assolir un rècord.");
	setTimeout(function() {
		$("#avisos").hide();
	},5000);
}
function anounceEndRecord(){	//fa que surti un missatge que anuncia que s'ha establert un nou rècord i torna al menú
	$("#avisos").show();
	$("#avisos").html("S'ha acabat el temps! Has aconseguit fer un rècord!");
	setTimeout(function() {
		$("#avisos").hide();
	},5000);
}

//Funcions que controlen com es guarda i es carrega des del "local save"

function getStorage(){		//funcio que mira si hi ha ranking i el carrega. Si no n'hi ha inicia el ranking des de zero
	if (!localStorage.getItem('ranking')){
		startRanking();		//inicia el ranking des de zero
	}
	else {
		getRanking();		//carrega el ranking guardat
	}
}
function startRanking(){	//posa a totes les posicions del ranking el nivell zero i nom desconegut
	var ranking = [[0," "],[0," "],[0,""],[0," "],[0," "]];
	localStorage.setItem('ranking', JSON.stringify(ranking));
	getRanking();			//guarda el ranking en les variables per poder-lo tractar després
}
function getRanking(){		//recupera el ranking guardat, i el posa en la variable
	jocDesenredar.ranking = JSON.parse(localStorage.getItem('ranking'));
}
function setRanking(){		//guarda el ranking en local perquè no es borri al tancar el joc
	localStorage.setItem('ranking', JSON.stringify(jocDesenredar.ranking));
}
function saveGame(){		//guarda les posicions actuals dels cercles en local
	localStorage.setItem('cercles', JSON.stringify(jocDesenredar.cercles));
	localStorage.setItem('linies', JSON.stringify(jocDesenredar.linies));
	localStorage.setItem('level',level);
}
function uploadGame(){		//comprova si hi ha una partida guardada, i si no n'hi ha en comença una de nova
	if (!localStorage.getItem('cercles')){
		initVariables();	//inicia les variables i comença una nova partida
		startNewLevel();
	}
	else {		//carrega el que s'ha guardat en local
		jocDesenredar.cercles = JSON.parse(localStorage.getItem('cercles'));
		jocDesenredar.linies = JSON.parse(localStorage.getItem('linies'));
		level = localStorage.getItem('level');
		reconvert();	//torna a convertir tots els objectes a Cercles, Linies i Punts per poder utilitzar els mètodes
	}
}
function reconvert(){	//converteix els objectes obtinguts del guardat local a Cercles, Punts, etc. per poder-los tractar
	var pivot;
	for (var i=0;i<jocDesenredar.cercles.length;i++){	//converteix els cercles (que ara són objectes) en Cercles
		pivot = jocDesenredar.cercles[i];				//una altre vegada
		jocDesenredar.cercles[i] = new Cercle (new Punt(pivot.centre.x,pivot.centre.y),10);
	}
	connectCircles();	//connecta els cercles com en una partida normal
}

//Funcio que controla tots els menús (els clicks a aquests)

function initMenus(){	//funcio que activa tots els "botons" del menú i diu què és el que ha de fer cadascun.
						//També s'encarrega de modificar les variables necessàries per tal que el joc funcioni
						//i crida les funcions necessàries (segons el botó)
	$("#menu").show();
	$("#menuPrincipal").show();
	$("#tornarMenu").click(function() {
		$("#menuPrincipal").show();
		$("#menuJugar").hide();
		$("#menuOpcions").hide();
		$("#rankingMenu").hide();
		$("#tornarMenu").hide();
	});
	$("#jugar").click(function() {
		$("#menuPrincipal").hide();
		$("#menuJugar").show();
		$("#tornarMenu").show();
	});
	$("#veureRanking").click(function() {
		writeRanking();
		$("#menuPrincipal").hide();
		$("#rankingMenu").show();
		$("#tornarMenu").show();
	});
	$("#opcions").click(function() {
		$("#menuPrincipal").hide();
		$("#menuOpcions").show();
		$("#tornarMenu").show();
	});
	$("#tornarAlMenu").click(function() {
		clearInterval(competitiveTimer);
		$("#menuPrincipal").show();
		$("#time").hide();
		$("#joc").hide();
	});
	$("#normal").click(function() {
		$("#menuJugar").hide();
		$("#tornarMenu").hide();
		$("#joc").show();
		$("#saveButton").hide();
		$("#uploadButton").hide();
		initVariables();
		startNewLevel();
	});
	$("#competitiu").click(function() {
		$("#menuJugar").hide();
		$("#tornarMenu").hide();
		$("#joc").show();
		$("#saveButton").hide();
		$("#uploadButton").hide();
		$("#time").show();
		initVariables();
		startNewLevel();
		initTime();
	});
	$("#infinit").click(function() {
		$("#menuJugar").hide();
		$("#tornarMenu").hide();
		$("#joc").show();
		$("#saveButton").show();
		$("#uploadButton").show();
		autoSave = true;
		uploadGame();
	});
	$("#resetPartida").click(function() {
		localStorage.removeItem('cercles');
		localStorage.removeItem('linies');
		localStorage.removeItem('level');
		$("#avisos").show();
		$("#avisos").html("S'ha esborrat la partida guardada.");
		setTimeout(function() {
			$("#avisos").hide();
		},2000);
	});
	$("#resetPuntuacions").click(function() {
		startRanking();
		$("#avisos").show();
		$("#avisos").html("S'ha resetejat el ranquing.");
		setTimeout(function() {
			$("#avisos").hide();
		},2000);
	});
	$("#saveButton").click(function() {
		saveGame();
	});
	$("#uploadButton").click(function() {
		uploadGame();
	});
}