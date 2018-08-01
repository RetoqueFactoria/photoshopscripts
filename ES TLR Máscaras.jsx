// TLR Professional Mask Toolkit for CS3.jsx
// TLR Professional Mask Toolkit, Version 3.0c (RC 1.2)
// (c) 2006, The Light's Right Studio, All Rights Reserved.
// http://www.thelightsrightstudio.com

// You may use this code freely for your own personal or professional use. You may not copy, upload, transmit,
// sell, or share this code in any way without the express permission of the author.


// Enable double clicking from the Macintosh Finder or the Windows Explorer

// ============================================================================
// Traducción: Juan Manuel Díaz
// Sitio Web: http://www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com
// ============================================================================

#target photoshop

// If file was double-clicked
app.bringToFront();

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
// $.level = 1;
// debugger;

//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// Include module for defining user preferences
// #include 'TLR Professional Mask Toolkit for CS2 Preferences.jsxinc'

// Placement of the script's dialog window
const xoffset = 250;
const yoffset = 250;

// Turn off UI for batch processing
const suppressUI = false;

// Automatically replace masks
const autoMaskReplace = false;

// Constants for Mask Names
const maskLuminosityEdgeExtraNarrow = 'Luminosidad de Borde Extra Fino';
const maskLuminosityEdgeNarrow = 'Luminosidad de Borde Fino';
const maskLuminosityEdgeMedium = 'Luminosidad de Borde Medio';
const maskLuminosityEdgeWide = 'Luminosidad de Borde Ancho';
const maskEnhancedEdgeExtraNarrow = 'Borde Mejorado Extra Fino';
const maskEnhancedEdgeNarrow = 'Borde Mejorado Fino';
const maskEnhancedEdgeMedium = 'Borde Mejorado Medio';
const maskEnhancedEdgeWide = 'Borde Mejorado Ancho';
const maskLuminositySurfaceExtraNarrow = 'Luminosidad de Superficie Extra Fina';
const maskLuminositySurfaceNarrow = 'Luminosidad de Superficie Fina';
const maskLuminositySurfaceMedium = 'Luminosidad de Superficie Media';
const maskLuminositySurfaceWide = 'Luminosidad de Superficie Ancha';
const maskEnhancedSurfaceExtraNarrow = 'Superficie Mejorada Extra Fina';
const maskEnhancedSurfaceNarrow = 'Superficie Mejorada Fina';
const maskEnhancedSurfaceMedium = 'Superficie Mejorada Media';
const maskEnhancedSurfaceWide = 'Superficie Mejorada Ancha';

// Constants for Mask Type
const maskTypeAll = 'Todos';
const maskTypeEdge = 'Borde';
const maskTypeSurface = 'Superficie';
const maskTypeBoth = 'Ambos';

// Constants for Mask Width
const maskWidthExtraNarrow = 'Extra Fino';
const maskWidthNarrow = 'Fino';
const maskWidthMedium = 'Medio';
const maskWidthWide = 'Ancho';

// Constants for Tone Range
const toneRangeAll = 'Todos';
const toneRangeHighlights = 'Iluminaciones';
const toneRangeMidtones = 'Mediostonos';
const toneRangeShadows = 'Sombras';

// Constants for Color Range
const colorRangeAll = 'Todos';
const colorRangeReds = 'Rojos';
const colorRangeGreens = 'Verdes';
const colorRangeBlues = 'Azules';
const colorRangeCyans = 'Cianes';
const colorRangeMagentas = 'Magentas';
const colorRangeYellows = 'Amarillos';
const colorRangeFoilage = 'Follage';
const colorRangeSkintones = 'Tonos Piel';
const colorRangeSky = 'Cielo';

// Constants for User Interface Defaults
const maskTypeDefault = maskTypeEdge;
const maskWidthDefault = maskWidthMedium;
const toneRangeDefault = toneRangeAll;
const colorRangeDefault = colorRangeAll;
const enhancedMaskDefault = false;
const expertModeDefault = false;

// Constants for UI Strings
const strMaskType = 'Tipo de Mascara: ';
const strMaskWidth = 'Ancho de Mascara:';
const strToneRange = 'Rango Tonal:';
const strColorRange = 'Rango de Color:';
const strGenerateEnhancedMask = 'Mascara Mejorada?';
const strUseExpertMode = 'Experto?    ';
const strCancelButton = 'CANCELAR';
const strOKButton = 'OK';
const strMaskExists = 'La mascara ya existe';
const strReplaceMask = ' ya existe una mascara. Reemplazar?';
const strNoActiveDocument = 'No hay Documentos Activos Seleccionados.';
const strNoBackgroundLayer = 'El Documento Activo no tiene una verdadera Capa de Fondo.';
const strAllowedDocumentTypes = 'El Documento Activo debe estar en Modo RGB, CMYK, L*a*b, o Escala de Grices.';
const strLayerInsideLayerSet = 'El Documento Activo no puede estar dentro de un Grupo. Por favor cierra el Grupo antes de proceder.';
const strLayerIsLayerSet = 'La Capa Activa no puede estar dentro de un Grupo Abierto. Por favor cierra el Grupo antes de proceder.';
const strErrorMsgPart1 = 'Un error JavaScript inesperado ha ocurrido en ';
const strErrorMsgPart2 = '. Mensaje = ';
const strNothingToMask = 'No hay nada para enmascarar';
const strAdjustMaskWithCurves = 'Ajusta el Contraste de la Mascara usando Curvas.';
const strAdjustMaskWithMaximum = 'Ajusta el Ancho de la mascara utilizando el Filtro Maxima.';
const strAdjustMaskWithMedian = 'Ajusta el Ancho de la Mascara utilizando el Filtro Mediana.';
const strAdjustMaskWithGaussianBlur = 'Suaviza los Bordes de la Mascara con Desenfoque Gaussiano.';


//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// Include module for user interface
// #include 'TLR Professional Mask Toolkit for CS2 User Interface.jsxinc'

function createUI()
{
	// Create an empty dialog window near the center of the screen
	var dlg = new Window('dialog', 'TLR GENERADOR DE MASCARAS');
	dlg.frameLocation = [xoffset, yoffset];
	dlg.spacing = 5;

	// Place static text labels at top of dialog window
	dlg.header1 = dlg.add('statictext', undefined, 'TLR GENERADOR DE MASCARAS');
	dlg.header2 = dlg.add('statictext', undefined, '');
	dlg.header3 = dlg.add('statictext', undefined, 'Version 3.0c - RC 1.2');
	dlg.spacer1 = dlg.add('statictext', undefined, '');
		
	// Add a panel
	dlg.maskPnl = dlg.add('panel', undefined, '');
	dlg.maskPnl.orientation = 'column';
	dlg.maskPnl.alignChildren = 'left';
	
	// Add controls to the panel
	with (dlg.maskPnl) {
		MaskType = dlg.maskPnl.add('group');
			MaskType.lblMaskType = MaskType.add('statictext', undefined, strMaskType);
			MaskType.lblMaskType.preferredSize = [115,15];
			MaskType.ddlMaskType = MaskType.add('dropdownlist', undefined, [maskTypeAll, maskTypeEdge, maskTypeSurface, maskTypeBoth]);
		MaskWidth = dlg.maskPnl.add('group');
			MaskWidth.lblMaskWidth = MaskWidth.add('statictext', undefined, strMaskWidth);
			MaskWidth.lblMaskWidth.preferredSize = [115,15];
			MaskWidth.ddlMaskWidth = MaskWidth.add('dropdownlist', undefined, [maskWidthExtraNarrow, maskWidthNarrow, maskWidthMedium, maskWidthWide]);
		ToneRange = dlg.maskPnl.add('group');
			ToneRange.lblToneRange = ToneRange.add('statictext', undefined, strToneRange);
			ToneRange.lblToneRange.preferredSize = [115,15];
			ToneRange.ddlToneRange = ToneRange.add('dropdownlist', undefined, [toneRangeAll, toneRangeHighlights, toneRangeMidtones, toneRangeShadows]);
		ColorRange = dlg.maskPnl.add('group');
			ColorRange.lblColorRange = ColorRange.add('statictext', undefined, strColorRange);
			ColorRange.lblColorRange.preferredSize = [115,15];
			ColorRange.ddlColorRange = ColorRange.add('dropdownlist', undefined, [colorRangeAll, colorRangeReds, colorRangeGreens,
																				  colorRangeBlues, colorRangeCyans, colorRangeMagentas,
																				  colorRangeYellows, colorRangeFoilage, colorRangeSkintones,
																				  colorRangeSky]);
		EnhancedMask = dlg.maskPnl.add('group');
			EnhancedMask.lblEnhancedMask = EnhancedMask.add('statictext', undefined, strGenerateEnhancedMask);
			EnhancedMask.lblEnhancedMask.preferredSize = [145,15];
			EnhancedMask.cbEnhancedMask = EnhancedMask.add('checkbox', undefined, '');
		ExpertMode = dlg.maskPnl.add('group');
			ExpertMode.lblExpertMode = ExpertMode.add('statictext', undefined, strUseExpertMode);
			ExpertMode.lblExpertMode.preferredSize = [145,15];
			ExpertMode.cbExpertMode = ExpertMode.add('checkbox', undefined, '');
	}
	
	// Add a panel for command buttons
	dlg.spacer2 = dlg.add('statictext', undefined, '');
	dlg.btnPnl = dlg.add('panel', undefined, '');
	dlg.btnPnl.orientation = 'row';
	
	// Add buttons to the panel
	dlg.btnPnl.cancelBtn = dlg.btnPnl.add('button', undefined, strCancelButton, {name:'cancel'});
	dlg.btnPnl.OKBtn = dlg.btnPnl.add('button', undefined, strOKButton, {name:'ok'});

	// Place static text labels at bottom of dialog window	
	dlg.spacer3 = dlg.add('statictext', undefined, '');
	dlg.footer1 = dlg.add('statictext', undefined, "(c) 2006, The Light's Right Studio");
	dlg.footer2 = dlg.add('statictext', undefined, ' ');
	
	return dlg;	
}


function initializeUI(ui)
{
	var moduleName = 'initializeUI';

	try {	
	
		with (ui.maskPnl) {

			switch (maskTypeDefault) {
				case     maskTypeAll: MaskType.ddlMaskType.selection = 0; break;
				case    maskTypeEdge: MaskType.ddlMaskType.selection = 1; break;
				case maskTypeSurface: MaskType.ddlMaskType.selection = 2; break;
				case    maskTypeBoth: MaskType.ddlMaskType.selection = 3;		
			}

			switch (maskWidthDefault) {
				case maskWidthExtraNarrow: MaskWidth.ddlMaskWidth.selection = 0; break;
				case      maskWidthNarrow: MaskWidth.ddlMaskWidth.selection = 1; break;
				case      maskWidthMedium: MaskWidth.ddlMaskWidth.selection = 2; break;
				case        maskWidthWide: MaskWidth.ddlMaskWidth.selection = 3;		
			}

			switch (toneRangeDefault) {
				case     toneRangeAll: ToneRange.ddlToneRange.selection = 0; break;
				case     toneRangeHighlights: ToneRange.ddlToneRange.selection = 1; break;
				case     toneRangeMidtones: ToneRange.ddlToneRange.selection = 2; break;
				case     toneRangeShadows: ToneRange.ddlToneRange.selection = 3;
			}

			switch (colorRangeDefault) {
				case           colorRangeAll: ColorRange.ddlColorRange.selection = 0; break;
				case          colorRangeReds: ColorRange.ddlColorRange.selection = 1; break;
				case        colorRangeGreens: ColorRange.ddlColorRange.selection = 2; break;
				case         colorRangeBlues: ColorRange.ddlColorRange.selection = 3; break;
				case         colorRangeCyans: ColorRange.ddlColorRange.selection = 4; break;
				case      colorRangeMagentas: ColorRange.ddlColorRange.selection = 5; break;
				case       colorRangeYellows: ColorRange.ddlColorRange.selection = 6; break;
				case       colorRangeFoilage: ColorRange.ddlColorRange.selection = 7; break;
				case     colorRangeSkintones: ColorRange.ddlColorRange.selection = 8; break;
				case           colorRangeSky: ColorRange.ddlColorRange.selection = 9;
			}


			EnhancedMask.cbEnhancedMask.value = enhancedMaskDefault;
			ExpertMode.cbExpertMode.value = expertModeDefault;
			
			if (app.activeDocument.mode == DocumentMode.BITMAP) EnhancedMask.cbEnhancedMask.enabled = false;
			
			MaskType.ddlMaskType.onChange = function() {
				if (MaskType.ddlMaskType.selection == 0) {
					MaskWidth.enabled = false;
					EnhancedMask.cbEnhancedMask.enabled = false;
				}
				else {
					MaskWidth.enabled = true;
					if (app.activeDocument.mode == DocumentMode.BITMAP) EnhancedMask.cbEnhancedMask.enabled = false;
					else EnhancedMask.cbEnhancedMask.enabled = true;
				}
			};
		}
	
		with (ui.btnPnl) {
			cancelBtn.onClick = function() {ui.close(0);};
			OKBtn.onClick = 
				function(){
					var paramArray = new Array();
					paramArray = parseDialog(ui);
					generateMask(paramArray);
					ui.close(2);
				};
		}
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function parseDialog(ui)
{
	var moduleName = 'parseDialog';

	try
	{
		var maskType = '';
		var maskWidth = '';
		var toneRange = '';
		var colorRange = '';
		var enhancedMask = false;
		var expertMode = false;	
		var retainEdgeMask = false;
		var retainSurfaceMask = false;
		var retainToneMask = false;
		var retainColorMask = false;
		var retainToneColorMask = false;

		with (ui.maskPnl) {	
			var maskType = MaskType.ddlMaskType.selection.toString();
			var maskWidth = MaskWidth.ddlMaskWidth.selection.toString();
			var toneRange = ToneRange.ddlToneRange.selection.toString();
			var colorRange = ColorRange.ddlColorRange.selection.toString();
			var enhancedMask = EnhancedMask.cbEnhancedMask.value;
			var expertMode = ExpertMode.cbExpertMode.value;	
		}
		
		paramArray = [maskType, maskWidth, toneRange, colorRange,
					  enhancedMask, expertMode, retainEdgeMask,
					  retainSurfaceMask, retainToneMask, retainColorMask,
					  retainToneColorMask];
					  
		return paramArray;					  
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// Include module for defining user preferences
// #include 'TLR Professional Mask Toolkit for CS2 Masking Module.jsxinc'

// Generate masks based on parameters passed in paramArray
// paramArray = [maskType, maskWidth, toneRange, colorRange,
//				 enhancedMask, expertMode];
function generateMask(paramArray)
{
	var moduleName = 'generateMask';

	try
	{	
		var maskType = paramArray[0];
		var toneRange = paramArray[2];
		var colorRange = paramArray[3];
		var enhancedMask = paramArray[4];
		
		if ((maskType == maskTypeAll) && (toneRange == toneRangeAll) && (colorRange == colorRangeAll)) {
			alert(strNothingToMask);
			ui.close(2);		
		}

		if (maskType == maskTypeEdge || maskType == maskTypeBoth) {
			if (enhancedMask == false) generateEdgeMask(paramArray);
			else {
				generateEnhancedEdgeMask(paramArray);
			}
		}
		if (maskType == maskTypeSurface || maskType == maskTypeBoth) {
			if (enhancedMask == false) generateSurfaceMask(paramArray);
			else {
				generateEnhancedSurfaceMask(paramArray);
			}
		}
		if (toneRange != toneRangeAll) generateToneRangeMask(paramArray);
		if (colorRange != colorRangeAll) generateColorRangeMask(paramArray);
	
		var masksNeeded = 0;
		if (maskType == maskTypeEdge || maskType == maskTypeSurface) masksNeeded += 1;
		if (maskType == maskTypeBoth) masksNeeded += 1;
		if (toneRange != toneRangeAll) masksNeeded += 1;
		if (colorRange != colorRangeAll)  masksNeeded += 1;
		
		if (masksNeeded > 1) mergeMasks(paramArray);
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function generateEdgeMask(paramArray)
{
	var moduleName = 'generateEdgeMask';

	try
	{	
		var docRef = app.activeDocument;
	
		var maskWidth = paramArray[1];
		var expertMode = paramArray[5];
		var retainEdgeMask = paramArray[6];
		
		// Check for existing mask
		switch (maskWidth) {
			case maskWidthExtraNarrow: if (checkMaskExists(maskLuminosityEdgeExtraNarrow)) {paramArray[6] = true; return;} break;
			case      maskWidthNarrow: if (checkMaskExists(maskLuminosityEdgeNarrow)) {paramArray[6] = true; return;} break;
			case      maskWidthMedium: if (checkMaskExists(maskLuminosityEdgeMedium)) {paramArray[6] = true; return;} break;
			case        maskWidthWide: if (checkMaskExists(maskLuminosityEdgeWide)) {paramArray[6] = true; return;}		
		}

		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Make a duplicate of the current document
		var dupRef = docRef.duplicate();
			
		// Set properties for duplicate to conserve resources
		dupRef.name = 'Duplicate';
		dupRef.bitsPerChannel = BitsPerChannelType.EIGHT;
		dupRef.flatten();
		dupRef.changeMode(ChangeMode.GRAYSCALE);
		
		// Turn On Dialogs, If Expert Mode
		if (expertMode == true) app.displayDialogs = DialogModes.ALL;
		
		if (expertMode == true) alert(strAdjustMaskWithGaussianBlur);
		
		// Apply Gaussian Blur to duplicate image for Wide and Medium mask widths
		switch (maskWidth) {
			case maskWidthExtraNarrow: break;
			case      maskWidthNarrow: break;
			case      maskWidthMedium: dupRef.activeLayer.applyGaussianBlur(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyGaussianBlur(3.0);		
		}
		
		// Run the Find Edges filter
		applyFindEdges();

		// Invert layer
		dupRef.activeLayer.invert();

		if (expertMode == true) alert(strAdjustMaskWithCurves);
		
		// Make Curves adjustment to the layer
		var curvesShape = new Array(Array(20,0),
									Array(60,120),
									Array(90,180),
									Array(145,225),
									Array(255,255));
		dupRef.activeLayer.adjustCurves(curvesShape);
	
		if ((expertMode == true) && (maskWidth != maskWidthExtraNarrow) && (maskWidth != maskWidthNarrow)) alert(strAdjustMaskWithMaximum);
					
		// Apply Maximum filter
		switch (maskWidth) {
			case maskWidthExtraNarrow: break;
			case      maskWidthNarrow: break;
			case      maskWidthMedium: dupRef.activeLayer.applyMaximum(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyMaximum(2.0);		
		}
	
		if ((expertMode == true) && (maskWidth != maskWidthExtraNarrow) && (maskWidth != maskWidthNarrow)) alert(strAdjustMaskWithMedian);
					
		// Apply Median filter
		switch (maskWidth) {
			case maskWidthExtraNarrow: break;
			case      maskWidthNarrow: break;
			case      maskWidthMedium: dupRef.activeLayer.applyMedianNoise(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyMedianNoise(2.0);		
		}
	
		if (expertMode == true) alert(strAdjustMaskWithGaussianBlur);
		
		// Apply Gaussian Blur filter
		switch (maskWidth) {
			case maskWidthExtraNarrow: dupRef.activeLayer.applyGaussianBlur(0.1); break;
			case      maskWidthNarrow: dupRef.activeLayer.applyGaussianBlur(0.5); break;
			case      maskWidthMedium: dupRef.activeLayer.applyGaussianBlur(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyGaussianBlur(2.0);		
		}
	
		// Turn Off Dialogs, If Expert Mode
		if (expertMode == true) app.displayDialogs = DialogModes.NO;
		
		// Apply AutoLevels to Mask
		dupRef.activeLayer.autoLevels();
		
		// Duplicate channel and rename
		dupRef.activeChannels[0].duplicate(dupRef);
		switch (maskWidth) {
			case maskWidthExtraNarrow: dupRef.activeChannels[0].name = maskLuminosityEdgeExtraNarrow; break;
			case      maskWidthNarrow: dupRef.activeChannels[0].name = maskLuminosityEdgeNarrow; break;
			case      maskWidthMedium: dupRef.activeChannels[0].name = maskLuminosityEdgeMedium; break;
			case        maskWidthWide: dupRef.activeChannels[0].name = maskLuminosityEdgeWide;		
		}
		
		// Duplicate channel to original document
		dupRef.activeChannels[0].duplicate(docRef);
		
		// Close duplicate
		dupRef.close(SaveOptions.DONOTSAVECHANGES);		
		
		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Refresh app
		app.refresh();

		// Restore Channels palette
		docRef.activeChannels = docRef.componentChannels;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function generateEnhancedEdgeMask(paramArray)
{
	var moduleName = 'generateEnhancedEdgeMask';

	try
	{
		var docRef = app.activeDocument;
	
		var maskWidth = paramArray[1];
		var expertMode = paramArray[5];
		var retainEdgeMask = paramArray[6];
		
		// Check for existing enhanced edge mask
		switch (maskWidth) {
			case maskWidthExtraNarrow: if (checkMaskExists(maskEnhancedEdgeExtraNarrow)) {paramArray[6] = true; return;} break;
			case      maskWidthNarrow: if (checkMaskExists(maskEnhancedEdgeNarrow)) {paramArray[6] = true; return;} break;
			case      maskWidthMedium: if (checkMaskExists(maskEnhancedEdgeMedium)) {paramArray[6] = true; return;} break;
			case        maskWidthWide: if (checkMaskExists(maskEnhancedEdgeWide)) {paramArray[6] = true; return;}		
		}

		generateEdgeMask(paramArray);

		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Make a duplicate of the current document
		var dupRef = docRef.duplicate();
		
		// Set properties for duplicate to conserve resources
		dupRef.name = 'Duplicate';
		dupRef.bitsPerChannel = BitsPerChannelType.EIGHT;
		dupRef.flatten();
		
		// Make a new Merge Visible layer
		mergeAllVisible();
		
		// Set properties for new layer
		setLayerProperties('Color', 'Gray');
	
		// Duplicate active layer
		// Internationalized version
		dupRef.activeLayer.copy();
		dupRef.paste();
		setLayerProperties('Color copy', 'Gray');
		
		// Select "Color" layer
		dupRef.activeLayer = dupRef.layers['Color'];
		
		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Select All
		dupRef.selection.selectAll();
	
		// Store Foreground Color
		foregroundColor = app.foregroundColor;
	
		// Set Foreground Color to 50% Gray
		var colorRef = new SolidColor();
		var gray50 = new GrayColor();
		gray50.gray = 50;
		colorRef.gray = gray50;
		app.foregroundColor = colorRef;
	
		// Fill Layer with Foreground Color
		dupRef.selection.fill(colorRef);	
	
		// Reset Color Swatches
		app.foregroundColor = foregroundColor;
	
		// Select "Color copy" layer
		dupRef.activeLayer = dupRef.layers['Color copy'];
	
		// Set Blend Mode to Color
		dupRef.activeLayer.blendMode = BlendMode.COLORBLEND;
		
		// Merge Layers
		dupRef.activeLayer.merge();
	
		// Duplicate active layer
		// Internationalized version
		dupRef.activeLayer.copy();
		dupRef.paste();
		setLayerProperties('Color copy', 'Gray');
	
		// Select "Color copy" layer
		dupRef.activeLayer = dupRef.layers['Color copy'];
	
		// Set Blend Mode to Luminosity
		dupRef.activeLayer.blendMode = BlendMode.LUMINOSITY;
	
		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Turn On Dialogs, If Expert Mode
		if (expertMode == true) app.displayDialogs = DialogModes.ALL;
		
		if (expertMode == true) alert(strAdjustMaskWithGaussianBlur);
		
		// Apply Gaussian Blur to duplicate image for Wide and Medium mask widths
		switch (maskWidth) {
			case maskWidthExtraNarrow: break;
			case      maskWidthNarrow: break;
			case      maskWidthMedium: dupRef.activeLayer.applyGaussianBlur(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyGaussianBlur(3.0);		
		}
		
		// Run the Find Edges filter
		applyFindEdges();
	
		// Invert layer
		dupRef.activeLayer.invert();
	
		// Set Blend Mode to Normal
		dupRef.activeLayer.blendMode = BlendMode.NORMAL;
	
		// Desaturate
		dupRef.activeLayer.desaturate();
	
		if (expertMode == true) alert(strAdjustMaskWithCurves);
		
		// Make Curves adjustment to the layer
		var curvesShape = new Array(Array(0,0),
									Array(40,150),
									Array(100,215),
									Array(150,230),
									Array(255,255));
		dupRef.activeLayer.adjustCurves(curvesShape);
	
		if ((expertMode == true) && (maskWidth != maskWidthExtraNarrow) && (maskWidth != maskWidthNarrow)) alert(strAdjustMaskWithMaximum);
					
		// Apply Maximum filter
		switch (maskWidth) {
			case maskWidthExtraNarrow: break;
			case      maskWidthNarrow: break;
			case      maskWidthMedium: dupRef.activeLayer.applyMaximum(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyMaximum(2.0);		
		}
	
		if ((expertMode == true) && (maskWidth != maskWidthExtraNarrow) && (maskWidth != maskWidthNarrow)) alert(strAdjustMaskWithMedian);
					
		// Apply Median filter
		switch (maskWidth) {
			case maskWidthExtraNarrow: break;
			case      maskWidthNarrow: break;
			case      maskWidthMedium: dupRef.activeLayer.applyMedianNoise(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyMedianNoise(2.0);		
		}
	
		if (expertMode == true) alert(strAdjustMaskWithGaussianBlur);
		
		// Apply Gaussian Blur filter
		switch (maskWidth) {
			case maskWidthExtraNarrow: dupRef.activeLayer.applyGaussianBlur(0.1); break;
			case      maskWidthNarrow: dupRef.activeLayer.applyGaussianBlur(0.5); break;
			case      maskWidthMedium: dupRef.activeLayer.applyGaussianBlur(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyGaussianBlur(2.0);		
		}
	
		// Turn Off Dialogs
		app.displayDialogs = DialogModes.NO;
	
		// Merge Layers
		dupRef.activeLayer.merge();
		
		// Convert to grayscale
		dupRef.changeMode(ChangeMode.GRAYSCALE);
		
		// Copy layer to alpha channel
		dupRef.activeChannels[0].duplicate(dupRef);
		dupRef.activeChannels[0].name = 'Color Edge Mask';
		
		// Duplicate channel to original document
		dupRef.activeChannels[0].duplicate(docRef);
		
		// Close duplicate
		dupRef.close(SaveOptions.DONOTSAVECHANGES);		

		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Name for Luminosity Edge Mask
		switch (maskWidth) {
			case maskWidthExtraNarrow: luminosityChannelName = maskLuminosityEdgeExtraNarrow; break;
			case      maskWidthNarrow: luminosityChannelName = maskLuminosityEdgeNarrow; break;
			case      maskWidthMedium: luminosityChannelName = maskLuminosityEdgeMedium; break;
			case        maskWidthWide: luminosityChannelName = maskLuminosityEdgeWide;		
		}
		
		// Combine channels using Calculations
		// =======================================================
		var id276 = charIDToTypeID( "Mk  " );
	    var desc81 = new ActionDescriptor();
	    var id277 = charIDToTypeID( "Nw  " );
 	    var id278 = charIDToTypeID( "Chnl" );
  	  		desc81.putClass( id277, id278 );
    	var id279 = charIDToTypeID( "Usng" );
        var desc82 = new ActionDescriptor();
        var id280 = charIDToTypeID( "T   " );
        var ref55 = new ActionReference();
        var id281 = charIDToTypeID( "Chnl" );
            ref55.putName( id281, luminosityChannelName );
        	desc82.putReference( id280, ref55 );
        var id282 = charIDToTypeID( "Clcl" );
        var id283 = charIDToTypeID( "Clcn" );
        var id284 = charIDToTypeID( "Scrn" );
        	desc82.putEnumerated( id282, id283, id284 );
        var id285 = charIDToTypeID( "Src2" );
        var ref56 = new ActionReference();
        var id286 = charIDToTypeID( "Chnl" );
            ref56.putName( id286, "Color Edge Mask" );
        	desc82.putReference( id285, ref56 );
    	var id287 = charIDToTypeID( "Clcl" );
    		desc81.putObject( id279, id287, desc82 );
   		executeAction( id276, desc81, DialogModes.NO );
		// =======================================================

		// Rename channel
		switch (maskWidth) {
			case maskWidthExtraNarrow: docRef.activeChannels[0].name = maskEnhancedEdgeExtraNarrow; break;
			case      maskWidthNarrow: docRef.activeChannels[0].name = maskEnhancedEdgeNarrow; break;
			case      maskWidthMedium: docRef.activeChannels[0].name = maskEnhancedEdgeMedium; break;
			case        maskWidthWide: docRef.activeChannels[0].name = maskEnhancedEdgeWide;		
		}

		// Delete temporary masks
		if (paramArray[6] == false) {
			maskChannel = docRef.channels.getByName(luminosityChannelName);
			maskChannel.remove();
		}
		maskChannel = docRef.channels.getByName('Color Edge Mask');
		maskChannel.remove();
		
		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Refresh app
		app.refresh();

		// Restore Channels palette
		docRef.activeChannels = docRef.componentChannels;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function generateSurfaceMask(paramArray)
{
	var moduleName = 'generateSurfaceMask';

	try
	{	
		var docRef = app.activeDocument;
	
		var maskWidth = paramArray[1];
		var expertMode = paramArray[5];
		var retainSurfaceMask = paramArray[7];

		// Check for existing mask
		switch (maskWidth) {
			case maskWidthExtraNarrow: if (checkMaskExists(maskLuminositySurfaceExtraNarrow)) {paramArray[7] = true; return;} break;
			case      maskWidthNarrow: if (checkMaskExists(maskLuminositySurfaceNarrow)) {paramArray[7] = true; return;} break;
			case      maskWidthMedium: if (checkMaskExists(maskLuminositySurfaceMedium)) {paramArray[7] = true; return;} break;
			case        maskWidthWide: if (checkMaskExists(maskLuminositySurfaceWide)) {paramArray[7] = true; return;}		
		}

		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Make a duplicate of the current document
		var dupRef = docRef.duplicate();
		
		// Set properties for duplicate to conserve resources
		dupRef.name = 'Duplicate';
		dupRef.bitsPerChannel = BitsPerChannelType.EIGHT;
		dupRef.flatten();
		dupRef.changeMode(ChangeMode.GRAYSCALE);
		
		// Turn On Dialogs, If Expert Mode
		if (expertMode == true) app.displayDialogs = DialogModes.ALL;
		
		if (expertMode == true) alert(strAdjustMaskWithGaussianBlur);
		
		// Apply Gaussian Blur to duplicate image for Wide and Medium mask widths
		switch (maskWidth) {
			case maskWidthExtraNarrow: break;
			case      maskWidthNarrow: break;
			case      maskWidthMedium: dupRef.activeLayer.applyGaussianBlur(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyGaussianBlur(3.0);		
		}
		
		// Run the Find Edges filter
		applyFindEdges();

		// Invert layer
		dupRef.activeLayer.invert();
		
		if (expertMode == true) alert(strAdjustMaskWithCurves);
		
		// Make Curves adjustment to the layer
		var curvesShape = new Array(Array(0,0),
									Array(40,150),
									Array(100,215),
									Array(150,230),
									Array(255,255));
		dupRef.activeLayer.adjustCurves(curvesShape);
	
		if ((expertMode == true) && (maskWidth != maskWidthExtraNarrow) && (maskWidth != maskWidthNarrow)) alert(strAdjustMaskWithMaximum);
					
		// Apply Maximum filter
		switch (maskWidth) {
			case maskWidthExtraNarrow: break;
			case      maskWidthNarrow: break;
			case      maskWidthMedium: dupRef.activeLayer.applyMaximum(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyMaximum(2.0);		
		}
	
		if ((expertMode == true) && (maskWidth != maskWidthExtraNarrow) && (maskWidth != maskWidthNarrow)) alert(strAdjustMaskWithMedian);
					
		// Apply Median filter
		switch (maskWidth) {
			case maskWidthExtraNarrow: break;
			case      maskWidthNarrow: break;
			case      maskWidthMedium: dupRef.activeLayer.applyMedianNoise(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyMedianNoise(2.0);		
		}
	
		if (expertMode == true) alert(strAdjustMaskWithGaussianBlur);
		
		// Apply Gaussian Blur filter
		switch (maskWidth) {
			case maskWidthExtraNarrow: dupRef.activeLayer.applyGaussianBlur(0.2); break;
			case      maskWidthNarrow: dupRef.activeLayer.applyGaussianBlur(0.6); break;
			case      maskWidthMedium: dupRef.activeLayer.applyGaussianBlur(1.2); break;
			case        maskWidthWide: dupRef.activeLayer.applyGaussianBlur(2.4);		
		}

		// Turn Off Dialogs, If Expert Mode
		if (expertMode == true) app.displayDialogs = DialogModes.NO;
		
		// Apply AutoLevels to Mask
		dupRef.activeLayer.autoLevels();

		// Invert layer
		dupRef.activeLayer.invert();
		
		// Duplicate channel and rename
		dupRef.activeChannels[0].duplicate(dupRef);
		switch (maskWidth) {
			case maskWidthExtraNarrow: dupRef.activeChannels[0].name = maskLuminositySurfaceExtraNarrow; break;
			case      maskWidthNarrow: dupRef.activeChannels[0].name = maskLuminositySurfaceNarrow; break;
			case      maskWidthMedium: dupRef.activeChannels[0].name = maskLuminositySurfaceMedium; break;
			case        maskWidthWide: dupRef.activeChannels[0].name = maskLuminositySurfaceWide;		
		}
		
		// Duplicate channel to original document
		dupRef.activeChannels[0].duplicate(docRef);
		
		// Close duplicate
		dupRef.close(SaveOptions.DONOTSAVECHANGES);		
		
		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Refresh app
		app.refresh();

		// Restore Channels palette
		docRef.activeChannels = docRef.componentChannels;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function generateEnhancedSurfaceMask(paramArray)
{
	var moduleName = 'generateEnhancedSurfaceMask';

	try
	{
		var docRef = app.activeDocument;
	
		var maskWidth = paramArray[1];
		var expertMode = paramArray[5];
		var retainSurfaceMask = paramArray[7];
		
		// Check for existing mask
		switch (maskWidth) {
			case maskWidthExtraNarrow: if (checkMaskExists(maskEnhancedSurfaceExtraNarrow)) {paramArray[7] = true; return;} break;
			case      maskWidthNarrow: if (checkMaskExists(maskEnhancedSurfaceNarrow)) {paramArray[7] = true; return;} break;
			case      maskWidthMedium: if (checkMaskExists(maskEnhancedSurfaceMedium)) {paramArray[7] = true; return;} break;
			case        maskWidthWide: if (checkMaskExists(maskEnhancedSurfaceWide)) {paramArray[7] = true; return;}		
		}

		generateSurfaceMask(paramArray);

		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Make a duplicate of the current document
		var dupRef = docRef.duplicate();
		
		// Set properties for duplicate to conserve resources
		dupRef.name = 'Duplicate';
		dupRef.bitsPerChannel = BitsPerChannelType.EIGHT;
		dupRef.flatten();
		
		// Make a new Merge Visible layer
		mergeAllVisible();
		
		// Set properties for new layer
		setLayerProperties('Color', 'Gray');
	
		// Duplicate active layer
		// Internationalized version
		dupRef.activeLayer.copy();
		dupRef.paste();
		setLayerProperties('Color copy', 'Gray');
		
		// Select "Color" layer
		dupRef.activeLayer = dupRef.layers['Color'];
		
		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Select All
		dupRef.selection.selectAll();
	
		// Store Foreground Color
		foregroundColor = app.foregroundColor;
	
		// Set Foreground Color to 50% Gray
		var colorRef = new SolidColor();
		var gray50 = new GrayColor();
		gray50.gray = 50;
		colorRef.gray = gray50;
		app.foregroundColor = colorRef;
	
		// Fill Layer with Foreground Color
		dupRef.selection.fill(colorRef);	
	
		// Reset Color Swatches
		app.foregroundColor = foregroundColor;
	
		// Select "Color copy" layer
		dupRef.activeLayer = dupRef.layers['Color copy'];
	
		// Set Blend Mode to Color
		dupRef.activeLayer.blendMode = BlendMode.COLORBLEND;
		
		// Merge Layers
		dupRef.activeLayer.merge();
	
		// Duplicate active layer
		// Internationalized version
		dupRef.activeLayer.copy();
		dupRef.paste();
		setLayerProperties('Color copy', 'Gray');
	
		// Select "Color copy" layer
		dupRef.activeLayer = dupRef.layers['Color copy'];
	
		// Set Blend Mode to Luminosity
		dupRef.activeLayer.blendMode = BlendMode.LUMINOSITY;
	
		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Turn On Dialogs, If Expert Mode
		if (expertMode == true) app.displayDialogs = DialogModes.ALL;
		
		if (expertMode == true) alert(strAdjustMaskWithGaussianBlur);
		
		// Apply Gaussian Blur to duplicate image for Wide and Medium mask widths
		switch (maskWidth) {
			case maskWidthExtraNarrow: break;
			case      maskWidthNarrow: break;
			case      maskWidthMedium: dupRef.activeLayer.applyGaussianBlur(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyGaussianBlur(3.0);		
		}
		
		// Run the Find Edges filter
		applyFindEdges();
	
		// Invert layer
		dupRef.activeLayer.invert();
	
		// Set Blend Mode to Normal
		dupRef.activeLayer.blendMode = BlendMode.NORMAL;
	
		// Desaturate
		dupRef.activeLayer.desaturate();
	
		if (expertMode == true) alert(strAdjustMaskWithCurves);
	
		// Make Curves adjustment to the layer
		var curvesShape = new Array(Array(0,0),
									Array(20,50),
									Array(70,90),
									Array(255,255));
		dupRef.activeLayer.adjustCurves(curvesShape);
	
		if ((expertMode == true) && (maskWidth != maskWidthExtraNarrow) && (maskWidth != maskWidthNarrow)) alert(strAdjustMaskWithMaximum);
					
		// Apply Maximum filter
		switch (maskWidth) {
			case maskWidthExtraNarrow: break;
			case      maskWidthNarrow: break;
			case      maskWidthMedium: dupRef.activeLayer.applyMaximum(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyMaximum(2.0);		
		}
	
		if ((expertMode == true) && (maskWidth != maskWidthExtraNarrow) && (maskWidth != maskWidthNarrow)) alert(strAdjustMaskWithMedian);
					
		// Apply Median filter
		switch (maskWidth) {
			case maskWidthExtraNarrow: break;
			case      maskWidthNarrow: break;
			case      maskWidthMedium: dupRef.activeLayer.applyMedianNoise(1.0); break;
			case        maskWidthWide: dupRef.activeLayer.applyMedianNoise(2.0);		
		}
		
		// Apply Gaussian Blur filter
		switch (maskWidth) {
			case maskWidthExtraNarrow: dupRef.activeLayer.applyGaussianBlur(0.2); break;
			case      maskWidthNarrow: dupRef.activeLayer.applyGaussianBlur(0.6); break;
			case      maskWidthMedium: dupRef.activeLayer.applyGaussianBlur(1.2); break;
			case        maskWidthWide: dupRef.activeLayer.applyGaussianBlur(2.4);		
		}
	
		// Turn Off Dialogs
		app.displayDialogs = DialogModes.NO;
	
		// Merge Layers
		dupRef.activeLayer.merge();

		// Invert layer
		dupRef.activeLayer.invert();
		
		// Convert to grayscale
		dupRef.changeMode(ChangeMode.GRAYSCALE);
		
		// Copy layer to alpha channel
		dupRef.activeChannels[0].duplicate(dupRef);
		dupRef.activeChannels[0].name = 'Color Surface Mask';
		
		// Duplicate channel to original document
		dupRef.activeChannels[0].duplicate(docRef);
		
		// Close duplicate
		dupRef.close(SaveOptions.DONOTSAVECHANGES);
		
		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Name for Luminosity Surface mask
		switch (maskWidth) {
			case maskWidthExtraNarrow: luminosityChannelName = maskLuminositySurfaceExtraNarrow; break;
			case      maskWidthNarrow: luminosityChannelName = maskLuminositySurfaceNarrow; break;
			case      maskWidthMedium: luminosityChannelName = maskLuminositySurfaceMedium; break;
			case        maskWidthWide: luminosityChannelName = maskLuminositySurfaceWide;		
		}

		// Combine channels using Calculations
		// =======================================================
		var id276 = charIDToTypeID( "Mk  " );
	    var desc81 = new ActionDescriptor();
	    var id277 = charIDToTypeID( "Nw  " );
 	    var id278 = charIDToTypeID( "Chnl" );
  	  		desc81.putClass( id277, id278 );
    	var id279 = charIDToTypeID( "Usng" );
        var desc82 = new ActionDescriptor();
        var id280 = charIDToTypeID( "T   " );
        var ref55 = new ActionReference();
        var id281 = charIDToTypeID( "Chnl" );
            ref55.putName( id281, luminosityChannelName );
        	desc82.putReference( id280, ref55 );
        var id282 = charIDToTypeID( "Clcl" );
        var id283 = charIDToTypeID( "Clcn" );
        var id284 = charIDToTypeID( "Mltp" );
        	desc82.putEnumerated( id282, id283, id284 );
        var id285 = charIDToTypeID( "Src2" );
        var ref56 = new ActionReference();
        var id286 = charIDToTypeID( "Chnl" );
            ref56.putName( id286, "Color Surface Mask" );
        	desc82.putReference( id285, ref56 );
    	var id287 = charIDToTypeID( "Clcl" );
    		desc81.putObject( id279, id287, desc82 );
		executeAction( id276, desc81, DialogModes.NO );
		// =======================================================

		// Rename channel
		switch (maskWidth) {
			case maskWidthExtraNarrow: docRef.activeChannels[0].name = maskEnhancedSurfaceExtraNarrow; break;
			case      maskWidthNarrow: docRef.activeChannels[0].name = maskEnhancedSurfaceNarrow; break;
			case      maskWidthMedium: docRef.activeChannels[0].name = maskEnhancedSurfaceMedium; break;
			case        maskWidthWide: docRef.activeChannels[0].name = maskEnhancedSurfaceWide;		
		}

		// Delete temporary masks
		if (paramArray[7] == false) {
			maskChannel = docRef.channels.getByName(luminosityChannelName);
			maskChannel.remove();
		}
		maskChannel = docRef.channels.getByName('Color Surface Mask');
		maskChannel.remove();
		
		// Release RAM;
		app.purge(PurgeTarget.ALLCACHES);

		// Refresh app
		app.refresh();

		// Restore Channels palette
		docRef.activeChannels = docRef.componentChannels;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function generateToneRangeMask(paramArray)
{
	var moduleName = 'generateColorRangeMask';

	try
	{
		var docRef = app.activeDocument;
	
		var toneRange = paramArray[2];
		var expertMode = paramArray[5];
		var retainToneMask = paramArray[8];

		// Check for existing mask
		if (checkMaskExists(toneRange + ' Mask')) {paramArray[8] = true; return;}
		else {paramArray[8] = false};
		
		// Invoke function to run Color Range command for desired color range
		switch (toneRange) {
			case toneRangeHighlights: selectHighlights(); break;
			case toneRangeMidtones: selectMidtones(); break;
			case toneRangeShadows: selectShadows(); 
		}
		
		// Save selection as a channel
		newChannel = docRef.channels.add();
		newChannel.kind = ChannelType.MASKEDAREA;
		newChannel.name = toneRange + ' Mask';
		docRef.selection.store(newChannel);
		docRef.selection.deselect();

		// Restore Channels palette
		docRef.activeChannels = docRef.componentChannels;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function generateColorRangeMask(paramArray)
{
	var moduleName = 'generateColorRangeMask';

	try
	{
		var docRef = app.activeDocument;
	
		var colorRange = paramArray[3];
		var expertMode = paramArray[5];
		var retainColorMask = paramArray[9];

		// Check for existing mask
		if (checkMaskExists(colorRange + ' Mask')) {paramArray[9] = true; return;}
		else {paramArray[9] = false};
				
		// Invoke function to run Color Range command for desired color range
		switch (colorRange) {
			case colorRangeReds: selectReds(); break;
			case colorRangeGreens: selectGreens(); break;
			case colorRangeBlues: selectBlues(); break;
			case colorRangeCyans: selectCyans(); break;		
			case colorRangeMagentas: selectMagentas(); break;		
			case colorRangeYellows: selectYellows(); break;		
			case colorRangeFoilage: selectFoilage(); break;		
			case colorRangeSkintones: selectSkintones(); break;		
			case colorRangeSky: selectSkies(); 
		}
		
		// Save selection as a channel
		newChannel = docRef.channels.add();
		newChannel.kind = ChannelType.MASKEDAREA;
		newChannel.name = colorRange + ' Mask';
		docRef.selection.store(newChannel);
		docRef.selection.deselect();
		
		// Restore Channels palette
		docRef.activeChannels = docRef.componentChannels;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function mergeMasks(paramArray)
{
	var moduleName = 'mergeMasks';

	try
	{
		var docRef = app.activeDocument;

		var maskType = paramArray[0];
		var toneRange = paramArray[2];
		var colorRange = paramArray[3];
		var enhancedMask = paramArray[4];

		// To get to this point, we must have to merge at least two layers
		if (maskType == maskTypeAll) {
			 mergeToneAndColorMasks(paramArray);
			 return;
		}
		
		// This merge will be merged with at least one other mask
		if ((toneRange != toneRangeAll) && (colorRange != colorRangeAll)) {
			mergeToneAndColorMasks(paramArray);
			switch (maskType) {
				case maskTypeEdge   : mergeEdgeAndBothMasks(paramArray); break;
				case maskTypeSurface: mergeSurfaceAndBothMasks(paramArray); break;
				case maskTypeBoth   : mergeEdgeAndBothMasks(paramArray); mergeSurfaceAndBothMasks(paramArray);
			}
		}
		
		if ((toneRange == 'All') && (colorRange != 'All')) {
			switch (maskType) {
				case maskTypeEdge   : mergeEdgeAndColorMasks(paramArray); break;
				case maskTypeSurface: mergeSurfaceAndColorMasks(paramArray); break;
				case maskTypeBoth   : mergeEdgeAndColorMasks(paramArray); mergeSurfaceAndColorMasks(paramArray);
			}
		}
		
		if ((toneRange != 'All') && (colorRange == 'All')) {
			switch (maskType) {
				case maskTypeEdge   : mergeEdgeAndToneMasks(paramArray); break;
				case maskTypeSurface: mergeSurfaceAndToneMasks(paramArray); break;
				case maskTypeBoth   : mergeEdgeAndToneMasks(paramArray); mergeSurfaceAndToneMasks(paramArray);
			}
		}			
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}

function mergeToneAndColorMasks(paramArray)
{
	var moduleName = 'mergeToneAndColorMasks';

	try
	{   
		var docRef = app.activeDocument;

		var maskType = paramArray[0];
		var maskWidth = paramArray[1];
		var toneRange = paramArray[2];
		var colorRange = paramArray[3];
		var enhancedMask = paramArray[4];
		var expertMode = paramArray[5];
		var retainToneMask = paramArray[8];
		var retainColorMask = paramArray[9];
		
		// Combine tone range and color range masks	
		toneMaskName = toneRange + ' Mask';
		colorMaskName = colorRange + ' Mask';

		// Check for existing mask
		if (checkMaskExists(toneRange + ' + ' + colorRange + ' Mask') == false) {
			
			// Use Calculations to combine masks
			// =======================================================
			var id474 = charIDToTypeID( "Mk  " );
			var desc139 = new ActionDescriptor();
			var id475 = charIDToTypeID( "Nw  " );
			var id476 = charIDToTypeID( "Chnl" );
				desc139.putClass( id475, id476 );
			var id477 = charIDToTypeID( "Usng" );
			var desc140 = new ActionDescriptor();
			var id478 = charIDToTypeID( "T   " );
			var ref95 = new ActionReference();
			var id479 = charIDToTypeID( "Chnl" );
				ref95.putName( id479, toneMaskName );
				desc140.putReference( id478, ref95 );
			var id480 = charIDToTypeID( "Clcl" );
			var id481 = charIDToTypeID( "Clcn" );
			var id482 = charIDToTypeID( "Mltp" );
				desc140.putEnumerated( id480, id481, id482 );
			var id483 = charIDToTypeID( "Src2" );
			var ref96 = new ActionReference();
			var id484 = charIDToTypeID( "Chnl" );
				ref96.putName( id484, colorMaskName );
				desc140.putReference( id483, ref96 );
			var id485 = charIDToTypeID( "Clcl" );
				desc139.putObject( id477, id485, desc140 );
			executeAction( id474, desc139, DialogModes.NO );
			// =======================================================
	
			// Rename channel
			docRef.activeChannels[0].name = toneRange + ' + ' + colorRange + ' Mask';

		}
		else {paramArray[10] = true;}
		
		// Delete temporary masks
		if (retainToneMask == false) {
			maskChannel = docRef.channels.getByName(toneMaskName);
			maskChannel.remove();
		}
		if (retainColorMask == false) {
			maskChannel = docRef.channels.getByName(colorMaskName);
			maskChannel.remove();
		}
			
		// Restore Channels palette
		docRef.activeChannels = docRef.componentChannels;	
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function mergeEdgeAndColorMasks(paramArray)
{
	var moduleName = 'mergeEdgeAndColorMasks';
	
	try
	{
		var docRef = app.activeDocument;

		var maskType = paramArray[0];
		var maskWidth = paramArray[1];
		var toneRange = paramArray[2];
		var colorRange = paramArray[3];
		var enhancedMask = paramArray[4];
		var expertMode = paramArray[5];
		var retainEdgeMask = paramArray[6];
		var retainColorMask = paramArray[9];

		// Combine edge and color range masks
		if (enhancedMask == false) {
			switch (maskWidth) {
				case maskWidthExtraNarrow: edgeMaskName = maskLuminosityEdgeExtraNarrow; break;
				case      maskWidthNarrow: edgeMaskName = maskLuminosityEdgeNarrow; break;
				case      maskWidthMedium: edgeMaskName = maskLuminosityEdgeMedium; break;
				case        maskWidthWide: edgeMaskName = maskLuminosityEdgeWide;
			}		
		}
		else {
			switch (maskWidth) {
				case maskWidthExtraNarrow: edgeMaskName = maskEnhancedEdgeExtraNarrow; break;
				case      maskWidthNarrow: edgeMaskName = maskEnhancedEdgeNarrow; break;
				case      maskWidthMedium: edgeMaskName = maskEnhancedEdgeMedium; break;
				case        maskWidthWide: edgeMaskName = maskEnhancedEdgeWide;
			}		
		}
		colorMaskName = colorRange + ' Mask';
		
		// Check for existing mask
		if (checkMaskExists(colorRange + ' ' + edgeMaskName + ' Mask') == false) {
		
			// Use Calculations to combine masks
			// =======================================================
			var id474 = charIDToTypeID( "Mk  " );
			var desc139 = new ActionDescriptor();
			var id475 = charIDToTypeID( "Nw  " );
			var id476 = charIDToTypeID( "Chnl" );
				desc139.putClass( id475, id476 );
			var id477 = charIDToTypeID( "Usng" );
			var desc140 = new ActionDescriptor();
			var id478 = charIDToTypeID( "T   " );
			var ref95 = new ActionReference();
			var id479 = charIDToTypeID( "Chnl" );
				ref95.putName( id479, edgeMaskName );
				desc140.putReference( id478, ref95 );
			var id480 = charIDToTypeID( "Clcl" );
			var id481 = charIDToTypeID( "Clcn" );
			var id482 = charIDToTypeID( "Mltp" );
				desc140.putEnumerated( id480, id481, id482 );
			var id483 = charIDToTypeID( "Src2" );
			var ref96 = new ActionReference();
			var id484 = charIDToTypeID( "Chnl" );
				ref96.putName( id484, colorMaskName );
				desc140.putReference( id483, ref96 );
			var id485 = charIDToTypeID( "Clcl" );
				desc139.putObject( id477, id485, desc140 );
			executeAction( id474, desc139, DialogModes.NO );
			// =======================================================
	
			// Rename channel
			docRef.activeChannels[0].name = colorRange + ' ' + edgeMaskName + ' Mask';
			
		}

		// Delete temporary masks
		if (retainColorMask == false) {
			maskChannel = docRef.channels.getByName(colorMaskName);
			maskChannel.remove();
		}
		if (retainEdgeMask == false) {
			maskChannel = docRef.channels.getByName(edgeMaskName);
			maskChannel.remove();
		}
		
		// Deselect
		docRef.selection.deselect();

		// Restore Channels palette
		docRef.activeChannels = docRef.componentChannels;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function mergeSurfaceAndColorMasks(paramArray)
{
	var moduleName = 'mergeSurfaceAndColorMasks';

	try
	{
		var docRef = app.activeDocument;

		var maskType = paramArray[0];
		var maskWidth = paramArray[1];
		var toneRange = paramArray[2];
		var colorRange = paramArray[3];
		var enhancedMask = paramArray[4];
		var expertMode = paramArray[5];
		var retainSurfaceMask = paramArray[7];
		var retainColorMask = paramArray[9];

		// Combine surface and color range masks
		// Combine edge and color range masks
		if (enhancedMask == false) {
			switch (maskWidth) {
				case maskWidthExtraNarrow: surfaceMaskName = maskLuminositySurfaceExtraNarrow; break;
				case      maskWidthNarrow: surfaceMaskName = maskLuminositySurfaceNarrow; break;
				case      maskWidthMedium: surfaceMaskName = maskLuminositySurfaceMedium; break;
				case        maskWidthWide: surfaceMaskName = maskLuminositySurfaceWide;
			}		
		}
		else {
			switch (maskWidth) {
				case maskWidthExtraNarrow: surfaceMaskName = maskEnhancedSurfaceExtraNarrow; break;
				case      maskWidthNarrow: surfaceMaskName = maskEnhancedSurfaceNarrow; break;
				case      maskWidthMedium: surfaceMaskName = maskEnhancedSurfaceMedium; break;
				case        maskWidthWide: surfaceMaskName = maskEnhancedSurfaceWide;
			}		
		}
		colorMaskName = colorRange + ' Mask';
		
		// Check for existing mask
		if (checkMaskExists(colorRange + ' ' + surfaceMaskName + ' Mask') == false) {
		
			// Use Calculations to combine masks
			// =======================================================
			var id474 = charIDToTypeID( "Mk  " );
			var desc139 = new ActionDescriptor();
			var id475 = charIDToTypeID( "Nw  " );
			var id476 = charIDToTypeID( "Chnl" );
				desc139.putClass( id475, id476 );
			var id477 = charIDToTypeID( "Usng" );
			var desc140 = new ActionDescriptor();
			var id478 = charIDToTypeID( "T   " );
			var ref95 = new ActionReference();
			var id479 = charIDToTypeID( "Chnl" );
				ref95.putName( id479, surfaceMaskName );
				desc140.putReference( id478, ref95 );
			var id480 = charIDToTypeID( "Clcl" );
			var id481 = charIDToTypeID( "Clcn" );
			var id482 = charIDToTypeID( "Mltp" );
				desc140.putEnumerated( id480, id481, id482 );
			var id483 = charIDToTypeID( "Src2" );
			var ref96 = new ActionReference();
			var id484 = charIDToTypeID( "Chnl" );
				ref96.putName( id484, colorMaskName );
				desc140.putReference( id483, ref96 );
			var id485 = charIDToTypeID( "Clcl" );
				desc139.putObject( id477, id485, desc140 );
			executeAction( id474, desc139, DialogModes.NO );
			// =======================================================
	
			// Rename channel
			docRef.activeChannels[0].name = colorRange + ' ' + surfaceMaskName + ' Mask';

		}
		
		// Delete temporary masks
		if (retainColorMask == false) {
			maskChannel = docRef.channels.getByName(colorMaskName);
			maskChannel.remove();
		}
		if (retainSurfaceMask == false) {
			maskChannel = docRef.channels.getByName(surfaceMaskName);
			maskChannel.remove();
		}

		// Deselect
		docRef.selection.deselect();

		// Restore Channels palette
		docRef.activeChannels = docRef.componentChannels;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function mergeEdgeAndToneMasks(paramArray)
{
	var moduleName = 'mergeEdgeAndToneMasks';

	try
	{
		var docRef = app.activeDocument;

		var maskType = paramArray[0];
		var maskWidth = paramArray[1];
		var toneRange = paramArray[2];
		var colorRange = paramArray[3];
		var enhancedMask = paramArray[4];
		var expertMode = paramArray[5];
		var retainEdgeMask = paramArray[6];
		var retainToneMask = paramArray[8];
		
		// Combine edge and color range masks
		if (enhancedMask == false) {
			switch (maskWidth) {
				case maskWidthExtraNarrow: edgeMaskName = maskLuminosityEdgeExtraNarrow; break;
				case      maskWidthNarrow: edgeMaskName = maskLuminosityEdgeNarrow; break;
				case      maskWidthMedium: edgeMaskName = maskLuminosityEdgeMedium; break;
				case        maskWidthWide: edgeMaskName = maskLuminosityEdgeWide;
			}		
		}
		else {
			switch (maskWidth) {
				case maskWidthExtraNarrow: edgeMaskName = maskEnhancedEdgeExtraNarrow; break;
				case      maskWidthNarrow: edgeMaskName = maskEnhancedEdgeNarrow; break;
				case      maskWidthMedium: edgeMaskName = maskEnhancedEdgeMedium; break;
				case        maskWidthWide: edgeMaskName = maskEnhancedEdgeWide;
			}		
		}
		toneMaskName = toneRange + ' Mask';
			
		// Check for existing mask
		if (checkMaskExists(toneRange + ' ' + edgeMaskName + ' Mask') == false) {
		
			// Use Calculations to combine masks
			// =======================================================
			var id474 = charIDToTypeID( "Mk  " );
			var desc139 = new ActionDescriptor();
			var id475 = charIDToTypeID( "Nw  " );
			var id476 = charIDToTypeID( "Chnl" );
				desc139.putClass( id475, id476 );
			var id477 = charIDToTypeID( "Usng" );
			var desc140 = new ActionDescriptor();
			var id478 = charIDToTypeID( "T   " );
			var ref95 = new ActionReference();
			var id479 = charIDToTypeID( "Chnl" );
				ref95.putName( id479, edgeMaskName );
				desc140.putReference( id478, ref95 );
			var id480 = charIDToTypeID( "Clcl" );
			var id481 = charIDToTypeID( "Clcn" );
			var id482 = charIDToTypeID( "Mltp" );
				desc140.putEnumerated( id480, id481, id482 );
			var id483 = charIDToTypeID( "Src2" );
			var ref96 = new ActionReference();
			var id484 = charIDToTypeID( "Chnl" );
				ref96.putName( id484, toneMaskName );
				desc140.putReference( id483, ref96 );
			var id485 = charIDToTypeID( "Clcl" );
				desc139.putObject( id477, id485, desc140 );
			executeAction( id474, desc139, DialogModes.NO );
			// =======================================================
	
			// Rename channel
			docRef.activeChannels[0].name = toneRange + ' ' + edgeMaskName + ' Mask';
			
		}
	
		// Delete temporary masks
		if (retainToneMask == false) {
			maskChannel = docRef.channels.getByName(toneMaskName);
			maskChannel.remove();
		}
		if (retainEdgeMask == false) {
			maskChannel = docRef.channels.getByName(edgeMaskName);
			maskChannel.remove();
		}

		// Restore Channels palette
		docRef.activeChannels = docRef.componentChannels;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function mergeSurfaceAndToneMasks(paramArray)
{
	var moduleName = 'mergeSurfaceAndToneMasks';

	try
	{
		var docRef = app.activeDocument;

		var maskType = paramArray[0];
		var maskWidth = paramArray[1];
		var toneRange = paramArray[2];
		var colorRange = paramArray[3];
		var enhancedMask = paramArray[4];
		var expertMode = paramArray[5];
		var retainSurfaceMask = paramArray[7];
		var retainToneMask = paramArray[8];

		// Combine surface and color range masks
		if (enhancedMask == false) {
			switch (maskWidth) {
				case maskWidthExtraNarrow: surfaceMaskName = maskLuminositySurfaceExtraNarrow; break;
				case      maskWidthNarrow: surfaceMaskName = maskLuminositySurfaceNarrow; break;
				case      maskWidthMedium: surfaceMaskName = maskLuminositySurfaceMedium; break;
				case        maskWidthWide: surfaceMaskName = maskLuminositySurfaceWide;
			}		
		}
		else {
			switch (maskWidth) {
				case maskWidthExtraNarrow: surfaceMaskName = maskEnhancedSurfaceExtraNarrow; break;
				case      maskWidthNarrow: surfaceMaskName = maskEnhancedSurfaceNarrow; break;
				case      maskWidthMedium: surfaceMaskName = maskEnhancedSurfaceMedium; break;
				case        maskWidthWide: surfaceMaskName = maskEnhancedSurfaceWide;
			}		
		}
		toneMaskName = toneRange + ' Mask';
		
		// Check for existing mask
		if (checkMaskExists(toneRange + ' ' + surfaceMaskName + ' Mask') == false) {
		
			// Use Calculations to combine masks
			// =======================================================
			var id474 = charIDToTypeID( "Mk  " );
			var desc139 = new ActionDescriptor();
			var id475 = charIDToTypeID( "Nw  " );
			var id476 = charIDToTypeID( "Chnl" );
				desc139.putClass( id475, id476 );
			var id477 = charIDToTypeID( "Usng" );
			var desc140 = new ActionDescriptor();
			var id478 = charIDToTypeID( "T   " );
			var ref95 = new ActionReference();
			var id479 = charIDToTypeID( "Chnl" );
				ref95.putName( id479, surfaceMaskName );
				desc140.putReference( id478, ref95 );
			var id480 = charIDToTypeID( "Clcl" );
			var id481 = charIDToTypeID( "Clcn" );
			var id482 = charIDToTypeID( "Mltp" );
				desc140.putEnumerated( id480, id481, id482 );
			var id483 = charIDToTypeID( "Src2" );
			var ref96 = new ActionReference();
			var id484 = charIDToTypeID( "Chnl" );
				ref96.putName( id484, toneMaskName );
				desc140.putReference( id483, ref96 );
			var id485 = charIDToTypeID( "Clcl" );
				desc139.putObject( id477, id485, desc140 );
			executeAction( id474, desc139, DialogModes.NO );
			// =======================================================
	
			// Rename channel
			docRef.activeChannels[0].name = toneRange + ' ' + surfaceMaskName + ' Mask';
			
		}

		// Delete temporary masks
		if (retainToneMask == false) {
			maskChannel = docRef.channels.getByName(toneMaskName);
			maskChannel.remove();
		}
		if (retainSurfaceMask == false) {
			maskChannel = docRef.channels.getByName(surfaceMaskName);
			maskChannel.remove();
		}

		// Deselect
		docRef.selection.deselect();

		// Restore Channels palette
		docRef.activeChannels = docRef.componentChannels;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function mergeEdgeAndBothMasks(paramArray)
{
	var moduleName = 'mergeEdgeAndBothMasks';

	try
	{
		var docRef = app.activeDocument;

		var maskType = paramArray[0];
		var maskWidth = paramArray[1];
		var toneRange = paramArray[2];
		var colorRange = paramArray[3];
		var enhancedMask = paramArray[4];
		var expertMode = paramArray[5];
		var retainEdgeMask = paramArray[6];
		var retainSurfaceMask = paramArray[7];
		var retainToneMask = paramArray[8];
		var retainColorMask = paramArray[9];
		var retainToneColorMask = paramArray[10];
		
		// Combine edge and color range masks
		if (enhancedMask == false) {
			switch (maskWidth) {
				case maskWidthExtraNarrow: edgeMaskName = maskLuminosityEdgeExtraNarrow; break;
				case      maskWidthNarrow: edgeMaskName = maskLuminosityEdgeNarrow; break;
				case      maskWidthMedium: edgeMaskName = maskLuminosityEdgeMedium; break;
				case        maskWidthWide: edgeMaskName = maskLuminosityEdgeWide;
			}		
		}
		else {
			switch (maskWidth) {
				case maskWidthExtraNarrow: edgeMaskName = maskEnhancedEdgeExtraNarrow; break;
				case      maskWidthNarrow: edgeMaskName = maskEnhancedEdgeNarrow; break;
				case      maskWidthMedium: edgeMaskName = maskEnhancedEdgeMedium; break;
				case        maskWidthWide: edgeMaskName = maskEnhancedEdgeWide;
			}		
		}
		bothMaskName = toneRange + ' + ' + colorRange + ' Mascara';
		
			
		// Check for existing mask
		if (checkMaskExists(colorRange + ' y ' + toneRange + ' ' + edgeMaskName + ' Mascara') == false) {
		
			// Use Calculations to combine masks
			// =======================================================
			var id474 = charIDToTypeID( "Mk  " );
			var desc139 = new ActionDescriptor();
			var id475 = charIDToTypeID( "Nw  " );
			var id476 = charIDToTypeID( "Chnl" );
				desc139.putClass( id475, id476 );
			var id477 = charIDToTypeID( "Usng" );
			var desc140 = new ActionDescriptor();
			var id478 = charIDToTypeID( "T   " );
			var ref95 = new ActionReference();
			var id479 = charIDToTypeID( "Chnl" );
				ref95.putName( id479, edgeMaskName );
				desc140.putReference( id478, ref95 );
			var id480 = charIDToTypeID( "Clcl" );
			var id481 = charIDToTypeID( "Clcn" );
			var id482 = charIDToTypeID( "Mltp" );
				desc140.putEnumerated( id480, id481, id482 );
			var id483 = charIDToTypeID( "Src2" );
			var ref96 = new ActionReference();
			var id484 = charIDToTypeID( "Chnl" );
				ref96.putName( id484, bothMaskName );
				desc140.putReference( id483, ref96 );
			var id485 = charIDToTypeID( "Clcl" );
				desc139.putObject( id477, id485, desc140 );
			executeAction( id474, desc139, DialogModes.NO );
			// =======================================================
	
			// Rename channel
			docRef.activeChannels[0].name = colorRange + ' and ' + toneRange + ' ' + edgeMaskName + ' Mask';

		}
		
		// Delete temporary masks
		if (retainToneColorMask == false) {
			maskChannel = docRef.channels.getByName(bothMaskName);
			maskChannel.remove();
		}
		if (retainEdgeMask == false) {
			maskChannel = docRef.channels.getByName(edgeMaskName);
			maskChannel.remove();
		}

		// Restore Channels palette
		docRef.activeChannels = docRef.componentChannels;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function mergeSurfaceAndBothMasks(paramArray)
{
	var moduleName = 'mergeSurfaceAndBothMasks';

	try
	{
		var docRef = app.activeDocument;

		var maskType = paramArray[0];
		var maskWidth = paramArray[1];
		var toneRange = paramArray[2];
		var colorRange = paramArray[3];
		var enhancedMask = paramArray[4];
		var expertMode = paramArray[5];
		var retainSurfaceMask = paramArray[7];
		var retainToneMask = paramArray[8];
		var retainColorMask = paramArray[9];
		var retainToneColorMask = paramArray[10];

		// Combine edge and color range masks
		if (enhancedMask == false) {
			switch (maskWidth) {
				case maskWidthExtraNarrow: surfaceMaskName = maskLuminositySurfaceExtraNarrow; break;
				case      maskWidthNarrow: surfaceMaskName = maskLuminositySurfaceNarrow; break;
				case      maskWidthMedium: surfaceMaskName = maskLuminositySurfaceMedium; break;
				case        maskWidthWide: surfaceMaskName = maskLuminositySurfaceWide;
			}		
		}
		else {
			switch (maskWidth) {
				case maskWidthExtraNarrow: surfaceMaskName = maskEnhancedSurfaceExtraNarrow; break;
				case      maskWidthNarrow: surfaceMaskName = maskEnhancedSurfaceNarrow; break;
				case      maskWidthMedium: surfaceMaskName = maskEnhancedSurfaceMedium; break;
				case        maskWidthWide: surfaceMaskName = maskEnhancedSurfaceWide;
			}		
		}
		bothMaskName = toneRange + ' + ' + colorRange + ' Mask';
			
		// Check for existing mask
		if (checkMaskExists(colorRange + ' and ' + toneRange + ' ' + surfaceMaskName + ' Mask') == false) {
		
			// Use Calculations to combine masks
			// =======================================================
			var id474 = charIDToTypeID( "Mk  " );
			var desc139 = new ActionDescriptor();
			var id475 = charIDToTypeID( "Nw  " );
			var id476 = charIDToTypeID( "Chnl" );
				desc139.putClass( id475, id476 );
			var id477 = charIDToTypeID( "Usng" );
			var desc140 = new ActionDescriptor();
			var id478 = charIDToTypeID( "T   " );
			var ref95 = new ActionReference();
			var id479 = charIDToTypeID( "Chnl" );
				ref95.putName( id479, surfaceMaskName );
				desc140.putReference( id478, ref95 );
			var id480 = charIDToTypeID( "Clcl" );
			var id481 = charIDToTypeID( "Clcn" );
			var id482 = charIDToTypeID( "Mltp" );
				desc140.putEnumerated( id480, id481, id482 );
			var id483 = charIDToTypeID( "Src2" );
			var ref96 = new ActionReference();
			var id484 = charIDToTypeID( "Chnl" );
				ref96.putName( id484, bothMaskName );
				desc140.putReference( id483, ref96 );
			var id485 = charIDToTypeID( "Clcl" );
				desc139.putObject( id477, id485, desc140 );
			executeAction( id474, desc139, DialogModes.NO );
			// =======================================================
	
			// Rename channel
			docRef.activeChannels[0].name = colorRange + ' and ' + toneRange + ' ' + surfaceMaskName + ' Mask';
			
		}

		// Delete temporary masks
		if (retainToneColorMask == false) {
			maskChannel = docRef.channels.getByName(bothMaskName);
			maskChannel.remove();
		}
		if (retainSurfaceMask == false) {
			maskChannel = docRef.channels.getByName(surfaceMaskName);
			maskChannel.remove();
		}

		// Restore Channels palette
		docRef.activeChannels = docRef.componentChannels;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function applyFindEdges()
{
	var moduleName = 'applyFindEdges';

	try
	{
		// Run the Find Edges filter
		// =======================================================
		var id123 = charIDToTypeID( "FndE" );
		executeAction( id123, undefined, DialogModes.NO );
		// =======================================================
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function convertLayerToChannel()
{
	var moduleName = 'applyConvertLayerToChannel';

	try
	{
		var id218 = charIDToTypeID( "Mk  " );
		var desc57 = new ActionDescriptor();
		var id219 = charIDToTypeID( "Nw  " );
		var id220 = charIDToTypeID( "Chnl" );
			desc57.putClass( id219, id220 );
		var id221 = charIDToTypeID( "Usng" );
		var desc58 = new ActionDescriptor();
		var id222 = charIDToTypeID( "T   " );
		var ref25 = new ActionReference();
		var id223 = charIDToTypeID( "Chnl" );
		var id224 = charIDToTypeID( "Chnl" );
		var id225 = charIDToTypeID( "Gry " );
			ref25.putEnumerated( id223, id224, id225 );
		var id226 = charIDToTypeID( "Lyr " );
		var id227 = charIDToTypeID( "Ordn" );
		var id228 = charIDToTypeID( "Mrgd" );
			ref25.putEnumerated( id226, id227, id228 );
			desc58.putReference( id222, ref25 );
		var id229 = charIDToTypeID( "Src2" );
		var ref26 = new ActionReference();
		var id230 = charIDToTypeID( "Chnl" );
		var id231 = charIDToTypeID( "Chnl" );
		var id232 = charIDToTypeID( "Gry " );
			ref26.putEnumerated( id230, id231, id232 );
			desc58.putReference( id229, ref26 );
		var id233 = charIDToTypeID( "Clcl" );
			desc57.putObject( id221, id233, desc58 );
		executeAction( id218, desc57, DialogModes.NO );
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function mergeAllVisible()
{
	var moduleName = 'applyMergeAllVisible';

	try {
		// =======================================================
		var id836 = charIDToTypeID( "Mk  " );
			var desc233 = new ActionDescriptor();
			var id837 = charIDToTypeID( "null" );
				var ref196 = new ActionReference();
				var id838 = charIDToTypeID( "Lyr " );
				ref196.putClass( id838 );
			desc233.putReference( id837, ref196 );
		executeAction( id836, desc233, DialogModes.NO );
		
		// =======================================================
		var id839 = charIDToTypeID( "MrgV" );
			var desc234 = new ActionDescriptor();
			var id840 = charIDToTypeID( "Dplc" );
			desc234.putBoolean( id840, true );
		executeAction( id839, desc234, DialogModes.NO );
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function selectHighlights()
{
	var moduleName = 'selectHighlights';

	try
	{
		var id119 = charIDToTypeID( "ClrR" );
    	var desc36 = new ActionDescriptor();
    	var id120 = charIDToTypeID( "Clrs" );
    	var id121 = charIDToTypeID( "Clrs" );
    	var id122 = charIDToTypeID( "Hghl" );
    		desc36.putEnumerated( id120, id121, id122 );
		executeAction( id119, desc36, DialogModes.NO );		
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}



function selectMidtones()
{
	var moduleName = 'selectMidtones';

	try
	{
		var id130 = charIDToTypeID( "ClrR" );
    	var desc38 = new ActionDescriptor();
    	var id131 = charIDToTypeID( "Clrs" );
    	var id132 = charIDToTypeID( "Clrs" );
    	var id133 = charIDToTypeID( "Mdtn" );
    		desc38.putEnumerated( id131, id132, id133 );
		executeAction( id130, desc38, DialogModes.NO );
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function selectShadows()
{
	var moduleName = 'selectShadows';

	try
	{
		var id141 = charIDToTypeID( "ClrR" );
    	var desc40 = new ActionDescriptor();
    	var id142 = charIDToTypeID( "Clrs" );
    	var id143 = charIDToTypeID( "Clrs" );
    	var id144 = charIDToTypeID( "Shdw" );
    		desc40.putEnumerated( id142, id143, id144 );
		executeAction( id141, desc40, DialogModes.NO );
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}
	
	
function selectReds()
{
	var moduleName = 'Select Reds';

	try
	{
		var id101 = charIDToTypeID( "ClrR" );
   		var desc30 = new ActionDescriptor();
    	var id102 = charIDToTypeID( "Clrs" );
    	var id103 = charIDToTypeID( "Clrs" );
    	var id104 = charIDToTypeID( "Rds " );
    		desc30.putEnumerated( id102, id103, id104 );
		executeAction( id101, desc30, DialogModes.NO );	
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}
	
	
function selectGreens()
{
	var moduleName = 'Select Greens';

	try
	{
		var id223 = charIDToTypeID( "ClrR" );
    	var desc54 = new ActionDescriptor();
    	var id224 = charIDToTypeID( "Fzns" );
    		desc54.putInteger( id224, 10 );
    	var id225 = charIDToTypeID( "Mnm " );
        var desc55 = new ActionDescriptor();
        var id226 = charIDToTypeID( "Lmnc" );
        	desc55.putDouble( id226, 30.280000 );
        var id227 = charIDToTypeID( "A   " );
        	desc55.putDouble( id227, -79.270000 );
        var id228 = charIDToTypeID( "B   " );
        	desc55.putDouble( id228, 14.340000 );
    	var id229 = charIDToTypeID( "LbCl" );
    		desc54.putObject( id225, id229, desc55 );
    	var id230 = charIDToTypeID( "Mxm " );
        var desc56 = new ActionDescriptor();
        var id231 = charIDToTypeID( "Lmnc" );
        	desc56.putDouble( id231, 87.820000 );
        var id232 = charIDToTypeID( "A   " );
        	desc56.putDouble( id232, -12.180000 );
        var id233 = charIDToTypeID( "B   " );
        	desc56.putDouble( id233, 80.990000 );
    	var id234 = charIDToTypeID( "LbCl" );
    		desc54.putObject( id230, id234, desc56 );
		executeAction( id223, desc54, DialogModes.NO );
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}	

	
function selectBlues()
{
	var moduleName = 'Select Blues';

	try
	{
		var id123 = charIDToTypeID( "ClrR" );
   		var desc34 = new ActionDescriptor();
    	var id124 = charIDToTypeID( "Clrs" );
    	var id125 = charIDToTypeID( "Clrs" );
    	var id126 = charIDToTypeID( "Bls " );
    		desc34.putEnumerated( id124, id125, id126 );
		executeAction( id123, desc34, DialogModes.NO );
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}

	
function selectCyans()
{
	var moduleName = 'Select Cyans';

	try
	{
		var id134 = charIDToTypeID( "ClrR" );
    	var desc36 = new ActionDescriptor();
    	var id135 = charIDToTypeID( "Clrs" );
    	var id136 = charIDToTypeID( "Clrs" );
    	var id137 = charIDToTypeID( "Cyns" );
    		desc36.putEnumerated( id135, id136, id137 );
		executeAction( id134, desc36, DialogModes.NO );
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}

	
function selectMagentas()
{
	var moduleName = 'Select Magentas';

	try
	{
		var id145 = charIDToTypeID( "ClrR" );
    	var desc38 = new ActionDescriptor();
    	var id146 = charIDToTypeID( "Clrs" );
    	var id147 = charIDToTypeID( "Clrs" );
    	var id148 = charIDToTypeID( "Mgnt" );
    		desc38.putEnumerated( id146, id147, id148 );
		executeAction( id145, desc38, DialogModes.NO );
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}

	
function selectYellows()
{
	var moduleName = 'Select Yellows';

	try
	{
		var id156 = charIDToTypeID( "ClrR" );
   		var desc40 = new ActionDescriptor();
    	var id157 = charIDToTypeID( "Clrs" );
    	var id158 = charIDToTypeID( "Clrs" );
    	var id159 = charIDToTypeID( "Ylws" );
    		desc40.putEnumerated( id157, id158, id159 );
		executeAction( id156, desc40, DialogModes.NO );
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}

	
function selectFoilage()
{
	var moduleName = 'Select Foilage';

	try
	{
		var id316 = charIDToTypeID( "ClrR" );
	    var desc71 = new ActionDescriptor();
	    var id317 = charIDToTypeID( "Fzns" );
	    	desc71.putInteger( id317, 10 );
	    var id318 = charIDToTypeID( "Mnm " );
        var desc72 = new ActionDescriptor();
        var id319 = charIDToTypeID( "Lmnc" );
        	desc72.putDouble( id319, 20.100000 );
        var id320 = charIDToTypeID( "A   " );
        	desc72.putDouble( id320, -42.700000 );
        var id321 = charIDToTypeID( "B   " );
        	desc72.putDouble( id321, -11.830000 );
    	var id322 = charIDToTypeID( "LbCl" );
    		desc71.putObject( id318, id322, desc72 );
    	var id323 = charIDToTypeID( "Mxm " );
        var desc73 = new ActionDescriptor();
        var id324 = charIDToTypeID( "Lmnc" );
        	desc73.putDouble( id324, 84.590000 );
        var id325 = charIDToTypeID( "A   " );
        	desc73.putDouble( id325, 0.430000 );
        var id326 = charIDToTypeID( "B   " );
        	desc73.putDouble( id326, 46.800000 );
    	var id327 = charIDToTypeID( "LbCl" );
    		desc71.putObject( id323, id327, desc73 );
		executeAction( id316, desc71, DialogModes.NO );
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}

	
function selectSkintones()
{
	var moduleName = 'Select Skintones';

	try 
	{
		var id245 = charIDToTypeID( "ClrR" );
    	var desc55 = new ActionDescriptor();
    	var id246 = charIDToTypeID( "Fzns" );
    		desc55.putInteger( id246, 10 );
    	var id247 = charIDToTypeID( "Mnm " );
        var desc56 = new ActionDescriptor();
        var id248 = charIDToTypeID( "Lmnc" );
        	desc56.putDouble( id248, 14.730000 );
        var id249 = charIDToTypeID( "A   " );
        	desc56.putDouble( id249, 3.590000 );
        var id250 = charIDToTypeID( "B   " );
        	desc56.putDouble( id250, -3.010000 );
    	var id251 = charIDToTypeID( "LbCl" );
    		desc55.putObject( id247, id251, desc56 );
    	var id252 = charIDToTypeID( "Mxm " );
        var desc57 = new ActionDescriptor();
        var id253 = charIDToTypeID( "Lmnc" );
        	desc57.putDouble( id253, 90.500000 );
        var id254 = charIDToTypeID( "A   " );
        	desc57.putDouble( id254, 33.270000 );
        var id255 = charIDToTypeID( "B   " );
        	desc57.putDouble( id255, 30.760000 );
    	var id256 = charIDToTypeID( "LbCl" );
    		desc55.putObject( id252, id256, desc57 );
		executeAction( id245, desc55, DialogModes.NO );
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}

	
function selectSkies()
{
	var moduleName = 'Select Skies';

	try 
	{
		var id689 = charIDToTypeID( "ClrR" );
    	var desc136 = new ActionDescriptor();
    	var id690 = charIDToTypeID( "Fzns" );
    		desc136.putInteger( id690, 10 );
    	var id691 = charIDToTypeID( "Mnm " );
        var desc137 = new ActionDescriptor();
        var id692 = charIDToTypeID( "Lmnc" );
        	desc137.putDouble( id692, 12.550000 );
        var id693 = charIDToTypeID( "A   " );
        	desc137.putDouble( id693, -45.770000 );
        var id694 = charIDToTypeID( "B   " );
        	desc137.putDouble( id694, -82.840000 );
    	var id695 = charIDToTypeID( "LbCl" );
    		desc136.putObject( id691, id695, desc137 );
    	var id696 = charIDToTypeID( "Mxm " );
        var desc138 = new ActionDescriptor();
        var id697 = charIDToTypeID( "Lmnc" );
        	desc138.putDouble( id697, 69.320000 );
        var id698 = charIDToTypeID( "A   " );
        	desc138.putDouble( id698, 42.910000 );
        var id699 = charIDToTypeID( "B   " );
        	desc138.putDouble( id699, -18.920000 );
    	var id700 = charIDToTypeID( "LbCl" );
    		desc136.putObject( id696, id700, desc138 );
		executeAction( id689, desc136, DialogModes.NO );
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function setLayerProperties(layerName, layerColor)
{
	colorCode = new String(layerColor);
	colorCode = colorCode.toUpperCase();
	var moduleName = 'setLayerProperties';

	try {
		// Code generated by ScriptListener
		// =======================================================
		var id50 = charIDToTypeID( "setd" );
			var desc17 = new ActionDescriptor();
			var id51 = charIDToTypeID( "null" );
				var ref1 = new ActionReference();
				var id52 = charIDToTypeID( "Lyr " );
				var id53 = charIDToTypeID( "Ordn" );
				var id54 = charIDToTypeID( "Trgt" );
				ref1.putEnumerated( id52, id53, id54 );
			desc17.putReference( id51, ref1 );
			var id55 = charIDToTypeID( "T   " );
				var desc18 = new ActionDescriptor();
				var id56 = charIDToTypeID( "Nm  " );
				desc18.putString( id56, layerName );
				var id57 = charIDToTypeID( "Clr " );
				var id58 = charIDToTypeID( "Clr " );
				switch (colorCode) {
					case 'RED': id59 = charIDToTypeID( "Rd  " ); break;
					case 'ORANGE': id59 = charIDToTypeID( "Orng" ); break;
					case 'YELLOW': id59 = charIDToTypeID( "Ylw " ); break;
					case 'GREEN': id59 = charIDToTypeID( "Grn " ); break;
					case 'BLUE': id59 = charIDToTypeID( "Bl  " ); break;
					case 'VIOLET': id59 = charIDToTypeID( "Vlt " ); break;
					case 'GRAY': id59 = charIDToTypeID( "Gry " ); break;
					 default: id59 = charIDToTypeID( "Clr " );
				}
				desc18.putEnumerated( id57, id58, id59 );
			var id60 = charIDToTypeID( "Lyr " );
			desc17.putObject( id55, id60, desc18 );
		executeAction( id50, desc17, DialogModes.NO );
		// =======================================================
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


function checkMaskExists(channelName)
{
	var moduleName = 'checkMaskExists';

	try {

		var docRef = app.activeDocument;

		bMaskExists = false;
		channelsRef = docRef.channels;
		
		for (var channelsIndex = 0; channelsIndex < channelsRef.length; channelsIndex++) {
			if (channelsRef[channelsIndex].name == channelName) {
				if (autoMaskReplace == true) {
					maskChannel = channelsRef.getByName(channelName);
					maskChannel.remove();
					bMaskExists = false;
				}
				else bMaskExists = true;
			}
		}
	
		return bMaskExists;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
		ui.close(0);
	}
}


//-------------------------------------------------------------------------------------------------------------------------------------------------------------

function checkAssumptions()
{
	var moduleName = 'checkAssumptions';

	try {		
		var docRef = app.activeDocument;

		if (app.documents.length == 0) {
			alert (strNoActiveDocument);
			return false;
		}
		
		// Check that there is a background layer
		var hasBackgroundLayer = false;
		for (var i = 0; i < docRef.artLayers.length; i++) {
			if (docRef.artLayers[i].isBackgroundLayer == true) hasBackgroundLayer = true;
		} 
		if (hasBackgroundLayer == false) {
			alert (strNoBackgroundLayer);
			return false;
		}
		
		// Check if Bitmap, Duotone, Multichannel
		if ((app.activeDocument.mode == DocumentMode.BITMAP) || (app.activeDocument.mode == DocumentMode.DUOTONE) ||
			(app.activeDocument.mode == DocumentMode.MULTICHANNEL) || (app.activeDocument.mode == DocumentMode.INDEXEDCOLOR)) {
			alert (strAllowedDocumentTypes);
			return false;
		}
		
		// Check if layer is inside a layer set/group
		var layerParentName = docRef.activeLayer.parent.name;
		if (layerParentName != docRef.name) {
			alert(strLayerInsideLayerSet);
			return false;
		}
						
		// Check if layer is an open layer set/group by creating a new layer and checking the parent
		// =======================================================
		var id259 = charIDToTypeID( "Mk  " );
			var desc66 = new ActionDescriptor();
			var id260 = charIDToTypeID( "null" );
				var ref44 = new ActionReference();
				var id261 = charIDToTypeID( "Lyr " );
				ref44.putClass( id261 );
			desc66.putReference( id260, ref44 );
		executeAction( id259, desc66, DialogModes.NO );
		// =======================================================
		layerParentName = docRef.activeLayer.parent.name;
		docRef.activeLayer.remove();
		if (layerParentName != docRef.name) {
			alert(strLayerIsLayerSet);
			return false;
		}		
		
		return true;
	}
	catch(someError)
	{
		alert(strErrorMsgPart1 +  moduleName + strErrorMsgPart2 + someError.description);
	}
}


//--------------------MAIN SCRIPT--------------------//

if (checkAssumptions() == true) {
	// Create the UI and initialize controls
	var ui = createUI();
	initializeUI(ui);

	// Display the UI (if appropriate) and wait for user interaction
	if (suppressUI == true) app.activeDocument.suspendHistory('TLR Professional Mask Toolkit for CS3','ui.btnPnl.OKBtn.notify();');
	else app.activeDocument.suspendHistory('TLR Professional Mask Toolkit for CS3','ui.show();');	
}