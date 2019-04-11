//////////  classe estàtica Utilitats  ////////////
/////////////////// 
function Utilitats(){} 
Utilitats.duplicarMatriu = function(m){	//retorna una còpia de la matriu m 
	var mida = m[0].length;
	var copia = new Array (mida);
	for (var i=0; i<mida;i++){
		copia[i] = new Array(mida);
	}
	for (var i=0;i<mida;i++){
	  for (var c=0;c<mida;c++){
		  copia[i][c] = m[i][c];
	  }
	}
	return copia;
}
Utilitats.girarMatriuHorari = function(m){	//retorna la matriu girada 90 graus en sentit horari
	var mida = m[0].length;
	var copia = Utilitats.duplicarMatriu(m);
	for (var i=0;i<mida;i++){
	  for (var c=0;c<mida;c++){
		  copia[c][mida-i-1] = m[i][c];
	  }
	}
	return copia;
}
Utilitats.girarMatriuAntihorari = function(m){
	//gira la matriu donada 90 graus en sentit antihorari
	for (var i=0;i<3;i++){
		Utilitats.girarMatriuHorari(m);
	}
}
///////////////////////////////////////////////////
//////////////////// 

//////////  classe Bloc  //////////////////////////
//////////////////// 
function Bloc(tipus, taulell) {
  this.X = 4;              // posició inicial en la quadrícula del Taulell 
  this.Y = 0;
  this.Yf = 0;            // posició final en la quadrícula del Taulell 
  this.taulell = taulell;  //instància del Taulell en que es desplaça el bloc actual  
  if (tipus == ""){
     tipus = ["T", "L", "J", "I", "O", "2", "S"]; 
     tipus = tipus[Math.round(Math.random() * 6)];
  }
  switch (tipus) {
    case "T" : this.color = "rgba(222,8,214,1)";  // "#AA00FF"; 
               this.forma = [[0, 1, 0], 
                             [0, 1, 1], 
                             [0, 1, 0]]; 
               break; 
    case "L" : this.color = "rgba(255,120,0,1)";    // "#AA0000"; 
               this.forma = [[0, 1, 0], 
                             [0, 1, 0], 
                             [0, 1, 1]]; 
               break; 
    case "J" : this.color = "rgba(39,34,240,1)";    // "#0000AA"; 
                  this.forma = [[0, 0, 1], 
                                [0, 0, 1], 
                                [0, 1, 1]]; 
                  break; 
    case "I" : this.color = "rgba(63,251,227,1)";  // "#FF2525"; 
               this.forma = [[0, 1, 0, 0], 
                             [0, 1, 0, 0], 
                             [0, 1, 0, 0], 
                             [0, 1, 0, 0]];
               break; 
    case "2" : this.color = "rgba(42,255,0,1)";	// "#AAAAFF"; 
               this.forma = [[1, 1, 0], 
                             [0, 1, 1], 
                             [0, 0, 0]]; 
               break; 
    case "S" : this.color = "rgba(255,0,0,1)"; // "#AAFFAA"; 
               this.forma = [[0, 1, 1], 
                             [1, 1, 0], 
                             [0, 0, 0]]; 
               break; 
    case "O" : this.color = "rgba(247,227,0,1)";   // "#5555AA"; 
               this.forma = [[1, 1], 
                             [1, 1]]; 
               break;
	case "." : this.color = "rgba(255,255,255,1)";   // "#5555AA"; 
               this.forma = [[1]];
               break;
  }
}
Bloc.prototype = { 
  	constructor: Bloc, 
//// Mètodes públics //////////////// 
Right: function(){ 
	 if(this._testPos(this.X + 1, this.Y, this.forma)) this.X++; 
	 this._actualitzaYf();
},
Left: function(){
	if(this._testPos(this.X - 1, this.Y, this.forma)) this.X--; 
	this._actualitzaYf();
}, 
Down: function(){
	if(this._testPos(this.X, this.Y + 1, this.forma)) {
		this.Y++;
		this._actualitzaYf();
		return true;
	}
	else {
		this.taulell.fixaBloc(this);
		return false;
	}
},
Turn: function(){
	var b = Utilitats.girarMatriuHorari(this.forma); 
	if(this._testPos(this.X,this.Y,b)){
		this.forma = b;
		this._actualitzaYf();
	}
},
testBloc: function(){
	return this._testPos(this.X, this.Y,this.forma); 
},
paint: function(ctx){ //dibuixa i pinta el bloc en el context subministrat
	var mida = this.forma.length;
	for (var i=0;i<mida;i++){
		for (var c=0;c<mida;c++){
			if (this.forma[i][c] == 1){
				ctx.fillStyle= "rgba(255,255,255,0.1)";
				ctx.fillRect(25*(this.X+c)+1,25*(this.Yf+i)+1,23,23);
			}
		}
	}
	for (var i=0;i<mida;i++){
		for (var c=0;c<mida;c++){
			if (this.forma[i][c] == 1){
				ctx.fillStyle=this.color;
				ctx.fillRect(25*(this.X+c),25*(this.Y+i),25,25);
				ctx.lineWidth="1";
				ctx.strokeStyle= this.taulell.colorFons;
				ctx.rect(25*(this.X+c),25*(this.Y+i),25,25);
			}
		}
	}
	ctx.stroke();
}, 
//// Mètodes privats //////////////// 
_actualitzaYf: function(){	//actualitza this.Yf, posició de la ombra "fantasma" de la peça actual
	this.Yf = this.Y;
	while (this._testPos(this.X,this.Yf+1,this.forma)){
		this.Yf++;
	}
},              
_testPos: function(X, Y, forma){
//comprova si és possible la posició X, Y per al bloc de la forma donada dins la quadrícula del taulell 
	var mida = forma.length;
	for (var i=0;i<mida;i++){
		for (var c=0;c<mida;c++){
			if (forma[i][c]==1){
				if (c+X>9 || X+c<0 || i+Y>=20) {return false;}
				var taulell = this.taulell.quadricula;
				var color = this.taulell.colorFons;
				if (taulell[i+Y][c+X]!=color){return false;}
			}
		}
	}
	return true;
},
//// Altres mètodes: ampliacions //////////////// 
/*  
       altres mètodes que pugueu necessitar indican
t si són públics o privats 
*/
} 
///////////////////////////////////////////////////
//////////////////// 


//////////  classe Taulell  ///////////////////////
/////////////////////// 
function Taulell(colorFons){ 
	this.colorFons = colorFons;                // color de cel·la del taulell no ocupada 
	//this.liniesEsborrades=0;                   // número de línies esborrades 
	this.quadricula=new Array(20);             // quadrícula de 10 files x 20 columnes 
	for(i = 0; i < this.quadricula.length; i++)
		this.quadricula[i] = new Array(10);
	this.iniciaQuadricula(); 
}
Taulell.prototype={ 
	constructor: Taulell, 
///// mètodes públics  ////// 
iniciaQuadricula: function(){	//inicia totes les posicions de la quadrícula del taulell amb el color de fons del mateix 
	for (var i=0;i<this.quadricula.length;i++){
		for (var c=0;c<this.quadricula[0].length;c++){
			this.quadricula[i][c] = this.colorFons;
		}
	}
},
esborraLiniesPlenes: function(){//esborra totes les files plenes de la quadrícula i retorna el número de línies esborrades
	var esborrar;
	var cont = 0;
	for (var i=0;i<this.quadricula.length;i++){
		esborrar = true;
		for (var c=0;c<this.quadricula[0].length&&esborrar;c++){
			if (this.quadricula[i][c]==this.colorFons){
				esborrar = false;
			}
		}
		if (esborrar) {
			for (var c=0;c<this.quadricula[0].length;c++){
				this.quadricula[i][c]=this.colorFons;
			}
			this.baixarLinies(i);
			cont++;
		}
	}
	return cont;
},
baixarLinies: function(fila){	//baixa les linies per tapar les linies esborrades
	for (var i=fila;i>0;i--){
		for (var c=0;c<10;c++){
			this.quadricula[i][c] = this.quadricula[i-1][c];
		}
	}
},
fixaBloc: function(bloc){ 
//fixa la posició final del bloc actual en la quadrícula del taulell emmagatzemant el color dels quadradets del bloc en la quadrícula 
	var mida = bloc.forma.length;
	for (var i=0;i<mida;i++){
		for (var c=0;c<mida;c++){
			if (bloc.forma[i][c]==1){
				this.quadricula[i+bloc.Y][c+bloc.X] = bloc.color;
			}
		}
	}
},
paint: function(ctx){	//dibuixa i pinta el taulell en el context subministrat 
	for (var i=0;i<this.quadricula.length;i++){
		for (var c=0;c<this.quadricula[0].length;c++){
			if (this.quadricula[i][c]==this.colorFons){
				ctx.fillStyle=this.colorFons;
				ctx.fillRect(25*c,25*i,25,25);
			}
			else {
				ctx.fillStyle=this.quadricula[i][c];
				ctx.fillRect(25*c,25*i,25,25);
				ctx.lineWidth="1";
				ctx.strokeStyle="rgba(0,0,0,1)";
				ctx.rect(25*c,25*i,25,25);
			}
		}
	}
	ctx.stroke();
},
//// Altres mètodes: ampliacions //////////////// 
//altres mètodes que pugueu necessitar indicant si són públics o privats 
} 