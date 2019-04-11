/*
	Joc Memory.
	
	Hi ha mode de joc per un jugador i per dos jugarors. Dins del mode de dos jugadors, també hi ha un mode extrem.
	Des del menú es pot canvia de mode de joc, seleccionar el número de cartes i la baralla amb que es vol jugar.
*/

var playerNumber=1, cardSet=1, cardNumber, extremeMode=false, extreme=false;	//variables pel mode de joc i del menú
var toggledCards=0, ready=true, attempts=0;		//variables pel mode de joc normal (girar cartes)
const PLAYER1=1, PLAYER2=2;						//constants que diuen el jugador
var points1=0, points2=0, actualTurn;			//variables pel mode de joc de dos jugadors
var cardCount=0;								//variable per controlar el final del joc de dos jugadors extrem


$(document).ready(function(){	//quan el document està a punt, activa el menú i desactiva el tauler de joc
	$("#menu").css("display","block");
	$("#joc").css("display","none");
});


function start(){			//inicia el joc, selecciona el mode de joc i canvia la pantalla al tauler de joc
	setNumberOfCards();
	if (cardNumber%2!=0 || cardNumber<12 || cardNumber>36) {	//dóna error si no és un número de cartes vàl·lid
		alert ("El número de cartes entrat no és correcte");
		return;
	}
	activateCardSet();					//canvia de set de cartes
	setExtremeMode();					//mira si s'ha d'activar el mode extrem
	if (extremeMode) {
		gameModeTwoPlayerExtreme();		//joc extrem dos jugadors
	}
	else if (playerNumber==1) {
		gameModeSinglePlayer();			//joc normal
	}
	else {
		gameModeTwoPlayer();			//joc dos jugadors
	}
	toggleMenu();						//canvia de pantalles
}


//criden les funcions necessaries per tal que el mode de joc funcioni correctament
function gameModeSinglePlayer(){		//inicia el mode de joc per un jugador
	createCards(cardNumber);
	pickCards();
	shuffle();
	activateCards();
	setSingleMode();
}
function gameModeTwoPlayer(){			//inicia el mode de joc per dos jugadors
	createCards(cardNumber);
	pickCards();
	shuffle();
	activateCardsTwoPlayer();
	setTwoMode();
}
function gameModeTwoPlayerExtreme(){	//inicia el mode de joc extrem per dos jugadors
	setTwoPlayerExtreme();
	createCards(cardNumber);
	pickCards();
	shuffle();
	activateCardsExtremeMode();
}


//activen/desactiven els marcadors necessaris per cada mode de joc
function setSingleMode(){			//prepara els marcadors per un jugador
	$("#jugador2").css("display","none");
	$(".puntuacio").css("display","none");
	$("#intents").css("display","block");
}
function setTwoMode(){				//prepara els marcadors per dos jugadors
	$("#jugador2").css("display","block");
	$(".puntuacio").css("display","block");
	$("#intents").css("display","none");
	actualTurn=PLAYER1;
	$("#torn").html("Torn jugador "+actualTurn);
}
function setTwoPlayerExtreme(){		//prepara les variables pel mode extrem i crida la funcio per preparar els marcadors
	cardNumber = 38;
	cardCount=cardNumber;
	setTwoMode();
}


//funcions que creen, barrejen i esborren les cartes, i els dónen les imatges
function createCards(number) {		//crea les cartes i les distribueix pel tauler. També inicia el funcionament del click
	var cardWidth, cardHeight;
	for(var i=1;i<number;i++){			//crea tantes cartes com les indicades al menú
		$(".carta:first-child").clone().appendTo("#cartes");
	}
	if (number%4==0 && number>=20){		//si es múltiple de 4 crea 4 files
		cardHeight=4;
		cardWidth=number/4;
	}
	else if (number%3==0 && number>=9){	//si es múltiple de 3 crea 3 files
		cardHeight=3;
		cardWidth=number/3;
	}
	else if (number<26) {				//de la resta de números els posa en 2 files (si són massa grans no,
		cardHeight=2;					//perquè no cabrien a la pantalla)
		cardWidth=number/2;
	}
	else {								//dels que són massa grans per tenir 2 files en fa 4 files, 
		cardHeight=4;					//però no queden en forma de caixa
		cardWidth=number/4;
	}
	$("#joc").width(cardWidth*100+40);	//es posen les mides del tauler en funcio de la distribució de les cartes
	$("#joc").height(cardHeight*140+40);
	$("#cartes").width(cardWidth*100+40);
	$("#cartes").height(cardHeight*140+40);
	$("#marcadors").width(cardWidth*100+40);
	if (number==26 || number==34 || number==38){	//s'ha de tenir en compte perquè al no quedar en forma de caixa
		$("#joc").width(cardWidth*100+90);			//quedarien fora del tauler
		$("#cartes").width(cardWidth*100+90);
		$("#marcadors").width(cardWidth*100+90);
	}
	$("#cartes").children().each(function(index) {	//les cartes es distribueixen al tauler
		$(this).css({
			"left" : ($(this).width()  + 20) * (index % cardWidth),
			"top"  : ($(this).height() + 20) * Math.floor(index / cardWidth)
		});
				
	});
}
function pickCards(){	//agafa les diferents cartes que es necessiten
	var count1=1, count2=1;
	$("#cartes").children().each(function() {	//a cada carta assigna una imatge segons el contador
		putImage(this,count1);
		if (count2==2) {
			count1++;
			count2=0;
		}
		count2++;		//aquest contador va fent que es carreguin imatges diferents cada dues cartes
	});
}
function putImage(card,number){		//posa a cada carta la imatge segons el número donat
	if (number==1){
		$(card).children(".davant").addClass("carta1");
	}
	else if (number==2) {
		$(card).children(".davant").addClass("carta2");
	}
	else if (number==3) {
		$(card).children(".davant").addClass("carta3");
	}
	else if (number==4) {
		$(card).children(".davant").addClass("carta4");
	}
	else if (number==5) {
		$(card).children(".davant").addClass("carta5");
	}
	else if (number==6) {
		$(card).children(".davant").addClass("carta6");
	}
	else if (number==7) {
		$(card).children(".davant").addClass("carta7");
	}
	else if (number==8) {
		$(card).children(".davant").addClass("carta8");
	}
	else if (number==9) {
		$(card).children(".davant").addClass("carta9");
	}
	else if (number==10) {
		$(card).children(".davant").addClass("carta10");
	}
	else if (number==11) {
		$(card).children(".davant").addClass("carta11");
	}
	else if (number==12) {
		$(card).children(".davant").addClass("carta12");
	}
	else if (number==13) {
		$(card).children(".davant").addClass("carta13");
	}
	else if (number==14) {
		$(card).children(".davant").addClass("carta14");
	}
	else if (number==15) {
		$(card).children(".davant").addClass("carta15");
	}
	else if (number==16) {
		$(card).children(".davant").addClass("carta16");
	}
	else if (number==17) {
		$(card).children(".davant").addClass("carta17");
	}
	else if (number==18) {
		$(card).children(".davant").addClass("carta18");
	}
	else {							//en el mode extrem, carrega les dues cartes extra, les bombes
		$(card).addClass("bomba");
		$(card).children(".davant").addClass("bomba");
	}
}
function shuffle(){					//barreja les cartes aleatoriament
	var newPosition, firstLeft, firstTop, secondLeft, secondTop, count;	//controlen les posicions per intercanviar correctament
	$("#cartes").children().each(function() {
		newPosition=parseInt(Math.random()*(cardNumber-1)+1);	//guarda les posicions de la carta que toca barrejar
		firstLeft = $(this).css("left");
		firstTop = $(this).css("top");
		count = 1;
		$("#cartes").children().each(function() {	//carrega les posicions d'una altre carta (aleatoria) i les intercanvia
			if (count==newPosition) {
				secondLeft = $(this).css("left");
				secondTop = $(this).css("top");
				$(this).css("left",firstLeft);
				$(this).css("top",firstTop);
			}
			count++;
		});
		$(this).css("left",secondLeft);		//carrega la nova posició de cada carta
		$(this).css("top",secondTop);
	});
}
function restore(){		//elimina totes les cartes menys la primera i les torna a activar.
	var count=1;		//També reseteja les variables i els marcadors
	$("#cartes").children().each(function() {
		$(this).removeClass("carta-esborrada");
	});
	$("#cartes").children().each(function() {	//elimina totes les cartes menys la primera
		if (count==1){
			count--;
		}
		else {
			$(this).remove();
		}
	});
	attempts=0;				//reseteja tots els marcadors i variables
	points1=0;
	points2=0;
	$("#intents").html("Intents: "+attempts);
	$("#punts1").html(points1);
	$("#punts2").html(points2);
	extremeMode=false;
}


//funcions que controlen el joc d'un jugador
function activateCards(){		//activa les cartes, de manera que responen als clicks
	$("#cartes").children().each(function(index) {
		// activem el manegador de l'event clic en cada element carta.
		$(this).click(function() {
			// afegim la classe "carta-girada".
			// el navegador animarà la transició dels estils entre l'estat actual i l'estat de carta girada.
			if (ready) {
				if ($(this).hasClass("carta-girada")){
				}
				else {
					$(this).addClass("carta-girada");
					toggledCards++;
				}
				if (toggledCards>=2) {	//cada dues cartes girades bloqueja un temps el joc i comprova si són iguals
					ready=false;
					attempt();
					setTimeout(function(){
						cardPair();
						allPaired();
						$("#cartes").children().each(function(index) {
							$(this).removeClass("carta-girada");
							ready=true;
						});
					},1000);
					toggledCards=0;
				}
			}
		});
	});
}
function attempt(){			//incrementa els intents de parelles i escriu al marcador
	attempts++;
	$("#intents").html("Intents: "+attempts);
}

function cardPair(){		//mira si s'ha girat una parella de cartes iguals i les esborra si ho són
	var card1=0, card2;
	$("#cartes").children().each(function() {		//agafa les dues cartes que estan girades
		if ($(this).hasClass("carta-girada")){
			if (card1==0) {
				card1=this;
			}
			else {
				card2=this;
			}
		}
	});							//comprova si les carets tenen la mateixa classe i les elimina
	if($(card1).children(".davant").attr("class") == $(card2).children(".davant").attr("class")) {
		$(card1).addClass("carta-esborrada");
		$(card2).addClass("carta-esborrada");
	}
}
function allPaired(){		//mira si totes les cartes s'han aparellat, i acaba el joc
	var allPaired=true;
	$("#cartes").children().each(function() {	//mira si encara queda alguna carta
		if (!($(this).hasClass("carta-esborrada"))) {
			allPaired=false;
		}
	});
	if (allPaired) {		//acaba el joc si totes les cartes estan esborrades
		endGame();
	}
}
function endGame(){			//envia el missatge del final del joc, restableix el joc i torna al menú
	alert("Has necessitat "+attempts+" intents per acabar el joc");
	restore();
	toggleMenu();		//torna al menú
}


//funcions que controlen el joc de dos jugadors
function activateCardsTwoPlayer(){		//activa les cartes, de manera que responen als clicks
	$("#cartes").children().each(function(index) {
		// activem el manegador de l'event clic en cada element carta.
		$(this).click(function() {
			// afegim la classe "carta-girada".
			// el navegador animarà la transició dels estils entre l'estat actual i l'estat de carta girada.
			if (ready) {
				if ($(this).hasClass("carta-girada")){
				}
				else {
					$(this).addClass("carta-girada");
					toggledCards++;
				}
				if (toggledCards>=2) {
					ready=false;
					setTimeout(function(){
						cardPairTwoPlayer();
						allPairedTwoPlayer();
						nextTurn();
						$("#cartes").children().each(function(index) {
							$(this).removeClass("carta-girada");
							ready=true;
						});
					},1000);
					toggledCards=0;
				}
			}
		});
	});
}
function nextTurn(){				//canvia de torn
	if (actualTurn==PLAYER1) {
		actualTurn=PLAYER2;
		$("#torn").html("Torn jugador "+actualTurn);
	}
	else {
		actualTurn=PLAYER1;
		$("#torn").html("Torn jugador "+actualTurn);
	}
}
function cardPairTwoPlayer(){		//mira si s'ha girat una parella de cartes iguals, les esborra si ho són
	var card1=0, card2;				//i suma punts al jugador que ha fet la parella
	$("#cartes").children().each(function() {
		if ($(this).hasClass("carta-girada")){
			if (card1==0) {
				card1=this;
			}
			else {
				card2=this;
			}
		}
	});
	if($(card1).children(".davant").attr("class") == $(card2).children(".davant").attr("class")) {
		$(card1).addClass("carta-esborrada");
		$(card2).addClass("carta-esborrada");
		addPoint(actualTurn);
		cardCount-=2;
	}
}
function addPoint (player) {		//afegeix punts al jugador que ha fet la parella
	if (player == PLAYER1){
		points1++;
		$("#punts1").html(points1);
	}
	else {
		points2++;
		$("#punts2").html(points2);
	}
}
function allPairedTwoPlayer(){		//mira si totes les cartes s'han aparellat, i acaba el joc
	var allPaired=true;
	$("#cartes").children().each(function() {
		if (!($(this).hasClass("carta-esborrada"))) {
			allPaired=false;
		}
	});
	if (allPaired) {
		endGameTwoPlayer();
	}
}
function endGameTwoPlayer(){		//envia el missatge del final del joc, restableix el joc i torna al menú
	var dif;
	dif = points1-points2;
	if (dif<0) {
		alert("Ha guanyat el jugador 2");
	}
	else if (dif>0) {
		alert("Ha guanyat el jugador 1");
	}
	else {
		alert("Els dos jugadors han quedat empatats");
	}
	restore();
	toggleMenu();		//torna al menú
}


//funcions que controlen el mode de joc extrem
function activateCardsExtremeMode(){	//activa les cartes, de manera que responen als clicks
	$("#cartes").children().each(function(index) {
		// activem el manegador de l'event clic en cada element carta.
		$(this).click(function() {
			// afegim la classe "carta-girada".
			// el navegador animarà la transició dels estils entre l'estat actual i l'estat de carta girada.
			if (ready) {
				if ($(this).hasClass("carta-girada")){
				}
				else {
					$(this).addClass("carta-girada");
					if ($(this).hasClass("bomba")){
						bombExplodes();
						return;
					}
					toggledCards++;
				}
				if (toggledCards>=2) {
					ready=false;
					setTimeout(function(){
						cardPairTwoPlayer();
						nextTurn();
						onlyBombs();
						$("#cartes").children().each(function(index) {
							$(this).removeClass("carta-girada");
							ready=true;
						});
					},1000);
					toggledCards=0;
				}
			}
		});
	});
}
function bombExplodes(){				//si ha sortit la bomba resta punts i fa shuffle
	ready=false;
	if (actualTurn==PLAYER1){
		points1--;
		$("#punts1").html(points1);
	}
	else {
		points2--;
		$("#punts2").html(points2);
	}
	toggledCards=0;
	nextTurn();
	setTimeout(function(){
		$("#cartes").children().each(function(index) {
			if ($(this).hasClass("carta-girada")){
				$(this).removeClass("carta-girada");
			}
		});
		setTimeout(function(){
			bombShuffle();
			ready=true;
		},500);
	},1000);
}
function bombShuffle() {		//el shuffle es centra només en canviar de lloc les bombes, la resta de cartes no es mouen
	var newPosition, firstLeft, firstTop, secondLeft, secondTop, count;
	$("#cartes").children().each(function(index) {
		if ($(this).hasClass("bomba")){
			newPosition=parseInt(Math.random()*(cardNumber-1)+1);	//guarda les posicions de la carta que toca barrejar
			firstLeft = $(this).css("left");
			firstTop = $(this).css("top");
			count = 1;
			$("#cartes").children().each(function() {	//carrega les posicions d'una altre carta (aleatoria) i les intercanvia
				if (count==newPosition) {
					secondLeft = $(this).css("left");
					secondTop = $(this).css("top");
					$(this).css("left",firstLeft);
					$(this).css("top",firstTop);
				}
				count++;
			});
			$(this).css("left",secondLeft);
			$(this).css("top",secondTop);
		}
	});
}
function onlyBombs(){				//comprova si només queden bombes al tauler i acaba el joc si és així
	if (cardCount==2) {
		endGameExtremeMode();
	}
}
function endGameExtremeMode(){		//acaba el joc, anuncia el guanyador, reseteja el joc i torna al menú
	var dif;
	dif = points1-points2;
	if (dif<0) {
		alert("Ha guanyat el jugador 2");
	}
	else if (dif>0) {
		alert("Ha guanyat el jugador 1");
	}
	else {
		alert("Els dos jugadors han quedat empatats");
	}
	restore();
	toggleMenu();		//torna al menú
}


//funcions que controlen les opcions del menú
function activateCardSet(){			//selecciona el fons de les cartes, en funcio del set que s'ha triat
	if (cardSet==1) {
		$(".davant").css("background-image","url(css/img/onepiecebaralla.png)");
		$(".darrera").css("background-image","url(css/img/onepiecebaralla.png)");
	}
	else {
		$(".davant").css("background-image","url(css/img/mariobrosbaralla.png)");
		$(".darrera").css("background-image","url(css/img/mariobrosbaralla.png)");
	}
}
function setExtremeMode(){			//en mode 2 jugadors, activar mode extrem pel menú si està marcada la casella
	if (playerNumber==2) {
		extremeMode=extreme;
	}
}
function numberOfPlayers(num){		//per seleccionar el numero de jugadors (1 o 2) pel menú
	playerNumber=num;
}
function selectCardSet(set){		//per seleccionar el set de cartes pel menú
	cardSet=set;
}
function setNumberOfCards(){		//per seleccionar amb quantes cartes jugar, pel menú (ha de ser parell)
	cardNumber=$("#cardNumber").val();
}
function extremeClick(){			//per tenir en compte si la casella extremeMode esta marcada
	extreme=!extreme;
}
function toggleMenu(){				//activa i desactiva el menu, el tauler de joc i els marcadors
	if ($("#menu").css("display")=="block"){
		$("#menu").css("display","none");
		$("#joc").css("display","block");
		$("#marcadors").css("display","block");
	}
	else {
		$("#menu").css("display","block");
		$("#joc").css("display","none");
		$("#marcadors").css("display","none");
	}
}