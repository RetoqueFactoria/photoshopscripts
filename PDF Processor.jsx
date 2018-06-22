// Written by Paul Riggott
//With lots of functions from xbytor and Mike Hale (Thank you!)

function main(){
var Dialog =
"dialog{text:'Script Interface',bounds:[100,100,490,620],\
		panel0:Panel{bounds:[10,10,380,390] , text:'' ,properties:{borderStyle:'etched',su1PanelCoordinates:true},\
			Title:StaticText{bounds:[140,20,220,37] , text:'PDF Processor' ,properties:{scrolling:undefined,multiline:undefined}},\
			statictext1:StaticText{bounds:[10,50,80,67] , text:'Open Mode' ,properties:{scrolling:undefined,multiline:undefined}},\
			openMode:DropDownList{bounds:[10,67,116,88]},\
			statictext2:StaticText{bounds:[120,50,180,67] , text:'Bit Depth' ,properties:{scrolling:undefined,multiline:undefined}},\
			Bits:DropDownList{bounds:[120,67,180,88]},\
			statictext3:StaticText{bounds:[188,50,250,67] , text:'Resolution' ,properties:{scrolling:undefined,multiline:undefined}},\
			RES:EditText{bounds:[190,67,240,88] , text:'300' ,properties:{multiline:false,noecho:false,readonly:false}},\
			cropto:StaticText{bounds:[250,50,300,67] , text:'Crop To' ,properties:{scrolling:undefined,multiline:undefined}},\
			cropTo:DropDownList{bounds:[250,67,360,88]},\
			statictext4:StaticText{bounds:[10,120,111,137] , text:'Pages to Process' ,properties:{scrolling:undefined,multiline:undefined}},\
			processPages:DropDownList{bounds:[10,137,150,158]},\
			FromText:StaticText{bounds:[190,120,230,137] , text:'From' ,properties:{scrolling:undefined,multiline:undefined}},\
			From:EditText{bounds:[190,140,230,156] , text:'1' ,properties:{multiline:false,noecho:false,readonly:false}},\
			ToText:StaticText{bounds:[270,120,300,137] , text:'To' ,properties:{scrolling:undefined,multiline:undefined}},\
			To:EditText{bounds:[270,140,310,156] , text:'' ,properties:{multiline:false,noecho:false,readonly:false}},\
			FileFolder:StaticText{bounds:[10,180,80,197] , text:'File/Folder' ,properties:{scrolling:undefined,multiline:undefined}},\
			FileorFolder:DropDownList{bounds:[10,197,210,218]},\
			SelFolder:StaticText{bounds:[10,230,200,247] , text:'Select File' ,properties:{scrolling:undefined,multiline:undefined}},\
			Path:EditText{bounds:[10,250,290,268] , text:'' ,properties:{multiline:false,noecho:false,readonly:false}},\
			Browse:Button{bounds:[300,250,360,270] , text:'Browse' },\
			OK:Button{bounds:[30,330,130,350] , text:'OK' },\
			Cancel:Button{bounds:[230,330,330,350] , text:'Cancel' },\
			Flatten:Checkbox{bounds:[240,200,340,221] , text:'Flatten Doc.' },\
			FileType:StaticText{bounds:[10,280,111,297] , text:'Output File Type' ,properties:{scrolling:undefined,multiline:undefined}},\
			outFile:DropDownList{bounds:[150,277,270,298]},\
					},\
			Bottom:Panel{bounds:[10,400,380,510] , text:'' ,properties:{borderStyle:'etched',su1PanelCoordinates:true},\
			ResizeCheck:Checkbox{bounds:[10,20,90,41] , text:'Resize to Fit' },\
			Width:EditText{bounds:[130,20,170,36] , text:'' ,properties:{multiline:false,noecho:false,readonly:false}},\
			WW:StaticText{bounds:[110,20,130,37] , text:'W:' ,properties:{scrolling:undefined,multiline:undefined}},\
			PX1:StaticText{bounds:[170,20,190,37] , text:'px' ,properties:{scrolling:undefined,multiline:undefined}},\
			HH:StaticText{bounds:[210,20,230,40] , text:'H:' ,properties:{scrolling:undefined,multiline:undefined}},\
			Height:EditText{bounds:[230,20,270,36] , text:'' ,properties:{multiline:false,noecho:false,readonly:false}},\
			PX2:StaticText{bounds:[270,20,290,37] , text:'px' ,properties:{scrolling:undefined,multiline:undefined}},\
			Action:Checkbox{bounds:[10,70,85,91] , text:'Run Action' },\
			ActionSet:DropDownList{bounds:[100,70,218,90]},\
			ActionName:DropDownList{bounds:[220,70,358,90]}\
		}\
};"

win = new Window(Dialog,"Photoshop PDF Processor");
win.center();

var BitOptions = []; 
BitOptions[0] = 8; 
BitOptions[1] = 16; 
var item;
for (var i=0,len=BitOptions.length;i<len;i++) {
	item = win.panel0.Bits.add ('item', "" + BitOptions[i]);      
} 
win.panel0.Bits.selection=0;

// Modes RGB - "RGBC"	CMYK - "ECMY"	LAB - "LbCl"	GREYSCALE - "Grys"
var openModes = [];
openModes[0] = "CMYK Color";
openModes[1] = "RGB Color";
openModes[2] = "Grayscale";
openModes[3] = "Lab Color";
for (var i=0,len=openModes.length;i<len;i++) {
	item = win.panel0.openMode.add ('item', "" + openModes[i]);      
}; 
win.panel0.openMode.selection=0;
var pageTypes = [];
pageTypes[0] = "First page only";
pageTypes[1] = "All pages";
pageTypes[2] = "Range of pages";
for (var i=0,len=pageTypes.length;i<len;i++) {
	item = win.panel0.processPages.add ('item', "" + pageTypes[i]);      
}; 
win.panel0.processPages.selection=0;
win.panel0.processPages.onChange = function(){
	if(parseInt(this.selection) == 2) ToFrom(true); else
		ToFrom(false);
	}
var fileFolder = [];
fileFolder[0] = "Single File";
fileFolder[1] = "Folder";
fileFolder[2] = "Folder and Sub-Folders";
for (var i=0,len=fileFolder.length;i<len;i++) {
	item = win.panel0.FileorFolder.add ('item', "" + fileFolder[i]);      
}; 
win.panel0.FileorFolder.selection=0;
var crops = [];
crops[0] = "Bounding Box";
crops[1] = "Media Box";
crops[2] = "Crop Box";
crops[3] = "Bleed Box";
crops[4] = "Trim Box";
crops[5] = "Art Box";
for (var i=0,len=crops.length;i<len;i++) {
	item = win.panel0.cropTo.add ('item', "" + crops[i]);      
}; 
win.panel0.cropTo.selection=0;
var fileOut = [];
fileOut[0] = "JPG"
fileOut[1] = "JPG SFW";
fileOut[2] = "PDF";
fileOut[3] = "TIF";
fileOut[4] = "PSD";
fileOut[5] = "EPS";
fileOut[6] = "GIF";
fileOut[7] = "BMP Windows OS";
fileOut[8] = "PNG 24";
for (var i=0,len=fileOut.length;i<len;i++) {
	item = win.panel0.outFile.add ('item', "" + fileOut[i]);      
}; 
win.panel0.outFile.selection=0;
win.panel0.outFile.onChange = function(){
	switch(parseInt(this.selection)){
		case 0 : win.panel0.Bits.selection = 0; break;
		case 1 : win.panel0.Bits.selection = 0; break;
		case 2 : break;
		case 3 : break;
		case 4 : break;
		case 5 : win.panel0.Bits.selection = 0;  break;
		case 6 : win.panel0.Bits.selection = 0; break;
		case 7 : win.panel0.Bits.selection = 0; break;
		case 8 : break;
		}
	}
var actionSets = new Array();
actionSets = getActionSets();
for (var i=0,len=actionSets.length;i<len;i++) {
	item = win.Bottom.ActionSet.add ('item', "" + actionSets[i]);      
}; 
win.Bottom.ActionSet.selection=0;
var actions = new Array();	
actions = getActions(actionSets[0]);
for (var i=0,len=actions.length;i<len;i++) {
	item = win.Bottom.ActionName.add ('item', "" + actions[i]);      
};
win.Bottom.ActionName.selection=0;
win.panel0.Path.enabled= false;

win.Bottom.ResizeCheck.onClick = function() {
var	realValue = win.Bottom.ResizeCheck.value;
	win.Bottom.Width.enabled =  realValue;
	win.Bottom.WW.enabled =  realValue;
	win.Bottom.PX1.enabled =  realValue;
	win.Bottom.Height.enabled =  realValue;
	win.Bottom.HH.enabled =  realValue;
	win.Bottom.PX2.enabled =  realValue;
	}  
win.Bottom.Action.onClick = function() {
var	RealValue = win.Bottom.Action.value;
var	resizeValue = win.Bottom.ResizeCheck.value;
	win.Bottom.ActionSet.enabled =  RealValue;
	win.Bottom.ActionName.enabled =  RealValue;
	} 
	 
win.Bottom.ActionSet.onChange = function() {
win.Bottom.ActionName.removeAll();
actions = getActions(actionSets[parseInt(this.selection)]);
for (var i=0,len=actions.length;i<len;i++) {
	item = win.Bottom.ActionName.add ('item', "" + actions[i]);      
};
win.Bottom.ActionName.selection=0;
}
win.panel0.FileorFolder.onChange = function() {
	switch(parseInt(this.selection)){
		case	0:
		win.panel0.SelFolder.text = "Select File";
		win.panel0.Path.text = "";
		break;
		case	1:
		win.panel0.SelFolder.text = "Select Folder";
		win.panel0.Path.text = "";
		break;
		case	2:
		win.panel0.SelFolder.text = "Select top level Folder";
		win.panel0.Path.text = "";	
	}
}

win.panel0.Browse.onClick = function() { 
	switch(parseInt(win.panel0.FileorFolder.selection)){
		case	0:
		var selectedFolder = File.openDialog("Please select PDF file.","PDF File:*.pdf"); 
		if(selectedFolder != null)
		win.panel0.Path.text =  decodeURI(selectedFolder.fsName); 
		FILEPATH = new File(decodeURI(selectedFolder.fsName));
		break;
		case	1:
		var selectedFolder = Folder.selectDialog( "Please select folder");
		if(selectedFolder != null)
		win.panel0.Path.text =  decodeURI(selectedFolder.fsName);
		FILEPATH = new Folder(decodeURI(selectedFolder.fsName));;
		break;
		case	2:
		var selectedFolder = Folder.selectDialog( "Please select top level folder"); 
		if(selectedFolder != null)
		win.panel0.Path.text =  decodeURI(selectedFolder.fsName); 
		FILEPATH = new Folder(decodeURI(selectedFolder.fsName));
		break;
	}
}

function ToFrom(Bool){
win.panel0.To.enabled = Bool;
win.panel0.From.enabled= Bool;
win.panel0.ToText.enabled= Bool;
win.panel0.FromText.enabled= Bool;
}

win.Bottom.ResizeCheck.onClick();
win.Bottom.Action.onClick();
ToFrom(false);

var done = false; 
    while (!done) { 
      var x = win.show(); 
      if (x == 0 || x == 2) {
        win.canceled = true;
        //alert("Maybe next time then?");
        done = true; 
      } else if (x == 1) { 
        done = true; 
       var result = valiDate();
        if(result != true) {
        	alert(result);
        	return;
        }else
        {
	while (documents.length) { 
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES); 
  }
        processFolder(FILEPATH);       
        }
      } 
   } 
}
main();

var MODE,TO, FROM,PAGENUMBER,BITS,RESOLUTION,SAVEAS,EXT,WIDTH,HEIGHT,ACTIONSET,ACTIONNAME,DOACTION,DORESIZE,FLATTEN;
var FILEPATH,CROPTO;

function valiDate(){
	DOACTION = false;
	DORESIZE = false;
	FLATTEN = win.panel0.Flatten.value;
var modes = ["ECMY","RGBC","Grys","LbCl"];
	MODE= modes[parseInt(win.panel0.openMode.selection)];
var bits = [8,16];
	BITS= bits[parseInt(win.panel0.Bits.selection)];

	RESOLUTION= parseInt(win.panel0.RES.text);
var cropTo = ["boundingBox","mediaBox","cropBox","bleedBox","trimBox","artBox"];
	CROPTO = cropTo[parseInt(win.panel0.cropTo.selection)];
	if(parseInt(win.panel0.processPages.selection) == 2){
	TO = parseInt(win.panel0.To.text);
	FROM = parseInt(win.panel0.From.text);
	if((TO < 1) || (FROM < 1))  return "Incorrect Range selection!";
	if(FROM > TO) return "Range From is GREATER than the To field!\n You are NOT Allowed to do this!";
	}
	if(win.Bottom.Action.value){
	ACTIONSET = win.Bottom.ActionSet.selection.text;
	ACTIONNAME = win.Bottom.ActionName.selection.text;
	DOACTION = true;
	}
if(win.Bottom.ResizeCheck.value){
	WIDTH = parseInt(win.Bottom.Width.text);
	HEIGHT= parseInt(win.Bottom.Height.text);
	if((isNaN(WIDTH)) || (WIDTH < 1)) return "Not a valid entry!\nResize Width MUST be greater than 1.";
	if((isNaN(HEIGHT)) || (HEIGHT < 1)) return "Not a valid entry!\nResize HEIGHT MUST be greater than 1.";
	DORESIZE = true;
	}
var	exts=[".jpg",".jpg",".pdf",".tif",".psd",".eps",".gif",".bmp",".png"];
	EXT = exts[parseInt(win.panel0.outFile.selection)];
	SAVEAS = parseInt(win.panel0.outFile.selection);
	switch(parseInt(win.panel0.outFile.selection)){
		case 0: BITS = 8; break;
		case 1: BITS = 8; break;
		case 2: break;
		case 3: break;
		case 4: break;
		case 5: BITS = 8; break;
		case 6: BITS = 8; MODE = modes[1]; break;
		case 7: BITS = 8; MODE = modes[1]; break;
		case 8:  MODE = modes[1]; break;
		}
	if(win.panel0.Path.text = null) return "No file or Folder has been selected";
	return true;
}

function SaveBMP(saveFile){
saveBMP = new BMPSaveOptions(); 
saveBMP.alphaChannels = false; 
saveBMP.depth = BMPDepthType.TWENTYFOUR; 
saveBMP.flipRowOrder = false; 
saveBMP.rleCompression = false; 
saveBMP.osType = OperatingSystem.WINDOWS; 
activeDocument.saveAs(saveFile, saveBMP, true, Extension.LOWERCASE); 
}
function SaveGIF(saveFile){
gifSaveOptions = new GIFSaveOptions(); 
gifSaveOptions.colors = 64; 
gifSaveOptions.dither = Dither.NONE; 
gifSaveOptions.matte = MatteType.NONE; 
gifSaveOptions.preserveExactColors = 0; 
gifSaveOptions.transparency = 0; 
gifSaveOptions.interlaced = 0; 
activeDocument.saveAs(saveFile, gifSaveOptions, true,Extension.LOWERCASE); 
}
function SaveJPEG(saveFile){
jpgSaveOptions = new JPEGSaveOptions()
jpgSaveOptions.embedColorProfile = true
jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE
jpgSaveOptions.matte = MatteType.NONE
jpgSaveOptions.quality = 8; //1-12
activeDocument.saveAs(saveFile, jpgSaveOptions, true,Extension.LOWERCASE)
}

function SaveForWeb(saveFile) {
var sfwOptions = new ExportOptionsSaveForWeb(); 
   sfwOptions.format = SaveDocumentType.JPEG; 
   sfwOptions.includeProfile = false; 
   sfwOptions.interlaced = 0; 
   sfwOptions.optimized = true; 
   sfwOptions.quality = 80; //0-100 
activeDocument.exportDocument(saveFile, ExportType.SAVEFORWEB, sfwOptions);
}
function SaveTIFF(saveFile){
tiffSaveOptions = new TiffSaveOptions(); 
tiffSaveOptions.embedColorProfile = true; 
tiffSaveOptions.alphaChannels = true; 
tiffSaveOptions.imageCompression = TIFFEncoding.TIFFLZW; 
activeDocument.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE); 
}
function SaveEPS(saveFile){
epsSaveOptions = new EPSSaveOptions(); 
epsSaveOptions.encoding = SaveEncoding.JPEGHIGH; 
activeDocument.saveAs(saveFile,epsSaveOptions, true,Extension.LOWERCASE); 
}
function SavePNG(saveFile){
    pngSaveOptions = new PNGSaveOptions(); 
    pngSaveOptions.embedColorProfile = true; 
    pngSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE; 
    pngSaveOptions.matte = MatteType.NONE; 
    pngSaveOptions.quality = 1; 
	pngSaveOptions.PNG8 = false; //24 bit PNG
    pngSaveOptions.transparency = true; 
activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE); 
}
function SavePSD(saveFile){ 
psdSaveOptions = new PhotoshopSaveOptions(); 
psdSaveOptions.embedColorProfile = true; 
psdSaveOptions.alphaChannels = true;  
activeDocument.saveAs(saveFile, psdSaveOptions, true, Extension.LOWERCASE); 
}
function SavePDF(saveFile){ 
pdfSaveOptions = new PDFSaveOptions(); 
activeDocument.saveAs(saveFile, pdfSaveOptions, true, Extension.LOWERCASE); 
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
    throw "Action set must be specified";
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

function FitImage( inWidth, inHeight ) {
	var desc = new ActionDescriptor();
	var unitPixels = charIDToTypeID( '#Pxl' );
	desc.putUnitDouble( charIDToTypeID( 'Wdth' ), unitPixels, inWidth );
	desc.putUnitDouble( charIDToTypeID( 'Hght' ), unitPixels, inHeight );
	var runtimeEventID = stringIDToTypeID( "3caa3434-cb67-11d1-bc43-0060b0a13dc4" );	
	executeAction( runtimeEventID, desc, DialogModes.NO );
}
function rasterizePDF( pageNumber,res,mode,BitDepth,cropto,pdfFile){
    var desc = new ActionDescriptor(); 
        var optionsDesc = new ActionDescriptor(); 
        optionsDesc.putString( charIDToTypeID( "Nm  " ), "rasterized page" ); 
        optionsDesc.putEnumerated( charIDToTypeID( "Crop" ), stringIDToTypeID( "cropTo" ), stringIDToTypeID( cropto ) ); 
        optionsDesc.putUnitDouble( charIDToTypeID( "Rslt" ), charIDToTypeID( "#Rsl" ), res); 
        optionsDesc.putEnumerated( charIDToTypeID( "Md  " ), charIDToTypeID( "ClrS" ), charIDToTypeID( mode ) );
        optionsDesc.putInteger( charIDToTypeID( "Dpth" ), BitDepth ); 
        optionsDesc.putBoolean( charIDToTypeID( "AntA" ), true ); 
        optionsDesc.putBoolean( stringIDToTypeID( "suppressWarnings" ), false ); 
        optionsDesc.putEnumerated( charIDToTypeID( "fsel" ), stringIDToTypeID( "pdfSelection" ), stringIDToTypeID( "page"  )); 
        optionsDesc.putInteger( charIDToTypeID( "PgNm" ), pageNumber ); 
    desc.putObject( charIDToTypeID( "As  " ), charIDToTypeID( "PDFG" ), optionsDesc ); 
    desc.putPath( charIDToTypeID( "null" ), pdfFile ); 
executeAction( charIDToTypeID( "Opn " ), desc, DialogModes.NO ); 
}; 
function SaveFileType(num,saveFile){
	switch (num){
		case 0: SaveJPEG(saveFile); break;
		case 1: SaveForWeb(saveFile); break;
		case 2: SavePDF(saveFile); break;
		case 3: SaveTIFF(saveFile); break;
		case 4: SavePSD(saveFile); break;
		case 5: SaveEPS(saveFile); break;
		case 6: SaveGIF(saveFile); break;
		case 7: SaveBMP(saveFile); break;
		case 8: SavePNG(saveFile); break;
		default: break;
		}
	}
function processFolder(folder) {  
	var fileList = new Array;
	if(folder instanceof Folder) 	 fileList = folder.getFiles(); else
fileList[0] = FILEPATH;

     for (var i = 0; i < fileList.length; i++) { var file = fileList[i];   		 
		 if (file instanceof File && file.name.match(/\.pdf$/i)) {   		

var StartPage=1;
var TotalPages=2;

	switch (parseInt(win.panel0.processPages.selection)){
		case 0: TotalPages=2;  break;
		case 1: TotalPages = 6000; break;
		case 2: StartPage = FROM; TotalPages = TO+1; break;
		}

		for(var k =StartPage;k<TotalPages;k++){ 
     rasterizePDF( k,RESOLUTION,MODE,BITS,CROPTO, file); //Page Number, Resolution,Mode, BitDepth,CropTo,File
  if(app.documents.length == 0) break; 	//loop passed the number of pages 
    // code to process page 
	  if(app.documents.length > 0){
			 app.displayDialogs = DialogModes.NO;
			 var doc = app.activeDocument;  			 
			 var strtRulerUnits = app.preferences.rulerUnits;   			 
			 var strtTypeUnits = app.preferences.typeUnits;   			 
			 app.preferences.rulerUnits = Units.PIXELS;   			 
			 app.preferences.typeUnits = TypeUnits.PIXELS;  
	var saveFile = new File(decodeURI(file.fsName.slice(0,-4) +"-Page" + k + EXT));
			if(DORESIZE) FitImage( WIDTH, HEIGHT );  	
			if(DOACTION) doAction(ACTIONNAME, ACTIONSET);
			if(FLATTEN) app.activeDocument.flatten();
	 SaveFileType(SAVEAS,saveFile);
	app.activeDocument.close(SaveOptions.DONOTSAVECHANGES); 
	 app.preferences.rulerUnits = strtRulerUnits;  
	 app.preferences.typeUnits = strtTypeUnits;
	}
}
			 } else  
if (file instanceof Folder) {  
	if(parseInt(win.panel0.FileorFolder.selection) == 2){
       processFolder(file);  
	   }
     }  
   }  
}  