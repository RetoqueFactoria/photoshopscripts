// ============================================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: http://www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
// ============================================================================

#target Photoshop
app.bringToFront();
function main(){
var BridgeFiles = GetFilesFromBridge();
if(BridgeFiles.length < 1) {
noBridgeFiles();
return;
}
var win = new Window( 'dialog', 'Procesador de Bridge' ); 
g = win.graphics;
var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.99, 0.99, 0.99, 1]);
g.backgroundColor = myBrush;
win.alignChildren="row";
win.g10 = win.add('group');
win.g10.orientation = "row";
win.title = win.g10.add('statictext',undefined,'OPCIONES');
win.title.alignment="bottom";
var g = win.title.graphics;
g.font = ScriptUI.newFont("Georgia","BOLD",14);
win.p1= win.add("panel", undefined, undefined, {borderStyle:"black"}); 
win.p1.alignChildren="fill";
win.g20 =win.p1.add('group');
win.g20.cb1 = win.g20.add('statictext',undefined,'Exportar:');
win.g25 =win.p1.add('group');
win.g25.spacing=10;
win.g25.orientation = 'row';
win.g25.alignment="left";
win.g25.et1 = win.g25.add('edittext',undefined,'');
win.g25.et1.preferredSize=[300,20];
win.g25.et1.enabled=false;
win.g25.bu1 = win.g25.add('button',undefined,'Explorar');
win.g25.bu1.onClick = function() {
  outputFolder = Folder.selectDialog("Por Favor Selecciona la Carpeta de Salida");	
	if(outputFolder !=null){
		win.g25.et1.text =  decodeURI(outputFolder.fsName); 
		}
}

win.g27 =win.p1.add('group');
win.g27.spacing=10;
win.g27.orientation = 'row';
win.g27.alignment="left";
win.g27.cb1 = win.g27.add('checkbox',undefined,'ACOPLAR (Recomendado)');
win.g27.cb2 = win.g27.add('checkbox',undefined,'Convertir a 8 bit');
win.g27.cb1.value=true;

win.g28 =win.p1.add('group');
win.g28.spacing=10;
win.g28.orientation = 'row';
win.g28.alignment="left";
win.g28.cb1 = win.g28.add('checkbox',undefined,'Ordenar');
win.g28.cb2 = win.g28.add('checkbox',undefined,'Orden Alfanumérico');
win.g28.cb3 = win.g28.add('checkbox',undefined,'Orden Inverso');

win.g29 =win.p1.add('group');
win.g29.spacing=0;
win.g29.orientation = 'row';
win.g29.alignment="left";
win.g29.cb1 = win.g29.add('checkbox',undefined,'Encajar');
win.g29.cb1.preferredSize=[120,20];
win.g29.st1 = win.g29.add('statictext',undefined,'Ancho: ');
win.g29.et1 = win.g29.add('edittext',undefined,'')
win.g29.et1.preferredSize=[50,20];
win.g29.st2 = win.g29.add('statictext',undefined,'px');
win.g29.st2.preferredSize=[100,20];
win.g29.st3 = win.g29.add('statictext',undefined,'Alto: ');
win.g29.et2 = win.g29.add('edittext',undefined,'');
win.g29.et2.preferredSize=[50,20];
win.g29.st4 = win.g29.add('statictext',undefined,'px');
win.g29.et1.enabled=false; 
win.g29.et2.enabled=false;
win.g29.cb1.onClick = function(){
    if(win.g29.cb1.value){
        win.g29.et1.enabled=true;
        win.g29.et1.active=true;
        win.g29.et2.enabled=true;    
        }else{
            win.g29.et1.enabled=false;
            win.g29.et2.enabled=false;
            }
}
win.g29.et1.onChanging = function() { 
  if (this.text.match(/[^\-\.\d]/)) { 
    this.text = this.text.replace(/[^\-\.\d]/g, ''); 
  } 
};
win.g29.et2.onChanging = function() { 
  if (this.text.match(/[^\-\.\d]/)) { 
    this.text = this.text.replace(/[^\-\.\d]/g, ''); 
  } 
};

win.g30 =win.p1.add('group');
win.g30.spacing=10;
win.g30.orientation = 'row';
win.g30.alignment="left";
win.g30.cb1 = win.g30.add('checkbox',undefined,'Acción 1');
win.g30.dd1 = win.g30.add('dropdownlist');
win.g30.dd1.preferredSize=[150,20];
win.g30.dd2 = win.g30.add('dropdownlist');
win.g30.dd2.preferredSize=[150,20];
win.g30.dd1.enabled=false; 
win.g30.dd2.enabled=false;
win.g30.cb1.onClick = function(){
    if(win.g30.cb1.value){
        win.g30.dd1.enabled=true;
        win.g30.dd2.enabled=true;    
        }else{
            win.g30.dd1.enabled=false;
            win.g30.dd2.enabled=false;
            }
}

win.g35 =win.p1.add('group');
win.g35.spacing=10;
win.g35.orientation = 'row';
win.g35.alignment="left";
win.g35.cb1 = win.g35.add('checkbox',undefined,'Acción 2');
win.g35.dd1 = win.g35.add('dropdownlist');
win.g35.dd1.preferredSize=[150,20];
win.g35.dd2 = win.g35.add('dropdownlist');
win.g35.dd2.preferredSize=[150,20];
win.g35.dd1.enabled=false; 
win.g35.dd2.enabled=false;
win.g35.cb1.onClick = function(){
    if(win.g35.cb1.value){
        win.g35.dd1.enabled=true;
        win.g35.dd2.enabled=true;    
        }else{
            win.g35.dd1.enabled=false;
            win.g35.dd2.enabled=false;
            }
}

win.g40 =win.p1.add('group');
win.g40.spacing=10;
win.g40.orientation = 'row';
win.g40.alignment="left";
win.g40.cb1 = win.g40.add('checkbox',undefined,'Acción 3');
win.g40.dd1 = win.g40.add('dropdownlist');
win.g40.dd1.preferredSize=[150,20];
win.g40.dd2 = win.g40.add('dropdownlist');
win.g40.dd2.preferredSize=[150,20];
win.g40.dd1.enabled=false; 
win.g40.dd2.enabled=false;
win.g40.cb1.onClick = function(){
    if(win.g40.cb1.value){
        win.g40.dd1.enabled=true;
        win.g40.dd2.enabled=true;    
        }else{
            win.g40.dd1.enabled=false;
            win.g40.dd2.enabled=false;
            }
}


win.g50 =win.p1.add('group');
win.g50.spacing=10;
win.g50.orientation = 'row';
win.g50.alignment="left";
win.g50.st1 = win.g50.add('statictext',undefined,"Opciones de Renombrado");
var options = ["Nombre del Documento","Nombre del Documento con Prefijo","Nombre del Documento con Sufijo","Nombre del Documento con Secuencia Numérica","Nuevo Nombre con Secuencia Numérica"];
win.g50.dd1 = win.g50.add('dropdownlist',undefined,options);
win.g50.dd1.selection=0;

win.g55 =win.p1.add('group');
win.g55.spacing=10;
win.g55.orientation = 'stack';
win.g55.alignment="left";

win.g55a =win.g55.add('group');
win.g55a.spacing=10;
win.g55a.orientation = 'row';
win.g55a.alignment="left";
win.g55a.st1 = win.g55a.add('statictext',undefined,"Prefijo");
win.g55a.st1.visible=false;
win.g55a.et1 = win.g55a.add('edittext',undefined,"");
win.g55a.et1.preferredSize=[250,20];
win.g55a.et1.visible=false;

win.g55b =win.g55.add('group');
win.g55b.spacing=10;
win.g55b.orientation = 'row';
win.g55b.alignment="left";
win.g55b.st1 = win.g55b.add('statictext',undefined,"Sufijo");
win.g55b.st1.visible=false;
win.g55b.et1 = win.g55b.add('edittext',undefined,"");
win.g55b.et1.preferredSize=[250,20];
win.g55b.et1.visible=false;

win.g55c =win.g55.add('group');
win.g55c.spacing=10;
win.g55c.orientation = 'row';
win.g55c.alignment="left";
win.g55c.st1 = win.g55c.add('statictext',undefined,"Número de Secuencia");
win.g55c.st1.visible=false;
win.g55c.et1 = win.g55c.add('edittext',undefined,"");
win.g55c.et1.preferredSize=[50,20];
win.g55c.et1.visible=false;
win.g55c.et1.onChanging = function() { 
  if (this.text.match(/[^\-\.\d]/)) { 
    this.text = this.text.replace(/[^\-\.\d]/g, ''); 
  } 
}

win.g55d =win.g55.add('group');
win.g55d.spacing=10;
win.g55d.orientation = 'row';
win.g55d.alignment="left";
win.g55d.st1 = win.g55d.add('statictext',undefined,"Nuevo Nombre de Archivo");
win.g55d.st1.visible=false;
win.g55d.et1 = win.g55d.add('edittext',undefined,"");
win.g55d.et1.preferredSize=[200,20];
win.g55d.et1.visible=false;
win.g55d.st2 = win.g55d.add('statictext',undefined,"Sec No.");
win.g55d.st2.visible=false;
win.g55d.et2 = win.g55d.add('edittext',undefined,"");
win.g55d.et2.preferredSize=[50,20];
win.g55d.et2.visible=false;
win.g55d.et2.onChanging = function() { 
  if (this.text.match(/[^\-\.\d]/)) { 
    this.text = this.text.replace(/[^\-\.\d]/g, ''); 
  } 
}

win.g60 =win.p1.add('group');
win.g60.spacing=10;
win.g60.orientation = 'row';
win.g60.alignment="left";
win.g60.cb1 = win.g60.add('checkbox',undefined,"Exportar TIF");
win.g60.st1 = win.g60.add('statictext',undefined,"Comp.");
var tiffOptions=["LZW","ZIP","JPG","Ninguna"];
win.g60.dd1 = win.g60.add('dropdownlist',undefined,tiffOptions);
win.g60.dd1.selection=0;
win.g60.dd1.enabled=false;
win.g60.cb1.onClick = function(){
    if(win.g60.cb1.value){
        win.g60.dd1.enabled=true;
        }else{
            win.g60.dd1.enabled=false;
            }
}
win.g65 =win.p1.add('group');
win.g65.spacing=10;
win.g65.orientation = 'row';
win.g65.alignment="left";
win.g65.cb1 = win.g65.add('checkbox',undefined,"Exportar JPG");
win.g65.st1 = win.g65.add('statictext',undefined,"Calidad");
var jpgQuality=[1,2,3,4,5,6,7,8,9,10,11,12];
win.g65.dd1 = win.g65.add('dropdownlist',undefined,jpgQuality);
win.g65.dd1.selection=7;
win.g65.dd1.enabled=false;
win.g65.cb1.onClick = function(){
    if(win.g65.cb1.value){
        win.g65.dd1.enabled=true;
        }else{
            win.g65.dd1.enabled=false;
            }
}

win.g70 =win.p1.add('group');
win.g70.spacing=10;
win.g70.orientation = 'row';
win.g70.alignment="left";
win.g70.cb1 = win.g70.add('checkbox',undefined,"Exportar PSD");


win.g150 =win.p1.add('group');
win.g150.spacing=10;
win.g150.orientation = 'row';
win.g150.alignment="top";
win.g150.bu1 = win.g150.add('button',undefined,"PROCESAR");
win.g150.bu1.preferredSize=[200,20];
win.g150.bu2 = win.g150.add('button',undefined,"ESCAPE");
win.g150.bu2.preferredSize=[200,20];
win.g50.dd1.onChange = function(){
    switch(this.selection.index){
        case 0 : hideFields();break;
        case 1 : hideFields();
        win.g55a.st1.visible=true;
        win.g55a.et1.visible=true;
        win.g55a.et1.active=true;
        break;
        case 2 : hideFields();
        win.g55b.st1.visible=true;
        win.g55b.et1.visible=true;
        win.g55b.et1.active=true;
        break;
        case 3 : hideFields();
        win.g55c.st1.visible=true;
        win.g55c.et1.visible=true;
        win.g55c.et1.active=true;
        break;
        case 4 : hideFields();
        win.g55d.st1.visible=true;
        win.g55d.et1.visible=true;
        win.g55d.et1.active=true;
        win.g55d.st2.visible=true;
        win.g55d.et2.visible=true;
        break;
        default : break;
        }
}
function hideFields(){
win.g55a.st1.visible=false;
win.g55a.et1.text='';
win.g55a.et1.visible=false;
win.g55b.st1.visible=false;
win.g55b.et1.text='';
win.g55b.et1.visible=false;
win.g55c.st1.visible=false;
win.g55c.et1.text='1';
win.g55c.et1.visible=false;
win.g55d.st1.visible=false;
win.g55d.et1.text='';
win.g55d.et1.visible=false;
win.g55d.st2.visible=false;
win.g55d.et2.text='1';
win.g55d.et2.visible=false;
}

var actionSets = new Array();
actionSets = getActionSets();
for (var i=0,len=actionSets.length;i<len;i++) {
	win.g30.dd1.add ('item', "" + actionSets[i]);  
    win.g35.dd1.add ('item', "" + actionSets[i]);  
    win.g40.dd1.add ('item', "" + actionSets[i]);  
}; 
win.g30.dd1.selection=0;
win.g35.dd1.selection=0;
win.g40.dd1.selection=0;
var actions = new Array();	
actions = getActions(actionSets[0]);
for (var i=0,len=actions.length;i<len;i++) {
	win.g30.dd2.add ('item', "" + actions[i]);    
    win.g35.dd2.add ('item', "" + actions[i]);
    win.g40.dd2.add ('item', "" + actions[i]);
};
win.g30.dd2.selection=0;
win.g35.dd2.selection=0;
win.g40.dd2.selection=0;
win.g30.dd1.onChange = function() {
win.g30.dd2.removeAll();
actions = getActions(actionSets[parseInt(this.selection)]);
for (var i=0,len=actions.length;i<len;i++) {
	win.g30.dd2.add ('item', "" + actions[i]);  
	}
	win.g30.dd2.selection=0;
};
win.g35.dd1.onChange = function() {
win.g35.dd2.removeAll();
actions = getActions(actionSets[parseInt(this.selection)]);
for (var i=0,len=actions.length;i<len;i++) {
	win.g35.dd2.add ('item', "" + actions[i]);  
	}
	win.g35.dd2.selection=0;
};
win.g40.dd1.onChange = function() {
win.g40.dd2.removeAll();
actions = getActions(actionSets[parseInt(this.selection)]);
for (var i=0,len=actions.length;i<len;i++) {
	win.g40.dd2.add ('item', "" + actions[i]);  
	}
	win.g40.dd2.selection=0;
};
win.g150.bu1.onClick = function(){
    if(win.g25.et1.text == '') {
        alert("No se ha Seleccionado ninguna carpeta de salida");
        return;
        }
    if(win.g29.cb1.value && win.g29.et1.text == ''){
        alert("No se ha ingresado el Ancho");
        return;
        }
    if(win.g29.cb1.value && win.g29.et2.text == ''){
        alert("No se ha ingresado el Alto");
        return;
        }
    if(win.g50.dd1.selection.index == 1 && win.g55a.et1.text == ''){
        alert("No se ha ingresado el Prefijo");
        return;
        }
    if(win.g50.dd1.selection.index == 2 && win.g55b.et1.text == ''){
        alert("No se ha ingresado el Sufijo");
        return;
        }
    if(win.g50.dd1.selection.index == 3 && win.g55c.et1.text == ''){
        alert("No se ha ingresado el Número de Secuencia");
        return;
        }
    if(win.g50.dd1.selection.index == 4 && win.g55d.et1.text == ''){
        alert("No se ha ingresado el Nombre de Archivo");
        return;
        }
    if(win.g50.dd1.selection.index == 4 && win.g55d.et2.text == ''){
        alert("No se ha ingresado el Número de Secuencia");
        return;
        }
    if(!win.g60.cb1.value && !win.g65.cb1.value && !win.g70.cb1.value){
        alert("No se ha elegido un formato de Exportación");
        return;
        }
    if(win.g29.cb1.value){
	var WIDTH = parseInt(win.g29.et1.text);
	var HEIGHT= parseInt(win.g29.et2.text);
	if((isNaN(WIDTH)) || (WIDTH < 1)){
       alert( "El Ancho debe ser superior a 1.");
       return;
       }
	if((isNaN(HEIGHT)) || (HEIGHT < 1)){
        alert( "El Alto debe ser superior a 1.");
        return;
	}
}
    win.close(1);
    process();
}
win.show();
function process(){
app.displayDialogs = DialogModes.NO; 			 
var strtRulerUnits = app.preferences.rulerUnits;   			 
var strtTypeUnits = app.preferences.typeUnits;   			 
app.preferences.rulerUnits = Units.PIXELS;   			 
app.preferences.typeUnits = TypeUnits.PIXELS;
var fileList=[];
for (var a in BridgeFiles){
	fileList.push(decodeURI(BridgeFiles[a]));
}

BridgeFiles=fileList;
if(win.g28.cb1.value) BridgeFiles = BridgeFiles.sort();
if(win.g28.cb2.value) BridgeFiles = BridgeFiles.sort(sortAlphaNum);
if(win.g28.cb3.value) BridgeFiles = BridgeFiles.reverse();
    for(var a in BridgeFiles){
    open(File(BridgeFiles[a]));
var doc = activeDocument;
if(win.g27.cb1.value) doc.flatten();
if(win.g27.cb2.value){
if (doc.bitsPerChannel != BitsPerChannelType.EIGHT) doc.bitsPerChannel = BitsPerChannelType.EIGHT;
}
var Name = decodeURI(activeDocument.name).replace(/\.[^\.]+$/, '');
var Seq1 = zeroPad((Number(a)+Number(win.g55c.et1.text)), 4);
var Seq2 = zeroPad((Number(a)+Number(win.g55d.et2.text)), 4);
var Prefix = win.g55a.et1.text;
var Suffix = win.g55b.et1.text;
var NewName = win.g55d.et1.text;
if(win.g29.cb1.value) FitImage( parseInt(win.g29.et1.text), parseInt(win.g29.et2.text) );
if(win.g30.cb1.value) doAction(win.g30.dd2.selection.text, win.g30.dd1.selection.text);
if(win.g35.cb1.value) doAction(win.g35.dd2.selection.text, win.g35.dd1.selection.text);
if(win.g40.cb1.value) doAction(win.g40.dd2.selection.text, win.g40.dd1.selection.text);
var saveFile = decodeURI(outputFolder +"/");
switch(Number(win.g50.dd1.selection.index)){
    case 0 : saveFile += Name; break;
    case 1 : saveFile += Prefix + Name; break;
    case 2 : saveFile += Name + Suffix; break;
    case 3 : saveFile += Name + Seq1; break;
    case 4 : saveFile += NewName + Seq2; break;
    default : break;
    }
if(win.g60.cb1.value) SaveTIFF(saveFile,Number(win.g60.dd1.selection.index));//Save as TIF
if(win.g70.cb1.value) SavePSD(saveFile); //Save as PSD
if(win.g65.cb1.value) SaveJPEG(saveFile, (Number(win.g65.dd1.selection.index)+1));//Save as JPG done last so that file must be 8bit
app.activeDocument.close(SaveOptions.DONOTSAVECHANGES); 
   }
app.preferences.rulerUnits = strtRulerUnits;  
app.preferences.typeUnits = strtTypeUnits;
    }
}

if (app.version.match(/\d+/) <10){
    alert("Disculpa pero este Script necesita CS3 o Superior");
    }else{
main();
}

function noBridgeFiles(){
var bridgeError = new Window( 'dialog', 'PROCESAR SELECCION DE BRIDGE' ); 
bridgeError.alignChildren="column";
b = bridgeError.graphics;
var myBrushb = b.newBrush(b.BrushType.SOLID_COLOR, [0.99, 0.99, 0.99, 1]);
b.backgroundColor = myBrushb;
bridgeError.title = bridgeError.add('statictext',undefined,'Seleccione algún documento en Bridge y vuelva a intentarlo');
bridgeError.title.alignment="bottom";
var g = bridgeError.title.graphics;
g.font = ScriptUI.newFont("Georgia","BOLDITALIC",12);
bridgeError.add('button',undefined,'Ok');
bridgeError.center();
bridgeError.show();
}
function getActionSets() { 
cTID = function(s) { return app.charIDToTypeID(s); }; 
sTID = function(s) { return app.stringIDToTypeID(s); }; 
  var i = 1; 
  var sets = [];  
  while (true) { 
    var ref = new ActionReference(); 
    ref.putIndex(cTID("ASet"), i); 
    var desc; 
    var lvl = $.level; 
    $.level = 0; 
    try { 
      desc = executeActionGet(ref); 
    } catch (e) { 
      break;    // all done 
    } finally { 
      $.level = lvl; 
    } 
    if (desc.hasKey(cTID("Nm  "))) { 
      var set = {}; 
      set.index = i; 
      set.name = desc.getString(cTID("Nm  ")); 
      set.toString = function() { return this.name; }; 
      set.count = desc.getInteger(cTID("NmbC")); 
      set.actions = []; 
      for (var j = 1; j <= set.count; j++) { 
        var ref = new ActionReference(); 
        ref.putIndex(cTID('Actn'), j); 
        ref.putIndex(cTID('ASet'), set.index); 
        var adesc = executeActionGet(ref); 
        var actName = adesc.getString(cTID('Nm  ')); 
        set.actions.push(actName); 
      } 
      sets.push(set); 
    } 
    i++; 
  } 
  return sets; 
}; 

function getActions(aset) {
cTID = function(s) { return app.charIDToTypeID(s); }; 
sTID = function(s) { return app.stringIDToTypeID(s); };
  var i = 1;
  var names = [];
  if (!aset) {
    throw "Especifique la Carpeta de Acciones";
  }  
  while (true) {
    var ref = new ActionReference();
    ref.putIndex(cTID("ASet"), i);
    var desc;
    try {
      desc = executeActionGet(ref);
    } catch (e) {
      break;    // all done
    }
    if (desc.hasKey(cTID("Nm  "))) {
      var name = desc.getString(cTID("Nm  "));
      if (name == aset) {
        var count = desc.getInteger(cTID("NmbC"));
        var names = [];
        for (var j = 1; j <= count; j++) {
          var ref = new ActionReference();
          ref.putIndex(cTID('Actn'), j);
          ref.putIndex(cTID('ASet'), i);
          var adesc = executeActionGet(ref);
          var actName = adesc.getString(cTID('Nm  '));
          names.push(actName);
        }
        break;
      }
    }
    i++;
  }
  return names;
};
function GetFilesFromBridge() {
function script(){
var fL = app.document.selections;
var tF=[];
for(var a in fL){
    if(fL[a].type =='file'){
        tF.push(new File(encodeURI(fL[a].spec.fsName)));
        }
    }
return tF.toSource();
}
	var fileList;
		var bt = new BridgeTalk();
		bt.target = "bridge";
        bt.body = "var ftn = " + script.toSource() + "; ftn();";
		bt.onResult = function( inBT ) { fileList = eval( inBT.body ); }
		bt.onError = function( inBT ) { fileList = new Array(); }
		bt.send(8);
		bt.pump();
	if ( undefined == fileList ) fileList = new Array();
	return fileList; 
}
function sortAlphaNum(a, b) {
	var x = a.split("/"); 
	var y = b.split("/");
	x = x[x.length-1].replace(/\\\s/g," ").split(/(\d+)/); 
	y = y[y.length-1].replace(/\\\s/g," ").split(/(\d+)/); 
	for (var i in x) {
		if (x[i] && !y[i] || isFinite(x[i]) && !isFinite(y[i])) {
			return -1;
		} else if (!x[i] && y[i] || !isFinite(y[i]) && isFinite(y[i])) {
			return 1;
		} else if (!isFinite(x[i]) && !isFinite(y[i])) {
			x[i] = x[i].toLowerCase();
			y[i] = y[i].toLowerCase();
			if (x[i] < y[i]) return -1;
			if (x[i] > y[i]) return 1;
		} else {
			x[i] = parseFloat(x[i]);
			y[i] = parseFloat(y[i]);
			if (x[i] < y[i]) return -1;
			if (x[i] > y[i]) return 1;
		}
	}
	return 0;
}
function FitImage( inWidth, inHeight ) {
	var desc = new ActionDescriptor();
	var unitPixels = charIDToTypeID( '#Pxl' );
	desc.putUnitDouble( charIDToTypeID( 'Wdth' ), unitPixels, inWidth );
	desc.putUnitDouble( charIDToTypeID( 'Hght' ), unitPixels, inHeight );
	var runtimeEventID = stringIDToTypeID( "3caa3434-cb67-11d1-bc43-0060b0a13dc4" );	
	executeAction( runtimeEventID, desc, DialogModes.NO );
};
function zeroPad(n, s) { 
n = n.toString(); 
while (n.length < s) n = '0' + n; 
return n; 
};
function SavePSD(saveFile){ 
psdSaveOptions = new PhotoshopSaveOptions(); 
psdSaveOptions.embedColorProfile = true; 
psdSaveOptions.alphaChannels = true;  
activeDocument.saveAs(File(saveFile+".psd"), psdSaveOptions, true, Extension.LOWERCASE); 
}
function SaveTIFF(saveFile,Comp){
tiffSaveOptions = new TiffSaveOptions(); 
tiffSaveOptions.embedColorProfile = true;
tiffSaveOptions.transparency=true;
tiffSaveOptions.interleaveChannels=true;
tiffSaveOptions.alphaChannels = false; 
switch (Number(Comp)){
    case 0 : tiffSaveOptions.imageCompression = TIFFEncoding.TIFFLZW; break;
    case 1 : tiffSaveOptions.imageCompression = TIFFEncoding.TIFFZIP; break;
    case 2 : tiffSaveOptions.imageCompression = TIFFEncoding.JPEG; break;
    case 3 : tiffSaveOptions.imageCompression = TIFFEncoding.NONE; break;
    default : break;
}
activeDocument.saveAs(File(saveFile+".tif"), tiffSaveOptions, true, Extension.LOWERCASE); 
}
function SaveJPEG(saveFile, jpegQuality){
var doc = activeDocument;
if (doc.bitsPerChannel != BitsPerChannelType.EIGHT) doc.bitsPerChannel = BitsPerChannelType.EIGHT;
jpgSaveOptions = new JPEGSaveOptions();
jpgSaveOptions.embedColorProfile = true;
jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
jpgSaveOptions.matte = MatteType.NONE;
jpgSaveOptions.quality = jpegQuality; 
activeDocument.saveAs(File(saveFile+".jpg"), jpgSaveOptions, true,Extension.LOWERCASE);
}
