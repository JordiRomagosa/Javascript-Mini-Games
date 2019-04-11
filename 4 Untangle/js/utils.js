//		Classe Punt 	 //
function Punt(x,y){
	this.x=x;
	this.y=y;
}
//	 Mètodes
Punt.distanciaPuntPunt=function(p1,p2){
	var incX= p2.x-p1.x;
	var incY= p2.y-p1.y;
	return Math.sqrt(incX*incX+incY*incY);
}
//						//

//		 Classe Cercle		//
function Cercle(centre,radi,color){
	this.centre = centre;  // és un Punt
	this.radi = radi;
	this.color = color || "rgba(200, 200, 100, .9)";
}
Cercle.prototype.dibuixar = function(ctx){
	ctx.fillStyle = this.color;     
	ctx.beginPath();
	ctx.arc(this.centre.x, this.centre.y, this.radi, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
}
//							//

//		Classe Segment 		//
function Segment(p1, p2, gruix, color) {
	this.p1 = p1;  // és un Punt
	this.p2 = p2;  
	this.gruix = gruix || 1;
	this.color = color || "#cfc";
}
////// Mètodes públics
Segment.prototype.setGruix = function(gruix){
	this.gruix = gruix;
}
Segment.prototype.dibuixar = function(ctx) {		
	ctx.beginPath();
	ctx.moveTo(this.p1.x,this.p1.y);
	ctx.lineTo(this.p2.x,this.p2.y);
	ctx.lineWidth = this.gruix;
	ctx.strokeStyle = this.color;
	ctx.stroke();
}
////// Mètodes estàtics
Segment.esTallen=function (segment1, segment2){
	var m1 = (segment1.p1.y-segment1.p2.y)/(segment1.p1.x-segment1.p2.x);
	var b1 = segment1.p1.y-(m1*segment1.p1.x);
	var m2 = (segment2.p1.y-segment2.p2.y)/(segment2.p1.x-segment2.p2.x);
	var b2 = segment2.p1.y-(m2*segment2.p1.x);
	if (m1 == m2) {
		if (b1!=b2){
			return false;
		}
	}
	var x = Math.round((b2-b1)/(m1-m2));
	var y = m1*x+b1;
	var punt = new Punt (x,y);
	if (Segment.contePunt(segment1,punt) &&
		Segment.contePunt(segment2,punt)) {
		return true;
	}
	return false;
}
Segment.contePunt=function(segment, punt){
	if (Utilitats.estaEntre(punt.x,segment.p1.x,segment.p2.x) && 
		Utilitats.estaEntre(punt.y,segment.p1.y,segment.p2.y)) {
		return true;	
	}
	return false;
}
//					 		//

//		Classe estàtica  	//
function Utilitats(){
}
/// Mètodes estàtics //////
Utilitats.nombreAleatoriEntre= function(a,b){
	return Math.floor(Math.random()*(b-a+a)) + a;
}
Utilitats.estaEntre = function(a,b,c){
	return ((a<b && a>c) || (a>b && a<c));
}
//							//
if (!window.JSON) {
  window.JSON = {
    parse: function(sJSON) { return eval('(' + sJSON + ')'); },
    stringify: (function () {
      var toString = Object.prototype.toString;
      var isArray = Array.isArray || function (a) { return toString.call(a) === '[object Array]'; };
      var escMap = {'"': '\\"', '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t'};
      var escFunc = function (m) { return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1); };
      var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
      return function stringify(value) {
        if (value == null) {
          return 'null';
        } else if (typeof value === 'number') {
          return isFinite(value) ? value.toString() : 'null';
        } else if (typeof value === 'boolean') {
          return value.toString();
        } else if (typeof value === 'object') {
          if (typeof value.toJSON === 'function') {
            return stringify(value.toJSON());
          } else if (isArray(value)) {
            var res = '[';
            for (var i = 0; i < value.length; i++)
              res += (i ? ', ' : '') + stringify(value[i]);
            return res + ']';
          } else if (toString.call(value) === '[object Object]') {
            var tmp = [];
            for (var k in value) {
              if (value.hasOwnProperty(k))
                tmp.push(stringify(k) + ': ' + stringify(value[k]));
            }
            return '{' + tmp.join(', ') + '}';
          }
        }
        return '"' + value.toString().replace(escRE, escFunc) + '"';
      };
    })()
  };
}