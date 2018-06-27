// Traducción: Juan Manuel Díaz
// Sitio Web: http://www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com

#target photoshop
var checksOut = true;
checksOut = checkPhotoshop(checksOut);

if (checksOut == true) {
var dlg = new Window("dialog", "CALEIDOSCOPIO", [500,300,750,450]);

numberKeystrokeFilter = function() {
	this.text = this.text.replace(",", "");
	this.text = this.text.replace(".", "");
	this.text = this.text.replace("-", "");
	if (this.text.match(/[^\-\.\d]/)) {
		this.text = this.text.replace(/[^\-\.\d]/g, "")
		};
	if (this.text == 0) {this.text = 1}
	};

dlg.facettes = dlg.add("edittext", [15,15,110,35], "3", {multiline:false});
dlg.facettes.active = true;
dlg.facettes.onChange = numberKeystrokeFilter;

dlg.flip = dlg.add("checkbox", [125,15,235,35], "ROTAR?");
dlg.flip.value = true;

dlg.buildBtn = dlg.add("button", [13,45,118,68], "OK", {name:"ok"});
dlg.cancelBtn = dlg.add("button", [128,45,240,68], "CANCELAR", {name:"cancel"});

dlg.explanation = dlg.add("statictext", [15,75,235,150], "Capa Seleccionada: "+app.activeDocument.activeLayer.name+"", {multiline:true});

dlg.center();

var myReturn = dlg.show ();
if (myReturn == true) {
var myDocument = app.activeDocument;

var theNumber = Number (dlg.facettes.text);

var theFlip = dlg.flip.value;

myDocument.suspendHistory("Caleidoscopio "+theNumber, "main(myDocument, theNumber, theFlip)");
}
};


function main (myDocument, theNumber, theFlip) {
app.togglePalettes();

var originalRulerUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;
myDocument.selection.deselect();
var theDocRes = myDocument.resolution;
var theWidth = myDocument.width;
var theHeight = myDocument.height;
var theDiagonal = Math.sqrt (Math.pow (theWidth, 2) + Math.pow (theHeight, 2)) / 2;
var theCenter = [Math.round (theWidth / 2), Math.round(theHeight / 2)];
var myLayer = convertToSmartObject(myDocument.activeLayer);
if (myLayer.visible == false) {myLayer.visible = true};
var moveToHorCenter = (myLayer.bounds[0] + (theCenter[0] - (myLayer.bounds[2] - myLayer.bounds[0]) / 2)) * (-1);
var moveToVerCenter = (myLayer.bounds[1] + (theCenter[1] * 1.5 - (myLayer.bounds[3] - myLayer.bounds[1]) / 2)) * (-1);
myLayer.translate(moveToHorCenter, moveToVerCenter);
var myLayerCenter = [(myLayer.bounds[0] + ((myLayer.bounds[2] - myLayer.bounds[0]) / 2)), (myLayer.bounds[1] + ((myLayer.bounds[3] - myLayer.bounds[1]) / 2))];
var theCenterDist = getDistance(theCenter, myLayerCenter);
var theCenterAngle = getAngle (theCenter, myLayerCenter);
var theContainer = myDocument.layerSets.add();
theContainer.name = "Caleidoscopio " + theNumber;

for (var q = 0; q < theNumber * 2; q++) {

	var theName = "kal_segm_" + (q + 1);
	var theArray = new Array;
	if (theNumber != 1) {
		theArray[0] = theCenter;
		var theDirection1 = q * 360 / (theNumber * 2) + 90;
		theArray[1] = getAngledPoint (theCenter, theDirection1, theDiagonal * 2);
		var theDirection2 = (q + 1) * 360 / (theNumber * 2) + 90;
		theArray[2] = getAngledPoint (theCenter, theDirection2, theDiagonal * 2);
		var theSet = createMaskedSet (theName, theArray, theContainer);
		};
	else {
		theArray[0] = [q * theWidth / 2, 0];
		theArray[1] = [(q + 1) * theWidth / 2, 0];
		theArray[2] = [(q + 1) * theWidth / 2, theHeight];
		theArray[3] = [q * theWidth / 2, theHeight];
		var theDirection1 = 0;
		var theSet = createMaskedSet (theName, theArray, theContainer);
		};

	var theCopy = myLayer.duplicate(theSet, ElementPlacement.PLACEATBEGINNING);
	var theTargetPos = getAngledPoint(theCenter, theCenterAngle + theDirection1 - 90 + (360 / theNumber / 4), theCenterDist);
	var horizontalOffset = (myLayerCenter[0] - theTargetPos[0]) * (-1);
	var verticalOffset = (myLayerCenter[1] - theTargetPos[1]) * (-1);
	if (String(q / 2).indexOf(".") == -1 && theFlip == true) {
		rotateMoveAndScale (myDocument, theCopy, theDirection1 -  90 + (360 / theNumber / 4), horizontalOffset, verticalOffset, -100, 100)
		}
	else{
		rotateMoveAndScale (myDocument, theCopy, theDirection1 -  90 + (360 / theNumber / 4), horizontalOffset, verticalOffset, 100, 100);
		};
	myDocument.activeLayer = theSet;
	};
myLayer.translate(moveToHorCenter * (-1), moveToVerCenter * (-1));
myDocument.activeLayer = theContainer;
myLayer.visible = false;

app.togglePalettes()
app.preferences.rulerUnits = originalRulerUnits;
};


function convertToSmartObject () {
if (app.activeDocument.activeLayer.kind != LayerKind.SMARTOBJECT) {
var id557 = charIDToTypeID( "slct" ); 
var desc108 = new ActionDescriptor(); 
var id558 = charIDToTypeID( "null" ); 
var ref77 = new ActionReference(); 
var id559 = charIDToTypeID( "Mn  " ); 
var id560 = charIDToTypeID( "MnIt" ); 
var id561 = stringIDToTypeID( "newPlacedLayer" ); 
ref77.putEnumerated( id559, id560, id561 ); 
desc108.putReference( id558, ref77 ); 
executeAction( id557, desc108, DialogModes.NO );
};
return app.activeDocument.activeLayer
};

function dateString () {
	var now = new Date();
	var day = now.getDate();
	var month = now.getMonth();
	month++;
	var year = now.getFullYear();
	var hour = now.getHours();
	var minutes = now.getMinutes();
	var seconds = now.getSeconds();
	var myDateText = day+"-"+month+"-"+year+"_"+hour+"-"+minutes+"-"+seconds;
	return myDateText
	};

function createMaskedSet (theName, theArray, theContainer) {	
var theSet = theContainer.layerSets.add();
theSet.name = theName;
myDocument.selection.select (theArray, SelectionType.REPLACE , 0 , false );


var idMk = charIDToTypeID( "Mk  " );
    var desc5 = new ActionDescriptor();
    var idNw = charIDToTypeID( "Nw  " );
    var idChnl = charIDToTypeID( "Chnl" );
    desc5.putClass( idNw, idChnl );
    var idAt = charIDToTypeID( "At  " );
        var ref3 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idChnl = charIDToTypeID( "Chnl" );
        var idMsk = charIDToTypeID( "Msk " );
        ref3.putEnumerated( idChnl, idChnl, idMsk );
    desc5.putReference( idAt, ref3 );
    var idUsng = charIDToTypeID( "Usng" );
    var idUsrM = charIDToTypeID( "UsrM" );
    var idRvlS = charIDToTypeID( "RvlS" );
    desc5.putEnumerated( idUsng, idUsrM, idRvlS );
executeAction( idMk, desc5, DialogModes.NO );
return theSet
};

function radiansOf (theAngle) {
	return theAngle * Math.PI / 180
	};

function getAngledPoint (theCenter, theDirection, theDiagonal) {
	var theHor = theCenter[0] + (Math.cos(radiansOf(theDirection)) * theDiagonal);
	var theVer = theCenter[1] + (Math.sin(radiansOf(theDirection)) * theDiagonal);
	return [theHor, theVer]
	};

function rotateMoveAndScale (myDocument, theLayer, thisAngle, horizontalOffset, verticalOffset, horScale, verScale) {

myDocument.activeLayer = theLayer;

var idTrnf = charIDToTypeID( "Trnf" );
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref2 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref2.putEnumerated( idLyr, idOrdn, idTrgt );
    desc3.putReference( idnull, ref2 );
    var idFTcs = charIDToTypeID( "FTcs" );
    var idQCSt = charIDToTypeID( "QCSt" );
    var idQcsa = charIDToTypeID( "Qcsa" );
    desc3.putEnumerated( idFTcs, idQCSt, idQcsa );
    var idOfst = charIDToTypeID( "Ofst" );
        var desc4 = new ActionDescriptor();
        var idHrzn = charIDToTypeID( "Hrzn" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc4.putUnitDouble( idHrzn, idPxl, horizontalOffset );
        var idVrtc = charIDToTypeID( "Vrtc" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc4.putUnitDouble( idVrtc, idPxl, verticalOffset );
    var idOfst = charIDToTypeID( "Ofst" );
    desc3.putObject( idOfst, idOfst, desc4 );
    var idWdth = charIDToTypeID( "Wdth" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc3.putUnitDouble( idWdth, idPrc, horScale );
    var idHght = charIDToTypeID( "Hght" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc3.putUnitDouble( idHght, idPrc, verScale );
    var idAngl = charIDToTypeID( "Angl" );
    var idAng = charIDToTypeID( "#Ang" );
    desc3.putUnitDouble( idAngl, idAng, thisAngle );
executeAction( idTrnf, desc3, DialogModes.NO );
};

function getDistance (pointOne, pointTwo) {

	var width = pointTwo[0] - pointOne[0];
	var height = pointTwo[1] - pointOne[1];
	var sideC = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)); 
	return sideC
	};

function getAngle (pointOne, pointTwo) {

	var width = pointTwo[0] - pointOne[0];
	var height = pointTwo[1] - pointOne[1];
	var sideC = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)); 

	if (width+width > width) {theAngle = Math.asin(height / sideC) * 360 / 2 / Math.PI}
	else {theAngle = 180 - (Math.asin(height / sideC) * 360 / 2 / Math.PI)};
	if (theAngle < 0) {theAngle = (360 + theAngle)};
	return theAngle
	};


function checkPhotoshop(checksOut) {
	if (app.documents.length == 0) {
		alert("No hay documentos abiertos. Abra un documento e inténtelo de nuevo.");
		checksOut = false
		};
	var theKinds = ["LayerKind.BLACKANDWHITE", "LayerKind.BRIGHTNESSCONTRAST", "LayerKind.CHANNELMIXER", "LayerKind.COLORBALANCE", "LayerKind.CURVES", "LayerKind.EXPOSURE",
	"LayerKind.GRADIENTMAP", "LayerKind.HUESATURATION", "LayerKind.INVERSION", "LayerKind.LAYER3D", "LayerKind.LEVELS", "LayerKind.PHOTOFILTER", "LayerKind.POSTERIZE",
	"LayerKind.SELECTIVECOLOR", "LayerKind.THRESHOLD", "LayerKind.VIBRANCE"];
	for (var n = 0; n < theKinds.length; n++) {
		if (app.activeDocument.activeLayer.kind == theKinds[n]) {
			alert ("layer is ineligible");
			checksOut = false;
			}
		};
	return checksOut
	};

