function splitToChars () {

if (app.documents.length==0){
return
}
if ( app.activeDocument.activeLayer.kind != LayerKind.TEXT ) {
	alert ("Por favor selecciona una Capa de Texto e intenta de nuevo" )
	return
}
app.activeDocument.selection.deselect ();
app.activeDocument.activeLayer.visible = false;
var idCpTL = charIDToTypeID( "CpTL" );
executeAction( idCpTL, undefined, DialogModes.NO );
var txtLyr = app.activeDocument.activeLayer
txtLyr.visible = true;
if ( txtLyr.textItem.direction == Direction.VERTICAL ) {
var idsetd = charIDToTypeID( "setd" );
    var desc21 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref4 = new ActionReference();
        var idPrpr = charIDToTypeID( "Prpr" );
        var idOrnt = charIDToTypeID( "Ornt" );
        ref4.putProperty( idPrpr, idOrnt );
        var idTxLr = charIDToTypeID( "TxLr" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref4.putEnumerated( idTxLr, idOrdn, idTrgt );
    desc21.putReference( idnull, ref4 );
    var idT = charIDToTypeID( "T   " );
    var idOrnt = charIDToTypeID( "Ornt" );
    var idHrzn = charIDToTypeID( "Hrzn" );
    desc21.putEnumerated( idT, idOrnt, idHrzn );
executeAction( idsetd, desc21, DialogModes.NO );
}	
if ( txtLyr.textItem.kind == TextType.PARAGRAPHTEXT ) {
var idsetd = charIDToTypeID( "setd" );
    var desc746 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref300 = new ActionReference();
        var idPrpr = charIDToTypeID( "Prpr" );
        var idTEXT = charIDToTypeID( "TEXT" );
        ref300.putProperty( idPrpr, idTEXT );
        var idTxLr = charIDToTypeID( "TxLr" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref300.putEnumerated( idTxLr, idOrdn, idTrgt );
    desc746.putReference( idnull, ref300 );
    var idT = charIDToTypeID( "T   " );
    var idTEXT = charIDToTypeID( "TEXT" );
    var idPnt = charIDToTypeID( "Pnt " );
    desc746.putEnumerated( idT, idTEXT, idPnt );
executeAction( idsetd, desc746, DialogModes.NO );
}
var txtArray = txtLyr.textItem.contents
var txt = []
var lineCount =1
for ( i=0; i<txtArray.length; i++ ) {
	if ( txtArray [i] != " "  && txtArray [i] != "\r" ) {
	for ( j=i; j<txtArray.length; j++ ) {
		txt .push ( txtArray[j] )
		if ( txtArray[j] =="\r" ) {
			lineCount++
			}
		}
		break
	}
}
var x0 = txtLyr.bounds[0]
var y0 = txtLyr.bounds[1]
var x = x0
var y = y0
var idDplc = charIDToTypeID( "Dplc" );
    var desc155 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref56 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref56.putEnumerated( idLyr, idOrdn, idTrgt );
    desc155.putReference( idnull, ref56 );
    var idVrsn = charIDToTypeID( "Vrsn" );
    desc155.putInteger( idVrsn, 2 );
executeAction( idDplc, desc155, DialogModes.NO );
var newLyr = app.activeDocument.activeLayer
newLyr.textItem.contents = "n"
var lineHeight = newLyr.bounds [3]-newLyr.bounds [1]
var charWidth = newLyr.bounds [2]-newLyr.bounds [0]

if( lineCount > 1 ) {
	var leading = (txtLyr.bounds[3]-newLyr.bounds[3])/( lineCount-1 ) 
	}

newLyr.textItem.contents = "nn"
var tracking= newLyr.bounds [2]-newLyr.bounds [0] - charWidth*2

newLyr.textItem.contents = "n n"
var space = newLyr.bounds [2]-newLyr.bounds [0] - charWidth*2

newLyr.textItem.contents = txt [0]
var deltaX = x-newLyr.bounds [0]
var deltaY=0;
newLyr.translate ( deltaX, deltaY )

x = newLyr.bounds[2]

for ( i=1; i<txt.length; i++ ) {

app.activeDocument.activeLayer = txtLyr

var idDplc = charIDToTypeID( "Dplc" );
    var desc155 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref56 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref56.putEnumerated( idLyr, idOrdn, idTrgt );
    desc155.putReference( idnull, ref56 );
    var idVrsn = charIDToTypeID( "Vrsn" );
    desc155.putInteger( idVrsn, 2 );
executeAction( idDplc, desc155, DialogModes.NO );

newLyr = app.activeDocument.activeLayer
newLyr.textItem.contents = txt [i]

if ( newLyr.textItem.contents == " " ) {
newLyr.remove ()
x += space
} else if ( newLyr.textItem.contents == "\r" ) {
newLyr.remove ()
	x = x0;
deltaY += leading
} else {
deltaX = x-newLyr.bounds [0] + tracking
newLyr.translate ( deltaX, deltaY )

x = newLyr.bounds[2]
}

}

txtLyr.remove ()
};
//=======================
splitToChars ();
///////////////////////////////////////